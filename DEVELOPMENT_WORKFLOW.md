# 🚀 Development Workflow Guide

## Local Testing Without Pushing to Staging

This guide solves the Mac/Linux compatibility issues and enables local testing that matches production.

## 🔧 Setup (One-time)

### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Create Local Environment File
```bash
cp .env.example .env.local
# Edit .env.local with your actual API keys
```

### 3. Link to Netlify Project (Optional)
```bash
netlify link
# Follow prompts to connect to your staging site
```

## 🏗️ Build Commands

### Local Development
```bash
npm run dev                    # Standard Vite dev server
npm run build:netlify         # Test using Netlify CLI (matches production)
npm run test:build           # Full Netlify build simulation
```

### Production Testing
```bash
npm run build:local          # Local build (may fail on Mac due to platform issues)
npm run build                # Netlify-optimized build (production script)
```

## 🔍 Testing Builds Locally

### Option 1: Netlify CLI (Recommended)
```bash
# This simulates the exact Netlify environment
npm run build:netlify

# Or start Netlify dev server
netlify dev
```

### Option 2: Manual Testing
```bash
# Test the Netlify build process locally
netlify build

# Preview the built site
netlify serve
```

## 🚨 Platform Compatibility

### The Problem
- **Mac/Windows**: Uses platform-specific packages (e.g., `@rollup/rollup-darwin-x64`)
- **Netlify (Linux)**: Needs Linux-compatible packages
- **Result**: Local builds may fail, but production builds work

### The Solution
Our new build system automatically:
1. **Detects environment** (local vs Netlify)
2. **Clears platform-specific cache** on Netlify
3. **Uses fresh package resolution** for Linux
4. **Maintains compatibility** across platforms

## 🎯 Recommended Workflow

### For WIS Interface Changes:
```bash
# 1. Make changes locally
npm run dev

# 2. Test with Netlify CLI (matches production exactly)
npm run build:netlify

# 3. If successful, commit and push
git add .
git commit -m "feat: your changes"
git push staging main:main
```

### For Emergency Testing:
```bash
# Quick build test without full environment
netlify build --dry-run

# Test specific routes
netlify dev --open /knowledge/wis
```

## 📋 Troubleshooting

### "Cannot find module @rollup/rollup-darwin-x64"
✅ **Expected on Mac** - use `npm run build:netlify` instead

### "Build works locally but fails on Netlify"
✅ **Use Netlify CLI** - `netlify build` to test exact production environment

### "Environment variables not found"
✅ **Check .env.local** - copy from .env.example and add real keys

## 🔄 Migration from Old Workflow

### Old (Problematic):
```bash
npm run build  # ❌ Fails on Mac
git push staging main:main  # 💸 Costs money, slow feedback
```

### New (Efficient):
```bash
npm run build:netlify  # ✅ Works on Mac, matches production
# Only push when confident
git push staging main:main  # 💰 Saves money, faster development
```

## 🎨 Claude Code Integration

### For AI Assistant (Claude Code):
- **Build command**: `npm run build:netlify`
- **Test command**: `netlify dev`
- **Deploy command**: `git push staging main:main`

### File Naming for Claude Recognition:
- ✅ `DEVELOPMENT_WORKFLOW.md` (this file)
- ✅ `PUSH_TO_STAGING.md` (existing)
- ✅ `CLAUDE.md` (existing instructions)

## 📊 Benefits

| Aspect | Before | After |
|--------|--------|-------|
| Local Testing | ❌ Broken | ✅ Works |
| Platform Issues | ❌ Constant | ✅ Resolved |
| Deploy Frequency | 🔥 Every change | 🎯 Only when ready |
| Development Speed | 🐌 Slow | ⚡ Fast |
| Costs | 💸 High | 💰 Optimized |

---

**🎉 Result**: Develop confidently on Mac, deploy successfully to Linux!