import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Sparkles, 
  Coins, 
  ArrowLeft, 
  Code2, 
  Cpu, 
  Bug, 
  Wrench, 
  HelpCircle,
  FileCode,
  FolderCode
} from 'lucide-react';
import { Project, TokenWallet } from '../types';
import { getEstimatedCost } from '../tokenConfig';

interface AssistantConsoleViewProps {
  wallet: TokenWallet;
  projects: Project[];
  sessionToken?: string;
  onBack: () => void;
  onDeductTokens: (amount: number, action: string) => Promise<boolean>;
  onOpenProject: (project: Project) => void;
}

export const AssistantConsoleView: React.FC<AssistantConsoleViewProps> = ({
  wallet,
  projects,
  sessionToken,
  onBack,
  onDeductTokens,
  onOpenProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<{ id: string; sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `DEVFORGE Senior Software Engineer online.\n\nI am synced with your active repository. You can select any of your projects to inspect, analyze architectures, design algorithms, or ask for code generation.`,
      time: new Date().toLocaleTimeString()
    }
  ]);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();
    setInput('');

    const userMsg = {
      id: 'u_' + Date.now(),
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);

    const cost = 10; // Consulting cost
    if (wallet.totalBalance < cost) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: `You're out of Forge Tokens. Consulting requires ${cost} tokens, but you currently have ${wallet.totalBalance}.`,
          time: new Date().toLocaleTimeString()
        }
      ]);
      return;
    }

    setIsProcessing(true);
    const didDeduct = await onDeductTokens(cost, 'AI Assistant Consultation');
    if (!didDeduct) {
      setIsProcessing(false);
      return;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionToken) {
        headers['x-devforge-session'] = sessionToken;
      }

      const res = await fetch('/api/forge/action', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'EXPLAIN',
          prompt: userText,
          files: selectedProject?.files || [],
          selectedFile: selectedProject?.files[0]?.path || ''
        })
      });

      if (!res.ok) throw new Error('Consultation request failed');
      const data = await res.json();

      let reply = data.changeSummary;
      if (data.explanation?.technicalExplanation) {
        reply = data.explanation.technicalExplanation;
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: reply || "I've analyzed the request. If you'd like to implement this directly into the workspace, you can open the project workspace to edit files.",
          time: new Date().toLocaleTimeString()
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: `Senior Engineer: Unable to process request: ${err?.message || 'Server error'}.`,
          time: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6 font-sans">
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
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              <span>AI Software Engineer Console</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Architectural consulting, algorithmic reasoning & cross-project analysis
            </p>
          </div>
        </div>

        {/* Project Context Selector */}
        {projects.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 hidden sm:inline">Active Context:</span>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className="bg-[#0b101b] border border-slate-700 text-cyan-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {selectedProject && (
              <button
                onClick={() => onOpenProject(selectedProject)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Open IDE
              </button>
            )}
          </div>
        )}
      </div>

      {/* Terminal Chat Box */}
      <div className="h-[600px] bg-[#080b13] border border-slate-800/90 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="h-9 bg-[#0c111e] border-b border-slate-800 px-4 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 font-semibold">devforge-engineer-terminal</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Coins className="w-3.5 h-3.5 text-cyan-400" />
            <span>Consultation: 10 Tokens</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-xl leading-relaxed whitespace-pre-wrap ${
                  m.sender === 'user'
                    ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-100 rounded-br-none'
                    : 'bg-[#0e1422] border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-600 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Analyzing software engineering requirements...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-800 bg-[#07090e]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask senior engineer (e.g. How to optimize 60FPS canvas draw calls?)..."
              disabled={isProcessing}
              className="flex-1 bg-[#0d121e] border border-slate-700/80 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
