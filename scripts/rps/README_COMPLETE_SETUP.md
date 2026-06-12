# RPS Parts Catalog - Complete Setup Guide

## Problem Statement
Barry can't show parts lists because the RPS parts data isn't uploaded to the database yet. The extraction scripts exist, but data needs to be processed and imported.

## Solution Overview
This directory contains a complete automated pipeline to:
1. Extract all RPS groups from PDF chunks using Claude AI
2. Upload extracted JSON files to Supabase Storage
3. Import data into database tables for Barry to query

## Current Status

✅ **Infrastructure Complete:**
- PDF chunks split (10 files, 95 pages each)
- TypeScript extraction scripts written
- Database schema exists (rps_parts, rps_groups, rps_illustrations)
- Barry integration code ready

❌ **Data Missing:**
- Extraction not run yet (no JSON files in `output/`)
- Database tables empty
- Barry can detect RPS queries but has no data to return

## Quick Start (3 Commands)

```bash
# 1. Set environment variables
export ANTHROPIC_API_KEY=<ANTHROPIC_API_KEY>
export VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# 2. Run complete setup (extraction + upload)
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps
./complete-rps-setup.sh

# 3. Import to database
npx tsx import-to-database.ts
```

That's it! Barry will now have access to all RPS parts data.

## What Each Script Does

### 1. `batch-extract-all.ts`
**Purpose:** Process all 24 RPS groups from PDF chunks using Claude AI

**Input:** PDF chunks in `/Users/thabonel/Code/Work/rps_processed/`

**Output:**
- `output/group_aa_complete.json` (24 files)
- `output/extraction_summary.json`

**How it works:**
1. For each chunk, run Sonnet discovery to find groups
2. For each group, run Haiku to extract parts table
3. Run Sonnet to analyze illustrations
4. Validate and combine into complete JSON

**Cost:** ~$2.50 (Anthropic API)
**Time:** 30-45 minutes

**Run it:**
```bash
npx tsx batch-extract-all.ts
```

### 2. `upload-to-supabase.ts`
**Purpose:** Upload all extracted JSON files to Supabase Storage

**Input:** `output/group_*_complete.json` files

**Output:**
- Files in Supabase Storage bucket `rps-parts/groups/`
- `output/upload_summary.json`

**How it works:**
1. Create bucket `rps-parts` (if not exists)
2. Upload each group JSON file
3. Set public read access

**Cost:** Free (within Supabase limits)
**Time:** 1-2 minutes

**Run it:**
```bash
npx tsx upload-to-supabase.ts
```

### 3. `import-to-database.ts` (TO BE CREATED)
**Purpose:** Import JSON data into database tables

**Input:** JSON files from Supabase Storage

**Output:**
- Rows in `rps_parts` table
- Rows in `rps_groups` table
- Rows in `rps_illustrations` table

**How it works:**
1. Download each group JSON from storage
2. Parse and insert into database tables
3. Handle duplicates (upsert)

**Cost:** Free
**Time:** 2-3 minutes

### 4. `complete-rps-setup.sh`
**Purpose:** Run all steps in sequence (orchestrator)

**Runs:**
1. Install dependencies
2. Run batch extraction
3. Upload to storage
4. Verify results

## Manual Step-by-Step

### Prerequisites

1. **Install dependencies:**
```bash
npm install @anthropic-ai/sdk @supabase/supabase-js dotenv tsx
```

2. **Set environment variables:**
```bash
export ANTHROPIC_API_KEY=<ANTHROPIC_API_KEY>
export VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
```

Get service role key from: Supabase Dashboard → Settings → API → service_role

### Step 1: Extract Groups

```bash
npx tsx batch-extract-all.ts
```

**What happens:**
- Processes chunks 003-010 (8 chunks)
- Extracts 24 groups (AA through AZ, skipping some)
- Creates `output/group_*_complete.json` files
- Takes 30-45 minutes
- Costs ~$2.50

**Check progress:**
```bash
ls -lh output/group_*.json | wc -l
# Should show 24 files when complete
```

**Check extraction summary:**
```bash
cat output/extraction_summary.json | jq '.successful'
# Should show 24
```

### Step 2: Upload to Storage

```bash
npx tsx upload-to-supabase.ts
```

**What happens:**
- Creates bucket `rps-parts` if needed
- Uploads all 24 group JSON files
- Sets public read access
- Takes 1-2 minutes

**Verify uploads:**
```bash
cat output/upload_summary.json | jq '.successful_uploads'
# Should show 24
```

Or check Supabase Dashboard → Storage → rps-parts → groups/

### Step 3: Import to Database

```bash
npx tsx import-to-database.ts
```

