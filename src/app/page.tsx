"use client";

import MysterySpin from "@/components/MysterySpin";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full px-4 flex flex-col items-center">
        <header className="mb-12 text-center">
          <h1 className="text-sm md:text-base tracking-[0.4em] uppercase text-white/40 mb-3 font-medium">
            {t("general.dailyObjective")}
          </h1>
          <p className="text-white/20 text-xs md:text-sm font-light">
            {t("general.subtitle")}
          </p>
        </header>

        <MysterySpin />
      </div>
    </main>
  );
}
