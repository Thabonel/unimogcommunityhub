# Knip Dead Code Cleanup Plan

**Start Date**: January 10, 2025
**Status**: ⏳ 2-WEEK WAITING PERIOD (Data Collection Phase)
**End Date**: January 24, 2025

## Phase 1: Initial Setup ✅ COMPLETE

**Completed**: January 10, 2025

- ✅ Installed Knip 5.64.2
- ✅ Created `knip.json` configuration
- ✅ Added npm scripts: `knip`, `knip:production`, `knip:dependencies`, `knip:exports`
- ✅ Ran initial analysis
- ✅ Fixed native binding issues (@oxc-resolver, @rollup)
- ✅ Baseline established: **888 unused files detected**

## Phase 2: Production Monitoring (2 Weeks) ⏳ IN PROGRESS

**Duration**: January 10 - January 24, 2025

### What We're Monitoring
- User interactions with features
- API endpoint usage
- Component render frequency
- File access patterns in production

### Usage Tracking Points
Analytics are already instrumented throughout the platform:
- ✅ Page views and navigation
- ✅ Feature interactions (Barry AI, Maps, Marketplace, etc.)
- ✅ User actions (posts, comments, listings)
- ✅ API calls and Edge Functions

**Note**: Usage analytics already exist in `/src/contexts/AnalyticsContext.tsx`

### Critical: DO NOT DELETE DURING THIS PERIOD
❌ Do not remove any files
❌ Do not modify Knip configuration
✅ Just collect production usage data
✅ Note any files users actually interact with

## Phase 3: Analysis & Cross-Reference (After 2 Weeks)

**Scheduled**: January 24 - 26, 2025

### Combine Two Data Sources
1. **Knip Static Analysis** → Files that CAN'T be reached in code
2. **Production Usage Data** → Files that AREN'T being used by real users

### Safety Rules
- ✅ File in Knip report + Not in analytics = **SAFE TO DELETE**
- ⚠️ File in Knip report + IS in analytics = **KEEP (false positive)**
- ⚠️ File not imported but loaded dynamically = **KEEP (lazy loaded)**

## Phase 4: Micro-Batch Deletion (After Analysis)

**Scheduled**: January 27+, 2025

### Deletion Strategy
1. Delete **5 files maximum** per batch
2. Run `npm run build` after each batch
3. Test on staging thoroughly
4. Deploy to production
5. Monitor for 24 hours before next batch
6. Repeat until complete

### Batch Deletion Checklist
```bash
# 1. Create backup branch
git checkout -b cleanup-batch-N

# 2. Delete 5 files max
rm file1.tsx file2.tsx file3.tsx file4.tsx file5.tsx

# 3. Verify build works
npm run build

# 4. Commit changes
git add -A
git commit -m "cleanup: Remove batch N of unused files"

# 5. Push to staging
git push staging cleanup-batch-N:main

# 6. Test on staging
# - Check all core features work
# - Check deleted features truly aren't used
# - Verify no console errors

# 7. Wait 24 hours, monitor production

# 8. If all clear, proceed to next batch
```

## Initial Knip Findings (888 Unused Files)

### File Categories Found
- **Duplicate Files**: `*  2.tsx`, `* 2.ts` suffix files (likely old versions)
- **Test Mocks**: `src/__tests__/mocks/` (may need to keep for testing)
- **Deprecated Components**: Many duplicates in admin, community, knowledge
- **Legacy PDFs**: Unused PDF viewer components
- **Old Layouts**: Superseded admin layouts

### High-Priority Cleanup Targets (After 2 Weeks)
1. **Duplicate files with " 2" suffix** (~200 files)
2. **Old admin components** (superseded by new versions)
3. **Unused marketplace components**
4. **Legacy map components**
5. **Deprecated auth components**

## Risk Mitigation

### Before Deleting ANY File
- ✅ Verify it's in Knip report
- ✅ Verify it's NOT in production analytics
- ✅ Search codebase for dynamic imports
- ✅ Check for lazy loading patterns
- ✅ Grep for string-based component references

### Emergency Rollback Plan
```bash
# If something breaks:
git revert HEAD
git push staging main:main
# Deploy immediately to restore functionality
```

## Success Metrics

### Expected Outcomes (After Completion)
- **Bundle size reduction**: Target 20-30% smaller
- **Build time improvement**: Target 15-20% faster
- **Faster development**: Less confusion from duplicates
- **Easier maintenance**: Clearer codebase structure

### DO NOT Measure Success By
- ❌ Number of files deleted (quality > quantity)
- ❌ Speed of deletion (safety > speed)
- ❌ Lines of code removed (functionality preservation is key)

## Commands Reference

```bash
# Run full Knip analysis
npm run knip

# Check only production dependencies
npm run knip:production

# Check only npm dependencies
npm run knip:dependencies

# Check only exports
npm run knip:exports

# Save results to file
npm run knip > docs/cleanup/knip-results-$(date +%Y%m%d).txt
```

## Important Reminders

1. **Wait the full 2 weeks** - Don't rush this
2. **Check production analytics** before deleting
3. **Delete in small batches** (5 files max)
4. **Test thoroughly** after each batch
5. **Monitor production** for 24h after each deploy
6. **Document what you delete** in git commits

## Next Steps

### NOW (January 10, 2025)
✅ Knip installed and configured
✅ Baseline analysis complete
✅ Monitoring period started

### JANUARY 24, 2025
- [ ] Run Knip analysis again
- [ ] Export production analytics data
- [ ] Cross-reference Knip + Analytics
- [ ] Create deletion priority list
- [ ] Plan micro-batch deletion schedule

### JANUARY 27+, 2025
- [ ] Start micro-batch deletion
- [ ] Delete 5 files, test, deploy, monitor
- [ ] Repeat until cleanup complete

---

**Remember**: The goal is a cleaner codebase, not maximum file deletion. If in doubt, keep the file. False negatives (keeping unused code) are better than false positives (deleting used code).
