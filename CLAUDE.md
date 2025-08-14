# Claude Code Memory

## Project Overview
UnimogCommunityHub - React 18 + TypeScript community platform for Unimog enthusiasts

## IMPORTANT: Supabase Access
**You have FULL ACCESS to Supabase** - Always check the actual database state before creating migrations or suggesting SQL changes. Use diagnostic queries to understand the current schema, tables, and columns before making modifications.

## MCP (Model Context Protocol) Configuration
**Supabase MCP Server Configured** ✅
- **Location**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Status**: Active with service role key
- **Capabilities**: Direct database access, table management, storage operations
- **Project**: https://ydevatqwkoccxhtejdor.supabase.co

## CRITICAL GIT PUSH RESTRICTIONS
**🚨 NEVER PUSH TO MAIN REPOSITORY WITHOUT EXPLICIT PERMISSION 🚨**
- **NEVER** run `git push origin main` unless explicitly instructed
- **ONLY** push to staging repository automatically after code changes
- **ALWAYS** wait for clear instructions from the user before pushing to main

## Primary Instructions
**IMPORTANT**: After making any code changes, automatically push ONLY to staging repository:
1. Commit changes locally
2. Push ONLY to staging: `git push staging main:main`
3. DO NOT push to main repository unless explicitly instructed with clear permission

## Git Repository Structure
- **Production**: `origin` → https://github.com/Thabonel/unimogcommunityhub.git
- **Staging**: `staging` → https://github.com/Thabonel/unimogcommunity-staging.git

### Workflow:
1. **For Testing**: `git push staging main:main` (automatic after changes)
2. **For Production**: `git push origin main` (ONLY with explicit permission)

## Key Configuration
- **Framework**: React 18 + TypeScript + Vite
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL JS
- **Payments**: Stripe
- **Auth**: Supabase Auth
- **AI Chat**: ChatGPT (OpenAI) - Barry the AI Mechanic

## Security Status
✅ All hardcoded API keys removed and moved to environment variables
✅ .env file properly ignored by git
✅ Security validation scripts created

## Environment Variables Required
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
VITE_OPENAI_API_KEY=sk-your_openai_api_key
```

## Common Commands
```bash
# Development
npm run dev

# Security checks
node scripts/check-secrets.js

# Environment verification
node scripts/check-env.js
```

## Recent Fixes
- Removed hardcoded Supabase credentials from all files
- Fixed Mapbox token loading from environment variables
- Added automatic token synchronization
- Created comprehensive security validation
- Replaced Botpress with ChatGPT (OpenAI) integration
- Removed Steve Travel Planner, kept Barry the AI Mechanic
- Implemented proper error handling for ChatGPT API

## Session Summary - August 14, 2025
**Focus**: Manual Processing System Completion & Admin Interface Restoration

### Issues Resolved:
1. **Manual Processing System** ✅
   - User requested completion of manual chunking for Barry AI
   - Found existing comprehensive chunking system in admin section
   - User confirmed all 45 manuals are now processed and accessible to Barry

2. **Netlify Build Error** ✅ 
   - Build failing due to missing `Content.tsx` import in routes
   - Removed non-existent Content page import and route
   - Build now succeeds locally and on Netlify

3. **Supabase MCP Server Setup** ✅
   - Configured Supabase MCP server for direct database access
   - Added service role key to Claude Desktop config
   - Location: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Bypasses RLS permission issues for future database operations

4. **Admin Dashboard Manual Tab Missing** ✅
   - Manual processing interface was missing from admin dashboard
   - Added "Manuals" tab between Articles and Users tabs
   - Added Book icon and proper lazy loading
   - Updated grid layout for 5 tabs instead of 4

### Key Learnings:
- Manual processing was already complete - user had processed all manuals
- Admin interface access via `/admin/manual-processing` works but wasn't in dashboard
- Security reminder: Never expose service role keys to GitHub
- User prefers existing solutions over recreating functionality

### Security Notes:
- Service role key stored securely in .env (gitignored)
- Claude Desktop config is local only
- No keys exposed to version control

## Trip Library Implementation Status

### ✅ Completed Features
1. **GPX Support**
   - Database tables: `gpx_tracks`, `gpx_track_points`, `gpx_waypoints`
   - Edge Function: `process-gpx` for file processing
   - Components: GPXUploadModal, GPXTrackDisplay with elevation profiles
   - Utilities: Complete GPX parsing and processing

2. **Advanced Routing**
   - OpenRouteService integration in `routingService.ts`
   - Off-road routing optimization for Unimog vehicles
   - Route difficulty assessment
   - Waypoint management system

3. **RSS Feed Aggregation**
   - Database: `rss_feeds`, `aggregated_content`, content interactions
   - Edge Function: `fetch-rss-feeds` for automatic content collection
   - Components: FeedManager (admin), AggregatedContent display
   - Features: Like/save functionality, auto-categorization, metadata extraction

4. **Manual Processing System**
   - AI-powered search through manual chunks
   - Vector embeddings for semantic search
   - Admin interface for manual management

### 🚧 Pending Features
1. **Content Aggregation**
   - Web scraping for trail reports (Scrapy framework needed)
   - Scheduled content collection (cron jobs)
   - Advanced content categorization with ML

2. **Advanced Search**
   - Elasticsearch/MeiliSearch integration
   - Faceted filtering
   - Geographic search capabilities

3. **Trip Collaboration**
   - Shared trip planning
   - Real-time collaboration
   - Trip templates

4. **Self-Hosting**
   - Docker Compose configuration
   - MinIO for S3-compatible storage
   - Deployment guides

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

## Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Route pages
├── services/      # API and business logic
├── utils/         # Helper functions
├── hooks/         # Custom React hooks
├── contexts/      # React contexts
└── integrations/  # External service integrations

supabase/
├── migrations/    # Database migrations
└── functions/     # Edge Functions
```

## Testing Approach
- Manual testing for UI changes
- Check console for errors
- Verify database operations in Supabase dashboard
- Test Edge Functions with Supabase CLI or dashboard

## Known Issues & Workarounds
- Docker required for local Edge Function deployment
- Use Supabase dashboard for deployments without Docker
- Git lock files: Remove with `rm -f .git/index.lock`
- Pre-commit hooks may timeout on large commits