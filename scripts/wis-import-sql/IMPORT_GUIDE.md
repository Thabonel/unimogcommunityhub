# WIS Database Import Guide

## ✅ Prerequisites
- Fixed UUID casting in all SQL files
- Split procedures into 33 manageable chunks (~230KB each)
- All SQL files ready for import

## 📋 Import Order

### Step 1: Create Vehicle Models
```sql
-- File: 01-create-vehicle-models-fixed.sql
-- Creates 42 Unimog vehicle models
-- Run in: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
```

### Step 2: Import Procedures (33 chunks)
```sql
-- Directory: procedures-chunks/
-- Total: 6,468 procedures across 33 files
-- Run each file in order: chunk-01 through chunk-33
-- Each chunk contains 200 procedures (last chunk has 68)
```

**Files to run in order:**
1. `procedures-chunks/chunk-01-procedures.sql` (200 procedures)
2. `procedures-chunks/chunk-02-procedures.sql` (200 procedures)
3. `procedures-chunks/chunk-03-procedures.sql` (200 procedures)
... continue through ...
33. `procedures-chunks/chunk-33-procedures.sql` (68 procedures)

### Step 3: Import Parts
```sql
-- File: 03-import-parts.sql
-- Imports Mercedes parts database (197+ parts)
```

### Step 4: Import Bulletins
```sql
-- File: 04-import-bulletins.sql
-- Imports technical bulletins
```

## 🔍 Verification Queries

After completing all imports, run these verification queries:

```sql
-- Check totals
SELECT 
  (SELECT COUNT(*) FROM wis_models) as models,
  (SELECT COUNT(*) FROM wis_procedures) as procedures,
  (SELECT COUNT(*) FROM wis_parts) as parts,
  (SELECT COUNT(*) FROM wis_bulletins) as bulletins;

-- Expected results:
-- models: 42
-- procedures: 6,468
-- parts: 197+
-- bulletins: varies

-- Check procedures by vehicle
SELECT 
  m.model_name,
  COUNT(p.id) as procedure_count
FROM wis_models m
LEFT JOIN wis_procedures p ON p.vehicle_id = m.id
GROUP BY m.model_name
ORDER BY procedure_count DESC;

-- Check parts by category
SELECT 
  category,
  COUNT(*) as part_count
FROM wis_parts
GROUP BY category
ORDER BY part_count DESC;
```

## ⚡ Quick Import Instructions

1. Open Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

2. Run vehicle models first:
   - Copy contents of `01-create-vehicle-models-fixed.sql`
   - Paste and execute

3. Import procedures (this will take time):
   - Run each chunk file in sequence
   - Each chunk takes ~5-10 seconds
   - Total time: ~5-10 minutes for all 33 chunks

4. Import parts:
   - Copy contents of `03-import-parts.sql`
   - Paste and execute

5. Import bulletins:
   - Copy contents of `04-import-bulletins.sql`
   - Paste and execute

6. Run verification queries to confirm success

## 🎯 Success Indicators
- ✅ No UUID casting errors
- ✅ All chunks execute without timeout
- ✅ Verification shows expected counts
- ✅ No duplicate key violations

## 🔧 Troubleshooting

### If a chunk fails:
1. Check which procedure number it failed on
2. The error message will indicate the issue
3. Each chunk is independent - you can retry

### If you get timeout errors:
1. Chunks are already optimized at 200 procedures each
2. Try running during off-peak hours
3. Contact Supabase support if persistent

## 📊 Data Summary
- **Vehicle Models**: 42 Unimog models from U20 to U5023
- **Procedures**: 6,468 technical procedures with full content
- **Parts**: 197+ Mercedes parts with specifications
- **Bulletins**: Technical bulletins and service updates