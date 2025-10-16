# Sonnet 4 Prompt: RPS Cross-Reference Building

## Purpose
Build relationships, indexes, and metadata for the complete RPS catalog.

## Model
Use: **Claude Sonnet 4** (claude-sonnet-4-20250514)

## Prompt Template

```
You are building a comprehensive cross-reference system for an RPS parts catalog.

TASK: Analyze all extracted RPS data and create relationship indexes.

INPUT: All extracted group data (JSON files for groups AA-ZZ)

OUTPUT FORMAT (JSON):
{
  "niin_index": {
    "12-126-0420": {
      "description": "Bolt, Machine: hex hd; w/locking feature",
      "group": "AA",
      "group_name": "Engine Assembly",
      "item_number": "001",
      "rps_number": "02155",
      "page": 285,
      "chunk_file": "rps_02155_chunk_003_pages_0191-0285.pdf",
      "quantity": 4,
      "repair_grade": "L",
      "related_parts": ["12-126-0436", "15-789-1234"],
      "used_in_figures": ["AA-1"],
      "part_family": "fasteners"
    }
  },
  "group_index": {
    "AA-02155": {
      "code": "AA",
      "name": "Engine Assembly",
      "rps_number": "02155",
      "total_parts": 47,
      "page_range": "285-295",
      "chunk_file": "rps_02155_chunk_003_pages_0191-0285.pdf",
      "illustrations": 3,
      "related_groups": ["AB", "AC"]
    }
  },
  "part_families": {
    "fasteners": {
      "description": "Bolts, screws, washers, nuts",
      "niins": ["12-126-0420", "12-126-0436", "..."],
      "groups": ["AA", "AB", "AC"]
    },
    "seals": {
      "description": "Gaskets, O-rings, seals",
      "niins": ["..."],
      "groups": ["AA", "AB"]
    }
  },
  "relationships": [
    {
      "type": "used_together",
      "parts": ["12-126-0420", "12-126-0436"],
      "context": "Bolt and washer always used as pair"
    },
    {
      "type": "assembly",
      "parent": "15-789-1234",
      "children": ["12-126-0420", "12-126-0436"],
      "context": "Mounting bolts for engine mount"
    }
  ],
  "compatibility_matrix": {
    "by_vehicle": {
      "U1700L": {
        "groups": ["AA", "AB", "AC", "..."],
        "total_parts": 1247
      }
    }
  }
}

INSTRUCTIONS:
1. Load all group JSON files
2. Create master NIIN index (all parts across all groups)
3. Create master group index (metadata for each group)
4. Identify part families:
   - Fasteners (bolts, washers, nuts)
   - Seals (gaskets, O-rings)
   - Filters
   - Electrical components
   - Hydraulic components
5. Detect relationships:
   - Parts used together (kits, assemblies)
   - Parent-child relationships
   - Cross-group references
6. Build compatibility matrix
7. Flag any inconsistencies:
   - Duplicate NIINs across groups
   - Missing cross-references
   - Orphaned parts (no figure reference)

IMPORTANT:
- Every NIIN must be unique across entire catalog
- Identify mounting kits, gasket sets, etc.
- Note parts that appear in multiple groups
- Flag quality issues for manual review
```

## Example Usage

**Input**: All group JSON files (AA.json, AB.json, AC.json, ...)

**Expected Output** (excerpt):
```json
{
  "niin_index": {
    "12-126-0420": {
      "description": "Bolt, Machine: hex hd; w/locking feature",
      "group": "AA",
      "group_name": "Engine Assembly",
      "item_number": "001",
      "rps_number": "02155",
      "page": 285,
      "chunk_file": "rps_02155_chunk_003_pages_0191-0285.pdf",
      "quantity": 4,
      "repair_grade": "L",
      "related_parts": ["12-126-0436"],
      "used_in_figures": ["AA-1"],
      "part_family": "fasteners",
      "keywords": ["bolt", "mounting", "engine", "hex head"]
    }
  },
  "part_families": {
    "fasteners": {
      "description": "Bolts, screws, washers, nuts, clips",
      "niins": ["12-126-0420", "12-126-0436", "12-127-0001", "..."],
      "groups": ["AA", "AB", "AC", "AD", "AE"],
      "total_count": 156
    },
    "seals_gaskets": {
      "description": "Gaskets, O-rings, seals, packing",
      "niins": ["20-345-6789", "20-345-6790", "..."],
      "groups": ["AA", "AB", "AC"],
      "total_count": 89
    }
  },
  "relationships": [
    {
      "type": "mounting_kit",
      "description": "Engine mounting hardware kit",
      "parts": [
        {"niin": "12-126-0420", "description": "Bolt x4"},
        {"niin": "12-126-0436", "description": "Washer x4"},
        {"niin": "15-789-1234", "description": "Mount x1"}
      ],
      "figure": "AA-1"
    }
  ]
}
```

## Success Criteria
- All NIINs indexed with complete metadata
- All groups cataloged
- Part families identified logically
- Relationships detected accurately
- No duplicate NIINs
- Quality issues flagged
