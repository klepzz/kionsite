"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AudioPlayerProps {
    textToRead: string;
}

export default function AudioPlayer({ textToRead }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                // Remove HTML tags for cleaner reading if any
                const cleanText = textToRead.replace(/<[^>]*>?/gm, '');
                const utterance = new SpeechSynthesisUtterance(cleanText);

                // Try to find a good quality voice (e.g., Google UK English Male)
                const voices = window.speechSynthesis.getVoices();
                const preferredVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'));
                if (preferredVoice) utterance.voice = preferredVoice;

                utterance.rate = 1.0;
                utterance.pitch = 1.0;

                utterance.onend = () => {
                    setIsPlaying(false);
                    setProgress(0);
                };

                utterance.onboundary = (event) => {
                    // Estimate progress based on character position
                    const totalChars = cleanText.length;
                    setProgress((event.charIndex / totalChars) * 100);
                };

                utteranceRef.current = utterance;
                window.speechSynthesis.speak(utterance);
            }
            setIsPlaying(true);
        }
    };

    return (
        <div className="my-8 p-4 bg-muted/30 border border-border/40 rounded-2xl flex items-center gap-4 transition-all hover:bg-muted/50">
            <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
                {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6zm8 0h4v16h4z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">
                        Listen to Article
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                        {Math.round(progress)}%
                    </span>
                </div>

                {/* Progress Bar Container */}
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-brand-primary"
                    />
                </div>
            </div>

            <div className="hidden sm:block px-4 border-l border-border/60">
                <span className="text-[10px] font-bold text-muted-foreground uppercase whitespace-nowrap">AI VOICE MODE</span>
            </div>
        </div>
    );
}
