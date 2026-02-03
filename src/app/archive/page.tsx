"use client";

import { useState, useMemo } from "react";
import { allPosts } from "@/lib/posts";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const categories = ["all", "science", "sport", "psychology", "travel", "technology"];

    const filteredPosts = useMemo(() => {
        return allPosts.filter(post => {
            const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
            return matchesQuery && matchesCategory;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="min-h-screen bg-background font-sans transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12">
                        Explore the <span className="text-brand-primary">Discoveries</span>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Uncover stories from the frontiers of science, travel, and more.
                        </p>

                        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center">
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by title or topic..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-2xl border-border bg-card py-4 pl-12 pr-4 text-foreground shadow-sm focus:border-brand-primary focus:ring-brand-primary transition-all"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`rounded-full px-6 py-2.5 text-base font-bold tracking-tight transition-all ${selectedCategory === cat
                                            ? "bg-brand-primary text-white shadow-lg scale-105"
                                            : "bg-muted text-muted-foreground hover:bg-border hover:scale-105"
                                            } capitalize`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-8 text-sm text-muted-foreground animate-fade-in">
                        Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
                    </div>

                    {/* Grid */}
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                            {filteredPosts.map((post, index) => (
                                <PostCard
                                    key={post.slug}
                                    index={index}
                                    {...post}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center animate-fade-in">
                            <div className="text-6xl mb-6">🔍</div>
                            <h3 className="text-2xl font-bold text-foreground">No matches found</h3>
                            <p className="mt-2 text-muted-foreground">Try adjusting your search query or filters.</p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                                className="mt-8 text-brand-primary font-semibold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
