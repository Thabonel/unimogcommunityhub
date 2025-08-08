# Claude Code Memory

## Project Overview
UnimogCommunityHub - React 18 + TypeScript community platform for Unimog enthusiasts

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