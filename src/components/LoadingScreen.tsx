import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onLoaded: () => void;
  minDurationMs?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded, minDurationMs = 1400 }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing DevForge Core Engine...');

  useEffect(() => {
    const steps = [
      { at: 20, text: 'Synchronizing AST Compiler...' },
      { at: 50, text: 'Mounting Senior AI Architecture Pipeline...' },
      { at: 80, text: 'Calibrating Sandboxed Execution Virtual Machine...' },
      { at: 100, text: 'Environment Ready.' }
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 10;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(onLoaded, 350);
      }
      setProgress(currentProgress);
      const match = steps.find(s => s.at >= currentProgress);
      if (match) setStatusText(match.text);
    }, minDurationMs / 10);

    return () => clearInterval(interval);
  }, [minDurationMs, onLoaded]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090e] text-slate-100 overflow-hidden"
      >
        {/* Background ambient forge glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-radial from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Forge Logo Emblem */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="relative w-24 h-24 rounded-2xl bg-[#0d121d] border border-slate-700/60 p-4 shadow-2xl shadow-cyan-950/50 flex items-center justify-center">
            {/* Ambient thermal halo */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-transparent to-amber-500/20 animate-pulse" />
            <img
              src="/icon.svg"
              alt="DEVFORGE AI"
              className="w-16 h-16 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Brand Name & Tagline */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-center mb-8 px-4"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-[0.2em] text-white">
              DEVFORGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">AI</span>
            </h1>
          </div>
          <p className="text-slate-400 text-sm sm:text-base font-medium tracking-widest uppercase text-xs">
            “Describe it. Forge it.”
          </p>
        </motion.div>

        {/* Progress Bar & Status Text */}
        <div className="w-64 sm:w-80 flex flex-col gap-2.5">
          <div className="h-1.5 w-full bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
            <span className="truncate pr-2">{statusText}</span>
            <span className="text-cyan-400 font-semibold">{progress}%</span>
          </div>
        </div>

        <div className="absolute bottom-8 text-[11px] font-mono text-slate-600 tracking-wider">
          PLATFORM INITIALIZATION • BUILD v2.4
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
