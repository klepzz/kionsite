"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArticlePollProps {
    id: string; // Unique ID for storing state
    question: string;
    options: string[];
}

export default function ArticlePoll({ id, question, options }: ArticlePollProps) {
    const [voted, setVoted] = useState(false);
    const [counts, setCounts] = useState<number[]>([]);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(`poll-${id}`);
        // Mocking some initial random counts for demo purposes
        const mockCounts = options.map(() => Math.floor(Math.random() * 100) + 10);

        const timer = setTimeout(() => {
            if (saved) {
                setVoted(true);
                setSelectedIdx(parseInt(saved));
            }
            setCounts(mockCounts);
        }, 0);
        return () => clearTimeout(timer);
    }, [id, options]);

    const handleVote = (index: number) => {
        if (voted) return;

        const newCounts = [...counts];
        newCounts[index] += 1;

        setCounts(newCounts);
        setVoted(true);
        setSelectedIdx(index);
        localStorage.setItem(`poll-${id}`, index.toString());
    };

    const totalVotes = counts.reduce((a, b) => a + b, 0);

    return (
        <div className="my-12 p-8 bg-card border border-border/60 rounded-[2rem] shadow-sm overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-10 -mt-10 blur-2xl" />

            <h3 className="text-xl font-serif font-bold text-foreground mb-6 relative z-10">
                {question}
            </h3>

            <div className="space-y-3 relative z-10">
                {options.map((option, idx) => {
                    const percentage = totalVotes > 0 ? Math.round((counts[idx] / totalVotes) * 100) : 0;

                    return (
                        <button
                            key={idx}
                            onClick={() => handleVote(idx)}
                            disabled={voted}
                            className={`group relative w-full p-4 text-left rounded-xl border transition-all duration-300
                                ${voted ? 'border-transparent cursor-default' : 'border-border hover:border-brand-primary hover:bg-brand-primary/5'}
                            `}
                        >
                            <AnimatePresence>
                                {voted && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`absolute inset-0 rounded-xl ${idx === selectedIdx ? 'bg-brand-primary/20' : 'bg-muted/50'}`}
                                    />
                                )}
                            </AnimatePresence>

                            <div className="relative flex justify-between items-center z-10">
                                <span className={`font-medium transition-colors ${voted && idx === selectedIdx ? 'text-brand-primary' : 'text-foreground'}`}>
                                    {option}
                                </span>
                                {voted && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs font-bold text-muted-foreground"
                                    >
                                        {percentage}%
                                    </motion.span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {voted && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-[11px] font-bold uppercase tracking-widest text-muted-foreground text-center"
                >
                    {totalVotes} total votes recorded
                </motion.p>
            )}
        </div>
    );
}
