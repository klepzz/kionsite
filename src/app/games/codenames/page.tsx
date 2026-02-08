'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCcw, Wifi, Copy, Share2, Users, Crown, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { DataConnection } from 'peerjs';
import { codenamesWords, shuffleWords } from '../../../data/codenames-words';

// --- TİPLER ---

type Team = 'SETEJELER' | 'AVEKETLER';
type CardType = 'SETEJELER' | 'AVEKETLER' | 'NEUTRAL' | 'ASSASSIN';
type GamePhase = 'LOBBY' | 'PLAYING' | 'GAME_OVER';
type TurnPhase = 'CLUE' | 'GUESS';

interface Player {
    id: string;
    name: string;
    team: Team | null;
    role: 'SPYMASTER' | 'OPERATIVE' | null;
    isHost: boolean;
}

interface Card {
    id: number;
    word: string;
    type: CardType;
    revealed: boolean;
}

interface GameLog {
    id: string;
    text: string;
    type: 'INFO' | 'SUCCESS' | 'DANGER' | 'WARNING';
    timestamp: number;
}

interface GameState {
    phase: GamePhase;
    turnPhase: TurnPhase;
    cards: Card[];
    currentTurn: Team;
    winner: Team | null;
    players: Player[];
    currentClue: { word: string; number: number } | null;
    guessesRemaining: number;
    logs: GameLog[];
}

// --- SABİTLER ---

const TEAMS = {
    SETEJELER: {
        name: 'SETEJELER',
        color: 'from-orange-500 to-red-600',
        bg: 'bg-gradient-to-br from-orange-500/20 to-red-600/20',
        border: 'border-orange-500/50',
        text: 'text-orange-400',
        ring: 'ring-orange-500',
        winBg: 'bg-orange-950',
    },
    AVEKETLER: {
        name: 'AVEKETLER',
        color: 'from-blue-500 to-cyan-600',
        bg: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20',
        border: 'border-cyan-500/50',
        text: 'text-cyan-400',
        ring: 'ring-cyan-500',
        winBg: 'bg-slate-950',
    }
};

