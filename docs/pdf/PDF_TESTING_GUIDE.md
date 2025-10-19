# PDF Viewer Testing Guide

**Last Updated**: October 16, 2025
**Purpose**: Comprehensive testing protocol for all PDF viewers in UnimogCommunityHub

---

## Overview

UnimogCommunityHub uses multiple PDF viewing systems:

1. **SimplePdfScrollViewer** - Barry AI manual citations (react-pdf)
2. **WISPDFViewer** - WIS media carousel (raw pdfjs-dist)
3. **use-pdf-document** - Shared PDF hook (raw pdfjs-dist)

Each system uses different APIs and requires separate testing.

---

## Quick Testing Checklist

Before committing ANY changes to PDF-related files:

```bash
# 1. Check versions match
npm list pdfjs-dist
# Should show: pdfjs-dist@3.11.174 (deduped)

# 2. Test Barry citations
# - Go to /barry-workshop
# - Ask: "how do I replace the radiator"
# - Click any manual citation
# - Verify: PDF loads in right panel
# - Verify: Correct page displayed

# 3. Test WIS media viewer
# - Go to /wis-access
# - Click any media item with PDF
# - Verify: PDF loads in carousel
# - Verify: Zoom, download, navigation work

# 4. Test admin manual processing
# - Go to /admin (as admin)
# - Click Manuals tab
# - Click "View" on any manual
# - Verify: PDF loads

# 5. Check console
# - No "Invalid parameter object" errors
# - No "Failed to fetch dynamically imported module" errors
# - Worker loads from correct CDN URL
```

---

## HIGH RISK FILES

Changes to these files require complete testing:

### React Components
- `src/components/knowledge/SimplePdfScrollViewer.tsx`
- `src/components/wis/WISPDFViewer.tsx`
- `src/components/knowledge/TabbedBarryLayout.tsx`
- `src/components/knowledge/TabbedPdfViewer.tsx`
- `src/components/knowledge/PdfViewer.tsx`

### React Hooks
- `src/hooks/use-pdf-document.ts`
- `src/hooks/use-simple-barry.ts`

### Dependencies
- `package.json` (pdfjs-dist, react-pdf versions)

---

## Detailed Testing Procedures

### Test 1: Barry Manual Citations

**Purpose**: Verify Barry's PDF viewer (SimplePdfScrollViewer) works correctly

**Steps**:
1. Navigate to: https://unimogcommunity-staging.netlify.app/barry-workshop
2. Sign in as verified owner (e.g., thabonel0@gmail.com)
3. Ask Barry: "how do I replace the radiator on a U1700L"
4. Wait for response with manual citations
5. Click first citation link (e.g., "radiator p.3")
6. **Verify**:
   - PDF loads in right panel (70% split)
   - Correct page displayed (matches citation)
   - Can scroll through pages
   - No console errors

**Expected Console Output**:
```
✅ PDF.js worker configured with CDN: https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js
Document loaded successfully (X pages)
```

**Common Failures**:
- "Invalid parameter object" → API signature wrong
- "Failed to fetch module" → Version conflict
- "Cannot read properties of null" → React-pdf misconfigured

---

### Test 2: WIS Media Viewer

**Purpose**: Verify WIS PDF carousel (WISPDFViewer) works correctly

**Steps**:
1. Navigate to: https://unimogcommunity-staging.netlify.app/wis-access
2. Sign in as premium user
3. Scroll to "WIS Media Library" section
4. Click any PDF media item (look for PDF icon)
5. **Verify**:
   - PDF loads in carousel overlay
   - Zoom in/out works
   - Page navigation works
   - Download button works
   - Can close viewer

**Expected Behavior**:
- PDF renders on canvas element
- Controls respond immediately
- No flickering or layout issues

**Common Failures**:
- PDF doesn't load → getDocument() API wrong
- Controls don't work → Canvas not initialized
- Download fails → URL malformed

---

### Test 3: Admin Manual Processing

**Purpose**: Verify admin manual viewer (use-pdf-document hook) works

**Steps**:
1. Navigate to: https://unimogcommunity-staging.netlify.app/admin
2. Sign in as admin (thabonel0@gmail.com)
3. Click "Manuals" tab
4. Click "View" icon on any manual
5. **Verify**:
   - PDF loads in viewer
   - Page navigation works
   - Metadata displays (title, page count)
   - Can print/download

**Expected Behavior**:
- Fast loading (< 2 seconds)
- Accurate page count
- Metadata extracted correctly

---

### Test 4: Multiple Tabs (Barry)

**Purpose**: Verify tabbed PDF viewer (TabbedPdfViewer) handles multiple manuals

**Steps**:
1. In Barry workshop, ask question that references multiple manuals
2. Example: "how do I troubleshoot engine starting issues"
3. Click multiple citation links (different manuals)
4. **Verify**:
   - Each citation opens new tab
   - Tabs show correct manual names
   - Can switch between tabs
   - Each tab shows correct page
   - Can close individual tabs

**Expected Behavior**:
- Smooth tab switching
- No memory leaks (check DevTools Memory)
- PDFs don't reload when switching tabs

---

### Test 5: Version Compatibility

