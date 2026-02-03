"use client";

import { allPosts } from "@/lib/posts";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PostCard from "./components/PostCard";
import DailyChallenge from "./components/DailyChallenge";
import { useLanguage } from "../context/LanguageContext";
import { allTests } from "@/lib/tests";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  const { t } = useLanguage();
  const posts = allPosts;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-brand-primary/20 transition-colors duration-300">
      <Navbar />

      <main className="pb-24">
        <Hero />

        <div className="mx-auto max-w-7xl px-6 mb-20">
          <DailyChallenge />
        </div>

        {/* Discovery Hub (Quizzes) */}
        <div className="bg-stone-50 dark:bg-stone-900/50 py-20 mb-20 border-y border-border/50">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-xl">
                <h2 className="text-3xl font-serif font-medium text-foreground mb-4">Discover Your Mind</h2>
                <p className="text-muted-foreground text-lg">Interactive tests to help you understand your personality, intelligence, and potential.</p>
              </div>
              <Link href="/tests" className="text-brand-primary font-semibold hover:underline flex items-center gap-2">
                Explore All Tests
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allTests.slice(0, 3).map((test, index) => (
                <motion.div
                  key={test.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/tests/${test.slug}`}
                    className="group flex flex-col h-full bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={test.imageUrl}
                        alt={test.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{test.title}</h3>
                        <div className="flex items-center gap-x-2 text-white/80 text-xs font-semibold tracking-wider uppercase">
                          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                          Take the Quiz
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6" id="latest">
          <div className="mb-8 flex items-end justify-between border-b border-border pb-4">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{t("blog.latest")}</h2>
            <a href="/archive" className="text-sm font-medium text-brand-primary hover:text-brand-secondary">
              {t("hero.cta")} &rarr;
            </a>
          </div>

          {/* The Masonry-like Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard
                key={post.slug}
                index={index}
                {...post}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
