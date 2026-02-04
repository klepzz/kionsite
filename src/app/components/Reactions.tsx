"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ReactionsProps {
    slug: string;
}

export default function Reactions({ slug }: ReactionsProps) {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem("liked-posts") || "[]");
        const bookmarkedPosts = JSON.parse(localStorage.getItem("bookmarked-posts") || "[]");
        const isLiked = likedPosts.includes(slug);

        const timer = setTimeout(() => {
            setLiked(isLiked);
            setBookmarked(bookmarkedPosts.includes(slug));
            setLikeCount(Math.floor(Math.random() * 50) + 10 + (isLiked ? 1 : 0));
        }, 0);

        return () => clearTimeout(timer);
    }, [slug]);

    const toggleLike = () => {
        const likedPosts = JSON.parse(localStorage.getItem("liked-posts") || "[]");
        if (liked) {
            const index = likedPosts.indexOf(slug);
            if (index > -1) likedPosts.splice(index, 1);
            setLikeCount(prev => prev - 1);
        } else {
            likedPosts.push(slug);
            setLikeCount(prev => prev + 1);
        }
        localStorage.setItem("liked-posts", JSON.stringify(likedPosts));
        setLiked(!liked);
    };

    const toggleBookmark = () => {
        const bookmarkedPosts = JSON.parse(localStorage.getItem("bookmarked-posts") || "[]");
        if (bookmarked) {
            const index = bookmarkedPosts.indexOf(slug);
            if (index > -1) bookmarkedPosts.splice(index, 1);
        } else {
            bookmarkedPosts.push(slug);
        }
        localStorage.setItem("bookmarked-posts", JSON.stringify(bookmarkedPosts));
        setBookmarked(!bookmarked);
    };

    return (
        <div className="fixed left-6 top-1/2 hidden -translate-y-1/2 flex-col gap-4 lg:flex z-40">
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLike}
                className={`flex h-12 w-12 flex-col items-center justify-center rounded-full border border-border shadow-sm transition-colors ${liked ? "bg-rose-50 text-rose-500 border-rose-200" : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
            >
                <svg className="h-6 w-6" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -bottom-8 text-xs font-bold text-muted-foreground">{likeCount}</span>
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleBookmark}
                className={`flex h-12 w-12 items-center justify-center rounded-full border border-border shadow-sm transition-colors ${bookmarked ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20" : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
            >
                <svg className="h-6 w-6" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.1 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </motion.button>
        </div>
    );
}
