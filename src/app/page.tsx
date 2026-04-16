"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    // 18 Nisan 09:00 hedef tarihi (2026 yılı için ayarlandı, geçerli tarihin 16 Nisan 2026 olduğu biliniyor)
    const targetDate = new Date("2026-04-18T09:00:00+03:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#06060f]">
      {/* Deep background mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb-1 absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-violet-700/12 rounded-full blur-[140px]" />
        <div className="orb-2 absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-700/10 rounded-full blur-[140px]" />
        <div className="orb-3 absolute top-[40%] left-[55%] w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 flex flex-col items-center gap-12 text-center mt-[-50px]">
        {/* Title */}
        <h1 
          className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight"
          style={{ fontFamily: 'var(--font-outfit)', textShadow: "0 0 40px rgba(139,92,246,0.3)" }}
        >
          SETEJE AVUKAT BURÇ KARANIN SÜNNET DÜĞÜNÜ
        </h1>

        {/* Countdown */}
        {isMounted && (
          <div className="flex gap-3 sm:gap-8 justify-center text-white backdrop-blur-md bg-white/5 border border-white/10 p-6 sm:p-10 rounded-3xl" style={{ boxShadow: "0 0 30px -8px rgba(139,92,246,0.2)" }}>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl sm:text-6xl font-bold text-shimmer w-[2ch] font-mono">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.2em]">Gün</span>
            </div>
            <span className="text-3xl sm:text-6xl font-bold text-white/20 mt-[-2px] sm:mt-[-5px]">:</span>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl sm:text-6xl font-bold text-shimmer w-[2ch] font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.2em]">Saat</span>
            </div>
            <span className="text-3xl sm:text-6xl font-bold text-white/20 mt-[-2px] sm:mt-[-5px]">:</span>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl sm:text-6xl font-bold text-shimmer w-[2ch] font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.2em]">Dakika</span>
            </div>
            <span className="text-3xl sm:text-6xl font-bold text-white/20 mt-[-2px] sm:mt-[-5px]">:</span>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl sm:text-6xl font-bold text-shimmer w-[2ch] font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-[0.2em]">Saniye</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
