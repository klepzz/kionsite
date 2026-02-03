"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 pt-16 pb-8 transition-colors duration-300">
            <div className="container px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-2xl font-serif font-bold text-foreground tracking-tight">
                                Kion.
                            </span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed text-sm mb-6">
                            Curiosity is the engine of freedom. We explore the frontiers of science, psychology, and technology to empower your mind.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons (Mock) */}
                            {['twitter', 'instagram', 'linkedin'].map((social) => (
                                <a key={social} href="#" className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-muted-foreground hover:bg-brand-primary hover:text-white transition-all">
                                    <span className="sr-only">{social}</span>
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z" /></svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-widest">Explore</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/blog" className="hover:text-brand-primary transition-colors">All Articles</Link></li>
                            <li><Link href="/tests" className="hover:text-brand-primary transition-colors">Quizzes</Link></li>
                            <li><Link href="/category/science" className="hover:text-brand-primary transition-colors">Science</Link></li>
                            <li><Link href="/category/technology" className="hover:text-brand-primary transition-colors">Technology</Link></li>
                            <li><Link href="/category/psychology" className="hover:text-brand-primary transition-colors">Psychology</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-widest">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-brand-primary transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-foreground mb-6 uppercase text-xs tracking-widest">Stay Curious</h4>
                        <p className="text-muted-foreground text-xs mb-4">
                            Join 10,000+ readers. Get the latest insights delivered to your inbox weekly.
                        </p>
                        <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="px-4 py-2 rounded-lg bg-stone-200 dark:bg-stone-800 border-none focus:ring-2 focus:ring-brand-primary text-sm"
                            />
                            <button className="px-4 py-2 bg-foreground text-background font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-colors text-sm">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Kion Blog. All rights reserved.</p>
                    <p>Designed for the curious mind.</p>
                </div>
            </div>
        </footer>
    );
}
