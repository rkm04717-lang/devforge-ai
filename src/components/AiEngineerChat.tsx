import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Square,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Coins,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Play,
  Zap,
  Layers,
  Terminal,
  HelpCircle,
  Wrench,
  Cpu,
  Plus
} from 'lucide-react';
import { Project, ChatMessage, TokenWallet, ProjectTestReport, AIActionType } from '../types';

interface AiEngineerChatProps {
  project: Project;
  wallet: TokenWallet;
  sessionToken?: string;
  activeFilePath: string;
  testReport: ProjectTestReport | null;
  consoleErrors: { level: string; msg: string; time: string }[];
  onOpenFile: (path: string) => void;
  onUpdateProject: (updated: Project) => void;
  onRefreshPreview: () => void;
  onSwitchToPreview?: () => void;
  onWalletUpdate?: (wallet: TokenWallet) => void;
}

const QUICK_PROMPTS = [
  { label: '+ Mobile Controls', prompt: 'Add responsive touch/mobile controls so it works seamlessly on phones and tablets.' },
  { label: 'Fix Collision / Bugs', prompt: 'Inspect the code and fix any collision, boundary, or logic bugs.' },
  { label: 'Make Look Professional', prompt: 'Make the visual styling look sleek, high-contrast, and professional.' },
  { label: 'Add Boss Enemy', prompt: 'Add a challenging boss enemy with health bar and special attack patterns.' },
  { label: 'Explain Architecture', prompt: 'Explain the architecture and how state and event loops are managed in this project.' },
  { label: 'Optimize Performance', prompt: 'Optimize rendering performance and eliminate unnecessary calculations or memory leaks.' }
];

