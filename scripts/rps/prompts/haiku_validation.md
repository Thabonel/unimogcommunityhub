# Haiku 4 Prompt: RPS Data Validation

## Purpose
Validate extracted RPS data for errors, duplicates, and format issues.

## Model
Use: **Claude Haiku 4** (claude-haiku-4-20250514)

## Prompt Template

```
Validate this RPS parts data.

INPUT: JSON array of parts

CHECKS:
1. NIIN format: XX-XXX-XXXX
2. NSN format: XXXX-XX-XXX-XXXX (if present)
3. Item numbers sequential (no gaps)
4. No duplicate NIINs
5. Repair grade: L, M, or H only
6. Quantity: positive integer or null
7. Description: not empty

OUTPUT FORMAT:
{
  "valid": true|false,
  "total_parts": N,
  "errors": [
    {
      "item_number": "005",
      "error_type": "invalid_niin_format",
      "message": "NIIN '12-1260420' missing dash",
      "severity": "critical"
    }
  ],
  "warnings": [
    {
      "item_number": "010",
      "warning_type": "missing_nsn",
      "message": "NSN field empty",
      "severity": "minor"
    }
  ],
  "duplicates": [
    {
      "niin": "12-126-0420",
      "items": ["001", "025"],
      "message": "NIIN appears twice"
    }
  ],
  "statistics": {
    "valid_niins": 45,
    "invalid_niins": 2,
    "missing_quantities": 3,
    "repair_grade_l": 30,
    "repair_grade_m": 15,
    "repair_grade_h": 2
  }
}

ERROR TYPES:
- invalid_niin_format: NIIN doesn't match XX-XXX-XXXX
- invalid_nsn_format: NSN doesn't match XXXX-XX-XXX-XXXX
- duplicate_niin: Same NIIN appears multiple times
- missing_description: Description field empty
- invalid_repair_grade: Grade not L, M, or H
- negative_quantity: Quantity less than 0
- non_sequential_items: Item numbers skip (001, 002, 004)

SEVERITY LEVELS:
- critical: Must fix before import
- warning: Should review but can proceed
- minor: Informational only

RULES:
- Flag ALL issues
- No false positives
- Clear, actionable messages
- Statistics for overview
```

## Example Usage

**Input**:
```json
[
  {
    "item_number": "001",
    "niin": "12-126-0420",
    "nsn": "5305-12-126-0420",
    "description": "Bolt, Machine",
    "quantity": 4,
    "repair_grade": "L"
  },
  {
    "item_number": "002",
    "niin": "12-1260436",
    "nsn": null,
    "description": "Washer",
    "quantity": 4,
    "repair_grade": "X"
  }
]
```

**Expected Output**:
```json
{
  "valid": false,
  "total_parts": 2,
  "errors": [
    {
      "item_number": "002",
      "error_type": "invalid_niin_format",
      "message": "NIIN '12-1260436' missing second dash (should be 12-126-0436)",
      "severity": "critical"
    },
    {
      "item_number": "002",
      "error_type": "invalid_repair_grade",
      "message": "Repair grade 'X' invalid (must be L, M, or H)",
      "severity": "critical"
    }
  ],
  "warnings": [
    {
      "item_number": "002",
      "warning_type": "missing_nsn",
      "message": "NSN field empty",
      "severity": "minor"
    }
  ],
  "duplicates": [],
  "statistics": {
    "valid_niins": 1,
    "invalid_niins": 1,
    "missing_quantities": 0,
    "repair_grade_l": 1,
    "repair_grade_m": 0,
    "repair_grade_h": 0,
    "repair_grade_invalid": 1
  }
}
```

## Performance Expectations
- **Speed**: <5 seconds for 100 parts
- **Accuracy**: 100% error detection
- **Output**: Valid JSON

## Success Criteria
- All format errors detected
- All duplicates found
- Clear error messages
- Actionable recommendations
