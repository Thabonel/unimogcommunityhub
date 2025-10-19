# Claude Code Memory

## Quick Reference Topics
**Claude Code will automatically load these detailed references when starting a session:**

- **User Types & Subscriptions**: @docs/memory/user-types.md
- **Common Commands & Operations**: @docs/memory/common-commands.md
- **Database Schema & Queries**: @docs/memory/database-schema.md

> These files provide detailed, up-to-date information on frequently referenced topics.
> They are automatically imported and loaded into memory at session start.

---

## Project Overview
UnimogCommunityHub - React 18 + TypeScript community platform for Unimog enthusiasts. A feature-rich web application providing mapping tools, AI assistance, marketplace, knowledge base, and community features for Unimog owners and enthusiasts worldwide.

## Architecture
```
┌─────────────────────────────────────────────────┐
│                React 18 + TypeScript             │
├─────────────────────────────────────────────────┤
│    Error Boundary + Global Error Handling       │
├─────────────────────────────────────────────────┤
│     React Hooks (useAuth, useSupabase)          │
├─────────────────────────────────────────────────┤
│  AuthService  │  SupabaseService  │  Services   │
│  - Token Mgr  │  - Circuit Breaker│  - Claude   │
│  - Sessions   │  - Retry Manager  │  - Mapbox   │
│  - Events     │  - Metrics        │  - Stripe   │
├─────────────────────────────────────────────────┤
│        Supabase Client (Singleton)              │
├─────────────────────────────────────────────────┤
│             Supabase Cloud + Edge Functions      │
└─────────────────────────────────────────────────┘
```

## CRITICAL CONFIGURATIONS

### AI SERVICE CONFIGURATION (2025)
**Platform AI Services**: Mixed architecture for optimal performance and cost

#### General Platform Services (January 2025)
**Migration Status**:  COMPLETE
- **Previous Service**: Anthropic Claude (retired)
- **New Service**: Google Gemini Flash 1.5 (active)
- **Environment Variable**: `VITE_GEMINI_API_KEY` (was `VITE_ANTHROPIC_API_KEY`)
- **Service Classes**: Replaced ClaudeService with GeminiService
- **Performance**: Faster response times and lower latency
- **Cost**: Significantly reduced AI operational costs

#### Barry AI Mechanic (October 2025)
**Current Status**: Production v85 - Two-Pass RAG Architecture
- **Model**: OpenAI GPT-4o (responses) + GPT-4o-mini (query expansion & reranking)
- **Edge Function**: `/supabase/functions/chat-with-barry/index.ts`
- **Version**: v85 - Fixed page number matching (October 2025)
- **Environment Variable**: `OPENAI_API_KEY`
- **Architecture**: Two-Pass RAG Context Injection
- **Accuracy**: ~95% correct responses
- **Response Time**: ~4 seconds average
- **Cost**: ~$0.012 per query

**Architecture Overview**:
```
User Query
    ↓
1. Query Expansion (GPT-4o-mini extracts technical terms)
    ↓
2. Search Manual Index (up to 15 candidates)
    ↓
3. Rerank by Relevance (GPT-4o-mini scores 0.0-1.0)
    ↓
4. Verify Relevance (keep only ≥0.5 score)
    ↓
5. Fetch Full Content (for verified pages only)
    ↓
6. Inject into Context (RAG prompt with manual sections)
    ↓
7. Generate Response (GPT-4o with citations)
```

**Key Features Implemented**:
- Query expansion for natural language → technical terms
- GPT-4o-mini reranking (40-60% accuracy boost)
- Two-pass verification (verify relevance before citing)
- Content-based fallback for chapter PDFs
- Smart threshold tuning (0.5 relevance score)

**Current Version**: v85 (October 2025) - Page number fix for chapter-extracted manuals
**Documentation**: See `docs/barry/` for detailed architecture and evolution history

### Barry "Forever Architecture" Principle (CRITICAL)

**CORE RULE**: The chat-with-barry-agentic edge function is a **stable orchestrator that NEVER changes**.

**Philosophy**: Barry's core function is designed to last forever. New features are added via **pluggable context gatherers**, NOT by modifying the core routing and response logic.

#### How to Add New Context Sources

