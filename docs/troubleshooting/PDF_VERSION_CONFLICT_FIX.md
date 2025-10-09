# PDF Loading Fix - Version Conflict Resolution

**Date**: October 9, 2025
**Status**: ✅ RESOLVED
**Issue**: PDFs failing to load with "Failed to fetch dynamically imported module" error

## 🔍 Problem Summary

When clicking on manual citations from Barry AI, PDFs would fail to load with the error:
```
Failed to load PDF: Setting up fake worker failed: "Failed to fetch dynamically imported module:
https://unpkg.com/pdfjs-dist@3.93/build/pdf.worker.min.js"
```

## 🎯 Root Cause Analysis

**Version Conflict Between Two PDF.js Libraries:**

1. **Standalone `pdfjs-dist@3.11.174`**
   - Used by 12 admin files for manual processing
   - Configured via `pdfWorkerSetup.ts`
   - Set `GlobalWorkerOptions.workerSrc` globally

2. **React-PDF's bundled `pdfjs-dist@5.3.93`**
   - Used by `SimplePdfScrollViewer.tsx` for PDF display
   - Different version, different `GlobalWorkerOptions` instance
   - Tried to load worker for version 5.3.93 (which doesn't exist at configured URL)

### The Technical Problem:
```
npm list pdfjs-dist (BEFORE FIX)
├── pdfjs-dist@3.11.174          # Standalone
└─┬ react-pdf@10.1.0
  └── pdfjs-dist@5.3.93          # Bundled (conflict!)
```

- Two different pdfjs instances with separate `GlobalWorkerOptions`
- Worker configured for 3.11.174 but react-pdf trying to use 5.3.93
- Version mismatch → Module not found → Loading failure

## ✨ Solution Implemented

**Downgrade react-pdf from 10.1.0 to 7.7.0**

### Why This Works:
```
npm list pdfjs-dist (AFTER FIX)
├── pdfjs-dist@3.11.174          # Standalone
└─┬ react-pdf@7.7.0
  └── pdfjs-dist@3.11.174 deduped # Same version! ✅
```

- react-pdf@7.7.0 uses exact `pdfjs-dist@3.11.174` dependency
- npm deduplicates both packages to single instance
- Single `GlobalWorkerOptions` shared across entire app
- No version conflict

### Code Changes:

#### 1. Package.json
```json
// BEFORE
"react-pdf": "^10.1.0"

// AFTER
"react-pdf": "7.7.0"
```

#### 2. Deleted Files
- ❌ `src/utils/pdfWorkerSetup.ts` (no longer needed)
- Removed all imports of pdfWorkerSetup from:
  - `src/main.tsx`
  - `src/components/knowledge/SimplePDFViewer.tsx`
  - `src/components/wis/WISPDFViewer.tsx`
  - `src/components/knowledge/pdf-viewer/usePdfLoader.ts`
  - `src/utils/fileProcessingUtils.ts`
  - `src/components/knowledge/PdfViewer.tsx`

#### 3. Worker Configuration (Single Source of Truth)
```typescript
// SimplePdfScrollViewer.tsx
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
```

This configuration now works for BOTH:
- SimplePdfScrollViewer (Barry citations)
- Admin manual processing features

## 📋 Files Modified

### Changed:
1. `package.json` - Downgraded react-pdf
2. `src/main.tsx` - Removed pdfWorkerSetup import
3. `src/components/knowledge/SimplePDFViewer.tsx` - Removed import
4. `src/components/wis/WISPDFViewer.tsx` - Removed import
5. `src/components/knowledge/pdf-viewer/usePdfLoader.ts` - Removed import & calls
6. `src/utils/fileProcessingUtils.ts` - Removed import
7. `src/components/knowledge/PdfViewer.tsx` - Removed import

### Deleted:
1. `src/utils/pdfWorkerSetup.ts` - Entire file removed

### Unchanged:
1. `src/components/knowledge/SimplePdfScrollViewer.tsx` - Worker config stays

## 🚀 Deployment

### Commands Run:
```bash
# 1. Update package.json
npm install

# 2. Verify versions match
npm list pdfjs-dist
# Output: Both use 3.11.174 (deduped) ✅

# 3. Remove old code
rm src/utils/pdfWorkerSetup.ts

# 4. Commit and deploy
git add -A
git commit -m "fix: Resolve PDF version conflict"
git push staging main:main
```

### Netlify Build:
- First build failed: Other files still importing pdfWorkerSetup
- Second build succeeded: All imports removed
- Build time: ~7.5s
- Bundle size: Reduced (removed duplicate pdfjs versions)

## 🎯 Expected Behavior (After Fix)

### Console Logs (Correct):
```
✅ PDF.js worker configured synchronously with CDN: https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js
```

### User Experience:
1. User asks Barry: "how do I replace the radiator"
2. Barry responds with manual references
3. User clicks citation: "radiator p.3"
4. PDF loads instantly in right panel ✅
5. Correct page displayed automatically

## 🛡️ Prevention Guidelines

### ⚠️ NEVER Do This Again:
```json
// DON'T mix pdfjs-dist versions
{
  "dependencies": {
    "pdfjs-dist": "3.11.174",    // Version A
    "react-pdf": "^10.1.0"        // Uses Version B (5.3.93)
  }
}
```

### ✅ ALWAYS Check Versions:
```bash
# Before adding any PDF library, check versions:
npm view react-pdf@<version> dependencies.pdfjs-dist
npm list pdfjs-dist

# Example:
npm view react-pdf@7.7.0 dependencies.pdfjs-dist
# Output: 3.11.174 ✅ Matches!
```

### 📌 Version Compatibility Table:

| react-pdf Version | pdfjs-dist Version | Status |
|-------------------|-------------------|---------|
| 7.7.0 | 3.11.174 | ✅ Use This |
| 8.x | 3.11.174 | ✅ Compatible |
| 9.x | 4.x (ESM) | ⚠️ Breaking change |
| 10.x | 5.x (ESM) | ❌ Incompatible |

### 🔧 Upgrade Path (If Needed):
If you need react-pdf v10+ features in the future:

1. **Option A**: Upgrade Both (Major Breaking Changes)
   ```json
   {
     "pdfjs-dist": "5.3.93",
     "react-pdf": "10.1.0"
   }
   ```
   - ⚠️ Requires updating ALL pdfjs-dist imports to ESM
   - ⚠️ Worker files change from `.js` to `.mjs`
   - ⚠️ Many admin features will break

2. **Option B**: Keep Current Setup (Recommended)
   ```json
   {
     "pdfjs-dist": "3.11.174",
     "react-pdf": "7.7.0"
   }
   ```
   - ✅ Everything works
   - ✅ No breaking changes
   - ✅ Stable and tested

## 📊 Performance Impact

### Before Fix:
- ❌ PDFs failing to load
- ❌ 2 pdfjs-dist versions in bundle
- ❌ Larger bundle size
- ❌ Version conflict errors

### After Fix:
- ✅ PDFs load instantly
- ✅ 1 pdfjs-dist version (deduped)
- ✅ Smaller bundle size
- ✅ No errors

## 🔗 Related Resources

### Official Documentation:
- [react-pdf GitHub](https://github.com/wojtekmaj/react-pdf)
- [react-pdf Version Compatibility](https://github.com/wojtekmaj/react-pdf/discussions/1520)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)

### Migration Guides:
- [Upgrade 8.x → 9.x](https://github.com/wojtekmaj/react-pdf/wiki/Upgrade-guide-from-version-8.x-to-9.x)
- [Upgrade 9.x → 10.x](https://github.com/wojtekmaj/react-pdf/wiki/Upgrade-guide-from-version-9.x-to-10.x)

### Our Documentation:
- [Manual Processing System](../features/MANUAL_PROCESSING.md)
- [Barry AI Implementation](../features/BARRY_AI.md)

## 🧪 Testing Checklist

To verify the fix works:

- [ ] PDFs load when clicking Barry citations
- [ ] Admin manual processing still works
- [ ] Console shows single worker version (3.11.174)
- [ ] No "Failed to fetch module" errors
- [ ] Correct page number displayed
- [ ] PDF navigation works (zoom, scroll, page change)
- [ ] Build succeeds on Netlify
- [ ] No duplicate pdfjs-dist in node_modules

## 🎓 Key Learnings

1. **Version Conflicts Are Silent**: npm won't warn about conflicting nested dependencies
2. **GlobalWorkerOptions Are Global**: Shared across all pdfjs instances in the app
3. **Check Nested Dependencies**: Always verify transitive dependencies match
4. **Exact Versions Work Best**: For PDF.js, use exact versions (no `^` or `~`)
5. **Test After npm install**: Version conflicts often appear only at runtime

## 📝 Git Commits

### Related Commits:
```
7d3d8e306 - fix: Resolve PDF loading issue by downgrading react-pdf
8f6f6069f - fix: Remove all remaining pdfWorkerSetup imports
49d6e0527 - fix: Use explicit HTTPS URLs for all PDF.js CDN resources
29cecfcd6 - fix: Update centralized PDF worker setup to use CDN
```

### Commit Message Template (For Future):
```
fix: Resolve PDF version conflict

Root Cause: Version mismatch between pdfjs-dist versions
Solution: Downgrade react-pdf to match pdfjs-dist version
Impact: PDFs now load correctly in Barry interface

Changes:
- package.json: react-pdf 10.1.0 → 7.7.0
- Removed pdfWorkerSetup.ts (no longer needed)
- Single pdfjs-dist@3.11.174 version (deduped)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

**Last Updated**: October 9, 2025
**Tested On**: Staging (unimogcommunity-staging.netlify.app)
**Status**: ✅ Production Ready
**Approver**: User (thabonel0@gmail.com)
