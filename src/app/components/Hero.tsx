"use client";

import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";
import { motion, Variants } from "framer-motion";

export default function Hero() {
    const { t } = useLanguage();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="relative isolate overflow-hidden bg-background pt-16 pb-12 sm:pt-24 sm:pb-32 transition-colors duration-500">
            {/* Immersive Background Elements */}
            <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-[-10%]" aria-hidden="true">
                <svg viewBox="0 0 1024 1024" className="h-full w-full">
                    <circle cx="512" cy="512" r="512" fill="url(#hero-gradient)" fillOpacity="0.1" />
                    <defs>
                        <radialGradient id="hero-gradient">
                            <stop stopColor="var(--color-brand-secondary)" />
                            <stop offset="1" stopColor="var(--color-background)" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Typography */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-2xl text-center lg:text-left"
                    >
                        <motion.div variants={itemVariants} className="mb-8 inline-flex items-center rounded-full border border-brand-secondary/30 bg-brand-secondary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-secondary">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-secondary mr-2 animate-pulse"></span>
                            {t("blog.weeklyEdition")}
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-6xl font-medium tracking-tight text-foreground sm:text-8xl font-serif leading-[0.9]">
                            {t("hero.title").split(' ')[0]} <br />
                            <span className="italic font-light text-brand-primary/90">{t("hero.title").split(' ').slice(1).join(' ')}</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="mt-8 text-lg leading-relaxed text-muted-foreground font-sans font-normal max-w-xl mx-auto lg:mx-0">
                            {t("hero.subtitle")}
                        </motion.p>

                        <motion.div variants={itemVariants} className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                            <a href="#latest" className="w-full sm:w-auto text-center rounded-full bg-foreground px-10 py-5 text-sm font-bold text-background shadow-2xl hover:bg-brand-primary hover:text-white transition-all duration-500 scale-100 hover:scale-105 active:scale-95">
                                {t("hero.cta")}
                            </a>
                            <a href="/about" className="group text-sm font-bold leading-6 text-foreground flex items-center gap-3 border-b-2 border-transparent hover:border-brand-secondary transition-all py-1">
                                {t("nav.about")}
                                <span className="group-hover:translate-x-1.5 transition-transform duration-300" aria-hidden="true">→</span>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Magazine Collage */}
                    <div className="relative hidden lg:block h-[600px]">
                        {/* Background Texture/Shape */}
                        <div className="absolute inset-0 bg-muted/30 rounded-3xl -rotate-2 scale-95 blur-sm -z-10" />

                        {/* Image 1: Main (Science/Space) */}
                        <motion.div
                            initial={{ x: 40, y: 20, rotate: 8, opacity: 0 }}
                            animate={{ x: 0, y: 0, rotate: 4, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-0 right-4 w-[280px] h-[380px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-[12px] border-card z-10 hover:rotate-0 hover:scale-105 transition-all duration-700 hover-shine"
                        >
                            <Image
                                src="/images/james-webb-telescope.png"
                                alt="Science"
                                fill
                                className="object-cover"
                                priority
                                sizes="300px"
                            />
                        </motion.div>

                        {/* Image 2: Secondary (Travel) */}
                        <motion.div
                            initial={{ x: -40, y: 40, rotate: -12, opacity: 0 }}
                            animate={{ x: 0, y: 0, rotate: -6, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute bottom-8 left-0 w-[240px] h-[300px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[12px] border-card z-20 hover:rotate-0 hover:scale-105 transition-all duration-700 hover-shine"
                        >
                            <Image
                                src="/images/cappadocia-balloons.png"
                                alt="Travel"
                                fill
                                className="object-cover"
                                sizes="250px"
                            />
                        </motion.div>

                        {/* Floating Badge (New Element) */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", delay: 1.4 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-secondary rounded-full flex items-center justify-center text-white text-center p-4 shadow-xl z-30 -rotate-12 border-4 border-background"
                        >
                            <span className="text-xs font-bold leading-tight uppercase tracking-tighter">Exploration & Discovery</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
