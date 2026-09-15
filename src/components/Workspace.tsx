import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Download, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  FileCode, 
  Folder, 
  FolderPlus, 
  Plus, 
  Trash2, 
  Search, 
  RefreshCw, 
  Maximize2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Copy, 
  Check, 
  Coins, 
  Sparkles, 
  Send, 
  Bug, 
  Wrench, 
  HelpCircle, 
  Lightbulb, 
  Cpu, 
  Flame,
  ChevronRight,
  ChevronDown,
  X,
  Code,
  ShieldCheck,
  AlertTriangle,
  Edit3,
  Columns
} from 'lucide-react';
import { 
  Project, 
  ProjectFile, 
  TokenWallet, 
  AIActionType, 
  ProjectTestReport, 
  AIDebugResult, 
  AIExplanationResult 
} from '../types';
import { TOKEN_CONFIG, getEstimatedCost } from '../tokenConfig';
import { downloadProjectAsZip } from '../utils/zipExport';
import { AiEngineerChat } from './AiEngineerChat';

interface WorkspaceProps {
  project: Project;
  wallet: TokenWallet;
  sessionToken?: string;
  onBack: () => void;
  onUpdateProject: (updated: Project) => void;
  onDeductTokens: (amount: number, action: string) => Promise<boolean>;
  onWalletUpdate?: (wallet: TokenWallet) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  affectedFiles?: string[];
  proposedChanges?: { path: string; content: string }[];
  actionType?: AIActionType;
  debugResult?: AIDebugResult;
  explanationResult?: AIExplanationResult;
  tokenCost?: number;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  project,
  wallet,
  sessionToken,
  onBack,
  onUpdateProject,
  onDeductTokens,
  onWalletUpdate
}) => {
  // Active File & Tabs State
  const [openFiles, setOpenFiles] = useState<string[]>(() => {
    return project.files.map(f => f.path);
  });
  const [activeFilePath, setActiveFilePath] = useState<string>(() => {
    const defaultFile = project.files.find(f => f.path === 'index.html' || f.path === 'game.js' || f.path === 'app.js');
    return defaultFile ? defaultFile.path : (project.files[0]?.path || '');
  });

  const [centerView, setCenterView] = useState<'editor' | 'preview' | 'split'>('editor');

  const [searchFilter, setSearchFilter] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeCodeContent, setActiveCodeContent] = useState('');

  // Project Rename State
  const [isEditingName, setIsEditingName] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState(project.name);

  // Editor Line Numbers Synchronized Scrolling Ref
  const lineNumbersRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Mobile / Layout Drawer States
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview' | 'assistant' | 'console' | 'files'>('editor');
  const [isBuilding, setIsBuilding] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  // Bottom Console Tabs
  const [consoleTab, setConsoleTab] = useState<'console' | 'tests' | 'debug'>('console');
  const [consoleLogs, setConsoleLogs] = useState<{ level: string; msg: string; time: string }[]>([
    { level: 'system', msg: `[DEVFORGE ENGINE] Workspace initialized for: ${project.name}`, time: new Date().toLocaleTimeString() },
    { level: 'system', msg: `[SANDBOX VM] Memory allocation: isolated browser runtime`, time: new Date().toLocaleTimeString() }
  ]);

  // Automated Test State
  const [testReport, setTestReport] = useState<ProjectTestReport | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // AI Assistant Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: `Hello! I am your Senior AI Software Engineer for "${project.name}".\n\nI can build, fix, explain, optimize, test, or add features while preserving your existing project files and architecture. What would you like to work on?`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [activeAiAction, setActiveAiAction] = useState<AIActionType | null>(null);

  const activeFile = project.files.find(f => f.path === activeFilePath) || project.files[0];

  useEffect(() => {
    if (activeFile) {
      setActiveCodeContent(activeFile.content);
    }
  }, [activeFilePath, activeFile]);

  // Code copy helper
  const handleCopyCode = () => {
    if (!activeCodeContent) return;
    navigator.clipboard.writeText(activeCodeContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Manual code editor changes
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setActiveCodeContent(newContent);
    
    // Auto-update project file
    const updatedFiles = project.files.map(f => {
      if (f.path === activeFilePath) {
        return { ...f, content: newContent, updatedAt: new Date().toISOString() };
      }
      return f;
    });
    onUpdateProject({ ...project, files: updatedFiles, updatedAt: new Date().toISOString() });
  };

  // Close Tab
  const handleCloseTab = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openFiles.filter(p => p !== path);
    setOpenFiles(remaining);
    if (activeFilePath === path) {
      setActiveFilePath(remaining[0] || '');
    }
  };

  // Open file
  const handleOpenFile = (path: string) => {
    if (!openFiles.includes(path)) {
      setOpenFiles([...openFiles, path]);
    }
    setActiveFilePath(path);
  };

  // Add new file
  const handleCreateNewFile = () => {
    const filename = prompt('Enter new file path (e.g. src/utils/helpers.js):');
    if (!filename || !filename.trim()) return;
    const cleanPath = filename.trim();
    if (project.files.some(f => f.path === cleanPath)) {
      alert('A file with this name already exists.');
      return;
    }

    const ext = cleanPath.split('.').pop() || 'js';
    const newFile: ProjectFile = {
      id: 'f_' + Math.random().toString(36).substring(2, 8),
      path: cleanPath,
      language: ext === 'ts' ? 'typescript' : ext === 'css' ? 'css' : ext === 'html' ? 'html' : 'javascript',
      content: `// ${cleanPath}\n`,
      updatedAt: new Date().toISOString()
    };

    const updated = {
      ...project,
      files: [...project.files, newFile],
      updatedAt: new Date().toISOString()
    };
    onUpdateProject(updated);
    handleOpenFile(cleanPath);
  };

  // Delete file
  const handleDeleteFile = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.files.length <= 1) {
      alert('Cannot delete the only file in the project.');
      return;
    }
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;

    const filtered = project.files.filter(f => f.path !== path);
    const updatedOpen = openFiles.filter(p => p !== path);
    setOpenFiles(updatedOpen);
    if (activeFilePath === path) {
      setActiveFilePath(filtered[0]?.path || '');
    }
    onUpdateProject({ ...project, files: filtered, updatedAt: new Date().toISOString() });
  };

  // Automated Test Runner Action
  const handleRunTests = async () => {
    setIsRunningTests(true);
    setConsoleTab('tests');
    setConsoleLogs(prev => [
      ...prev,
      { level: 'system', msg: `[TEST RUNNER] Launching AST syntax verification & project diagnostics...`, time: new Date().toLocaleTimeString() }
    ]);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionToken) {
        headers['x-devforge-session'] = sessionToken;
      }

      const res = await fetch('/api/forge/test', {
        method: 'POST',
        headers,
        body: JSON.stringify({ files: project.files })
      });

      if (!res.ok) throw new Error('Test run failed');
      const data = await res.json();
      setTestReport(data.report);

      setConsoleLogs(prev => [
        ...prev,
        { 
          level: data.report.overallStatus === 'critical' ? 'error' : 'success', 
          msg: `[TEST REPORT] ${data.report.summary}`, 
          time: new Date().toLocaleTimeString() 
        }
      ]);
    } catch (err: any) {
      setConsoleLogs(prev => [
        ...prev,
        { level: 'error', msg: `[TEST ERROR] ${err?.message}`, time: new Date().toLocaleTimeString() }
      ]);
    } finally {
      setIsRunningTests(false);
    }
  };

  // AI Action Trigger (BUILD, FIX, EXPLAIN, IMPROVE, ADD_FEATURE, REFACTOR, OPTIMIZE)
  const handleExecuteAIAction = async (action: AIActionType, userPrompt?: string) => {
    const cost = getEstimatedCost(action);
    if (wallet.totalBalance < cost) {
      alert(`You’re out of Forge Tokens. This operation requires ${cost} tokens, but you have ${wallet.totalBalance}.`);
      return;
    }

    setIsAiProcessing(true);
    const promptText = userPrompt || (
      action === 'FIX' ? `Fix any bugs in ${activeFilePath}` :
      action === 'EXPLAIN' ? `Explain the implementation and architecture of ${activeFilePath}` :
      action === 'IMPROVE' ? `Improve UI responsiveness and resilience of ${activeFilePath}` :
      action === 'OPTIMIZE' ? `Optimize execution speed and eliminate overhead in ${activeFilePath}` :
      action === 'REFACTOR' ? `Refactor ${activeFilePath} for cleaner modularity` :
      `Execute ${action} on ${project.name}`
    );

    // Add user message
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    try {
      // 1. Deduct tokens
      const didDeduct = await onDeductTokens(cost, `AI ${action}: ${activeFilePath || project.name}`);
      if (!didDeduct) {
        setIsAiProcessing(false);
        return;
      }

      // 2. Call backend AI action endpoint
      const actHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionToken) {
        actHeaders['x-devforge-session'] = sessionToken;
      }

      const res = await fetch('/api/forge/action', {
        method: 'POST',
        headers: actHeaders,
        body: JSON.stringify({
          action,
          prompt: promptText,
          files: project.files,
          selectedFile: activeFilePath,
          selectedCode: activeCodeContent
        })
      });

      if (!res.ok) throw new Error('AI action execution failed');
      const data = await res.json();

      if (action === 'EXPLAIN' && data.explanation) {
        setMessages(prev => [
          ...prev,
          {
            id: 'msg_' + Date.now(),
            sender: 'ai',
            text: `Analysis complete for ${activeFilePath}:`,
            timestamp: new Date().toLocaleTimeString(),
            explanationResult: data.explanation,
            tokenCost: cost
          }
        ]);
      } else if (action === 'FIX' && data.debugResult) {
        const dbg = data.debugResult as AIDebugResult;
        setMessages(prev => [
          ...prev,
          {
            id: 'msg_' + Date.now(),
            sender: 'ai',
            text: `Bug analysis complete: ${dbg.whatWentWrong}\n\nProposed change in ${dbg.affectedFile}: ${dbg.proposedFixSummary}`,
            timestamp: new Date().toLocaleTimeString(),
            debugResult: dbg,
            tokenCost: cost
          }
        ]);
        if (dbg.fixedContent) {
          applyFix(dbg.affectedFile, dbg.fixedContent);
        }
      } else if (data.modifiedFiles && data.modifiedFiles.length > 0) {
        // Apply modified files
        const newFiles = [...project.files];
        data.modifiedFiles.forEach((mod: { path: string; content: string }) => {
          const idx = newFiles.findIndex(f => f.path === mod.path);
          if (idx >= 0) {
            newFiles[idx] = { ...newFiles[idx], content: mod.content, updatedAt: new Date().toISOString() };
          } else {
            newFiles.push({
              id: 'f_' + Math.random().toString(36).substring(2, 7),
              path: mod.path,
              language: 'javascript',
              content: mod.content,
              updatedAt: new Date().toISOString()
            });
          }
        });

        onUpdateProject({ ...project, files: newFiles, updatedAt: new Date().toISOString() });
        setPreviewKey(k => k + 1);

        setMessages(prev => [
          ...prev,
          {
            id: 'msg_' + Date.now(),
            sender: 'ai',
            text: data.changeSummary || `Successfully applied ${action}. Updated ${data.modifiedFiles.length} file(s).`,
            timestamp: new Date().toLocaleTimeString(),
            affectedFiles: data.modifiedFiles.map((m: any) => m.path),
            tokenCost: cost
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: 'msg_' + Date.now(),
            sender: 'ai',
            text: data.changeSummary || `Completed ${action} for ${project.name}.`,
            timestamp: new Date().toLocaleTimeString(),
            tokenCost: cost
          }
        ]);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg_' + Date.now(),
          sender: 'ai',
          text: `Forge could not complete this operation: ${err?.message || 'Network or model error'}. Try again.`,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const applyFix = (filePath: string, fixedContent: string) => {
    const updated = project.files.map(f => {
      if (f.path === filePath) {
        return { ...f, content: fixedContent, updatedAt: new Date().toISOString() };
      }
      return f;
    });
    onUpdateProject({ ...project, files: updated, updatedAt: new Date().toISOString() });
    setPreviewKey(k => k + 1);
    setConsoleLogs(prev => [
      ...prev,
      { level: 'success', msg: `[AI DEBUGGER] Applied verified fix to ${filePath}`, time: new Date().toLocaleTimeString() }
    ]);
  };

  // Live Preview HTML Compiler for browser-safe web apps
  const generatePreviewSrcDoc = () => {
    const htmlFile = project.files.find(f => f.path === 'index.html');
    const cssFile = project.files.find(f => f.path === 'style.css' || f.path.endsWith('.css'));
    const jsFiles = project.files.filter(f => f.path.endsWith('.js') && f.path !== 'server.js');

    if (!htmlFile) {
      return `<!DOCTYPE html><html><body style="background:#090d16;color:#94a3b8;font-family:sans-serif;padding:30px;text-align:center;"><h3>No index.html found in project</h3><p>This project is configured as a backend service or CLI tool. See the execution instructions tab.</p></body></html>`;
    }

    let compiledHtml = htmlFile.content;

    // Clean up local relative CSS link tags to avoid 404 network warnings in sandbox
    compiledHtml = compiledHtml.replace(/<link[^>]+rel=["']stylesheet["'][^>]*href=["'](?!http)[^"']+\.css["'][^>]*>/gi, '<!-- inlined stylesheet -->');

    // Clean up local relative JS script tags to avoid 404 network warnings in sandbox
    compiledHtml = compiledHtml.replace(/<script[^>]+src=["'](?!http)[^"']+\.js["'][^>]*>\s*<\/script>/gi, '<!-- inlined script -->');

    // Inject CSS directly into <head>
    if (cssFile) {
      compiledHtml = compiledHtml.replace(
        '</head>',
        `<style>\n${cssFile.content}\n</style>\n</head>`
      );
    }

    // Console interceptor script to route logs to our bottom terminal
    const consoleInterceptor = `
<script>
  (function() {
    const oldLog = console.log;
    const oldWarn = console.warn;
    const oldError = console.error;

    function send(level, args) {
      try {
        const msg = Array.from(args).map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        window.parent.postMessage({ type: 'DEVFORGE_PREVIEW_LOG', level, msg }, '*');
      } catch(e) {}
    }

    console.log = function() { send('info', arguments); oldLog.apply(console, arguments); };
    console.warn = function() { send('warn', arguments); oldWarn.apply(console, arguments); };
    console.error = function() { send('error', arguments); oldError.apply(console, arguments); };

    window.onerror = function(msg, url, line) {
      send('error', ['Runtime Error: ' + msg + ' (Line ' + line + ')']);
    };
  })();
</script>
`;

    compiledHtml = compiledHtml.replace('<head>', `<head>\n${consoleInterceptor}`);

    // Inject all JS files inline before </body>
    if (jsFiles.length > 0) {
      const scriptTags = jsFiles.map(j => `<script>\n${j.content}\n</script>`).join('\n');
      compiledHtml = compiledHtml.replace('</body>', `${scriptTags}\n</body>`);
    }

    return compiledHtml;
  };

  // Listen for iframe console messages
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data && e.data.type === 'DEVFORGE_PREVIEW_LOG') {
        setConsoleLogs(prev => [
          ...prev.slice(-40),
          { level: e.data.level, msg: e.data.msg, time: new Date().toLocaleTimeString() }
        ]);
      }
    };
    window.addEventListener('message', handleMsg);
    return () => window.removeEventListener('message', handleMsg);
  }, []);

  const isBrowserPreviewSupported = project.plan?.previewType !== 'instructions_only' && project.files.some(f => f.path === 'index.html');

  return (
    <div className="flex flex-col h-[calc(100vh-53px)] bg-[#07090e] text-slate-100 overflow-hidden font-sans">
      {/* Workspace Top Bar */}
      <div className="h-12 bg-[#090d16] border-b border-slate-800/90 px-4 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {isEditingName ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (projectNameInput.trim()) {
                    onUpdateProject({
                      ...project,
                      name: projectNameInput.trim(),
                      updatedAt: new Date().toISOString()
                    });
                  }
                  setIsEditingName(false);
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={projectNameInput}
                  onChange={(e) => setProjectNameInput(e.target.value)}
                  autoFocus
                  className="bg-[#0e1422] border border-cyan-500/50 rounded px-2 py-0.5 text-xs text-white font-bold focus:outline-none max-w-[180px] sm:max-w-xs"
                />
                <button
                  type="submit"
                  className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-mono"
                  title="Save Name"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProjectNameInput(project.name);
                    setIsEditingName(false);
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 
                  onClick={() => setIsEditingName(true)}
                  className="text-sm font-bold text-white tracking-wide truncate max-w-[200px] sm:max-w-xs cursor-pointer hover:text-cyan-300 transition-colors"
                  title="Click to rename project"
                >
                  {project.name}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors opacity-70 group-hover:opacity-100"
                  title="Rename Project"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-400 border border-slate-700/60">
                  {project.technology}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Center / Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Run Tests */}
          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Run Tests</span>
          </button>

          {/* Re-Build Project */}
          <button
            onClick={() => handleExecuteAIAction('BUILD', `Re-architect and rebuild project ${project.name}`)}
            disabled={isAiProcessing}
            className="px-3 py-1.5 rounded-md bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-200 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Build</span>
          </button>

          {/* Download Project as ZIP */}
          <button
            onClick={() => downloadProjectAsZip(project)}
            className="px-3 py-1.5 rounded-md bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-mono font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export ZIP</span>
          </button>
        </div>

        {/* Right Token Cost Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Coins className="w-3.5 h-3.5 text-cyan-400" />
          <span>Balance: <strong className="text-white">{wallet.totalBalance}</strong></span>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center justify-around bg-[#0a0f1b] border-b border-slate-800 text-xs font-mono py-1.5 px-2">
        <button
          onClick={() => setActiveMobileTab('files')}
          className={`px-2.5 py-1 rounded ${activeMobileTab === 'files' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Files ({project.files.length})
        </button>
        <button
          onClick={() => setActiveMobileTab('editor')}
          className={`px-2.5 py-1 rounded ${activeMobileTab === 'editor' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveMobileTab('preview')}
          className={`px-2.5 py-1 rounded ${activeMobileTab === 'preview' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveMobileTab('assistant')}
          className={`px-2.5 py-1 rounded ${activeMobileTab === 'assistant' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          AI Engineer
        </button>
        <button
          onClick={() => setActiveMobileTab('console')}
          className={`px-2.5 py-1 rounded ${activeMobileTab === 'console' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          Terminal
        </button>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* LEFT: File Tree (Desktop: 2 cols, Mobile: full if tab) */}
        <div className={`col-span-12 lg:col-span-2 bg-[#080b13] border-r border-slate-800 flex flex-col ${
          activeMobileTab === 'files' ? 'block' : 'hidden lg:flex'
        }`}>
          <div className="p-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              PROJECT FILES
            </span>
            <button
              onClick={handleCreateNewFile}
              title="Add New File"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-2 border-b border-slate-800/60">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Filter files..."
                className="w-full bg-[#0d121e] border border-slate-800 rounded-md pl-8 pr-2 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5">
            {project.files
              .filter(f => f.path.toLowerCase().includes(searchFilter.toLowerCase()))
              .map(file => {
                const isActive = file.path === activeFilePath;
                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      handleOpenFile(file.path);
                      if (window.innerWidth < 1024) setActiveMobileTab('editor');
                    }}
                    className={`group px-2.5 py-1.5 rounded-md text-xs font-mono flex items-center justify-between cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-500/30' 
                        : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${
                        file.path.endsWith('.html') ? 'text-orange-400' :
                        file.path.endsWith('.css') ? 'text-sky-400' :
                        file.path.endsWith('.js') ? 'text-amber-400' :
                        file.path.endsWith('.ts') ? 'text-blue-400' :
                        file.path.endsWith('.json') ? 'text-emerald-400' : 'text-slate-400'
                      }`} />
                      <span className="truncate">{file.path}</span>
                    </div>

                    <button
                      onClick={(e) => handleDeleteFile(file.path, e)}
                      title="Delete file"
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
          </div>

          <div className="p-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center">
            {project.files.length} FILES IN WORKSPACE
          </div>
        </div>

        {/* CENTER: Editor & Code Viewer / Live Preview Workspace (Desktop: 6 cols, Mobile: full if tab) */}
        <div className={`col-span-12 lg:col-span-6 bg-[#090d16] border-r border-slate-800 flex flex-col h-full overflow-hidden ${
          activeMobileTab === 'editor' || activeMobileTab === 'preview' || activeMobileTab === 'console' ? 'block' : 'hidden lg:flex'
        }`}>
          {/* File Tabs & View Switcher Bar */}
          <div className="h-9 bg-[#070a12] border-b border-slate-800/90 flex items-center justify-between px-2 gap-1 overflow-x-auto flex-shrink-0">
            {/* Open Files Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {openFiles.map(path => {
                const isActive = path === activeFilePath;
                return (
                  <div
                    key={path}
                    onClick={() => {
                      setActiveFilePath(path);
                      if (centerView === 'preview') setCenterView('editor');
                    }}
                    className={`h-7 px-2.5 rounded-t-md text-xs font-mono flex items-center gap-2 cursor-pointer border-t border-x transition-colors ${
                      isActive 
                        ? 'bg-[#090d16] text-cyan-300 border-slate-700 font-semibold' 
                        : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/40'
                    }`}
                  >
                    <span className="truncate max-w-[120px]">{path}</span>
                    <button
                      onClick={(e) => handleCloseTab(path, e)}
                      className="p-0.5 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* View Mode Segmented Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="bg-[#0b101c] p-0.5 rounded-md border border-slate-800 flex items-center text-[11px] font-mono">
                <button
                  onClick={() => setCenterView('editor')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                    centerView === 'editor' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Code Editor View"
                >
                  <Code className="w-3 h-3" />
                  <span className="hidden sm:inline">Code</span>
                </button>
                <button
                  onClick={() => setCenterView('preview')}
                  className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                    centerView === 'preview' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Live Preview View"
                >
                  <Play className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
                <button
                  onClick={() => setCenterView('split')}
                  className={`hidden md:flex px-2 py-0.5 rounded items-center gap-1 transition-colors cursor-pointer ${
                    centerView === 'split' ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Split Code & Preview"
                >
                  <Columns className="w-3 h-3 text-cyan-400" />
                  <span>Split</span>
                </button>
              </div>

              {/* Preview Controls (when preview or split active) */}
              {(centerView === 'preview' || centerView === 'split' || activeMobileTab === 'preview') && isBrowserPreviewSupported && (
                <div className="flex items-center gap-1 text-slate-400 pl-1 border-l border-slate-800">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1 rounded cursor-pointer ${previewDevice === 'desktop' ? 'text-cyan-400 bg-slate-800' : 'hover:text-slate-200'}`}
                    title="Desktop"
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`p-1 rounded cursor-pointer ${previewDevice === 'tablet' ? 'text-cyan-400 bg-slate-800' : 'hover:text-slate-200'}`}
                    title="Tablet"
                  >
                    <Tablet className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1 rounded cursor-pointer ${previewDevice === 'mobile' ? 'text-cyan-400 bg-slate-800' : 'hover:text-slate-200'}`}
                    title="Mobile"
                  >
                    <Smartphone className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setPreviewKey(k => k + 1)}
                    className="p-1 rounded hover:text-slate-200 cursor-pointer"
                    title="Reload Preview"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Copy Code (when editor active) */}
              {(centerView === 'editor' || centerView === 'split') && (
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* Main Center Display: Editor / Preview / Split */}
          <div className="flex-1 relative overflow-hidden bg-[#070a12] flex flex-col min-h-0">
            {/* Split Mode: 2 Columns */}
            {centerView === 'split' && activeMobileTab !== 'preview' && activeMobileTab !== 'console' ? (
              <div className="flex-1 grid grid-cols-2 overflow-hidden h-full">
                {/* Left: Code Editor */}
                <div className="h-full border-r border-slate-800 flex overflow-hidden">
                  <div 
                    ref={lineNumbersRef}
                    className="w-10 bg-[#070a12] select-none text-slate-600 font-mono text-xs py-3 text-right pr-2 border-r border-slate-800/60 overflow-hidden leading-5 pointer-events-none"
                  >
                    {Array.from({ length: Math.max(30, activeCodeContent.split('\n').length) }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={activeCodeContent}
                    onChange={handleCodeChange}
                    spellCheck={false}
                    className="flex-1 bg-transparent text-slate-200 font-mono text-xs p-3 leading-5 resize-none focus:outline-none overflow-auto selection:bg-cyan-500/30 whitespace-pre"
                  />
                </div>

                {/* Right: Live Preview */}
                <div className="h-full bg-[#05070c] flex items-center justify-center p-2 overflow-hidden">
                  {isBrowserPreviewSupported ? (
                    <div className="w-full h-full border border-slate-800 rounded-lg overflow-hidden bg-white shadow-xl">
                      <iframe
                        key={previewKey}
                        title="Live Preview Split"
                        srcDoc={generatePreviewSrcDoc()}
                        sandbox="allow-scripts allow-modals allow-same-origin"
                        className="w-full h-full border-none"
                      />
                    </div>
                  ) : (
                    <div className="text-center p-4 text-xs text-slate-400">
                      CLI / Backend project. Run with <code className="text-cyan-400 font-mono">npm start</code>
                    </div>
                  )}
                </div>
              </div>
            ) : (centerView === 'preview' || activeMobileTab === 'preview') && activeMobileTab !== 'editor' && activeMobileTab !== 'console' ? (
              /* Live Preview Full View */
              <div className="flex-1 bg-[#05070c] flex items-center justify-center p-3 overflow-hidden">
                {isBrowserPreviewSupported ? (
                  <div 
                    className={`h-full border border-slate-800 rounded-lg overflow-hidden bg-white shadow-2xl transition-all duration-300 ${
                      previewDevice === 'mobile' ? 'w-[375px]' :
                      previewDevice === 'tablet' ? 'w-[768px]' : 'w-full'
                    }`}
                  >
                    <iframe
                      key={previewKey}
                      title="Live Preview"
                      srcDoc={generatePreviewSrcDoc()}
                      sandbox="allow-scripts allow-modals allow-same-origin"
                      className="w-full h-full border-none"
                    />
                  </div>
                ) : (
                  <div className="p-6 text-center max-w-sm space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-amber-400">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">Backend / CLI Project</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        This project targets Node.js / Express and cannot be executed directly inside the browser sandbox.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-left font-mono text-[11px] text-cyan-300 space-y-1">
                      <div className="text-slate-500"># Run locally:</div>
                      <div>npm install</div>
                      <div>npm start</div>
                    </div>
                    <button
                      onClick={() => downloadProjectAsZip(project)}
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Project ZIP</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Code Editor Full View */
              <div className="flex-1 flex overflow-hidden">
                <div 
                  ref={lineNumbersRef}
                  className="w-10 bg-[#070a12] select-none text-slate-600 font-mono text-xs py-3 text-right pr-2 border-r border-slate-800/60 overflow-hidden leading-5 pointer-events-none"
                >
                  {Array.from({ length: Math.max(30, activeCodeContent.split('\n').length) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  value={activeCodeContent}
                  onChange={handleCodeChange}
                  onScroll={(e) => {
                    if (lineNumbersRef.current) {
                      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
                    }
                  }}
                  spellCheck={false}
                  className="flex-1 bg-transparent text-slate-200 font-mono text-xs p-3 leading-5 resize-none focus:outline-none overflow-auto selection:bg-cyan-500/30 whitespace-pre"
                />
              </div>
            )}
          </div>

          {/* BOTTOM: Console / Build / Test Output Drawer */}
          <div className="h-44 bg-[#080b13] border-t border-slate-800 flex flex-col flex-shrink-0">
            <div className="h-7 bg-[#0b0f19] border-b border-slate-800/80 px-3 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setConsoleTab('console')}
                  className={`flex items-center gap-1.5 cursor-pointer ${consoleTab === 'console' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>Terminal Console</span>
                </button>
                <button
                  onClick={() => setConsoleTab('tests')}
                  className={`flex items-center gap-1.5 cursor-pointer ${consoleTab === 'tests' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-300'}`}
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Test Diagnostics {testReport ? `(${testReport.passedCount} Passed)` : ''}</span>
                </button>
              </div>
              <button
                onClick={() => setConsoleLogs([])}
                className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 font-mono text-xs space-y-1">
              {consoleTab === 'console' && (
                consoleLogs.length === 0 ? (
                  <div className="text-slate-600">Console ready. Application logs will appear here in real time.</div>
                ) : (
                  consoleLogs.map((l, i) => (
                    <div key={i} className="leading-tight flex items-start gap-2">
                      <span className="text-slate-600 text-[10px]">{l.time}</span>
                      <span className={
                        l.level === 'error' ? 'text-rose-400 font-semibold' :
                        l.level === 'warn' ? 'text-amber-400' :
                        l.level === 'success' ? 'text-emerald-400' :
                        l.level === 'system' ? 'text-cyan-400' : 'text-slate-300'
                      }>
                        {l.msg}
                      </span>
                    </div>
                  ))
                )
              )}

              {consoleTab === 'tests' && (
                !testReport ? (
                  <div className="text-slate-500 text-center py-4">
                    Click "Run Tests" in the top toolbar to execute static analysis & dependency checks.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-200 mb-2">
                      Status: <span className={testReport.overallStatus === 'critical' ? 'text-rose-400' : 'text-emerald-400'}>
                        {testReport.overallStatus.toUpperCase()}
                      </span> — {testReport.summary}
                    </div>
                    {testReport.items.map((item) => (
                      <div key={item.id} className="text-[11px] flex items-start gap-2">
                        {item.status === 'passed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-slate-300">{item.message}</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: AI ENGINEER CHAT (Desktop: 4 cols, Mobile: full if assistant tab) */}
        <div className={`col-span-12 lg:col-span-4 bg-[#080b13] flex flex-col h-full overflow-hidden ${
          activeMobileTab === 'assistant' ? 'block' : 'hidden lg:flex'
        }`}>
          <AiEngineerChat
            project={project}
            wallet={wallet}
            sessionToken={sessionToken}
            activeFilePath={activeFilePath}
            testReport={testReport}
            consoleErrors={consoleLogs.filter(l => l.level === 'error')}
            onOpenFile={(path) => {
              handleOpenFile(path);
              setCenterView('editor');
              if (window.innerWidth < 1024) setActiveMobileTab('editor');
            }}
            onUpdateProject={onUpdateProject}
            onRefreshPreview={() => {
              setPreviewKey(k => k + 1);
              setConsoleLogs(prev => [
                ...prev,
                { level: 'system', msg: `[DEVFORGE ENGINE] Live Preview reloaded with new changes.`, time: new Date().toLocaleTimeString() }
              ]);
            }}
            onSwitchToPreview={() => {
              setCenterView('preview');
              if (window.innerWidth < 1024) setActiveMobileTab('preview');
            }}
            onWalletUpdate={onWalletUpdate}
          />
        </div>
      </div>
    </div>
  );
};
