/**
 * Claude Code Agent Router
 * Automatically routes queries to appropriate specialized agents
 */

interface AgentConfig {
  name: string;
  triggers: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  contextKeywords: string[];
  model: string;
}

interface AgentMatch {
  agent: string;
  score: number;
  matches: string[];
  priority: string;
}

class AgentRouter {
  private agents: AgentConfig[] = [
    {
      name: 'code-reviewer',
      triggers: ['review', 'check', 'audit', 'pr', 'pull request', 'code quality'],
      priority: 'high',
      contextKeywords: ['bug', 'issue', 'problem', 'error', 'fix'],
      model: 'sonnet'
    },
    {
      name: 'code-simplifier',
      triggers: ['simplify', 'refactor', 'clean', 'reduce complexity', 'optimize'],
      priority: 'medium',
      contextKeywords: ['complex', 'messy', 'complicated', 'hard to read'],
      model: 'sonnet'
    },
    {
      name: 'security-reviewer',
      triggers: ['security', 'vulnerability', 'exploit', 'cve', 'owasp', 'penetration'],
      priority: 'critical',
      contextKeywords: ['auth', 'password', 'token', 'api key', 'secret', 'credential'],
      model: 'sonnet'
    },
    {
      name: 'tech-lead',
      triggers: ['architecture', 'design', 'scale', 'system', 'infrastructure', 'planning'],
      priority: 'high',
      contextKeywords: ['performance', 'scalability', 'migration', 'refactoring', 'technical debt'],
      model: 'sonnet'
    },
    {
      name: 'ux-reviewer',
      triggers: ['ux', 'ui', 'accessibility', 'user experience', 'design', 'a11y', 'wcag'],
      priority: 'medium',
      contextKeywords: ['button', 'form', 'navigation', 'mobile', 'responsive', 'screen reader'],
      model: 'sonnet'
    },
    {
      name: 'test-engineer',
      triggers: ['test', 'testing', 'coverage', 'unit test', 'integration', 'e2e', 'tdd'],
      priority: 'high',
      contextKeywords: ['jest', 'vitest', 'playwright', 'cypress', 'mock', 'stub'],
      model: 'sonnet'
    },
    {
      name: 'database-expert',
      triggers: ['database', 'query', 'sql', 'optimization', 'index', 'migration', 'supabase'],
      priority: 'high',
      contextKeywords: ['slow', 'performance', 'join', 'n+1', 'deadlock', 'transaction'],
      model: 'sonnet'
    },
    {
      name: 'devops-engineer',
      triggers: ['deploy', 'ci/cd', 'docker', 'kubernetes', 'pipeline', 'infrastructure', 'terraform'],
      priority: 'medium',
      contextKeywords: ['build', 'release', 'container', 'helm', 'github actions', 'monitoring'],
      model: 'sonnet'
    }
  ];

