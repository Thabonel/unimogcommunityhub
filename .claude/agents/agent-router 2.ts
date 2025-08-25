/**
 * Claude Code Agent Router
 * Automatically routes queries to appropriate specialized agents
 */

interface AgentConfig {
  name: string;
  triggers: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  contextKeywords: string[];
}

class AgentRouter {
  private agents: AgentConfig[] = [
    {
      name: 'code-reviewer',
      triggers: ['review', 'check', 'audit', 'pr'],
      priority: 'high',
      contextKeywords: ['bug', 'issue', 'problem', 'error']
    },
    {
      name: 'code-simplifier',
      triggers: ['simplify', 'refactor', 'clean'],
      priority: 'medium',
      contextKeywords: ['complex', 'messy', 'complicated']
    },
    {
      name: 'security-reviewer',
      triggers: ['security', 'vulnerability', 'exploit'],
      priority: 'critical',
      contextKeywords: ['auth', 'password', 'token', 'secret']
    },
    {
      name: 'tech-lead',
      triggers: ['architecture', 'design', 'scale'],
      priority: 'high',
      contextKeywords: ['performance', 'scalability', 'migration']
    },
    {
      name: 'ux-reviewer',
      triggers: ['ux', 'ui', 'accessibility', 'a11y'],
      priority: 'medium',
      contextKeywords: ['button', 'form', 'navigation', 'mobile']
    },
    {
      name: 'test-engineer',
      triggers: ['test', 'testing', 'coverage'],
      priority: 'high',
      contextKeywords: ['jest', 'vitest', 'playwright', 'mock']
    },
    {
      name: 'database-expert',
      triggers: ['database', 'query', 'sql'],
      priority: 'high',
      contextKeywords: ['slow', 'performance', 'index', 'join']
    },
    {
      name: 'devops-engineer',
      triggers: ['deploy', 'ci/cd', 'docker', 'kubernetes'],
      priority: 'medium',
      contextKeywords: ['pipeline', 'build', 'release']
    }
  ];

  getBestAgent(query: string): string | null {
    const lower = query.toLowerCase();
    let bestMatch = { agent: null, score: 0 };
    
    for (const agent of this.agents) {
      let score = 0;
      
      // Check triggers
      for (const trigger of agent.triggers) {
        if (lower.includes(trigger)) {
          score += 10;
        }
      }
      
      // Check context keywords
      for (const keyword of agent.contextKeywords) {
        if (lower.includes(keyword)) {
          score += 5;
        }
      }
      
      if (score > bestMatch.score) {
        bestMatch = { agent: agent.name, score };
      }
    }
    
    return bestMatch.agent;
  }
}

export const agentRouter = new AgentRouter();
