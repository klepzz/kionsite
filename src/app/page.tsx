"use client";

import { useEffect, useState } from "react";
import { Scissors, Syringe, Droplets, Stethoscope, Sparkles } from "lucide-react";

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
    // 18 Nisan 09:00 hedef tarihi
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
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 border-[8px] sm:border-[16px] border-yellow-500/30">
      
      {/* Abstract floating background icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px]" />
        
        {/* Urological Floating Icons */}
        <Scissors className="absolute top-[15%] left-[10%] text-yellow-400/20 w-32 h-32 -rotate-45 animate-pulse" />
        <Syringe className="absolute bottom-[20%] left-[15%] text-cyan-400/20 w-40 h-40 rotate-[30deg]" />
        <Droplets className="absolute top-[25%] right-[10%] text-red-500/30 w-24 h-24 rotate-[15deg] animate-bounce" style={{ animationDuration: '3s' }} />
        <Stethoscope className="absolute bottom-[15%] right-[15%] text-blue-400/20 w-48 h-48 -rotate-12" />
        <Scissors className="absolute top-[60%] right-[8%] text-yellow-500/20 w-20 h-20 rotate-90" />
        <Sparkles className="absolute top-[10%] left-[50%] text-yellow-300/40 w-16 h-16 animate-pulse" />
        <Droplets className="absolute bottom-[40%] left-[5%] text-red-600/30 w-16 h-16 rotate-[-15deg] animate-bounce" style={{ animationDuration: '2.5s' }} />
      </div>

      <div className="relative z-10 w-full px-4 flex flex-col items-center gap-6 text-center max-w-5xl mx-auto py-10">
        
        {/* Maşallah Ribbon */}
        <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 px-10 py-2 sm:px-16 sm:py-3 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.5)] border-2 border-yellow-200 transform -rotate-2 -mt-6 sm:-mt-10 mb-4 animate-bounce" style={{ animationDuration: '2s' }}>
          <span className="text-blue-950 font-extrabold tracking-[0.3em] text-xl sm:text-3xl font-serif">MAŞALLAH</span>
        </div>

        {/* Profile Image  */}
        <div className="relative group mt-4">
          <div className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-700"></div>
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-8 border-yellow-400 shadow-[0_0_50px_rgba(234,179,8,0.4)] overflow-hidden bg-blue-900 flex items-center justify-center">
            {/* User will upload their image to public/burc.jpg */}
            <img 
              src="/burc.jpg" 
              alt="Av. Burç Kara" 
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                // Fallback if image doesn't exist yet
                (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Burç+Kara&background=0D8ABC&color=fff&size=256";
              }}
            />
          </div>
          {/* Fun little badge */}
          <div className="absolute -bottom-2 -right-4 sm:-bottom-4 sm:-right-6 bg-red-600 text-white w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center border-4 border-yellow-400 font-bold rotate-12 shadow-xl z-20">
            <div className="text-center leading-tight">
              <span className="text-lg sm:text-xl">%100</span><br/><span className="text-[10px] sm:text-xs">ERKEK DEĞİL</span><br/><span className="text-[10px] sm:text-xs text-yellow-300">AVUKAT</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] mt-6 leading-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          SETEJE AVUKAT <br className="hidden sm:block" /> BURÇ KARA'NIN <br /> SÜNNET DÜĞÜNÜ
        </h1>

        <p className="text-blue-200 text-base sm:text-2xl font-medium max-w-2xl mt-2 drop-shadow-md px-4" style={{textShadow: "0px 2px 4px rgba(0,0,0,0.8)"}}>
          "Biraz kestik biçtik, ama avukat bey artık tam hazır!"
        </p>

        {/* Countdown */}
        {isMounted && (
          <div className="mt-8 relative w-full max-w-4xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 rounded-3xl blur opacity-30"></div>
            <div className="relative flex gap-2 sm:gap-6 justify-center text-white bg-blue-950/80 backdrop-blur-xl border-2 border-yellow-500/50 p-4 sm:p-10 rounded-3xl shadow-2xl">
              
              <div className="flex flex-col items-center justify-center flex-1">
                <span className="text-3xl sm:text-6xl font-bold text-yellow-400 font-mono drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[8px] sm:text-sm text-yellow-200/70 uppercase tracking-[0.2em] mt-1 sm:mt-2">Gün</span>
              </div>
              
              <span className="text-3xl sm:text-6xl font-bold text-yellow-600/50 self-start mt-1 sm:mt-0">:</span>
              
              <div className="flex flex-col items-center justify-center flex-1">
                <span className="text-3xl sm:text-6xl font-bold text-yellow-400 font-mono drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[8px] sm:text-sm text-yellow-200/70 uppercase tracking-[0.2em] mt-1 sm:mt-2">Saat</span>
              </div>
              
              <span className="text-3xl sm:text-6xl font-bold text-yellow-600/50 self-start mt-1 sm:mt-0">:</span>
              
              <div className="flex flex-col items-center justify-center flex-1">
                <span className="text-3xl sm:text-6xl font-bold text-yellow-400 font-mono drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[8px] sm:text-sm text-yellow-200/70 uppercase tracking-[0.2em] mt-1 sm:mt-2">Dakika</span>
              </div>
              
              <span className="text-3xl sm:text-6xl font-bold text-yellow-600/50 self-start mt-1 sm:mt-0">:</span>
              
              <div className="flex flex-col items-center justify-center flex-1">
                <span className="text-3xl sm:text-6xl font-bold text-yellow-400 font-mono drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[8px] sm:text-sm text-yellow-200/70 uppercase tracking-[0.2em] mt-1 sm:mt-2">Saniye</span>
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
