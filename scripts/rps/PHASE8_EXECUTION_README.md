# Phase 8: Foolproof RPS Reindex - Execution Guide

## Overview

This script corrects the 540 corrupted RPS entries in the `manual_chunks` table by:
- Using PyMuPDF for reliable PDF text extraction (no AI hallucination)
- Reading Phase 6 complete mapping for accurate group-to-page relationships
- Replacing AI-generated templated descriptions with actual PDF content
- Updating manual_chunks with clean, validated data

## Prerequisites

### 1. Python Environment
```bash
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps

# Create virtual environment (already done)
python3 -m venv venv

# Activate and install PyMuPDF (already done)
source venv/bin/activate
pip install pymupdf
```

### 2. Environment Variables
```bash
export VITE_SUPABASE_URL="https://ydevatqwkoccxhtejdor.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
```

### 3. PDF File
Ensure RPS PDF is available at:
```
/Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE/RPS/02155-RPS-UNIMOG-MEDIUM.pdf
```

### 4. Phase 6 Mapping
Ensure complete mapping exists at:
```
scripts/rps/output/RPS_GROUP_TO_PAGES_COMPLETE.json
```

## Execution Workflow

### Phase 1: Test Mode (2-3 hours)

Process 10 representative pages to validate the extraction pipeline:

```bash
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps
./run-phase8-reindex.sh test
```

**Test pages selected:**
- Page 1: Multiple groups (FBD, FDA, FDE, JB)
- Page 50: Illustration (AA - Crankcase)
- Page 51: Parts list (AA - Crankcase)
- Page 165: DA - Fuel tank (was wrongly called fuel pump)
- Page 171: DEA - Fuel pump (actual fuel pump)
- Page 176: DB - Fuel lines
- Page 225: DGB - Fuel injector pump controls
- Page 500: Mid-range page
- Page 900: High page number
- Page 929: Last page

**Success Criteria:**
- 100% of test pages must process successfully
- Extracted text length > 100 characters per page
- Extraction quality score >= 0.75
- Section titles match Phase 6 mapping

**Manual Validation:**
After test run, query database to verify corrections:

```sql
-- Check test pages were updated
SELECT page_number, section_title, LENGTH(content) as content_length, extraction_method
FROM manual_chunks
WHERE manual_title = 'RPS Catalog'
  AND page_number IN (1, 50, 51, 165, 171, 176, 225, 500, 900, 929)
ORDER BY page_number;

-- Verify fuel pump vs fuel tank distinction
SELECT page_number, section_title, LEFT(content, 200) as content_preview
FROM manual_chunks
WHERE manual_title = 'RPS Catalog'
  AND (page_number = 165 OR page_number = 171);
-- Expected:
-- Page 165: "Group DA - FUEL TANK, SENDER UNIT AND MOUNTINGS"
-- Page 171: "Group DEA - FUEL PUMP"
```

### Phase 2: Full Mode (4-6 hours)

Process all 930 RPS pages:

```bash
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps
./run-phase8-reindex.sh full
```

**ONLY proceed if test mode achieved 100% success rate.**

**What it does:**
- Processes all unique pages from Phase 6 mapping (930+ pages)
- Updates existing manual_chunks entries
- Inserts new entries for missing groups
- Logs all successes and failures

**Success Criteria:**
- >= 99% success rate (allow 1% for edge cases)
- < 10 failed pages total
- All fuel-related pages correctly distinguished

### Phase 3: Regenerate Embeddings (2-3 hours)

After full mode completes, regenerate embeddings:

```sql
-- Clear existing embeddings for RPS pages
UPDATE manual_chunks
SET embedding = NULL
WHERE manual_title = 'RPS Catalog';

-- Trigger embedding regeneration
-- (Use existing admin UI or edge function)
```

### Phase 4: Barry Testing (1-2 hours)

Test Barry with previously failing queries:

1. "show me exploded view of fuel pump"
   - Expected: Page 171 (DEA - FUEL PUMP)
   - Should NOT return: Page 165 (DA - FUEL TANK)

2. "fuel tank exploded view"
   - Expected: Page 165 (DA - FUEL TANK)
   - Should NOT return: Page 171 (DEA - FUEL PUMP)

3. "clutch master cylinder"
   - Expected: Page 74 (EA - CLUTCH MASTER CYLINDER)
   - Should NOT return: Non-clutch pages

4. "turbocharger exploded view"
   - Expected: Pages 105, 237, 252, 254 (DHA - TURBOCHARGER)

## Monitoring and Troubleshooting

### Check Progress During Execution

```sql
-- Count updated pages
SELECT COUNT(*) as updated_count
FROM manual_chunks
WHERE manual_title = 'RPS Catalog'
  AND metadata->>'source' = 'Phase 8 foolproof reindex';

-- Check extraction quality
SELECT
  AVG(extraction_quality::numeric) as avg_quality,
  MIN(extraction_quality::numeric) as min_quality,
  COUNT(CASE WHEN extraction_quality::numeric >= 0.75 THEN 1 END) as high_quality_count
FROM manual_chunks
WHERE manual_title = 'RPS Catalog'
  AND metadata->>'source' = 'Phase 8 foolproof reindex';
```

### Common Issues

**Issue: "PDF not found"**
- Verify external drive is mounted
- Check path: `/Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE/RPS/`

**Issue: "PyMuPDF extraction failed"**
- Activate venv: `source venv/bin/activate`
- Test manually: `python3 -c "import fitz; print(fitz.__version__)"`

**Issue: "Database update failed"**
- Check SUPABASE_SERVICE_ROLE_KEY is set
- Verify RLS policies allow service role access

**Issue: Low extraction quality (<0.75)**
- Review page content manually
- Check if page is blank or damaged in PDF
- Consider skipping problematic pages

### Rollback Plan

If Phase 8 introduces new errors:

```sql
-- Restore from backup (if created before Phase 8)
DELETE FROM manual_chunks WHERE manual_title = 'RPS Catalog';

INSERT INTO manual_chunks
SELECT * FROM manual_chunks_backup_phase8_20251020;

-- Or revert to Phase 6 state
UPDATE manual_chunks
SET
  content = metadata->>'original_content',
  section_title = metadata->>'original_section_title'
WHERE manual_title = 'RPS Catalog'
  AND metadata->>'source' = 'Phase 8 foolproof reindex';
```

## Files Created

- `phase8-foolproof-reindex.ts` - Main TypeScript script
- `run-phase8-reindex.sh` - Shell wrapper with venv activation
- `venv/` - Python virtual environment with PyMuPDF
- `PHASE8_EXECUTION_README.md` - This file

## Timeline

- **Phase 1 (Test)**: 2-3 hours
- **Phase 2 (Full)**: 4-6 hours
- **Phase 3 (Embeddings)**: 2-3 hours
- **Phase 4 (Testing)**: 1-2 hours
- **Total**: 9-14 hours over 2-3 days

## Success Metrics

- [x] PyMuPDF installed and verified (v1.26.5)
- [ ] Test mode: 100% success rate on 10 pages
- [ ] Full mode: >= 99% success rate on 930+ pages
- [ ] Embeddings regenerated for all updated pages
- [ ] Barry returns correct citations for test queries
- [ ] Zero AI hallucination in new content
- [ ] Fuel pump != fuel tank (pages distinct)

## Next Steps

1. Run test mode: `./run-phase8-reindex.sh test`
2. Validate results with SQL queries
3. Get approval to proceed to full mode
4. Run full mode: `./run-phase8-reindex.sh full`
5. Regenerate embeddings
6. Test Barry with validation queries
7. Deploy to staging for user acceptance testing
8. Deploy to production (if approved)
