"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Comment {
    id: number;
    author: string;
    avatar: string;
    content: string;
    date: string;
    likes: number;
}

export default function Comments() {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("blog-comments");
        const timer = setTimeout(() => {
            if (saved) {
                setComments(JSON.parse(saved));
            } else {
                // Initial mock data
                const initial = [
                    {
                        id: 1,
                        author: "Sarah J.",
                        avatar: "https://i.pravatar.cc/150?u=sarah",
                        content: "This was such an enlightening read! I never realized how much my circadian rhythm affected my productivity in this way.",
                        date: "2 days ago",
                        likes: 12
                    },
                    {
                        id: 2,
                        author: "Mark Wilson",
                        avatar: "https://i.pravatar.cc/150?u=mark",
                        content: "Great insights on the flow state. I've been trying to implement these triggers in my deep work sessions, and the results are already showing.",
                        date: "5 hours ago",
                        likes: 8
                    }
                ];
                setComments(initial);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (comments.length > 0) {
            localStorage.setItem("blog-comments", JSON.stringify(comments));
        }
    }, [comments]);

    const [newComment, setNewComment] = useState("");

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now(),
            author: "Anonymous Guest",
            avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
            content: newComment,
            date: "Just now",
            likes: 0
        };

        setComments([comment, ...comments]);
        setNewComment("");
    };

    return (
        <section className="mt-20 border-t border-border pt-16 pb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">
                Conversations ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="mb-12">
                <div className="group relative rounded-2xl border border-border bg-card p-4 transition-all focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary">
                    <textarea
                        placeholder="What do you think about this?"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full resize-none bg-transparent p-0 text-foreground placeholder-muted-foreground outline-hidden"
                        rows={3}
                    />
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <div className="flex gap-2 text-muted-foreground">
                            {/* Icons placeholder */}
                            <span className="cursor-pointer hover:text-brand-primary">😊</span>
                            <span className="cursor-pointer hover:text-brand-primary">🖼️</span>
                        </div>
                        <button
                            type="submit"
                            className="rounded-full bg-foreground px-6 py-2 text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                            disabled={!newComment.trim()}
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
            </form>

            {/* Comment List */}
            <div className="space-y-8">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 animate-fade-in">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-border">
                            <Image src={comment.avatar} alt={comment.author} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-foreground text-sm">{comment.author}</span>
                                <span className="text-xs text-muted-foreground">• {comment.date}</span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {comment.content}
                            </p>
                            <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                                <button className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {comment.likes > 0 ? comment.likes : "Like"}
                                </button>
                                <button className="hover:text-brand-primary transition-colors">Reply</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
