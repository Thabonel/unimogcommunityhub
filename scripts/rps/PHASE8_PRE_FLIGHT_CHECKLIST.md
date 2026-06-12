# Phase 8 Pre-Flight Checklist

## Status: Ready for Test Mode Execution

All preparation work is complete. Before running the test mode, complete this checklist:

## ✅ Completed Preparations

- [x] Research: Document reindexing best practices identified
- [x] Analysis: 540 corrupted manual_chunks entries confirmed
- [x] Root Cause: AI hallucination and GPT-4o Vision refusals identified
- [x] Methodology: PyMuPDF extraction with validation gates designed
- [x] Execution Plan: Comprehensive 7-phase plan documented (PHASE_8_FOOLPROOF_REINDEX_PLAN.md)
- [x] Script: phase8-foolproof-reindex.ts created with full error handling
- [x] Runner: run-phase8-reindex.sh shell wrapper created
- [x] Dependencies: PyMuPDF 1.26.5 installed in venv
- [x] Documentation: PHASE8_EXECUTION_README.md created

## ⏳ Pre-Flight Checklist (Complete Before Test Run)

### 1. Verify RPS PDF Exists
```bash
# Check PDF is accessible
ls -lh /Users/thabonel/Code/Work/RPS-02155-Unimog-GS-Base-Scale.pdf
```

**Current Status:** ✅ PDF found (52MB, 930 pages)
**Action Required:** None - PDF is ready

### 2. Set Environment Variables
```bash
export VITE_SUPABASE_URL="https://ydevatqwkoccxhtejdor.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# Verify
echo $VITE_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

**Current Status:** ⚠️  Needs verification
**Action Required:** User must set SUPABASE_SERVICE_ROLE_KEY

### 3. Verify Phase 6 Mapping File
```bash
ls -lh scripts/rps/output/RPS_GROUP_TO_PAGES_COMPLETE.json
```

**Expected:** JSON file with 93 RPS groups mapped to pages

### 4. Database Backup
```sql
-- Recommended: Export current RPS manual_chunks before test
COPY (
  SELECT * FROM manual_chunks WHERE manual_title = 'RPS Catalog'
) TO '/tmp/rps_manual_chunks_backup_pre_phase8.csv' WITH CSV HEADER;
```

**Action Required:** User should create backup via Supabase console

### 5. Review Test Pages
Test mode will process these 10 pages:
- Page 1: Multiple groups (FBD, FDA, FDE, JB) - tests multi-group handling
- Page 50: AA Crankcase illustration - tests single illustration
- Page 51: AA Crankcase parts list - tests parts list extraction
- Page 165: DA Fuel tank - tests correct naming (was wrongly called fuel pump)
- Page 171: DEA Fuel pump - tests fuel pump distinction
- Page 176: DB Fuel lines - tests related fuel components
- Page 225: DGB Fuel injector controls - tests complex fuel systems
- Page 500: Mid-range test
- Page 900: High page number test
- Page 929: Last page boundary test

## 🚀 Ready to Execute

Once checklist complete, run:

```bash
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps
./run-phase8-reindex.sh test
```

## Expected Test Mode Duration

- **Processing time**: ~2 minutes (10 pages × 0.1s PyMuPDF + database updates)
- **Manual validation**: ~30 minutes (SQL queries + visual inspection)
- **Total**: ~30-45 minutes

## Test Success Criteria

✅ **PASS** if:
- 100% of test pages process successfully
- No PyMuPDF extraction errors
- Section titles match Phase 6 mapping
- Content length > 100 characters per page
- Page 165 = "FUEL TANK" (not "FUEL PUMP")
- Page 171 = "FUEL PUMP" (not "FUEL TANK")

❌ **FAIL** if:
- Any page fails to extract
- Extraction quality < 0.75 for any page
- Database update errors occur
- Wrong section titles generated
- Fuel pump/tank confusion persists

## After Test Mode

If test passes:
1. Review SQL validation queries
2. Manually inspect 3-5 updated pages
3. Get user approval
4. Proceed to full mode (930 pages)

If test fails:
1. Review error logs
2. Fix identified issues
3. Re-run test mode
4. DO NOT proceed to full mode until 100% success

## Files Ready

```
scripts/rps/
├── phase8-foolproof-reindex.ts       # Main processing script
├── run-phase8-reindex.sh              # Shell runner (executable)
├── venv/                               # Python environment with PyMuPDF 1.26.5
├── PHASE8_EXECUTION_README.md         # Detailed execution guide
├── PHASE8_PRE_FLIGHT_CHECKLIST.md     # This file
└── output/
    └── RPS_GROUP_TO_PAGES_COMPLETE.json  # Phase 6 mapping (required)
```

## Next Steps

1. **User Action Required**:
   - Mount UnimogManuals external drive
   - Set SUPABASE_SERVICE_ROLE_KEY environment variable
   - Create database backup

2. **Execute Test Mode**:
   ```bash
   ./run-phase8-reindex.sh test
   ```

3. **Validate Results**:
   ```sql
   SELECT page_number, section_title, LEFT(content, 100) as preview
   FROM manual_chunks
   WHERE manual_title = 'RPS Catalog'
     AND page_number IN (165, 171)
   ORDER BY page_number;
   ```

4. **Get Approval**: User reviews test results and approves full mode

5. **Execute Full Mode** (after approval):
   ```bash
   ./run-phase8-reindex.sh full
   ```

---

**Status**: ⏸️ Awaiting user to complete pre-flight checklist
**Estimated Time to Test**: 30-45 minutes (after prerequisites met)
**Estimated Time to Full**: 4-6 hours (after test validation)
