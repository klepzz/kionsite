"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dailyTasks, TaskCategory, Task } from "../data/tasks";
import { Sparkles, Brain, Zap, Coffee, Share2, Check, Globe, Flame } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Simple AudioContext synthesizer
const playSpinTick = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

const playSuccessChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {}
};

// Simple Confetti using framer-motion
const ConfettiExplosion = () => {
  const colors = ["#8B5CF6", "#D946EF", "#EC4899", "#3B82F6", "#10B981"];
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * window.innerWidth * 0.8,
    y: (Math.random() - 0.5) * window.innerHeight * 0.8 - 200,
    color: colors[Math.floor(Math.random() * colors.length)],
    scale: Math.random() * 0.5 + 0.5,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: p.scale,
            rotate: p.rotation + 360,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-4 h-4 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
};

export default function MysterySpin() {
  const { t, language, setLanguage } = useLanguage();
  
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Task | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [category, setCategory] = useState<TaskCategory>("chill");
  const [copied, setCopied] = useState(false);
  
  // Gamification state
  const [hasCompleted, setHasCompleted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDisplayText(t("general.spinToReveal"));
    
    // Load state from localStorage
    const savedState = localStorage.getItem("kion-daily-task");
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        const todayDate = new Date().toISOString().split('T')[0];
        
        // If we have a streak, load it
        if (state.streak) setStreak(state.streak);

        if (state.date === todayDate) {
          // Task already assigned today
          if (state.task) {
            setResult(state.task);
            setCategory(state.task.category);
          }
          if (state.completed) {
            setHasCompleted(true);
          }
        }
      } catch (e) { console.error(e) }
    }
  }, [t]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "tr" : "en");
    if (!result && !spinning) {
      setDisplayText(language === "en" ? "ÇEVİR VE GÖR" : "SPIN TO REVEAL");
    }
  };

  const spinWheel = () => {
    if (spinning || result) return; // Prevent spinning if already spun today
    setSpinning(true);

    const filteredTasks = dailyTasks.filter(t => t.category === category);
    let counter = 0;
    
    const interval = setInterval(() => {
      playSpinTick();
      const randomTask = filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
      setDisplayText(language === 'tr' ? randomTask.text.tr : randomTask.text.en);
      counter++;
      
      if (counter > 25) {
        clearInterval(interval);
        const finalTask = filteredTasks[Math.floor(Math.random() * filteredTasks.length)];
        setResult(finalTask);
        setSpinning(false);
        playSuccessChime();

        // Save daily task choice
        const todayDate = new Date().toISOString().split('T')[0];
        const currentState = JSON.parse(localStorage.getItem("kion-daily-task") || "{}");
        localStorage.setItem("kion-daily-task", JSON.stringify({
          ...currentState,
          date: todayDate,
          task: finalTask,
          completed: false
        }));
      }
    }, 120);
  };

  const markAsDone = () => {
    if (hasCompleted) return;
    setHasCompleted(true);
    setShowConfetti(true);
    
    // Play sound
    playSuccessChime();
    setTimeout(() => playSuccessChime(), 150); // Double chime
    
    // Re-hide confetti after 3s
    setTimeout(() => setShowConfetti(false), 3000);

    const todayDate = new Date().toISOString().split('T')[0];
    const currentState = JSON.parse(localStorage.getItem("kion-daily-task") || "{}");
    
    // Simple streak logic
    let newStreak = streak;
    if (currentState.lastCompletedDate) {
      const lastDate = new Date(currentState.lastCompletedDate);
      const today = new Date(todayDate);
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // broken streak
      }
      // if 0, they already completed today, streak remains
    } else {
      newStreak = 1;
    }

    setStreak(newStreak);
    
    localStorage.setItem("kion-daily-task", JSON.stringify({
      ...currentState,
      date: todayDate,
      completed: true,
      lastCompletedDate: todayDate,
      streak: newStreak
    }));
  };

  const handleShare = () => {
    if (!result) return;
    const taskText = language === 'tr' ? result.text.tr : result.text.en;
    const shareText = language === 'tr' 
      ? `Bugünkü gizemli görevim: "${taskText}" 🚀 \nSeninkini gör: kionsite.vercel.app`
      : `My daily mystery task: "${taskText}" 🚀 \nTry yours at kionsite.vercel.app`;
      
    if (navigator.share) {
      navigator.share({
        title: t("general.todaysMission"),
        text: shareText,
        url: "https://kionsite.vercel.app"
      }).catch((err) => console.error("Share failed", err));
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-8 p-6 relative">
      {/* Language Switcher */}
      <button 
        onClick={toggleLanguage}
        className="absolute -top-16 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white/70 text-xs font-medium backdrop-blur-md"
      >
        <Globe className="w-3.5 h-3.5" />
        {t("general.language")}
      </button>

      {/* Streak Display */}
      {streak > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-16 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium backdrop-blur-md"
        >
          <Flame className="w-3.5 h-3.5" />
          {streak} {t("general.streak")}
        </motion.div>
      )}

      {showConfetti && <ConfettiExplosion />}

      {/* Category Selection (Disabled if already spun) */}
      <div className={`flex gap-2 sm:gap-4 mb-10 z-20 ${result ? 'opacity-50 pointer-events-none' : ''}`}>
        <button 
          onClick={() => {if(!spinning && !result) setCategory("chill");}}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all border ${category === 'chill' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <Coffee className="w-4 h-4" /> <span className="text-sm font-medium tracking-wide">{t("general.chill")}</span>
        </button>
        <button 
          onClick={() => {if(!spinning && !result) setCategory("active");}}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all border ${category === 'active' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <Zap className="w-4 h-4" /> <span className="text-sm font-medium tracking-wide">{t("general.active")}</span>
        </button>
        <button 
          onClick={() => {if(!spinning && !result) setCategory("focus");}}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all border ${category === 'focus' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <Brain className="w-4 h-4" /> <span className="text-sm font-medium tracking-wide">{t("general.focus")}</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative w-full aspect-[2/1] sm:aspect-[2.5/1] glass rounded-3xl overflow-hidden flex items-center justify-center glow transition-transform duration-500 ${!result ? "cursor-pointer hover:scale-[1.02] group" : ""}`}
        onClick={spinWheel}
      >
        <div className={`absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-fuchsia-600/10 pointer-events-none transition-opacity duration-700 ${!result ? "opacity-50 group-hover:opacity-100" : "opacity-100"}`} />
        
        <AnimatePresence mode="wait">
          {!result && !spinning && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white/90 uppercase drop-shadow-md flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
                {t("general.tapToSpin")}
              </h2>
            </motion.div>
          )}

          {spinning && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(4px)" }}
              exit={{ opacity: 0 }}
              className="text-center px-8"
            >
              <p className="text-2xl sm:text-4xl font-black italic text-violet-300/40 uppercase break-words">
                {displayText}
              </p>
            </motion.div>
          )}

          {result && !spinning && (
             <motion.div
               key="result"
               initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
               animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
               transition={{ type: "spring", bounce: 0.5 }}
               className="text-center px-8 py-6 z-10 w-full"
             >
                <div className="text-xs sm:text-sm uppercase tracking-[0.3em] text-violet-400 mb-4 sm:mb-6 font-semibold">
                  {hasCompleted ? t("general.completed") : t("general.todaysMission")}
                </div>
                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-medium leading-tight drop-shadow-lg transition-colors ${hasCompleted ? 'text-white/40 line-through' : 'text-white'}`}>
                  {language === 'tr' ? result.text.tr : result.text.en}
                </h3>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {result && (
         <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center gap-4 z-20 w-full justify-center"
         >
           {!hasCompleted ? (
             <button
               onClick={markAsDone}
               className="group flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 text-emerald-200 transition-all font-medium backdrop-blur-md"
             >
               <Check className="w-5 h-5 group-hover:scale-110 transition-transform" />
               {t("general.markDone")}
             </button>
           ) : (
             <button
               disabled
               className="flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white/40 transition-all font-medium backdrop-blur-md cursor-not-allowed"
             >
               <Check className="w-5 h-5" />
               {t("general.completed")}
             </button>
           )}

           <button
             onClick={handleShare}
             className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-200 transition-all font-medium backdrop-blur-md"
           >
             {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
             {copied ? t("general.copied") : t("general.shareTask")}
           </button>
         </motion.div>
      )}
    </div>
  );
}
