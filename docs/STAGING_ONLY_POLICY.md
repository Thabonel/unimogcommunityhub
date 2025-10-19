# Staging-Only Files Policy

## Overview
Some files/features are intentionally kept in staging environment only and blocked from production deployment. This allows for development work, testing, and experimental features without affecting live users.

## How It Works

### 1. Staging-Only Marker File
File: `.staging-only`

This file lists all paths that should NEVER be pushed to production. The pre-push git hook reads this file and blocks production deployment if any of these files are modified.

### 2. Pre-Push Hook Enforcement
Location: `.git/hooks/pre-push`

When pushing to `origin main` (production), the hook automatically:
- Reads `.staging-only` file
- Checks if any modified files match the staging-only list
- BLOCKS the push if staging-only files are detected
- Shows which files need to be removed/reverted

### 3. Staging Deployment
Pushing to `staging main:main` is NOT affected by this policy. All files (including staging-only) can be deployed to staging freely.

## Current Staging-Only Files

### RPS Phase 8 - OCR Development
**Status**: Work in Progress - NOT production ready

**Files**:
- `src/components/admin/RPSOCRProcessor.tsx` - Admin UI for batch OCR
- `supabase/functions/process-rps-ocr/` - Edge function for OCR processing

**Reason**: Phase 8 OCR is experimental and resource-intensive. It needs extensive testing in staging before production deployment.

### RPS Development Scripts
**Status**: Development/Testing tools only

**Files**:
- `scripts/rps/batch-ocr-*.{sh,ts,js}` - Batch OCR processing scripts
- `scripts/rps/run-ocr-*.sh` - OCR runner scripts
- `scripts/rps/ocr-parts-lists.ts` - Parts list OCR processor
- `scripts/rps/resilient-batch-ocr-*.js` - Resilient OCR scripts
- `scripts/rps/simple-batch-ocr.js` - Simple OCR script

**Reason**: These are development utilities for data processing, not user-facing features. They contain hardcoded paths, test data, and may have credentials.

## Adding New Staging-Only Files

1. Edit `.staging-only` file
2. Add file path or directory pattern
3. Add comment explaining why it's staging-only
4. Commit to staging: `git push staging main:main`
5. Test that production push is blocked

## Removing Staging-Only Restriction

When a feature is production-ready:

1. Remove entry from `.staging-only`
2. Review the files for production readiness:
   - No hardcoded credentials
   - No debug code
   - Proper error handling
   - User-facing polish
3. Test in staging thoroughly
4. Get explicit approval for production push
5. Push to production: `git push origin main`

## Emergency Override

If you MUST push to production despite staging-only files:

```bash
# Remove the files from staging temporarily
git rm --cached src/components/admin/RPSOCRProcessor.tsx
git commit -m "temp: remove staging-only files for production push"
git push origin main

# Restore them in staging
git revert HEAD
git push staging main:main
```

Better approach: Use feature flags or environment detection instead.

## Safety Checks

The pre-push hook performs these checks:

1. ✅ Reads `.staging-only` file
2. ✅ Gets list of modified files in commit
3. ✅ Checks if any modified files match staging-only patterns
4. ✅ Blocks push if matches found
5. ✅ Shows clear error message with file list

## Example Hook Output

```
🚨 STAGING-ONLY FILES DETECTED IN PRODUCTION PUSH
================================================
The following staging-only files cannot be pushed to production:

  - src/components/admin/RPSOCRProcessor.tsx
  - scripts/rps/batch-ocr-local.ts

These files are marked as staging-only in .staging-only

To proceed:
1. Revert changes to these files
2. Remove them from the commit
3. Or update .staging-only if they're production-ready

Use 'git push staging main:main' to deploy to staging instead.
================================================
❌ Production deployment blocked.
```

## Related Documentation

- `CLAUDE.md` - Git workflow and push restrictions
- `docs/GIT_WORKFLOW.md` - Detailed git procedures
- `PUSH_TO_MAIN.md` - Production deployment checklist
- `.git/hooks/pre-push` - Enforcement hook

## Maintenance

Review `.staging-only` file monthly:
- Remove entries for features now in production
- Update comments with current status
- Add new experimental work
- Clean up obsolete entries
