import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
            <Navbar />
            <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 flex-grow w-full">
                <h1 className="text-4xl font-serif font-bold mb-8 text-foreground">Terms of Service</h1>

                <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground group">
                    <p className="mb-6">
                        Welcome to Kion! These terms and conditions outline the rules and regulations for the use of Kion's Website, located at kion.online.
                    </p>
                    <p className="mb-6">
                        By accessing this website we assume you accept these terms and conditions. Do not continue to use Kion if you do not agree to take all of the terms and conditions stated on this page.
                    </p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">1. Intellectual Property Rights</h2>
                    <p className="mb-6">
                        Other than the content you own, under these Terms, Kion and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
                    </p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">2. Restrictions</h2>
                    <p className="mb-4">You are specifically restricted from all of the following:</p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Publishing any Website material in any other media;</li>
                        <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                        <li>Publicly performing and/or showing any Website material;</li>
                        <li>Using this Website in any way that is or may be damaging to this Website;</li>
                        <li>Using this Website in any way that impacts user access to this Website;</li>
                    </ul>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">3. Content Liability</h2>
                    <p className="mb-6">
                        We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                    </p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">4. Reservation of Rights</h2>
                    <p className="mb-6">
                        We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
                    </p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">5. Disclaimer</h2>
                    <p className="mb-6">
                        To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Limit or exclude our or your liability for death or personal injury;</li>
                        <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                        <li>Limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                        <li>Exclude any of our or your liabilities that may not be excluded under applicable law.</li>
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    );
}
