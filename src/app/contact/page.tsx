import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Navbar />
            <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 flex-grow w-full">
                <h1 className="text-4xl font-serif font-bold mb-8 text-foreground">Contact Us</h1>

                <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
                    <p className="text-lg mb-8">
                        We value your feedback and inquiries. Whether you have a question about our content,
                        want to collaborate, or just want to say hello, we are here to listen.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        <div className="bg-stone-100 dark:bg-stone-900 p-8 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4 text-foreground">General Inquiries</h3>
                            <p className="mb-4">
                                For general questions about Kion, our articles, or our mission.
                            </p>
                            <a href="mailto:info@kion.online" className="text-brand-primary font-bold hover:underline">
                                info@kion.online
                            </a>
                        </div>

                        <div className="bg-stone-100 dark:bg-stone-900 p-8 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4 text-foreground">Support</h3>
                            <p className="mb-4">
                                Need help with the website or experiencing technical issues?
                            </p>
                            <a href="mailto:support@kion.online" className="text-brand-primary font-bold hover:underline">
                                support@kion.online
                            </a>
                        </div>
                    </div>

                    <div className="mt-16">
                        <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Connect With Us</h2>
                        <p className="mb-6">
                            Follow us on social media to stay updated with the latest insights and tests.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons - reusing the style from Footer or similar */}
                            <a href="#" className="bg-stone-200 dark:bg-stone-800 px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-primary hover:text-white transition-colors">
                                Twitter
                            </a>
                            <a href="#" className="bg-stone-200 dark:bg-stone-800 px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-primary hover:text-white transition-colors">
                                Instagram
                            </a>
                            <a href="#" className="bg-stone-200 dark:bg-stone-800 px-6 py-3 rounded-full font-bold text-sm hover:bg-brand-primary hover:text-white transition-colors">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
