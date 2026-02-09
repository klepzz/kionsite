'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Trophy, ArrowLeft, ArrowRight, Users, Wifi, Copy, Share2, User } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';


type Player = 'X' | 'O';
type Winner = Player | 'Draw' | null;
type GameMode = 'local' | 'online' | null;

export default function TicTacToePage() {
    const [board, setBoard] = useState<(Player | null)[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<Winner>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [scores, setScores] = useState({ X: 0, O: 0 });

    // Game State
    const [mode, setMode] = useState<GameMode>(null);
    const [myName, setMyName] = useState('');
    const [opponentName, setOpponentName] = useState('Opponent');
    const [nameInput, setNameInput] = useState('');
    const [hasEnteredName, setHasEnteredName] = useState(false);

    // Multiplayer State
    const [peerId, setPeerId] = useState<string>('');
    const [conn, setConn] = useState<any | null>(null);
    const [myPlayer, setMyPlayer] = useState<Player | null>(null);
    const [status, setStatus] = useState<string>('');
    const [copied, setCopied] = useState(false);

    const searchParams = useSearchParams();
    const peerRef = useRef<any>(null);

    useEffect(() => {
        // Determine mode from URL
        const gameId = searchParams.get('gameId');
        if (gameId) {
            // If joining via link, we need name first
            if (hasEnteredName) {
                setMode('online');
                initPeer(gameId, true);
            }
        }
    }, [searchParams, hasEnteredName]);

    const handleNameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nameInput.trim()) {
            setMyName(nameInput.trim());
            setHasEnteredName(true);
        }
    };

    const initPeer = async (targetId?: string, isJoining = false) => {
        setStatus('Connecting to server...');
        const { Peer } = await import('peerjs');

        const newPeer = new Peer();

        newPeer.on('open', (id) => {
            setPeerId(id);
            if (isJoining && targetId) {
                setStatus(`Connecting to opponent...`);
                connectToPeer(newPeer, targetId);
            } else {
                setStatus('Waiting for opponent...');
                setMyPlayer('X');
            }
        });

        newPeer.on('connection', (connection) => {
            setConn(connection);
            setupConnection(connection);
        });

        peerRef.current = newPeer;
    };

    const connectToPeer = (peer: any, targetId: string) => {
        const connection = peer.connect(targetId);
        setConn(connection);
        setMyPlayer('O');
        setupConnection(connection);
    };

    const setupConnection = (connection: any) => {
        connection.on('open', () => {
            setStatus('Connected!');
            // Send my name immediately upon connection
            connection.send({ type: 'name', name: myName });
        });

        connection.on('data', (data: any) => {
            if (data.type === 'move') {
                handleMove(data.index, false);
            } else if (data.type === 'reset') {
                resetGame(false);
            } else if (data.type === 'name') {
                setOpponentName(data.name);
                setStatus('Connected! Game starting...');
                // If I am host, I should reply with my name properly if not sent yet
                // But actually open event fires on both sides, so both send names.
            }
        });

        connection.on('close', () => {
            setStatus('Opponent disconnected');
            setConn(null);
            setOpponentName('Opponent');
        });
    };

    const startOnlineGame = () => {
        setMode('online');
        initPeer();
    };

    const copyLink = () => {
        const link = `${window.location.origin}/games/tic-tac-toe?gameId=${peerId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const checkWinner = (squares: (Player | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6]             // Diagonal
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a] as Player, line: lines[i] };
            }
        }
        return null;
    };

    const handleMove = (index: number, emit = true) => {
        if (board[index] || winner) return;

        if (mode === 'online' && emit) {
            if (!conn) return;
            if (isXNext && myPlayer !== 'X') return;
            if (!isXNext && myPlayer !== 'O') return;

            conn.send({ type: 'move', index });
        }

        const newBoard = [...board];
        const currentPlayer = isXNext ? 'X' : 'O';
        newBoard[index] = currentPlayer;
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
            setScores(prev => ({ ...prev, [result.winner]: prev[result.winner] + 1 }));
        } else if (!newBoard.includes(null)) {
            setWinner('Draw');
        } else {
            setIsXNext(!isXNext);
        }
    };

    const resetGame = (emit = true) => {
        if (mode === 'online' && emit && conn) {
            conn.send({ type: 'reset' });
        }
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setWinningLine(null);
    };

    // 1. Name Entry Screen
    if (!hasEnteredName) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
                <Link
                    href="/games"
                    className="absolute top-8 left-8 inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Games</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-slate-800/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-sm"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <User className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-center mb-2">Welcome!</h1>
                    <p className="text-slate-400 text-center mb-8">Enter your name to start playing.</p>

                    <form onSubmit={handleNameSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Your Name"
                            className="w-full h-14 px-6 rounded-xl bg-slate-900 border border-slate-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-white placeholder:text-slate-600 font-bold transition-all text-lg"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!nameInput.trim()}
                            className="w-full h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Start Playing
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // 2. Mode Selection Screen
    if (!mode) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
                <button
                    onClick={() => setHasEnteredName(false)}
                    className="absolute top-8 left-8 inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Change Name</span>
                </button>

                <h1 className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Tic-Tac-Toe
                </h1>
                <p className="text-slate-400 mb-12 text-xl">Hello, <span className="text-white font-bold">{myName}</span>!</p>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setMode('local')}
                        className="group relative p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-purple-500 transition-all text-left overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Users className="w-12 h-12 text-purple-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Local Multiplayer</h2>
                        <p className="text-slate-400">Play against a friend on this device.</p>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startOnlineGame}
                        className="group relative p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-pink-500 transition-all text-left overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Wifi className="w-12 h-12 text-pink-400 mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Online Multiplayer</h2>
                        <p className="text-slate-400">Play with a friend remotely.</p>
                    </motion.button>
                </div>
            </div>
        );
    }

    // 3. Game Screen
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center pt-24 px-4 font-sans selection:bg-purple-500 selection:text-white">

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-4xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => {
                            setMode(null);
                            setConn(null);
                            if (peerRef.current) peerRef.current.destroy();
                        }}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <div className="p-2 rounded-full bg-slate-800 group-hover:bg-slate-700 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-medium">Leave Game</span>
                    </button>

                    {mode === 'online' && !conn && myPlayer === 'X' && (
                        <div className="flex items-center gap-3 bg-slate-800/80 p-2 pr-4 rounded-full border border-slate-700 backdrop-blur-sm">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 text-purple-400">
                                <Share2 className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-300">Invite a friend:</span>
                            <button
                                onClick={copyLink}
                                className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-xs font-bold uppercase tracking-wider"
                            >
                                {copied ? 'Copied!' : 'Copy Link'}
                                <Copy className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Game Section */}
                    <div className="flex flex-col items-center">
                        {mode === 'online' && (
                            <div className="mb-6 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium text-slate-300 flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${conn ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`} />
                                {status}
                            </div>
                        )}

                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
                        >
                            Tic-Tac-Toe
                        </motion.h1>

                        {/* Score Board */}
                        <div className="flex gap-6 mb-8 w-full max-w-xs">
                            <div className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center transition-all duration-300 relative overflow-hidden ${isXNext && !winner ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-slate-700 bg-slate-800/50'} ${(mode === 'online' && myPlayer === 'X') || (mode === 'local') ? 'ring-2 ring-white/20' : ''}`}>
                                <span className="text-3xl font-black text-purple-400 mb-1">X</span>
                                <span className="text-sm text-slate-400 uppercase tracking-wider font-bold truncate max-w-full px-2">
                                    {mode === 'local' ? (myName || 'Player 1') : (myPlayer === 'X' ? myName : opponentName)}
                                </span>
                                <span className="text-2xl font-bold mt-2">{scores.X}</span>
                            </div>

                            <div className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center transition-all duration-300 relative overflow-hidden ${!isXNext && !winner ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-slate-700 bg-slate-800/50'} ${(mode === 'online' && myPlayer === 'O') || (mode === 'local') ? 'ring-2 ring-white/20' : ''}`}>
                                <span className="text-3xl font-black text-pink-400 mb-1">O</span>
                                <span className="text-sm text-slate-400 uppercase tracking-wider font-bold truncate max-w-full px-2">
                                    {mode === 'local' ? 'Player 2' : (myPlayer === 'O' ? myName : opponentName)}
                                </span>
                                <span className="text-2xl font-bold mt-2">{scores.O}</span>
                            </div>
                        </div>

                        {/* Game Board */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative p-6 rounded-3xl bg-slate-800/50 backdrop-blur-xl border border-slate-700 shadow-2xl"
                        >
                            <div className="grid grid-cols-3 gap-3">
                                {board.map((square, i) => {
                                    const isMyTurn = mode === 'local' || (mode === 'online' && conn &&
                                        ((isXNext && myPlayer === 'X') || (!isXNext && myPlayer === 'O')));

                                    return (
                                        <motion.button
                                            key={i}
                                            whileHover={{ scale: !square && !winner && isMyTurn ? 1.05 : 1 }}
                                            whileTap={{ scale: !square && !winner && isMyTurn ? 0.95 : 1 }}
                                            onClick={() => handleMove(i)}
                                            disabled={!!square || !!winner || !isMyTurn}
                                            className={`
                        w-24 h-24 sm:w-28 sm:h-28 rounded-xl text-5xl sm:text-6xl flex items-center justify-center relative overflow-hidden
                        ${!square && !winner && isMyTurn ? 'bg-slate-700/50 hover:bg-slate-700/80 cursor-pointer' : 'bg-slate-800/30 cursor-default'}
                        transition-colors duration-200
                      `}
                                        >
                                            <AnimatePresence>
                                                {square === 'X' && (
                                                    <motion.span
                                                        initial={{ scale: 0, rotate: -45 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        className="font-black text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                                    >
                                                        X
                                                    </motion.span>
                                                )}
                                                {square === 'O' && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="font-black text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                                                    >
                                                        O
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>

                                            {winningLine?.includes(i) && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="absolute inset-0 bg-emerald-500/20 z-0"
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Status Overlay */}
                            <AnimatePresence>
                                {winner && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-3xl"
                                    >
                                        {winner === 'Draw' ? (
                                            <div className="text-center">
                                                <h2 className="text-4xl font-black text-slate-300 mb-2">It's a Draw!</h2>
                                                <p className="text-slate-400">No one won this round.</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                                                <h2 className={`text-5xl font-black mb-2 ${winner === 'X' ? 'text-purple-400' : 'text-pink-400'}`}>
                                                    {winner === 'X'
                                                        ? (mode === 'local' ? myName || 'Player 1' : (myPlayer === 'X' ? myName : opponentName))
                                                        : (mode === 'local' ? 'Player 2' : (myPlayer === 'O' ? myName : opponentName))
                                                    } Wins!
                                                </h2>
                                                <p className="text-slate-300">Congratulations!</p>
                                            </div>
                                        )}

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => resetGame(true)}
                                            className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                                        >
                                            <RefreshCcw className="w-5 h-5" />
                                            Play Again
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {!winner && (
                            <button
                                onClick={() => resetGame(true)}
                                className="mt-8 text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Reset Game
                            </button>
                        )}
                    </div>

                    {/* Info Section (SEO Content) */}
                    <div className="space-y-8 lg:mt-20">
                        <div className="p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-4 text-white">How to Play?</h2>
                            <ul className="space-y-4 text-slate-300 leading-relaxed">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">1</span>
                                    The game is played on a 3x3 grid.
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">2</span>
                                    Player 1 is "X", Player 2 is "O".
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
