"use client";

import { useEffect, useState } from "react";

const facts = [
    {
        topic: "Psychology",
        content: "The 'Zeigarnik Effect' states that our brains remember uncompleted or interrupted tasks better than completed ones.",
        source: "Bluma Zeigarnik (1927)"
    },
    {
        topic: "Science",
        content: "Neurons in your brain transmit signals at speeds up to 268 miles per hour (431 km/h).",
        source: "Neuroscience Dept."
    },
    {
        topic: "History",
        content: "Cleopatra lived closer in time to the release of the dynamic Kion blog than to the construction of the Great Pyramids.",
        source: "Historical Records"
    },
    {
        topic: "Technology",
        content: "The first computer mouse was carved out of wood by Douglas Engelbart in 1964.",
        source: "Computer History Museum"
    },
    {
        topic: "Psychology",
        content: "It takes an average of 66 days for a new behavior to become an automatic habit, according to UCL research.",
        source: "University College London"
    }
];

export default function DailyFact() {
    const [fact, setFact] = useState(facts[0]);

    useEffect(() => {
        // Select a random fact on mount
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        const timer = setTimeout(() => {
            setFact(randomFact);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-brand-primary/10 border border-brand-primary/20 p-8 transition-all hover:shadow-xl hover:-translate-y-1">
            {/* Decorative Icon */}
            <div className="absolute -top-6 -right-6 text-brand-primary opacity-10">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-32 h-32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                        Quick Fact
                    </span>
                    <span className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-widest opacity-60">
                        {fact.topic}
                    </span>
                </div>

                <p className="text-xl font-serif font-medium text-stone-900 dark:text-stone-50 leading-relaxed italic mb-4">
                    &quot;{fact.content}&quot;
                </p>

                <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 dark:text-stone-500 uppercase tracking-tighter">
                    <span>Source: {fact.source}</span>
                    <span className="opacity-40 tracking-widest">— Kion Daily Insights</span>
                </div>
            </div>
        </div>
    );
}
