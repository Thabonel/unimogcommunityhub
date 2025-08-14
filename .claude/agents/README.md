# Claude Code AI Agents System

## Overview
This directory contains the configuration and implementation for specialized AI agents that assist with various aspects of software development for the UnimogCommunityHub project.

## 🤖 Available Agents

### Code Quality
- **code-reviewer** - Expert code review for best practices and issues
- **code-simplifier** - Refactor complex code into clean solutions
- **bug-detector** - Identify bugs and potential issues

### Security
- **security-reviewer** - Comprehensive security analysis (OWASP Top 10)
- **security** - Quick security checks

### Testing
- **test-engineer** - Comprehensive testing strategies
- **test-writer** - Generate test cases

### Architecture
- **tech-lead** - System design and architecture decisions
- **database-expert** - Database optimization and query tuning
- **devops-engineer** - CI/CD and infrastructure

### User Experience
- **ux-reviewer** - Accessibility and UX improvements
- **ui-designer** - Component design and styling

### Documentation
- **docs-writer** - Generate comprehensive documentation

## 🚀 Quick Start

### 1. Initialize Agents
```bash
./scripts/init-agents.sh
```

### 2. Use Agents
Simply mention agents with @ in your Claude Code prompts:
```
@code-reviewer Review this function
@test-engineer Generate tests for VehicleCard
@security-reviewer Check for vulnerabilities
```

### 3. Use Agent Router
The system automatically routes queries to appropriate agents based on context:
```typescript
import { agentRouter } from '.claude/agents/agent-router';

const bestAgent = agentRouter.getBestAgent("How do I optimize this SQL query?");
// Returns: 'database-expert'
```

## 📁 Directory Structure

```
.claude/agents/
├── README.md                # This file
├── index.md                 # Agent documentation
├── config.yaml             # Global agent configuration
├── agent-router.ts         # Automatic agent routing
│
├── bug-detector.md         # Bug detection agent
├── bug-detector.yaml       
├── code-reviewer.md        # Code review agent
├── code-reviewer.yaml
├── code-simplifier.md      # Code simplification agent
├── code-simplifier.yaml
├── database-expert.md      # Database optimization agent
├── database-expert.yaml
├── devops-engineer.md      # DevOps automation agent
├── devops-engineer.yaml
├── devops.md              # Basic DevOps agent
├── devops.yaml
├── docs-writer.md         # Documentation agent
├── docs-writer.yaml
├── security-reviewer.md   # Security analysis agent
├── security-reviewer.yaml
├── security.md           # Basic security agent
├── security.yaml
├── tech-lead.md          # Architecture agent
├── tech-lead.yaml
├── test-engineer.md      # Testing strategies agent
├── test-engineer.yaml
├── test-writer.md        # Test generation agent
├── test-writer.yaml
├── ui-designer.md        # UI design agent
├── ui-designer.yaml
├── ux-reviewer.md        # UX review agent
└── ux-reviewer.yaml
```

## ⚙️ Configuration

### Global Settings (`config.yaml`)
```yaml
agents:
  enabled: true
  default_model: sonnet
  timeout: 300
  
  delegation:
    auto_delegate: true
    require_confirmation: false
```

### Agent-Specific Configuration
Each agent has two files:
- `.md` file - Detailed instructions and examples
- `.yaml` file - Configuration and parameters

## 🔄 Automatic Delegation

The system automatically delegates to appropriate agents based on:

### Triggers
Keywords that activate specific agents:
- "review" → code-reviewer
- "security" → security-reviewer
- "test" → test-engineer
- "database" → database-expert

### Context Analysis
The router analyzes code and context to determine relevant agents:
- File extensions (`.ts` → code-reviewer)
- Code patterns (SQL queries → database-expert)
- Keywords (accessibility → ux-reviewer)

### Workflows
Pre-defined workflows for common tasks:
```yaml
workflows:
  code_review:
    agents: [code-reviewer, security-reviewer, test-engineer]
  
  performance_optimization:
    agents: [database-expert, code-simplifier, tech-lead]
```

## 📊 Agent Routing Examples

### Single Agent
```typescript
// Query: "How do I improve this SQL query performance?"
// Routes to: database-expert
```

### Multiple Agents
```typescript
// Query: "Review this auth component for security and accessibility"
// Routes to: security-reviewer, ux-reviewer, code-reviewer
```

### Workflow
```typescript
// Task: "Complete code review"
// Executes: code-reviewer → security-reviewer → test-engineer
```

## 🎯 Best Practices

### 1. Be Specific
Provide context and code snippets for better results:
```
@code-reviewer Please review this React component:
[paste code]
Focus on performance and React best practices.
```

### 2. Use Multiple Agents
Combine agents for comprehensive analysis:
```
@security-reviewer @test-engineer 
Check this payment handler for vulnerabilities and suggest tests
```

### 3. Follow Workflows
Use predefined workflows for complex tasks:
```
Run the performance_optimization workflow on the vehicle search feature
```

## 🔧 Customization

### Add New Agent
1. Create agent files:
   ```bash
   touch .claude/agents/new-agent.md
   touch .claude/agents/new-agent.yaml
   ```

2. Configure in `config.yaml`:
   ```yaml
   specializations:
     - name: new-agent
       triggers: ["keyword1", "keyword2"]
       priority: high
   ```

3. Update router if needed:
   ```typescript
   // agent-router.ts
   agents.push({
     name: 'new-agent',
     triggers: ['keyword1', 'keyword2'],
     priority: 'high',
     contextKeywords: ['context1', 'context2'],
     model: 'sonnet'
   });
   ```

## 📈 Monitoring

### Check Agent Status
```bash
./scripts/init-agents.sh
```

### View Agent Logs
```bash
tail -f .claude/logs/agents.log
```

### Agent Metrics
- Response time
- Usage frequency
- Success rate
- Error rate

## 🆘 Troubleshooting

### Agent Not Responding
1. Check if agent is configured: `ls .claude/agents/`
2. Verify triggers in `config.yaml`
3. Check agent-specific `.yaml` file

### Wrong Agent Selected
1. Be more specific with keywords
2. Use explicit @ mentions
3. Check agent router logic

### Performance Issues
1. Reduce `max_context_length`
2. Enable caching in `config.yaml`
3. Use specific agents instead of workflows

## 📚 Resources

- [Agent Documentation](./index.md)
- [Configuration Guide](./config.yaml)
- [Router Implementation](./agent-router.ts)
- [Project Context](../../CLAUDE.md)

## 🤝 Contributing

To improve agents:
1. Edit agent `.md` files for instructions
2. Update `.yaml` files for configuration
3. Enhance router logic in `agent-router.ts`
4. Test with `init-agents.sh`

---

For more information, check the individual agent documentation files or run:
```bash
./scripts/init-agents.sh
```