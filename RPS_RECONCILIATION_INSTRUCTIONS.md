# RPS Database Reconciliation - Complete Instructions

## Critical Requirements

**TOKEN AVAILABILITY**: Full token reload tomorrow. Burn tokens today. No constraints on length or time.

**SCOPE**:
- Extract COMPLETE parts list data from ALL 627 RPS PNG pages
- Sequential verification: Pages 1-627 with NO SKIPPING except NIIN pages 19-29 (already extracted)
- Organize extracted data into JSON files by GROUP_CODE
- Create comprehensive progress tracking for Barry AI integration

## Non-Negotiable Rules

1. **NO SHORTCUTS** - Every page must be reviewed sequentially
2. **NO SKIPPING** - Only exception: NIIN Index pages 19-29 (already extracted)
3. **ACCURACY MANDATORY** - All data extraction must be precise and complete
4. **SYSTEMIC APPROACH** - Follow exact workflow documented below
5. **PARALLEL VERIFICATION** - Independent agent monitors accuracy in real-time

## Sequential Processing Workflow

### Phase 1: Pages 1-15 (Reference/Cover Pages)
- Status: COMPLETED
- Content: Cover, amendments, contents, preface, distribution lists
- Action: Move to Phase 2

### Phase 2: Pages 16-18
- Check if files exist
- Document findings

### Phase 3: Pages 19-29 (NIIN Index)
- Status: SKIP - Already extracted by user
- Note: Verify against yesterday's extraction

### Phase 4: Pages 30-38 (Group Contents Index)
- Reference material
- Document, continue to next phase

### Phase 5: Pages 39-627 (Technical Content - PRIMARY EXTRACTION)
- For EXPLODED VIEW pages (header "GROUP X SHEET N"):
  - Extract: group_code, title, sheet_number, page_number
  - Note callout numbers (these link to parts lists)

- For PARTS LIST pages (header "GROUP X TITLE [description]"):
  - **EXTRACT COMPLETE TABLE**:
    - item_number (ITEM NO)
    - designation (DESIGNATION)
    - nsn (NSN - NATO Stock Number)
    - niin (extracted from NSN if present - 13-digit code)
    - manufacturer_code (MANUFACTURER CODE/PART NO)
    - supplier_code (SUPPLIER CODE/PART NO)
    - quantity_per_assembly (NO OFF)
    - unit_of_issue (U, E, X columns)
    - repair_grade (L* column)
    - notes (any footnotes or references)

  - **SAVE TO**: `scripts/rps/parts-lists/[GROUP_CODE].json`
  - **STRUCTURE**: See JSON template below

## Data Extraction Template

```json
{
  "group_code": "AA",
  "group_title": "CRANKCASE AND TIMING CASE",
  "page_numbers": [47, 49, 51, 53, 55],
  "page_type": "parts_list",
  "total_items": 57,
  "items": [
    {
      "item_number": "001",
      "designation": "CRANKCASE (INCLUDES AA 002 TO AA 024)",
      "nsn": "Z4067/353 010 27 08",
      "niin": "extracted_if_present",
      "manufacturer_code": "Z4067/353 010 27 08",
      "supplier_code": "Z4067/353 010 27 08",
      "quantity_per_assembly": 1,
      "unit_of_issue": "EA",
      "repair_grade": "M",
      "notes": "References sub-items 002-024"
    }
  ]
}
```

## Progress Tracking

**Update After Every Page**:
- Current page number
- Page type (exploded_view, parts_list, reference)
- Group code (if applicable)
- Items extracted (if parts list)
- Any issues encountered

**Save to**: `scripts/rps/reconciliation-progress.json`

**Commit to Git**: After every 10 pages with message "RPS reconciliation: Pages X-Y extracted and verified"

## Quality Verification Checklist

### For Every Parts List Page:
- [ ] All items in table have been extracted
- [ ] Item numbers match exploded view callouts
- [ ] NSN codes are complete and correct
- [ ] Manufacturer and supplier codes captured
- [ ] Quantities recorded accurately
- [ ] No items skipped at bottom of page

### For All Pages:
- [ ] Page exists as PNG file
- [ ] Group code correctly identified
- [ ] Page type correctly classified
- [ ] Data matches visual inspection
- [ ] No duplicate extractions

## Parallel Verification Agent

**Role**: Monitor extraction accuracy in real-time
**Responsibilities**:
- Verify each extracted item against PNG image
- Check for completeness (no missed items)
- Validate data accuracy (no OCR errors)
- Spot-check JSON formatting
- Ensure no pages skipped
- Monitor progress adherence to schedule

**Trigger Points**:
- Every 10 pages: Full verification
- Spot checks: Random pages throughout
- Flag any inconsistencies immediately

## Database Integration (Post-Extraction)

After all parts lists extracted:
1. Create import SQL from JSON files
2. Verify NIIN linking to callouts
3. Load into Barry's parts database
4. Test Barry responses with part number queries

## Success Criteria

✅ ALL 627 pages reviewed sequentially (except NIIN 19-29)
✅ Complete parts list data extracted for EVERY parts list page
✅ JSON files organized by GROUP_CODE in scripts/rps/parts-lists/
✅ Zero pages skipped (except NIIN)
✅ 100% data accuracy verified by parallel agent
✅ Progress tracked and committed every 10 pages
✅ Barry can query parts by number and exploded view by group

## Current Progress

**Started**: Page 44 (GROUP A ENGINE exploded view)
**Extracted So Far**:
- GROUP A (1 item) - Complete
- GROUP AA (partial - pages 47, 49, 51, 53, 55 only)

**Status**: ONGOING - Continue from page 56 with GROUP AA continuation

**Next Actions**:
1. Complete GROUP AA extraction (finish all pages)
2. Continue sequentially through remaining groups
3. Run parallel verification agent
4. Update progress every 10 pages
5. Commit to git every 10 pages
