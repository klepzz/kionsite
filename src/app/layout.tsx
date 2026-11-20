import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kion.online"),
  title: "Kion | JPG ve PNG’den PDF’ye",
  description: "JPG ve PNG görsellerini ücretsiz PDF’ye dönüştür. Dosyaların cihazında kalır; üyelik ve filigran yok.",
  openGraph: {
    title: "Kion | JPG ve PNG’den PDF’ye",
    description: "JPG ve PNG görsellerini ücretsiz PDF’ye dönüştür.",
    url: "https://kion.online",
    siteName: "Kion",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased selection:bg-violet-500/30`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
