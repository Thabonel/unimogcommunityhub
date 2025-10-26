# RPS Database Reconciliation Plan - Visual Inspection Method

## Problem Statement

**Critical Issue Discovered**: The `rps_illustrations` database index does NOT match the actual PNG files.

### Evidence of Mismatch:
1. **Page 74** - Database entry exists, but `rps_page_0074.png` has been deleted
2. **Page 105** - Database says "TURBOCHARGER AIRESEARCH Sheet 1 (DHA)" but actual PNG shows "OIL PUMP ASSEMBLY (AC)"
3. **Unknown number** of additional mismatches exist across all 224 database records

### Root Cause:
- Database was populated before duplicate PNGs were manually deleted
- Some database entries reference wrong page numbers or descriptions
- Database cleanup was never performed after file cleanup

## Reconciliation Method: VISUAL INSPECTION + COMPLETE DATA EXTRACTION

**Approach**: Manual visual inspection of EVERY PNG file, no automated scripts. For parts list pages, extract complete table data.

**Why This Works**:
- More accurate than OCR
- Captures complete parts list information
- Verifies actual content matches database
- Creates authoritative source for Barry AI access

## Current State

**Local Files**: 627 clean PNG files in `scripts/rps/output/ai_illustrations/`
- Filenames: `rps_page_0001.png` through `rps_page_0927.png` (with gaps)
- Files have been manually deduplicated
- All filenames are correctly formatted (4-digit zero-padded)
- Previous NIIN extraction: Pages 19-29 completed

**Database State**: 224 records in `rps_illustrations` table
- Page numbers range from 1 to 928
- 221 unique page numbers (3 duplicates for page 1)
- Descriptions and group codes do NOT match actual PNG content

**The Challenge**: Systematically verify EVERY PNG page and extract complete parts list data for Barry.

## Reconciliation Strategy: Sequential Visual Inspection

### Workflow

**Start Point**: Page 1 (rps_page_0001.png)
**Process**: Inspect EVERY PNG sequentially - NO SKIPPING
**Save Progress**: After every 10 pages, save current progress

### Step-by-Step Process for Each PNG:

#### 1. **Read the PNG Visually**
   - Open `rps_page_NNNN.png` in image viewer
   - Examine top, middle, and bottom for metadata

#### 2. **Determine Page Type**

   **Exploded View** (diagram page):
   - Title at BOTTOM
   - Has numbered callouts (1, 2, 3...)
   - Technical drawing of part/assembly
   - Header: "GROUP [CODE] SHEET [N]"

   **Parts List** (text page):
   - Title at TOP: "GROUP [CODE] TITLE [Description]"
   - Table with columns: ITEM NO, DESIGNATION, NSN, etc.
   - Lists all part numbers and NIINs

#### 3. **Extract Metadata**
   ```
   Page Number: 1
   Group Code: FBD (from "GROUP FBD" header)
   Title: "REPAIR PARTS SCALE FRONT PAGE"
   Sheet Number: 1 (from "SHEET 1" header)
   Page Type: cover/reference
   ```

#### 4. **FOR PARTS LIST PAGES ONLY: Extract Complete Table**

   **READ THE ENTIRE TABLE** and extract:
   - ITEM NO (callout number)
   - DESIGNATION (part name)
   - NSN (NATO Stock Number / NIIN)
   - MANUFACTURER CODE / PART NO
   - NO OFF (quantity per assembly)
   - UOI (unit of issue)
   - Any repair grade or notes

   **Example Output**:
   ```json
   {
     "page_number": 51,
     "group_code": "AA",
     "title": "CRANKCASE AND TIMING CASE",
     "page_type": "parts_list",
     "items": [
       {
         "item_number": "026",
         "designation": "ENGINE PLATE",
         "niin": "2406790020300",
         "nsn": "5330 12-176-8995",
         "manufacturer_code": "Z4067/900203",
         "quantity_per_assembly": 1,
         "repair_grade": "EA"
       },
       {
         "item_number": "027",
         "designation": "GROOVED NAIL, ROUND HEAD",
         "niin": "3020 12-181-5021",
         "nsn": "D8046/3521811108",
         "quantity_per_assembly": 2
       }
     ]
   }
   ```

