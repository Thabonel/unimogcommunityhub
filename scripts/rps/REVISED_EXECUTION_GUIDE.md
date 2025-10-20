# Phase 8 Revised Execution Guide

**Date:** October 20, 2025
**Status:** Ready to Execute
**Key Change:** Illustrations use Phase 6 group names (not PDF extraction)

---

## What Changed Since Original Plan

### Original Plan (Incorrect)
- Extract text from illustration pages with PyMuPDF
- **Problem**: PyMuPDF can only extract "UNCONTROLLED WHEN PRINTED" header
- Group names at bottom of illustrations are embedded in images (not extractable)

### Revised Plan (Correct)
- **Illustration pages**: Use Phase 6 mapping group name as content
- **Parts list pages**: Extract actual text with PyMuPDF (works perfectly)

---

## Current Database State

```sql
-- Page 165 (DA - FUEL TANK)
content: "RPS Group DA: FUEL TANK, SENDER UNIT AND MOUNTINGS.
          Exploded view illustration diagram showing all components..."
length: 500 chars

-- Page 171 (DEA - FUEL PUMP)
content: "RPS Group DEA: FUEL PUMP. Exploded view illustration diagram
          showing all components..."
length: 437 chars
```

**Problem**: Both have identical templated text, only distinction is in first line.

---

## After Phase 8 Execution

```sql
-- Page 165 (DA - FUEL TANK)
content: "FUEL TANK, SENDER UNIT AND MOUNTINGS"
extraction_method: "Phase 6 Mapping"
length: 38 chars

-- Page 171 (DEA - FUEL PUMP)
content: "FUEL PUMP"
extraction_method: "Phase 6 Mapping"
length: 9 chars
```

**Fix**: Each page has unique, distinctive content from Phase 6 mapping.

---

## Why This Will Work

### Embedding Comparison

**Current (Problematic):**
```
Page 165: "RPS Group DA: FUEL TANK... Exploded view illustration diagram..."
Page 171: "RPS Group DEA: FUEL PUMP... Exploded view illustration diagram..."

Similarity: ~95% (identical template dominates)
Barry confusion: HIGH
```

**After Phase 8 (Fixed):**
```
Page 165: "FUEL TANK, SENDER UNIT AND MOUNTINGS"
Page 171: "FUEL PUMP"

Similarity: ~30% (only "FUEL" in common)
Barry confusion: NONE
```

---

## Execution Steps

### Prerequisites

1. **Set environment variable:**
```bash
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

2. **Verify Phase 6 mapping:**
```bash
ls -lh scripts/rps/output/RPS_GROUP_TO_PAGES_COMPLETE.json
# Should exist with 93 groups
```

3. **Verify PDF:**
```bash
ls -lh /Users/thabonel/Code/Work/RPS-02155-Unimog-GS-Base-Scale.pdf
# Should be 52MB, 930 pages
```

### Step 1: Run Test Mode

```bash
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps
./run-phase8-reindex.sh test
```

**Test pages:**
- Page 1: Multiple groups
- Page 50: AA Crankcase illustration
- Page 51: AA Crankcase parts list
- **Page 165: DA Fuel tank** (critical test)
- **Page 171: DEA Fuel pump** (critical test)
- Page 176: DB Fuel lines
- Page 225: DGB Controls
- Page 500, 900, 929: Range tests

**Expected output:**
```
[Page 165] Processing 1 group(s)...
  Processing page 165: DA illustration...
    ✓ Using group name from Phase 6 mapping: "FUEL TANK, SENDER UNIT AND MOUNTINGS"
    ✓ Updated chunk ...

[Page 171] Processing 1 group(s)...
  Processing page 171: DEA illustration...
    ✓ Using group name from Phase 6 mapping: "FUEL PUMP"
    ✓ Updated chunk ...
```

### Step 2: Validate Test Results

```sql
-- Check updated content
SELECT
  page_number,
  section_title,
  content,
  extraction_method,
  LENGTH(content) as len
FROM manual_chunks
WHERE manual_title = 'RPS Catalog'
  AND page_number IN (165, 171)
