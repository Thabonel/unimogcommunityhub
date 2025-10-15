# AI Prompt: Convert RPS PDFs to Barry-Compatible Knowledge Base

## Context
You have processed two RPS (Repair Parts and Special Tools List) PDFs for Mercedes Unimog:
- RPS-02155: Unimog GS Base Scale (930 pages, split into 10 chunks)
- RPS-02156: Unimog GS with Winch

These contain critical parts information that Barry the AI Mechanic needs to answer user questions about:
- Part numbers (NIIN/NSN)
- Part illustrations and locations
- Assembly diagrams
- Parts lists by group

## Your Task
Transform the RPS data into Barry's knowledge base format so users can ask:
- "What's the NIIN for the engine mounting bolt?"
- "Show me the illustration for GROUP AA"
- "Find parts for the winch assembly"
- "What repair grade is required for item 047?"

## Required Output Format

### 1. Create Structured Knowledge Entries (JSON)

For each functional group (AA, AB, AC, etc.), create:

```json
{
  "id": "rps-02155-group-aa",
  "rps_number": "02155",
  "group_code": "AA",
  "group_name": "Engine Assembly",
  "title": "RPS 02155 Group AA - Engine Parts and Assembly",
  "summary": "Complete parts list and illustrations for Unimog engine assembly including mounting, covers, and accessories",
  "content_type": "parts_catalog",
  "tags": ["rps", "parts", "engine", "group-aa", "niin"],

  "parts": [
    {
      "item_number": "001",
      "niin": "12-126-0420",
      "nsn": "2815-12-126-0420",
      "description": "Engine Mounting Bolt",
      "quantity": 4,
      "repair_grade": "L",
      "callout_number": "1",
      "illustration_page": 285,
      "chunk_file": "rps_02155_chunk_003_pages_0191-0285.pdf"
    }
  ],

  "illustrations": [
    {
      "figure_number": "AA-1",
      "page_number": 285,
      "chunk_file": "rps_02155_chunk_003_pages_0191-0285.pdf",
      "description": "Engine mounting assembly - exploded view",
      "callouts": ["1", "2", "3", "4", "5"]
    }
  ],

  "metadata": {
    "total_parts": 47,
    "illustration_count": 3,
    "page_range": "285-295",
    "chunk_number": 3,
    "vehicle_model": "Unimog GS Base",
    "rps_version": "02155"
  }
}
```

### 2. Create Barry-Friendly Answer Templates

For each group, generate natural language content:

```markdown
# RPS 02155 Group AA - Engine Assembly

## Overview
This group covers all engine assembly parts for the Mercedes Unimog GS Base model, including mounting hardware, covers, gaskets, and related components.

## Common Parts

### Engine Mounting (Items 001-010)
- **Item 001** (NIIN: 12-126-0420): Engine mounting bolt, quantity 4, repair grade L
  - See Figure AA-1, callout 1 on page 285
- **Item 002** (NIIN: 12-126-0421): Mounting washer, quantity 4, repair grade L
  - See Figure AA-1, callout 2 on page 285

### Engine Covers (Items 011-025)
[Continue for all items...]

## Illustrations
- **Figure AA-1** (Page 285): Engine mounting assembly - exploded view
- **Figure AA-2** (Page 287): Valve cover assembly

## Quick NIIN Reference
- 12-126-0420 → Engine mounting bolt (Item 001)
- 12-126-0421 → Mounting washer (Item 002)
[Continue...]

## Related Groups
- Group AB: Cooling system
- Group AC: Fuel system
- Group AD: Exhaust system
```

### 3. Create NIIN Lookup Index (JSON)

```json
{
  "niin_index": {
    "12-126-0420": {
      "nsn": "2815-12-126-0420",
      "description": "Engine mounting bolt",
      "group": "AA",
      "item": "001",
      "rps_numbers": ["02155"],
      "page": 285,
      "chunk": 3,
      "repair_grade": "L",
      "quantity": 4,
      "illustration": "AA-1",
      "callout": "1"
    }
  }
}
```

### 4. Create Search-Optimized Chunks

For Barry's manual_chunks table format:

```json
{
  "name": "RPS-02155-Unimog-GS-Base-Scale",
  "chunk_number": 1,
  "page_number": 285,
  "content": "GROUP AA - ENGINE ASSEMBLY\n\nItem 001: Engine Mounting Bolt\nNIIN: 12-126-0420\nNSN: 2815-12-126-0420\nQuantity: 4\nRepair Grade: L (Light)\nIllustration: Figure AA-1, Callout 1\n\nThis bolt is used to mount the engine to the chassis frame. Requires torque specification of 45 Nm. Part of the primary engine mounting system.",
  "metadata": {
    "group": "AA",
    "rps_number": "02155",
    "chunk_file": "rps_02155_chunk_003_pages_0191-0285.pdf",
    "contains_illustration": true,
    "part_niins": ["12-126-0420", "12-126-0421"]
  }
}
```

## Specific Instructions

### Step 1: Extract Group Information
For each chunk (especially chunks 3-10 which contain groups):

1. Identify group boundaries (AA, AB, AC, etc.)
2. Extract group name/description
3. Note page range for each group
4. List all illustrations (figure numbers and pages)

### Step 2: Parse Parts Lists
For each part in a group:

1. Extract item number (e.g., "001", "047")
2. Extract NIIN (format: XX-XXX-XXXX)
3. Extract NSN if available
4. Extract description (may need OCR)
5. Extract quantity
6. Extract repair grade (L/M/H)
7. Link to illustration callout number

### Step 3: Process Illustrations
For each illustration:

