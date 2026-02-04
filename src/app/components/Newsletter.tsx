"use client";

import { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function Newsletter() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        // Simulate API call
        setTimeout(() => {
            setStatus("success");
            setEmail("");
            // Save to local storage
            const subscriptions = JSON.parse(localStorage.getItem("newsletter-subs") || "[]");
            if (!subscriptions.includes(email)) {
                subscriptions.push(email);
                localStorage.setItem("newsletter-subs", JSON.stringify(subscriptions));
            }
        }, 1500);
    };

    return (
        <section className="relative overflow-hidden rounded-3xl bg-stone-900 px-6 py-12 dark:bg-stone-950 sm:px-12 sm:py-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-brand-primary blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-brand-secondary blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {t("newsletter.title")}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-stone-300">
                    {t("newsletter.subtitle")}
                </p>

                <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <label htmlFor="email-address" className="sr-only">
                        {t("newsletter.email")}
                    </label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder={t("newsletter.email") || "your@email.com"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-full border-0 bg-white/10 px-6 py-4 text-white placeholder-stone-500 outline-hidden ring-1 ring-white/20 transition-all focus:bg-white/15 focus:ring-brand-primary"
                        disabled={status === "submitting" || status === "success"}
                        aria-label={t("newsletter.email")}
                        aria-describedby="newsletter-privacy"
                    />
                    <button
                        type="submit"
                        disabled={status === "submitting" || status === "success"}
                        className="group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-brand-primary px-8 py-4 text-sm font-bold tracking-wider text-white uppercase transition-all hover:bg-emerald-500 disabled:opacity-50"
                        aria-label={status === "submitting" ? "Submitting" : t("newsletter.button")}
                    >
                        {status === "submitting" ? (
                            <span className="flex items-center gap-2">
                                <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                ...
                            </span>
                        ) : status === "success" ? (
                            t("newsletter.success")
                        ) : (
                            <>
                                {t("newsletter.button")}
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
                <p id="newsletter-privacy" className="mt-4 text-xs text-stone-500">
                    {t("newsletter.privacy") || "No spam. Unsubscribe at any time."}
                </p>
            </div>
        </section>
    );
}
