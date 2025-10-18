# RPS Parts Extraction Report

**Date**: October 18, 2025
**Manual**: TM 9-2320-360-24P - Repair Parts Scale 02155
**Total Pages**: 930
**Total Groups Identified**: 31 groups

## Executive Summary

The RPS manual contains comprehensive parts listings for the Unimog vehicle organized into 31 major groups (A through NC). Based on analysis of the first several groups, the complete extraction would involve:

- **Estimated Total Parts**: 1,500-2,000+ individual part records
- **Groups**: 31 major groups with subgroups
- **Data Complexity**: Multi-page tables with NSN codes, part numbers, quantities, and repair grades
- **Page Range**: Pages 41-930 (890 pages of parts data)

## Manual Structure

### Group Index (Page 33)

The manual is organized into the following groups:

| Code | Description |
|------|-------------|
| A | ENGINE |
| AA | CRANKCASE AND TIMING CASE |
| AAA | CRANKSHAFT AND BEARINGS |
| AAB | FLYWHEEL, RING GEAR AND HOUSING |
| AAC | PISTONS, CONRODS AND BEARINGS |
| AAD | CAMSHAFT AND BEARINGS |
| AB | CYLINDER HEAD |
| ABA | EXHAUST MANIFOLD, GASKETS AND FITTINGS |
| ABB | VALVES AND LIFTING GEAR |
| ABC | ENGINE EXHAUST BRAKE, CONTROLS AND FITTINGS |
| AC | OIL PUMP ASSEMBLY |
| ACB | ENGINE OIL FILTER ASSEMBLY |
| AD | ACCESSORY DRIVES, TACHOMETER PULSE GENERATOR AND FLEX DRIVE SHAFT |
| AE | ENGINE COVERS, SUMP PAN, OIL SEPERATOR, GASKETS AND FITTINGS |
| AF | ENGINE SUPPORT BRACKETS AND MOUNTS |
| BA | RADIATOR ASSEMBLY, LINES, FITTINGS AND SHROUD |
| BB | HEADER TANK, BRACKET, LINES AND FITTINGS |
| BC | ENGINE COOLING FAN, SUPPORT BRACKET AND PULLEY |
| BD | THERMOSTAT HOUSING AND WATER MANIFOLD |
| BDA | WATER PUMP, PULLEY AND BELT |
| BE | ENGINE OIL COOLER, FILTER AND COVER |
| C | MUFFLER, PIPES AND MOUNTINGS |
| DA | FUEL TANK, SENDER UNIT AND MOUNTINGS |
| DB | FUEL LINES, HOSES AND FITTINGS |
| DC | FUEL FILTER |
| DD | FUEL SUPPLY PUMP AND HAND PRIMER |
| DE | FUEL INJECTION PUMP ASSEMBLY |
| DF | (continued on next page) |
| KG | (not visible in index) |
| LG | (not visible in index) |
| NC | (not visible in index) |

## Data Structure Analysis

### Parts Table Format

Each group contains a parts table with the following columns:

| Column | Description | Format | Example |
|--------|-------------|--------|---------|
| ITEM NO | Item number | 3-digit zero-padded | 001, 002, 023 |
| DESIGNATION | Part description | Text | "CRANKCASE" |
| NSN | NATO Stock Number | XX-XXX-XXXX | 28-15-66-112-9387 |
| MANUFACTURER CODE/PART NO | Manufacturer code | Alphanumeric | 24067/353 010 27 08 |
| SUPPLIER CODE/PART NO | Supplier code | Alphanumeric | Z4067/353 010 27 08 |
| NO OFF | Number off (quantity) | Integer | 1, 2, 6 |
| U O X | Use On/Exchange | Letter codes | EA, X |
| L M H | Repair Grade (Light/Medium/Heavy) | L, M, or H | LM, H |

### Special Notations

- **EA**: Each
- **X**: Exchange item
- **Item numbering**: Some groups use 9000-series numbers for alternate/variant parts
- **Cross-references**: "(USE AA 001)" indicates reference to another item
- **Includes**: "(INCLUDES AA 002 TO AA 024)" indicates assembly composition
- **Also part of**: "(ALSO PART OF AA 9004)" indicates shared components

