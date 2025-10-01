-- IMPORTANT: Run this script in Supabase SQL Editor to fix U1700L showing U2000 procedures
-- Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

-- Fix U1700L to use U1300L procedures (both are Unimog 435 series)
-- U1700L is Australia-specific and shares technical characteristics with U1300L

-- First, update the U1700L description to clarify it's part of the 435 series
UPDATE wis_models 
SET 
  model_name = 'Unimog U1700L (435 Series)',
  description = 'Heavy-duty Unimog 435 series (Australia) - uses U1300L procedures due to shared platform'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Update U1300L description to clarify it's also 435 series
UPDATE wis_models 
SET 
  model_name = 'Unimog U1300L (435 Series)',
  description = 'Medium-duty Unimog 435 series with OM366 engine'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Delete ALL procedures that were incorrectly assigned to U1700L
-- These are all generic U2000 procedures with no real content
DELETE FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

-- Delete any parts incorrectly assigned to U1700L
DELETE FROM wis_parts
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

-- Copy U1300L procedures to U1700L with updated titles
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
  tools_required,
  parts_required,
  safety_warnings,
  steps,
  is_published
)
SELECT 
  '22222222-2222-2222-2222-222222222222'::uuid as vehicle_id,
  REPLACE(procedure_code, 'U1300L', 'U1700L') as procedure_code,
  REPLACE(title, 'U1300L', 'U1700L (435 Series)') as title,
  category,
  subcategory,
  REPLACE(description, 'U1300L', 'U1700L (435 Series)') as description,
  REPLACE(content, 'U1300L', 'U1700L/U1300L (435 Series)') as content,
  difficulty_level,
  estimated_time_minutes,
  tools_required,
  parts_required,
  safety_warnings,
  steps,
  is_published
FROM wis_procedures
WHERE vehicle_id = '11111111-1111-1111-1111-111111111111';

-- Copy U1300L parts to U1700L
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

-- Verify the fix
SELECT 
  'U1700L procedures after fix:' as status,
  COUNT(*) as count 
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

SELECT 
  'U1700L parts after fix:' as status,
  COUNT(*) as count 
FROM wis_parts 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

-- Show sample of new U1700L procedures
SELECT 
  title,
  category,
  difficulty_level
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
LIMIT 10;