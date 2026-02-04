import { allPosts } from "@/lib/posts";
import Navbar from "../../components/Navbar";
import { notFound } from "next/navigation";
import ScrollProgress from "../../components/ScrollProgress";
import TableOfContents from "../../components/TableOfContents";
import Script from "next/script";
import Newsletter from "../../components/Newsletter";
import RelatedTests from "../../components/RelatedTests";
import Comments from "../../components/Comments";
import type { Metadata, ResolvingMetadata } from "next";
import React from "react";
import BlogImage from "../../components/BlogImage";
import Reactions from "../../components/Reactions";
import AudioPlayer from "../../components/AudioPlayer";
import ArticleReactions from "../../components/ArticleReactions";
import KeyTakeaways from "../../components/KeyTakeaways";
import ShareButtons from "../../components/ShareButtons";
import InlineQuiz from "../../components/InlineQuiz";

const BASE_URL = "https://kion-blog.vercel.app";

// Static generation of routes
export async function generateStaticParams() {
    return allPosts.map((post) => ({
        slug: post.slug,
    }));
}

// Dynamic SEO Metadata
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const post = allPosts.find((p) => p.slug === slug);

    if (!post) return {};

    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: `${BASE_URL}/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: `${BASE_URL}/blog/${post.slug}`,
            type: "article",
            publishedTime: new Date(post.date).toISOString(),
            authors: ["Kion Editorial Team"],
            tags: post.tags,
            images: [
                {
                    url: post.imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
                ...previousImages,
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [post.imageUrl],
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = allPosts.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const categoryLabels = {
        science: "Science",
        sport: "Sport",
        psychology: "Psychology",
        travel: "Travel",
        technology: "Technology",
    };

    const categoryColors = {
        science: "text-cat-science bg-cat-science/10",
        sport: "text-cat-sport bg-cat-sport/10",
        psychology: "text-cat-psychology bg-cat-psychology/10",
        travel: "text-cat-travel bg-cat-travel/10",
        technology: "text-cat-technology bg-cat-technology/10",
    };

    // Smart Recommendation Algorithm
    const relatedPosts = allPosts
        .filter(p => p.slug !== post.slug) // Exclude current post
        .map(p => {
            let score = 0;
            // High priority: Shared tags
            if (post.tags && p.tags) {
                const sharedTags = post.tags.filter(tag => p.tags?.includes(tag));
                score += sharedTags.length * 10;
            }
            // Medium priority: Same category
            if (p.category === post.category) {
                score += 5;
            }
            return { post: p, score };
        })
        .filter(item => item.score > 0) // Only keep relevant ones
        .sort((a, b) => b.score - a.score) // Highest score first
        .slice(0, 3) // Take top 3
        .map(item => item.post);

    // Calculate reading time (Roughly 200 words per minute)
    const wordCount = post.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-brand-primary/20 transition-colors duration-300">
            <ScrollProgress />
            <Navbar />

            {/* Structured Data (JSON-LD) for SEO */}
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": post.title,
                            "description": post.excerpt,
                            "image": post.imageUrl.startsWith('http') ? post.imageUrl : `${BASE_URL}${post.imageUrl}`,
                            "datePublished": new Date(post.date).toISOString(),
                            "author": {
                                "@type": "Organization",
                                "name": "Kion Editorial Team",
                                "url": `${BASE_URL}/about`
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Kion",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": `${BASE_URL}/logo.png`
                                }
                            },
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": `${BASE_URL}/blog/${post.slug}`
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Home",
                                    "item": BASE_URL
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 2,
                                    "name": "Blog",
                                    "item": `${BASE_URL}/archive`
                                },
                                {
                                    "@type": "ListItem",
                                    "position": 3,
                                    "name": post.title,
                                    "item": `${BASE_URL}/blog/${post.slug}`
                                }
                            ]
                        }
                    ])
                }}
            />

            <main className="pb-24 pt-28 relative">
                {/* Tables of Interactivity */}
                <Reactions slug={post.slug} />

                {/* Social Share - Left Sticky Desktop */}
                <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
                    <ShareButtons slug={post.slug} title={post.title} />
                </div>
                {/* Mobile Share - Fixed Bottom (handled by component CSS) */}
                <div className="md:hidden">
                    <ShareButtons slug={post.slug} title={post.title} />
                </div>

                {/* Table of Contents - Sticky Desktop Sidebar */}
                <TableOfContents content={post.content} />
                <article className="mx-auto max-w-3xl px-6">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${categoryColors[post.category]
                                }`}
                        >
                            {categoryLabels[post.category]}
                        </span>
                        <h1 className="mt-0 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                            {post.title}
                        </h1>
                        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                            <span>{post.date}</span>
                            <span className="h-1 w-1 rounded-full bg-stone-300 dark:bg-stone-700" />
                            <span className="flex items-center gap-1">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {readingTime} min read
                            </span>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative mb-12 overflow-hidden rounded-2xl shadow-lg border border-border">
                        <BlogImage
                            src={post.imageUrl}
                            alt={post.title}
                            className="aspect-video w-full object-cover transition-transform duration-700 hover:scale-105"
                            priority
                        />
                    </div>

                    {/* Audio Player (Listen Mode) */}
                    <AudioPlayer textToRead={post.content} />

                    {/* Key Takeaways (Bento Summary) */}
                    {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                        <KeyTakeaways points={post.keyTakeaways} />
                    )}

                    {/* Content with Glossary Injection */}
                    <div
                        className="prose prose-lg prose-stone dark:prose-invert mx-auto prose-headings:font-bold prose-headings:text-stone-900 dark:prose-headings:text-stone-50 prose-p:text-stone-700 dark:prose-p:text-stone-300 prose-strong:text-stone-900 dark:prose-strong:text-stone-50 prose-a:text-brand-primary hover:prose-a:text-brand-secondary"
                        dangerouslySetInnerHTML={{
                            __html: (() => {
                                let content = post.content.replace(/<(h[23])>(.*?)<\/h[23]>/g, (match, tag, text, offset) => {
                                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + `-${offset}`;
                                    return `<${tag} id="${id}">${text}</${tag}>`;
                                });

                                // Inject Glossary Tooltips
                                if (post.glossary) {
                                    Object.entries(post.glossary).forEach(([term, definition]) => {
                                        const regex = new RegExp(`\\b(${term})\\b`, 'gi');
                                        content = content.replace(regex, `<span class="glossary-term" data-term="${term}" data-definition="${definition}">$1</span>`);
                                    });
                                }
                                return content;
                            })()
                        }}
                    />

                    {/* Inline Quiz */}
                    {post.inlineQuiz && (
                        <InlineQuiz
                            question={post.inlineQuiz.question}
                            options={post.inlineQuiz.options}
                            answer={post.inlineQuiz.answer}
                            explanation={post.inlineQuiz.explanation}
                        />
                    )}

                    {/* Interactive Reactions */}
                    <ArticleReactions id={post.slug} />



                    {/* Related Quizzes Section */}
                    <RelatedTests category={post.category} />

                    {/* Comments Section */}
                    <Comments />

                    {/* Newsletter Subscription */}
                    <div className="mt-16">
                        <Newsletter />
                    </div>

                    {/* Social Share (Static) */}
                    {/* Kept here for fallback, but main share buttons are now sticky/floating */}
                    <div className="mt-12 border-t border-border pt-8">
                        <h3 className="text-sm font-semibold text-foreground mb-4">Share this article</h3>
                        <div className="flex gap-4">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${post.title}&url=https://bilgilendirildik.com/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                Twitter
                            </a>
                            <a
                                href={`https://wa.me/?text=${post.title} https://bilgilendirildik.com/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24" className="h-4 w-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <section className="mx-auto max-w-7xl px-6 mt-24 border-t border-border pt-12">
                            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">You might also like</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {relatedPosts.map((p, index) => (
                                    <div key={index} className="group flex flex-col overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all hover:shadow-md">
                                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                                            <BlogImage
                                                src={p.imageUrl}
                                                alt={p.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col p-6">
                                            <span className={`self-start bg-muted text-muted-foreground inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4`}>
                                                {categoryLabels[p.category]}
                                            </span>
                                            <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-brand-primary transition-colors">
                                                <a href={`/blog/${p.slug}`} className="hover:underline">
                                                    {p.title}
                                                </a>
                                            </h3>
                                            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                                                {p.excerpt}
                                            </p>
                                            <div className="mt-auto text-xs font-medium text-muted-foreground">
                                                {p.date}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </article>
            </main>
        </div>
    );
}
