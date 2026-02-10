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
    teamNames: { [key in Team]: string };
    timerEndTime: number | null; // Timestamp for turn end
    turnCount: number; // Total moves/turns made
}

// --- SABİTLER ---

const TEAMS = {
    SETEJELER: {
        name: 'SETEJELER',
        color: 'from-orange-500 to-red-600', // Keep for compatibility if needed, but UI will override
        bg: 'bg-gradient-to-br from-orange-500/10 to-red-600/10',
        border: 'border-orange-500/50',
        text: 'text-orange-400',
        ring: 'ring-orange-500',
        winBg: 'bg-orange-950',
    },
    AVEKETLER: {
        name: 'AVEKETLER',
        color: 'from-cyan-400 to-blue-600',
        bg: 'bg-gradient-to-br from-cyan-400/10 to-blue-600/10',
        border: 'border-cyan-400/50',
        text: 'text-cyan-400',
        ring: 'ring-cyan-400',
        winBg: 'bg-slate-950',
    }
};

const WORDS_URL = 'https://raw.githubusercontent.com/skanan/codenames-tr/master/words.txt';

const FIRST_TURN_DURATION = 140; // 2:20 minutes
const NORMAL_TURN_DURATION = 80;  // 1:20 minutes

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
        logs: [],
        teamNames: {
            SETEJELER: 'SETEJELER',
            AVEKETLER: 'AVEKETLER'
        },
        timerEndTime: null,
        turnCount: 0
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
        } else if (data.type === 'RESET_GAME') {
            // Host bu isteği alırsa oyunu resetler
            if (isHost) resetGame();
        } else if (data.type === 'UPDATE_TEAM_NAME') {
            // Host bu mesajı almaz, kendi state'ini günceller ve yayınlar.
            // Ancak bir Guest (yetkisi varsa) gönderirse işleyebiliriz.
            // Şimdilik sadece Host UI üzerinden güncelleyeceği için buraya gerek yok.
        }
    };

    const updateTeamName = (teamKey: Team, newName: string) => {
        setGameState(prev => {
            const newState = {
                ...prev,
                teamNames: {
                    ...prev.teamNames,
                    [teamKey]: newName
                }
            };
            broadcastState(newState);
            return newState;
        });
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

    // Timer Effect (Host Only)
    useEffect(() => {
        if (!isHost || gameState.phase !== 'PLAYING' || gameState.winner || !gameState.timerEndTime) return;

        const interval = setInterval(() => {
            const now = Date.now();
            // Timer bitti mi?
            if (now >= (gameState.timerEndTime as number)) {
                // Otomatik tur geç
                console.log('Timer expired! Passing turn...');
                passTurn();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isHost, gameState.phase, gameState.winner, gameState.timerEndTime]);

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

        const initialTimer = Date.now() + (FIRST_TURN_DURATION * 1000);

        const newState: GameState = {
            ...gameState,
            phase: 'PLAYING',
            cards: newCards,
            currentTurn: starter,
            winner: null,
            timerEndTime: initialTimer,
            turnCount: 0
        };

        setGameState(newState);
        broadcastState(newState);
        addLog('Oyun Başladı! İyi şanslar.', 'INFO');
        addLog(`${newState.teamNames[starter]} başlıyor.`, 'INFO');
    };

    const resetGame = () => {
        if (!isHost) {
            sendToHost('RESET_GAME');
            return;
        }

        // Yeni oyun başlat (StartGame mantığını tekrar kullanabiliriz veya özelleştirebiliriz)
        // Oyuncuları koru, takımları ve rolleri koru.
        startGame();
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

    const passTurn = () => {
        setGameState(prev => {
            const newTurn: Team = prev.currentTurn === 'SETEJELER' ? 'AVEKETLER' : 'SETEJELER';
            const newLog: GameLog = {
                id: Math.random().toString(36).substr(2, 9),
                text: `${prev.teamNames[prev.currentTurn]} turu pas geçti (Süre/Pas).`,
                type: 'WARNING',
                timestamp: Date.now()
            };

            const nextTurnCount = prev.turnCount + 1;
            const duration = NORMAL_TURN_DURATION; // Sonraki turlar hep 1:20
            const newTimer = Date.now() + (duration * 1000);

            const newState = {
                ...prev,
                currentTurn: newTurn,
                turnPhase: 'CLUE' as TurnPhase,
                currentClue: null,
                guessesRemaining: 0,
                logs: [newLog, ...prev.logs],
                timerEndTime: newTimer,
                turnCount: nextTurnCount
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

        // Eğer tur değiştiyse Timer'ı güncelle
        if (newTurnChanged && !newWinner) {
            const nextTurnCount = gameState.turnCount + 1;
            const duration = NORMAL_TURN_DURATION;
            newState.timerEndTime = Date.now() + (duration * 1000);
            newState.turnCount = nextTurnCount;
        } else if (newWinner) {
            newState.timerEndTime = null; // Oyun bitti, süre durur
        }

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
        if (gameState.phase !== 'PLAYING') return;
        if (gameState.winner) return;

        // Sadece sırası gelen takımdaki oyuncular tıklayabilir mi?
        // Oyunun akıcılığı için herkes tıklayabilsin ama host'ta kontrol edilsin.
        // Daha sıkı kural: Sadece kendi turunda tıklayabilirsin.
        const myPlayer = gameState.players.find(p => p.id === myPeerId);
        if (!myPlayer) return;

        if (myPlayer.team !== gameState.currentTurn) {
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
                <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
                    <Link href="/games" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-5 h-5" /> Çıkış
                    </Link>
                    <h1 className="font-cinzel text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-orange-400 tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
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
                                            {isHost ? (
                                                <input
                                                    type="text"
                                                    value={gameState.teamNames.SETEJELER}
                                                    onChange={(e) => updateTeamName('SETEJELER', e.target.value)}
                                                    className="bg-transparent border-b-2 border-orange-500/30 focus:border-orange-500 outline-none w-full uppercase"
                                                />
                                            ) : (
                                                gameState.teamNames.SETEJELER
                                            )}
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
                                            {myPlayer?.team === 'SETEJELER' ? 'KATILDIN' : `${gameState.teamNames.SETEJELER}'E KATIL`}
                                        </button>
                                    </div>
                                </div>

                                {/* AVEKETLER - RIGHT */}
                                <div className={`relative group overflow-hidden rounded-3xl border-2 transition-all duration-500 ${myPlayer?.team === 'AVEKETLER' ? 'border-cyan-500 bg-cyan-950/20' : 'border-slate-800 bg-slate-900/50'}`}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative p-6 flex flex-col h-full min-h-[400px]">
                                        <h3 className="text-3xl font-black text-cyan-400 mb-6 flex items-center gap-3">
                                            <Users className="w-8 h-8" />
                                            {isHost ? (
                                                <input
                                                    type="text"
                                                    value={gameState.teamNames.AVEKETLER}
                                                    onChange={(e) => updateTeamName('AVEKETLER', e.target.value)}
                                                    className="bg-transparent border-b-2 border-cyan-500/30 focus:border-cyan-500 outline-none w-full uppercase"
                                                />
                                            ) : (
                                                gameState.teamNames.AVEKETLER
                                            )}
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
                                            {myPlayer?.team === 'AVEKETLER' ? 'KATILDIN' : `${gameState.teamNames.AVEKETLER}'E KATIL`}
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
        <div className={`min-h-screen font-sans transition-colors duration-1000 bg-slate-950 overflow-hidden`}>

            {/* Neon Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none" />
            <div className={`absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000 ${gameState.currentTurn === 'SETEJELER' ? 'bg-[radial-gradient(circle_at_center,rgba(255,100,0,0.15),transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.15),transparent_70%)]'
                }`} />

            {/* Top Bar (Compact) */}
            <div className="relative z-10 max-w-[1920px] mx-auto p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/games" className="text-slate-400 hover:text-white transition-colors bg-slate-900/50 p-2 rounded-full backdrop-blur-sm border border-white/5 hover:border-white/20">
                        <ArrowLeft className="w-5 h-5" /> Çıkış
                    </Link>
                    {isHost && (
                        <button onClick={() => startGame()} className="p-2 hover:bg-slate-900/50 rounded-full text-slate-400 hover:text-white transition-colors backdrop-blur-sm border border-transparent hover:border-white/20" title="Yeniden Başlat">
                            <RefreshCcw className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Status Message / Title */}
                <div className="absolute left-1/2 -translate-x-1/2 top-4 text-center z-50 pointer-events-none flex flex-col items-center">
                    <h1 className="font-cinzel font-black text-3xl md:text-4xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-wide uppercase mb-1">
                        {gameState.winner ? (
                            // Winner text moved to overlay
                            null
                        ) :
                            gameState.turnPhase === 'CLUE' ? `${gameState.teamNames[gameState.currentTurn]} İPUCU BEKLENİYOR` :
                                `${gameState.teamNames[gameState.currentTurn]} TAHMİN EDİYOR`}
                    </h1>

                    {/* TIMER DISPLAY */}
                    {!gameState.winner && gameState.timerEndTime && (
                        <TimerDisplay endTime={gameState.timerEndTime} />
                    )}
                </div>

                {/* GAME OVER OVERLAY MOVED TO ROOT */}

                <div className="flex items-center gap-2">
                    <button className="bg-slate-900/50 border border-white/5 text-slate-300 px-4 py-2 rounded-full font-bold backdrop-blur-sm hover:bg-slate-800 transition-colors hover:text-white">
                        Ayarlar
                    </button>
                </div>
            </div>

            {/* Main Layout: 3 Columns */}
            <div className="relative z-10 max-w-[1800px] mx-auto px-4 pb-8 flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">

                {/* LEFT: AVEKETLER (Blue) - Operatives & Spymaster */}
                <div className="w-full lg:w-80 flex flex-col gap-4 order-2 lg:order-1">
                    {/* Score / Header */}
                    <div className="bg-slate-900/80 rounded-xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.2)] border border-cyan-500/30 flex items-center justify-between">
                        <h2 className="text-cyan-400 font-black text-xl uppercase tracking-widest drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{gameState.teamNames.AVEKETLER}</h2>
                        <span className="text-4xl font-black text-white bg-cyan-950/50 px-4 py-1 rounded-lg border border-cyan-500/20 shadow-inner">{aveketlerLeft}</span>
                    </div>

                    <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 flex flex-col">
                        <h3 className="text-cyan-400/70 font-bold text-xs uppercase mb-2 tracking-[0.2em] border-b border-white/5 pb-2">AJANLAR</h3>
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            {aveketlerPlayers.filter(p => p.role === 'OPERATIVE').map(p => (
                                <div key={p.id} className="flex items-center gap-3 text-slate-300 bg-slate-800/40 p-2 rounded-lg border border-transparent hover:border-cyan-500/30 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                                    <span className="font-medium text-sm truncate">{p.name}</span>
                                </div>
                            ))}
                            {/* Role switch button removed for Game UI */}
                        </div>
                    </div>

                    {/* Spymaster Panel */}
                    <div className="h-40 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 flex flex-col">
                        <h3 className="text-cyan-400/70 font-bold text-xs uppercase mb-2 tracking-[0.2em] border-b border-white/5 pb-2">ANLATICI</h3>
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            {aveketlerPlayers.filter(p => p.role === 'SPYMASTER').map(p => (
                                <div key={p.id} className="flex items-center gap-2 text-cyan-200 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                                    <Crown className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
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
                                className={`flex items-center gap-6 px-12 py-5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 ${gameState.currentTurn === 'SETEJELER'
                                    ? 'bg-slate-900/90 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
                                    : 'bg-slate-900/90 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                                    }`}
                            >
                                <span className={`font-cinzel font-bold text-lg uppercase tracking-widest ${gameState.currentTurn === 'SETEJELER' ? 'text-orange-500' : 'text-cyan-500'
                                    }`}>İPUCU:</span>

                                <span className={`font-black text-4xl uppercase tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${gameState.currentTurn === 'SETEJELER' ? 'text-white' : 'text-white'
                                    }`}>{gameState.currentClue.word}</span>

                                <span className={`w-12 h-12 flex items-center justify-center rounded-xl text-slate-950 font-black text-2xl shadow-[0_0_15px_currentColor] ${gameState.currentTurn === 'SETEJELER' ? 'bg-orange-500 text-slate-900' : 'bg-cyan-400 text-slate-900'
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
                                    className="flex gap-2 bg-slate-900/80 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl ring-1 ring-white/5"
                                >
                                    <input
                                        name="word"
                                        type="text"
                                        placeholder="İPUCU..."
                                        className="bg-slate-800 border-0 rounded-xl px-4 py-3 text-white font-bold uppercase focus:ring-2 focus:ring-white/20 outline-none w-48 placeholder:text-slate-500"
                                        autoComplete="off"
                                    />
                                    <select
                                        name="number"
                                        className="bg-slate-800 border-0 rounded-xl px-3 py-3 text-white font-bold focus:ring-2 focus:ring-white/20 outline-none w-20 text-center appearance-none cursor-pointer hover:bg-slate-700"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-8 rounded-xl font-black uppercase tracking-wide transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
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
                                className="ml-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/50 hover:border-red-500 px-6 py-3 rounded-xl font-bold uppercase shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] transition-all"
                            >
                                PAS GEÇ
                            </button>
                        )}
                    </div>

                    {/* CARD GRID */}
                    <div className="flex-1 bg-slate-900/30 p-2 md:p-6 rounded-3xl backdrop-blur-sm border border-white/5 flex flex-col min-h-0 overflow-hidden relative">
                        {/* Grid decorative corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 rounded-tl-xl" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 rounded-tr-xl" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 rounded-bl-xl" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 rounded-br-xl" />

                        <div className="flex-1 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 md:gap-4 content-stretch h-full w-full max-w-[1400px] mx-auto z-40">
                            {gameState.cards.map((card, i) => {
                                // 3D FLIP ANIMATION LOGIC
                                // We separate the visual state into 'Front' (Unrevealed/Hint) and 'Back' (Revealed)

                                const isRevealed = card.revealed; // True means flip to back

                                // --- FRONT FACE STYLES (Unrevealed State) ---
                                // Operatives see Slate. Spymasters see the Strong Hint.
                                let frontBg = "bg-slate-800/80";
                                let frontBorder = "border border-white/10";
                                let frontText = "text-slate-300";
                                let frontGlow = "";

                                if (!card.revealed && spymasterView) {
                                    // Spymaster "Hint" View on Front Face
                                    if (card.type === 'SETEJELER') {
                                        frontBg = "bg-orange-950/40";
                                        frontBorder = "border-2 border-orange-500";
                                        frontText = "text-orange-100 font-bold";
                                        frontGlow = "shadow-[0_0_15px_rgba(249,115,22,0.15)]";
                                    } else if (card.type === 'AVEKETLER') {
                                        frontBg = "bg-cyan-950/40";
                                        frontBorder = "border-2 border-cyan-400";
                                        frontText = "text-cyan-100 font-bold";
                                        frontGlow = "shadow-[0_0_15px_rgba(34,211,238,0.15)]";
                                    } else if (card.type === 'ASSASSIN') {
                                        frontBg = "bg-black/90";
                                        frontBorder = "border-2 border-slate-700 dashed";
                                        frontText = "text-slate-400";
                                    } else if (card.type === 'NEUTRAL') {
                                        // Optional: Hint for neutral too?
                                        frontBorder = "border border-[#d4af37]/30";
                                    }
                                }

                                // --- BACK FACE STYLES (Revealed State) ---
                                // What everyone sees when the card is actually flipped/revealed
                                let backBg = "bg-slate-800";
                                let backBorder = "border border-slate-700";
                                let backText = "text-slate-400";
                                let backGlow = "";

                                if (card.type === 'SETEJELER') {
                                    backBg = "bg-orange-600/90";
                                    backBorder = "border-2 border-orange-400";
                                    backText = "text-white font-black drop-shadow-md";
                                    backGlow = "shadow-[0_0_30px_rgba(249,115,22,0.6)]";
                                } else if (card.type === 'AVEKETLER') {
                                    backBg = "bg-cyan-600/90";
                                    backBorder = "border-2 border-cyan-300";
                                    backText = "text-white font-black drop-shadow-md";
                                    backGlow = "shadow-[0_0_30px_rgba(34,211,238,0.6)]";
                                } else if (card.type === 'ASSASSIN') {
                                    backBg = "bg-black";
                                    backBorder = "border-4 border-red-600 double";
                                    backText = "text-red-500 line-through decoration-4";
                                    backGlow = "shadow-[0_0_50px_rgba(220,38,38,0.5)]";
                                } else if (card.type === 'NEUTRAL') {
                                    backBg = "bg-slate-700/80";
                                    backBorder = "border-2 border-[#d4af37]/30";
                                    backText = "text-[#d4af37]/80";
                                }

                                const canClick = !card.revealed && !gameState.winner && isMyTurn && myPlayer?.role === 'OPERATIVE' && gameState.turnPhase === 'GUESS';

                                return (
                                    <div
                                        key={card.id}
                                        className={`relative h-full w-full perspective-1000 group ${canClick ? 'cursor-pointer' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (canClick) {
                                                handleCardClick(i);
                                            }
                                        }}
                                    >
                                        <motion.div
                                            layoutId={`card-${card.id}`}
                                            initial={false}
                                            animate={{ rotateY: isRevealed ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                            className={`
                                                relative w-full h-full transform-style-3d transition-transform duration-500
                                                ${canClick ? 'group-hover:scale-[1.02]' : ''}
                                            `}
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            {/* --- FRONT FACE (Unrevealed) --- */}
                                            <div
                                                className={`
                                                    absolute inset-0 backface-hidden rounded-xl flex items-center justify-center p-2
                                                    text-center font-sans text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-widest
                                                    select-none overflow-hidden
                                                    ${frontBg} ${frontBorder} ${frontText} ${frontGlow}
                                                    ${canClick ? 'group-hover:bg-slate-700/80 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}
                                                `}
                                                style={{ backfaceVisibility: 'hidden' }}
                                            >
                                                {/* Scanline & Deco */}
                                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
                                                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/20" />
                                                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/20" />

                                                <span className={`relative block w-full break-words leading-tight z-10 font-bold ${canClick ? 'group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}>
                                                    {card.word}
                                                </span>
                                            </div>

                                            {/* --- BACK FACE (Revealed) --- */}
                                            <div
                                                className={`
                                                    absolute inset-0 backface-hidden rounded-xl flex items-center justify-center p-2
                                                    text-center font-sans text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-widest
                                                    select-none overflow-hidden
                                                    ${backBg} ${backBorder} ${backText} ${backGlow}
                                                `}
                                                style={{
                                                    backfaceVisibility: 'hidden',
                                                    transform: 'rotateY(180deg)'
                                                }}
                                            >
                                                {/* Revealead Deco */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                                                <span className="relative block w-full break-words leading-tight z-10 font-bold">
                                                    {card.word}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT: SETEJELER (Red) + LOGS */}
                <div className="w-full lg:w-80 flex flex-col gap-4 order-3">
                    {/* Score / Header */}
                    <div className="bg-slate-900/80 rounded-xl p-4 shadow-[0_0_20px_rgba(249,115,22,0.2)] border border-orange-500/30 flex items-center justify-between">
                        <span className="text-4xl font-black text-white bg-orange-950/50 px-4 py-1 rounded-lg border border-orange-500/20 shadow-inner">{setejelerLeft}</span>
                        <h2 className="text-orange-500 font-black text-xl uppercase tracking-widest drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">{gameState.teamNames.SETEJELER}</h2>
                    </div>

                    <div className="flex-1 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 flex flex-col">
                        <h3 className="text-orange-400/70 font-bold text-xs uppercase mb-2 tracking-[0.2em] border-b border-white/5 pb-2">AJANLAR</h3>
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            {setejelerPlayers.filter(p => p.role === 'OPERATIVE').map(p => (
                                <div key={p.id} className="flex items-center gap-3 text-slate-300 bg-slate-800/40 p-2 rounded-lg border border-transparent hover:border-orange-500/30 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/50 flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                                    <span className="font-medium text-sm truncate">{p.name}</span>
                                </div>
                            ))}
                            {/* Role switch button removed for Game UI */}
                        </div>
                    </div>

                    {/* Spymaster Panel */}
                    <div className="h-32 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-white/5 p-4 flex flex-col">
                        <h3 className="text-orange-400/70 font-bold text-xs uppercase mb-2 tracking-[0.2em] border-b border-white/5 pb-2">ANLATICI</h3>
                        <div className="flex-1 space-y-2 overflow-y-auto">
                            {setejelerPlayers.filter(p => p.role === 'SPYMASTER').map(p => (
                                <div key={p.id} className="flex items-center gap-2 text-orange-200 bg-orange-950/30 p-2 rounded-lg border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                                    <Crown className="w-4 h-4 text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                                    <span className="font-medium text-sm truncate">{p.name}</span>
                                </div>
                            ))}
                            {/* Spymaster button removed for Game UI */}
                        </div>
                    </div>

                    {/* GAME OVER OVERLAY (MOVED HERE FOR Z-INDEX FIX) */}
                    <AnimatePresence>
                        {gameState.winner && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
                            >
                                {/* 1. Image in Foreground - Appear, Stay, Disappear */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: [0, 1, 1, 0], scale: 1 }}
                                    transition={{
                                        opacity: { duration: 4, times: [0, 0.2, 0.8, 1], ease: "easeInOut" },
                                        scale: { duration: 4, ease: "easeOut" }
                                    }}
                                    className="absolute inset-0 flex items-center justify-center p-4 z-30 pointer-events-none"
                                >
                                    <img
                                        src="/images/game_over.jpg"
                                        alt="Game Over"
                                        className="w-full h-full max-h-[80vh] object-contain drop-shadow-2xl rounded-lg"
                                    />
                                </motion.div>

                                {/* 2. Controls (Text & Button) - Appear after image fades */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 3.5, duration: 1 }} // Start appearing while image fades out
                                    className="relative z-20 flex flex-col items-center gap-6 p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10"
                                >
                                    <h1 className={`font-cinzel font-black text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b ${gameState.winner === 'SETEJELER' ? 'from-orange-400 to-red-600 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]' : 'from-cyan-400 to-blue-600 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]'} uppercase tracking-widest text-center`}>
                                        {gameState.teamNames[gameState.winner]}
                                        <br />
                                        KAZANDI!
                                    </h1>

                                    <button
                                        onClick={resetGame}
                                        className="px-12 py-4 bg-white hover:bg-slate-200 text-black font-bold tracking-widest transition-all hover:scale-105 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer pointer-events-auto"
                                    >
                                        TEKRAR OYNA
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}

// --- UTILS ---

function TimerDisplay({ endTime }: { endTime: number }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const diff = Math.ceil((endTime - now) / 1000);
            setTimeLeft(Math.max(0, diff));
        }, 500); // Check twice a second for smoothness update

        // Initial set
        setTimeLeft(Math.max(0, Math.ceil((endTime - Date.now()) / 1000)));

        return () => clearInterval(interval);
    }, [endTime]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Color logic: < 10s red, < 30s yellow, else white
    let colorClass = "text-white";
    if (timeLeft <= 10) colorClass = "text-red-500 animate-pulse";
    else if (timeLeft <= 30) colorClass = "text-yellow-400";

    return (
        <div className={`font-mono text-xl md:text-2xl font-bold tracking-widest bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/10 ${colorClass}`}>
            {formatted}
        </div>
    );
}

function shuffleWords(array: any[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
