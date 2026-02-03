import Navbar from "../components/Navbar";
import Image from "next/image";

export const metadata = {
    title: "About Kion | Our Mission",
    description: "Learn about Kion's mission to make complex knowledge accessible and spark curiosity in the digital age.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-700">Our Mission</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Curiosity is <br className="hidden md:block" /> the Engine of Freedom.
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        We believe that knowledge shouldn't be boring, elitist, or confusing.
                        Kion exists to decode the complexity of our world into stories that expand your mind.
                    </p>
                </div>
            </section>

            {/* Image Break */}
            <div className="w-full h-[400px] md:h-[600px] relative mb-24 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
                    alt="Kion Mission - Space"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content Section */}
            <section className="container mx-auto px-6 max-w-3xl mb-32">
                <div className="prose prose-lg dark:prose-invert mx-auto">
                    <h2 className="font-serif text-3xl font-bold mb-6">Why "Kion"?</h2>
                    <p className="mb-6 text-muted-foreground">
                        In an age of information overload, clarity is power. We noticed that most content online is either too shallow ("clickbait") or too dense (academic papers). Kion fills the gap.
                    </p>
                    <p className="mb-12 text-muted-foreground">
                        We combine the rigor of <strong>science</strong>, the depth of <strong>psychology</strong>, and the excitement of <strong>future technology</strong> into articles that respect your intelligence and your time.
                    </p>

                    <h2 className="font-serif text-3xl font-bold mb-6">What We Stand For</h2>
                    <ul className="space-y-6 list-none pl-0">
                        <li className="flex gap-4">
                            <span className="text-2xl">🔬</span>
                            <div>
                                <strong className="text-foreground block mb-1">Scientific Accuracy</strong>
                                <span className="text-muted-foreground">We research deeply. If we make a claim, we back it up.</span>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-2xl">🎨</span>
                            <div>
                                <strong className="text-foreground block mb-1">Beauty in Design</strong>
                                <span className="text-muted-foreground">Reading should be a visual pleasure, not just a data transfer.</span>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <span className="text-2xl">🚀</span>
                            <div>
                                <strong className="text-foreground block mb-1">Future Optimism</strong>
                                <span className="text-muted-foreground">We believe the future is bright if we build it with intention.</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Team / Contact CTA */}
            <section className="bg-stone-100 dark:bg-stone-900 py-24 mb-0">
                <div className="container mx-auto px-6 text-center max-w-2xl">
                    <h2 className="text-3xl font-serif font-bold mb-6">Join the Conversation</h2>
                    <p className="text-muted-foreground mb-8">
                        Have a topic you want us to explore? Or just want to say hi?
                        We are a small, passionate team and we read every email.
                    </p>
                    <a href="mailto:hello@kion.com" className="inline-block px-8 py-4 bg-brand-primary text-white font-bold rounded-full hover:bg-brand-secondary transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
                        Get in Touch
                    </a>
                </div>
            </section>
        </div>
    );
}
