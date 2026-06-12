# RPS Parts Catalog - Quick Start

## The Problem
Barry can't show parts lists because the RPS parts data isn't in the database yet.

## The Solution (3 Commands)

```bash
# 1. Set your API keys (one time)
export ANTHROPIC_API_KEY=<ANTHROPIC_API_KEY>
export VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# 2. Run the automated setup (30-45 minutes, costs ~$2.50)
cd /Users/thabonel/Code/unimogcommunityhub/scripts/rps
./complete-rps-setup.sh

# 3. Import to database (2-3 minutes)
npx tsx import-to-database.ts
```

## What This Does

1. **Extracts 24 RPS groups** from PDF chunks using Claude AI
   - Processes parts tables, illustrations, and metadata
   - Creates JSON files in `output/` directory
   - Takes 30-45 minutes, costs ~$2.50

2. **Uploads to Supabase Storage**
   - Stores JSON files in `rps-parts` bucket
   - Sets public read access
   - Takes 1-2 minutes

3. **Imports to Database**
   - Inserts ~1000+ parts into `rps_parts` table
   - Creates 24 groups in `rps_groups` table
   - Adds illustrations to `rps_illustrations` table
   - Takes 2-3 minutes

## Verify It Worked

Ask Barry:
```
"What is NIIN 12-126-0420?"
"Show me Group AA"
"Find transmission parts"
```

## Manual Steps (If Automated Fails)

```bash
# Step 1: Extract groups
npx tsx batch-extract-all.ts

# Step 2: Upload to storage
npx tsx upload-to-supabase.ts

# Step 3: Import to database
npx tsx import-to-database.ts
```

## Troubleshooting

### "Anthropic API key not set"
```bash
export ANTHROPIC_API_KEY=<ANTHROPIC_API_KEY>
```

### "Supabase credentials not set"
```bash
export VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
```

Get service role key: Supabase Dashboard → Settings → API → service_role

### "PDF chunks not found"
Ensure chunks exist in: `/Users/thabonel/Code/Work/rps_processed/`

### Check progress
```bash
# After extraction
ls -lh output/group_*.json | wc -l
# Should show 24

# After import
# Run in Supabase SQL Editor:
SELECT COUNT(*) FROM rps_parts;
# Should show ~1000+
```

## What You Get

- 24 RPS groups (AA-AZ)
- ~1000+ parts with NIIN/NSN
- Illustrations with callouts
- Full metadata (page numbers, repair grades, quantities)

## Full Documentation

See `README_COMPLETE_SETUP.md` for:
- Detailed explanations
- Cost breakdown
- File structure
- Troubleshooting guide
- Testing procedures
