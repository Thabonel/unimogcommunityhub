# RPS Cleanup and Synchronization Plan

## Current Situation

**Database**: 727 RPS entries, but only 536 unique page numbers (191 duplicates!)
**Local Files**: 627 PNG files in `/scripts/rps/output/ai_illustrations`
**Problem**: Files and database don't match, duplicates exist, numbering is scattered (0-929)

## Discovered Issues

From the first 50 database records, I can see:
- Multiple entries with same page_number (e.g., page 0 has 3 entries, page 1 has 12 entries!)
- Some entries have `page_image_url` pointing to old locations
- Some entries have `null` for `page_image_url`
- Some are from RPS 02202 (different manual!)

## Solution Approach

### Step 1: Clean Database First
**Delete ALL RPS entries and start fresh** - This is cleanest approach given the mess

```sql
-- Option A: Nuclear option (recommended)
DELETE FROM manual_chunks
WHERE manual_title LIKE '%RPS%' OR manual_title LIKE '%02155%';
```

### Step 2: Process 627 Local Files
Use the batch-001.json as a template to process ALL 627 files:
- Read each PNG image
- Extract title, group code, type (exploded view vs parts list)
- For parts lists: Extract item numbers and part numbers
- Build clean JSON structure

### Step 3: Generate Clean SQL
Create INSERT statements for all 627 files:
- Sequential page numbers 1-627
- Correct image URLs
- Proper metadata
- No duplicates!

### Step 4: Upload Files
- Delete old RPS files from Supabase storage
- Upload renumbered files (rps_page_0001.png → rps_page_0627.png)

### Step 5: Insert Clean Data
- Execute the generated SQL
- Result: 627 clean entries matching 627 files

## Why This Is Better

**Current approach problems**:
- Trying to match messy database to files is complex
- 191 duplicates to identify and remove
- Old RPS 02202 entries mixed in
- Scattered page numbers (0-929)

**Clean slate benefits**:
- Start with known good data (627 files)
- No duplicate detection needed
- Sequential numbering guaranteed
- Can extract actual data from images

## Next Steps

**Option 1 - Nuclear Clean** (Recommended):
1. Delete all RPS entries from database
2. Process all 627 PNGs (like we did for batch 1)
3. Generate 627 INSERT statements
4. Upload files and execute SQL

**Option 2 - Careful Matching** (Current plan):
1. Export all 727 database entries
2. Match to 627 files
3. Identify 191 duplicates
4. Generate UPDATE + DELETE SQL
5. Renumber files
6. Upload and execute

## Recommendation

Go with Option 1 (Nuclear Clean). Given:
- Week of struggling with this
- Clear evidence of database corruption
- We have the source files (627 PNGs)
- We can extract everything from the images
- Cleaner, faster, guaranteed correct result

**Time estimate**:
- Option 1: 2-3 hours to process all files, generate SQL, upload
- Option 2: Unknown (already spent a week)

## Your Decision

Which approach do you want to take?
