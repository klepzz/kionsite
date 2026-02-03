"use client";

import Image from "next/image";
import { useState } from "react";

interface BlogImageProps {
    src: string;
    alt: string;
    priority?: boolean;
    className?: string;
    fallbackSrc?: string;
    fill?: boolean;
    width?: number;
    height?: number;
}

export default function BlogImage({
    src,
    alt,
    priority = false,
    className = "",
    fallbackSrc = "/images/norway-fjords-nature.png",
    fill = false,
    width = 1200,
    height = 675
}: BlogImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={fill ? undefined : width}
            height={fill ? undefined : height}
            fill={fill}
            className={className}
            priority={priority}
            onError={() => setImgSrc(fallbackSrc)}
        />
    );
}
