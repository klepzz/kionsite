'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, ArrowRight } from 'lucide-react';

const games = [
    {
        id: 'tic-tac-toe',
        title: 'Tic-Tac-Toe',
        description: 'The classic game. Play against a friend or challenge the AI.',
        icon: '❌⭕',
        color: 'from-pink-500 to-rose-500',
        path: '/games/tic-tac-toe',
        status: 'Live'
    },
    {
        id: 'codenames',
        title: 'Kion Names',
        description: 'Join SETEJELER or AVEKETLER and compete in this premium word association game.',
        icon: '🕵️',
        color: 'from-blue-600 to-red-600',
        path: '/games/codenames',
        status: 'Live'
    },
    {
        id: 'memory',
        title: 'Memory Cards',
        description: 'Match the cards and test your memory skills.',
        icon: '🧩',
        color: 'from-blue-500 to-indigo-500',
        path: '#',
        status: 'Coming Soon'
    }
];

export default function GamesPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 selection:text-white pb-20">

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
                    >
                        <Gamepad2 className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium text-slate-300">Kion Game Hub</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400"
                    >
                        Play Games, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            Have Fun & Relax
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
                    >
                        Take a break and sharpen your mind. Modern and fluid versions of classic games are here.
                    </motion.p>
                </div>
            </div>

            {/* Games Grid */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        >
                            <Link
                                href={game.path}
                                className={`group relative block h-full p-1 rounded-2xl bg-gradient-to-br ${game.color} hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300`}
                            >
                                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="relative h-full bg-slate-900 rounded-xl p-6 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-50 text-6xl select-none grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">
                                        {game.icon}
                                    </div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center bg-gradient-to-br ${game.color}`}>
                                            <span className="text-2xl">{game.icon}</span>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
                                            {game.title}
                                        </h3>

                                        <p className="text-slate-400 mb-6 flex-grow">
                                            {game.description}
                                        </p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${game.status === 'Live' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                                {game.status}
                                            </span>

                                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
                                                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
}
