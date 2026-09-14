import React, { useState, useEffect, useMemo } from 'react';
import { Code2, PlusCircle } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { Workspace } from './components/Workspace';
import { ProjectsView } from './components/ProjectsView';
import { AssistantConsoleView } from './components/AssistantConsoleView';
import { TokenHistoryView } from './components/TokenHistoryView';
import { SettingsView } from './components/SettingsView';
import { NewProjectModal } from './components/NewProjectModal';
import { AuthModal } from './components/AuthModal';
import { AuthPromptModal } from './components/AuthPromptModal';
import { Project, TokenTransaction, TokenWallet, UserProfile } from './types';
import { SAMPLE_DRAGON_GAME_PROJECT } from './sampleProjects';

const STORAGE_PROJECTS_KEY = 'devforge_projects_v2';
const STORAGE_USER_KEY = 'devforge_user_v2';
const STORAGE_WALLET_KEY = 'devforge_wallet_v2';
const STORAGE_TX_KEY = 'devforge_transactions_v2';
const STORAGE_SESSION_KEY = 'devforge_session_v2';

/**
 * Filter to determine whether a project is a pre-packaged demo/sample project.
 * Real user-created projects must NEVER be deleted or modified.
 */
export function isDemoProject(p: any): boolean {
  if (!p || typeof p !== 'object') return false;
  const id = String(p.id || '');
  const userId = String(p.userId || '');
  const name = String(p.name || '');
  return (
    id === 'proj_sample_dragon_game' ||
    id === 'proj_sample_cyberpulse_fitness' ||
    id.startsWith('proj_sample_') ||
    userId === 'user_devforge_demo' ||
    name === 'Dragon Arena: Flight & Flame' ||
    name === 'CyberPulse Fitness Engine'
  );
}

