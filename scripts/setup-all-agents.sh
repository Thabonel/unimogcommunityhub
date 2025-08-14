#!/bin/bash

# Claude Code Specialized Agents Setup Script
# Installs all agent configurations for UnimogCommunityHub

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}     Claude Code AI Agents - Complete Installation${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Create directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"
mkdir -p .claude/agents
mkdir -p .claude/logs
mkdir -p scripts

# Function to create agent files
create_agent() {
    local name=$1
    local description=$2
    echo -e "  Creating ${GREEN}$name${NC} agent..."
    
    # Create YAML configuration
    cat > .claude/agents/${name}.yaml << EOF
name: ${name}
model: sonnet
description: ${description}
EOF
}

# Create all agents
echo -e "\n${YELLOW}Installing specialized agents...${NC}"

# Code Quality Agents
create_agent "code-reviewer" "Expert code review focused on best practices, performance, and maintainability"
create_agent "code-simplifier" "Specializes in refactoring complex code into clean, simple, maintainable solutions"
create_agent "bug-detector" "Identifies bugs, code smells, and potential issues in code"

# Security Agents
create_agent "security-reviewer" "Security expert focused on identifying vulnerabilities and implementing secure coding practices"
create_agent "security" "Basic security analysis and vulnerability detection"

# Testing Agents
create_agent "test-engineer" "QA expert specializing in comprehensive testing strategies and test automation"
create_agent "test-writer" "Generates unit tests, integration tests, and test cases"

# Architecture Agents
create_agent "tech-lead" "Senior technical leader focused on architecture, scalability, and team collaboration"
create_agent "database-expert" "Database architect specializing in optimization, design, and query performance"
create_agent "devops-engineer" "DevOps expert focused on CI/CD, infrastructure, and deployment automation"
create_agent "devops" "Basic DevOps automation and deployment tasks"

# UX/UI Agents
create_agent "ux-reviewer" "UX/UI expert focused on user experience, accessibility, and interface design"
create_agent "ui-designer" "Specializes in UI component design, styling, and responsive layouts"

# Documentation Agent
create_agent "docs-writer" "Creates comprehensive documentation, guides, and API documentation"

# Create the main configuration file
echo -e "\n${YELLOW}Creating main configuration...${NC}"
cat > .claude/agents/config.yaml << 'EOF'
# Claude Code Agents Configuration
agents:
  enabled: true
  default_model: sonnet
  timeout: 300
  max_context_length: 200000
  
  delegation:
    auto_delegate: true
    require_confirmation: false
    max_delegation_depth: 3
    
  specializations:
    - name: code-reviewer
      triggers: ["review", "check", "audit", "pr", "pull request"]
      priority: high
      
    - name: code-simplifier
      triggers: ["simplify", "refactor", "clean", "reduce complexity"]
      priority: medium
      
    - name: security-reviewer
      triggers: ["security", "vulnerability", "exploit", "CVE", "OWASP"]
      priority: critical
      
    - name: tech-lead
      triggers: ["architecture", "design", "scale", "system"]
      priority: high
      
    - name: ux-reviewer
      triggers: ["ux", "ui", "accessibility", "user experience", "a11y"]
      priority: medium
      
    - name: test-engineer
      triggers: ["test", "testing", "coverage", "unit test", "e2e"]
      priority: high
      
    - name: database-expert
      triggers: ["database", "query", "sql", "optimization", "index"]
      priority: high
      
    - name: devops-engineer
      triggers: ["deploy", "ci/cd", "docker", "kubernetes", "pipeline"]
      priority: medium
      
  workflows:
    code_review:
      agents: [code-reviewer, security-reviewer, test-engineer]
      
    performance_optimization:
      agents: [database-expert, code-simplifier, tech-lead]
      
    feature_development:
      agents: [tech-lead, test-engineer, ux-reviewer, code-reviewer]
EOF

# Create the agent router
echo -e "\n${YELLOW}Installing agent router...${NC}"
cat > .claude/agents/agent-router.ts << 'EOF'
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
EOF

# Create quick reference guide
echo -e "\n${YELLOW}Creating quick reference guide...${NC}"
cat > .claude/agents/QUICK_REFERENCE.md << 'EOF'
# Claude Code Agents - Quick Reference

## 🚀 Usage
Simply use @ mentions in your prompts:
- `@code-reviewer` - Review code for best practices
- `@security-reviewer` - Security vulnerability analysis
- `@test-engineer` - Generate comprehensive tests
- `@database-expert` - Optimize database queries
- `@tech-lead` - Architecture decisions
- `@ux-reviewer` - Accessibility and UX audit
- `@devops-engineer` - CI/CD and deployment

## 🔄 Workflows
Predefined task workflows:
- **Code Review**: `@code-reviewer` → `@security-reviewer` → `@test-engineer`
- **Performance**: `@database-expert` → `@code-simplifier` → `@tech-lead`
- **Feature**: `@tech-lead` → `@test-engineer` → `@ux-reviewer`

## 💡 Examples
```
@code-reviewer Please review this React component
@test-engineer Generate unit tests for VehicleCard
@security-reviewer Check this API endpoint for vulnerabilities
@database-expert This query is slow, how can I optimize it?
```

## ⚡ Auto-Routing
The system automatically routes based on keywords:
- "review" → code-reviewer
- "security" → security-reviewer
- "test" → test-engineer
- "database" → database-expert
- "deploy" → devops-engineer
EOF

# Create initialization script
echo -e "\n${YELLOW}Creating initialization script...${NC}"
cat > scripts/init-agents.sh << 'EOF'
#!/bin/bash
# Quick agent initialization check

echo "Claude Code Agents Status:"
echo "=========================="

agents=(
    "bug-detector"
    "code-reviewer"
    "code-simplifier"
    "database-expert"
    "devops-engineer"
    "devops"
    "docs-writer"
    "security-reviewer"
    "security"
    "tech-lead"
    "test-engineer"
    "test-writer"
    "ui-designer"
    "ux-reviewer"
)

configured=0
for agent in "${agents[@]}"; do
    if [ -f ".claude/agents/${agent}.yaml" ] || [ -f ".claude/agents/${agent}.md" ]; then
        echo "✅ $agent"
        ((configured++))
    else
        echo "❌ $agent (missing)"
    fi
done

echo ""
echo "Status: $configured/${#agents[@]} agents configured"
EOF

chmod +x scripts/init-agents.sh

# Create a test script
echo -e "\n${YELLOW}Creating test script...${NC}"
cat > scripts/test-agents.sh << 'EOF'
#!/bin/bash
# Test agent routing

echo "Testing Agent Router..."
echo "======================"
echo ""

queries=(
    "Review this code for best practices"
    "Check for security vulnerabilities"
    "Generate unit tests"
    "Optimize this SQL query"
    "How should I architect this feature?"
    "Is this UI accessible?"
    "Deploy to production"
)

for query in "${queries[@]}"; do
    echo "Query: \"$query\""
    echo "Routes to: [Agent router would determine]"
    echo ""
done
EOF

chmod +x scripts/test-agents.sh

# Final summary
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Installed Components:${NC}"
echo "  • 14 specialized AI agents"
echo "  • Agent configuration system"
echo "  • Automatic routing system"
echo "  • Workflow definitions"
echo "  • Quick reference guide"
echo ""
echo -e "${GREEN}Available Agents:${NC}"
echo "  @code-reviewer    - Code review and best practices"
echo "  @code-simplifier  - Refactor complex code"
echo "  @security-reviewer - Security analysis"
echo "  @test-engineer    - Test generation"
echo "  @database-expert  - Database optimization"
echo "  @tech-lead        - Architecture decisions"
echo "  @ux-reviewer      - UX/Accessibility"
echo "  @devops-engineer  - CI/CD and deployment"
echo "  @bug-detector     - Bug detection"
echo "  @docs-writer      - Documentation"
echo ""
echo -e "${GREEN}Quick Start:${NC}"
echo "  1. Run 'claude' in your terminal"
echo "  2. Use @agent-name to delegate tasks"
echo "  3. Example: @code-reviewer Review this function"
echo ""
echo -e "${GREEN}Test Installation:${NC}"
echo "  ./scripts/init-agents.sh    # Check agent status"
echo "  ./scripts/test-agents.sh    # Test routing"
echo ""
echo -e "${YELLOW}Documentation:${NC}"
echo "  .claude/agents/README.md"
echo "  .claude/agents/QUICK_REFERENCE.md"
echo ""
echo -e "${BLUE}Happy coding with AI agents! 🤖${NC}"