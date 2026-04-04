import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Kion — Your Daily Challenge Awaits",
  description: "Discover your daily challenge. Choose how much time you have, reveal a mystery task, and make every day count.",
  openGraph: {
    title: "Kion — Your Daily Challenge Awaits",
    description: "Discover your daily challenge. Choose how much time you have and make every day count.",
    url: "https://kionsite.vercel.app",
    siteName: "Kion",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased selection:bg-violet-500/30`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
