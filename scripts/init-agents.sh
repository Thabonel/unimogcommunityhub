#!/bin/bash

# Claude Code Agents Initialization Script
# For UnimogCommunityHub Project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}     ${CYAN}Claude Code AI Agents - UnimogCommunityHub${NC}        ${BLUE}║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_status() {
    if [ "$2" = "ok" ]; then
        echo -e "  ${GREEN}✅${NC} $1"
    elif [ "$2" = "warning" ]; then
        echo -e "  ${YELLOW}⚠️${NC}  $1"
    else
        echo -e "  ${RED}❌${NC} $1"
    fi
}

# Create agent directory if it doesn't exist
mkdir -p .claude/agents

# List of all agents
agents=(
    "bug-detector"
    "security"
    "ui-designer"
    "test-writer"
    "docs-writer"
    "devops"
    "code-reviewer"
    "code-simplifier"
    "security-reviewer"
    "tech-lead"
    "ux-reviewer"
    "test-engineer"
    "database-expert"
    "devops-engineer"
)

# Agent descriptions
descriptions=(
    "Bug detection and code quality analysis"
    "Basic security analysis"
    "UI/UX design and component generation"
    "Test generation and coverage"
    "Documentation generation"
    "Basic DevOps automation"
    "Expert code review and best practices"
    "Refactor complex code into clean solutions"
    "Advanced security vulnerability analysis"
    "Architecture and technical decisions"
    "Accessibility and user experience"
    "Comprehensive testing strategies"
    "Database optimization and design"
    "Advanced CI/CD and infrastructure"
)

# Print header
clear
print_header

# Check agent configurations
echo -e "${PURPLE}Checking Agent Configurations:${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

