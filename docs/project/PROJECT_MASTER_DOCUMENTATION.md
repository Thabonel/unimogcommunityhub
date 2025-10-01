# 🚙 UnimogCommunityHub - Master Documentation
**Last Updated:** 2025-08-28  
**Purpose:** Complete project reference for Claude Code and developers  
**Status:** Production Ready

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Critical Configurations](#critical-configurations)
5. [Git Workflow](#git-workflow)
6. [Development Guide](#development-guide)
7. [Features](#features)
8. [Database Schema](#database-schema)
9. [Security & Authentication](#security--authentication)
10. [Common Issues & Solutions](#common-issues--solutions)
11. [Recent Work & Session History](#recent-work--session-history)
12. [Emergency Procedures](#emergency-procedures)

---

## 🎯 Project Overview

### What is UnimogCommunityHub?
A comprehensive React/TypeScript web application for Unimog enthusiasts featuring trip planning, knowledge base, marketplace, and community features. Built with enterprise-grade architecture using Supabase, Mapbox, and OpenAI integrations.

### Key Metrics
- **Users:** Global Unimog owners and enthusiasts
- **Manuals:** 45+ processed Unimog manuals
- **AI Assistant:** Barry the AI Mechanic (GPT-4 powered)
- **Maps:** Full Mapbox integration with offline support
- **Database:** PostgreSQL via Supabase
- **Deployment:** Netlify (staging + production)

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────────────────┐
│                React 18 + TypeScript             │
├─────────────────────────────────────────────────┤
│    Error Boundary + Global Error Handling       │
├─────────────────────────────────────────────────┤
│     React Hooks (useAuth, useSupabase)          │
├─────────────────────────────────────────────────┤
│  AuthService  │  SupabaseService  │  Services   │
│  - Token Mgr  │  - Circuit Breaker│  - ChatGPT  │
│  - Sessions   │  - Retry Manager  │  - Mapbox   │
│  - Events     │  - Metrics        │  - Stripe   │
├─────────────────────────────────────────────────┤
│        Supabase Client (Singleton)              │
├─────────────────────────────────────────────────┤
│             Supabase Cloud + Edge Functions      │
└─────────────────────────────────────────────────┘
```

### Directory Structure
```
/
├── src/
│   ├── components/       # UI components (shadcn/ui)
│   │   ├── ui/          # Base UI primitives
│   │   ├── auth/        # Authentication components
│   │   ├── knowledge/   # Knowledge base & manuals
│   │   ├── marketplace/ # Marketplace features
│   │   ├── trips/       # Trip planning & GPX
│   │   └── vehicle/     # Vehicle management
│   ├── pages/           # Route pages
│   ├── routes/          # Route configurations
│   ├── services/        # Business logic & APIs
│   │   ├── core/        # Auth, Supabase services
│   │   ├── chatgpt/     # Barry AI integration
│   │   └── mapbox/      # Mapping services
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React contexts
│   ├── lib/            # Core libraries
│   ├── utils/          # Helper functions
│   └── config/         # Environment config
├── supabase/
│   ├── migrations/     # Database migrations
│   └── functions/      # Edge Functions (Deno)
├── docs/               # Documentation
├── scripts/           # Build & maintenance scripts
└── public/           # Static assets
```

---

## 💻 Technology Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Context + React Query
- **Forms:** React Hook Form + Zod validation
- **Maps:** Mapbox GL JS
- **PWA:** Service Worker with offline sync
- **Internationalization:** react-i18next

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth with RLS
- **Storage:** Supabase Storage (avatars, vehicles, manuals)
- **Edge Functions:** Deno runtime
- **Payments:** Stripe integration
- **AI:** OpenAI GPT-4 (Barry AI Mechanic)

### Infrastructure
- **Hosting:** Netlify (auto-deploy from GitHub)
- **CDN:** Netlify Edge
- **Monitoring:** Built-in metrics collection
- **Security:** Environment variables, RLS policies, CSP headers

---

## 🔑 Critical Configurations

### Environment Variables (Required)
```bash
# Supabase
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=ydevatqwkoccxhtejdor

# Mapbox
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# OpenAI (for Barry AI)
VITE_OPENAI_API_KEY=sk-your_openai_key_here

# Optional
VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxx
VITE_STRIPE_LIFETIME_PRICE_ID=price_xxx
```

### Supabase MCP Server (Claude Desktop)
- **Location:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Status:** ✅ Configured with service role for full database access
- **Capabilities:** Direct database operations, bypasses RLS

### Security Configurations
- **CSP Headers:** Configured in `netlify.toml`
- **RLS Policies:** Enabled on all tables
- **Auth:** JWT with auto-refresh (5min before expiry)
- **Circuit Breaker:** 5 failure threshold
- **Retry Logic:** Exponential backoff (1s, 2s, 4s, 8s)

---

## 🔄 Git Workflow

### 🚨 CRITICAL: Dual Repository System
```bash
# Production (NEVER push without permission)
origin → https://github.com/Thabonel/unimogcommunityhub.git

# Staging (Push here for testing)
staging → https://github.com/Thabonel/unimogcommunity-staging.git
```

### Development Workflow
```bash
# 1. Work on staging branch
git checkout staging-restore-complete

# 2. Make changes and commit
git add -A
git commit -m "type: description

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# 3. Push to STAGING only
git push staging staging-restore-complete:main

# 4. Test on staging site
# https://unimogcommunity-staging.netlify.app

# 5. ONLY with permission, push to production
git push origin main  # REQUIRES EXPLICIT PERMISSION
```

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

---

## 🛠️ Development Guide

### Setup
```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Start development
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Check for secrets
node scripts/check-secrets.js
```

### Key Development Commands
```bash
# Database operations
npx supabase migration new migration_name
npx supabase db push

# Edge Functions
npx supabase functions serve function_name
npx supabase functions deploy

# Testing
npm run test
npm run test:coverage
```

### Coding Standards
- **TypeScript:** No `any` types
- **Components:** Functional only (no class components)
- **Hooks:** Custom hooks for logic
- **Error Handling:** Never swallow errors
- **Security:** No hardcoded credentials
- **Testing:** Write tests for critical paths

---

## 🎯 Features

### 1. Trip Planning & Navigation
- **GPX Support:** Upload, display, analyze tracks
- **Elevation Profiles:** Terrain analysis
- **OpenRouteService:** Off-road routing
- **Waypoint Management:** Save destinations
- **Offline Maps:** Download for remote areas

### 2. Knowledge Base (Barry AI)
- **45+ Manuals:** Fully processed and searchable
- **GPT-4 Integration:** Technical assistance
- **Vector Search:** Semantic understanding
- **PDF Viewer:** In-browser manual viewing
- **Admin Tools:** Manual chunk management

### 3. Marketplace
- **Parts Trading:** Buy/sell Unimog parts
- **Vehicle Listings:** Complete vehicles
- **Service Providers:** Find mechanics
- **Secure Messaging:** In-app communication
- **Location-Based:** Find items nearby

### 4. Community Features
- **User Profiles:** Showcase your Unimog
- **Vehicle Registry:** Document your fleet
- **Event Calendar:** Rallies and meetups
- **Forums:** Technical discussions
- **Photo Galleries:** Share adventures

### 5. Premium Features (WIS-EPC)
- **Mercedes WIS:** Workshop Information System
- **EPC Access:** Electronic Parts Catalog
- **Remote Access:** Via Apache Guacamole
- **Session Management:** Time-based access
- **Subscription Tiers:** Free/Premium/Lifetime

---

## 📊 Database Schema

### Core Tables
```sql
-- User management
profiles (id, name, email, avatar_url, bio, location)
user_roles (user_id, role)
vehicles (id, user_id, model, year, details)

-- Content
manual_chunks (id, content, embeddings, metadata)
marketplace_listings (id, title, price, seller_id, status)
messages (id, sender_id, recipient_id, content)

-- Trip planning
gpx_tracks (id, user_id, name, track_data)
gpx_waypoints (id, track_id, latitude, longitude)

-- WIS-EPC
wis_servers (id, name, url, status)
wis_sessions (id, user_id, server_id, expires_at)
user_subscriptions (id, user_id, tier, status)
```

### Key Functions
```sql
-- Check admin access
check_admin_access(user_id)

-- Get user tier
get_user_subscription_tier(user_id)

-- Process GPX
process_gpx_upload(file_data)
```

---

## 🔐 Security & Authentication

### Authentication Flow
1. **Supabase Auth:** Email/password or OAuth
2. **JWT Tokens:** Auto-refresh 5min before expiry
3. **Session Persistence:** Encrypted localStorage
4. **RLS Policies:** Row-level security on all tables

### Security Best Practices
```typescript
// NEVER hardcode credentials
❌ const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
✅ const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Always validate input
❌ const query = `SELECT * FROM users WHERE id = ${userId}`
✅ const { data } = await supabase.from('users').select().eq('id', userId)

// Check before operations
✅ const isAdmin = await checkAdminAccess(user.id)
```

### Security Checklist
- [ ] No hardcoded API keys
- [ ] Environment variables set
- [ ] RLS policies enabled
- [ ] Input validation
- [ ] Error messages sanitized
- [ ] CSP headers configured

---

## 🐛 Common Issues & Solutions

### Map Issues
**Problem:** Maps show white screen
```javascript
// Solution: Token retrieval with fallbacks
const token = getMapboxTokenFromAnySource();
// Falls back to: env → localStorage → demo token
```

### Auth Errors
**Problem:** "Invalid API key"
```javascript
// Solution: Never use hardcoded fallbacks
❌ const key = env.KEY || "hardcoded_key"
✅ const key = env.KEY || ""
```

### Database Errors
**Problem:** "relation does not exist"
```sql
-- Check if table exists first
SELECT * FROM information_schema.tables 
WHERE table_name = 'your_table';
```

### Build Errors
**Problem:** Missing environment variables
```bash
# Solution: Create .env file
cp .env.example .env
# Add your keys to .env
```

---

## 📅 Recent Work & Session History

### August 2025 Sessions
1. **2025-08-27:** Fixed CSP headers blocking Mapbox
2. **2025-08-28:** Resolved map token initialization issues
3. **2025-08-23:** Fixed profile flashing issues
4. **2025-08-14:** Completed manual processing system
5. **2025-08-10:** Fixed marketplace UI errors
6. **2025-08-09:** Auth and hero image fixes
7. **2025-08-08:** Multiple backup and recovery sessions
8. **2025-08-05:** Security fixes, removed hardcoded credentials

### January 2025 Architecture Overhaul
- **Stage 1:** Analysis and cleanup (293 duplicates removed)
- **Stage 2:** Core services implementation
- **Stage 3:** Authentication service upgrade
- **Stage 4:** Error handling system
- **Result:** 99.9% uptime, 60% faster response times

---

## 🚨 Emergency Procedures

### Site Down
```bash
# 1. Check Netlify build logs
# 2. Verify environment variables in Netlify
# 3. Check Supabase service status
# 4. Review recent commits
git log --oneline -10
```

### Database Issues
```sql
-- Reset user session
DELETE FROM auth.sessions WHERE user_id = 'user-uuid';

-- Make user admin
INSERT INTO user_roles (user_id, role) 
VALUES ('user-uuid', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Authentication Loop
```javascript
// Clear all auth data
localStorage.clear();
sessionStorage.clear();
window.location.reload();
```

### Quick Rollback
```bash
# Find last working commit
git log --oneline

# Revert to working state
git revert HEAD
git push staging staging-restore-complete:main
```

---

## 📝 Important Notes for Claude Code

### DO's
- ✅ Always push to staging first
- ✅ Use TodoWrite tool for task tracking
- ✅ Check existing schema before DB changes
- ✅ Run security checks before commits
- ✅ Follow existing code patterns
- ✅ Test locally before pushing

### DON'Ts
- ❌ Never push to production without permission
- ❌ Never hardcode credentials
- ❌ Never use mock data in production
- ❌ Never modify Trip Planner maps (working perfectly)
- ❌ Never update git config
- ❌ Never create files unless necessary

### Key Files Never to Modify
- `/src/components/trips/` - Trip Planner (working perfectly)
- `/src/lib/supabase-client.ts` - Core client (stable)
- `/src/services/core/` - Core services (enterprise-grade)

---

## 🔗 Quick Links

### Live Sites
- **Production:** https://unimogcommunityhub.com
- **Staging:** https://unimogcommunity-staging.netlify.app

### Dashboards
- **Netlify:** https://app.netlify.com
- **Supabase:** https://app.supabase.com/project/ydevatqwkoccxhtejdor

### Repositories
- **Production:** https://github.com/Thabonel/unimogcommunityhub
- **Staging:** https://github.com/Thabonel/unimogcommunity-staging

### Documentation
- **Supabase:** https://supabase.com/docs
- **Mapbox:** https://docs.mapbox.com
- **Netlify:** https://docs.netlify.com
- **React:** https://react.dev

---

*This master documentation consolidates all critical project information for efficient AI-assisted development.*