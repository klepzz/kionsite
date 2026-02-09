'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCcw, Wifi, Copy, Share2, Users, Crown, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
    const connectionsRef = useRef<any[]>([]); // Host için
    const hostConnRef = useRef<any | null>(null); // Guest için

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


    const handleConnection = (conn: any) => {
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

    const handleDataFromClient = (conn: any, data: any) => {
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
        <div className={`min-h-screen font-sans transition-colors duration-1000 ${gameState.winner ? (gameState.winner === 'SETEJELER' ? 'bg-orange-950' : 'bg-slate-950') : 'bg-gradient-to-b from-orange-400 to-orange-700'}`}>

            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none mix-blend-multiply" />

            {/* Top Bar (Compact) */}
            <div className="relative z-10 max-w-[1920px] mx-auto p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/games" className="text-white/70 hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    {isHost && (
                        <button onClick={() => startGame()} className="p-2 hover:bg-black/20 rounded-full text-white/70 hover:text-white transition-colors backdrop-blur-sm" title="Yeniden Başlat">
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Status Message / Title */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 text-center">
                    <h1 className="font-cinzel font-black text-3xl md:text-4xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide uppercase">
                        {gameState.winner ? `${gameState.winner} KAZANDI!` :
                            gameState.turnPhase === 'CLUE' ? `${gameState.currentTurn} İPUCU BEKLENİYOR` :
                                `${gameState.currentTurn} TAHMİN EDİYOR`}
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <button className="bg-black/20 text-white px-4 py-2 rounded-full font-bold backdrop-blur-sm hover:bg-black/30 transition-colors">
                        Ayarlar
                    </button>
                </div>
            </div>

            {/* Main Layout: 3 Columns */}
            <div className="relative z-10 max-w-[1800px] mx-auto px-4 pb-8 flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">

                {/* LEFT: AVEKETLER (Blue) - Operatives & Spymaster */}
                <div className="w-full lg:w-80 flex flex-col gap-4 order-2 lg:order-1">
                    {/* Score / Header */}
                    <div className="bg-cyan-600 rounded-xl p-4 shadow-lg border-b-4 border-cyan-800 flex items-center justify-between">
                        <h2 className="text-white font-black text-xl uppercase tracking-wider">AVEKETLER</h2>
                        <span className="text-4xl font-black text-white bg-black/20 px-3 py-1 rounded-lg">{aveketlerLeft}</span>
                    </div>

                    {/* Operatives Panel */}
                    <div className="flex-1 bg-cyan-900/40 backdrop-blur-sm rounded-xl border-2 border-cyan-500/30 p-4 flex flex-col">
                        <h3 className="text-cyan-200 font-bold text-xs uppercase mb-2 tracking-widest border-b border-cyan-500/30 pb-1">AJANLAR</h3>
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            {aveketlerPlayers.filter(p => p.role === 'OPERATIVE').map(p => (
                                <div key={p.id} className="flex items-center gap-2 text-white bg-cyan-800/50 p-2 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                                    <span className="font-medium text-sm truncate">{p.name}</span>
                                </div>
                            ))}
                            {/* Role switch button removed for Game UI */}
                        </div>
                    </div>

                    {/* Spymaster Panel */}
                    <div className="h-40 bg-cyan-900/40 backdrop-blur-sm rounded-xl border-2 border-cyan-500/30 p-4 flex flex-col">
                        <h3 className="text-cyan-200 font-bold text-xs uppercase mb-2 tracking-widest border-b border-cyan-500/30 pb-1">ANLATICI</h3>
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            {aveketlerPlayers.filter(p => p.role === 'SPYMASTER').map(p => (
                                <div key={p.id} className="flex items-center gap-2 text-white bg-cyan-800/50 p-2 rounded-lg border border-cyan-400/50">
                                    <Crown className="w-4 h-4 text-yellow-400" />
                                    <span className="font-medium text-sm truncate">{p.name}</span>
                                </div>
                            ))}
                            {/* Spymaster button removed for Game UI */}
                        </div>
                    </div>
                </div>


                {/* CENTER: Grid & Clue Area */}
                <div className="flex-1 flex flex-col gap-6 order-1 lg:order-2">

                    {/* Clue Display (Compact & Elegant) */}
                    <div className="h-24 flex items-center justify-center">
                        {gameState.turnPhase === 'GUESS' && gameState.currentClue ? (
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className={`flex items-center gap-6 px-10 py-4 rounded-xl shadow-2xl border-b-4 ${gameState.currentTurn === 'SETEJELER' ? 'bg-orange-100 border-orange-600 text-orange-900' : 'bg-cyan-100 border-cyan-600 text-cyan-900'
                                    }`}
                            >
                                <span className="font-cinzel font-bold text-lg uppercase tracking-widest opacity-60">İPUCU:</span>
                                <span className="font-black text-4xl uppercase">{gameState.currentClue.word}</span>
                                <span className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-xl shadow-inner ${gameState.currentTurn === 'SETEJELER' ? 'bg-orange-600' : 'bg-cyan-600'
                                    }`}>
                                    {gameState.currentClue.number}
                                </span>
                            </motion.div>
                        ) : (
                            isMyTurn && myPlayer?.role === 'SPYMASTER' && (
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
                                    className="flex gap-2 bg-black/40 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-xl"
                                >
                                    <input
                                        name="word"
                                        type="text"
                                        placeholder="İPUCU KELİMESİ"
                                        className="bg-white/90 border-0 rounded-lg px-4 py-2 text-slate-900 font-bold uppercase focus:ring-2 focus:ring-yellow-400 outline-none w-48 placeholder:text-slate-400"
                                        autoComplete="off"
                                    />
                                    <select
                                        name="number"
                                        className="bg-white/90 border-0 rounded-lg px-2 py-2 text-slate-900 font-bold focus:ring-2 focus:ring-yellow-400 outline-none w-16 text-center"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-500 text-white px-6 rounded-lg font-bold uppercase tracking-wide transition-colors shadow-md"
                                    >
                                        VER
                                    </button>
                                </form>
                            )
                        )}

                        {/* Pass Button Display for Operatives */}
                        {isMyTurn && myPlayer?.role === 'OPERATIVE' && gameState.turnPhase === 'GUESS' && (
                            <button
                                onClick={() => isHost ? passTurn() : sendToHost('END_TURN')}
                                className="ml-4 bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold uppercase shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all"
                            >
                                PAS GEÇ
                            </button>
                        )}
                    </div>

                    {/* CARD GRID */}
                    <div className="flex-1 bg-black/20 p-4 rounded-3xl backdrop-blur-sm border border-white/5 shadow-inner overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 min-h-min content-start max-w-[1200px] mx-auto pb-8">
                            {gameState.cards.map((card, i) => {
                                // 3D TILE STYLE
                                const isRevealed = card.revealed || spymasterView;

                                // Base (Unrevealed)
                                let bgStyle = "bg-gradient-to-br from-[#fdf0d5] to-[#f5e6ca]";
                                let borderStyle = "border-b-[6px] border-[#d8c29d]";
                                let textStyle = "text-[#5e503f]";
                                let opacityStyle = isRevealed && !card.revealed ? "opacity-60 saturate-[0.5] scale-95" : "opacity-100";

                                if (isRevealed) {
                                    if (card.type === 'SETEJELER') {
                                        bgStyle = "bg-gradient-to-br from-[#c0392b] to-[#a93226]";
                                        borderStyle = "border-b-[6px] border-[#922b21]";
                                        textStyle = "text-red-50 shadow-sm";
                                    } else if (card.type === 'AVEKETLER') {
                                        bgStyle = "bg-gradient-to-br from-[#2980b9] to-[#2471a3]";
                                        borderStyle = "border-b-[6px] border-[#1f618d]";
                                        textStyle = "text-blue-50 shadow-sm";
                                    } else if (card.type === 'ASSASSIN') {
                                        bgStyle = "bg-gradient-to-br from-[#2c3e50] to-[#1a252f]";
                                        borderStyle = "border-b-[6px] border-[#17202a]";
                                        textStyle = "text-gray-400";
                                    } else if (card.type === 'NEUTRAL') {
                                        bgStyle = "bg-gradient-to-br from-[#95a5a6] to-[#7f8c8d]";
                                        borderStyle = "border-b-[6px] border-[#626567]";
                                        textStyle = "text-gray-100";
                                    }
                                }

                                const canClick = !card.revealed && !gameState.winner && isMyTurn && myPlayer?.role === 'OPERATIVE' && gameState.turnPhase === 'GUESS';

                                return (
                                    <motion.button
                                        key={card.id}
                                        layoutId={`card-${card.id}`}
                                        onClick={() => canClick && handleCardClick(i)}
                                        disabled={!canClick}
                                        className={`
                                            relative aspect-[4/3] rounded-xl flex items-center justify-center p-3
                                            text-center font-black text-sm md:text-base lg:text-lg uppercase tracking-wider
                                            transition-all duration-200 shadow-xl select-none group
                                            ${bgStyle} ${borderStyle} ${textStyle} ${opacityStyle}
                                            ${canClick ? 'cursor-pointer hover:-translate-y-1 hover:brightness-110 active:border-b-0 active:translate-y-[6px]' : 'cursor-default'}
                                        `}
                                    >
                                        <span className={`block w-full break-words leading-tight z-10 font-sans tracking-wide drop-shadow-sm ${card.revealed && card.type === 'ASSASSIN' ? 'line-through decoration-red-600 decoration-4' : ''}`}>
                                            {card.word}
                                        </span>

                                        {/* Inner Bevel Highlight */}
                                        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/30 rounded-t-lg pointer-events-none" />
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: SETEJELER (Red) + LOGS */}
                <div className="w-full lg:w-80 flex flex-col gap-4 order-3">
                    {/* Score / Header */}
                    <div className="bg-orange-600 rounded-xl p-4 shadow-lg border-b-4 border-orange-800 flex items-center justify-between">
                        <span className="text-4xl font-black text-white bg-black/20 px-3 py-1 rounded-lg">{setejelerLeft}</span>
                        <h2 className="text-white font-black text-xl uppercase tracking-wider">SETEJELER</h2>
                    </div>

                    {/* Operatives Panel */}
                    <div className="flex-1 bg-orange-900/40 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 p-4 flex flex-col">
                        <h3 className="text-orange-200 font-bold text-xs uppercase mb-2 tracking-widest border-b border-orange-500/30 pb-1">AJANLAR</h3>
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            {setejelerPlayers.filter(p => p.role === 'OPERATIVE').map(p => (
                                <div key={p.id} className="flex items-center gap-2 text-white bg-orange-800/50 p-2 rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                                    <span className="font-medium text-sm truncate">{p.name}</span>
                                </div>
                            ))}
                            {/* Role switch button removed for Game UI */}
                        </div>
                    </div>

                    {/* Spymaster Panel */}
                    <div className="h-32 bg-orange-900/40 backdrop-blur-sm rounded-xl border-2 border-orange-500/30 p-4 flex flex-col">
                        <h3 className="text-orange-200 font-bold text-xs uppercase mb-2 tracking-widest border-b border-orange-500/30 pb-1">ANLATICI</h3>
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            {setejelerPlayers.filter(p => p.role === 'SPYMASTER').map(p => (
                                <div key={p.id} className="flex items-center gap-2 text-white bg-orange-800/50 p-2 rounded-lg border border-orange-400/50">
                                    <Crown className="w-4 h-4 text-yellow-400" />
                                    <span className="font-medium text-sm truncate">{p.name}</span>
                                </div>
                            ))}
                            {/* Spymaster button removed for Game UI */}
                        </div>
                    </div>

                    {/* MINIMIZED LOG PANEL */}
                    <div className="h-48 bg-slate-900/80 rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-2 bg-black/40 border-b border-white/5 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <h3 className="font-mono text-slate-400 text-[10px] uppercase">GÖREV KAYDI</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 font-mono text-[10px]">
                            {gameState.logs.map(log => (
                                <div key={log.id} className={`opacity-80 ${log.type === 'SUCCESS' ? 'text-green-400' :
                                    log.type === 'DANGER' ? 'text-red-400' :
                                        log.type === 'WARNING' ? 'text-yellow-400' :
                                            'text-slate-300'
                                    }`}>
                                    <span className="opacity-50 mr-2">[{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                                    {log.text}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
