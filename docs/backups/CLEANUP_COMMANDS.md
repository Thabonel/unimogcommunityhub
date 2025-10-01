# Repository Cleanup Commands

## Option A: Delete Staging Repository (RECOMMENDED)

### Benefits
- Single source of truth
- No sync confusion
- Standard Git workflow with branches
- Clear main → production, staging → staging

### Commands to Execute
```bash
# 1. Remove staging remote from local repo
git remote remove staging

# 2. Create staging branch in production repo
git checkout -b staging
git push origin staging

# 3. Update Netlify to deploy staging from production repo staging branch

# 4. DELETE the confusing staging repository on GitHub
# This requires GitHub web interface or API call
```

## Option B: Rename Repositories for Clarity

### New Names
- `unimogcommunityhub` → `unimogcommunityhub-production`
- `unimogcommunity-staging` → `unimogcommunityhub-staging`

### Commands to Execute
```bash
# These require GitHub API calls to rename repositories
# Cannot be done via git commands
```

## Option C: Keep Current but Add Clear Documentation

### Add Clear README to Each Repo
- Production repo: "THIS IS PRODUCTION - DO NOT EXPERIMENT"
- Staging repo: "THIS IS STAGING - SAFE TO TEST"

## RECOMMENDED: Execute Option A

1. **Immediate Action:** Remove staging remote
```bash
git remote remove staging
```

2. **Create staging branch in production repo:**
```bash
git checkout -b staging
git push origin staging
```

3. **Update Netlify deployments:**
   - Production: unimogcommunityhub/main
   - Staging: unimogcommunityhub/staging

4. **Delete GitHub staging repository via web interface**

This eliminates all confusion permanently.