"use client";

import { motion } from "framer-motion";

interface KeyTakeawaysProps {
    points: string[];
}

export default function KeyTakeaways({ points }: KeyTakeawaysProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="my-12 p-1 bg-gradient-to-br from-brand-secondary/20 via-transparent to-brand-primary/20 rounded-[2.5rem]"
        >
            <div className="bg-card/80 backdrop-blur-sm rounded-[2.4rem] p-8 lg:p-10 border border-border/40">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-serif font-bold tracking-tight text-foreground">
                        Key Takeaways
                    </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {points.map((point, idx) => (
                        <div key={idx} className="flex gap-4">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black flex items-center justify-center">
                                {idx + 1}
                            </span>
                            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                                {point}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
