"use client";

import MysterySpin from "@/components/MysterySpin";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#06060f]">

      {/* === Deep background mesh === */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Primary orbs */}
        <div className="orb-1 absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-violet-700/12 rounded-full blur-[140px]" />
        <div className="orb-2 absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-700/10 rounded-full blur-[140px]" />
        <div className="orb-3 absolute top-[40%] left-[55%] w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />

        {/* Subtle noise grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* === Content === */}
      <div className="relative z-10 w-full px-4 flex flex-col items-center">

        {/* Brand mark */}
        <div className="mb-10 flex flex-col items-center gap-3">
          {/* Logo badge */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/30 to-fuchsia-600/20 border border-white/10 backdrop-blur-md" />
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "0 0 30px -8px rgba(139,92,246,0.7)" }} />
            <span className="relative text-2xl font-bold text-shimmer" style={{ fontFamily: "var(--font-outfit)" }}>K</span>
          </div>

          {/* Site name */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] tracking-[0.45em] uppercase text-white/30 font-medium">
              {t("general.dailyObjective")}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-shimmer"
              style={{ fontFamily: "var(--font-outfit)" }}>
              Kion
            </h1>
            <p className="text-white/30 text-xs sm:text-sm font-light mt-1 tracking-wide">
              {t("general.subtitle")}
            </p>
          </div>
        </div>

        <MysterySpin />

        {/* Footer */}
        <footer className="mt-16 mb-8 flex items-center gap-2 text-white/15 text-xs tracking-widest uppercase">
          <span>kion</span>
          <span>·</span>
          <span>make every day count</span>
        </footer>
      </div>
    </main>
  );
}
