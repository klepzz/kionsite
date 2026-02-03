"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "../../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Delay showing the banner for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-6 left-6 right-6 z-[100] mx-auto max-w-4xl"
                >
                    <div className="overflow-hidden rounded-2xl border border-border bg-background/95 p-6 shadow-2xl backdrop-blur-md md:p-8">
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <h3 className="text-lg font-bold text-foreground">
                                    {t("cookies.title") || "We value your privacy"}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {t("cookies.description") || "We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking \"Accept All\", you consent to our use of cookies."}
                                    {" "}
                                    <Link href="/privacy" className="font-semibold text-brand-primary hover:underline">
                                        {t("cookies.policy") || "Learn More"}
                                    </Link>
                                </p>
                            </div>
                            <div className="flex w-full flex-shrink-0 items-center justify-center gap-3 md:w-auto">
                                <button
                                    onClick={declineCookies}
                                    className="flex-1 rounded-xl border border-border bg-transparent px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground md:flex-none"
                                >
                                    {t("cookies.decline") || "Reject All"}
                                </button>
                                <button
                                    onClick={acceptCookies}
                                    className="flex-1 rounded-xl bg-brand-primary px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-secondary hover:scale-105 active:scale-95 md:flex-none"
                                >
                                    {t("cookies.accept") || "Accept All"}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
