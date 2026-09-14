import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Cpu, 
  Database, 
  ShieldCheck, 
  ArrowLeft, 
  Download, 
  Trash2, 
  Check, 
  Sparkles,
  Zap,
  Lock,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { Project, UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  projects: Project[];
  onBack: () => void;
  onUpdateUser: (updated: UserProfile) => void | Promise<void>;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  projects,
  onBack,
  onUpdateUser,
  onOpenAuth,
  onLogout
}) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
  }, [user.name, user.email]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!name.trim()) {
      setErrorMsg('Architect Name cannot be empty.');
      return;
    }
    const trimmedEmail = email.trim();
    if (trimmedEmail && !trimmedEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address (or leave blank).');
      return;
    }

    try {
      await onUpdateUser({
        ...user,
        name: name.trim(),
        email: trimmedEmail
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to update profile.');
    }
  };

  const handleExportAllProjects = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `devforge_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            Settings & Architect Profile
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Manage your developer workspace and AI preferences
          </p>
        </div>
      </div>

      {/* User Profile Form */}
      <div className="p-6 rounded-xl bg-[#0b0f19] border border-slate-800/90 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Developer Identity
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Architect Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Lead Architect"
              className="w-full bg-[#080b13] border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Leave blank or enter your email address"
              className="w-full bg-[#080b13] border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-mono placeholder:text-slate-600"
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : null}
              <span>{savedSuccess ? 'Profile Updated' : 'Save Changes'}</span>
            </button>

            {onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-colors flex items-center gap-1.5 border border-cyan-500/20"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In / Switch Account</span>
              </button>
            )}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-mono transition-colors flex items-center gap-1.5 border border-rose-800/40"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Log Out</span>
              </button>
            )}

            <span className="text-[11px] font-mono text-slate-500 ml-auto">
              Role: <strong className="text-slate-300">{user.role}</strong>
            </span>
          </div>
        </form>
      </div>

      {/* AI Engine & Model Settings */}
      <div className="p-6 rounded-xl bg-[#0b0f19] border border-slate-800/90 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            AI Software Engineer Engine
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-300 font-mono">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#080c14] border border-slate-800">
            <div>
              <div className="font-bold text-white">Active Core Model</div>
              <div className="text-[11px] text-slate-500">Gemini 2.5 Flash Autonomous Code Synthesis</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold">
              CONNECTED
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#080c14] border border-slate-800">
            <div>
              <div className="font-bold text-white">Refill Policy</div>
              <div className="text-[11px] text-slate-500">Autonomous 1,000 Forge Tokens every 24h</div>
            </div>
            <span className="text-cyan-400 text-[11px] font-semibold">
              Always Active
            </span>
          </div>
        </div>
      </div>

      {/* Workspace Data & Backup */}
      <div className="p-6 rounded-xl bg-[#0b0f19] border border-slate-800/90 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Database className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Repository Data & Backups
          </h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          You currently have <strong className="text-white">{projects.length} forged projects</strong> in your workspace repository.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportAllProjects}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Complete Repository Backup (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Free Platform Guarantee */}
      <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-400 flex items-center gap-3 font-mono">
        <Lock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>
          DEVFORGE AI is an unencumbered free developer platform. No credit cards or subscriptions are ever required.
        </span>
      </div>
    </div>
  );
};
