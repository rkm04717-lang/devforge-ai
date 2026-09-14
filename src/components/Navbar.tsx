import React, { useState } from 'react';
import { 
  Terminal, 
  Coins, 
  PlusCircle, 
  Layers, 
  History, 
  Settings as SettingsIcon, 
  User, 
  ChevronDown, 
  Sparkles,
  RefreshCw,
  LogOut,
  FolderCode
} from 'lucide-react';
import { TokenWallet, UserProfile } from '../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  wallet: TokenWallet;
  user: UserProfile;
  isAuthenticated?: boolean;
  onOpenNewProject: () => void;
  onTriggerRefill?: () => void;
  onOpenAuth?: () => void;
  onOpenAuthWithMode?: (mode: 'login' | 'signup') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  wallet,
  user,
  isAuthenticated = false,
  onOpenNewProject,
  onTriggerRefill,
  onOpenAuth,
  onOpenAuthWithMode,
  onLogout
}) => {
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080b12]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-2.5 flex items-center justify-between">
      {/* Brand Identity */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#0e1422] border border-cyan-500/30 p-1 flex items-center justify-center shadow-lg shadow-cyan-950/40 group-hover:border-cyan-400 transition-colors">
            <img 
              src="/icon.svg" 
              alt="DEVFORGE AI Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-[0.16em] text-white">
                DEVFORGE
              </span>
              <span className="text-[10px] font-bold px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider hidden sm:block">
              Describe it. Forge it.
            </p>
          </div>
        </button>

        {/* Primary Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              currentView === 'dashboard'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Dashboard
          </button>
          
          <button
            onClick={() => onNavigate('projects')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              currentView === 'projects'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FolderCode className="w-3.5 h-3.5 text-indigo-400" />
            Projects
          </button>

          <button
            onClick={onOpenNewProject}
            className="px-3 py-1.5 rounded-md text-slate-300 hover:text-white hover:bg-cyan-500/10 transition-colors flex items-center gap-1.5 border border-cyan-500/20 font-medium"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            New Project
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              currentView === 'assistant'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            AI Assistant
          </button>

          <button
            onClick={() => onNavigate('tokens')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              currentView === 'tokens'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            Token History
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              currentView === 'settings'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
            Settings
          </button>
        </nav>
      </div>

      {/* Right Controls: Token Wallet & User Profile */}
      <div className="flex items-center gap-3">
        {/* Forge Token Balance Pill */}
        <div className="relative">
          <button
            onClick={() => setShowWalletDropdown(!showWalletDropdown)}
            className="flex items-center gap-2 bg-[#0d131f] hover:bg-[#121929] border border-cyan-500/30 hover:border-cyan-500/50 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shadow-sm shadow-cyan-950/30"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            <span className="text-slate-400 hidden sm:inline">FORGE TOKENS:</span>
            <span className="font-bold text-white tracking-wide">
              {wallet.totalBalance.toLocaleString()}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Wallet Breakdown Dropdown */}
          {showWalletDropdown && (
            <div 
              className="absolute right-0 mt-2 w-72 bg-[#0c101a] border border-slate-700/80 rounded-xl shadow-2xl p-4 z-50 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-200">Forge Token Balance</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">
                  {wallet.totalBalance.toLocaleString()} Total
                </span>
              </div>

              <div className="space-y-2 mb-3 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Welcome Tokens:</span>
                  <span className="text-slate-200 font-semibold">{wallet.welcomeTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Starter Tokens:</span>
                  <span className="text-slate-200 font-semibold">{wallet.starterTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Daily Refill Pool:</span>
                  <span className="text-slate-200 font-semibold">{wallet.dailyTokens.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg mb-3">
                <div className="flex items-start gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="text-[10px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Daily 1,000 Refill:</strong> When initial 4,500 tokens are exhausted, the server grants 1,000 tokens every 24 hours.
                  </div>
                </div>
              </div>

              {wallet.totalBalance <= 0 && onTriggerRefill && (
                <button
                  onClick={() => {
                    onTriggerRefill();
                    setShowWalletDropdown(false);
                  }}
                  className="w-full py-1.5 mb-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-md text-[11px] transition-all"
                >
                  Claim 1,000 Daily Refill
                </button>
              )}

              <button
                onClick={() => {
                  onNavigate('tokens');
                  setShowWalletDropdown(false);
                }}
                className="w-full py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-md text-[11px] text-center font-medium transition-colors"
              >
                View Transaction History
              </button>
            </div>
          )}
        </div>

        {/* Authentication buttons for logged-out users OR User profile avatar */}
        {!isAuthenticated ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuthWithMode ? onOpenAuthWithMode('login') : onOpenAuth?.()}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => onOpenAuthWithMode ? onOpenAuthWithMode('signup') : onOpenAuth?.()}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-sm shadow-cyan-950/40 transition-all cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 flex items-center justify-center text-slate-300 text-xs font-bold transition-colors focus:outline-none"
            >
              <User className="w-4 h-4" />
            </button>

            {showUserDropdown && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-[#0c101a] border border-slate-700/80 rounded-xl shadow-2xl p-3 z-50 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="pb-2 border-b border-slate-800 mb-2">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {user.email ? user.email : <span className="text-slate-500 italic">No email linked</span>}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{user.role}</div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-slate-300 hover:bg-slate-800/70 flex items-center gap-2 transition-colors"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                    Account & Settings
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('landing');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded text-slate-300 hover:bg-slate-800/70 flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Platform Overview
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors border-t border-slate-800/60 mt-1 pt-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      Log Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
