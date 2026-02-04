"use client";

import React, { useMemo } from "react";

interface InteractiveContentProps {
    content: string;
    glossary?: Record<string, string>;
}

export default function InteractiveContent({ content, glossary }: InteractiveContentProps) {
    // We'll use a slightly different approach: 
    // Instead of raw string replacement, we'll try to keep it as React nodes
    // For simplicity in this demo, we'll split the content by terms and map them
    // Note: This is a basic implementation. For complex HTML, a more robust parser would be needed.

    const renderedContent = useMemo(() => {
        if (!glossary) return <div dangerouslySetInnerHTML={{ __html: content }} />;

        const terms = Object.keys(glossary);
        if (terms.length === 0) return <div dangerouslySetInnerHTML={{ __html: content }} />;

        // Create a regex for all terms (logic currently handled via string replacement)


        // This is tricky because content is HTML. 
        // We'll do a simple split and hope for the best for now, 
        // but better to only replace text nodes.

        // As a safer alternative for this specific blog architecture:
        // We'll use the dangerouslySetInnerHTML but with a CSS-based tooltip 
        // or a global event listener approach.

        return (
            <div
                className="prose prose-lg prose-stone dark:prose-invert mx-auto"
                dangerouslySetInnerHTML={{
                    __html: (() => {
                        let html = content;
                        Object.entries(glossary).forEach(([term, definition]) => {
                            const termRegex = new RegExp(`\\b(${term})\\b`, 'gi');
                            // Injecting a structure that CSS can handle
                            html = html.replace(termRegex, `
                                <span class="glossary-term" data-term="${term}" data-definition="${definition}">
                                    $1
                                </span>
                            `);
                        });
                        return html;
                    })()
                }}
            />
        );
    }, [content, glossary]);

    return renderedContent;
}
