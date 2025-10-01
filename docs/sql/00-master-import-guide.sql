-- WIS Complete Import Script
-- Run each numbered SQL file in order in Supabase SQL Editor
-- https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

-- Step 1: Run 01-create-vehicle-models.sql
-- This creates all the Unimog vehicle models in the database

-- Step 2: Run 02-import-procedures.sql
-- This imports 3,234 procedures with full content

-- Step 3: Run 03-import-parts.sql
-- This imports Mercedes parts database

-- Step 4: Run 04-import-bulletins.sql
-- This imports technical bulletins

-- After import, verify with:
SELECT 
  (SELECT COUNT(*) FROM wis_models) as models,
  (SELECT COUNT(*) FROM wis_procedures) as procedures,
  (SELECT COUNT(*) FROM wis_parts) as parts,
  (SELECT COUNT(*) FROM wis_bulletins) as bulletins;

-- Expected results:
-- models: 40+
-- procedures: 3,234
-- parts: 197+
-- bulletins: varies