#### 5. **Verify Against Database**

   - Look up `rps_illustrations` record for this page number
   - Check if database description matches actual PNG title
   - Check if group code matches
   - Check if sheet number matches

#### 6. **Record Result**

   **If Exploded View**:
   ```json
   {
     "status": "verified_correct" | "needs_update" | "delete",
     "page_number": 50,
     "file_status": "exists",
     "database_description": "CRANKCASE AND COVER TIMING CASE",
     "actual_title": "CRANKCASE AND COVER TIMING CASE",
     "group_code": "AA",
     "sheet_number": 1
   }
   ```

   **If Parts List**:
   ```json
   {
     "status": "verified_with_parts_list",
     "page_number": 51,
     "group_code": "AA",
     "title": "CRANKCASE AND TIMING CASE",
     "items_count": 14,
     "items": [ /* full table as extracted */ ]
   }
   ```

### Progress Tracking

Save progress after every 10 pages to: `scripts/rps/reconciliation-progress.json`

```json
{
  "last_updated": "2025-10-26T14:30:00Z",
  "pages_processed": 50,
  "pages_remaining": 577,
  "progress_percentage": 8,
  "verified_correct": 45,
  "needs_update": 3,
  "deleted": 2,
  "last_page_processed": 50,
  "detailed_findings": [
    {
      "page": 74,
      "status": "deleted",
      "reason": "PNG file not found"
    },
    {
      "page": 105,
      "status": "needs_update",
      "database_says": "TURBOCHARGER AIRESEARCH (DHA)",
      "actual_content": "OIL PUMP ASSEMBLY (AC)"
    }
  ]
}
```

### After All 627 PNGs Verified

Generate cleanup SQL from findings:

**File**: `scripts/rps/reconciliation-cleanup.sql`

```sql
-- RPS Database Reconciliation Cleanup
-- Generated: [timestamp]
-- Method: Manual visual inspection of all 627 PNG files
-- Total records to fix: [count]

BEGIN;

-- Delete entries for non-existent PNG files
DELETE FROM rps_illustrations
WHERE page_number = 74;  -- PNG file deleted

-- Update incorrect descriptions
UPDATE rps_illustrations
SET description = 'OIL PUMP ASSEMBLY - Exploded view (Page 105)',
    group_code = 'AC',
    figure_number = 'AC-1'
WHERE page_number = 105
  AND group_code = 'DHA';

-- Remove duplicate page 1 entries (keep best one)
DELETE FROM rps_illustrations
WHERE id IN (
  SELECT id FROM (
    SELECT id,
      ROW_NUMBER() OVER (
        PARTITION BY page_number
        ORDER BY LENGTH(description) DESC
      ) as rank
    FROM rps_illustrations
    WHERE page_number = 1
  ) ranked
  WHERE rank > 1
);

-- Verify final state
SELECT 'Final verification' as check_type,
  COUNT(*) as total_records,
  COUNT(DISTINCT page_number) as unique_pages
FROM rps_illustrations;

COMMIT;
```

## Implementation: Manual Visual Inspection Process

### NO SCRIPTS - PURE VISUAL VERIFICATION

This is intentionally manual to ensure accuracy. No automated OCR or script extraction.

### Your Process

**For Each PNG (starting with page 1)**:

1. **Open PNG file** from `scripts/rps/output/ai_illustrations/rps_page_NNNN.png`

2. **Read the page** - identify type:
   - **Exploded View**: Title at bottom, numbered diagram
   - **Parts List**: Title at top with "GROUP [X]", table format
   - **Other**: Cover pages, indices, etc.

3. **Extract Metadata**:
   - Page number (file name)
   - Group code (from "GROUP XX" header)
   - Title (from page)
   - Sheet number (if multi-sheet)

4. **If Parts List Page: MUST Extract Full Table**:
   - Read EVERY row of the table
   - Copy ITEM NO, DESIGNATION, NSN, codes exactly
   - Save to: `scripts/rps/parts-lists/[group-code].json`

5. **After Each Page**: Update progress file

6. **After Every 10 Pages**: Commit progress to Git with message "RPS reconciliation: Pages X-Y verified"

### Progress Files

**Primary**: `scripts/rps/reconciliation-progress.json`
- Update after EVERY page
- Shows which pages processed, issues found
- Safe checkpoint if we crash

