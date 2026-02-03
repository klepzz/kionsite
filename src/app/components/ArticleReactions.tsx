"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Reaction {
    emoji: string;
    label: string;
    count: number;
}

interface ArticleReactionsProps {
    id: string;
}

export default function ArticleReactions({ id }: ArticleReactionsProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [reactions, setReactions] = useState<Reaction[]>([
        { emoji: "🤯", label: "Mind-blown", count: 0 },
        { emoji: "🤔", label: "Intrigued", count: 0 },
        { emoji: "👏", label: "Helpful", count: 0 },
        { emoji: "❤️", label: "Loved it", count: 0 },
    ]);

    useEffect(() => {
        const saved = localStorage.getItem(`reaction-${id}`);

        const timer = setTimeout(() => {
            if (saved) setSelected(saved);
            setReactions(prev => prev.map(r => ({
                ...r,
                count: Math.floor(Math.random() * 50) + 5
            })));
        }, 0);
        return () => clearTimeout(timer);
    }, [id]);

    const handleReact = (label: string) => {
        if (selected === label) {
            setSelected(null);
            localStorage.removeItem(`reaction-${id}`);
            return;
        }

        setSelected(label);
        localStorage.setItem(`reaction-${id}`, label);

        // In a real app, you would send this to a backend
    };

    return (
        <div className="flex flex-wrap items-center gap-3 my-12 py-6 border-y border-border/40">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-2">How do you feel?</span>

            {reactions.map((reaction) => (
                <button
                    key={reaction.label}
                    onClick={() => handleReact(reaction.label)}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
                        ${selected === reaction.label
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary'
                            : 'bg-card border-border hover:border-brand-primary/50'}
                    `}
                >
                    <span className="text-xl group-hover:scale-125 transition-transform duration-300">
                        {reaction.emoji}
                    </span>
                    <span className="text-sm font-bold">
                        {reaction.count + (selected === reaction.label ? 1 : 0)}
                    </span>

                    {selected === reaction.label && (
                        <motion.span
                            layoutId={`active-reaction-${id}`}
                            className="absolute inset-0 rounded-full border-2 border-brand-primary"
                            initial={false}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                    )}
                </button>
            ))}
        </div>
    );
}
