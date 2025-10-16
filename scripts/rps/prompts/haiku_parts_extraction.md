# Haiku 4 Prompt: RPS Parts Table Extraction

## Purpose
Extract parts data from RPS tables quickly and accurately.

## Model
Use: **Claude Haiku 4** (claude-haiku-4-20250514)

## Prompt Template

```
Extract ALL parts from this RPS parts table.

GROUP: [GROUP_CODE]
PAGE RANGE: [START]-[END]

OUTPUT: JSON array of parts

FORMAT:
[
  {
    "item_number": "001",
    "niin": "12-126-0420",
    "nsn": "5305-12-126-0420",
    "description": "Bolt, Machine: hex hd; w/locking feature",
    "quantity": 4,
    "repair_grade": "L"
  }
]

RULES:
1. Extract EVERY row in the table
2. NIIN format: XX-XXX-XXXX (if present)
3. NSN format: XXXX-XX-XXX-XXXX (if present)
4. Repair grade: L, M, or H only
5. Quantity: integer or null
6. Description: exact text from table
7. If field is blank/missing: use null

TABLE STRUCTURE:
- Column 1: Item Number (001, 002, 003...)
- Column 2: NIIN (XX-XXX-XXXX)
- Column 3: NSN (optional, XXXX-XX-XXX-XXXX)
- Column 4: Description
- Column 5: Quantity (Qty)
- Column 6: Repair Grade (L/M/H)

START: Row immediately after table header
STOP: When you see next group header or end of section

QUALITY CHECKS:
- Verify NIIN format (must be XX-XXX-XXXX)
- Item numbers sequential (001, 002, 003...)
- No duplicate NIINs
- Description not empty

OUTPUT: Valid JSON array only. No explanations.
```

## Example Usage

**Input**: Group AA parts table on pages 285-295

**Expected Output**:
```json
[
  {
    "item_number": "001",
    "niin": "12-126-0420",
    "nsn": "5305-12-126-0420",
    "description": "Bolt, Machine: hex hd; w/locking feature",
    "quantity": 4,
    "repair_grade": "L"
  },
  {
    "item_number": "002",
    "niin": "12-126-0436",
    "nsn": "5310-12-126-0436",
    "description": "Washer, Lock",
    "quantity": 4,
    "repair_grade": "L"
  },
  {
    "item_number": "003",
    "niin": "15-789-1234",
    "nsn": null,
    "description": "Mount, Engine",
    "quantity": 2,
    "repair_grade": "M"
  }
]
```

## Performance Expectations
- **Speed**: <30 seconds for 50 parts
- **Accuracy**: 99%+ on NIIN/NSN
- **Output**: Valid JSON (parseable)

## Error Handling
If table is unclear:
```json
{
  "error": "Unable to read table",
  "reason": "Poor scan quality on page 290",
  "partial_data": [...]
}
```