**Parts Lists**: `scripts/rps/parts-lists/[GROUP_CODE].json`
- Only for parts list pages
- Contains full item tables
- Can be imported to database later

### When All 627 Pages Verified

Review `reconciliation-progress.json` findings and manually create:

**File**: `scripts/rps/reconciliation-cleanup.sql`

Based on what you found:
- DELETE entries where PNG doesn't exist
- UPDATE entries where metadata doesn't match
- Keep entries that match exactly

## Visual Identification Rules

### How to Identify Page Type by Looking at PNG:

**Exploded View**:
- Title at BOTTOM of page (e.g., "CRANKCASE AND COVER TIMING CASE")
- Technical line drawing with numbered callouts
- Header shows: "GROUP [CODE] SHEET [N]"

**Parts List**:
- Title at TOP of page (e.g., "GROUP AA TITLE CRANKCASE AND TIMING CASE")
- Table format with columns: ITEM NO, DESIGNATION, NSN
- Lists item numbers with part descriptions

**Both Types**:
- "UNCONTROLLED WHEN PRINTED" watermark at top
- RPS number "02155" in header
- Page number at bottom

### OCR Extraction Strategy:

1. **Top region (first 15% of image)**: Extract group code and title
2. **Bottom region (last 10% of image)**: Extract title if not found at top
3. **Header box**: Extract group code and sheet number
4. **Page type detection**: Look for "ITEM NO" table headers = parts list

## Success Criteria

### Phase 1 Complete:
- [ ] Verification script runs successfully
- [ ] `reconciliation-report.json` generated
- [ ] All 224 database records checked
- [ ] Report shows exact count of issues

### Phase 2 Complete:
- [ ] Manual review completed for all flagged entries
- [ ] Visual confirmation done for incorrect descriptions
- [ ] User approval recorded for each change

### Phase 3 Complete:
- [ ] Cleanup SQL generated
- [ ] SQL reviewed and approved
- [ ] Database backup created
- [ ] SQL executed successfully

### Phase 4 Complete:
- [ ] Database matches PNG files exactly
- [ ] No entries for deleted files
- [ ] All descriptions accurate
- [ ] Barry can find all illustrations correctly
- [ ] Admin interface displays correct images

## Rollback Plan

If cleanup fails:

```bash
# Restore from backup
psql < rps_illustrations_backup.sql

# Or via Supabase Console:
# 1. Go to SQL Editor
# 2. Paste backup SQL
# 3. Execute
```

## Timeline Estimate

**Pace**: ~10-15 pages per hour (slower for parts list pages)

- **627 PNG files total**
- **Average 2-3 minutes per exploded view page**
- **Average 5-10 minutes per parts list page** (table reading)

**Realistic Timeline**:
- Working 4 hours/day = ~40-60 pages/day
- **Estimated total: 10-15 days of work**
- Build in buffer for complex pages

**Milestone Schedule**:
- Pages 1-50: Day 1-2 (cover pages + early groups)
- Pages 50-200: Day 3-5 (engine/fuel system groups)
- Pages 200-400: Day 6-8 (transmission/drivetrain)
- Pages 400-600: Day 9-11 (chassis/suspension)
- Pages 600-627: Day 12 (electronics/interior)
- Cleanup + SQL: Day 13-14
- Database execution + testing: Day 15

## Files Created During This Process

```
scripts/rps/
├── RPS_DATABASE_RECONCILIATION_PLAN.md (this file - THE SOURCE OF TRUTH)
├── reconciliation-progress.json (progress checkpoint - UPDATE AFTER EACH PAGE)
├── parts-lists/
│   ├── AA.json (parts list for group AA)
│   ├── AB.json (parts list for group AB)
│   ├── AC.json (parts list for group AC)
│   └── ... (one file per group with parts list page)
└── reconciliation-cleanup.sql (final SQL - generated after all pages verified)
```

