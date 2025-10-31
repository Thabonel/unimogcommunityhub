# RPS Phase 8: Complete Extraction Strategy (October 26, 2025)

## Objective
Extract ALL parts from 627-page RPS manual into structured database format for Barry AI access.

## Current Status
- **Existing Data**: 382 items across 16 groups (from Phases 1-7)
- **Coverage**: 10.7% (67 pages from earlier consolidation)
- **Target**: 100% coverage of all 627 pages
- **Available PNG Files**: 560 pages in ranges 90-200, 222-400, 427-627

## Document Structure Analysis (Pages 90-200)

### Confirmed Page Pattern
- **Even-numbered pages (90, 92, 94...)**: Exploded-view diagrams
- **Odd-numbered pages (91, 93, 95...)**: Parts list tables with structured data

### Confirmed Table Format
```
┌─────────────────────────────────────────────────────────────────┐
│ ITEM NO │ DESIGNATION │ NSN / MFG CODE / SUPPLIER │ QTY │ REPAIR │
├─────────────────────────────────────────────────────────────────┤
│ 001     │ SCREW PLUG  │ Z4067/007604 014106      │ 1   │ L M H   │
│         │             │ Z4067/007604 014106      │     │         │
└─────────────────────────────────────────────────────────────────┘
```

### Column Mapping
- **ITEM NO**: Item number (e.g., 001, 014, 042)
- **DESIGNATION**: Part description/name
- **NSN**: NATO Stock Number (may include multiple codes and manufacturer/supplier parts)
- **NO OFF**: Quantity per assembly (number in left column)
- **U E**: Unit of issue (letters like P, E, O, I)
- **L* M* H***: Repair grade indicators (Light/Medium/Heavy)

## Groups Identified (Pages 90-200)

| Group | Title | Pages | Est. Items | Status |
|-------|-------|-------|-----------|--------|
| ABC | Engine Exhaust Brake, Controls | 90-101 | ~70-80 | Partially read |
| AC | Oil Pump Assembly | 103-105 | ~20 | Partially read |
| ACB | Engine Oil Filter Assembly | 107-111 | ~40 | Partially read |
| AD | Accessory Drives, Tachometer | 120-121 | ~2-5 | Diagram only |
| AE | Engine Covers, Sump Pan | 122-127 | ~15-20 | Diagram only |
| AF | Engine Support Brackets | 130-131 | ~10-15 | Diagram only |
| BA | Radiator Assembly | 136-137 | ~20-25 | Diagram only |
| BB | Header Tank, Lines, Fittings | 142-143 | ~20-30 | Diagram read |
| BC | Engine Cooling Fan, Bracket | 150-151 | ~40 | Diagram read |
| BD | Thermostat Housing | 156-157 | ~20 | Partially read |
| BDA | Water Pump, Pulley, Belt | 162-163 | ~35 | Partially read |
| BE | Engine Oil Cooler, Filter | 166-167 | ~20 | Partially read |
| C | Muffler, Pipes, Mountings | 170-171 | ~18 | Diagram read |
| DA | Fuel Tank, Sender Unit | 174-175 | ~20 | Partially read |
| DB | Fuel Lines, Hoses, Fittings | 180-181 | ~22 | Diagram read |
| DC | Fuel Filter | 186-187 | ~11 | Diagram read |

**Estimated Total for Pages 90-200**: 400-500 items

## Extraction Approach

### Phase 1: Manual Reading Summary (COMPLETED)
- Extracted detailed data from 10+ parts list pages
- Documented table structure and column mapping
- Identified groups and page ranges
- Confirmed NSN handling and repair grade patterns

### Phase 2: Systematic Extraction (IN PROGRESS)
Continue reading remaining pages 90-200:
- Focus on odd-numbered pages (parts lists)
- Extract all items with complete designation, NSN, manufacturer codes, supplier codes
- Document quantities and repair grades per table

