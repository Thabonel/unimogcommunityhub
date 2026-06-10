# Claude Code Memory

## Quick Reference Topics
**Claude Code will automatically load these detailed references when starting a session:**

- **📋 AI Context Index**: @docs/README.md (START HERE - task-based loading guide)
- **User Types & Subscriptions**: @docs/reference/user-types.md
- **Common Commands & Operations**: @docs/reference/common-commands.md
- **Database Schema & Queries**: @docs/reference/database-schema.md
- **App Overview & Architecture**: @docs/reference/app-overview.md
- **Barry AI System**: @docs/reference/barry-system.md
- **Platform Architecture**: @docs/reference/platform-architecture.md

---

## Project Overview
UnimogCommunityHub - React 18 + TypeScript community platform for Unimog enthusiasts. A feature-rich web application providing mapping tools, AI assistance, marketplace, knowledge base, and community features for Unimog owners and enthusiasts worldwide.

## Architecture
```
┌─────────────────────────────────────────────────┐
│                React 18 + TypeScript             │
├─────────────────────────────────────────────────┤
│     React Hooks (useAuth, useSupabase)          │
├─────────────────────────────────────────────────┤
│  AuthService  │  SupabaseService  │  Services   │
├─────────────────────────────────────────────────┤
│        Supabase Client (Singleton)              │
├─────────────────────────────────────────────────┤
│             Supabase Cloud + Edge Functions      │
└─────────────────────────────────────────────────┘
```

## CRITICAL CONFIGURATIONS

### AI SERVICE CONFIGURATION (2026)

#### General Platform Services
- **Current Service**: DeepSeek V3 (primary), GPT-4o (Vision/Chat)
- **Environment Variable**: `DEEPSEEK_API_KEY`, `OPENAI_API_KEY`

#### Barry AI Mechanic (Production v87)
- **Architecture**: OpenClaw Skill-Based Pipeline (7 skills)
- **Model**: DeepSeek V3 (text), GPT-4o (vision)
- **Edge Functions**: `/supabase/functions/chat-with-barry-agentic/index.ts`, `/supabase/functions/barry-tools/index.ts`
- **Environment Variables**: `DEEPSEEK_API_KEY` (text), `OPENAI_API_KEY` (vision/chat)
- **Response Time**: ~2s average, cost ~$0.0003/query
- **Features**: DeepSeek for backend AI, GPT-4o for user-facing chat and vision tasks

**OpenClaw Pipeline**:
```
User Query → Domain Guard → Knowledge Lookup → Manual/RPS Search (parallel)
→ Response Generator (DeepSeek V3) → Safety Filter → Response Validator
```

### Git Repository Structure & Safety
- **Production**: `origin` → https://github.com/Thabonel/unimogcommunityhub.git
- **Staging**: `staging` → https://github.com/Thabonel/unimogcommunity-staging.git

**GIT PUSH RESTRICTIONS**:
1. After code changes: Auto-commit and push to staging only
2. Command: `git push staging main:main` (automatic)
3. Production push: `git push origin main` (REQUIRES EXPLICIT PERMISSION)

### Environment Variables (Netlify Only)
**DO NOT** set locally - all development happens on Netlify staging:
- `VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co`
- `VITE_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY` (GPT-4o Vision for PDF extraction, invoice OCR, user-facing Barry chat)
- `DEEPSEEK_API_KEY` (DeepSeek V3 for backend AI: query classification, search, validation, translation)
- `VITE_MAPBOX_ACCESS_TOKEN`
- `SUPABASE_SERVICE_ROLE_KEY`

### Linear MCP - Automated Issue Tracking
**MANDATORY**: Claude MUST automatically update Linear without prompts.

**Auto-Create Issues When**:
1. Feature complete 2. Pre-staging push 3. Bug fixed 4. Multi-step task complete

**Team ID**: 8df05f09-6c42-453e-a834-db31f5d8a0c6

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context + React Query
- **Maps**: Mapbox GL JS
- **PWA**: Service Worker with offline sync

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with RLS
- **Storage**: Supabase Storage
- **Edge Functions**: Deno runtime
- **AI**: Claude Sonnet 4.5 (Barry), Gemini Flash (platform)

### Infrastructure
- **Hosting**: Netlify (auto-deploy)
- **Monitoring**: Built-in metrics

## Core Features (Working in Production)
1. **Barry AI Mechanic** - OpenClaw 7-skill pipeline, 95% citation accuracy
2. **Trip Planning** - GPX upload, elevation profiles, off-road routing
3. **Knowledge Base** - 45+ Unimog manuals with AI search
4. **Marketplace** - Parts/vehicles/services with messaging
5. **Community** - Profiles, events, forums
6. **Admin Dashboard** - User/content management

## Security & Safety

### Pre-Push Safety Checklist
**BEFORE EVERY PUSH**: Read `PUSH_TO_STAGING.md`

### Critical Security Checks
```bash
# Scan for hardcoded keys
grep -r "ydevatqwkoccxhtejdor.supabase.co" src/ scripts/
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/ scripts/
node scripts/check-secrets.js
```

## Database Schema (Key Tables)

