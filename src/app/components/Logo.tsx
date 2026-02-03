"use client";

import Image from "next/image";

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
    return (
        <div className={`relative ${className}`}>
            <Image
                src="/sphere-logo-trans.png"
                alt="Kion Logo"
                fill
                className="object-contain"
                priority
            />
        </div>
    );
}
