import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kionsite.vercel.app"),
  title: "Ev Gençleri Silivri İlçe Başkanımız Av. Burç Kara",
  description: "Ev Gençleri Silivri İlçe Başkanımız Av. Burç Kara.",
  openGraph: {
    title: "Ev Gençleri Silivri İlçe Başkanımız Av. Burç Kara",
    description: "Ev Gençleri Silivri İlçe Başkanımız Av. Burç Kara.",
    images: ["/burc-kara-baskan.png"],
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
    <html lang="tr" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased selection:bg-violet-500/30`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
