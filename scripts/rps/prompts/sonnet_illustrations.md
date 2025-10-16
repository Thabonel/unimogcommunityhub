# Sonnet 4 Prompt: RPS Illustration Analysis

## Purpose
Analyze RPS illustrations, extract callouts, and link to parts table items.

## Model
Use: **Claude Sonnet 4** (claude-sonnet-4-20250514)

## Prompt Template

```
You are analyzing technical illustrations from an RPS (Repair Parts Scale) document.

TASK: Extract detailed information from RPS illustrations and link callouts to parts.

INPUT:
- PDF pages containing Figure XX-N
- Associated parts table for Group XX

OUTPUT FORMAT (JSON):
{
  "group_code": "AA",
  "illustrations": [
    {
      "figure_number": "AA-1",
      "page_number": 285,
      "title": "Engine Mounting Assembly",
      "description": "Exploded view showing engine mount installation with bolt pattern",
      "view_type": "exploded|assembled|cutaway|detail",
      "callouts": {
        "1": {
          "item_number": "001",
          "niin": "12-126-0420",
          "description": "Bolt, Machine",
          "location": "top-left mounting point"
        },
        "2": {
          "item_number": "002",
          "niin": "12-126-0436",
          "description": "Washer, Lock",
          "location": "under bolt head"
        }
      },
      "assembly_notes": [
        "Install bolts finger-tight before final torque",
        "Torque to 45 ft-lbs in cross pattern"
      ],
      "related_figures": ["AA-2"]
    }
  ],
  "cross_references": [
    {
      "from_figure": "AA-1",
      "to_figure": "AA-2",
      "relationship": "detail_view|assembly_sequence|alternate_view"
    }
  ]
}

INSTRUCTIONS:
1. Identify all figures in the group (AA-1, AA-2, etc.)
2. For each figure:
   - Note the page number
   - Read the figure title/caption
   - Describe what the illustration shows
   - Identify the view type (exploded, assembled, etc.)
3. Extract ALL callout numbers visible in the illustration
4. Match each callout to:
   - The corresponding item number from the parts table
   - The NIIN (cross-reference with table)
   - Part description
5. Note any assembly instructions or warnings
6. Identify relationships between figures
7. Flag any callouts that don't match the parts table

IMPORTANT:
- Match callouts precisely to table items
- Note if callouts are unclear or ambiguous
- Identify sub-assemblies shown in illustrations
- Extract torque specs, warnings, notes
- Note if figure references another group
```

## Example Usage

**Input**:
- Figure AA-1 on page 285
- Group AA parts table

**Expected Output**:
```json
{
  "group_code": "AA",
  "illustrations": [
    {
      "figure_number": "AA-1",
      "page_number": 285,
      "title": "Engine Mounting Assembly",
      "description": "Exploded view showing engine mount installation with four-point bolt pattern and anti-vibration washers",
      "view_type": "exploded",
      "callouts": {
        "1": {
          "item_number": "001",
          "niin": "12-126-0420",
          "description": "Bolt, Machine: hex hd; w/locking feature",
          "location": "four mounting points (corners)"
        },
        "2": {
          "item_number": "002",
          "niin": "12-126-0436",
          "description": "Washer, Lock",
          "location": "under each bolt head"
        },
        "3": {
          "item_number": "003",
          "niin": "15-789-1234",
          "description": "Mount, Engine",
          "location": "center assembly"
        },
        "4": {
          "item_number": "004",
          "niin": "15-789-1235",
          "description": "Plate, Mounting",
          "location": "base plate"
        }
      },
      "assembly_notes": [
        "Install bolts (item 1) finger-tight in cross pattern before final torque",
        "Apply anti-seize to threads",
        "Torque to 45 ft-lbs (61 Nm) in cross pattern",
        "Verify mount alignment before final torque"
      ],
      "related_figures": ["AA-2"]
    }
  ],
  "cross_references": [
    {
      "from_figure": "AA-1",
      "to_figure": "AA-2",
      "relationship": "assembly_sequence"
    }
  ]
}
```

## Success Criteria
- All figures in group analyzed
- All callouts matched to parts table
- Assembly instructions extracted
- Cross-references identified
- No orphaned callouts (callouts without table match)