**Purpose**: Ensure pdfjs-dist versions are aligned

**Commands**:
```bash
# Check installed versions
npm list pdfjs-dist

# Expected output:
# ├── pdfjs-dist@3.11.174
# └─┬ react-pdf@7.7.0
#   └── pdfjs-dist@3.11.174 deduped

# If you see multiple versions, run:
npm dedupe
npm list pdfjs-dist  # Verify deduped

# Check for platform-specific packages
npm ls --depth=0 | grep -E "(darwin|linux|win32)"
# Should be empty
```

---

## Automated Testing

### Unit Tests (Future)

Create tests for:
```typescript
describe('SimplePdfScrollViewer', () => {
  it('loads PDF from URL', async () => { ... });
  it('displays correct page number', () => { ... });
  it('handles load errors gracefully', () => { ... });
});

describe('WISPDFViewer', () => {
  it('renders PDF on canvas', () => { ... });
  it('zoom controls work', () => { ... });
  it('downloads PDF correctly', () => { ... });
});
```

### Integration Tests

Use Playwright to test full user flow:
```bash
npm run test:pdf  # Future command
```

---

## Console Logging Guide

### Good Logs (Keep These)

```javascript
✅ console.log('Loading PDF:', url);
✅ console.log(`PDF loaded: ${numPages} pages`);
✅ console.error('PDF loading error:', error);
✅ console.warn('No manual identifier found for reference:', ref);
```

### Bad Logs (Don't Remove)

```javascript
❌ console.log('HERE')  // Debug-only
❌ console.log(error)   // No context
```

### What NOT to Remove

- PDF loading start/end logs (help debug timing)
- Error logs with context (essential for troubleshooting)
- Worker configuration logs (verify correct CDN)
- Version mismatch warnings (catch dependency issues)

---

## Common Issues & Solutions

### Issue 1: "Invalid parameter object: need either .data, .range or .url"

**Cause**: Wrong API signature for pdfjs-dist
**Solution**: Check import method

```typescript
// If using direct import:
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.getDocument({ url });  // Object required

// If using window.pdfjsLib:
const pdfjsLib = (window as any).pdfjsLib;
pdfjsLib.getDocument(url);  // String OK
```

### Issue 2: "Failed to fetch dynamically imported module"

**Cause**: Version conflict between pdfjs-dist versions
**Solution**: Check npm list, downgrade react-pdf if needed
**Reference**: docs/troubleshooting/PDF_VERSION_CONFLICT_FIX.md

### Issue 3: PDF loads but wrong page displayed

**Cause**: Page number calculation mismatch
**Solution**: Check manual_index table for correct pdf_page values

```sql
SELECT title, pdf_page, original_page, storage_url
FROM manual_index
WHERE title LIKE '%radiator%'
LIMIT 10;
```

### Issue 4: Worker fails to load

**Cause**: Incorrect worker CDN URL
**Solution**: Verify worker URL matches pdfjs-dist version

```typescript
// Correct:
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Wrong:
pdfjs.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@5.3.93/build/pdf.worker.min.js';  // Hardcoded version
```

---

## Testing After Deployment

### Staging (ALWAYS test here first)

```bash
# After pushing to staging
git push staging main:main

# Wait 2-3 minutes for build
# Then test: https://unimogcommunity-staging.netlify.app

# Check Netlify build logs
netlify deploy list
```

### Production (WITH PERMISSION ONLY)

```bash
# NEVER push without explicit user permission
git push origin main

# After deployment, immediately test:
# 1. Barry citations
# 2. WIS media viewer
# 3. Admin manuals

# Monitor for 24 hours:
# - Check error rates in console
# - Watch for user reports
# - Review Netlify logs
```

---

## Pre-Commit Checklist

Before committing PDF changes:

- [ ] Ran npm list pdfjs-dist (single version)
- [ ] Tested Barry manual citations
- [ ] Tested WIS media viewer
- [ ] Tested admin manual processing
- [ ] Checked console for errors
- [ ] Verified worker loads correctly
- [ ] Read API compatibility rules
- [ ] Added explanatory commit message
- [ ] Deployed to staging first
- [ ] Got user approval for production

---

## Emergency Rollback

If PDF viewers break in production:

```bash
# 1. Find last working commit
git log --oneline | grep -E "(pdf|PDF|viewer)"

# 2. Revert to that commit
git revert <commit-hash>

# 3. Push to staging
git push staging main:main

# 4. Test thoroughly
# ... run all tests ...

# 5. Get permission for production
# ... wait for user approval ...

# 6. Push to production
git push origin main
```

---

## Contact & Support

**When Tests Fail**:
1. Check this guide first
2. Review docs/troubleshooting/PDF_VERSION_CONFLICT_FIX.md
3. Check git history for similar issues
4. Ask user before making changes

**Key Resources**:
- PDF.js Docs: https://mozilla.github.io/pdf.js/
- react-pdf Docs: https://github.com/wojtekmaj/react-pdf
- Version Compatibility: docs/troubleshooting/PDF_VERSION_CONFLICT_FIX.md

---

**Remember**: PDF viewers are HIGH RISK. When in doubt, DON'T push.