**CORRECT Approach - Context Gatherer Pattern**:
```typescript
// 1. Create gatherer function (before routing logic)
let myFeatureContext = '';
let myFeatureData: any[] = [];

const needsMyFeature = detectMyFeature(userQuery);
if (needsMyFeature) {
  try {
    const result = await gatherMyFeatureContext(supabaseAdmin, userQuery);
    if (result.found) {
      myFeatureContext = formatMyFeatureContext(result);
      myFeatureData = result.references;
      console.log('[My Feature Gatherer] Context injected');
    }
  } catch (error) {
    console.error('[My Feature Gatherer] Error:', error);
    // Fail gracefully - let core routing continue
  }
}

// 2. Inject into existing flow (in general mode section)
if (myFeatureContext) {
  systemPrompt += '\n\n' + myFeatureContext;
  knowledgeMode = 'my_feature_mode';
}

// 3. Include in response (in return statement)
manualReferences: myFeatureData.length > 0 ? myFeatureData : []
```

**WRONG Approach - Feature-Specific Code Path**:
```typescript
// ❌ NEVER DO THIS
if (detectMyFeature(userQuery)) {
  const result = await gatherMyFeatureContext();
  const response = await callClaudeAPI(result); // Separate API call
  return response; // Early return bypasses core flow
}
```

#### Why This Matters

**Problems with Feature-Specific Code Paths**:
1. **Fragility**: Each feature adds failure points to core function
2. **Duplication**: Multiple Claude/OpenAI calls with different error handling
3. **Coupling**: Features tightly bound to core logic
4. **Maintenance**: Every feature change risks breaking core routing
5. **Testing**: Exponential complexity with each new feature

**Benefits of Context Gatherer Pattern**:
1. **Stability**: Core function never changes, only gatherers added
2. **Isolation**: Gatherers fail independently without crashing core
3. **Simplicity**: Single API call point with consistent error handling
4. **Composability**: Multiple gatherers can contribute to same response
5. **Testability**: Test gatherers separately from core routing

#### Architecture Diagram

```
User Query
    ↓
[Context Gatherers] ← Run in parallel, fail independently
  ├─ RPS Gatherer (exploded views)
  ├─ Manual Gatherer (workshop procedures)
  ├─ Location Gatherer (weather/services)
  └─ [Future gatherers...]
    ↓
[Stable Core Router] ← NEVER CHANGES
  ├─ Classify intent (technical vs general)
  ├─ Build system prompt (base + gathered contexts)
  └─ Route to appropriate mode
    ↓
[Single LLM Call] ← Claude Haiku or OpenAI GPT-4o
    ↓
[Structured Response] ← content + references + metadata
```

#### Real Example: RPS Phase 7 Integration

**Before (WRONG)**: Lines 342-421 made separate Claude call for RPS queries
- Early return bypassed core routing
- Duplicate error handling
- Crashed on RPS gatherer errors (CORS failures)

**After (CORRECT)**: Lines 342-385 inject RPS context into existing flow
- Gatherer runs before routing
- Context added to systemPrompt if found
- Core function makes single Claude call
- Fails gracefully if RPS search errors

#### Adding New Features Checklist

Before adding a feature to chat-with-barry-agentic:

- [ ] Feature uses context gatherer pattern (not separate code path)
- [ ] Gatherer has try/catch with graceful failure
- [ ] Context injected into existing systemPrompt variable
- [ ] References added to existing return statement
- [ ] NO new Claude/OpenAI API calls in feature code
- [ ] NO early returns from feature-specific logic
- [ ] Logging uses `[Gatherer Name]` prefix for debugging

### Supabase MCP Server Access
**Status**:  CONFIGURED - Full database access available
- **Location**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Capabilities**: Direct database access, table management, storage operations
- **Project URL**: https://ydevatqwkoccxhtejdor.supabase.co
- **Service Role**: Available for admin operations
- **Access Level**: Full read/write access via service role key
- **What Claude Can Do**:
  - Read all tables (bypassing RLS)
  - Update/INSERT/DELETE records directly
  - Create/modify tables and schemas
  - Execute any SQL queries
  - Manage storage buckets
- **Security**: Service role key stored locally only, never in codebase
- **Use Cases**: Direct database fixes, data migrations, troubleshooting RLS issues

### Linear MCP - Issue Tracking & Automated Workflow
**Status**: ✅ CONFIGURED - Automatic issue tracking enabled

