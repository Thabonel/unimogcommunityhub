-- Simple fix for U1700L - only uses columns that exist
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

-- Step 1: Update vehicle descriptions
UPDATE wis_models 
SET 
  model_name = 'Unimog U1700L (435 Series)',
  description = 'Heavy-duty Unimog 435 series (Australia) - shares platform with U1300L'
WHERE id = '22222222-2222-2222-2222-222222222222';

UPDATE wis_models 
SET 
  model_name = 'Unimog U1300L (435 Series)',
  description = 'Medium-duty Unimog 435 series with OM366 engine'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Step 2: Check what procedures exist for U1700L
SELECT COUNT(*) as total_procedures,
       COUNT(CASE WHEN procedure_code LIKE 'U2000%' THEN 1 END) as u2000_procedures,
       COUNT(CASE WHEN procedure_code NOT LIKE 'U2000%' THEN 1 END) as other_procedures
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

-- Step 3: Delete U2000 procedures from U1700L
DELETE FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
AND procedure_code LIKE 'U2000%';

-- Step 4: Check if U1300L has any procedures to copy
SELECT COUNT(*) as u1300l_procedures 
FROM wis_procedures 
WHERE vehicle_id = '11111111-1111-1111-1111-111111111111';

-- Step 5: If U1300L has procedures, copy them to U1700L
-- Only copy columns that exist in the table
INSERT INTO wis_procedures (
  vehicle_id,
  procedure_code,
  title,
  category,
  subcategory,
  description,
  content,
  difficulty_level,
  estimated_time_minutes,
  tools_required
)
SELECT 
  '22222222-2222-2222-2222-222222222222'::uuid as vehicle_id,
  REPLACE(procedure_code, 'U1300L', 'U1700L') as procedure_code,
  REPLACE(title, 'U1300L', 'U1700L (435 Series)') as title,
  category,
  subcategory,
  REPLACE(COALESCE(description, ''), 'U1300L', 'U1700L (435 Series)') as description,
  REPLACE(COALESCE(content, ''), 'U1300L', 'U1700L/U1300L (435 Series)') as content,
  difficulty_level,
  estimated_time_minutes,
  tools_required
FROM wis_procedures
WHERE vehicle_id = '11111111-1111-1111-1111-111111111111';

-- Step 6: If no U1300L procedures exist, add a placeholder
-- Check first if we need it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM wis_procedures 
    WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
  ) THEN
    INSERT INTO wis_procedures (
      vehicle_id,
      procedure_code,
      title,
      category,
      subcategory,
      description,
      content,
      difficulty_level,
      estimated_time_minutes
    ) VALUES (
      '22222222-2222-2222-2222-222222222222',
      'U1700L-INFO-001',
      'U1700L (435 Series) - Information',
      'Information',
      'Notice',
      'U1700L is an Australia-specific variant of the Unimog 435 series',
      '# U1700L (435 Series) Information

## About the U1700L
The Unimog U1700L is an Australia-specific variant of the Unimog 435 series. It shares technical characteristics with the U1300L model.

## Technical Procedures
Since U1700L is not in the standard Mercedes WIS system, please refer to:
1. U1300L documentation for compatible procedures
2. Your local Unimog specialist for model-specific information
3. General Unimog 435 series maintenance guidelines

## Key Specifications:
- Engine: OM366A (similar to U1300L OM366)
- Part of the Unimog 435 series
- Heavy-duty variant designed for Australian conditions
- Compatible with many U1300L parts and procedures',
      1,
      5
    );
  END IF;
END $$;

-- Step 7: Copy U1300L parts to U1700L
DELETE FROM wis_parts 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO wis_parts (
  vehicle_id,
  part_number,
  part_name,
  category,
  subcategory,
  description,
  price_estimate,
  availability_status,
  superseded_by,
  notes
)
SELECT 
  '22222222-2222-2222-2222-222222222222'::uuid as vehicle_id,
  part_number,
  part_name,
  category,
  subcategory,
  description,
  price_estimate,
  availability_status,
  superseded_by,
  COALESCE(notes, '') || ' (Compatible with U1300L/435 Series)' as notes
FROM wis_parts
WHERE vehicle_id = '11111111-1111-1111-1111-111111111111';

-- Step 8: Verify the results
SELECT 
  'After fix - U1700L procedures:' as status,
  COUNT(*) as count 
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

SELECT 
  'After fix - U1700L parts:' as status,
  COUNT(*) as count 
FROM wis_parts 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

-- Show sample of procedures
SELECT 
  procedure_code,
  title,
  category
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
LIMIT 10;