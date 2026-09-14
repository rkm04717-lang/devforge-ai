import React, { useState } from 'react';
import { 
  Coins, 
  RefreshCw, 
  ArrowLeft, 
  Search, 
  Download, 
  History, 
  Calendar,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { TokenTransaction, TokenWallet } from '../types';

interface TokenHistoryViewProps {
  wallet: TokenWallet;
  transactions: TokenTransaction[];
  onBack: () => void;
  onTriggerRefill?: () => void;
}

export const TokenHistoryView: React.FC<TokenHistoryViewProps> = ({
  wallet,
  transactions,
  onBack,
  onTriggerRefill
}) => {
  const [filter, setFilter] = useState('');

  const filtered = transactions.filter(t => 
    t.action.toLowerCase().includes(filter.toLowerCase()) ||
    (t.projectName && t.projectName.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Token Ledger & Balance
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Server-audited transaction history & daily refill tracking
            </p>
          </div>
        </div>

        {wallet.totalBalance <= 0 && onTriggerRefill && (
          <button
            onClick={onTriggerRefill}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>CLAIM DAILY 1,000 REFILL</span>
          </button>
        )}
      </div>

      {/* Wallet Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-[#0b101b] border border-cyan-500/30">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>TOTAL BALANCE</span>
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {wallet.totalBalance.toLocaleString()}
          </div>
          <div className="text-[10px] text-cyan-400 mt-1">Available for forging</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101b] border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">WELCOME ALLOCATION</div>
          <div className="text-2xl font-bold text-slate-200">
            {wallet.welcomeTokens.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Initial 1,500 bonus</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101b] border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1">STARTER ALLOCATION</div>
          <div className="text-2xl font-bold text-slate-200">
            {wallet.starterTokens.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Foundational 3,000 grant</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0b101b] border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>DAILY REFILLS</span>
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-slate-200">
            {wallet.dailyTokens.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">1,000 / 24h when empty</div>
        </div>
      </div>

      {/* Refill Policy Explanation */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
        <Zap className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white font-semibold">How DEVFORGE AI Tokens Work: </strong>
          DEVFORGE AI is 100% free with no credit cards, subscriptions, or paywalls. Every developer receives 4,500 initial tokens to architect and forge software. When your balance reaches zero, the server automatically grants 1,000 Forge Tokens every 24 hours.
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#0b0f19] border border-slate-800/90 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-white">Full Transaction Ledger</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Search transactions..."
              className="w-full bg-[#080b13] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-[#090d16] text-slate-400">
                <th className="py-3 px-4 font-medium">TIMESTAMP</th>
                <th className="py-3 px-4 font-medium">ACTION / DESCRIPTION</th>
                <th className="py-3 px-4 font-medium">PROJECT</th>
                <th className="py-3 px-4 font-medium text-right">CHANGE</th>
                <th className="py-3 px-4 font-medium text-right">BALANCE AFTER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No transactions matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/40">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {tx.action}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {tx.projectName || '—'}
                    </td>
                    <td className={`py-3 px-4 text-right font-bold whitespace-nowrap ${
                      tx.type === 'credit' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {tx.type === 'credit' ? `+${tx.tokensUsed}` : `-${tx.tokensUsed}`}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-semibold whitespace-nowrap">
                      {tx.balanceAfter.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
