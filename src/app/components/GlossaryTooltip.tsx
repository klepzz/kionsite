"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GlossaryTooltipProps {
    term: string;
    definition: string;
    children: React.ReactNode;
}

export default function GlossaryTooltip({ term, definition, children }: GlossaryTooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <span className="relative inline-block group">
            <span
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
                className="cursor-help border-b-2 border-dotted border-brand-secondary/40 hover:border-brand-secondary transition-colors"
            >
                {children}
            </span>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 z-50 rounded-2xl bg-card/95 backdrop-blur-xl border border-border/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)]"
                    >
                        <div className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary mb-1">
                            Definition
                        </div>
                        <div className="text-sm font-bold text-foreground mb-2">
                            {term}
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                            {definition}
                        </div>

                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                            <div className="w-3 h-3 bg-card border-b border-r border-border/60 rotate-45" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
