"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";
import { usePathname } from "next/navigation";
import Search from "./Search";
import Logo from "./Logo";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect } from "react";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { t } = useLanguage();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll effect for glassmorphism intensity
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: t("nav.home"), path: "/" },
        { name: t("nav.archive"), path: "/archive" },
        { name: t("nav.quizzes"), path: "/tests" },
        { name: t("nav.about"), path: "/about" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b
            ${scrolled
                    ? "bg-background/80 backdrop-blur-xl border-border/40 h-20"
                    : "bg-background/0 backdrop-blur-none border-transparent h-24 max-h-24"
                }`}
        >
            <div className="mx-auto max-w-7xl px-6 h-full">
                <div className="flex h-full items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" className="group flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-brand-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110">
                                <Logo className="h-10 w-10 md:h-12 md:w-12 text-foreground" />
                            </div>
                        </div>
                        <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-serif">
                            Kion<span className="text-brand-primary">.</span>
                        </span>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    {/* Navigation Links - Desktop */}
                    <div className="hidden lg:flex items-center gap-1 bg-stone-200/50 dark:bg-stone-800/50 p-1.5 rounded-full border border-border/20 backdrop-blur-md shadow-sm">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`relative px-6 py-2.5 rounded-full text-sm font-extrabold tracking-wide transition-all duration-300 ${isActive
                                        ? "text-emerald-700 dark:text-emerald-400 bg-background shadow-md transform scale-105"
                                        : "text-stone-800 dark:text-stone-100 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-background/50"
                                        }`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions (Search / Theme / Mobile) */}
                    <div className="flex items-center gap-2 md:gap-4 pl-0 lg:pl-6">
                        <Search />

                        <div className="h-8 w-[1px] bg-border/40 hidden md:block mx-2" />

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="group relative p-2.5 rounded-full text-muted-foreground hover:bg-background hover:text-brand-primary hover:shadow-lg hover:ring-1 hover:ring-border transition-all duration-300"
                            aria-label="Toggle Theme"
                        >
                            {theme === "light" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                            )}
                        </button>

                        {/* Mobile Menu Toggle (Simplified) */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2.5 rounded-xl text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all"
                                aria-label="Toggle Mobile Menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
                    <div className="mx-auto max-w-7xl px-6 py-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                                            ? "text-emerald-700 dark:text-emerald-400 bg-muted shadow-sm"
                                            : "text-foreground hover:text-brand-primary hover:bg-muted/50"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
