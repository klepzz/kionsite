"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dailyTasks } from "../data/tasks";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MysterySpin() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState("SPIN TO REVEAL");

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    let counter = 0;
    const interval = setInterval(() => {
      setDisplayText(dailyTasks[Math.floor(Math.random() * dailyTasks.length)]);
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        const finalTask = dailyTasks[Math.floor(Math.random() * dailyTasks.length)];
        setResult(finalTask);
        setDisplayText(finalTask);
        setSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-16 p-6">
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
                <div className="text-xs sm:text-sm uppercase tracking-[0.3em] text-violet-400 mb-6 font-semibold">
                  Today's Mission
                </div>
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-medium text-white leading-tight drop-shadow-lg">
                  {result}
                </h3>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {result && (
         <motion.button
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           onClick={() => { setResult(null); setDisplayText("SPIN TO REVEAL"); }}
           className="mt-16 group flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-all font-medium backdrop-blur-md"
         >
           Try another spin
           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </motion.button>
      )}
    </div>
  );
}