### Phase 3: Extended Range Extraction (PENDING)
- Pages 222-400: ~800-1000 items (124 PNG files available)
- Pages 427-627: ~1500-2000 items (130 PNG files available)
- Total estimated new items: 2500-3500

### Phase 4: Data Consolidation (PENDING)
Merge with existing 382 items:
- Combine all extracted groups into master JSON
- Apply database schema mapping (designation→description, etc.)
- Handle NSN truncation, repair grade validation
- Generate final INSERT SQL

### Phase 5: Database Upload (PENDING)
Execute consolidated SQL to upload all data

## Key Technical Requirements

### NSN Handling
- **Column limit**: 25 characters
- **Strategy**: Extract primary NSN (before "/"), store full in metadata
- **Example**: "D8046/352 180 30 10" → Column: "D8046/352" + metadata.nsn_full

### Repair Grade
- **Valid values**: L (Light), M (Medium), H (Heavy)
- **Strategy**: Extract first letter (uppercase), map invalid to NULL
- **Invalid storage**: Store original invalid grades in metadata.repair_grade_original

### Quantity Parsing
- **Column**: NO OFF (number of pieces)
- **Handling**: Parse integer, default to 1 if empty

### Metadata JSONB
Store flexible fields not in schema:
```json
{
  "notes": "Additional info from table",
  "manufacturer_code": "...",
  "supplier_code": "...",
  "unit_of_issue": "P/E/O/I",
  "repair_grade_original": "invalid grade if mapped",
  "nsn_full": "full NSN if > 25 chars"
}
```

## Expected Results

### New Items from Pages 90-200
- Current status: ABC (80), AC (13) extracted → ~93 items documented
- Remaining: ~300-400 items
- Total for this range: ~400-500 items

### Final Database State
- **Existing**: 382 items (16 groups)
- **New from 90-200**: 400-500 items (~10 groups)
- **New from 222-400**: 800-1000 items (~15 groups)
- **New from 427-627**: 1500-2000 items (~20 groups)
- **Grand Total**: ~3000-3500 items across 50+ groups

## Extraction Progress Tracking

| Range | Pages | PNG Files | Items Est. | Status |
|-------|-------|-----------|-----------|--------|
| 90-200 | 111 | 76 | 400-500 | In Progress |
| 222-400 | 179 | 124 | 800-1000 | Pending |
| 427-627 | 201 | 130 | 1500-2000 | Pending |
| **TOTAL** | **491** | **330** | **2500-3500** | **In Progress** |

## Notes for Barry Integration

Once completed, this comprehensive parts database will enable:
1. **Parts lookup** by group code (e.g., "show parts in group ABC")
2. **Semantic search** for parts by designation
3. **Assembly documentation** with complete part specifications
4. **Repair grade guidance** for light/medium/heavy repairs
5. **NSN cross-reference** with full part numbers and supplier info

## Schema Mapping Reference

| RPS Field | DB Column | Handling |
|-----------|-----------|----------|
| ITEM NO | item_number | Direct |
| DESIGNATION | description | Direct |
| NSN (primary) | nsn | Truncated to 25 chars |
| NSN (full) | metadata.nsn_full | If > 25 chars |
| MFG CODE | metadata.manufacturer_code | Via JSONB |
| SUPPLIER CODE | metadata.supplier_code | Via JSONB |
| NO OFF | quantity | Parse integer |
| U E | metadata.unit_of_issue | Via JSONB |
| REPAIR GRADE | repair_grade | L/M/H only, NULL if invalid |
| REPAIR GRADE (orig) | metadata.repair_grade_original | If mapped |
| RPS NUMBER | rps_number | Default: '02155' |
| GROUP CODE | group_code | From page header |

---

**Created**: October 26, 2025
**Phase**: 8 - Complete Manual Extraction Initiative
**Authorization**: User directive "yes, go" with "massive tokens" budget
**Target Completion**: 100% coverage of 627-page RPS manual
