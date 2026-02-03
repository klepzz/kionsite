"use client";

import Link from "next/link";
import Image from "next/image";
import { allTests } from "@/lib/tests";

interface RelatedTestsProps {
    category: string;
}

export default function RelatedTests({ category }: RelatedTestsProps) {
    // Basic mapping of blog categories to relevant tests
    const categoryToTestSlug: Record<string, string[]> = {
        psychology: ["multiple-intelligences", "ancient-philosophy"],
        science: ["space-explorer-persona"],
        travel: ["travel-personality"],
        sport: ["multiple-intelligences"],
        technology: ["space-explorer-persona"]
    };

    const recommendedSlugs = categoryToTestSlug[category] || ["creative-archetype"];
    const recommendedTests = allTests.filter(test => recommendedSlugs.includes(test.slug));

    if (recommendedTests.length === 0) return null;

    return (
        <section className="mt-20 border-t border-border pt-16">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Test Your Knowledge</h2>
                    <p className="mt-1 text-muted-foreground">Based on this article, you might like these interactive tests.</p>
                </div>
                <div className="hidden sm:block">
                    <Link href="/tests" className="text-sm font-semibold text-brand-primary hover:underline">
                        View All Tests &rarr;
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {recommendedTests.map((test) => (
                    <Link
                        key={test.id}
                        href={`/tests/${test.slug}`}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 animate-fade-in"
                    >
                        <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                                src={test.imageUrl}
                                alt={test.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl font-bold text-white leading-tight">
                                    {test.title}
                                </h3>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {test.description}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-primary">
                                Try it now
                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
