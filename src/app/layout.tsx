import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "../context/LanguageContext";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import ReadingProgressBar from "./components/ReadingProgressBar";

// Editorial Fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-serif",
  display: "swap",
});

const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kion-blog.vercel.app"),
  title: {
    default: "Kion | Curiosity is Freedom",
    template: "%s | Kion Blog"
  },
  description: "From science to sport, psychology to technology; content to open your mind and expand your horizons is here. Discover new perspectives today.",
  icons: {
    icon: "/sphere-logo-trans.png?v=21",
    apple: "/sphere-logo-trans.png?v=21",
  },
  keywords: ["blog", "science", "psychology", "sport", "technology", "articles", "curiosity"],
  authors: [{ name: "Kion Editorial Team" }],
  creator: "Kion Blog",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kion-blog.vercel.app",
    siteName: "Kion Blog",
    title: "Kion | Curiosity is Freedom",
    description: "Explore a curated collection of stories from the frontiers of science and technology.",
    images: [
      {
        url: "/images/james-webb-telescope.png",
        width: 1200,
        height: 630,
        alt: "Kion Blog - Curiosity is Freedom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kion | Curiosity is Freedom",
    description: "Explore a curated collection of stories from the frontiers of science and technology.",
    images: ["/images/james-webb-telescope.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Google AdSense - Placeholder (Replace with your own client ID) */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="page-transition-wrapper min-h-screen flex flex-col">
              <ReadingProgressBar />
              {children}
              <Analytics />
              <Footer />
              <CookieBanner />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
