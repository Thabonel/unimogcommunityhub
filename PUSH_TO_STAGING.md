# 🚨 PUSH TO STAGING - MANDATORY CHECKLIST

**READ THIS ENTIRE DOCUMENT BEFORE PUSHING TO STAGING**

This checklist prevents critical deployment failures and platform compatibility issues.

## 🔍 PRE-PUSH VALIDATION CHECKLIST

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
command = "npm install --include=dev && npm run build"
```

**✅ This works because**:
- No platform-specific dependencies in package.json
- package-lock.json is gitignored (fresh resolution on Linux)
- npm automatically chooses Linux-compatible packages

**❌ This would break**:
- Platform-specific packages in dependencies
- Hardcoded macOS/Windows paths
- Committed package-lock.json with Darwin packages

## 🚨 COMMON FAILURE PATTERNS

### 1. EBADPLATFORM Error
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

- [ ] ✅ No platform-specific packages in package.json
- [ ] ✅ Local build completes successfully
- [ ] ✅ No hardcoded paths or secrets in code
- [ ] ✅ package-lock.json is gitignored
- [ ] ✅ node_modules is gitignored
- [ ] ✅ Environment variables are externalized
- [ ] ✅ Cross-platform file operations used

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

*This checklist was created after resolving the @rollup/rollup-darwin-x64 EBADPLATFORM error that prevented Community Document Library deployment.*