# Sonnet 4 Prompt: RPS Chunk Discovery

## Purpose
Scan an RPS PDF chunk to identify groups, page ranges, and extraction readiness.

## Model
Use: **Claude Sonnet 4** (claude-sonnet-4-20250514)

## Prompt Template

```
You are analyzing an RPS (Repair Parts Scale) document chunk for the Unimog U1700L.

TASK: Scan this PDF chunk and provide a structured analysis.

INPUT: rps_02155_chunk_XXX_pages_XXXX-XXXX.pdf

OUTPUT FORMAT (JSON):
{
  "chunk_info": {
    "chunk_number": "XXX",
    "page_range": "XXXX-XXXX",
    "total_pages": N,
    "scan_quality": "excellent|good|fair|poor"
  },
  "groups_found": [
    {
      "group_code": "AA",
      "group_name": "Engine Assembly",
      "page_start": 285,
      "page_end": 295,
      "estimated_parts": 47,
      "has_illustrations": true,
      "illustration_count": 3,
      "table_quality": "clear|readable|unclear",
      "notes": "Any issues or observations"
    }
  ],
  "quality_issues": [
    "List any: smudges, missing pages, unclear text, etc."
  ],
  "extraction_ready": true,
  "recommendations": "Next steps for extraction"
}

INSTRUCTIONS:
1. Scan through the entire PDF chunk page by page
2. Identify group headers (look for "GROUP XX" or similar)
3. Note where each group starts and ends
4. Estimate the number of parts in each group's table
5. Check for illustrations (Figure XX-N)
6. Assess table clarity and scan quality
7. Flag any quality issues that might affect extraction
8. Determine if this chunk is ready for automated extraction

IMPORTANT:
- Be thorough - scan EVERY page
- Note partial groups (groups that span chunks)
- Flag unclear NIIN numbers or missing data
- Identify handwritten annotations
- Note any non-standard formatting
```

## Example Usage

**Input**: `rps_02155_chunk_003_pages_0191-0285.pdf`

**Expected Output**:
```json
{
  "chunk_info": {
    "chunk_number": "003",
    "page_range": "0191-0285",
    "total_pages": 95,
    "scan_quality": "excellent"
  },
  "groups_found": [
    {
      "group_code": "AA",
      "group_name": "Engine Assembly",
      "page_start": 285,
      "page_end": 295,
      "estimated_parts": 47,
      "has_illustrations": true,
      "illustration_count": 3,
      "table_quality": "clear",
      "notes": "Clean tables, all NIINs readable"
    },
    {
      "group_code": "AB",
      "group_name": "Cooling System",
      "page_start": 220,
      "page_end": 240,
      "estimated_parts": 32,
      "has_illustrations": true,
      "illustration_count": 2,
      "table_quality": "clear",
      "notes": "Minor smudge on page 235 but readable"
    }
  ],
  "quality_issues": [],
  "extraction_ready": true,
  "recommendations": "Proceed with Haiku extraction for parts tables. Use Sonnet for illustration analysis."
}
```

## Success Criteria
- All groups in chunk identified
- Page ranges accurate (±1 page acceptable)
- Part counts estimated (±5 acceptable)
- Quality issues flagged
- Clear extraction recommendation
