"use client";

import { useEffect, useState, useMemo } from "react";

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContents({ content }: { content: string }) {
    const [activeId, setActiveId] = useState<string>("");
    const headings = useMemo<TOCItem[]>(() => {
        if (typeof window === "undefined") return [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, "text/html");
        const headingElements = doc.querySelectorAll("h2, h3");

        return Array.from(headingElements).map((el, index) => {
            const text = el.textContent || "";
            const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${index}`;
            return {
                id,
                text,
                level: el.tagName === "H2" ? 2 : 3,
            };
        });
    }, [content]);

    useEffect(() => {
        if (headings.length === 0) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;

            for (let i = headings.length - 1; i >= 0; i--) {
                const el = document.getElementById(headings[i].id);
                if (el && el.offsetTop <= scrollPosition) {
                    setActiveId(headings[i].id);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [headings]);

    if (headings.length === 0) return null;

    return (
        <div className="sticky top-32 hidden xl:block w-64 -ml-[350px] mb-8">
            <div className="flex items-center gap-2 mb-6 text-stone-900 dark:text-stone-50">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-brand-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                <h2 className="text-sm font-black uppercase tracking-widest opacity-80">On this page</h2>
            </div>
            <nav className="space-y-4">
                {headings.map((heading) => (
                    <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(heading.id)?.scrollIntoView({
                                behavior: "smooth"
                            });
                        }}
                        className={`block text-sm transition-all duration-300 ${heading.level === 3 ? "ml-4" : ""
                            } ${activeId === heading.id
                                ? "text-brand-primary font-bold border-l-2 border-brand-primary pl-4"
                                : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 border-l-2 border-stone-200 dark:border-stone-800 pl-4"
                            }`}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
