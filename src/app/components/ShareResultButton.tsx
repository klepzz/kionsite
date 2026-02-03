'use client';

import React from 'react';
import {
    TwitterIcon,
    LinkIcon
} from 'lucide-react';

interface ShareResultButtonProps {
    quizTitle: string;
    resultTitle: string;
    slug: string;
}

export default function ShareResultButton({ quizTitle, resultTitle, slug }: ShareResultButtonProps) {
    const url = `https://kion-blog.vercel.app/tests/${slug}`;
    const text = `I got "${resultTitle}" on the ${quizTitle} quiz! What are you? Find out here:`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Link copied to clipboard!');
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <a
                href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2] text-white font-bold hover:bg-[#1a91da] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                <TwitterIcon size={20} />
                Share on X
            </a>

            <a
                href={`https://wa.me/?text=${encodedText} ${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20bd5a] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1h1v1a2 2 0 0 1-2 2v-1a.5.5 0 0 0-1 0v1h-1a.5.5 0 0 0-1 0v-1a2 2 0 0 1-2-2v-1z" style={{ opacity: 0 }} />
                    {/* Simple Phone/Message representation for Whatsapp */}
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.57A2 2 0 0 1 22 16.92z" />
                </svg>
                Share on WhatsApp
            </a>

            <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border-2 border-border text-foreground font-bold hover:bg-muted transition-colors shadow-md"
            >
                <LinkIcon size={20} />
                Copy Link
            </button>
        </div>
    );
}