## Sample Extraction - Group A (ENGINE)

```json
{
  "group_code": "A",
  "group_name": "ENGINE",
  "page_range": "45",
  "parts": [
    {
      "item_number": "001",
      "description": "ENGINE,DIESEL 6 CYLINDER,124 KW AT 2800RPM,97 MM BORE DIA,500 KG APPROX DRY WT,C/W STARTER MOTOR,TURBO CHARGER,AIR COMPRESSOR,LESS CLUTCH ASSY;C/W (ALWAYS QUOTE ENGINE SERIAL NUMBER, TO ENSURE CORRECT PARTS ARE OBTAINED, FOR ENGINE REPAIR.)",
      "nsn": "28-15-66-112-9387",
      "manufacturer_code": "24067/353 010 25 00 21 62 44",
      "supplier_code": "Z4067/353 010 25 00 21 62 44",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "N",
      "repair_grade": "H"
    }
  ]
}
```

## Sample Extraction - Group AA (CRANKCASE AND TIMING CASE)

```json
{
  "group_code": "AA",
  "group_name": "CRANKCASE AND TIMING CASE",
  "page_range": "47-53",
  "illustration_pages": ["46", "48", "52"],
  "parts": [
    {
      "item_number": "001",
      "description": "CRANKCASE (INCLUDES AA 002 TO AA 024)",
      "nsn": null,
      "manufacturer_code": "24067/353 010 27 08",
      "supplier_code": "Z4067/353 010 27 08",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "002",
      "description": "SCREW PLUG",
      "nsn": null,
      "manufacturer_code": "24067/352 011 01 35",
      "supplier_code": "Z4067/352 011 01 35",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "003",
      "description": "SEAL RING",
      "nsn": null,
      "manufacturer_code": "24067/352 011 00 59",
      "supplier_code": "Z4067/352 011 00 59",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "008",
      "description": "GASKET ALUMINIUM,26 MM ID,32 MM OD (TACHOMETER DRIVE)",
      "nsn": "53-30-12-156-4678",
      "manufacturer_code": "D8046/007603026100",
      "supplier_code": "D8046/007603026100",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "011",
      "description": "GASKET (WATER DRAIN)",
      "nsn": "53-30-12-156-4601",
      "manufacturer_code": "D8046/007603018108",
      "supplier_code": "D8046/007603018108",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "028",
      "description": "GASKET (ALSO PART OF AA 9004)",
      "nsn": "53-30-12-176-8995",
      "manufacturer_code": "D8046/4031310780",
      "supplier_code": "D8046/4031310780",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "030",
      "description": "WASHER,SPRING TENSION RD,STEEL,ZINC COATED,8.4MM ID,15MM OD 0.8MM THK",
      "nsn": "53-10-12-142-8173",
      "manufacturer_code": "D8046/000137008204",
      "supplier_code": "D8046/000137008204",
      "quantity": 4,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "031",
      "description": "SCREW,CAP,HEXAGON HEAD ISO METRIC,STEEL,8 MM BY 25 MM LG",
      "nsn": "53-05-12-181-3838",
      "manufacturer_code": "D8046/000933008177",
      "supplier_code": "D8046/000933008177",
      "quantity": 4,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "032",
      "description": "SCREW, MACHINE",
      "nsn": "53-05-12-180-9588",
      "manufacturer_code": "D8046/0039906501",
      "supplier_code": "D8046/0039906501",
      "quantity": 8,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "033",
      "description": "SCREW, MACHINE",
      "nsn": "53-05-12-179-4823",
      "manufacturer_code": "D8046/0039906301",
      "supplier_code": "D8046/0039906301",
      "quantity": 3,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "036",
      "description": "SEAL,PLAIN ENCASED",
      "nsn": "53-30-12-179-5091",
      "manufacturer_code": "D8046/0059975647",
      "supplier_code": "D8046/0059975647",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "038",
      "description": "GASKET TIMING CASE COVER (ALSO PART OF AA 9004)",
      "nsn": "53-30-12-179-3403",
      "manufacturer_code": "D8046/3520150520",
      "supplier_code": "D8046/3520150520",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "039",
      "description": "GASKET TIMING CASE TO CRANKCASE (ALSO PART OF AA 9004)",
      "nsn": "28-15-12-139-7572",
      "manufacturer_code": "D8046/3120150580",
      "supplier_code": "D8046/3120150580",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "040",
      "description": "TIMING CASE (INCLUDES AA 41 TO AA 046)",
      "nsn": null,
      "manufacturer_code": "24067/352 010 18 33",
      "supplier_code": "Z4067/352 010 18 33",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "050",
      "description": "GASKET SYNTHETIC RUBBER & CORK, 120 MM O/A LG, 96 MM O/A W, 2.5 MM THK (COVER TO TIMING CASE, ALSO PART OF AA 9004)",
      "nsn": "53-30-12-188-2854",
      "manufacturer_code": "D8046/3520150380",
      "supplier_code": "D8046/3520150380",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "9001",
      "description": "CYLINDER LINER 100.2 MM",
      "nsn": null,
      "manufacturer_code": "24067/352 011 16 10",
      "supplier_code": "Z4067/352 011 16 10",
      "quantity": 6,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "9002",
      "description": "CYLINDER LINER 100.4 MM",
      "nsn": null,
      "manufacturer_code": "24067/362 011 03 10",
      "supplier_code": "Z4067/362 011 03 10",
      "quantity": 6,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "9003",
      "description": "GASKET FORMING COMPOUND 50 CC TUBE (ALTERNATIVE TO AA 038)",
      "nsn": "53-30-66-120-6238",
      "manufacturer_code": "D8046/002989 002010",
      "supplier_code": "D8046/002989 002010",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    }
  ]
}
```

