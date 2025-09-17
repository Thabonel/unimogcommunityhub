# 🚨 PUSH TO STAGING - MANDATORY CHECKLIST

**READ THIS ENTIRE DOCUMENT BEFORE PUSHING TO STAGING**

This checklist prevents critical deployment failures, platform compatibility issues, and build tool availability problems.

## 🔥 RECENT CRITICAL FIXES (December 2024)

### ⚠️ NEW: DevDependencies Build Failure (SOLVED)

**Issue**: `vite: not found` errors during Netlify builds
**Root Cause**: `npm ci` skips devDependencies by default, but Vite is needed for builds
**Solution**: Updated netlify.toml with `npm ci --include=dev`

**Current Working Configuration**:
```toml
# netlify.toml
command = "npm ci --include=dev && npm run build"
```

**Why This Matters**: Build tools (Vite, Rollup, TypeScript) are in devDependencies but MUST be available during CI builds.

## 🔍 PRE-PUSH VALIDATION CHECKLIST

### ✅ 0. BUILD TOOLS DEPENDENCY CHECK (NEW - CRITICAL)

**Verify Vite and build tools are available**:
```bash
# Check Vite is in devDependencies (REQUIRED)
grep '"vite":' package.json || echo "❌ CRITICAL: Vite missing from devDependencies"

# Verify netlify.toml includes dev dependencies
grep "npm ci --include=dev" netlify.toml || echo "❌ CRITICAL: Missing --include=dev in netlify.toml"

# Test local build works (catches 90% of deployment issues)
npm run build || echo "❌ CRITICAL: Local build failed - DO NOT PUSH"
```

**Critical Build Tools Required**:
- `vite` - Main build tool
- `@vitejs/plugin-react` - React support
- `autoprefixer` - CSS processing
- `tailwindcss` - Styling

**❌ NEVER**: Move these to production dependencies (increases bundle size)
**✅ ALWAYS**: Ensure `--include=dev` in netlify.toml so they're available during CI builds

### ✅ 1. PLATFORM-SPECIFIC DEPENDENCIES CHECK

**CRITICAL**: Never add platform-specific packages to package.json

```bash
# Check for platform-specific packages that will break cross-platform builds
grep -E "@rollup/rollup-(darwin|linux|win32)" package.json
grep -E "(darwin|linux|win32|x64|arm64)" package.json
```

**❌ FORBIDDEN PACKAGES** (These will cause EBADPLATFORM errors):
- `@rollup/rollup-darwin-x64`
- `@rollup/rollup-linux-x64`
- `@rollup/rollup-win32-x64`
- Any package with platform-specific suffixes

**✅ WHY**: Netlify runs on Linux, localhost might be macOS/Windows. Platform-specific packages cause build failures.

### ✅ 2. PACKAGE.JSON VALIDATION

```bash
# Check devDependencies for suspicious platform-specific entries
cat package.json | jq '.devDependencies | keys[]' | grep -E "(darwin|linux|win32)"

# Verify no hardcoded platform dependencies
npm ls --depth=0 | grep -E "(darwin|linux|win32)"
```

### ✅ 3. BUILD VALIDATION

```bash
# Test build locally BEFORE pushing
npm run build

# Verify build completes without platform errors
echo "Build status: $?"
```

**Expected**: Build should complete with exit code 0, only show environment variable warnings (normal for localhost).

### ✅ 4. GITIGNORE COMPLIANCE

```bash
# Verify package-lock.json is properly gitignored (prevents platform lock-in)
git check-ignore package-lock.json
echo "Should output: package-lock.json"

# Check no platform-specific files are staged
git diff --cached --name-only | grep -E "\.(node|dll|dylib|so)$"
```

### ✅ 5. CROSS-PLATFORM FILE PATHS

```bash
# Check for hardcoded paths that break on different platforms
grep -r "C:\\" src/
grep -r "/Users/" src/
grep -r "\\\\$" src/
```

**❌ AVOID**:
- `C:\\Users\\path\\to\\file`
- `/Users/username/hardcoded/path`
- Windows-style backslashes in code

### ✅ 6. ENVIRONMENT VARIABLES

```bash
# Verify no hardcoded secrets or environment-specific values
grep -r "ydevatqwkoccxhtejdor" src/ || echo "✅ No hardcoded Supabase URLs"
grep -r "sk-ant-" src/ || echo "✅ No hardcoded API keys"
grep -r "localhost:3000" src/ || echo "✅ No hardcoded localhost URLs"
```

### ✅ 7. NODE MODULES & CACHE

```bash
# Verify node_modules is gitignored (prevents platform-specific binaries)
du -sh node_modules/ 2>/dev/null && echo "⚠️ WARNING: node_modules exists locally"
git check-ignore node_modules || echo "❌ ERROR: node_modules not gitignored!"
```

## 🛠️ NETLIFY BUILD COMPATIBILITY

### Current Build Configuration:
```toml
# netlify.toml
command = "npm ci --include=dev && npm run build"
```