ORDER BY page_number;
```

**Expected results:**
```
page_number | content                                  | extraction_method | len
------------|------------------------------------------|-------------------|----
165         | FUEL TANK, SENDER UNIT AND MOUNTINGS     | Phase 6 Mapping   | 38
171         | FUEL PUMP                                | Phase 6 Mapping   | 9
```

**Success criteria:**
- ✓ No templated "Exploded view illustration diagram..." text
- ✓ Content is distinctive between pages
- ✓ extraction_method = "Phase 6 Mapping"
- ✓ Content length < 100 chars (concise)

### Step 3: Validate Parts List Extraction

```sql
-- Check parts list page (should have PyMuPDF extraction)
SELECT
  page_number,
  section_title,
  LEFT(content, 200) as content_preview,
  extraction_method,
  LENGTH(content) as len
FROM manual_chunks
WHERE manual_title = 'RPS Catalog'
  AND page_number = 51
ORDER BY page_number;
```

**Expected:**
- extraction_method = "PyMuPDF"
- content starts with "GROUP AA TITLE CRANKCASE..." (actual parts data)
- Length > 1000 chars

### Step 4: Approve Full Mode

If test passes with 100% success rate:

```bash
./run-phase8-reindex.sh full
```

**Duration:** 4-6 hours for 930 pages

### Step 5: Regenerate Embeddings

After full mode completes:

```sql
-- Clear embeddings for updated pages
UPDATE manual_chunks
SET embedding = NULL
WHERE manual_title = 'RPS Catalog'
  AND extraction_method IN ('Phase 6 Mapping', 'PyMuPDF');

-- Count pages needing embeddings
SELECT COUNT(*) FROM manual_chunks
WHERE manual_title = 'RPS Catalog' AND embedding IS NULL;
```

Then use admin dashboard to regenerate embeddings.

### Step 6: Test Barry

```
Query 1: "show me exploded view of fuel pump"
Expected: Page 171 (FUEL PUMP)
NOT: Page 165 (FUEL TANK)

Query 2: "fuel tank exploded view"
Expected: Page 165 (FUEL TANK)
NOT: Page 171 (FUEL PUMP)

Query 3: "fuel lines and hoses"
Expected: Page 176 (DB - FUEL LINES)
```

---

## Key Differences from Yesterday

| Aspect | Yesterday | Today |
|--------|-----------|-------|
| **Table** | Fixed `rps_illustrations` | Fixing `manual_chunks` |
| **What Barry Searches** | Not this table | THIS table ✓ |
| **Illustration Content** | Tried to extract with PyMuPDF | Use Phase 6 group name |
| **Parts List Content** | Not changed | Extract with PyMuPDF |
| **Result** | Barry still confused | Barry can distinguish |

---

## Rollback Plan

If Phase 8 makes things worse:

```sql
-- Restore original content
UPDATE manual_chunks mc
SET
  content = mc_backup.content,
  extraction_method = mc_backup.extraction_method
FROM manual_chunks_backup_phase8_20251020 mc_backup
WHERE mc.id = mc_backup.id
  AND mc.manual_title = 'RPS Catalog';
```

---

## Files Modified

- `phase8-foolproof-reindex.ts` - Updated to use Phase 6 mapping for illustrations
- Key change in `processPage()` function:
  ```typescript
  if (pageInfo.pageType === 'illustration') {
    cleanedText = pageInfo.groupName;  // From Phase 6 mapping
    extractionMethod = 'Phase 6 Mapping';
    quality = 1.0;
  } else {
    const rawText = await extractTextFromPDF(pageInfo.pageNumber);
    cleanedText = cleanExtractedText(rawText);
    extractionMethod = 'PyMuPDF';
  }
  ```

---

## Ready to Execute

✅ Script revised with correct approach
✅ Test script created
✅ PDF located and verified
✅ PyMuPDF installed and working
✅ Phase 6 mapping confirmed accurate

**Next action:** Set SERVICE_ROLE_KEY and run test mode

```bash
export SUPABASE_SERVICE_ROLE_KEY="your_key"
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps
./run-phase8-reindex.sh test
```

**Estimated time to first results:** 2-3 minutes
