"use client";

import { allTests } from "@/lib/tests";
import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";

export default function TestsPage() {
    return (
        <div className="min-h-screen bg-stone-100 dark:bg-stone-900 font-sans transition-colors duration-300">
            {/* Structured Data for Quizzes */}
            <Script
                id="quiz-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": allTests.map((test, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "url": `https://bilgilendirildik.com/tests/${test.slug}`,
                            "name": test.title
                        }))
                    })
                }}
            />
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-stone-200 to-transparent dark:from-stone-800" />
            </div>

            <Navbar />

            <main className="relative pt-32 pb-24 px-6 mx-auto max-w-7xl">
                <div className="text-center mb-20">
                    <span className="text-brand-primary font-black tracking-[0.2em] text-sm uppercase mb-6 block opacity-100">Kion Quizzes</span>
                    <h1 className="text-6xl md:text-8xl font-serif font-black text-stone-900 dark:text-white mb-8 tracking-tighter drop-shadow-sm">
                        Explore Your <span className="italic text-brand-primary">Mind.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl md:text-2xl text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                        Scientifically grounded tests to help you understand your mind, your personality, and your potential.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {allTests.map((test, index) => (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: (index % 3) * 0.1, ease: "easeOut" }}
                        >
                            <Link
                                href={`/tests/${test.slug}`}
                                className="group relative flex flex-col h-full overflow-hidden bg-white dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-brand-primary"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200">
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <Image
                                        src={test.imageUrl}
                                        alt={test.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 saturate-[0.9] group-hover:saturate-100"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="bg-brand-primary text-white px-4 py-1.5 text-xs font-black tracking-widest uppercase shadow-md">
                                            Start Quiz
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-8">
                                    <h2 className="mb-4 text-3xl font-serif font-bold text-stone-900 dark:text-white group-hover:text-brand-primary transition-colors leading-tight">
                                        {test.title}
                                    </h2>
                                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed flex-1 font-medium text-lg">
                                        {test.description}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