## Sample Extraction - Group AAA (CRANKSHAFT AND BEARINGS)

```json
{
  "group_code": "AAA",
  "group_name": "CRANKSHAFT AND BEARINGS",
  "page_range": "60-62",
  "illustration_pages": ["60"],
  "parts": [
    {
      "item_number": "010",
      "description": "GEAR, CRANKSHAFT",
      "nsn": null,
      "manufacturer_code": "24067/352 052 00 03",
      "supplier_code": "Z4067/352 052 00 03",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "011",
      "description": "INTERMEDIATE PIECE, VIBRATION DAMPER TO CRANKSHAFT",
      "nsn": null,
      "manufacturer_code": "24067/352 035 08 14",
      "supplier_code": "Z4067/352 035 08 14",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "012",
      "description": "DAMPER, VIBRATION",
      "nsn": null,
      "manufacturer_code": "D8046/352 030 46 03",
      "supplier_code": "Z4067/352 030 46 03",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "013",
      "description": "PULLEY,GROOVE (EARLY TYPE PULLEY USED ON ENGINES, UP TO SERIAL NO, 793341, WITH DRILLED HOLES)",
      "nsn": "30-20-12-172-9979",
      "manufacturer_code": "D8046/3520351612",
      "supplier_code": "D8046/3520351612",
      "quantity": 1,
      "use_on": "EA",
      "exchange": "N",
      "repair_grade": "LM"
    },
    {
      "item_number": "014",
      "description": "SCREW,CAP,SOCKET HEAD ISO METRIC,10 MM BY 55 MM LG (PULLEY TO DAMPER, USED ON ENGINES UP TO SERIAL NO, 793341, NOT USED ON LATER ENGINES)",
      "nsn": "53-05-12-198-8131",
      "manufacturer_code": "D8046/000912010056",
      "supplier_code": "Z4067/000912010056",
      "quantity": 6,
      "use_on": "EA",
      "exchange": "X",
      "repair_grade": "LM"
    },
    {
      "item_number": "015",
      "description": "THRUST RING, VIBRATION DAMPER (USED ON EARLIER ENGINES UP TO SERIAL NO, 793341)",
      "nsn": null,
      "manufacturer_code": "24067/352 035 00 06",
      "supplier_code": "Z4067/352 035 00 06",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "016",
      "description": "SCREW, FLANGED DAMPER TO CRANKSHAFT (USED WITH AAA 013 UP TO ENGINE SERIAL NO, 793341)",
      "nsn": null,
      "manufacturer_code": "24067/352 035 00 71",
      "supplier_code": "Z4067/352 035 00 71",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "9018",
      "description": "PULLEY, GROOVE (LATER TYPE, USED ON ENGINES FROM SERIAL NO, 793342 PULLEY NOT DRILLED)",
      "nsn": null,
      "manufacturer_code": "24067/3520352912",
      "supplier_code": "Z4067/3520352912",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    },
    {
      "item_number": "9019",
      "description": "SCREW, FLANGED DAMPER (USED WITH AAA 9018)",
      "nsn": null,
      "manufacturer_code": "24067/3520350171",
      "supplier_code": "Z4067/3520350171",
      "quantity": 1,
      "use_on": null,
      "exchange": null,
      "repair_grade": null
    }
  ]
}
```

