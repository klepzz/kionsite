"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dailyTasks, TaskCategory } from "../data/tasks";
import { Sparkles, ArrowRight, Brain, Zap, Coffee, Share2, Check } from "lucide-react";

export default function MysterySpin() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("SPIN TO REVEAL");
  const [category, setCategory] = useState<TaskCategory>("chill");
  const [copied, setCopied] = useState(false);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setCopied(false);

    const filteredTasks = dailyTasks.filter(t => t.category === category);
    
    let counter = 0;
    const interval = setInterval(() => {
      setDisplayText(filteredTasks[Math.floor(Math.random() * filteredTasks.length)].text);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        const finalTask = filteredTasks[Math.floor(Math.random() * filteredTasks.length)].text;
        setResult(finalTask);
        setDisplayText(finalTask);
        setSpinning(false);
      }
    }, 100);
  };

  const handleShare = () => {
    if (!result) return;
    const shareText = `My daily mystery task: "${result}" 🚀 \nTry yours at kionsite.vercel.app`;
    if (navigator.share) {
      navigator.share({
        title: "Daily Task",
        text: shareText,
        url: "https://kionsite.vercel.app"
      }).catch((err) => console.error("Share failed", err));
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-8 p-6">
      
      {/* Category Selection */}
      <div className="flex gap-2 sm:gap-4 mb-10 z-20">
        <button 
          onClick={() => {if(!spinning) { setCategory("chill"); setResult(null); }}}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all border ${category === 'chill' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <Coffee className="w-4 h-4" /> <span className="text-sm font-medium tracking-wide">CHILL</span>
        </button>
        <button 
          onClick={() => {if(!spinning) { setCategory("active"); setResult(null); }}}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all border ${category === 'active' ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <Zap className="w-4 h-4" /> <span className="text-sm font-medium tracking-wide">ACTIVE</span>
        </button>
        <button 
          onClick={() => {if(!spinning) { setCategory("focus"); setResult(null); }}}
          className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full transition-all border ${category === 'focus' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
        >
          <Brain className="w-4 h-4" /> <span className="text-sm font-medium tracking-wide">FOCUS</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full aspect-[2/1] sm:aspect-[2.5/1] glass rounded-3xl overflow-hidden flex items-center justify-center glow cursor-pointer group transition-transform duration-500 hover:scale-[1.02]"
        onClick={spinWheel}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-fuchsia-600/10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
        
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
                Tap to Spin
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
                  Today's Mission
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-medium text-white leading-tight drop-shadow-lg">
                  {result}
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
           className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center gap-4 z-20"
         >
           <button
             onClick={() => { setResult(null); setDisplayText("SPIN TO REVEAL"); }}
             className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all font-medium backdrop-blur-md"
           >
             Try another spin
             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>

           <button
             onClick={handleShare}
             className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-200 transition-all font-medium backdrop-blur-md"
           >
             {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
             {copied ? "Copied!" : "Share Task"}
           </button>
         </motion.div>
      )}
    </div>
  );
}
