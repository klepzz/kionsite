"use client";

import { useState, useEffect } from "react";

interface Comment {
    id: string;
    text: string;
    date: string;
}

export default function PostInteractions({ slug }: { slug: string }) {
    // ---- REACTIONS ----
    const [claps, setClaps] = useState(0);
    const [hasClapped, setHasClapped] = useState(false);
    const handleClap = () => {
        const newClaps = claps + 1;
        setClaps(newClaps);
        setHasClapped(true);
        localStorage.setItem(`claps-${slug}`, newClaps.toString());
        localStorage.setItem(`has-clapped-${slug}`, "true");
    };

    // ---- COMMENTS ----
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const storedClaps = localStorage.getItem(`claps-${slug}`);
        const userClapped = localStorage.getItem(`has-clapped-${slug}`);
        const storedComments = localStorage.getItem(`comments-${slug}`);

        if (storedClaps || userClapped || storedComments) {
            // Defer slightly to avoid cascading render warning
            const timer = setTimeout(() => {
                if (storedClaps) setClaps(parseInt(storedClaps));
                if (userClapped) setHasClapped(true);
                if (storedComments) setComments(JSON.parse(storedComments));
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [slug]);

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment: Comment = {
            id: Date.now().toString(),
            text: newComment,
            date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
        };

        const updatedComments = [comment, ...comments];
        setComments(updatedComments);
        localStorage.setItem(`comments-${slug}`, JSON.stringify(updatedComments));
        setNewComment("");
    };

    return (
        <div className="mt-12 border-t border-border pt-12">

            {/* Reaction Section */}
            <div className="flex flex-col items-center justify-center mb-16">
                <button
                    onClick={handleClap}
                    className={`group relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${hasClapped
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/40 scale-110"
                        : "bg-muted text-muted-foreground hover:bg-brand-primary/10 hover:scale-105"
                        }`}
                >
                    <span className="text-4xl">👏</span>
                    <span className={`absolute -top-12 text-lg font-bold transition-all ${hasClapped ? "text-brand-primary opacity-100" : "opacity-0 translate-y-4"}`}>
                        +{claps}
                    </span>
                </button>
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                    {hasClapped ? "Thanks for clapping!" : "Clap if you liked this!"}
                </p>
            </div>

            {/* Comment Section */}
            <div className="max-w-2xl mx-auto bg-card rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-xl font-bold text-foreground mb-6">Discussion ({comments.length})</h3>

                <form onSubmit={handleSubmitComment} className="mb-10">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full rounded-xl border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none min-h-[120px]"
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Post Comment
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-muted/50">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                    ?
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-foreground text-sm">Guest Reader</span>
                                        <span className="text-xs text-muted-foreground">• {comment.date}</span>
                                    </div>
                                    <p className="text-sm text-foreground/80 leading-relaxed">{comment.text}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