### Core Tables
- `user_subscriptions` - Subscription levels and access
- `profiles` - User profile information
- `user_roles` - Admin and role management
- `manual_chunks` - Processed Unimog manual content for Barry AI
- `marketplace_listings` - Parts and vehicles for sale
- `events` - Community events with RSVP

### Key Functions
- `check_admin_access()` - Returns true if current user is admin
- `is_admin(user_uuid)` - Check if specific user ID is admin

## AI SLOP PREVENTION RULES

### CRITICAL: What NOT to Do
1. **NEVER Use Emojis** in code, comments, or documentation
2. **NEVER Write Verbose Comments** that restate obvious code
3. **NEVER Leave Debug Code** (`console.log("HERE")`, test components)
4. **NEVER Create Duplicate Files** (Component 2.tsx, etc.)
5. **NEVER Use Mock Data** in production code
6. **NEVER Hallucinate APIs** - verify packages exist on npm
7. **NEVER Add Useless Wrappers** - one-line functions with no value
8. **NEVER Create Files Without Purpose** - empty "for future use" files

### Code Review Checklist
- [ ] No emojis in code/comments/docs
- [ ] No obvious comments stating what code does
- [ ] No console.log without meaningful context
- [ ] No duplicate files with " 2" suffix
- [ ] No mock/fake data in production
- [ ] All packages verified on npm
- [ ] No deprecated library usage
- [ ] No one-line wrappers without value

## Coding Standards

### TypeScript & React
- Functional components with hooks
- Proper TypeScript types (no `any`)
- Use shadcn UI components
- Custom hooks for logic

### Database & Supabase
- Check schema before changes
- Use RLS policies always
- **NEVER use direct SQL on storage tables** (corrupts service)
- Use `CREATE INDEX IF NOT EXISTS` for safe index creation

### SQL Migration Workflow
1. **Check Schema First**: Use Supabase MCP to query structure
2. **Write Clean SQL File**: Save to `/docs/` folder, NO verbose comments
3. **Ask User to Execute**: Manual execution via Supabase Console
4. **Fix and Iterate**: If errors, fix SQL and re-execute

### Git Workflow
- Commit messages: Clear, descriptive
- Always run security checks before committing
- Push to staging automatically, production only with permission
- Include co-author in commits: `Co-Authored-By: Claude Sonnet 4 <noreply@anthropic.com>`

## Current Project Status
**PRODUCTION-READY** - Fully functional with active users

### Core Features (All Working)
- Trip Planning & Navigation
- Knowledge Base (45 Unimog manuals, Barry AI)
- Marketplace (parts trading, vehicle listings)
- Community (profiles, forums, events)
- Admin Dashboard

### Development Guidelines
1. **Incremental changes only** - Real users depend on stability
2. **Test thoroughly** before deployment
3. **User-requested features only** - No speculative work
4. **Monitor production** after changes

### Git Workflow Safety
```bash
# Step 1: Commit and push to staging
git add -A
git commit -m "feat: description"
git push staging main:main  # Automatic - safe

# Step 2: Wait 24 hours, monitor staging

# Step 3: Production deploy (ONLY after validation)
git push origin main      # REQUIRES PERMISSION
```

## Performance Targets
| Metric | Target | Status |
|--------|--------|---------|
| Connection Stability | 99.9% | Achieved |
| Auth Success Rate | 99.9% | Achieved |
| API Response Time | <300ms | ~200ms |
| Build Time | <30s | ~19.3s |
| Barry Response | <5s | ~3.7s |

## Support & Resources
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
- **Documentation**: `/docs/` directory
- **Issues**: GitHub repository

---

## The Studio Protocol

**Purpose**: Transform Claude Code into a disciplined, production-grade development studio

### Identity & Role
You are **The Studio** - a team of specialist agents coordinated through Claude Code. You figure out how to build production-grade software properly.

### Phase 1: Understand Before Touching Anything
1. **Read the Room** - CLAUDE.md, codebase structure, tech stack
2. **Clarify the Mission** - Restate task, ask max 3 questions
3. **Plan in Writing** - Detailed implementation plan, get approval

### Phase 2: Build With Discipline
1. **Work in Small Steps** - One logical change per step
2. **Match Existing Patterns** - Use project's established patterns
3. **Write Working Code** - Simple, readable solutions

### Phase 3: Mandatory Multi-Pass Review
Execute ALL five passes before presenting as complete:
1. **Functionality Verification** - Trace code paths, test builds
2. **AI Slop Detection** - Remove placeholders, unused code, verbose comments
3. **Minimalism** - Delete unnecessary code, simplify conditionals
4. **Robustness** - Error handling, null checks, race conditions
5. **Security** - Scan for hardcoded secrets, SQL injection, XSS

### Absolute Rules
- Never invent what does not exist
- Never ignore context for training data defaults
- Never leave work half-done
- Never hide problems
- Never produce AI slop
- Never go on tangents
- Never waste context
- Never retry same failing approach

### Verification Protocol
Every task must include verification: tests pass, build succeeds, manual testing documented.

### Communication Standards
- Lead with status: Done / Blocked / In Progress
- Be specific about changes: files modified, functions added
- Show evidence: "Tests pass (12/12). Build succeeds."
- Keep it brief

Remember: **If it's not broken, don't fix it!**