export const AiEngineerChat: React.FC<AiEngineerChatProps> = ({
  project,
  wallet,
  sessionToken,
  activeFilePath,
  testReport,
  consoleErrors,
  onOpenFile,
  onUpdateProject,
  onRefreshPreview,
  onSwitchToPreview,
  onWalletUpdate
}) => {
  // Chat History - load from project if available or default
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (project.chatHistory && project.chatHistory.length > 0) {
      return project.chatHistory;
    }
    return [
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: `Hello! I am your Senior AI Software Engineer for "${project.name}".\n\nI can continuously build, fix, explain, refactor, optimize, or add features directly to your code while preserving your existing files. What would you like to build or improve?`,
        timestamp: new Date().toLocaleTimeString(),
        suggestedFollowUps: [
          'Make the game look more professional',
          'Add responsive mobile controls',
          'Explain how this code works'
        ]
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Analyzing project context...');
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastFailedPrompt, setLastFailedPrompt] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync messages when project changes
  useEffect(() => {
    if (project.chatHistory && project.chatHistory.length > 0) {
      setMessages(project.chatHistory);
    }
  }, [project.id]);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, isProcessing]);

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  // Stop Generation
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
    setStatusMessage('');
  };

  // Clear Chat History
  const handleClearHistory = async () => {
    if (!confirm('Clear AI Engineer conversation history for this project?')) return;
    const initialWelcome: ChatMessage = {
      id: 'msg_welcome_' + Date.now(),
      sender: 'ai',
      text: `Conversation cleared. Ready for your next instructions for "${project.name}".`,
      timestamp: new Date().toLocaleTimeString(),
      suggestedFollowUps: [
        'Add mobile controls',
        'Make the game look more professional',
        'Check for errors or bugs'
      ]
    };
    setMessages([initialWelcome]);
    onUpdateProject({ ...project, chatHistory: [initialWelcome] });

    if (sessionToken && project.id) {
      try {
        await fetch('/api/forge/chat/clear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-devforge-session': sessionToken
          },
          body: JSON.stringify({ projectId: project.id })
        });
      } catch (err) {
        console.warn('Failed to clear server chat history:', err);
      }
    }
  };

  // Submit User Message
  const handleSendMessage = async (promptToSend?: string) => {
    const messageText = (promptToSend || input).trim();
    if (!messageText || isProcessing) return;

    // Check minimum balance
    if (wallet.totalBalance < 20) {
      setLastError("You're out of Forge Tokens. Chatting with the AI Engineer requires at least 20 tokens.");
      return;
    }

    setLastError(null);
    setLastFailedPrompt(null);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Add user message to state
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now() + '_u',
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString()
    };

    const updatedMessagesWithUser = [...messages, userMsg];
    setMessages(updatedMessagesWithUser);
    setIsProcessing(true);
    setStatusMessage('Analyzing project files & context...');

    // Rotate status messages for rich, authentic feedback
    const statusTimer1 = setTimeout(() => setStatusMessage('Reviewing architecture & AST...'), 900);
    const statusTimer2 = setTimeout(() => setStatusMessage('Synthesizing code modifications...'), 2100);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (sessionToken) {
        headers['x-devforge-session'] = sessionToken;
      }

      const response = await fetch('/api/forge/chat', {
        method: 'POST',
        headers,
        signal: abortController.signal,
        body: JSON.stringify({
          projectId: project.id,
          projectName: project.name,
          projectDescription: project.description,
          projectTechnology: project.technology,
          message: messageText,
          history: messages.slice(-10).map(m => ({ sender: m.sender, text: m.text })),
          files: project.files,
          activeFilePath,
          testDiagnostics: testReport,
          consoleErrors: consoleErrors.slice(-5)
        })
      });

      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 402) {
          throw new Error(errData.message || "You're out of Forge Tokens.");
        }
        throw new Error(errData.message || errData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();

      // Update wallet if returned
      if (data.wallet && onWalletUpdate) {
        onWalletUpdate(data.wallet);
      }

      // If files were modified, update project files
      let newFiles = [...project.files];
      if (data.modifiedFiles && Array.isArray(data.modifiedFiles) && data.modifiedFiles.length > 0) {
        for (const mod of data.modifiedFiles) {
          const idx = newFiles.findIndex(f => f.path === mod.path);
          if (idx >= 0) {
            newFiles[idx] = {
              ...newFiles[idx],
              content: mod.content,
              updatedAt: new Date().toISOString()
            };
          } else {
            const ext = mod.path.split('.').pop() || 'js';
            newFiles.push({
              id: 'f_' + Math.random().toString(36).substring(2, 8),
              path: mod.path,
              language: ext === 'css' ? 'css' : ext === 'html' ? 'html' : ext === 'json' ? 'json' : 'javascript',
              content: mod.content,
              updatedAt: new Date().toISOString()
            });
          }
        }
        onRefreshPreview();
      }

      const aiMsg: ChatMessage = {
        id: 'msg_' + Date.now() + '_a',
        sender: 'ai',
        text: data.replyMessage || data.changesSummary || 'Changes applied successfully.',
        timestamp: new Date().toLocaleTimeString(),
        actionType: data.detectedAction,
        affectedFiles: data.affectedFiles || [],
        tokenCost: data.tokenCost,
        previewUpdated: Boolean(data.previewUpdated),
        suggestedFollowUps: data.suggestedFollowUps || []
      };

      const finalMessages = [...updatedMessagesWithUser, aiMsg];
      setMessages(finalMessages);

      // Save to project state
      onUpdateProject({
        ...project,
        files: newFiles,
        chatHistory: finalMessages,
        updatedAt: new Date().toISOString()
      });

    } catch (err: any) {
      clearTimeout(statusTimer1);
      clearTimeout(statusTimer2);

      if (err.name === 'AbortError') {
        console.log('AI generation cancelled by user');
      } else {
        const errorMsg = err?.message || 'Failed to reach AI Engineer. Check your connection.';
        setLastError(errorMsg);
        setLastFailedPrompt(messageText);

        const errorAiMsg: ChatMessage = {
          id: 'msg_err_' + Date.now(),
          sender: 'ai',
          text: `⚠️ Could not complete request: ${errorMsg}`,
          timestamp: new Date().toLocaleTimeString(),
          status: 'error',
          errorMessage: errorMsg
        };
        setMessages(prev => [...prev, errorAiMsg]);
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080b13] border-l border-slate-800 text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="h-11 px-3 bg-[#0a0f1c] border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-cyan-950">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white tracking-wide">
                AI Engineer
              </span>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                Active Pair
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            title="Clear Chat Conversation"
            className="p-1.5 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Context Awareness Bar */}
      <div className="px-3 py-1.5 bg-[#090d18] border-b border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-slate-500">Active File:</span>
          <button
            onClick={() => onOpenFile(activeFilePath)}
            className="text-cyan-400 hover:underline truncate max-w-[140px]"
            title={activeFilePath}
          >
            {activeFilePath || 'None'}
          </button>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Coins className="w-3 h-3 text-cyan-400" />
          <span>{wallet.totalBalance} T</span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              {/* Message Header */}
              <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono text-slate-500">
                {isUser ? (
                  <>
                    <span>You</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400 font-semibold">DEVFORGE AI</span>
                    {msg.actionType && (
                      <span className="px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-[9px] uppercase font-bold">
                        {msg.actionType}
                      </span>
                    )}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </>
                )}
              </div>

              {/* Bubble Body */}
              <div
                className={`max-w-[92%] p-3 rounded-xl leading-relaxed text-xs ${
                  isUser
                    ? 'bg-cyan-950/70 border border-cyan-500/30 text-cyan-100 rounded-tr-none'
                    : msg.status === 'error'
                    ? 'bg-rose-950/40 border border-rose-800 text-rose-200 rounded-tl-none'
                    : 'bg-[#0e1424] border border-slate-800/90 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {msg.text}
                </div>

                {/* Affected Files List */}
                {msg.affectedFiles && msg.affectedFiles.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                      <FileCode className="w-3 h-3 text-cyan-400" />
                      <span>MODIFIED FILES:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {msg.affectedFiles.map(af => (
                        <button
                          key={af}
                          onClick={() => onOpenFile(af)}
                          className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/50 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>{af}</span>
                          <ChevronRight className="w-2.5 h-2.5 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview Updated Banner */}
                {msg.previewUpdated && (
                  <div className="mt-2.5 flex items-center justify-between p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Live Preview synchronized</span>
                    </div>
                    {onSwitchToPreview && (
                      <button
                        onClick={onSwitchToPreview}
                        className="text-[10px] underline font-bold hover:text-white flex items-center gap-0.5 cursor-pointer"
                      >
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>SUGGESTED NEXT STEPS:</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {msg.suggestedFollowUps.map((su, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(su)}
                          disabled={isProcessing}
                          className="text-left px-2 py-1 rounded bg-[#131b30] hover:bg-cyan-950/60 border border-slate-700/60 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-200 transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate">{su}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Token Cost Badge */}
                {msg.tokenCost && (
                  <div className="mt-2 text-right">
                    <span className="text-[9px] font-mono text-slate-500 bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">
                      -{msg.tokenCost} Forge Tokens
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Real-time Thinking Indicator */}
        {isProcessing && (
          <div className="flex flex-col items-start space-y-1">
            <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono text-slate-500">
              <span className="text-cyan-400 font-semibold">DEVFORGE AI</span>
              <span>•</span>
              <span>thinking...</span>
            </div>
            <div className="p-3 rounded-xl rounded-tl-none bg-[#0e1424] border border-cyan-500/30 text-cyan-200 text-xs flex items-center gap-2.5 shadow-md">
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="font-mono text-xs">{statusMessage}</span>
              <button
                onClick={handleStop}
                className="ml-auto px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono border border-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <Square className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                Stop
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error / Retry Banner */}
      {lastError && (
        <div className="px-3 py-2 bg-rose-950/40 border-t border-rose-800 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-1.5 truncate">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span className="truncate">{lastError}</span>
          </div>
          {lastFailedPrompt && (
            <button
              onClick={() => handleSendMessage(lastFailedPrompt)}
              disabled={isProcessing}
              className="px-2 py-0.5 rounded bg-rose-900 hover:bg-rose-800 text-[11px] font-mono text-white flex items-center gap-1 flex-shrink-0 ml-2 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      )}

      {/* Quick Prompts Carousel */}
      <div className="px-2 py-1.5 bg-[#090d18] border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-1.5 flex-shrink-0">
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 pl-1">
          <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> Quick:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp.prompt)}
            disabled={isProcessing}
            className="whitespace-nowrap px-2 py-1 rounded bg-[#111728] hover:bg-slate-800 text-[11px] font-mono text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-2.5 bg-[#0a0f1c] border-t border-slate-800 flex-shrink-0">
        <div className="relative flex items-end gap-2 bg-[#06080e] border border-slate-700/80 focus-within:border-cyan-500 rounded-xl p-1.5 shadow-inner">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder="Tell the AI Engineer what to build, fix, or improve... (Enter to send)"
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 resize-none focus:outline-none px-2 py-1 max-h-[140px] leading-relaxed font-sans"
          />

          <div className="flex items-center gap-1 flex-shrink-0">
            {isProcessing ? (
              <button
                onClick={handleStop}
                title="Stop generation"
                className="p-2 rounded-lg bg-rose-950/80 text-rose-400 hover:bg-rose-900 transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-rose-400" />
              </button>
            ) : (
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isProcessing}
                title="Send instruction to Senior AI Engineer"
                className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-30 disabled:hover:bg-cyan-600 transition-colors cursor-pointer shadow-sm shadow-cyan-950"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1 px-1">
          <span>Shift+Enter for newline</span>
          <span className="text-slate-400">⚡ Natural Language Continuous Development</span>
        </div>
      </div>
    </div>
  );
};