total_agents=${#agents[@]}
configured_agents=0
missing_agents=""

for i in "${!agents[@]}"; do
    agent="${agents[$i]}"
    desc="${descriptions[$i]}"
    
    if [ -f ".claude/agents/${agent}.md" ] || [ -f ".claude/agents/${agent}.yaml" ]; then
        print_status "${agent}: ${desc}" "ok"
        ((configured_agents++))
    else
        print_status "${agent}: Not configured" "error"
        missing_agents="${missing_agents} ${agent}"
    fi
done

echo ""
echo -e "${CYAN}Summary:${NC} ${configured_agents}/${total_agents} agents configured"

# Show usage instructions
echo ""
echo -e "${PURPLE}How to Use Agents:${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${YELLOW}Code Quality & Review:${NC}"
echo -e "  ${GREEN}@code-reviewer${NC}    - Review code for bugs, security, and best practices"
echo -e "  ${GREEN}@code-simplifier${NC}  - Refactor complex code into clean, maintainable solutions"
echo -e "  ${GREEN}@bug-detector${NC}     - Find bugs and potential issues in code"

echo -e "\n${YELLOW}Security:${NC}"
echo -e "  ${GREEN}@security-reviewer${NC} - Comprehensive security audit (OWASP Top 10)"
echo -e "  ${GREEN}@security${NC}         - Quick security check"

echo -e "\n${YELLOW}Testing:${NC}"
echo -e "  ${GREEN}@test-engineer${NC}    - Generate comprehensive test suites"
echo -e "  ${GREEN}@test-writer${NC}      - Create unit and integration tests"

echo -e "\n${YELLOW}Architecture & Design:${NC}"
echo -e "  ${GREEN}@tech-lead${NC}        - Architecture decisions and system design"
echo -e "  ${GREEN}@database-expert${NC}  - Database optimization and query tuning"
echo -e "  ${GREEN}@devops-engineer${NC}  - CI/CD pipelines and infrastructure"

echo -e "\n${YELLOW}User Experience:${NC}"
echo -e "  ${GREEN}@ux-reviewer${NC}      - Accessibility and UX improvements"
echo -e "  ${GREEN}@ui-designer${NC}      - UI component design and styling"

echo -e "\n${YELLOW}Documentation:${NC}"
echo -e "  ${GREEN}@docs-writer${NC}      - Generate documentation and guides"

# Show example usage
echo ""
echo -e "${PURPLE}Example Usage:${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}1. Review code:${NC}"
echo "   @code-reviewer Please review this React component for best practices"
echo ""
echo -e "${CYAN}2. Optimize database:${NC}"
echo "   @database-expert This query is slow, how can I optimize it?"
echo ""
echo -e "${CYAN}3. Generate tests:${NC}"
echo "   @test-engineer Create unit tests for the VehicleCard component"
echo ""
echo -e "${CYAN}4. Security audit:${NC}"
echo "   @security-reviewer Check this API endpoint for vulnerabilities"

# Create agent index file
echo ""
echo -e "${YELLOW}Creating agent index...${NC}"

cat > .claude/agents/index.md << 'EOF'
# Claude Code AI Agents

## Available Agents

### Code Quality
- **code-reviewer**: Expert code review focusing on best practices, performance, and maintainability
- **code-simplifier**: Refactor complex code into clean, simple solutions
- **bug-detector**: Identify bugs, code smells, and potential issues

### Security
- **security-reviewer**: Comprehensive security analysis (OWASP Top 10, CVE scanning)
- **security**: Basic security checks and vulnerability detection

### Testing
- **test-engineer**: Comprehensive testing strategies (unit, integration, E2E)
- **test-writer**: Generate test cases and improve coverage

### Architecture
- **tech-lead**: System design, architecture decisions, and scalability
- **database-expert**: Database optimization, indexing, and query performance
- **devops-engineer**: CI/CD, infrastructure as code, and deployment

### User Experience
- **ux-reviewer**: Accessibility (WCAG 2.1), usability, and UX improvements
- **ui-designer**: Component design, styling, and responsive layouts

### Documentation
- **docs-writer**: Generate comprehensive documentation and guides

## Quick Reference

| Agent | Primary Use Case | Key Strengths |
|-------|------------------|---------------|
| @code-reviewer | PR reviews | Best practices, SOLID principles |
| @code-simplifier | Refactoring | Reduce complexity, improve readability |
| @security-reviewer | Security audit | OWASP, vulnerability detection |
| @test-engineer | Test creation | Coverage, edge cases |
| @tech-lead | Architecture | System design, scalability |
| @database-expert | DB optimization | Query tuning, indexing |
| @ux-reviewer | UX audit | Accessibility, mobile |
| @devops-engineer | Infrastructure | CI/CD, monitoring |

## Usage Tips

1. **Be specific**: Provide context and code snippets
2. **Combine agents**: Use multiple agents for comprehensive review
3. **Iterative improvement**: Apply suggestions incrementally
4. **Project context**: Agents understand UnimogCommunityHub specifics

## Example Workflows

### Complete Code Review
```
1. @code-reviewer - Check for bugs and best practices
2. @security-reviewer - Identify vulnerabilities
3. @test-engineer - Suggest test cases
4. @code-simplifier - Refactor if needed
```

### Performance Optimization
```
1. @database-expert - Optimize queries
2. @tech-lead - Review architecture
3. @devops-engineer - Infrastructure scaling
```

### UI/UX Improvement
```
1. @ux-reviewer - Accessibility audit
2. @ui-designer - Component improvements
3. @test-engineer - E2E test scenarios
```
EOF

print_status "Agent index created at .claude/agents/index.md" "ok"

# Check for missing critical files
echo ""
echo -e "${PURPLE}System Health Check:${NC}"
echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check for main CLAUDE.md
if [ -f "CLAUDE.md" ]; then
    print_status "Project CLAUDE.md configured" "ok"
else
    print_status "Project CLAUDE.md missing" "warning"
fi

# Check for global CLAUDE.md
if [ -f "$HOME/.claude/CLAUDE.md" ]; then
    print_status "Global CLAUDE.md configured" "ok"
else
    print_status "Global CLAUDE.md not found" "warning"
fi

# Check for scripts directory
if [ -d "scripts" ]; then
    print_status "Scripts directory exists" "ok"
else
    print_status "Scripts directory missing" "error"
fi

# Create quick launcher script
echo ""
echo -e "${YELLOW}Creating agent launcher...${NC}"

cat > scripts/use-agent.sh << 'EOF'
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
EOF

chmod +x scripts/use-agent.sh
print_status "Agent launcher created at scripts/use-agent.sh" "ok"

# Final summary
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}                  ${GREEN}Setup Complete!${NC}                      ${BLUE}║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Next Steps:${NC}"
if [ -n "$missing_agents" ]; then
    echo "1. Review missing agents:${missing_agents}"
fi
echo "2. Start using agents with @ mentions"
echo "3. Check .claude/agents/index.md for full documentation"
echo ""
echo -e "${GREEN}Happy coding with AI agents! 🤖${NC}"