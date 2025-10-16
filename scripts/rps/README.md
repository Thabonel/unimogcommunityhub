# RPS Extraction Scripts

## Overview
Scripts for extracting RPS (Repair Parts Scale) data and importing into Barry's knowledge base.

## Prerequisites

```bash
npm install @anthropic-ai/sdk dotenv
```

## Environment Variables

Add to `.env.local`:
```bash
ANTHROPIC_API_KEY=your_api_key_here
```

## Directory Structure

```
scripts/rps/
├── README.md                    # This file
├── prompts/                     # Model-specific prompts
│   ├── sonnet_discovery.md     # PDF chunk scanning
│   ├── sonnet_illustrations.md # Figure analysis
│   ├── sonnet_crossref.md      # Relationship building
│   ├── haiku_parts_extraction.md # Table extraction
│   └── haiku_validation.md     # Data validation
├── extract_group.ts            # Main orchestrator
├── call_sonnet.ts              # Sonnet API wrapper
├── call_haiku.ts               # Haiku API wrapper
├── validate_data.ts            # Validation script
└── import_to_supabase.ts       # Database import
```

## Usage

### Step 1: Discover Groups in Chunk
```bash
npm run rps:discover -- --chunk 003
```

Output: `output/chunk_003_discovery.json`

### Step 2: Extract Group Data
```bash
npm run rps:extract -- --group AA --chunk 003
```

Output: `output/group_aa_parts.json`

### Step 3: Analyze Illustrations
```bash
npm run rps:illustrations -- --group AA
```

Output: `output/group_aa_illustrations.json`

### Step 4: Validate Data
```bash
npm run rps:validate -- --group AA
```

Output: Validation report

### Step 5: Import to Supabase
```bash
npm run rps:import -- --group AA
```

## Workflow Example

```bash
# Process Group AA from chunk 003
npm run rps:discover -- --chunk 003
npm run rps:extract -- --group AA --chunk 003
npm run rps:illustrations -- --group AA
npm run rps:validate -- --group AA
npm run rps:import -- --group AA
```

## Output Files

All output goes to `scripts/rps/output/`:
```
output/
├── chunk_003_discovery.json    # Groups found in chunk
├── group_aa_parts.json         # Extracted parts
├── group_aa_illustrations.json # Figure analysis
├── group_aa_validation.json    # Validation report
└── group_aa_final.json         # Ready for import
```

## Cost Estimates

Per group:
- Discovery (Sonnet): $0.05
- Parts extraction (Haiku): $0.01
- Illustrations (Sonnet): $0.03
- Validation (Haiku): $0.005
- **Total**: ~$0.095 per group

Full catalog (26 groups): ~$2.50

## Troubleshooting

### API Key Not Found
```bash
export ANTHROPIC_API_KEY=your_key_here
```

### Rate Limits
Scripts include automatic retry with exponential backoff.

### PDF Not Found
Ensure PDF chunks are in `/Users/thabonel/Code/Work/rps_processed/`

## Next Steps

After extraction complete:
1. Review validation reports
2. Fix any critical errors
3. Import to Supabase
4. Test Barry queries
5. Deploy UI components