  /**
   * Route a query to the most appropriate agent
   */
  route(query: string, context?: string): AgentMatch[] {
    const lowerQuery = query.toLowerCase();
    const lowerContext = (context || '').toLowerCase();
    const combined = `${lowerQuery} ${lowerContext}`;
    
    const matches: AgentMatch[] = [];
    
    for (const agent of this.agents) {
      let score = 0;
      const matchedTerms: string[] = [];
      
      // Check triggers (high weight)
      for (const trigger of agent.triggers) {
        if (combined.includes(trigger)) {
          score += 10;
          matchedTerms.push(`trigger: ${trigger}`);
        }
      }
      
      // Check context keywords (medium weight)
      for (const keyword of agent.contextKeywords) {
        if (combined.includes(keyword)) {
          score += 5;
          matchedTerms.push(`keyword: ${keyword}`);
        }
      }
      
      // Priority boost
      const priorityBoost = {
        critical: 20,
        high: 10,
        medium: 5,
        low: 0
      };
      score += priorityBoost[agent.priority];
      
      if (score > 0) {
        matches.push({
          agent: agent.name,
          score,
          matches: matchedTerms,
          priority: agent.priority
        });
      }
    }
    
    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Get the best agent for a query
   */
  getBestAgent(query: string, context?: string): string | null {
    const matches = this.route(query, context);
    return matches.length > 0 ? matches[0].agent : null;
  }
  
  /**
   * Get multiple agents for complex queries
   */
  getAgents(query: string, context?: string, maxAgents: number = 3): string[] {
    const matches = this.route(query, context);
    return matches.slice(0, maxAgents).map(m => m.agent);
  }
  
  /**
   * Check if a specific agent should be triggered
   */
  shouldTriggerAgent(agentName: string, query: string, context?: string): boolean {
    const matches = this.route(query, context);
    return matches.some(m => m.agent === agentName && m.score >= 10);
  }
  
  /**
   * Get workflow for a specific task type
   */
  getWorkflow(taskType: string): string[] {
    const workflows: Record<string, string[]> = {
      'code_review': ['code-reviewer', 'security-reviewer', 'test-engineer'],
      'performance': ['database-expert', 'code-simplifier', 'tech-lead'],
      'feature': ['tech-lead', 'test-engineer', 'ux-reviewer', 'code-reviewer'],
      'bug_fix': ['code-reviewer', 'test-engineer', 'code-simplifier'],
      'security_audit': ['security-reviewer', 'code-reviewer', 'tech-lead'],
      'ui_improvement': ['ux-reviewer', 'test-engineer', 'code-reviewer'],
      'deployment': ['devops-engineer', 'security-reviewer', 'tech-lead'],
      'database_optimization': ['database-expert', 'tech-lead', 'devops-engineer']
    };
    
    return workflows[taskType] || [];
  }
  
  /**
   * Analyze code and determine which agents to involve
   */
  analyzeCode(code: string, filename: string): string[] {
    const agents = new Set<string>();
    
    // File extension based routing
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['ts', 'tsx', 'js', 'jsx'].includes(extension || '')) {
      agents.add('code-reviewer');
    }
    
    if (['css', 'scss', 'styled'].some(ext => filename.includes(ext))) {
      agents.add('ux-reviewer');
    }
    
    if (filename.includes('.test.') || filename.includes('.spec.')) {
      agents.add('test-engineer');
    }
    
    if (filename.includes('.sql') || filename.includes('migration')) {
      agents.add('database-expert');
    }
    
    if (filename.includes('Dockerfile') || filename.includes('docker-compose')) {
      agents.add('devops-engineer');
    }
    
    // Content-based routing
    const lowerCode = code.toLowerCase();
    
    // Security patterns
    if (lowerCode.includes('password') || 
        lowerCode.includes('token') || 
        lowerCode.includes('secret') ||
        lowerCode.includes('api_key')) {
      agents.add('security-reviewer');
    }
    
    // Database patterns
    if (lowerCode.includes('select ') || 
        lowerCode.includes('insert ') || 
        lowerCode.includes('update ') ||
        lowerCode.includes('supabase')) {
      agents.add('database-expert');
    }
    
    // UI patterns
    if (lowerCode.includes('classname') || 
        lowerCode.includes('style=') || 
        lowerCode.includes('aria-')) {
      agents.add('ux-reviewer');
    }
    
    // Test patterns
    if (lowerCode.includes('describe(') || 
        lowerCode.includes('it(') || 
        lowerCode.includes('expect(')) {
      agents.add('test-engineer');
    }
    
    // Complex code patterns
    const lines = code.split('\n');
    const avgLineLength = code.length / lines.length;
    const hasDeepNesting = code.split('{').length - code.split('}').length > 5;
    
    if (avgLineLength > 100 || hasDeepNesting || lines.length > 100) {
      agents.add('code-simplifier');
    }
    
    return Array.from(agents);
  }
}

// Export for use
export const agentRouter = new AgentRouter();

// Example usage:
/*
const query = "Review this React component for security issues";
const bestAgent = agentRouter.getBestAgent(query);
console.log(`Best agent: ${bestAgent}`); // security-reviewer

const agents = agentRouter.getAgents(query);
console.log(`Top agents: ${agents.join(', ')}`); // security-reviewer, code-reviewer

const workflow = agentRouter.getWorkflow('code_review');
console.log(`Workflow: ${workflow.join(' -> ')}`); // code-reviewer -> security-reviewer -> test-engineer
*/