**What happens:**
- Reads JSON files from storage
- Inserts into database tables
- Handles duplicates
- Takes 2-3 minutes

**Verify database:**
```sql
-- Check parts count
SELECT COUNT(*) FROM rps_parts;
-- Should show ~1000+ parts

-- Check groups
SELECT group_code, group_name, total_parts
FROM rps_groups
ORDER BY group_code;
-- Should show 24 groups
```

## Database Schema

Already exists in production (created in earlier migration):

```sql
-- Parts table
CREATE TABLE rps_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niin VARCHAR(12) UNIQUE NOT NULL,
  nsn VARCHAR(16),
  group_code VARCHAR(3) NOT NULL,
  item_number VARCHAR(3) NOT NULL,
  description TEXT NOT NULL,
  rps_number VARCHAR(5) DEFAULT '02155',
  quantity INT,
  repair_grade CHAR(1),
  page_number INT,
  chunk_file VARCHAR(100),
  figure_reference VARCHAR(10),
  callout VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Groups table
CREATE TABLE rps_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rps_number VARCHAR(5) DEFAULT '02155',
  group_code VARCHAR(3) UNIQUE NOT NULL,
  group_name TEXT NOT NULL,
  total_parts INT,
  page_start INT,
  page_end INT,
  chunk_file VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Illustrations table
CREATE TABLE rps_illustrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rps_number VARCHAR(5) DEFAULT '02155',
  group_code VARCHAR(3) NOT NULL,
  figure_number VARCHAR(10) NOT NULL,
  description TEXT,
  page_number INT,
  callouts JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Testing Barry

After import complete, test Barry:

```
Query: "What is NIIN 12-126-0420?"
Expected: Barry returns part description, group, page number

Query: "Show me Group AA"
Expected: Barry lists first 10 parts from engine group

Query: "Find transmission parts"
Expected: Barry searches descriptions and returns matches
```

## Troubleshooting

### Extraction Fails
```bash
# Check PDF files exist
ls /Users/thabonel/Code/Work/rps_processed/*.pdf

# Check API key
echo $ANTHROPIC_API_KEY

# Check logs
cat output/extraction_summary.json | jq '.results[] | select(.success == false)'
```

### Upload Fails
```bash
# Check Supabase credentials
echo $VITE_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY | cut -c1-20

# Check bucket exists
# Go to Supabase Dashboard → Storage

# Check upload summary
cat output/upload_summary.json | jq '.results[] | select(.uploaded == false)'
```

### Import Fails
```bash
# Check database connection
npx tsx -e "import { createClient } from '@supabase/supabase-js'; const s = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); const r = await s.from('rps_parts').select('count'); console.log(r);"

# Check table exists
# Run in Supabase SQL Editor:
SELECT table_name FROM information_schema.tables
WHERE table_name LIKE 'rps_%';
```

## File Structure

```
scripts/rps/
├── README.md                    # Overview (existing)
├── README_COMPLETE_SETUP.md     # This file
├── anthropic-client.ts          # API wrappers
├── extract-group.ts             # Single group extraction
├── batch-extract-all.ts         # Batch extraction (NEW)
├── upload-to-supabase.ts        # Storage upload (NEW)
├── import-to-database.ts        # DB import (TO CREATE)
├── complete-rps-setup.sh        # Full pipeline (NEW)
├── prompts/
│   ├── sonnet_discovery.md
│   ├── sonnet_illustrations.md
│   ├── haiku_parts_extraction.md
│   └── haiku_validation.md
└── output/                      # Generated files
    ├── chunk_*_discovery.json
    ├── group_*_complete.json
    ├── extraction_summary.json
    └── upload_summary.json
```

## Cost Breakdown

| Step | Service | Cost |
|------|---------|------|
| Extraction | Anthropic API | ~$2.50 |
| Upload | Supabase Storage | Free |
| Import | Database ops | Free |
| **Total** | | **~$2.50** |

## Time Estimate

| Step | Time |
|------|------|
| Extraction | 30-45 min |
| Upload | 1-2 min |
| Import | 2-3 min |
| **Total** | **~35-50 min** |

## Next Steps

After data is imported:

1. ✅ Test Barry queries
2. ✅ Deploy to staging
3. ✅ User acceptance testing
4. ✅ Deploy to production
5. Document in Linear (WHE-36, WHE-37)

## Support

Questions? Check:
- Original README: `scripts/rps/README.md`
- Linear issue: WHE-36 (RPS Integration)
- Linear issue: WHE-37 (Phase 2 Complete)
- Barry edge function: `supabase/functions/chat-with-barry/index.ts`
- RPS search module: `supabase/functions/chat-with-barry/rps-search.ts`
