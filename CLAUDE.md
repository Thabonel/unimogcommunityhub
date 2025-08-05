# Claude Code Memory

## Project Overview
UnimogCommunityHub - React 18 + TypeScript community platform for Unimog enthusiasts

## Key Configuration
- **Framework**: React 18 + TypeScript + Vite
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL JS
- **Payments**: Stripe
- **Auth**: Supabase Auth
- **AI Chat**: Botpress (currently disconnected)

## Security Status
✅ All hardcoded API keys removed and moved to environment variables
✅ .env file properly ignored by git
✅ Security validation scripts created

## Environment Variables Required
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token
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