**Linear Workspace**: Wheels and Wins (https://linear.app/wheels-and-wins)
**Team ID**: 8df05f09-6c42-453e-a834-db31f5d8a0c6

**MANDATORY: Automated Linear Updates**
Claude MUST automatically update Linear without being prompted. This is not optional.

**Automatic Triggers - Create Linear Issue When:**
1. ✅ **Feature Complete** - After implementing any new feature (components, pages, database changes)
2. ✅ **Pre-Staging Push** - BEFORE running `git push staging main:main`
3. ✅ **Pre-Production Push** - BEFORE running `git push origin main` (if authorized)
4. ✅ **Bug Fixed** - After fixing any reported bug or error
5. ✅ **Multi-Step Task Complete** - After completing user requests that took >3 steps

**Automatic Triggers - Update/Comment on Existing Issue When:**
1. 📝 **After Staging Deploy** - Add comment with commit hash and deployment status
2. 📝 **After Production Deploy** - Add comment with deployment confirmation
3. 📝 **When Blocked** - Add comment if implementation is blocked or needs user input
4. 📝 **Test Results** - Add comment after testing features

**Linear Issue Template:**
```
Title: [Feature/Fix Name] - [Brief Description]

Description:
## Overview
[What was built/fixed]

## Implementation Details
- File changes
- Database changes
- New routes/components

## Testing Checklist
- [ ] Local testing complete
- [ ] Deployed to staging
- [ ] User testing complete
- [ ] Ready for production

## Deployment Status
- Staging: [commit hash]
- Production: [commit hash or "pending"]
```

**Workflow Example:**
1. User: "Build verification system"
2. Claude: Implements feature
3. Claude: **AUTOMATICALLY creates Linear issue WHE-X** (no prompt needed)
4. Claude: Pushes to staging
5. Claude: **AUTOMATICALLY adds comment to WHE-X** with staging deployment info
6. User: "push to production"
7. Claude: Pushes to production
8. Claude: **AUTOMATICALLY adds comment to WHE-X** with production deployment confirmation

**Enforcement:**
- If Claude completes a feature without creating Linear issue → **VIOLATION**
- If Claude pushes to staging without updating Linear → **VIOLATION**
- Linear updates are MANDATORY, not optional

### Git Repository Structure
- **Production**: `origin` → https://github.com/Thabonel/unimogcommunityhub.git
- **Staging**: `staging` → https://github.com/Thabonel/unimogcommunity-staging.git

### GIT PUSH RESTRICTIONS + SAFETY HOOKS
**NEVER push to main repository without explicit permission**
1. After code changes: Auto-commit and push to staging only
2. Command: `git push staging main:main` (automatic)
3. Production push: `git push origin main` (ONLY with explicit permission)

### NEW: Pre-Push Safety Hook
**Automatic safety enforcement for production pushes:**
- **Hook location**: `.git/hooks/pre-push`
- **Triggers on**: `git push origin main` (production repository only)
- **Requires**: Reading and confirming `PUSH_TO_MAIN.md` checklist
- **Interactive prompts**: 3-step confirmation process
- **Logging**: Records all production deployment attempts

### Safety Hook Workflow:
```bash
git push origin main
#  PRODUCTION DEPLOYMENT DETECTED!
#  Safety checklist: PUSH_TO_MAIN.md
# Have you thoroughly read PUSH_TO_MAIN.md? (yes/no)
# Have you completed ALL items in the safety checklist? (yes/no) 
# Are you 100% confident this is safe for production deployment? (yes/no)
#  Safety checks completed.  Proceeding with production deployment...
```

**Bypasses hook**: Staging pushes (`git push staging main:main`) work normally

 **For detailed workflow**: See [Git Workflow Documentation](docs/GIT_WORKFLOW.md)

## Code Quality Tools

### Knip Dead Code Detection
**Status**: Available via `npm run knip` commands
**Note**: When doing cleanup, delete maximum 5 files per batch, test thoroughly, and monitor production for 24h after each deploy.

## Project Structure
```
src/
├── components/       # UI components (shadcn/ui based)
│   ├── ui/          # Base UI primitives
│   ├── auth/        # Authentication components
│   ├── knowledge/   # Knowledge base & manuals
│   ├── marketplace/ # Marketplace features
│   ├── trips/       # Trip planning & GPX
│   └── vehicle/     # Vehicle management
├── pages/           # Route pages
├── routes/          # Route configurations
├── services/        # Business logic & APIs
│   ├── core/        # Core services (Auth, Supabase)
│   ├── claude/      # Barry AI integration (Claude API)
│   ├── mapbox/      # Mapping services
│   └── offline/     # PWA & offline sync
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
├── lib/            # Core libraries
├── utils/          # Helper functions
└── config/         # Environment config

supabase/
├── migrations/     # Database migrations
└── functions/      # Edge Functions (Deno)
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Context + React Query
- **Maps**: Mapbox GL JS
- **PWA**: Service Worker with offline sync
- **i18n**: react-i18next for internationalization

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with RLS
- **Storage**: Supabase Storage (avatars, vehicles, manuals)
- **Edge Functions**: Deno runtime
- **Payments**: Stripe integration
- **AI**: Google Gemini Flash (Barry the AI Mechanic)

### Infrastructure
- **Hosting**: Netlify (auto-deploy from GitHub)
- **CDN**: Netlify Edge
- **Monitoring**: Built-in metrics collection
- **Security**: Environment variables, RLS policies

## 🔐 Environment Variables

**IMPORTANT**: Environment variables are ALWAYS configured and available in Netlify deployment. 
If there are environment variable errors during development/build, the issue is ALWAYS in the code, not missing environment variables.

We do NOT use local development - all development happens directly on Netlify staging.

```bash
# Required - Supabase (ALWAYS SET IN NETLIFY)
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=ydevatqwkoccxhtejdor

# Required - Maps (ALWAYS SET IN NETLIFY)
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token

# Required - AI (ALWAYS SET IN NETLIFY)
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_UNSTRUCTURED_API_KEY=your_unstructured_api_key

# Optional - Payments (ALWAYS SET IN NETLIFY)
VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
VITE_STRIPE_LIFETIME_PRICE_ID=price_xxx

# Optional - Development
VITE_ENABLE_DEV_LOGIN=false
```

## Security & Authentication

### MANDATORY: Pre-Push Safety Checklist

**BEFORE EVERY PUSH TO STAGING**: Read and follow `PUSH_TO_STAGING.md`

This checklist prevents critical deployment failures:
- **Platform-specific dependency conflicts** (EBADPLATFORM errors)
- **Cross-platform path issues** (Windows/macOS vs Linux)
- **Hardcoded secrets and environment variables**
- **Binary compatibility problems**

**Key Commands**:
```bash
# Check for platform-specific packages (most common failure)
grep -E "@rollup/rollup-(darwin|linux|win32)" package.json

# Verify build works locally before pushing
npm run build

# One-liner platform check
npm ls --depth=0 | grep -E "(darwin|linux|win32)" && echo " PLATFORM CONFLICT" || echo " Safe to push"
```

**Emergency Pattern**: If staging build fails with EBADPLATFORM:
1. Check devDependencies for platform-specific packages
2. Remove any packages with darwin/linux/win32 suffixes
3. Let build tools auto-detect appropriate dependencies

### Critical Security Checks
```bash
# Before EVERY commit - scan for hardcoded keys
grep -r "ydevatqwkoccxhtejdor.supabase.co" src/ scripts/
grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" src/ scripts/
grep -r "||.*supabase" src/  # Check for hardcoded fallbacks

# Run security validation
node scripts/check-secrets.js
node scripts/check-env.js
```

### Auth Error Prevention
- **NO hardcoded API keys as fallbacks**
- Only clear sessions on JWT errors, not API key errors
- Comprehensive error categorization
- Smart retry with exponential backoff
- Circuit breaker pattern (5 failure threshold)

### Key Security Files
- `/src/lib/supabase-client.ts` - Client initialization (NO fallbacks)
- `/src/contexts/AuthContext.tsx` - Auth state management
- `/src/utils/supabase-error-handler.ts` - Error handling
- `/src/services/core/AuthService.ts` - Token management

## Core Features

### 1. Trip Planning & Navigation
- **GPX Support**: Upload, display, analyze GPX tracks
- **Elevation Profiles**: Terrain analysis for off-road routes
- **OpenRouteService**: Off-road optimized routing
- **Waypoint Management**: Save and organize destinations
- **Offline Maps**: Download for remote areas

### 2. Knowledge Base
- **Manual Processing**: 45+ Unimog manuals processed
- **AI Search**: Vector embeddings for semantic search
- **Barry AI Mechanic**: Gemini powered technical assistant
- **PDF Viewer**: In-browser manual viewing
- **Admin Tools**: Manual chunk management

### 3. Marketplace
- **Parts Trading**: Buy/sell Unimog parts
- **Vehicle Listings**: Complete vehicles for sale
- **Service Providers**: Find mechanics and specialists
- **Secure Messaging**: In-app communication
- **Location-Based**: Find items near you

### 4. Community Features
- **User Profiles**: Showcase your Unimog
- **Vehicle Registry**: Document your fleet
- **Event Calendar**: Rallies and meetups
- **Forums**: Technical discussions
- **Photo Galleries**: Share adventures

### 5. Premium Features (WIS-EPC)
- **Mercedes WIS**: Workshop Information System
- **EPC Access**: Electronic Parts Catalog
- **Remote Access**: Via Apache Guacamole
- **Session Management**: Time-based access
- **Subscription Tiers**: Free/Premium/Lifetime

## Database & Development

See detailed documentation in:
- **Database Schema**: `@docs/memory/database-schema.md`
- **Common Commands**: `@docs/memory/common-commands.md`
- **User Management**: `@docs/memory/user-types.md`

## Deployment

### Netlify Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18
- **Auto-deploy**: From main branch
- **Environment Variables**: Set in Netlify dashboard

### Pre-Deployment Checklist
1. Run security checks
2. Verify environment variables
3. Test build locally
4. Check for hardcoded keys
5. Review recent changes

### Post-Deployment Verification
1. Test sign-in flow
2. Check console for errors
3. Verify maps load
4. Test Barry AI
5. Check PDF viewer

## Performance Metrics (Current)
| Metric | Target | Status |
|--------|--------|---------|
| Connection Stability | 99.9% | Achieved |
| Auth Success Rate | 99.9% | Achieved |
| API Response Time | <300ms | ~200ms |
| Build Time | <30s | ~19.3s |

## Known Issues & Solutions

### Common Issues
1. **"Invalid API key" error**
   - Check Netlify env variables
   - No hardcoded fallbacks allowed
   - Verify Supabase keys current

2. **PDF viewer issues**
   - Local PDF.js worker configured
   - Fallback to download option
   - Manuals bucket must be public

3. **Map flashing**
   - Fixed with proper initialization
   - Check Mapbox token valid

### Emergency Recovery
```bash
# Clear auth issues
localStorage.clear()
# Reload page
window.location.reload()

# Check service health
const service = SupabaseService.getInstance()
await service.healthCheck()
```

## Coding Standards

### TypeScript & React
- Functional components only
- Proper TypeScript types (no `any`)
- Use shadcn UI components
- Custom hooks for logic
- Error boundaries for safety

### Database Best Practices
- Check schema before changes
- Use RLS policies always
- Write defensive SQL
- Include proper indexes
- Document complex queries

### Git Commit Convention
```
type(scope): description

Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

## AI SLOP PREVENTION RULES

### CRITICAL: What NOT to Do

**These rules prevent code pollution and must be followed strictly:**

#### 1. NEVER Use Emojis in Code or Documentation
- **Forbidden**: Emojis in comments, commit messages, documentation headings
- **Why**: Not searchable, unprofessional, visual clutter
- **Violators**: 🔥 ✅ ❌ ⚠️ 🚀 🎯 💡 📝 and all others
- **Allowed**: Plain text only - "CRITICAL", "WARNING", "NOTE", "FIXED"

#### 2. NEVER Write Verbose Useless Comments
- **Forbidden**: Comments that restate obvious code
  ```typescript
  // BAD: Set the value to 5
  const value = 5;

  // BAD: Loop through the array
  for (const item of array) { }

  // BAD: Return true if condition is met
  return condition === true ? true : false;
  ```
- **Allowed**: Complex logic explanations, non-obvious behavior, why not what
  ```typescript
  // GOOD: Haversine formula needed for GPS accuracy over large distances
  const distance = calculateHaversine(lat1, lon1, lat2, lon2);

  // GOOD: Retry with exponential backoff to handle transient failures
  await retryWithBackoff(operation, maxAttempts);
  ```

#### 3. NEVER Leave Debug Code in Production
- **Forbidden**:
  - `console.log(error)` without context
  - `console.log("HERE")` or `console.log("TEST")`
  - Debug components (DebugPanel, CurrencyDebug, etc.)
  - Test files in src/ directory
  - Commented-out code blocks over 5 lines
- **Allowed**:
  - Structured logging with context: `logger.error('Operation failed', { context })`
  - Error boundaries with proper error handling

#### 4. NEVER Create Duplicate Files
- **Forbidden**:
  - Files with " 2", " 3" suffixes (Component 2.tsx)
  - Copy-paste of entire files with minor changes
  - Multiple versions of same component
- **Required**: Git branching for experiments, not file duplication

#### 5. NEVER Use Mock Data in Production Code
- **Forbidden**:
  - Hardcoded mock data arrays in components
  - Fake API responses
  - Placeholder content that never gets replaced
- **Allowed**:
  - Mock data in test files only
  - Development environment seed data (clearly marked)

#### 6. NEVER Hallucinate APIs or Packages
- **Forbidden**:
  - Making up package names that don't exist
  - Inventing API endpoints
  - Assuming libraries have features they don't
- **Required**:
  - Verify package exists on npm before using
  - Check API documentation before implementation
  - Test imports before committing

#### 7. NEVER Use Outdated or Wrong Library Versions
- **Forbidden**:
  - Using deprecated APIs
  - Importing from wrong package paths
  - Using syntax not supported by installed version
- **Required**:
  - Check package.json for installed versions
  - Read current documentation for the installed version
  - Test code against actual installed dependencies

#### 8. NEVER Add Useless Wrapper Functions
- **Forbidden**:
  ```typescript
  // BAD: Useless wrapper
  function getUserId(user: User): string {
    return user.id;
  }

  // BAD: One-line wrapper with no value
  const fetchData = () => api.getData();
  ```
- **Allowed**: Wrappers that add value (error handling, validation, transformation)

#### 9. NEVER Use Superlatives Without Evidence
- **Forbidden**:
  - "Best practices" without citation
  - "Industry standard" without proof
  - "Optimal solution" without benchmarks
  - Excessive "revolutionary", "game-changing", "enterprise-grade"
- **Required**: Be specific and factual

#### 10. NEVER Create Files Without Purpose
- **Forbidden**:
  - Empty utility files "for future use"
  - Placeholder components never implemented
  - "Coming soon" pages that never come
- **Required**: Delete unused code immediately, use git history if needed later

### Code Review Checklist - AI Slop Detection

Before committing, verify:
- [ ] No emojis in code, comments, or documentation
- [ ] No "obvious" comments (statements of what code does)
- [ ] No console.log without meaningful context
- [ ] No duplicate files (check for " 2" suffix pattern)
- [ ] No mock/fake data in production code
- [ ] All packages verified to exist on npm
- [ ] All APIs verified in official documentation
- [ ] No deprecated library usage
- [ ] No one-line wrapper functions without added value
- [ ] No superlatives without evidence
- [ ] No placeholder "TODO" code in production

### Enforcement

If AI slop is detected:
1. **Immediate**: Delete the offending code/file
2. **Document**: Note what was removed in commit message
3. **Prevent**: Add specific rule to this section if needed

### Exception Handling

The ONLY acceptable exceptions:
- **Emojis**: In user-facing content ONLY (not code/docs)
- **Debug logs**: Temporarily for urgent production debugging (remove within 24h)
- **Mock data**: In files clearly named `*.mock.ts` or `*.fixture.ts`

## Unimog-Specific Guidelines

### Terminology
- Always capitalize "Unimog"
- Use "Community Hub" (title case)
- Technical terms: portal axles, torque tube, diff locks

### Color Scheme
- `military-green` - Primary actions
- `camo-brown` - Borders/accents
- `mud-black` - Text
- `khaki-tan` - Highlights
- `sand-beige` - Backgrounds

### Target Audience
- Unimog owners/enthusiasts
- Off-road adventurers
- Military vehicle collectors
- Expedition travelers
- Technical DIY mechanics

## Support & Resources

### Documentation
- `/docs/` - Comprehensive guides
- `/CLAUDE.md` - This file (AI memory)
- `/README.md` - User documentation
- Supabase Dashboard - Database management

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Mapbox Docs](https://docs.mapbox.com)
- [Anthropic Claude API](https://docs.anthropic.com)

## Success Metrics
- Sign-in works first attempt
- No "Invalid API key" errors
- Maps load without flashing
- Barry responds accurately
- PDFs display correctly
- Offline mode functional
- Build completes < 30s
- Zero critical vulnerabilities


## Coding Preferences

### TypeScript & React
- Use functional components with hooks
- Implement proper TypeScript types (no `any`)
- Use Shadcn UI components from `@/components/ui`
- Follow existing component patterns in codebase

### Database & Supabase
- Always check existing schema before creating migrations
- Use RLS policies for security
- Create diagnostic queries before modifications
- Use `check_admin_access()` for admin functions
- **CRITICAL**: Write only clean SQL in migration files - no comments, explanations, or extra formatting
- Avoid `CREATE INDEX CONCURRENTLY` in migrations (causes transaction block errors)
- Use `CREATE INDEX IF NOT EXISTS` for safe index creation

### SQL Migration Workflow
**CRITICAL PROCESS** - Always follow this exact workflow:

1. **Check Schema First**: Use Supabase MCP to query table structure before writing SQL
   ```sql
   SELECT column_name, data_type FROM information_schema.columns
   WHERE table_name = 'table_name' ORDER BY ordinal_position;
   ```

2. **Write Clean SQL File**: Save to `/docs/` folder with descriptive name
   - NO emojis, NO verbose comments, NO explanations in SQL
   - Clean SQL only with minimal transaction structure:
     ```sql
     BEGIN;
     -- backup or preparation queries
     -- update queries
     -- verification query
     COMMIT;
     ```

3. **Ask User to Execute**: Write the SQL file, then ask user to execute it manually via Supabase Console

4. **User Reports Errors**: If SQL fails, user pastes error message here

5. **Fix and Iterate**: Check schema again with MCP, fix SQL, save new version, ask user to re-execute

### Edge Functions
- Use Deno runtime conventions
- Include proper CORS headers
- Handle errors gracefully
- Use service role key for admin operations

### Git Workflow
- Commit messages: Clear, descriptive, include what and why
- Always run security checks before committing
- Push to staging automatically, production only with permission
- Include emoji and co-author in commit messages

### Error Handling
- Use toast notifications for user feedback
- Log errors with proper context
- Implement graceful fallbacks
- Never expose sensitive error details

### Performance
- Lazy load heavy components
- Implement proper caching strategies
- Optimize database queries with indexes
- Use pagination for large datasets


## Git Safety Guardrails

### Critical Rules
1. **NEVER push to production** without explicit permission
2. **Always push to staging first**: `git push staging main:main`
3. **Check before pushing**: `git diff --stat staging/main`
4. **Never use --force** without permission
5. **Pre-push hook** enforces safety checks for production deploys

### Safe Workflow
```bash
git add -A
git commit -m "feat: description"
git push staging main:main  # Automatic - safe
# git push origin main      # REQUIRES PERMISSION
```

See [Git Workflow Documentation](docs/GIT_WORKFLOW.md) for details.

## Current Project Status (October 2025)

### Platform Status
**PRODUCTION-READY** - Fully functional with active users

### Core Features (All Working)
- Trip Planning & Navigation (GPX, elevation profiles, off-road routing)
- Knowledge Base (45 Unimog manuals, Barry AI assistant)
- Marketplace (parts trading, vehicle listings)
- Community (profiles, forums, events)
- Premium WIS-EPC (Workshop Information System)
- Admin Dashboard (complete management interface)

### Development Guidelines
1. **Incremental changes only** - Real users depend on stability
2. **Test thoroughly** before deployment
3. **User-requested features only** - No speculative work
4. **Monitor production** after any changes

### Git Workflow
- **Staging**: `git push staging main:main` (automatic)
- **Production**: `git push origin main` (REQUIRES EXPLICIT PERMISSION)

Remember: **If it's not broken, don't fix it!**

## Critical Lessons: Storage Operations

### Supabase Storage Best Practices
**NEVER use direct SQL** on `storage.objects` or `storage.buckets` tables.

**CORRECT - Use Storage API:**
```typescript
const { data, error } = await supabase.storage
  .from('manuals')
  .move('old-name.pdf', 'new-name.pdf');
```

**WRONG - Direct SQL:**
```sql
-- NEVER DO THIS
UPDATE storage.objects SET name = 'new-name' WHERE name = 'old-name';
```

**Why**: Supabase Storage API maintains internal consistency. Direct SQL corrupts the service and causes null ID responses.

## Critical Lessons: PDF Viewer Operations

### The October 2025 Barry Incident

**Date**: October 16, 2025
**Issue**: PDF viewers crashed with "Invalid parameter object" error after cleanup commit
**Status**: Resolved (deployment cache issue)

### What Happened

**The Cleanup Commit** (92dbd2564, October 10, 2025):
- Simplified WISPDFViewer.tsx and use-pdf-document.ts
- Changed from `window.pdfjsLib` dynamic loading to direct `import * as pdfjsLib`
- Modified API call from `getDocument(url)` to `getDocument({ url })`
- **BUG**: Wrong API signature for direct import method

**The Confusion**:
- Initially thought Barry was broken (it uses SimplePdfScrollViewer)
- Actually broke WIS media viewer (uses WISPDFViewer.tsx)
- Barry uses react-pdf library with different API
- Issue resolved through deployment propagation

### Root Cause Analysis

**Three Contributing Factors**:

1. **Overzealous Cleanup**
   - Removed "emoji comments" and verbose logging
   - Simplified PDF loading without testing
   - Changed initialization method without API verification

2. **Complex PDF.js Architecture**
   - Multiple viewers: SimplePdfScrollViewer (Barry), WISPDFViewer (WIS), use-pdf-document (hook)
   - Two libraries: raw pdfjs-dist + react-pdf wrapper
   - Previous version conflict (Oct 9) made system fragile
   - See: docs/troubleshooting/PDF_VERSION_CONFLICT_FIX.md

3. **Insufficient Testing**
   - Changes pushed without testing PDF loading
   - No automated PDF viewer tests
   - Manual testing missed WIS media viewer

### PDF.js API Compatibility Rules

**CORRECT Usage Patterns**:

```typescript
// ✅ Pattern 1: react-pdf library
import { Document } from 'react-pdf';
<Document file={{ url: pdfUrl }} />

// ✅ Pattern 2: window.pdfjsLib (dynamic loading)
const pdfjsLib = (window as any).pdfjsLib;
const loadingTask = pdfjsLib.getDocument(url);  // String OK

// ✅ Pattern 3: Direct import from pdfjs-dist
import * as pdfjsLib from 'pdfjs-dist';
const loadingTask = pdfjsLib.getDocument({ url });  // Object required
```

**WRONG - Mixed Approach**:
```typescript
// ❌ NEVER DO THIS
import * as pdfjsLib from 'pdfjs-dist';
const loadingTask = pdfjsLib.getDocument(url);  // String + import = ERROR
```

### Prevention Rules

**HIGH RISK FILES** (require explicit testing):
- `src/components/knowledge/SimplePdfScrollViewer.tsx` (Barry)
- `src/components/wis/WISPDFViewer.tsx` (WIS media)
- `src/hooks/use-pdf-document.ts` (shared hook)
- `src/components/knowledge/TabbedBarryLayout.tsx` (Barry tabs)
- `src/components/knowledge/TabbedPdfViewer.tsx` (Barry tabs)
- `package.json` (pdfjs-dist and react-pdf versions)

**MANDATORY Testing Before Commit**:
```bash
# Test ALL these scenarios:
1. Barry manual citations load (SimplePdfScrollViewer)
2. WIS media viewer loads PDFs (WISPDFViewer)
3. Admin manual processing works (use-pdf-document)
4. No console errors for "Invalid parameter object"
5. Verify: npm list pdfjs-dist (single version only)
```

**NEVER**:
- Cleanup PDF-related code without testing
- Change PDF.js API calls without verification
- Upgrade pdfjs-dist or react-pdf without checking compatibility
- Remove "verbose" logging from PDF loaders (it's debugging info)
- Simplify error handling in PDF viewers

**ALWAYS**:
- Test locally first
- Deploy to staging
- Wait 24h for user feedback
- Get explicit permission for production deploy
- Keep version documentation updated

### Version Compatibility

**Current Setup** (tested and working):
```json
{
  "pdfjs-dist": "^3.11.174",
  "react-pdf": "7.7.0"  // Exact version (no ^)
}
```

**Before Upgrading**:
```bash
# Check version compatibility
npm view react-pdf@<version> dependencies.pdfjs-dist
npm list pdfjs-dist

# Read migration guides
# Test ALL PDF viewers
# Get user approval
```

**Version History**:
- Oct 9, 2025: Fixed version conflict (react-pdf 10.1.0 → 7.7.0)
- Oct 10, 2025: Cleanup broke WISPDFViewer
- Oct 16, 2025: Issue resolved, lessons documented

### Documentation

See comprehensive guides:
- **docs/troubleshooting/PDF_VERSION_CONFLICT_FIX.md** - Version conflict resolution (Oct 9, 2025)
- **docs/features/PDF_VIEWER_IMPLEMENTATION.md** - Implementation details
- **docs/pdf/PDF_TESTING_GUIDE.md** - Testing protocol
- **docs/pdf/PDF_API_REFERENCE.md** - API usage reference

