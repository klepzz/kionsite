"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        const updateScrollCompletion = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
            }
        };

        window.addEventListener("scroll", updateScrollCompletion);

        return () => {
            window.removeEventListener("scroll", updateScrollCompletion);
        };
    }, []);

    return (
        <span
            style={{ transform: `translateX(${completion - 100}%)` }}
            className="fixed top-20 left-0 h-1 w-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-transform duration-150 ease-out z-40"
        />
    );
}
