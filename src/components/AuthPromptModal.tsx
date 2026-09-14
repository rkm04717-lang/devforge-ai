import React from 'react';
import { X, Sparkles, LogIn, UserPlus, ShieldCheck, Zap, Code2, FolderGit2 } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSignUp: () => void;
  onSelectLogIn: () => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  onSelectSignUp,
  onSelectLogIn,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      id="auth-prompt-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans"
    >
      <div 
        id="auth-prompt-card"
        className="relative w-full max-w-md bg-[#090d16] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 selection:bg-cyan-500/30"
      >
        {/* Close Button */}
        <button
          id="auth-prompt-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Icon & Badge */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/40">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span>DEVFORGE AI ACCESS</span>
          </div>

          {/* Required Prompts */}
          <h2 
            id="auth-prompt-title"
            className="text-2xl font-bold tracking-tight text-white"
          >
            Sign in to start building
          </h2>

          <p 
            id="auth-prompt-subtitle"
            className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto"
          >
            Create a free DEVFORGE account to forge and save your projects.
          </p>
        </div>

        {/* Value Callout Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Everything included with your free account:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong className="text-white">4,500 Forge Tokens</strong> on sign up (1,500 Welcome + 3,000 Starter)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Autonomous multi-file code generator with 60 FPS sandbox</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span>Persistent cloud projects with zero loss & instant ZIP export</span>
            </li>
          </ul>
        </div>

        {/* Clear Actions: Sign Up & Log In */}
        <div className="space-y-3 pt-1">
          <button
            id="auth-prompt-signup-btn"
            type="button"
            onClick={onSelectSignUp}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-950/50 hover:shadow-cyan-900/60 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Sign Up</span>
          </button>

          <button
            id="auth-prompt-login-btn"
            type="button"
            onClick={onSelectLogIn}
            className="w-full py-3 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/90 hover:border-slate-600 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <LogIn className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span>Log In</span>
          </button>
        </div>

        {/* 100% Free Guarantee footnote */}
        <div className="text-center">
          <span className="text-[11px] text-slate-500 font-mono">
            100% Free Developer Platform • No payment or subscription required
          </span>
        </div>
      </div>
    </div>
  );
};
