"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface InlineQuizProps {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
}

export default function InlineQuiz({ question, options, answer, explanation }: InlineQuizProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const isCorrect = selected === answer;

    const handleSubmit = () => {
        if (selected) {
            setIsSubmitted(true);
        }
    };

    return (
        <div className="my-12 not-prose">
            <div className="relative overflow-hidden rounded-2xl border-2 border-brand-primary/20 bg-stone-50 dark:bg-stone-900 p-6 sm:p-8 shadow-sm">

                {/* Header Badge */}
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-bl-2xl">
                    Pop Quiz
                </div>

                <h3 className="text-xl font-bold text-foreground mb-6 pr-12 leading-tight">
                    {question}
                </h3>

                <div className="space-y-3 mb-6">
                    {options.map((option, idx) => {
                        let stateStyles = "border-border bg-card hover:bg-muted";

                        if (isSubmitted) {
                            if (option === answer) {
                                stateStyles = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                            } else if (option === selected) {
                                stateStyles = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                            } else {
                                stateStyles = "border-border opacity-50";
                            }
                        } else if (selected === option) {
                            stateStyles = "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary";
                        }

                        return (
                            <button
                                key={idx}
                                disabled={isSubmitted}
                                onClick={() => setSelected(option)}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${stateStyles}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 
                                        ${isSubmitted && option === answer ? 'border-green-500 bg-green-500 text-white' :
                                            isSubmitted && option === selected ? 'border-red-500 text-red-500' :
                                                selected === option ? 'border-brand-primary bg-brand-primary text-white' : 'border-muted-foreground/30'
                                        }`}>
                                        {(isSubmitted && option === answer) || (selected === option && !isSubmitted) ? (
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        ) : isSubmitted && option === selected ? (
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        ) : null}
                                    </div>
                                    <span>{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {!isSubmitted ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!selected}
                        className="w-full py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Check Answer
                    </button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={`rounded-xl p-4 border text-sm leading-relaxed ${isCorrect ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/10 dark:text-green-200' : 'bg-stone-100 border-stone-200 text-stone-800 dark:bg-stone-800 dark:text-stone-200'}`}
                    >
                        <p className="font-bold mb-1">{isCorrect ? "That's right!" : "Not quite."}</p>
                        <p>{explanation}</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
