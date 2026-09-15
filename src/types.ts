export type ProjectType = 
  | 'web_app' 
  | 'website' 
  | 'game' 
  | 'mobile_app' 
  | 'api_backend' 
  | 'desktop_app' 
  | 'ai_app' 
  | 'automation';

export interface ProjectFile {
  id: string;
  path: string;
  content: string;
  language: string;
  updatedAt: string;
}

export interface ImplementationStep {
  id: number;
  title: string;
  description: string;
  affectedFiles: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface ProjectPlan {
  projectName: string;
  tagline: string;
  description: string;
  techStack: {
    primary: string;
    frameworks: string[];
    languages: string[];
    styling: string;
    runtime: string;
  };
  features: string[];
  structureSummary: string[];
  steps: ImplementationStep[];
  estimatedForgeTokens: number;
  previewType: 'browser_sandboxed' | 'instructions_only';
  executionNotice?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  affectedFiles?: string[];
  proposedChanges?: { path: string; content: string }[];
  actionType?: AIActionType | 'ANSWER';
  debugResult?: AIDebugResult;
  explanationResult?: AIExplanationResult;
  tokenCost?: number;
  previewUpdated?: boolean;
  status?: 'sending' | 'sent' | 'error';
  errorMessage?: string;
  suggestedFollowUps?: string[];
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  technology: string;
  category: ProjectType;
  files: ProjectFile[];
  plan?: ProjectPlan;
  status: 'draft' | 'planning' | 'forged' | 'testing' | 'error';
  createdAt: string;
  updatedAt: string;
  chatHistory?: ChatMessage[];
}

export interface TokenWallet {
  userId: string;
  welcomeTokens: number; // Initially 1500
  starterTokens: number; // Initially 3000
  dailyTokens: number;   // Daily refills (1000 every 24h after exhaustion)
  totalBalance: number;
  lastRefillAt: string | null;
  nextRefillAt: string | null;
}

export interface TokenTransaction {
  id: string;
  userId: string;
  projectId?: string;
  projectName?: string;
  action: string;
  tokensUsed: number;
  balanceAfter: number;
  type: 'debit' | 'credit';
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  role: string;
}

export type AIActionType = 
  | 'BUILD' 
  | 'FIX' 
  | 'EXPLAIN' 
  | 'IMPROVE' 
  | 'ADD_FEATURE' 
  | 'REFACTOR' 
  | 'OPTIMIZE' 
  | 'TEST';

export interface AIExplanationResult {
  simpleExplanation: string;
  technicalExplanation: string;
  whatItDoes: string[];
  keyFunctions: string[];
  possibleIssues: string[];
  optimizationSuggestions: string[];
}

export interface AIDebugResult {
  errorFound: boolean;
  whatWentWrong: string;
  whyItHappened: string;
  affectedFile: string;
  proposedFixSummary: string;
  fixedContent?: string;
  isVerified: boolean;
  tokenCost: number;
}

export interface TestResultItem {
  id: string;
  type: 'syntax' | 'structure' | 'runtime' | 'dependency' | 'security';
  status: 'passed' | 'warning' | 'failed';
  file?: string;
  line?: number;
  message: string;
  details?: string;
}

export interface ProjectTestReport {
  timestamp: string;
  passedCount: number;
  warningCount: number;
  failedCount: number;
  items: TestResultItem[];
  overallStatus: 'healthy' | 'warnings' | 'critical';
  summary: string;
}

export interface ConsoleLogMessage {
  id: string;
  level: 'info' | 'warn' | 'error' | 'success' | 'system';
  message: string;
  timestamp: string;
  source?: string;
}
