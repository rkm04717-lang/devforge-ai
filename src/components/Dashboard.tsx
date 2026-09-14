import React from 'react';
import { 
  PlusCircle, 
  Coins, 
  Clock, 
  Code2, 
  Download, 
  Play, 
  Terminal, 
  Layers, 
  ArrowRight, 
  Trash2, 
  RefreshCw,
  ExternalLink,
  Flame,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { Project, TokenTransaction, TokenWallet, UserProfile } from '../types';
import { downloadProjectAsZip } from '../utils/zipExport';

interface DashboardProps {
  user: UserProfile;
  wallet: TokenWallet;
  projects: Project[];
  recentTransactions: TokenTransaction[];
  onOpenNewProject: () => void;
  onOpenProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onNavigate: (view: string) => void;
  onTriggerRefill?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  wallet,
  projects,
  recentTransactions,
  onOpenNewProject,
  onOpenProject,
  onDeleteProject,
  onNavigate,
  onTriggerRefill
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c121e] via-[#0f172a] to-[#0a0f19] border border-slate-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
              Welcome back, {user.name}
            </h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
              LEAD ARCHITECT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Direct your senior AI software engineer to plan, generate, test, debug, and download full-stack projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewProject}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Forge Project</span>
          </button>
        </div>
      </div>

      {/* Top Metrics / Wallet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Token Wallet Balance Card */}
        <div className="p-5 rounded-xl bg-[#0b101b] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              FORGE TOKEN BALANCE
            </span>
            <Coins className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {wallet.totalBalance.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-cyan-400">Tokens</span>
          </div>
          <div className="space-y-1.5 border-t border-slate-800 pt-3 text-[11px] font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Welcome Pool:</span>
              <span className="text-slate-200">{wallet.welcomeTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Starter Pool:</span>
              <span className="text-slate-200">{wallet.starterTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Refill Pool:</span>
              <span className="text-slate-200">{wallet.dailyTokens.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 24-Hour Server Refill Status Card */}
        <div className="p-5 rounded-xl bg-[#0b101b] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              DAILY 1,000 REFILL
            </span>
            <RefreshCw className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mb-2">
            <div className="text-sm font-semibold text-slate-200 mb-1">
              Autonomous 24h Server Clock
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              When initial 4,500 tokens are exhausted, the platform automatically grants a 1,000 token refill once every 24 hours.
            </p>
          </div>
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Platform Status:</span>
            <span className="text-emerald-400 font-semibold">100% Free • Active</span>
          </div>
        </div>

        {/* Quick Engineer Action */}
        <div className="p-5 rounded-xl bg-[#0b101b] border border-slate-800/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
              ACTIVE REPOSITORY
            </span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono mb-1">
              {projects.length}
            </div>
            <p className="text-xs text-slate-400">
              Forged multi-file applications with live preview and syntax checking.
            </p>
          </div>
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
            <button
              onClick={() => onNavigate('assistant')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Consult AI Engineer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Recent Projects
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Continue developing in the IDE or export as clean ZIP archives.
            </p>
          </div>

          <button
            onClick={onOpenNewProject}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>+ New Project</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-[#0b0f19] border border-dashed border-slate-800 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Code2 className="w-7 h-7 text-cyan-400" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-bold font-mono tracking-wider text-white uppercase">
                NO PROJECTS YET
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Describe what you want to build and DEVFORGE will forge it.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onOpenNewProject}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-950/50 hover:shadow-cyan-900/60 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ New Project</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-5 rounded-xl bg-[#0b0f19] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold border border-slate-700/60">
                      {proj.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(proj.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-1.5">
                    {proj.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{proj.files.length} Files Generated</span>
                    <span className="text-slate-300 truncate max-w-[140px] text-right font-medium">
                      {proj.technology}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenProject(proj)}
                      className="flex-1 py-2 px-3 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Open Workspace</span>
                    </button>

                    <button
                      onClick={() => downloadProjectAsZip(proj)}
                      title="Download ZIP Archive"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      title="Delete Project"
                      className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity / Token Transactions */}
      <div className="p-6 rounded-xl bg-[#0b0f19] border border-slate-800/90">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Token Activity & Audit Ledger
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Server-side verified token usage and balance tracking.
            </p>
          </div>
          <button
            onClick={() => onNavigate('tokens')}
            className="text-xs font-mono text-slate-400 hover:text-slate-200"
          >
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">TIMESTAMP</th>
                <th className="pb-2 font-medium">ACTION</th>
                <th className="pb-2 font-medium text-right">TOKENS</th>
                <th className="pb-2 font-medium text-right">BALANCE AFTER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentTransactions.slice(0, 5).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-900/40">
                  <td className="py-2.5 text-slate-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 font-medium text-slate-200">
                    {tx.action}
                  </td>
                  <td className={`py-2.5 text-right font-bold ${tx.type === 'credit' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {tx.type === 'credit' ? `+${tx.tokensUsed}` : `-${tx.tokensUsed}`}
                  </td>
                  <td className="py-2.5 text-right text-slate-400">
                    {tx.balanceAfter.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
