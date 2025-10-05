# Claude Code Memory Template

## 📚 Quick Reference Topics
**Claude Code will automatically load these detailed references when starting a session:**

- **[Topic 1]**: @docs/memory/topic1.md
- **[Topic 2]**: @docs/memory/topic2.md
- **[Topic 3]**: @docs/memory/topic3.md

> These files provide detailed, up-to-date information on frequently referenced topics.
> They are automatically imported and loaded into memory at session start.

---

## Project Overview
[Project Name] - [Brief description of the project and its main technology stack]

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────┐
│                [Main Framework]                  │
├─────────────────────────────────────────────────┤
│     [Error Handling / Global State Layer]       │
├─────────────────────────────────────────────────┤
│     [Application Logic / Services Layer]        │
├─────────────────────────────────────────────────┤
│        [Data Layer / API Integration]           │
└─────────────────────────────────────────────────┘
```

## 🔑 CRITICAL CONFIGURATIONS

### Git Repository Structure
- **Production**: `origin` → [production-repo-url]
- **Staging**: `staging` → [staging-repo-url] (if applicable)

### 🚨 GIT PUSH RESTRICTIONS + SAFETY HOOKS
**NEVER push to main repository without explicit permission**
1. After code changes: Auto-commit and push to staging only
2. Command: `git push staging main:main` (automatic)
3. Production push: `git push origin main` (ONLY with explicit permission)

## 📁 Project Structure
```
src/
├── components/       # UI components
├── pages/           # Route pages
├── services/        # Business logic & APIs
├── hooks/           # Custom hooks
├── utils/           # Helper functions
└── config/          # Configuration files
```

## 🚀 Technology Stack

### Frontend
- **Framework**: [React/Vue/Angular/etc]
- **Build Tool**: [Vite/Webpack/etc]
- **Styling**: [Tailwind/CSS/SCSS/etc]
- **State**: [Context/Redux/Zustand/etc]

### Backend (if applicable)
- **Database**: [PostgreSQL/MongoDB/etc]
- **Auth**: [Auth provider]
- **Storage**: [Storage solution]
- **API**: [REST/GraphQL/etc]

### Infrastructure
- **Hosting**: [Netlify/Vercel/AWS/etc]
- **CI/CD**: [GitHub Actions/etc]
- **Monitoring**: [Monitoring tools]

## 🔐 Environment Variables

```bash
# Core Variables
VITE_API_URL=your_api_url
VITE_API_KEY=your_api_key

# Optional Variables
VITE_FEATURE_FLAG=true
```

**IMPORTANT**: Environment variables are configured in [deployment platform].
If there are environment variable errors during development/build, the issue is in the code, not missing variables.

## 🛡️ Security & Authentication

### Critical Security Checks
```bash
# Before EVERY commit - scan for hardcoded keys
grep -r "SECRET\|API_KEY\|PASSWORD" src/

# Run security validation
npm run security-check
```

### Key Security Files
- `/src/[auth-file]` - Authentication logic
- `/src/[config-file]` - Configuration management

## 🎯 Core Features

### 1. [Feature Name]
- Brief description
- Key components
- Important considerations

### 2. [Feature Name]
- Brief description
- Key components
- Important considerations

## 📊 Database Schema (if applicable)

### Core Tables
- `table_name` - Description and key fields

### Common Queries
```sql
-- Useful query example
SELECT * FROM table_name WHERE condition;
```

## 🔧 Common Development Tasks

### Development Workflow
```bash
# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Check for issues
npm run lint
```

### Testing Checklist
- [ ] Authentication flow works
- [ ] Core features functional
- [ ] No console errors
- [ ] Performance acceptable

## 🚀 Deployment

### Pre-Deployment Checklist
1. Run security checks
2. Verify environment variables
3. Test build locally
4. Review recent changes

### Post-Deployment Verification
1. Test core functionality
2. Check console for errors
3. Verify integrations working

## 🐛 Known Issues & Solutions

### Common Issues
1. **Issue description**
   - Solution steps

### Emergency Recovery
```bash
# Recovery commands
```

## 📝 Coding Standards

### [Language] & [Framework]
- [Coding convention 1]
- [Coding convention 2]
- [Coding convention 3]

### Git Commit Convention
```
type(scope): description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**: feat, fix, docs, style, refactor, test, chore

## 📞 Support & Resources

### Documentation
- `/docs/` - Project documentation
- `/CLAUDE.md` - This file (AI memory)
- `/README.md` - User documentation

### External Resources
- [Link to framework docs]
- [Link to deployment platform docs]
- [Link to key dependencies]

## ✅ Success Metrics
- [Metric 1]
- [Metric 2]
- [Metric 3]

## Recent Changes & Session Notes

### Latest Session: [Date]
**Focus**: [What was worked on]

### Issues Resolved:
1. **[Issue]** ✅
   - Description
   - Solution

### Key Learnings:
- [Learning 1]
- [Learning 2]

## Coding Preferences

### [Language] & [Framework]
- Use [pattern/convention]
- Implement [best practice]
- Follow [existing patterns]

### Error Handling
- Use [error handling approach]
- Log errors with [logging approach]
- Implement [fallback strategy]

### Performance
- [Performance consideration 1]
- [Performance consideration 2]

## Project Status

### Current State:
- ✅ **[Feature category]**: [Status description]
- ⚠️ **[Feature category]**: [Status description]
- 🚧 **[Feature category]**: [Status description]

### Development Philosophy:
**[Your approach to changes]**
- [Guideline 1]
- [Guideline 2]
- [Guideline 3]

---

## 📋 Using This Template

### How to Customize:
1. **Replace all [bracketed] placeholders** with your actual project information
2. **Remove sections** that don't apply to your project
3. **Add sections** specific to your project needs
4. **Update regularly** as the project evolves
5. **Keep it concise** - Claude Code works best with focused, actionable information

### Optional Memory Files:
Create additional detailed reference files in `docs/memory/`:
- `docs/memory/database-schema.md` - Detailed database documentation
- `docs/memory/api-endpoints.md` - API reference
- `docs/memory/common-commands.md` - Frequently used commands
- `docs/memory/troubleshooting.md` - Common issues and solutions

These will be auto-loaded when Claude Code starts a session.
