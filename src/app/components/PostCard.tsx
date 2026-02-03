"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";
import { motion } from "framer-motion";
import React from "react";

interface PostCardProps {
    title: string;
    excerpt: string; // The short summary
    category: "science" | "sport" | "psychology" | "travel" | "technology";
    date: string;
    imageUrl?: string;
    slug: string; // for the link
    featured?: boolean; // If true, card is bigger
    index?: number; // For staggered animation
}

export default function PostCard({
    title,
    excerpt,
    category,
    date,
    imageUrl,
    slug,
    featured = false,
    index = 0,
}: PostCardProps) {
    const { t } = useLanguage();
    const [imgSrc, setImgSrc] = React.useState(imageUrl);

    // Sync state with props if they change
    React.useEffect(() => {
        setImgSrc(imageUrl);
    }, [imageUrl]);

    // Dynamic color selection based on category
    const categoryColors = {
        science: "bg-cat-science/10 text-cat-science",
        sport: "bg-cat-sport/10 text-cat-sport",
        psychology: "bg-cat-psychology/10 text-cat-psychology",
        travel: "bg-cat-travel/10 text-cat-travel",
        technology: "bg-cat-technology/10 text-cat-technology",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={featured ? "md:col-span-2" : "col-span-1"}
        >
            <Link
                href={`/blog/${slug}`}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-card border border-border/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover-shine
        ${featured ? "md:flex-row min-h-[400px]" : "min-h-[450px]"}`}
            >
                {/* Image Section */}
                <div className={`relative overflow-hidden bg-muted/50 ${featured ? "md:w-3/5 aspect-video md:aspect-auto" : "aspect-[4/3]"}`}>
                    {imgSrc ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={imgSrc}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={() => setImgSrc("/images/norway-fjords-nature.png")}
                            />
                            {/* Gradient Overlay for Magazine Look */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-5xl ${categoryColors[category].replace("text-", "bg-").replace("/10", "/20")}`}>
                            📚
                        </div>
                    )}

                    <div className="absolute top-6 left-6 z-10">
                        <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xl bg-white/10 text-white border border-white/20 shadow-xl`}>
                            {t(`blog.categories.${category}`)}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className={`flex flex-col justify-between p-8 ${featured ? "md:w-2/5 lg:p-12" : "lg:p-8"}`}>
                    <div>
                        <div className="mb-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            <span className="w-8 h-[1px] bg-border" />
                            {date}
                        </div>
                        <h3 className={`font-serif font-medium text-foreground group-hover:text-brand-primary transition-colors duration-300 leading-tight ${featured ? "text-3xl lg:text-5xl" : "text-2xl"}`}>
                            {title}
                        </h3>
                        <p className="mt-5 text-muted-foreground/80 line-clamp-3 leading-relaxed font-sans font-normal text-sm lg:text-base">
                            {excerpt}
                        </p>
                    </div>

                    <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-brand-secondary group-hover:text-brand-primary transition-all duration-300">
                        <span className="relative overflow-hidden inline-block py-1">
                            {t("blog.readMore")}
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                        </span>
                        <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
