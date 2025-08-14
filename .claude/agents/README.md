# Claude AI Agents Configuration

This directory contains specialized AI agent configurations for the UnimogCommunityHub project.

## Directory Structure

```
.claude/
├── agents/                 # AI agent configurations
│   ├── bug-detector.md    # Bug detection and analysis agent
│   ├── security.md        # Security scanning agent
│   ├── ui-designer.md     # UI/UX design agent
│   ├── test-writer.md     # Test generation agent
│   ├── docs-writer.md     # Documentation agent
│   └── devops.md          # DevOps automation agent
└── CLAUDE.md              # Main project instructions
```

## Available Agents

### 🐛 Bug Detector (`bug-detector.md`)
- Automated bug detection and analysis
- Code quality assessment
- Performance issue identification

### 🔒 Security Agent (`security.md`)
- Vulnerability scanning
- Secret detection
- Security best practices enforcement

### 🎨 UI Designer (`ui-designer.md`)
- Component generation with v0
- Design system compliance
- Accessibility checking

### 🧪 Test Writer (`test-writer.md`)
- Automated test generation
- Coverage analysis
- E2E test scenarios

### 📝 Documentation Writer (`docs-writer.md`)
- Auto-generate documentation
- API documentation
- Code comments and explanations

### 🚀 DevOps Agent (`devops.md`)
- CI/CD pipeline configuration
- Infrastructure as Code
- Deployment automation

## Usage

Each agent file contains specific instructions and context that Claude can use to perform specialized tasks. When you need a specific type of assistance, reference the appropriate agent file.

Example:
```
"Use the bug-detector agent to scan this component"
"Apply security agent to review this API endpoint"
```

## Configuration

Agent behaviors can be customized in `scripts/ai-agents.json` for integration with external tools and services.