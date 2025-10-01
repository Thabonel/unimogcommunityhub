# Repository Organization Plan

## Current Confusing Structure (TO BE FIXED)
- `unimogcommunityhub` - Production repository
- `unimogcommunity-staging` - Staging repository (CONFUSING NAME)

## Recommended Clear Structure

### Option 1: Single Repository (RECOMMENDED)
**Keep only: `unimogcommunityhub`**
- `main` branch → Production deployment (unimogcommunityhub.netlify.app)
- `staging` branch → Staging deployment (unimogcommunity-staging.netlify.app)
- `development` branch → Development work

**Action:** Delete `unimogcommunity-staging` repository entirely

### Option 2: Dual Repository with Clear Names
**Primary:** `unimogcommunityhub-production` (rename current `unimogcommunityhub`)
**Secondary:** `unimogcommunityhub-staging` (rename current `unimogcommunity-staging`)

## Immediate Actions Required

### 1. Repository Cleanup
```bash
# Option 1: Delete staging repository (RECOMMENDED)
# This forces us to use single repo with branches

# Option 2: Rename for clarity
# Rename unimogcommunity-staging → unimogcommunityhub-staging-env
```

### 2. Update Local Remotes
```bash
# Remove confusing staging remote
git remote remove staging

# Add clear production staging branch workflow
git checkout -b staging
git push origin staging
```

### 3. Update Netlify Deployments
- **Production:** Deploy from `unimogcommunityhub` main branch
- **Staging:** Deploy from `unimogcommunityhub` staging branch

## Benefits of Single Repository
1. **No Sync Issues** - Single source of truth
2. **Clear Branching** - main = production, staging = staging
3. **Simpler Workflow** - All work in one repo
4. **No Name Confusion** - Only one "unimogcommunityhub"

## Workflow After Cleanup
```bash
# Development work
git checkout main
git pull origin main
git checkout -b feature/pdf-fixes
# Make changes
git commit -m "fix: PDF issues"
git push origin feature/pdf-fixes

# Staging deployment
git checkout staging
git merge feature/pdf-fixes
git push origin staging  # Deploys to staging

# Production deployment
git checkout main
git merge staging
git push origin main  # Deploys to production
```

## Emergency Backup Plan
Before any deletions:
1. Create backup of staging repository
2. Export all staging branches
3. Ensure all code is safely in production repository