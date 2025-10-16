# PDF.js API Reference for UnimogCommunityHub

**Last Updated**: October 16, 2025
**Purpose**: Definitive guide for correct PDF.js API usage across all viewers

---

## Table of Contents

1. [Overview](#overview)
2. [Library Versions](#library-versions)
3. [API Patterns](#api-patterns)
4. [Component Reference](#component-reference)
5. [Common Mistakes](#common-mistakes)
6. [Worker Configuration](#worker-configuration)
7. [Migration Guide](#migration-guide)

---

## Overview

UnimogCommunityHub uses two PDF.js implementations:

| Library | Version | Used By | Import Method |
|---------|---------|---------|---------------|
| **pdfjs-dist** | 3.11.174 | WISPDFViewer, use-pdf-document | Direct import |
| **react-pdf** | 7.7.0 | SimplePdfScrollViewer (Barry) | Wrapper library |

**Key Insight**: react-pdf internally uses pdfjs-dist@3.11.174 (deduped), so we have ONE version across entire app.

---

## Library Versions

### Current Setup (Production)

```json
{
  "dependencies": {
    "pdfjs-dist": "^3.11.174",
    "react-pdf": "7.7.0"
  }
}
```

**Verification**:
```bash
npm list pdfjs-dist
# ├── pdfjs-dist@3.11.174
# └─┬ react-pdf@7.7.0
#   └── pdfjs-dist@3.11.174 deduped ✅
```

### Version Compatibility Table

| react-pdf | pdfjs-dist | Status | Notes |
|-----------|------------|--------|-------|
| 7.7.0 | 3.11.174 | ✅ Current | Tested, stable |
| 8.x | 3.11.174 | ✅ Compatible | Safe upgrade |
| 9.x | 4.x (ESM) | ⚠️ Breaking | ESM migration required |
| 10.x | 5.x (ESM) | ❌ Incompatible | Major breaking changes |

**Reference**: docs/troubleshooting/PDF_VERSION_CONFLICT_FIX.md

---

## API Patterns

### Pattern 1: react-pdf (Recommended for New Code)

**Used By**: SimplePdfScrollViewer (Barry citations)

```typescript
import { Document, Page, pdfjs } from 'react-pdf';

// Configure worker ONCE (usually in component)
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Usage
<Document
  file={{
    url: pdfUrl,
    httpHeaders: {},
    withCredentials: false
  }}
  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
  onLoadError={(error) => console.error('PDF load error:', error)}
>
  <Page pageNumber={currentPage} />
</Document>
```

**Pros**:
- Clean React API
- Automatic canvas management
- Built-in error handling
- Type-safe props

**Cons**:
- Less control over rendering
- Depends on react-pdf updates

---

### Pattern 2: Direct pdfjs-dist Import

**Used By**: WISPDFViewer (WIS media), use-pdf-document (admin)

```typescript
import * as pdfjsLib from 'pdfjs-dist';

// Load PDF
const loadPDF = async (url: string) => {
  try {
    // CORRECT: Pass object with url property
    const loadingTask = pdfjsLib.getDocument({ url });
    const pdf = await loadingTask.promise;

    setPdfDoc(pdf);
    setNumPages(pdf.numPages);

    // Render page
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;

  } catch (error) {
    console.error('PDF loading error:', error);
  }
};
```

**Pros**:
- Full control over rendering
- Direct access to PDF.js features
- No wrapper overhead

**Cons**:
- Manual canvas management
- More verbose code
- Must handle edge cases

---

### Pattern 3: window.pdfjsLib (Legacy, Avoid)

**Status**: Deprecated, but some old code may use this

```typescript
const loadPDF = async () => {
  const pdfjsLib = (window as any).pdfjsLib;

  if (!pdfjsLib) {
    // Fallback: load PDF.js from CDN
    const script = document.createElement('script');
    script.src = '/pdf.min.js';
    script.onload = () => loadPDF();
    document.head.appendChild(script);
    return;
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

  // CORRECT for window.pdfjsLib: Pass string directly
  const loadingTask = pdfjsLib.getDocument(url);  // String OK
  const pdf = await loadingTask.promise;
};
```

**Why Avoid**:
- Dynamic script loading (slower)
- No TypeScript types
- Harder to maintain
- Potential race conditions

---

## Component Reference

### SimplePdfScrollViewer.tsx

**Location**: `src/components/knowledge/SimplePdfScrollViewer.tsx`
**Purpose**: Display PDFs in Barry's tabbed interface
**Library**: react-pdf

#### Props

```typescript
interface SimplePdfScrollViewerProps {
  pdfUrl: string;           // Full Supabase storage URL
  initialPage?: number;     // Page to display (1-indexed)
}
```

#### API Usage

```typescript
import { Document, Page, pdfjs } from 'react-pdf';

// Worker config (in component)
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Render
<Document
  file={{
    url: pdfUrl,
    httpHeaders: {},
    withCredentials: false
  }}
  onLoadSuccess={onDocumentLoadSuccess}
  onLoadError={onDocumentLoadError}
>
  {Array.from(new Array(numPages), (el, index) => (
    <Page
      key={`page_${index + 1}`}
      pageNumber={index + 1}
      width={containerWidth}
    />
  ))}
</Document>
```

#### Key Features

- Vertical scrolling (all pages)
- Auto-width calculation
- Error boundaries
- Loading states

---

### WISPDFViewer.tsx

**Location**: `src/components/wis/WISPDFViewer.tsx`
**Purpose**: Display WIS media PDFs in carousel
**Library**: pdfjs-dist (direct import)

#### Props

```typescript
interface WISPDFViewerProps {
  url: string;
  title?: string;
  description?: string;
  className?: string;
  height?: string | number;
}
```

#### API Usage

```typescript
import * as pdfjsLib from 'pdfjs-dist';

const loadPDF = async () => {
  try {
    console.log('Loading PDF:', url);

    // CORRECT: Object with url property
    const loadingTask = pdfjsLib.getDocument({ url });
    const pdf = await loadingTask.promise;

    setPdfDoc(pdf);
    setNumPages(pdf.numPages);

    console.log(`PDF loaded: ${pdf.numPages} pages`);

    renderPage(pdf, 1);
  } catch (err) {
    console.error('PDF loading error:', err);
    setError('Failed to load PDF document');
  }
};

const renderPage = async (pdf: any, pageNumber: number) => {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;
};
```

#### Key Features

- Single page rendering
- Zoom controls (0.5x - 3.0x)
- Page navigation
- Download/fullscreen
- Canvas-based rendering

---

### use-pdf-document.ts

**Location**: `src/hooks/use-pdf-document.ts`
**Purpose**: Shared PDF loading hook for admin features
**Library**: pdfjs-dist (direct import)

#### Interface

```typescript
interface UsePdfDocumentProps {
  url: string;
}

interface UsePdfDocumentResult {
  pdfDoc: any | null;
  numPages: number;
  isLoading: boolean;
  documentTitle: string;
  printRange: { from: number; to: number };
  setPrintRange: React.Dispatch<React.SetStateAction<{ from: number; to: number }>>;
}
```

#### API Usage

```typescript
import * as pdfjsLib from 'pdfjs-dist';

const loadPdf = async () => {
  try {
    setIsLoading(true);

    // CORRECT: Object with url property
    const loadingTask = pdfjsLib.getDocument({ url });
    const pdf = await loadingTask.promise;

    setPdfDoc(pdf);
    setNumPages(pdf.numPages);
    setPrintRange({ from: 1, to: pdf.numPages });

    // Extract metadata
    const metadata = await pdf.getMetadata() as PdfMetadata;
    if (metadata?.info?.Title) {
      setDocumentTitle(metadata.info.Title);
    } else {
      // Fallback to filename
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1].split('?')[0];
      setDocumentTitle(decodeURIComponent(fileName));
    }
  } catch (error) {
    console.error('Error loading PDF:', error);
    toast({
      title: 'Error',
      description: 'Failed to load PDF document',
      variant: 'destructive'
    });
  } finally {
    setIsLoading(false);
  }
};

// Cleanup
return () => {
  if (pdfDoc) {
    pdfDoc.destroy();
  }
};
```

#### Key Features

- Metadata extraction
- Print range management
- Automatic cleanup
- Error handling with toast

---

## Common Mistakes

### Mistake 1: Wrong API Signature with Direct Import

```typescript
// ❌ WRONG
import * as pdfjsLib from 'pdfjs-dist';
const loadingTask = pdfjsLib.getDocument(url);  // String - ERROR!

// ✅ CORRECT
import * as pdfjsLib from 'pdfjs-dist';
const loadingTask = pdfjsLib.getDocument({ url });  // Object - OK!
```

**Why**: Direct import from pdfjs-dist requires object parameter.

---

### Mistake 2: Mixing Import Methods

```typescript
// ❌ WRONG - Mixing import styles
import * as pdfjsLib from 'pdfjs-dist';
const pdfjsFromWindow = (window as any).pdfjsLib;
// Now you have TWO instances with separate GlobalWorkerOptions!

// ✅ CORRECT - Pick one method
import * as pdfjsLib from 'pdfjs-dist';
// Use pdfjsLib everywhere
```

---

### Mistake 3: Hardcoded Worker URLs

```typescript
// ❌ WRONG - Hardcoded version
pdfjs.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

// ✅ CORRECT - Dynamic version
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
```

**Why**: Hardcoded versions break when dependencies update.

---

### Mistake 4: Version Mismatches

```typescript
// ❌ WRONG - Different versions
{
  "pdfjs-dist": "3.11.174",
  "react-pdf": "^10.1.0"  // Uses pdfjs-dist@5.3.93 internally!
}

// ✅ CORRECT - Matching versions
{
  "pdfjs-dist": "^3.11.174",
  "react-pdf": "7.7.0"  // Uses pdfjs-dist@3.11.174 internally
}
```

---

### Mistake 5: Missing Worker Configuration

```typescript
// ❌ WRONG - No worker configured
import { Document, Page } from 'react-pdf';
<Document file={{ url: pdfUrl }} />  // Will fail!

// ✅ CORRECT - Configure worker first
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
<Document file={{ url: pdfUrl }} />
```

---

## Worker Configuration

### Global Worker Setup

Worker MUST be configured before any PDF loading. Do this ONCE per app:

#### Option 1: In Component (Current Approach)

```typescript
// src/components/knowledge/SimplePdfScrollViewer.tsx
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
```

**Pros**: Explicit, easy to find
**Cons**: Runs every time component mounts (harmless)

#### Option 2: In Main Entry (Alternative)

```typescript
// src/main.tsx
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
```

**Pros**: Runs once at app start
**Cons**: Hidden in main.tsx

### Worker URL Format

```typescript
// ✅ CORRECT - CDN with dynamic version
`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

// ✅ CORRECT - Local worker (if using vite-plugin-static-copy)
'/pdf.worker.min.js'

// ❌ WRONG - Hardcoded version
'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

// ❌ WRONG - ESM worker (not supported in our version)
'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.mjs'
```

---

## Migration Guide

### Upgrading pdfjs-dist

**Before upgrading, CHECK**:
```bash
# Check if react-pdf supports the new version
npm view react-pdf@<current-version> dependencies.pdfjs-dist

# Example:
npm view react-pdf@7.7.0 dependencies.pdfjs-dist
# Output: 3.11.174 ✅
```

**Safe Upgrade Path**:
1. Check react-pdf compatibility
2. Update package.json
3. Run npm install
4. Verify: npm list pdfjs-dist (should be deduped)
5. Test ALL PDF viewers
6. Deploy to staging
7. Monitor for 24h
8. Get user approval
9. Deploy to production

**Breaking Changes to Watch**:
- 3.x → 4.x: ESM modules introduced
- 4.x → 5.x: Full ESM, worker files change to .mjs
- API signature changes (rare but possible)

### Upgrading react-pdf

**Before upgrading, READ**:
- Migration guides: https://github.com/wojtekmaj/react-pdf/wiki
- Breaking changes in release notes
- Version compatibility table (above)

**Major Version Upgrades**:
- 7.x → 8.x: Minor breaking changes (safe)
- 8.x → 9.x: ESM migration required
- 9.x → 10.x: Major breaking changes (avoid for now)

---

## Debugging Tips

### Enable Verbose Logging

```typescript
// In development, add more logs
console.log('PDF load start:', url);
console.time('PDF load');

const loadingTask = pdfjsLib.getDocument({ url });
const pdf = await loadingTask.promise;

console.timeEnd('PDF load');
console.log('PDF loaded:', { numPages: pdf.numPages, fingerprint: pdf.fingerprint });
```

### Check Worker Status

```typescript
// Verify worker is configured
console.log('Worker source:', pdfjs.GlobalWorkerOptions.workerSrc);

// Should output:
// https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js
```

### Monitor Network Requests

In Chrome DevTools:
1. Network tab
2. Filter: "pdf"
3. Look for:
   - PDF file request (should be 200 OK)
   - Worker file request (should be 200 OK)
   - Any 404s or CORS errors

---

## Quick Reference

### API Cheat Sheet

| Library | Import | API Call | Notes |
|---------|--------|----------|-------|
| react-pdf | `import { Document } from 'react-pdf'` | `<Document file={{ url }} />` | Preferred |
| pdfjs-dist | `import * as pdfjsLib from 'pdfjs-dist'` | `pdfjsLib.getDocument({ url })` | Object param |
| window.pdfjsLib | `const pdfjsLib = (window as any).pdfjsLib` | `pdfjsLib.getDocument(url)` | String param (legacy) |

### Version Check Command

```bash
npm list pdfjs-dist react-pdf
```

### Test Command

```bash
# Test all PDF viewers
npm run test:pdf  # TODO: Create this script
```

---

## Resources

### Official Documentation
- [PDF.js API](https://mozilla.github.io/pdf.js/api/draft/)
- [react-pdf GitHub](https://github.com/wojtekmaj/react-pdf)
- [react-pdf Examples](https://github.com/wojtekmaj/react-pdf/tree/main/sample)

### Internal Documentation
- [PDF Version Conflict Fix](../troubleshooting/PDF_VERSION_CONFLICT_FIX.md)
- [PDF Testing Guide](./PDF_TESTING_GUIDE.md)
- [CLAUDE.md](../../CLAUDE.md) - Critical Lessons section

### NPM Packages
- [pdfjs-dist on npm](https://www.npmjs.com/package/pdfjs-dist)
- [react-pdf on npm](https://www.npmjs.com/package/react-pdf)

---

**Last Updated**: October 16, 2025
**Maintained By**: Claude Code
**Review Cycle**: After any PDF-related changes
