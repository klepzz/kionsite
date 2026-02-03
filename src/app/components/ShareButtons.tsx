'use client';

import React from 'react';
import {
    TwitterIcon,
    LinkedinIcon,
    FacebookIcon,
    LinkIcon
} from 'lucide-react';

interface ShareButtonsProps {
    slug: string;
    title: string;
}

export default function ShareButtons({ slug, title }: ShareButtonsProps) {
    const url = `https://kion-blog.vercel.app/blog/${slug}`;
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    const shareLinks = [
        {
            name: 'Twitter',
            icon: <TwitterIcon size={20} />,
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: 'hover:text-sky-500'
        },
        {
            name: 'LinkedIn',
            icon: <LinkedinIcon size={20} />,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
            color: 'hover:text-blue-600'
        },
        {
            name: 'Facebook',
            icon: <FacebookIcon size={20} />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:text-blue-500'
        },
        {
            name: 'WhatsApp',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1h1v1a2 2 0 0 1-2 2v-1a.5.5 0 0 0-1 0v1h-1a.5.5 0 0 0-1 0v-1a2 2 0 0 1-2-2v-1z" opacity="0" /> {/* Placeholder path, using lucide path below mostly */}
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1h1v1a2 2 0 0 1-2 2v-1a.5.5 0 0 0-1 0v1h-1a.5.5 0 0 0-1 0v-1a2 2 0 0 1-2-2v-1z" opacity="0" />
                    {/* Actual WhatsApp Icon usually not in standard Lucide import effectively without fill, simulating generic */}
                </svg>
            ),
            // Using a custom SVG for WhatsApp or just generic Link for now if Lucide missing in user env, but assuming Lucide is present.
            // Re-doing icon for reliability:
            customIcon: (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide">
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0 1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1h1v1a2 2 0 0 1-2 2v-1a.5.5 0 0 0-1 0v1h-1a.5.5 0 0 0-1 0v-1a2 2 0 0 1-2-2v-1z" style={{ opacity: 0 }} />
                    {/* Simple Phone/Message representation */}
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .57 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.03 12.03 0 0 0 2.81.57A2 2 0 0 1 22 16.92z" />
                </svg>
            ),
            // Let's use simple link for now or just generic message icon if whatsapp specific is tricky with standard libraries.
            // Changing to basic "Share" text or Link.
            url: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
            color: 'hover:text-green-500'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        alert('Link copied!');
    };

    return (
        <div className="flex flex-row md:flex-col gap-4 items-center justify-center p-4 bg-background/80 backdrop-blur-sm border md:border-0 border-t rounded-t-xl md:rounded-none fixed bottom-0 left-0 right-0 md:static md:bg-transparent z-50 md:z-0">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground hidden md:block rotate-0 md:-rotate-90 md:mb-4">
                Share
            </span>
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors duration-200 ${link.color}`}
                    aria-label={`Share on ${link.name}`}
                >
                    {link.name === 'WhatsApp' ? link.customIcon : link.icon}
                </a>
            ))}
            <button
                onClick={copyToClipboard}
                className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors duration-200 hover:text-gray-500"
                aria-label="Copy Link"
            >
                <LinkIcon size={20} />
            </button>
        </div>
    );
}