1. Note figure number (e.g., "AA-1")
2. Record page number
3. Identify which chunk contains it
4. Extract description/title
5. List all callout numbers visible
6. Link callouts to item numbers

### Step 4: Create Cross-References

Generate these lookup structures:

1. **NIIN → Part Details** (for "What is NIIN 12-126-0420?")
2. **Group → Parts List** (for "Show me all Group AA parts")
3. **Item Number → Full Details** (for "What is item 047?")
4. **Illustration → Parts** (for "What parts are in figure AA-1?")
5. **Page Number → Content** (for exact page lookups)

### Step 5: Generate Natural Language Summaries

For each group, write:

1. **Overview paragraph**: What this group covers
2. **Subgroup sections**: Organize by function (mounting, covers, etc.)
3. **Common questions**: Pre-answer frequent user queries
4. **Related groups**: Cross-link to related assemblies

## Data Quality Requirements

### Must Include
- ✅ All NIIN numbers exactly as shown
- ✅ Correct group codes (AA, AB, etc.)
- ✅ Accurate page references
- ✅ Chunk file names for AI retrieval
- ✅ Illustration figure numbers
- ✅ Callout numbers
- ✅ Repair grades (L/M/H)

### Validation Checks
- [ ] Every NIIN maps to exactly one part
- [ ] Every item number has a NIIN
- [ ] All page numbers are within chunk ranges
- [ ] All callout numbers link to items
- [ ] All illustrations are referenced
- [ ] No duplicate NIINs across groups

### Format Standards
- NIIN format: `XX-XXX-XXXX` (with dashes)
- NSN format: `XXXX-XX-XXX-XXXX`
- Group codes: Uppercase letters (AA, AB, AC)
- Item numbers: Zero-padded 3 digits (001, 047)
- Page numbers: 4 digits with leading zeros (0285)

## Expected Output Files

### For Barry's Database (manual_chunks table)
```
rps_02155_chunks/
├── group_aa_chunk_001.json    (Group AA parts + illustrations)
├── group_aa_chunk_002.json    (If group spans multiple pages)
├── group_ab_chunk_001.json    (Group AB parts + illustrations)
└── ...
```

### For Barry's Curated Knowledge (curated_knowledge table)
```
rps_knowledge/
├── rps_02155_group_aa.json    (Structured data + natural language)
├── rps_02155_group_ab.json
└── ...
```

### For Quick Lookups (JSON indexes)
```
rps_indexes/
├── niin_to_part.json          (Fast NIIN lookups)
├── group_to_parts.json        (Fast group lookups)
├── illustration_index.json    (Fast illustration lookups)
└── rps_master_index.json      (Combined index)
```

## Example User Questions Barry Should Answer

After processing, Barry should handle:

1. **"What is NIIN 12-126-0420?"**
   → "That's the engine mounting bolt from Group AA, item 001. It's used in the engine assembly, requires 4 bolts, and is shown in Figure AA-1, callout 1 on page 285. It's a light repair grade (L) part."

2. **"Show me Group AA parts"**
   → "Group AA covers Engine Assembly parts. Here are the main components: [lists parts with NIINs]. You can find the illustrations on pages 285-295 in chunk 3."

3. **"Find the illustration for the engine mounting"**
   → "The engine mounting assembly is shown in Figure AA-1 on page 285 (chunk 3: rps_02155_chunk_003_pages_0191-0285.pdf). The illustration shows an exploded view with callouts for items 001-010."

4. **"What repair grade is item 047?"**
   → "Item 047 from Group [XX] is repair grade [L/M/H]. [Description]. NIIN: [number]."

## Processing Priority

### High Priority (Do First)
1. Group AA (Engine) - Most commonly asked about
2. Group AB (Cooling) - Critical system
3. Group AC (Fuel) - Critical system
4. NIIN index for all groups

### Medium Priority
5. Groups AD-AZ (mechanical systems)
6. Illustration index
7. Cross-references

### Lower Priority
8. Front matter (pages 1-190)
9. Detailed NIIN index parsing (complex tables)
10. Statistical analysis

## Integration with Barry

### Database Tables to Populate

1. **manual_chunks** (existing)
   - name: "RPS-02155-Unimog-GS-Base-Scale"
   - chunk_number: Sequential
   - page_number: Actual page in PDF
   - content: Natural language + structured data
   - embedding: (Generated automatically)

2. **curated_knowledge** (existing)
   - category: "parts_catalog"
   - subcategory: "rps_02155"
   - title: "Group [XX] - [Name]"
   - content: Rich formatted content
   - tags: ["rps", "parts", "group-xx"]
   - attachments: JSON with structured data

3. **rps_parts** (new table - optional)
   - Dedicated parts table for fast lookups
   - Columns: niin, nsn, group, item, description, etc.

## Success Criteria

Barry should be able to:
- ✅ Answer NIIN lookup questions in <2 seconds
- ✅ Cite correct page numbers and chunks
- ✅ Reference correct illustrations
- ✅ Cross-reference related parts
- ✅ Explain repair grades and quantities
- ✅ Show exploded view diagrams
- ✅ Navigate between groups logically

## Next Steps After Processing

1. Upload JSON files to `/docs/barry/rps_data/`
2. Create migration to populate curated_knowledge table
3. Test Barry with sample questions
4. Verify chunk retrieval works correctly
5. Add RPS-02156 (Winch variant) using same process
6. Create admin UI for RPS part lookups

---

**Start with Group AA (Engine) as a proof of concept. Extract 10-20 parts with full details, illustrations, and NIINs. This will validate the approach before processing all 930 pages.**
