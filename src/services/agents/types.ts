/**
 * Claude Code Agent System Types
 */

export interface AgentConfig {
  id: string;
  name: string;
  emoji: string;
  description: string;
  capabilities: string[];
  tools: string[];
  priority: number;
  triggers: string[];
}

export interface AgentDefinition {
  id: string;
  name: string;
  version: string;
  systemPrompt: string;
  instructions?: Record<string, string[]>;
  templates?: Record<string, string>;
  [key: string]: any; // Allow agent-specific properties
}

export interface AgentTask {
  id: string;
  agentId: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  input?: any;
  output?: any;
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'idle' | 'running' | 'completed' | 'failed';
  currentStep?: number;
  results?: any[];
}

export interface WorkflowStep {
  agentId: string;
  action: string;
  input?: any;
  dependsOn?: string[];
  condition?: (previousResults: any[]) => boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  agentId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AgentResponse {
  success: boolean;
  agentId: string;
  taskId: string;
  result?: any;
  error?: string;
  duration?: number;
  tokens?: number;
}

export interface AgentOrchestration {
  maxConcurrentAgents: number;
  defaultTimeout: number;
  retryAttempts: number;
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    destination: string;
  };
}

export type AgentType = 
  | 'test-writer'
  | 'code-analyzer'
  | 'performance-optimizer'
  | 'security-auditor'
  | 'pam-enhancer'
  | 'ui-ux-designer'
  | 'database-architect'
  | 'docs-writer'
  | 'chatbot';

export interface AgentContext {
  user: {
    id: string;
    name: string;
    role: string;
  };
  project: {
    name: string;
    path: string;
    type: string;
  };
  session: {
    id: string;
    startedAt: Date;
    history: ChatMessage[];
  };
  preferences: Record<string, any>;
}