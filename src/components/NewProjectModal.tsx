import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  AlertTriangle, 
  Coins, 
  Code2, 
  Flame,
  Globe,
  Gamepad2,
  Server,
  Smartphone,
  Check
} from 'lucide-react';
import { Project, ProjectPlan, ProjectType, TokenWallet } from '../types';
import { TOKEN_CONFIG } from '../tokenConfig';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: TokenWallet;
  userId?: string;
  sessionToken?: string;
  onProjectForged: (project: Project, tokensUsed: number) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  wallet,
  userId,
  sessionToken,
  onProjectForged
}) => {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState<ProjectType>('web_app');
  const [phase, setPhase] = useState<'prompt' | 'planning' | 'plan_ready' | 'forging'>('prompt');
  const [plan, setPlan] = useState<ProjectPlan | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickIdeas = [
    {
      title: 'Dragon Arena 60FPS Game',
      category: 'game' as ProjectType,
      text: 'Build me a browser-based dragon game with mobile controls, flame particle breath, and wyvern swarms.'
    },
    {
      title: 'CyberPulse Fitness Engine',
      category: 'web_app' as ProjectType,
      text: 'Build an athletic fitness tracking dashboard with interval countdown timers and SVG progress rings.'
    },
    {
      title: 'High-Concurrency REST API',
      category: 'api_backend' as ProjectType,
      text: 'Create a resilient Node.js Express REST API gateway with telemetry tracking, health endpoints, and documentation.'
    }
  ];

  const handleGeneratePlan = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Please describe what software project you want to build.');
      return;
    }
    setErrorMsg(null);
    setPhase('planning');
    setStatusMessage('Analyzing technical requirements & choosing technology stack...');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionToken) {
        headers['x-devforge-session'] = sessionToken;
      }

      const response = await fetch('/api/forge/plan', {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, category })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required. Please sign in to forge projects.');
        }
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      setPlan(data.plan);
      setPhase('plan_ready');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to architect project plan. Please try again.');
      setPhase('prompt');
    }
  };

  const handleStartForging = async () => {
    if (!plan) return;

    // Check token balance
    const cost = plan.estimatedForgeTokens || TOKEN_CONFIG.COSTS.SMALL_PROJECT_BUILD;
    if (wallet.totalBalance < cost) {
      setErrorMsg(`You’re out of Forge Tokens. Required: ${cost}, Current Balance: ${wallet.totalBalance}.`);
      return;
    }

    setPhase('forging');
    setErrorMsg(null);

    const forgePhases = [
      'Analyzing your request...',
      'Designing architecture...',
      'Forging files...',
      'Running validation...',
      'Preparing preview...',
      'Forge complete.'
    ];

    let phaseIndex = 0;
    const interval = setInterval(() => {
      if (phaseIndex < forgePhases.length - 1) {
        phaseIndex++;
        setStatusMessage(forgePhases[phaseIndex]);
      }
    }, 700);

    try {
      const authHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionToken) {
        authHeaders['x-devforge-session'] = sessionToken;
      }

      // 1. Generate multi-file project from server
      const genRes = await fetch('/api/forge/generate', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ prompt, plan })
      });

      if (!genRes.ok) {
        const gErr = await genRes.json().catch(() => ({}));
        throw new Error(gErr.message || gErr.error || 'Project forge generation failed');
      }

      const genData = await genRes.json();

      // 2. Deduct tokens from server wallet
      const deductRes = await fetch('/api/tokens/deduct', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          amount: cost,
          action: `Forged Project: ${plan.projectName}`,
          projectName: plan.projectName
        })
      });

      if (!deductRes.ok) {
        const dErr = await deductRes.json().catch(() => ({}));
        throw new Error(dErr.error || dErr.message || 'Token deduction rejected.');
      }

      clearInterval(interval);
      setStatusMessage('Forge complete.');

      const newProject: Project = {
        id: 'proj_' + Math.random().toString(36).substring(2, 9),
        userId: userId || 'authenticated_architect',
        name: plan.projectName,
        description: plan.description,
        technology: plan.techStack.primary,
        category: category,
        status: 'forged',
        files: genData.files || [],
        plan: plan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTimeout(() => {
        onProjectForged(newProject, cost);
        onClose();
      }, 500);

    } catch (err: any) {
      clearInterval(interval);
      setErrorMsg(err?.message || 'Error during forge build.');
      setPhase('plan_ready');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0b0f19] border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center">
              <Flame className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Forge New Project
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Senior AI Software Engineer • Multi-File Architecture
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Error</div>
              <div>{errorMsg}</div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {phase === 'prompt' && (
            <>
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Project Domain
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'web_app', label: 'Web App', icon: Globe },
                    { key: 'game', label: 'Canvas Game', icon: Gamepad2 },
                    { key: 'api_backend', label: 'API Backend', icon: Server },
                    { key: 'mobile_app', label: 'Mobile PWA', icon: Smartphone }
                  ].map(c => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setCategory(c.key as ProjectType)}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                          category === c.key
                            ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Natural Language Prompt Input */}
              <div>
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  What do you want to build?
                </label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g. Build me a multiplayer dragon game with mobile controls, flame particle breath, and wyvern swarms..."
                  rows={4}
                  className="w-full bg-[#080b13] border border-slate-700/80 focus:border-cyan-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors resize-none font-sans leading-relaxed"
                />
              </div>

              {/* Quick Prompt Starters */}
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Quick Architecture Blueprints:
                </label>
                <div className="space-y-1.5">
                  {quickIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrompt(idea.text);
                        setCategory(idea.category);
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 text-xs transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors">
                        {idea.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {idea.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Planning State Indicator */}
          {phase === 'planning' && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin mx-auto" />
              <div>
                <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  AI ARCHITECT AT WORK
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {statusMessage}
                </p>
              </div>
            </div>
          )}

          {/* Plan Ready Review State */}
          {phase === 'plan_ready' && plan && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                    ARCHITECTURAL BLUEPRINT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                    {plan.techStack.primary}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{plan.projectName}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>
              </div>

              {/* Implementation Steps */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Implementation Plan ({plan.steps?.length || 0} Steps)
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {plan.steps?.map((step) => (
                    <div key={step.id} className="p-2.5 rounded-lg bg-[#080c14] border border-slate-800 text-xs flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5">
                        {step.id}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{step.title}</div>
                        <div className="text-[11px] text-slate-400">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Token Cost Estimation & Wallet Check */}
              <div className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-cyan-400" />
                  <span className="text-slate-400">Estimated Cost:</span>
                  <span className="text-white font-bold">{plan.estimatedForgeTokens} Tokens</span>
                </div>
                <div className="text-slate-400">
                  Current Balance: <strong className="text-cyan-400">{wallet.totalBalance.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Forging Active State */}
          {phase === 'forging' && (
            <div className="py-14 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-amber-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-mono font-bold text-white tracking-widest uppercase">
                  FORGING PROJECT FILES
                </h3>
                <p className="text-xs text-cyan-400 font-mono mt-1">
                  {statusMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-500">
            {phase === 'prompt' && 'Step 1 of 2: Architecture Request'}
            {phase === 'plan_ready' && 'Step 2 of 2: Review Blueprint & Authorize Forge'}
          </div>

          <div className="flex items-center gap-2">
            {phase === 'plan_ready' && (
              <button
                type="button"
                onClick={() => setPhase('prompt')}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Back
              </button>
            )}

            {phase === 'prompt' && (
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={!prompt.trim()}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2"
              >
                <span>ARCHITECT PLAN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {phase === 'plan_ready' && (
              <button
                type="button"
                onClick={handleStartForging}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-cyan-950/40 flex items-center gap-2"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>START FORGING</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