**Critical Files If We Crash**:
1. **This document** (RPS_DATABASE_RECONCILIATION_PLAN.md) - explains what we're doing
2. **reconciliation-progress.json** - shows which pages already verified
3. **parts-lists/** folder - extracted parts list data
4. **627 PNG files** - DO NOT DELETE

## Known Issues to Watch For

1. **Page 1**: Database has 4 entries for same page (different group codes - FDA, FBD, FDE, JB)
2. **Page 74**: PNG file DELETED - needs to be REMOVED from database
3. **Page 105**: Database says "TURBOCHARGER DHA" but PNG shows "OIL PUMP ASSEMBLY AC"
4. **Parts List Pages**: Must read ENTIRE table - don't miss items at bottom
5. **Multi-sheet groups**: Verify sheet number is correct (Sheet 1, 2, 3, etc.)
6. **NSN vs NIIN**: Different parts use different formats - read carefully
7. **Callout Numbers**: Item numbers in parts list must match exploded view callouts
8. **Pages 19-29**: Already extracted yesterday - verify against existing data

## Post-Reconciliation Tasks

After database cleanup:

1. **Upload PNGs to Supabase Storage**:
   - Manual upload via Supabase Dashboard
   - Folder: `rps_illustrations/rps_illustrations/`
   - Verify CDN URLs work

2. **Test Barry Integration**:
   - Ask Barry: "Show me the turbocharger exploded view"
   - Verify correct page displayed (should be DHA page, not AC)
   - Test part number lookups

3. **Admin Interface Verification**:
   - Open `/admin/rps-illustrations`
   - Check that images load correctly
   - Verify descriptions match PNGs

## Emergency Contact & Recovery - IF WE CRASH

**DO NOT PANIC - Everything is Documented**

### If We Lose Connection:

1. **THIS FILE IS THE TRUTH**
   - Location: `scripts/rps/RPS_DATABASE_RECONCILIATION_PLAN.md`
   - Contains: Complete plan, what we're doing, why
   - Read this to understand where we were

2. **CHECK PROGRESS FILE**
   - Location: `scripts/rps/reconciliation-progress.json`
   - Shows: Which pages already verified, what issues found
   - Last page processed: Check `last_page_processed` field
   - **RESUME FROM NEXT PAGE** (don't redo already-verified pages)

3. **CHECK PARTS-LISTS FOLDER**
   - Location: `scripts/rps/parts-lists/`
   - Shows: Which groups have extracted parts list data
   - Don't re-extract if .json file already exists

4. **Database is UNCHANGED**
   - Original 224 rps_illustrations records still exist
   - We are NOT modifying database until ALL pages verified
   - Safe to query anytime

5. **LOCAL FILES ARE SAFE**
   - 627 PNGs still in `scripts/rps/output/ai_illustrations/`
   - All properly named and deduplicated
   - DO NOT DELETE - these are the source of truth

## Starting the Reconciliation Process

**You Are Ready To Start When**:
- [ ] You understand the workflow (read this document completely)
- [ ] You have the 627 PNG files verified as correctly named
- [ ] You understand page types (exploded view vs parts list)
- [ ] You have clarified: NO SKIPPING PAGES, read entire parts lists

**Start Process**:

1. Create empty progress file: `scripts/rps/reconciliation-progress.json`
   ```bash
   mkdir -p scripts/rps/parts-lists
   ```

2. Create initial progress tracking:
   ```json
   {
     "started": "2025-10-26T00:00:00Z",
     "last_updated": "2025-10-26T00:00:00Z",
     "pages_processed": 0,
     "pages_remaining": 627,
     "progress_percentage": 0,
     "verified_correct": 0,
     "needs_update": 0,
     "deleted": 0,
     "last_page_processed": 0,
     "detailed_findings": []
   }
   ```

3. **Open first PNG**: `scripts/rps/output/ai_illustrations/rps_page_0001.png`

4. **Follow the process** outlined in "Reconciliation Strategy" section above

5. **After every 10 pages**: Update progress file and commit to git

6. **Resume from crash point**: Check `last_page_processed` in progress file

## How This Document Helps If We Crash

**Scenario 1**: Connection drops mid-verification
- Check progress file to see which page you were on
- Resume from next page
- No work is lost because progress is saved

**Scenario 2**: You close laptop and forget where you were
- Open this document
- Open `reconciliation-progress.json`
- See exactly which pages done and which pages left
- Resume cleanly

**Scenario 3**: Someone asks "what are we doing?"
- Point them to this document
- It explains everything: why, what, how, timeline

---

**Document Status**: FINAL - Ready for execution
**Created**: October 2025
**Last Updated**: October 26, 2025

**This is the AUTHORITATIVE SOURCE** for the RPS reconciliation process. If ever unclear, re-read this document.
