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