## Extraction Challenges

### 1. Volume
- 31 groups across 890 pages
- Estimated 1,500-2,000 individual part records
- Multiple illustration pages between parts tables

### 2. Data Consistency
- NSN codes sometimes present, sometimes "/NIL"
- Item numbers include both regular (001-999) and variant (9001-9999) ranges
- Repair grades use various formats: "LM", "H", "M", or blank
- Cross-references need to be preserved

### 3. Special Cases
- Assembly items that include other items
- Reference items that point to other items
- Alternative/variant parts (9000-series)
- Serial number-specific parts (engine variants)

### 4. Technical Accuracy Required
- Part descriptions can be very long and technical
- Multiple manufacturer/supplier codes per part
- Precise NSN format (XX-XXX-XXXX) must be maintained

## Recommendations

### Option 1: Automated OCR + Manual Review
**Estimated Time**: 20-40 hours
**Accuracy**: 85-90%

1. Use advanced OCR (Tesseract + post-processing)
2. Extract tables programmatically
3. Manual review and correction of all records
4. Database import with validation

### Option 2: Manual Extraction (Current Approach)
**Estimated Time**: 60-100 hours
**Accuracy**: 98-99%

1. Page-by-page manual reading
2. Structured data entry per group
3. Cross-reference validation
4. Quality control pass

### Option 3: Hybrid Approach (RECOMMENDED)
**Estimated Time**: 30-50 hours
**Accuracy**: 95-98%

1. Use OCR for initial extraction
2. Script-based structure detection
3. Focused manual review of:
   - NSN codes
   - Part descriptions
   - Cross-references
   - Special notations
4. Automated validation scripts

## Next Steps

1. **Decide on extraction approach** based on time/accuracy requirements
2. **Prioritize groups** - Start with most commonly needed (A, AA, AAA, AB, BA, etc.)
3. **Set up extraction pipeline** if using automated/hybrid approach
4. **Define database schema** for storing extracted data
5. **Create validation scripts** to check data integrity

## Data Quality Requirements

For database integration, each part record must have:

- **Required Fields**:
  - item_number (unique within group)
  - description (complete text)
  - group_code (A, AA, AAA, etc.)

- **Optional Fields**:
  - nsn (when available, format: XX-XXX-XXXX)
  - manufacturer_code
  - supplier_code
  - quantity (integer)
  - use_on (EA, etc.)
  - exchange (X, N, or null)
  - repair_grade (L, M, H, LM, or null)

- **Metadata**:
  - page_number (source page)
  - illustration_reference (which diagram shows this part)
  - notes (cross-references, serial number applicability, etc.)

## Conclusion

The RPS manual extraction is a substantial undertaking requiring careful planning and execution. The sample extractions above demonstrate the data structure and complexity involved. A hybrid approach using automated extraction with targeted manual review offers the best balance of efficiency and accuracy for this project.

**Estimated Total Data Volume**:
- 31 groups
- 1,500-2,000 parts
- 890 pages to process
- JSON output: ~500-800 KB
- Database: ~2,000 records

The extracted data will be invaluable for parts lookup, maintenance planning, and integration with Barry AI for technical support queries.
