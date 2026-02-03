import Navbar from "../components/Navbar";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <main className="mx-auto max-w-4xl px-6 pt-32 pb-24">
                <h1 className="text-4xl font-serif font-bold mb-8 text-foreground">Privacy Policy</h1>

                <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground group">
                    <p className="mb-6">At Kion, accessible from kion.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Kion and how we use it.</p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">Log Files</h2>
                    <p className="mb-6">Kion follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services&apos; analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">Cookies and Web Beacons</h2>
                    <p className="mb-6">Like any other website, Kion uses &quot;cookies&quot;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.</p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">Google DoubleClick DART Cookie</h2>
                    <p className="mb-6">Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-brand-primary underline">https://policies.google.com/technologies/ads</a></p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">Privacy Policies</h2>
                    <p className="mb-6">Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Kion, which are sent directly to users&apos; browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>

                    <h2 className="text-2xl font-serif font-semibold mt-10 mb-4 text-foreground">Consent</h2>
                    <p className="mb-6">By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
                </div>
            </main>
        </div>
    );
}
