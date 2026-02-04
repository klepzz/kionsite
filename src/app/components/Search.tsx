"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { allPosts } from "@/lib/posts";

export default function Search() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredPosts = useMemo(() => {
        return query.length > 0
            ? allPosts.filter(post =>
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5) // Limit to 5 results
            : [];
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            } else if (isOpen) {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev < filteredPosts.length - 1 ? prev + 1 : prev));
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
                } else if (e.key === "Enter" && selectedIndex >= 0) {
                    e.preventDefault();
                    const selectedPost = filteredPosts[selectedIndex];
                    if (selectedPost) {
                        router.push(`/blog/${selectedPost.slug}`);
                        setIsOpen(false);
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredPosts, selectedIndex, router]);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
                setSelectedIndex(-1);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[60] bg-zinc-900/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4" onClick={() => setIsOpen(false)}>
                    <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800" onClick={e => e.stopPropagation()}>
                        <div className="relative border-b border-zinc-100 dark:border-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search articles..."
                                className="w-full h-16 pl-12 pr-12 bg-transparent text-lg text-slate-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setSelectedIndex(-1);
                                }}
                            />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-zinc-500 bg-zinc-100 border border-zinc-300 rounded-md dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400">ESC</kbd>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="sm:hidden w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto">
                            {query.length > 0 && filteredPosts.length === 0 && (
                                <div className="p-8 text-center text-zinc-500">
                                    No results found for &quot;{query}&quot;.
                                </div>
                            )}

                            {filteredPosts.map((post, index) => (
                                <button
                                    key={post.slug}
                                    onClick={() => {
                                        router.push(`/blog/${post.slug}`);
                                        setIsOpen(false);
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full flex items-center gap-4 p-4 text-left transition-colors border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${index === selectedIndex
                                        ? "bg-zinc-100 dark:bg-zinc-800"
                                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        }`}
                                >
                                    <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                                        <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h4 className={`font-semibold line-clamp-1 ${index === selectedIndex
                                            ? "text-brand-primary"
                                            : "text-slate-900 dark:text-zinc-100"
                                            }`}>
                                            {post.title}
                                        </h4>
                                        <p className="text-sm text-zinc-500 line-clamp-1">{post.excerpt}</p>
                                    </div>
                                </button>
                            ))}

                            {query.length === 0 && (
                                <div className="p-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                                    Type to start searching...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
