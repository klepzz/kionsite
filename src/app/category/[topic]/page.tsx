import { allPosts } from "@/lib/posts";
import Navbar from "../../components/Navbar";
import PostCard from "../../components/PostCard";
import React from "react";
import { Metadata } from 'next';

const BASE_URL = "https://kion-blog.vercel.app";

const categoryMap: Record<string, "science" | "sport" | "psychology" | "travel" | "technology"> = {
    "bilim": "science",
    "spor": "sport",
    "psikoloji": "psychology",
    "seyahat": "travel",
    "teknoloji": "technology",
    "science": "science",
    "sport": "sport",
    "psychology": "psychology",
    "travel": "travel",
    "technology": "technology"
};

const categoryLabels: Record<string, string> = {
    science: "Science",
    sport: "Sport",
    psychology: "Psychology",
    travel: "Travel",
    technology: "Technology"
};

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
    const { topic } = await params;
    const category = categoryMap[topic.toLowerCase()];
    const label = category ? categoryLabels[category] : topic;

    return {
        title: `${label} Articles`,
        description: `Explore our collection of ${label} articles. Quality content and deep insights onto the world of ${label}.`,
        alternates: {
            canonical: `${BASE_URL}/category/${topic}`,
        }
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = await params;
    const category = categoryMap[topic.toLowerCase()];

    if (!category) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="pt-32 text-center text-foreground">Category NOT Found</div>
            </div>
        );
    }

    const filteredPosts = allPosts.filter(post => post.category === category);

    return (
        <div className="min-h-screen bg-background font-sans transition-colors duration-300">
            <Navbar />

            <main className="pt-32 pb-24">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-12 text-center">
                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            {categoryLabels[category]}
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Discover the latest articles in this field.
                        </p>
                    </div>

                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.map((post, index) => (
                                <PostCard
                                    key={post.slug}
                                    index={index}
                                    {...post}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-medium text-foreground">No articles in this category yet.</h3>
                            <p className="text-muted-foreground mt-2">But our editors are working hard!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