export default function App() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'signup'>('signup');
  const [pendingOpenNewProjectAfterAuth, setPendingOpenNewProjectAfterAuth] = useState(false);

  const [sessionToken, setSessionToken] = useState<string>(() => {
    return localStorage.getItem(STORAGE_SESSION_KEY) || '';
  });

  // User profile state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const cachedToken = localStorage.getItem(STORAGE_SESSION_KEY);
      const cached = localStorage.getItem(STORAGE_USER_KEY);
      if (cachedToken && cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          if (parsed.email && (parsed.email === 'lead.engineer@devforge.ai' || parsed.email.endsWith('@devforge.ai'))) {
            parsed.email = '';
          }
          if (parsed.email) {
            return parsed;
          }
        }
      }
    } catch (e) {}
    return {
      id: '',
      name: 'Guest Architect',
      email: '',
      createdAt: new Date().toISOString(),
      role: 'Guest Architect'
    };
  });

  // Check if current user is authenticated
  const isAuthenticated = useMemo(() => {
    return Boolean(
      sessionToken && 
      user && 
      user.id && 
      user.id !== 'default_user' && 
      user.id !== 'guest_user' &&
      user.email
    );
  }, [sessionToken, user]);

  // Token Wallet state (4,500 Forge Tokens: 1,500 Welcome + 3,000 Starter)
  const [wallet, setWallet] = useState<TokenWallet>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_WALLET_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      welcomeTokens: 1500,
      starterTokens: 3000,
      dailyTokens: 0,
      totalBalance: 4500,
      lastRefillAt: null,
      nextRefillAt: null
    };
  });

  // Transaction Ledger state
  const [transactions, setTransactions] = useState<TokenTransaction[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_TX_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [
      {
        id: 'tx_init_1',
        userId: 'devforge_starter',
        action: 'Welcome Tokens Granted',
        tokensUsed: 1500,
        balanceAfter: 1500,
        type: 'credit',
        timestamp: new Date(Date.now() - 3600 * 24 * 1000 * 2).toISOString()
      },
      {
        id: 'tx_init_2',
        userId: 'devforge_starter',
        action: 'Starter Tokens Granted',
        tokensUsed: 3000,
        balanceAfter: 4500,
        type: 'credit',
        timestamp: new Date(Date.now() - 3600 * 24 * 1000 * 2 + 500).toISOString()
      }
    ];
  });

  // Real User Projects state:
  // Starts with ZERO projects for new accounts.
  // Filters out demo projects while preserving any real user-created projects.
  const [allProjects, setAllProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => !isDemoProject(p));
        }
      }
    } catch (e) {}
    return [];
  });

  // Filter projects scoped to the active authenticated user
  const projects = useMemo(() => {
    if (!isAuthenticated || !user.id) {
      return [];
    }
    return allProjects.filter(p => p.userId === user.id);
  }, [allProjects, user.id, isAuthenticated]);

  // Active Project for IDE Workspace (defaults to null for a clean initial state)
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Persist only real user projects to localStorage
  useEffect(() => {
    try {
      const sanitized = allProjects.filter(p => !isDemoProject(p));
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(sanitized));
    } catch (e) {}
  }, [allProjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WALLET_KEY, JSON.stringify(wallet));
    } catch (e) {}
  }, [wallet]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TX_KEY, JSON.stringify(transactions));
    } catch (e) {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    if (sessionToken) {
      localStorage.setItem(STORAGE_SESSION_KEY, sessionToken);
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }, [sessionToken]);

  // Sync with Server on mount or session change
  useEffect(() => {
    async function syncServerState() {
      if (!sessionToken) {
        return;
      }
      try {
        const headers: Record<string, string> = {
          'x-devforge-session': sessionToken
        };

        const res = await fetch('/api/auth/me', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            if (data.user.email && (data.user.email === 'lead.engineer@devforge.ai' || data.user.email.endsWith('@devforge.ai'))) {
              data.user.email = '';
            }
            setUser(data.user);
          }
          if (data.wallet) {
            setWallet(data.wallet);
          }
          if (data.transactions && Array.isArray(data.transactions) && data.transactions.length > 0) {
            setTransactions(data.transactions);
          }
        } else if (res.status === 401) {
          // Token expired or invalid
          setSessionToken('');
          localStorage.removeItem(STORAGE_SESSION_KEY);
          setUser({
            id: '',
            name: 'Guest Architect',
            email: '',
            createdAt: new Date().toISOString(),
            role: 'Guest Architect'
          });
        }
      } catch (err) {
        console.warn('Backend sync offline, operating in client mode');
      }
    }
    syncServerState();
  }, [sessionToken]);

  // Handle "+ New Project" click
  const handleRequestNewProject = () => {
    if (isAuthenticated) {
      setIsNewProjectOpen(true);
    } else {
      setPendingOpenNewProjectAfterAuth(true);
      setIsAuthPromptOpen(true);
    }
  };

  const handleSelectSignUpFromPrompt = () => {
    setIsAuthPromptOpen(false);
    setAuthModalInitialMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleSelectLogInFromPrompt = () => {
    setIsAuthPromptOpen(false);
    setAuthModalInitialMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenAuthWithMode = (mode: 'login' | 'signup') => {
    setPendingOpenNewProjectAfterAuth(false);
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (data: {
    user: UserProfile;
    sessionToken: string;
    wallet: TokenWallet;
    transactions: TokenTransaction[];
  }) => {
    setUser(data.user);
    setSessionToken(data.sessionToken);
    setWallet(data.wallet);
    setTransactions(data.transactions);
    setIsAuthModalOpen(false);
    setIsAuthPromptOpen(false);

    // If the user previously clicked New Project, return them to the flow and open the creation screen automatically
    if (pendingOpenNewProjectAfterAuth) {
      setPendingOpenNewProjectAfterAuth(false);
      setIsNewProjectOpen(true);
    }
  };

  // Handlers
  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    setCurrentView('workspace');
  };

  const handleUpdateProject = (updated: Project) => {
    setAllProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (activeProject?.id === updated.id) {
      setActiveProject(updated);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setAllProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProject?.id === projectId) {
      setActiveProject(null);
      setCurrentView('dashboard');
    }
  };

  const handleProjectForged = (newProj: Project, tokensUsed: number) => {
    const projectWithUser: Project = {
      ...newProj,
      userId: user.id
    };
    setAllProjects(prev => [projectWithUser, ...prev]);
    setActiveProject(projectWithUser);
    setCurrentView('workspace');

    // Update local wallet and transactions
    setWallet(prev => ({
      ...prev,
      totalBalance: Math.max(0, prev.totalBalance - tokensUsed)
    }));

    setTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        userId: user.id,
        projectName: newProj.name,
        action: `Forged Project: ${newProj.name}`,
        tokensUsed: tokensUsed,
        balanceAfter: Math.max(0, wallet.totalBalance - tokensUsed),
        type: 'debit',
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const handleDeductTokens = async (amount: number, action: string): Promise<boolean> => {
    if (!isAuthenticated) {
      setPendingOpenNewProjectAfterAuth(false);
      setIsAuthPromptOpen(true);
      return false;
    }

    if (wallet.totalBalance < amount) {
      alert(`Insufficient Forge Tokens. Required: ${amount}, available: ${wallet.totalBalance}.`);
      return false;
    }

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionToken) {
        headers['x-devforge-session'] = sessionToken;
      }

      const res = await fetch('/api/tokens/deduct', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount,
          action,
          projectName: activeProject?.name,
          projectId: activeProject?.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet);
        if (data.transaction) {
          setTransactions(prev => [data.transaction, ...prev]);
        }
        return true;
      } else if (res.status === 401) {
        setIsAuthPromptOpen(true);
        return false;
      }
    } catch (e) {}

    return false;
  };

  const handleTriggerRefill = async () => {
    if (!isAuthenticated) {
      setPendingOpenNewProjectAfterAuth(false);
      setIsAuthPromptOpen(true);
      return;
    }

    try {
      const headers: Record<string, string> = {};
      if (sessionToken) {
        headers['x-devforge-session'] = sessionToken;
      }
      const res = await fetch('/api/tokens/refill', { method: 'POST', headers });
      const data = await res.json();
      if (data.refilled) {
        setWallet(data.wallet);
        alert('1,000 Forge Tokens granted via 24-hour daily refill!');
      } else {
        alert(data.message || 'Daily refill is available once every 24 hours after token exhaustion.');
      }
    } catch (e) {
      alert('Unable to process refill at this time.');
    }
  };

  const handleLogout = async () => {
    try {
      if (sessionToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'x-devforge-session': sessionToken }
        });
      }
    } catch (e) {}
    setSessionToken('');
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setUser({
      id: '',
      name: 'Guest Architect',
      email: '',
      createdAt: new Date().toISOString(),
      role: 'Guest Architect'
    });
    setPendingOpenNewProjectAfterAuth(false);
    setIsNewProjectOpen(false);
    setIsAuthPromptOpen(false);
    setWallet({
      welcomeTokens: 1500,
      starterTokens: 3000,
      dailyTokens: 0,
      totalBalance: 4500,
      lastRefillAt: null,
      nextRefillAt: null
    });
  };

  const handleUpdateUser = async (updated: UserProfile) => {
    setUser(updated);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionToken) {
        headers['x-devforge-session'] = sessionToken;
      }
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ name: updated.name, email: updated.email })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update profile');
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err: any) {
      console.warn('Profile sync:', err.message);
      throw err;
    }
  };

  // Launch Demo directly into Workspace for preview without altering user projects
  const handleLaunchDemo = () => {
    setActiveProject(SAMPLE_DRAGON_GAME_PROJECT);
    setCurrentView('workspace');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-cyan-500/30">
      {/* Loading Screen on first visit */}
      {!hasLoaded && (
        <LoadingScreen onLoaded={() => setHasLoaded(true)} minDurationMs={1200} />
      )}

      {/* Global Navigation Bar */}
      {currentView !== 'workspace' ? (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          wallet={wallet}
          user={user}
          isAuthenticated={isAuthenticated}
          onOpenNewProject={handleRequestNewProject}
          onTriggerRefill={handleTriggerRefill}
          onOpenAuth={() => handleOpenAuthWithMode('login')}
          onOpenAuthWithMode={handleOpenAuthWithMode}
          onLogout={handleLogout}
        />
      ) : null}

      {/* Main Content Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingPage
            onStartForging={handleRequestNewProject}
            onLaunchDemo={handleLaunchDemo}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            user={user}
            wallet={wallet}
            projects={projects}
            recentTransactions={transactions}
            onOpenNewProject={handleRequestNewProject}
            onOpenProject={handleOpenProject}
            onDeleteProject={handleDeleteProject}
            onNavigate={(view) => setCurrentView(view)}
            onTriggerRefill={handleTriggerRefill}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsView
            projects={projects}
            onOpenProject={handleOpenProject}
            onOpenNewProject={handleRequestNewProject}
            onDeleteProject={handleDeleteProject}
            onUpdateProject={handleUpdateProject}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'assistant' && (
          <AssistantConsoleView
            wallet={wallet}
            projects={projects}
            sessionToken={sessionToken}
            onBack={() => setCurrentView('dashboard')}
            onDeductTokens={handleDeductTokens}
            onOpenProject={handleOpenProject}
          />
        )}

        {currentView === 'tokens' && (
          <TokenHistoryView
            wallet={wallet}
            transactions={transactions}
            onBack={() => setCurrentView('dashboard')}
            onTriggerRefill={handleTriggerRefill}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            user={user}
            projects={projects}
            onBack={() => setCurrentView('dashboard')}
            onUpdateUser={handleUpdateUser}
            onOpenAuth={() => handleOpenAuthWithMode('login')}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'workspace' && activeProject ? (
          <Workspace
            project={activeProject}
            wallet={wallet}
            sessionToken={sessionToken}
            onBack={() => setCurrentView('dashboard')}
            onUpdateProject={handleUpdateProject}
            onDeductTokens={handleDeductTokens}
          />
        ) : currentView === 'workspace' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-16 text-center space-y-4 max-w-xl mx-auto">
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
                onClick={handleRequestNewProject}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-cyan-950/50 hover:shadow-cyan-900/60 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ New Project</span>
              </button>
            </div>
          </div>
        ) : null}
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        wallet={wallet}
        userId={user.id}
        sessionToken={sessionToken}
        onProjectForged={handleProjectForged}
      />

      {/* Polished Authentication Prompt Modal for New Project */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => {
          setIsAuthPromptOpen(false);
          setPendingOpenNewProjectAfterAuth(false);
        }}
        onSelectSignUp={handleSelectSignUpFromPrompt}
        onSelectLogIn={handleSelectLogInFromPrompt}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingOpenNewProjectAfterAuth(false);
        }}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
