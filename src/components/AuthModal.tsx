import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Zap, AlertCircle, ArrowRight } from 'lucide-react';
import { UserProfile, TokenWallet, TokenTransaction } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  onClose: () => void;
  onAuthSuccess: (data: {
    user: UserProfile;
    sessionToken: string;
    wallet: TokenWallet;
    transactions: TokenTransaction[];
  }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialMode) {
        setMode(initialMode);
      }
      setErrorMessage(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const payload = mode === 'signup' 
        ? { name: name.trim() || 'Lead Architect', email: email.trim(), password }
        : { email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please try again.');
      }

      onAuthSuccess(data);
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error occurred. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-[#090d16] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-950/40">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {mode === 'signup' ? 'Create DEVFORGE AI Account' : 'Sign In to Lead Architect'}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {mode === 'signup' 
              ? 'New accounts receive 4,500 Forge Tokens instantly' 
              : 'Access your persistent project workspaces & tokens'}
          </p>
        </div>

        {/* Token Allocation Callout */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
          <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div className="text-[11px] text-slate-300 font-mono leading-relaxed">
            <strong className="text-cyan-300">100% Free Guarantee: </strong>
            Every account receives <span className="text-white font-bold">4,500 tokens</span> (1,500 Welcome + 3,000 Starter). Refills 1,000 tokens daily after exhaustion. No credit cards or paywalls.
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Architect / Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-[#0d121e] border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full bg-[#0d121e] border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">Password (min 6 characters)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d121e] border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-950/40 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : mode === 'signup' ? (
              <>
                <span>Claim 4,500 Tokens & Sign Up</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Toggle */}
        <div className="text-center pt-2 border-t border-slate-800/80 text-xs font-mono">
          {mode === 'signup' ? (
            <p className="text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="text-cyan-400 hover:underline font-bold"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-slate-400">
              Don’t have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                }}
                className="text-cyan-400 hover:underline font-bold"
              >
                Create Account (4,500 Tokens)
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
