# Production Deployment Safety Checklist

**STOP**: Before pushing to production, complete this checklist.

## Pre-Flight Checks

### 1. Staging Validation Complete
- [ ] Read and completed **ALL** items in `docs/STAGING_VALIDATION.md`
- [ ] Staging has been live for minimum 24 hours
- [ ] No critical errors reported

### 2. Barry AI Specific Checks
**This is the most critical feature** - test thoroughly:
- [ ] Same query on staging AND production returns identical citations
- [ ] RPS exploded views appear correctly
- [ ] No routing differences between environments
- [ ] Edge function logs show correct mode (manual vs chatgpt)

### 3. Code Quality
- [ ] No console errors in browser
- [ ] No TypeScript errors: `npm run build`
- [ ] No hardcoded secrets: `node scripts/check-secrets.js`
- [ ] No platform-specific dependencies

### 4. Database Safety
- [ ] No pending migrations (or all tested on staging)
- [ ] No RLS policy changes (or verified safe)
- [ ] No storage bucket changes

### 5. Rollback Plan Ready
- [ ] Current production commit documented: ________________
- [ ] Know how to revert if needed
- [ ] Can redeploy staging to production in emergency

## Deployment Command

**Only run this if ALL checks above are complete:**

```bash
git push origin main
```

## Post-Deployment Verification

**Within 5 minutes of deploy:**
- [ ] Production site loads without errors
- [ ] User login works
- [ ] Barry responds to queries
- [ ] RPS citations appear
- [ ] No Supabase function errors

**Within 1 hour:**
- [ ] Monitor for user-reported issues
- [ ] Check Supabase logs for errors
- [ ] Verify no performance degradation

## Emergency Contacts

If production breaks:
1. **Immediate**: Rollback to last good commit
2. **Report**: Document what broke and why
3. **Fix**: Apply fix to staging first, then re-validate

## Sign-Off

I have completed ALL checks above and production deployment is SAFE.

**Signature**: ________________
**Date/Time**: ________________
**Staging Commit**: ________________
**Production Commit (current)**: ________________
