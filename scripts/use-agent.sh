#!/bin/bash
# Quick agent launcher

agent=$1
shift
query="$@"

if [ -z "$agent" ]; then
    echo "Usage: ./scripts/use-agent.sh <agent-name> <your question>"
    echo "Available agents: code-reviewer, security-reviewer, test-engineer, etc."
    exit 1
fi

echo "@$agent $query"
