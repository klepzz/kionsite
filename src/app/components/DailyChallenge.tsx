"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
    {
        id: 1,
        type: "quiz",
        question: "Which planet has the most moons?",
        options: ["Jupiter", "Saturn", "Uranus", "Mars"],
        answer: "Saturn",
        fact: "Saturn has 146 confirmed moons, overtaking Jupiter's 95."
    },
    {
        id: 2,
        type: "quiz",
        question: "What is the 'Zeigarnik Effect'?",
        options: ["Fear of open spaces", "Remembering unfinished tasks", "Forgetting names instantly", "Craving sugar when stressed"],
        answer: "Remembering unfinished tasks",
        fact: "Our brains prioritize incomplete tasks to ensure we finish them."
    },
    {
        id: 3,
        type: "quiz",
        question: "Does 'absolute zero' freeze time?",
        options: ["Yes", "No", "Theoretically", "Only for light"],
        answer: "Theoretically",
        fact: "At absolute zero, entropy reaches its minimum value, effectively 'pausing' thermodynamic time."
    }
];

export default function DailyChallenge() {
    const [challenge, setChallenge] = useState(questions[0]);
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        // Simple daily rotation based on date
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        setChallenge(questions[dayOfYear % questions.length]);
    }, []);

    const handleAnswer = (option: string) => {
        if (selected) return; // Prevent changing answer
        setSelected(option);
        setIsCorrect(option === challenge.answer);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/20">
                        Daily Challenge
                    </span>
                    <span className="text-white/60 text-xs font-mono">
                        #{challenge.id}
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    {!selected ? (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold font-serif leading-tight">
                                {challenge.question}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {challenge.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option)}
                                        className="text-left px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/30 transition-all font-medium text-sm sm:text-base backdrop-blur-sm"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 ${isCorrect ? 'bg-green-500' : 'bg-red-500'} shadow-lg`}>
                                {isCorrect ? '✓' : '✕'}
                            </div>

                            <h3 className="text-2xl font-bold mb-2">
                                {isCorrect ? 'Correct!' : 'Oops!'}
                            </h3>

                            <p className="text-lg text-white/90 leading-relaxed mb-6">
                                {isCorrect ? "Well done! You know your stuff." : `The correct answer was: ${challenge.answer}`}
                            </p>

                            <div className="bg-white/10 rounded-xl p-4 text-left border border-white/10">
                                <span className="block text-xs font-bold uppercase opacity-50 mb-1">Did you know?</span>
                                <p className="text-sm opacity-90">{challenge.fact}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
