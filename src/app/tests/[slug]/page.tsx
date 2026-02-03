"use client";

import { use, useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { allTests, Test, Result } from "@/lib/tests";
import Navbar from "../../components/Navbar";
import Image from "next/image"; // Added Import
import Link from "next/link";
import ShareResultButton from "../../components/ShareResultButton";
import AdPlaceholder from "../../components/AdPlaceholder";
import Script from "next/script";

export default function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]); // Array of result types
    const [result, setResult] = useState<Result | null>(null);
    const [isStarted, setIsStarted] = useState(false); // New state for Start Screen

    const test = useMemo<Test | undefined>(() => {
        return allTests.find(t => t.slug === slug);
    }, [slug]);

    if (!test) {
        notFound();
    }

    // JSON-LD Schema for Google Rich Snippets
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": test.title,
        "description": test.description,
        "mainEntity": test.questions.map(q => ({
            "@type": "Question",
            "name": q.text,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": q.options.find(o => o.value === "correct")?.text || "Answer"
            },
            "suggestedAnswer": q.options.filter(o => o.value !== "correct").map(o => ({
                "@type": "Answer",
                "text": o.text
            }))
        }))
    };

    const handleAnswer = (value: string) => {
        const newAnswers = [...answers, value];
        setAnswers(newAnswers);

        if (currentQuestionIndex < test.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = (finalAnswers: string[]) => {
        // Count occurrences of each result type
        const counts: Record<string, number> = {};
        finalAnswers.forEach(a => {
            counts[a] = (counts[a] || 0) + 1;
        });

        // Find type with max counts
        let maxType = "";
        let maxCount = 0;

        for (const type in counts) {
            if (counts[type] > maxCount) {
                maxCount = counts[type];
                maxType = type;
            }
        }

        const foundResult = test.results.find(r => r.type === maxType);
        if (foundResult) {
            setResult(foundResult);
        }
    };

    const progress = ((currentQuestionIndex) / test.questions.length) * 100;
    const currentQuestion = test.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-background font-sans transition-colors duration-300">
            <Script
                id="quiz-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-32 pb-24 px-6 mx-auto max-w-3xl">
                {!isStarted ? (
                    // START SCREEN (COVER)
                    <div className="flex flex-col items-center text-center animate-in fade-in duration-700">
                        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl mb-12 border-4 border-card">
                            <Image
                                src={test.imageUrl}
                                alt={test.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
                            {test.title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
                            {test.description}
                        </p>

                        <button
                            onClick={() => setIsStarted(true)}
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-brand-primary font-serif rounded-full hover:bg-brand-secondary hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
                        >
                            Start the Test
                            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>

                ) : !result ? (
                    // QUIZ MODE
                    <div className="w-full animate-in slide-in-from-right-8 duration-500">
                        {/* Progress Bar */}
                        <div className="w-full bg-muted rounded-full h-2 mb-8 overflow-hidden">
                            <div
                                className="bg-brand-primary h-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <div className="mb-8">
                            <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider block mb-4">
                                Question {currentQuestionIndex + 1} of {test.questions.length}
                            </span>

                            {/* Question Image (Optional) */}
                            {currentQuestion.imageUrl && (
                                <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 shadow-md">
                                    <Image
                                        src={currentQuestion.imageUrl}
                                        alt="Question Visual"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mt-4 leading-tight">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        <div className="grid gap-4">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option.value)}
                                    className="w-full text-left p-6 rounded-2xl border border-border bg-card hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-200 group"
                                >
                                    <span className="text-lg font-medium text-foreground group-hover:text-brand-primary transition-colors">
                                        {option.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (

                    // RESULT MODE
                    <div className="text-center animate-in fade-in zoom-in duration-500">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold uppercase tracking-wide mb-6">
                            Result Calculated
                        </span>

                        <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${result.imageGradient} flex items-center justify-center mb-8 shadow-2xl`}>
                            <span className="text-6xl">✨</span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
                            {result.title}
                        </h2>

                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            {result.description}
                        </p>

                        {/* Mobile Ad Unit */}
                        <div className="my-8 block md:hidden">
                            <AdPlaceholder type="in-article" />
                        </div>

                        {/* --- NEW SMART FEATURES START --- */}

                        {/* 1. Deep Analysis */}
                        {result.analysis && (
                            <div className="bg-card border border-border rounded-2xl p-8 mb-8 text-left shadow-sm">
                                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                    Deep Analysis
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {result.analysis}
                                </p>
                            </div>
                        )}

                        {/* 2. Actionable Advice */}
                        {result.advice && result.advice.length > 0 && (
                            <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-2xl p-8 mb-8 text-left">
                                <h3 className="text-lg font-bold text-brand-secondary mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    Your Action Plan
                                </h3>
                                <ul className="space-y-3">
                                    {result.advice.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 3. Related Article (Content Combo) */}
                        {result.relatedArticleSlug && (
                            <Link href={`/blog/${result.relatedArticleSlug}`} className="block group mb-12">
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-brand-primary bg-card hover:bg-brand-primary/5 transition-all text-left">
                                    <div className="p-3 bg-muted rounded-lg group-hover:bg-white transition-colors">
                                        <svg className="w-6 h-6 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-xs font-bold uppercase text-muted-foreground block mb-1">Recommended Reading</span>
                                        <span className="font-bold text-foreground group-hover:text-brand-primary">Read the Full Guide on this Topic &rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* 4. Viral Share Buttons */}
                        <div className="mb-12">
                            <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4 tracking-widest">Share Your Result</h3>
                            <ShareResultButton quizTitle={test.title} resultTitle={result.title} slug={test.slug} />
                        </div>

                        {/* --- NEW SMART FEATURES END --- */}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 mb-12 print:hidden">
                            {test?.nextTestSlug && (
                                <Link
                                    href={`/tests/${test.nextTestSlug}`}
                                    className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <span>Next Level Challenge</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            )}

                            <button
                                onClick={() => window.location.reload()}
                                className="px-8 py-4 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all hover:-translate-y-1"
                            >
                                Retake Quiz
                            </button>
                            <Link
                                href="/tests"
                                className="px-8 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-secondary transition-colors shadow-lg"
                            >
                                Try Another Test
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