export default function CodenamesPage() {
    // --- STATE ---

    // Kimlik & Bağlantı
    const [myPeerId, setMyPeerId] = useState<string>('');
    const [myName, setMyName] = useState<string>('');
    const [isHost, setIsHost] = useState(false);
    const [status, setStatus] = useState<string>('Hazırlanıyor...');
    const [connectionError, setConnectionError] = useState<string | null>(null);

    // Oyun Durumu
    const [gameState, setGameState] = useState<GameState>({
        phase: 'LOBBY',
        turnPhase: 'CLUE',
        cards: [],
        currentTurn: 'SETEJELER',
        winner: null,
        players: [],
        currentClue: null,
        guessesRemaining: 0,
        logs: []
    });

    // PeerJS Referansları
    const peerRef = useRef<any>(null);
    const connectionsRef = useRef<DataConnection[]>([]); // Host için
    const hostConnRef = useRef<DataConnection | null>(null); // Guest için

    const searchParams = useSearchParams();
    const gameIdParam = searchParams.get('gameId');

    // --- BAŞLANGIÇ (INIT) ---

    useEffect(() => {
        const initGame = async () => {
            const { Peer } = await import('peerjs');
            const peer = new Peer();

            peer.on('open', (id) => {
                setMyPeerId(id);
                console.log('My Peer ID:', id);

                if (gameIdParam) {
                    // Guest Modu
                    setIsHost(false);
                    connectToHost(peer, gameIdParam);
                } else {
                    // Host Modu
                    setIsHost(true);
                    setStatus('Lobi Oluşturuldu');
                    // Kendimizi oyuncu listesine ekle
                    setGameState(prev => ({
                        ...prev,
                        players: [{ id: id, name: '', team: null, role: null, isHost: true }]
                    }));
                }
            });

            peer.on('connection', (conn) => {
                // Sadece Host bağlantı kabul eder
                handleConnection(conn);
            });

            peer.on('error', (err) => {
                console.error('Peer Error:', err);
                setConnectionError('Bağlantı hatası oluştu. Lütfen sayfayı yenileyin.');
            });

            peerRef.current = peer;
        };

        initGame();

        return () => {
            peerRef.current?.destroy();
        };
    }, [gameIdParam]);

    // --- HOST LOGIC ---

    const handleConnection = (conn: DataConnection) => {
        connectionsRef.current.push(conn);

        conn.on('open', () => {
            // Yeni gelen oyuncuya mevcut durumu gönder
            conn.send({ type: 'SYNC_STATE', payload: gameState });
        });

        conn.on('data', (data: any) => {
            handleDataFromClient(conn, data);
        });

        conn.on('close', () => {
            // Bağlantı kopunca oyuncuyu sil
            connectionsRef.current = connectionsRef.current.filter(c => c !== conn);
            setGameState(prev => {
                const newPlayers = prev.players.filter(p => p.id !== conn.peer);
                const newState = { ...prev, players: newPlayers };
                broadcastState(newState); // Herkese bildir
                return newState;
            });
        });
    };

    const handleDataFromClient = (conn: DataConnection, data: any) => {
        if (data.type === 'JOIN_REQUEST') {
            // Oyuncu ismini kaydet
            setGameState(prev => {
                const existing = prev.players.find(p => p.id === conn.peer);
                let newPlayers;
                if (existing) {
                    newPlayers = prev.players.map(p => p.id === conn.peer ? { ...p, name: data.name } : p);
                } else {
                    newPlayers = [...prev.players, { id: conn.peer, name: data.name, team: null, role: null, isHost: false }];
                }
                const newState = { ...prev, players: newPlayers };
                broadcastState(newState);
                return newState;
            });
        } else if (data.type === 'SELECT_TEAM') {
            updatePlayerTeam(conn.peer, data.team);
        } else if (data.type === 'SELECT_ROLE') {
            updatePlayerRole(conn.peer, data.role);
        } else if (data.type === 'GIVE_CLUE') {
            processClue(data.word, data.number);
        } else if (data.type === 'END_TURN') {
            passTurn();
        } else if (data.type === 'REVEAL_CARD') {
            processCardReveal(data.index);
        }
    };

    const updatePlayerRole = (playerId: string, role: 'SPYMASTER' | 'OPERATIVE') => {
        setGameState(prev => {
            let newPlayers = [...prev.players];
            const player = newPlayers.find(p => p.id === playerId);

            // Eğer Spymaster olunmak isteniyorsa, o takımdaki diğer Spymaster'ı Operative yap
            if (role === 'SPYMASTER' && player?.team) {
                newPlayers = newPlayers.map(p =>
                    (p.team === player.team && p.role === 'SPYMASTER' && p.id !== playerId) ? { ...p, role: 'OPERATIVE' } : p
                );
            }

            newPlayers = newPlayers.map(p => p.id === playerId ? { ...p, role } : p);

            const newState = { ...prev, players: newPlayers };
            broadcastState(newState);
            return newState;
        });
    };

    const updatePlayerTeam = (playerId: string, team: Team) => {
        setGameState(prev => {
            const newPlayers = prev.players.map(p => p.id === playerId ? { ...p, team } : p);
            const newState = { ...prev, players: newPlayers };
            broadcastState(newState);
            return newState;
        });
    };

    const broadcastState = (state: GameState) => {
        connectionsRef.current.forEach(conn => {
            if (conn.open) {
                conn.send({ type: 'SYNC_STATE', payload: state });
            }
        });
    };

    // --- GUEST LOGIC ---

    const connectToHost = (peer: any, hostId: string) => {
        setStatus('Sunucuya bağlanılıyor...');
        const conn = peer.connect(hostId);
        hostConnRef.current = conn;

        conn.on('open', () => {
            setStatus('Bağlandı! İsminizi girin.');
        });

        conn.on('data', (data: any) => {
            if (data.type === 'SYNC_STATE') {
                setGameState(data.payload);
            }
        });

        conn.on('close', () => {
            setStatus('Sunucu ile bağlantı koptu.');
            setConnectionError('Sunucu kapandı.');
        });
    };

    const sendToHost = (type: string, payload: any = {}) => {
        if (isHost) return; // Host kendine göndermez, direk işlemi yapar
        hostConnRef.current?.send({ type, ...payload });
    };

    // --- OYUN MANTIĞI (HOST) ---

    const startGame = () => {
        if (!isHost) return;

        // 1. Kelimeleri seç ve karıştır
        const selectedWords = shuffleWords(codenamesWords).slice(0, 25);

        // 2. Başlayan takımı seç
        const starter: Team = Math.random() > 0.5 ? 'SETEJELER' : 'AVEKETLER';

        // 3. Kart tiplerini belirle
        const types: CardType[] = [
            'ASSASSIN',
            ...Array(starter === 'SETEJELER' ? 9 : 8).fill('SETEJELER'),
            ...Array(starter === 'AVEKETLER' ? 9 : 8).fill('AVEKETLER'),
            ...Array(7).fill('NEUTRAL')
        ];
        const shuffledTypes = shuffleWords(types as string[]) as CardType[];

        // 4. Kartları oluştur
        const newCards: Card[] = selectedWords.map((word, i) => ({
            id: i,
            word,
            type: shuffledTypes[i],
            revealed: false
        }));

        const newState: GameState = {
            ...gameState,
            phase: 'PLAYING',
            cards: newCards,
            currentTurn: starter,
            winner: null
        };

        setGameState(newState);
        broadcastState(newState);
        addLog('Oyun Başladı! İyi şanslar.', 'INFO');
    };

    const addLog = (text: string, type: GameLog['type'] = 'INFO') => {
        setGameState(prev => {
            const newLog: GameLog = {
                id: Math.random().toString(36).substr(2, 9),
                text,
                type,
                timestamp: Date.now()
            };
            const newState = { ...prev, logs: [newLog, ...prev.logs].slice(0, 50) }; // Keep last 50
            broadcastState(newState); // Note: Calling broadcastState inside setState callback might be redundant if we broadcast newState returned from here, but here we are in a helper that might be called from within another setState or standalone. Be careful.
            // Actually, best to return newState and let caller broadcast if needed? 
            // BUT logs are often side effects. 
            // Let's make addLog standalone that does setGameState.
            return newState;
        });
    };

    const processClue = (word: string, number: number) => {
        setGameState(prev => {
            const newLog: GameLog = {
                id: Math.random().toString(36).substr(2, 9),
                text: `ANTALICI: "${word}" (${number})`,
                type: 'INFO',
                timestamp: Date.now()
            };

            const newState = {
                ...prev,
                turnPhase: 'GUESS' as TurnPhase,
                currentClue: { word, number },
                guessesRemaining: number + 1,
                logs: [newLog, ...prev.logs]
            };
            broadcastState(newState);
            return newState;
        });
    };

    const passTurn = () => {
        setGameState(prev => {
            const newTurn: Team = prev.currentTurn === 'SETEJELER' ? 'AVEKETLER' : 'SETEJELER';
            const newLog: GameLog = {
                id: Math.random().toString(36).substr(2, 9),
                text: `${prev.currentTurn} turu pas geçti.`,
                type: 'WARNING',
                timestamp: Date.now()
            };

            const newState = {
                ...prev,
                currentTurn: newTurn,
                turnPhase: 'CLUE' as TurnPhase,
                currentClue: null,
                guessesRemaining: 0,
                logs: [newLog, ...prev.logs]
            };
            broadcastState(newState);
            return newState;
        });
    };

    const processCardReveal = (index: number) => {
        const card = gameState.cards[index];
        if (card.revealed || gameState.winner) return;

        const newCards = [...gameState.cards];
        newCards[index].revealed = true;

        let newTurn: Team = gameState.currentTurn;
        let newWinner: Team | null = null;
        let newTurnChanged = false;

        if (card.type === 'ASSASSIN') {
            // Suikastçi
            newWinner = gameState.currentTurn === 'SETEJELER' ? 'AVEKETLER' : 'SETEJELER';
        } else if (card.type === 'NEUTRAL') {
            // Pasif
            newTurn = gameState.currentTurn === 'SETEJELER' ? 'AVEKETLER' : 'SETEJELER';
            newTurnChanged = true;
        } else if (card.type !== gameState.currentTurn) {
            // Rakip
            newTurn = gameState.currentTurn === 'SETEJELER' ? 'AVEKETLER' : 'SETEJELER';
            newTurnChanged = true;
        }

        // Tahmin hakkı
        let newGuessesRemaining = gameState.guessesRemaining;

        if (!newWinner && !newTurnChanged) {
            if (newGuessesRemaining > 0) {
                newGuessesRemaining--;
            }

            if (newGuessesRemaining === 0) {
                newTurn = newTurn === 'SETEJELER' ? 'AVEKETLER' : 'SETEJELER';
                newTurnChanged = true;
            }
        }

        // Kazanma
        if (!newWinner) {
            const setejelerLeft = newCards.filter(c => c.type === 'SETEJELER' && !c.revealed).length;
            const aveketlerLeft = newCards.filter(c => c.type === 'AVEKETLER' && !c.revealed).length;

            if (setejelerLeft === 0) newWinner = 'SETEJELER';
            if (aveketlerLeft === 0) newWinner = 'AVEKETLER';
        }

        const newState = {
            ...gameState,
            cards: newCards,
            currentTurn: newTurn,
            winner: newWinner,
            turnPhase: (newTurnChanged || newWinner ? 'CLUE' : 'GUESS') as TurnPhase,
            currentClue: (newTurnChanged || newWinner) ? null : gameState.currentClue,
            guessesRemaining: (newTurnChanged || newWinner) ? 0 : newGuessesRemaining
        };

        setGameState(newState);
        if (isHost) broadcastState(newState);
    };

    // --- ACTIONS ---

    const joinLobby = () => {
        if (!myName.trim()) return;
        if (isHost) {
            setGameState(prev => {
                const newPlayers = prev.players.map(p => p.id === myPeerId ? { ...p, name: myName } : p);
                const newState = { ...prev, players: newPlayers };
                broadcastState(newState);
                return newState;
            });
        } else {
            sendToHost('JOIN_REQUEST', { name: myName });
        }
    };

    const selectTeam = (team: Team) => {
        if (isHost) {
            updatePlayerTeam(myPeerId, team);
            // Takım değiştirince rolü sıfırla veya Operative yap
            updatePlayerRole(myPeerId, 'OPERATIVE');
        } else {
            sendToHost('SELECT_TEAM', { team });
            sendToHost('SELECT_ROLE', { role: 'OPERATIVE' });
        }
    };

    const selectRole = (role: 'SPYMASTER' | 'OPERATIVE') => {
        if (!myPlayer?.team) return;
        if (isHost) {
            updatePlayerRole(myPeerId, role);
        } else {
            sendToHost('SELECT_ROLE', { role });
        }
    };

    const handleCardClick = (index: number) => {
        if (gameState.phase !== 'PLAYING' || gameState.winner) return;

        // Sadece sırası gelen takımdaki oyuncular tıklayabilir mi?
        // Oyunun akıcılığı için herkes tıklayabilsin ama host'ta kontrol edilsin.
        // Daha sıkı kural: Sadece kendi turunda tıklayabilirsin.
        const myPlayer = gameState.players.find(p => p.id === myPeerId);
        if (!myPlayer || myPlayer.team !== gameState.currentTurn) {
            // Opsiyonel: Uyarı verilebilir "Sıra sizde değil"
            return;
        }

        if (isHost) {
            processCardReveal(index);
        } else {
            sendToHost('REVEAL_CARD', { index });
        }
    };

    const copyInviteLink = () => {
        const url = `${window.location.origin}/games/codenames?gameId=${myPeerId}`;
        navigator.clipboard.writeText(url);
        // Toast eklenebilir
    };

    // --- RENDER HELPERS ---

    const myPlayer = gameState.players.find(p => p.id === myPeerId);
    const setejelerPlayers = gameState.players.filter(p => p.team === 'SETEJELER');
    const aveketlerPlayers = gameState.players.filter(p => p.team === 'AVEKETLER');

    // --- LOBBY UI ---

    if (gameState.phase === 'LOBBY') {
        return (
            <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
                <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
                    <Link href="/games" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Çıkış
                    </Link>
                    <h1 className="font-cinzel text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500 tracking-widest drop-shadow-[0_2px_10px_rgba(251,191,36,0.2)]">
                        KION NAMES
                    </h1>
                    <div className="w-24" /> {/* Spacer */}
                </div>

                {/* Main Lobby Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8 max-w-6xl mx-auto w-full">

                    {/* Name Entry (Eğer isim yoksa) */}
                    {!myPlayer?.name ? (
                        // Host ilk girişte ismini henüz inputa yazmadıysa veya Guest henüz girmediyse
                        // Basitleştirme: Host default 'Host' ama değiştirebilir. Guest 'Guest' ama değiştirmeli.
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md backdrop-blur-xl"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-center">Oyuna Katıl</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Takma Adın</label>
                                    <input
                                        type="text"
                                        value={myName}
                                        onChange={(e) => setMyName(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                                        placeholder="Örn: Ajan 007"
                                    />
                                </div>
                                <button
                                    onClick={joinLobby}
                                    disabled={!myName.trim()}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Odaya Gir
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        // İsim girildikten sonra takım seçimi
                        <div className="w-full space-y-8">

                            {/* Room Info */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-2 bg-slate-900/50 px-6 py-3 rounded-full border border-slate-800">
                                    <span className="text-slate-400 text-sm font-medium">ODA KODU:</span>
                                    <span className="font-mono font-bold text-purple-400 tracking-wider">{(gameIdParam || myPeerId).substring(0, 6)}...</span>
                                    <button onClick={copyInviteLink} className="ml-2 hover:bg-slate-800 p-2 rounded-lg transition-colors" title="Linki Kopyala">
                                        <Share2 className="w-4 h-4 text-slate-300" />
                                    </button>
                                </div>
                                {isHost && (
                                    <button
                                        onClick={startGame}
                                        className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl font-black text-xl shadow-lg hover:shadow-emerald-500/30 disabled:opacity-30 disabled:grayscale transition-all flex items-center gap-3"
                                    >
                                        <Play className="w-6 h-6 fill-current" />
                                        OYUNU BAŞLAT
                                    </button>
                                )}
                                {!isHost && (
                                    <div className="text-slate-400 animate-pulse">
                                        Host'un oyunu başlatması bekleniyor...
                                    </div>
                                )}
                            </div>

                            {/* Teams Grid */}
                            <div className="grid md:grid-cols-2 gap-8 w-full">
                                {/* SETEJELER - LEFT */}
                                <div className={`relative group overflow-hidden rounded-3xl border-2 transition-all duration-500 ${myPlayer?.team === 'SETEJELER' ? 'border-orange-500 bg-orange-950/20' : 'border-slate-800 bg-slate-900/50'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative p-6 flex flex-col h-full min-h-[400px]">
                                        <h3 className="text-3xl font-black text-orange-500 mb-6 flex items-center gap-3">
                                            <Users className="w-8 h-8" />
                                            SETEJELER
                                        </h3>

                                        <div className="flex-1 space-y-2 mb-6">
                                            <AnimatePresence>
                                                {setejelerPlayers.map(p => (
                                                    <motion.div
                                                        key={p.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-slate-900">
                                                                {p.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">{p.name} {p.isHost && '👑'} {p.id === myPeerId && '(Sen)'}</span>
                                                                <span className="text-xs text-orange-400/80 font-mono">
                                                                    {p.role === 'SPYMASTER' ? '🕵️ ANLATICI' : '👤 AJAN'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {/* Role Selection Buttons (Only if in this team) */}
                                            {myPlayer?.team === 'SETEJELER' && (
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        onClick={() => selectRole('SPYMASTER')}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${myPlayer.role === 'SPYMASTER' ? 'bg-orange-500 text-white' : 'bg-orange-950/40 text-orange-400 hover:bg-orange-900/40'}`}
                                                    >
                                                        🕵️ ANLATICI
                                                    </button>
                                                    <button
                                                        onClick={() => selectRole('OPERATIVE')}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${myPlayer.role === 'OPERATIVE' ? 'bg-slate-700 text-white' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800'}`}
                                                    >
                                                        👤 AJAN
                                                    </button>
                                                </div>
                                            )}

                                            {setejelerPlayers.length === 0 && (
                                                <div className="text-center text-slate-600 italic py-8">Henüz kimse yok</div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => selectTeam('SETEJELER')}
                                            disabled={myPlayer?.team === 'SETEJELER'}
                                            className="w-full py-4 rounded-xl border-2 border-orange-500/30 font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition-all disabled:bg-orange-500/10 disabled:text-orange-600 disabled:border-transparent"
                                        >
                                            {myPlayer?.team === 'SETEJELER' ? 'KATILDIN' : 'SETEJELERE KATIL'}
                                        </button>
                                    </div>
                                </div>

                                {/* AVEKETLER - RIGHT */}
                                <div className={`relative group overflow-hidden rounded-3xl border-2 transition-all duration-500 ${myPlayer?.team === 'AVEKETLER' ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/50'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative p-6 flex flex-col h-full min-h-[400px]">
                                        <h3 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3">
                                            <Users className="w-8 h-8" />
                                            AVEKETLER
                                        </h3>

                                        <div className="flex-1 space-y-2 mb-6">
                                            <AnimatePresence>
                                                {aveketlerPlayers.map(p => (
                                                    <motion.div
                                                        key={p.id}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/5"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-slate-900">
                                                                {p.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">{p.name} {p.isHost && '👑'} {p.id === myPeerId && '(Sen)'}</span>
                                                                <span className="text-xs text-cyan-400/80 font-mono">
                                                                    {p.role === 'SPYMASTER' ? '🕵️ ANLATICI' : '👤 AJAN'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {/* Role Selection Buttons (Only if in this team) */}
                                            {myPlayer?.team === 'AVEKETLER' && (
                                                <div className="flex gap-2 mt-4">
                                                    <button
                                                        onClick={() => selectRole('SPYMASTER')}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${myPlayer.role === 'SPYMASTER' ? 'bg-cyan-500 text-white' : 'bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900/40'}`}
                                                    >
                                                        🕵️ ANLATICI
                                                    </button>
                                                    <button
                                                        onClick={() => selectRole('OPERATIVE')}
                                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${myPlayer.role === 'OPERATIVE' ? 'bg-slate-700 text-white' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800'}`}
                                                    >
                                                        👤 AJAN
                                                    </button>
                                                </div>
                                            )}

                                            {aveketlerPlayers.length === 0 && (
                                                <div className="text-center text-slate-600 italic py-8">Henüz kimse yok</div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => selectTeam('AVEKETLER')}
                                            disabled={myPlayer?.team === 'AVEKETLER'}
                                            className="w-full py-4 rounded-xl border-2 border-cyan-500/30 font-bold text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all disabled:bg-cyan-500/10 disabled:text-cyan-600 disabled:border-transparent"
                                        >
                                            {myPlayer?.team === 'AVEKETLER' ? 'KATILDIN' : 'AVEKETLERE KATIL'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- GAME UI ---

    const setejelerLeft = gameState.cards.filter(c => c.type === 'SETEJELER' && !c.revealed).length;
    const aveketlerLeft = gameState.cards.filter(c => c.type === 'AVEKETLER' && !c.revealed).length;
    const isMyTurn = myPlayer?.team === gameState.currentTurn;

    // Spymaster View: Spymaster kendi rolündeyse veya Oyun bitmişse her şeyi görür
    const spymasterView = myPlayer?.role === 'SPYMASTER' || !!gameState.winner;

    return (
        <div className={`min-h-screen font-sans transition-colors duration-1000 ${gameState.winner ? (gameState.winner === 'SETEJELER' ? TEAMS.SETEJELER.winBg : TEAMS.AVEKETLER.winBg) : 'bg-slate-950'} text-white`}>

            {/* Top Bar */}
            <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/games" className="text-white/50 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <span className="font-cinzel font-black text-2xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-100 to-amber-400 drop-shadow-sm">
                        KION NAMES
                    </span>
                </div>

                {/* Scoreboard */}
                <div className="flex items-center gap-8 bg-slate-900/80 px-8 py-3 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md">
                    <div className={`flex flex-col items-center transition-opacity ${gameState.currentTurn === 'SETEJELER' ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                        <span className="text-[10px] font-black tracking-[0.2em] text-orange-500 mb-1">SETEJELER</span>
                        <span className="text-4xl font-black text-white leading-none">{setejelerLeft}</span>
                    </div>
                    <div className="h-10 w-px bg-slate-700 mx-2" />
                    <div className={`flex flex-col items-center transition-opacity ${gameState.currentTurn === 'AVEKETLER' ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                        <span className="text-[10px] font-black tracking-[0.2em] text-cyan-500 mb-1">AVEKETLER</span>
                        <span className="text-4xl font-black text-white leading-none">{aveketlerLeft}</span>
                    </div>
                </div>

                <div>
                    {isHost && (
                        <button onClick={() => startGame()} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Game Controls & Info */}
            <div className="max-w-2xl mx-auto px-4 py-4">
                {/* CLUE DISPLAY */}
                {gameState.turnPhase === 'GUESS' && gameState.currentClue && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className={`relative flex flex-col md:flex-row items-center justify-between px-8 py-6 rounded-3xl border-2 shadow-2xl mb-8 overflow-hidden group ${gameState.currentTurn === 'SETEJELER'
                                ? 'bg-gradient-to-r from-orange-950/90 to-slate-900 border-orange-500/50 shadow-orange-900/40'
                                : 'bg-gradient-to-r from-cyan-950/90 to-slate-900 border-cyan-500/50 shadow-cyan-900/40'
                            }`}
                    >
                        {/* Background Effect */}
                        <div className={`absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay`} />

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 z-10">
                            <div className="flex flex-col items-center md:items-start">
                                <span className={`font-cinzel font-bold text-xs tracking-[0.3em] mb-1 ${gameState.currentTurn === 'SETEJELER' ? 'text-orange-400' : 'text-cyan-400'
                                    }`}>
                                    ANLATICI İPUCU
                                </span>
                                <div className="flex items-baseline gap-4">
                                    <span className="font-cinzel font-black text-4xl md:text-5xl text-white drop-shadow-md">
                                        {gameState.currentClue.word}
                                    </span>
                                    <span className={`px-4 py-1 rounded-full text-xl font-bold border ${gameState.currentTurn === 'SETEJELER'
                                            ? 'bg-orange-500/20 text-orange-200 border-orange-500/30'
                                            : 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30'
                                        }`}>
                                        {gameState.currentClue.number}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        {isMyTurn && myPlayer?.role === 'OPERATIVE' && (
                            <div className="flex items-center gap-6 mt-4 md:mt-0 z-10 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                                <div className="text-center">
                                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">KALAN HAK</span>
                                    <span className="font-mono text-2xl font-bold text-white">{gameState.guessesRemaining}</span>
                                </div>
                                <button
                                    onClick={() => isHost ? passTurn() : sendToHost('END_TURN')}
                                    className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/20 flex items-center gap-2 group/pass"
                                >
                                    <span>PAS GEÇ</span>
                                    <ChevronRight className="w-4 h-4 group-hover/pass:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* SPYMASTER INPUT */}
                {isMyTurn && myPlayer?.role === 'SPYMASTER' && gameState.turnPhase === 'CLUE' && (
                    <div className="bg-slate-900 px-6 py-4 rounded-2xl border border-slate-700 shadow-xl mb-6 flex flex-col items-center gap-4">
                        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest">İPUCU VER</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const word = (form.elements.namedItem('word') as HTMLInputElement).value;
                                const number = parseInt((form.elements.namedItem('number') as HTMLInputElement).value);
                                if (word && number) {
                                    if (isHost) processClue(word, number);
                                    else sendToHost('GIVE_CLUE', { word, number });
                                }
                            }}
                            className="flex gap-2 w-full"
                        >
                            <input
                                name="word"
                                type="text"
                                placeholder="Kelime..."
                                className="flex-1 bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none uppercase font-bold"
                                autoComplete="off"
                            />
                            <select
                                name="number"
                                className="bg-slate-800 border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none font-bold"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-xl font-bold transition-colors"
                            >
                                GÖNDER
                            </button>
                        </form>
                    </div>
                )}

                {isMyTurn && myPlayer?.role === 'OPERATIVE' && gameState.turnPhase === 'CLUE' && (
                    <div className="text-center text-slate-400 animate-pulse mb-6">
                        Anlatıcının ipucu vermesi bekleniyor...
                    </div>
                )}
            </div>

            {/* Turn Indicator or Game Over */}
            <div className="flex justify-center my-6">
                {gameState.winner ? (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`px-10 py-6 rounded-3xl border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-slate-900/90 backdrop-blur-xl text-center z-50 ${gameState.winner === 'SETEJELER' ? 'border-orange-500 text-orange-500' : 'border-cyan-500 text-cyan-400'}`}
                    >
                        <h2 className="text-4xl md:text-6xl font-black uppercase mb-4 tracking-tight">
                            {gameState.winner} KAZANDI!
                        </h2>
                        {isHost && (
                            <button onClick={() => startGame()} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                YENİ OYUN
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className={`inline-flex items-center gap-4 px-8 py-3 rounded-full border shadow-2xl transition-all duration-500 ${gameState.currentTurn === 'SETEJELER' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                        {isMyTurn && <span className="animate-pulse">👉</span>}
                        <span className="font-bold tracking-widest text-lg">SIRA: {gameState.currentTurn}</span>
                        {isMyTurn && <span className="text-xs bg-white/10 px-2 py-1 rounded ml-2">SENİN SIRAN</span>}
                    </div>
                )}
            </div>

            {/* Main Game Area: Logs + Grid */}
            <div className="max-w-7xl mx-auto px-4 pb-20 flex flex-col-reverse lg:flex-row gap-6 h-[calc(100vh-300px)] min-h-[500px]">

                {/* LOG PANEL */}
                <div className="lg:w-80 flex flex-col bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-2xl h-full lg:h-auto max-h-[300px] lg:max-h-full">
                    <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <h3 className="font-cinzel font-bold text-slate-300 tracking-wider text-sm">GÖREV KAYITLARI</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                        {gameState.logs.length === 0 && (
                            <div className="text-slate-600 text-center italic mt-10">Kayıt bekleniyor...</div>
                        )}
                        {gameState.logs.map(log => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-lg border-l-2 ${log.type === 'SUCCESS' ? 'border-green-500 bg-green-500/10 text-green-200' :
                                    log.type === 'DANGER' ? 'border-red-500 bg-red-500/10 text-red-200' :
                                        log.type === 'WARNING' ? 'border-yellow-500 bg-yellow-500/10 text-yellow-200' :
                                            'border-slate-500 bg-slate-500/10 text-slate-300'
                                    }`}
                            >
                                <div className="flex justify-between opacity-50 text-[10px] mb-1">
                                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                </div>
                                <div>{log.text}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* GRID */}
                <div className="flex-1 bg-slate-900/30 rounded-3xl p-4 lg:p-6 border border-white/5 backdrop-blur-sm overflow-y-auto">
                    <div className="grid grid-cols-5 gap-2 md:gap-3 lg:gap-4 h-full content-center">
                        {gameState.cards.map((card, i) => {
                            // Enhanced Card Styles
                            let baseStyle = "aspect-[4/3] rounded-xl flex items-center justify-center p-1 md:p-2 text-center font-bold text-xs md:text-sm lg:text-lg uppercase transition-all duration-300 shadow-md select-none relative overflow-hidden group";

                            // Typography
                            const textStyle = "font-sans tracking-wide z-10 drop-shadow-md";

                            if (card.revealed || spymasterView) {
                                // AÇIK KART (veya Spymaster)
                                const opacity = card.revealed ? "opacity-100 scale-100" : "opacity-60 saturate-[0.2] scale-[0.98]";

                                if (card.type === 'SETEJELER') {
                                    // Deep rich red-orange gradient
                                    baseStyle += ` bg-gradient-to-br from-[#7f1d1d] to-[#c2410c] text-orange-50 border border-orange-500/30 shadow-[0_0_15px_rgba(234,88,12,0.3)] ${opacity}`;
                                } else if (card.type === 'AVEKETLER') {
                                    // Deep rich blue-cyan gradient
                                    baseStyle += ` bg-gradient-to-br from-[#0c4a6e] to-[#0284c7] text-cyan-50 border border-cyan-500/30 shadow-[0_0_15px_rgba(2,132,199,0.3)] ${opacity}`;
                                } else if (card.type === 'ASSASSIN') {
                                    // Black with red danger pattern
                                    baseStyle += ` bg-black text-red-500 border border-red-900/50 shadow-inner ${opacity}`;
                                } else { // Neutral
                                    // Warm beige/sand
                                    baseStyle += ` bg-[#d6d3d1] text-[#44403c] border border-[#a8a29e] ${opacity}`;
                                }
                            } else {
                                // KAPALI KART (Operative)
                                baseStyle += " bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 hover:scale-[1.03] hover:shadow-xl hover:from-white hover:to-slate-200 cursor-pointer border-b-4 border-slate-400/50 active:border-b-0 active:translate-y-1";
                                if (!isMyTurn || gameState.winner || gameState.turnPhase === 'CLUE' || myPlayer?.role === 'SPYMASTER') {
                                    baseStyle += " cursor-not-allowed opacity-75 hover:scale-100 hover:from-slate-200 grayscale";
                                }
                            }

                            // Tıklama engeli
                            const canClick = !card.revealed && !gameState.winner && isMyTurn && myPlayer?.role === 'OPERATIVE' && gameState.turnPhase === 'GUESS';

                            return (
                                <motion.button
                                    key={card.id}
                                    layoutId={`card-${card.id}`}
                                    onClick={() => canClick && handleCardClick(i)}
                                    disabled={!canClick}
                                    className={baseStyle}
                                    whileTap={canClick ? { scale: 0.95 } : {}}
                                >
                                    <span className={`${textStyle} ${card.revealed && card.type === 'ASSASSIN' ? 'line-through decoration-red-600 decoration-2' : ''}`}>
                                        {card.word}
                                    </span>

                                    {/* Texture / Shine Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                    {/* Inner Border for style */}
                                    {!card.revealed && !spymasterView && (
                                        <div className="absolute inset-1 border border-slate-400/30 rounded-lg pointer-events-none" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}
