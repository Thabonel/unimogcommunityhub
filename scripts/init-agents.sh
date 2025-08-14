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
