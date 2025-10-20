# Phase 8 Quick Start Guide

## Current Status: Ready to Execute Test Mode

All preparation complete. PDF verified at correct location.

## Execute Test Mode Now

### Step 1: Set Environment Variable
```bash
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# Verify it's set
echo $SUPABASE_SERVICE_ROLE_KEY
```

### Step 2: Run Test Mode
```bash
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps
./run-phase8-reindex.sh test
```

**What happens:**
- Processes 10 representative pages
- Takes ~2-3 minutes
- Tests critical pages: fuel pump (171) vs fuel tank (165)
- Logs progress to console

### Step 3: Validate Results

After test completes, run these SQL queries:

```sql
-- Check test pages were updated
SELECT
  page_number,
  section_title,
  LENGTH(content) as content_length,
  extraction_method,
  metadata->>'source' as source
FROM manual_chunks
WHERE manual_title = 'RPS Catalog'
  AND page_number IN (1, 50, 51, 165, 171, 176, 225, 500, 900, 929)
ORDER BY page_number;
```

**Expected results:**
- All 10+ rows returned (page 1 has multiple groups)
- extraction_method = 'PyMuPDF'
- source = 'Phase 8 foolproof reindex'
- content_length > 100 for parts lists, >20 for illustrations

**Critical validation:**
```sql
-- Verify fuel pump vs fuel tank distinction
SELECT
  page_number,
  section_title,
  LEFT(content, 200) as preview
FROM manual_chunks
WHERE manual_title = 'RPS Catalog'
  AND page_number IN (165, 171);
```

**Must show:**
- Page 165: "Group DA - FUEL TANK, SENDER UNIT AND MOUNTINGS"
- Page 171: "Group DEA - FUEL PUMP"

### Step 4: Decision Point

**If test passes (100% success):**
```bash
# Proceed to full mode
./run-phase8-reindex.sh full
```

**If test fails:**
- Review error logs
- Check which pages failed
- Report issues before proceeding

---

## Quick Reference

### Files
- **Script**: `phase8-foolproof-reindex.ts` (main processing)
- **Runner**: `run-phase8-reindex.sh` (shell wrapper)
- **PDF**: `/Users/thabonel/Code/Work/RPS-02155-Unimog-GS-Base-Scale.pdf`
- **Mapping**: `output/RPS_GROUP_TO_PAGES_COMPLETE.json`
- **Python**: `venv/` (PyMuPDF 1.26.5 installed)

### Test Pages
- 1: Multiple groups (FBD, FDA, FDE, JB)
- 50: AA Crankcase illustration
- 51: AA Crankcase parts list
- 165: DA Fuel tank
- 171: DEA Fuel pump
- 176: DB Fuel lines
- 225: DGB Fuel injector pump controls
- 500, 900, 929: Range tests

### Environment
```bash
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co  # Auto-set
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> need to set this>
```

---

## Ready to Execute

You only need to:
1. Set `SUPABASE_SERVICE_ROLE_KEY`
2. Run `./run-phase8-reindex.sh test`
3. Wait 2-3 minutes
4. Validate with SQL queries
5. Approve full mode if test passes

**Estimated time to first results: 2-3 minutes**
