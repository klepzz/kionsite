"use client";

import Image from "next/image";

interface Author {
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
    socials: {
        twitter?: string;
        linkedin?: string;
        website?: string;
        email?: string;
    };
}

const defaultAuthor: Author = {
    name: "Dr. Kion Vance",
    role: "Lead Researcher & Psychology Expert",
    bio: "Dr. Kion Vance is a cognitive psychologist specializing in human behavior, habit formation, and high-performance states. With over 15 years of research experience, he translates complex scientific concepts into actionable insights for everyday life.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    socials: {
        twitter: "https://twitter.com/kionvance",
        linkedin: "https://linkedin.com/in/kionvance",
        website: "https://kionvance.com",
        email: "contact@kionvance.com",
    },
};

export default function AuthorCard({ author = defaultAuthor }: { author?: Author }) {
    return (
        <div className="mt-16 rounded-3xl bg-stone-100 dark:bg-stone-900/50 p-8 border border-stone-200 dark:border-stone-800 transition-colors">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                {/* Author Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-brand-primary/20 shadow-sm">
                    <Image
                        src={author.imageUrl}
                        alt={author.name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Author Info */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <span className="text-xs font-black uppercase tracking-widest text-brand-primary opacity-80 mb-1 block">
                                Written By
                            </span>
                            <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-50">
                                {author.name}
                            </h3>
                            <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                {author.role}
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center justify-center gap-3">
                            {author.socials.twitter && (
                                <a
                                    href={author.socials.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-brand-primary hover:shadow-md transition-all"
                                >
                                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                            )}
                            {author.socials.linkedin && (
                                <a
                                    href={author.socials.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-brand-primary hover:shadow-md transition-all"
                                >
                                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                </a>
                            )}
                            {author.socials.website && (
                                <a
                                    href={author.socials.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-brand-primary hover:shadow-md transition-all"
                                >
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                </a>
                            )}
                            {author.socials.email && (
                                <a
                                    href={`mailto:${author.socials.email}`}
                                    className="p-2 rounded-full bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-brand-primary hover:shadow-md transition-all"
                                >
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </a>
                            )}
                        </div>
                    </div>

                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed font-serif text-lg">
                        {author.bio}
                    </p>
                </div>
            </div>
        </div>
    );
}