**✅ This works because**:
- `--include=dev` installs build tools (Vite, Rollup, TypeScript) needed for compilation
- `npm ci` is faster and more reliable than `npm install` for CI environments
- No platform-specific dependencies in package.json
- package-lock.json is gitignored (fresh resolution on Linux)
- npm automatically chooses Linux-compatible packages

**❌ This would break**:
- Platform-specific packages in dependencies
- Hardcoded macOS/Windows paths
- Committed package-lock.json with Darwin packages

## 🚨 COMMON FAILURE PATTERNS

### 1. Build Tool Not Found (NEW - Most Common)
```
sh: 1: vite: not found
Build script returned non-zero exit code: 2
```
**Cause**: devDependencies not installed during CI build
**Fix**: Ensure `npm ci --include=dev` in netlify.toml

### 2. EBADPLATFORM Error
```
npm error notsup Unsupported platform for @rollup/rollup-darwin-x64
```
**Cause**: Platform-specific package in devDependencies
**Fix**: Remove platform-specific packages, let tools auto-detect

### 2. Path Resolution Errors
```
Error: ENOENT: no such file or directory, open 'C:\Windows\...'
```
**Cause**: Windows hardcoded paths on Linux
**Fix**: Use path.join() and relative paths

### 3. Binary Compatibility
```
Error: /lib64/libc.so.6: version 'GLIBC_2.28' not found
```
**Cause**: Platform-specific binaries committed
**Fix**: Ensure node_modules is gitignored

## ✅ FINAL PUSH CHECKLIST

Before running `git push staging main:main`:

- [ ] ✅ **CRITICAL**: Vite is in devDependencies (`grep '"vite":' package.json`)
- [ ] ✅ **CRITICAL**: netlify.toml has `--include=dev` (`grep "npm ci --include=dev" netlify.toml`)
- [ ] ✅ **CRITICAL**: Local build completes successfully (`npm run build`)
- [ ] ✅ No platform-specific packages in package.json
- [ ] ✅ No hardcoded paths or secrets in code
- [ ] ✅ package-lock.json is gitignored
- [ ] ✅ node_modules is gitignored
- [ ] ✅ Environment variables are externalized
- [ ] ✅ Cross-platform file operations used

**New Priority**: Build tool availability checks are now CRITICAL and should be done first.

## 🔧 QUICK FIX COMMANDS

If you find platform-specific packages:

```bash
# Remove platform-specific rollup packages
npm uninstall @rollup/rollup-darwin-x64 @rollup/rollup-linux-x64 @rollup/rollup-win32-x64

# Clean npm cache to remove platform artifacts
npm cache clean --force

# Verify clean package.json
cat package.json | jq '.devDependencies | keys[]' | grep rollup
```

## 📚 REFERENCE

**Platform-Specific Package Detection**:
```bash
# One-liner to check for problematic packages
npm ls --depth=0 | grep -E "(darwin|linux|win32|x64|arm64)" && echo "❌ PLATFORM-SPECIFIC PACKAGES FOUND" || echo "✅ No platform-specific packages"
```

**Emergency Rollback**:
```bash
# If staging build fails, check the last working commit
git log --oneline -5
# Reset to last working version if needed
git reset --hard <working-commit-hash>
```

---

## 🎯 REMEMBER

**The Golden Rule**: If it works on your local machine but fails on Netlify, it's almost always a platform compatibility issue.

**Most Common Cause**: Platform-specific packages accidentally added to package.json

**Prevention**: Always check package.json before committing, especially after `npm install` commands.

---

## 📚 DEPLOYMENT FAILURE HISTORY & RESOLUTIONS

### December 17, 2024 - Vite Build Tool Failure
**Multiple commit attempts**: 6f5a18425, 437412233, cc88be043, 6d068619b
**Final resolution**: 079c5a2a1

**Timeline of Failed Attempts**:
1. **cc88be043**: Tried removing `--omit=optional` - Failed (Vite still not found)
2. **437412233**: Tried using npx vite instead of direct binary - Failed (npx not available)
3. **6f5a18425**: Tried npm script resolution with `build:vite` - Failed (Vite still not installed)
4. **079c5a2a1**: ✅ **SUCCESS** - Added `--include=dev` to netlify.toml

**Root Cause Analysis**:
- `npm ci` in production mode (NODE_ENV=production) skips devDependencies by default
- Vite, being a build tool, was correctly placed in devDependencies
- CI environment needed build tools but couldn't access them
- Previous attempts fixed symptoms, not the core dependency installation issue

**Key Learning**:
- **Production CI ≠ Production Runtime**: CI builds need devDependencies even in "production" mode
- Always verify dependency availability before attempting script fixes
- `npm ci --include=dev` is the correct solution for build tools in CI

**Command Progression**:
```bash
# ❌ What was failing:
npm ci && npm run build  # Skipped devDependencies

# ✅ What works:
npm ci --include=dev && npm run build  # Includes build tools
```

### Historical Issues
*This checklist was originally created after resolving the @rollup/rollup-darwin-x64 EBADPLATFORM error that prevented Community Document Library deployment.*