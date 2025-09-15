-- Final fix for U1700L - Remove ONLY U2000 procedures, keep the 3 valid ones
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new

-- Step 1: Show what we currently have
SELECT 
  'Current U1700L procedures:' as status,
  COUNT(*) as total,
  COUNT(CASE WHEN procedure_code LIKE 'U2000%' THEN 1 END) as u2000_procedures,
  COUNT(CASE WHEN procedure_code IN ('ENG001', 'TRANS001', 'AXLE001') THEN 1 END) as valid_procedures
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

-- Step 2: Show the valid procedures we want to keep
SELECT 
  procedure_code,
  title,
  category
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
AND procedure_code IN ('ENG001', 'TRANS001', 'AXLE001');

-- Step 3: Delete ONLY the U2000 procedures (keeping ENG001, TRANS001, AXLE001)
DELETE FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
AND procedure_code LIKE 'U2000%';

-- Step 4: Verify the deletion worked
SELECT 
  'After deletion:' as status,
  COUNT(*) as remaining_procedures
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';

-- Step 5: Show what's left (should be the 3 valid procedures)
SELECT 
  procedure_code,
  title,
  category,
  subcategory,
  difficulty_level
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
ORDER BY category, procedure_code;

-- Step 6: Update vehicle description to clarify
UPDATE wis_models 
SET 
  model_name = 'Unimog U1700L (435 Series)',
  description = 'Heavy-duty Unimog 435 series (Australia) - Limited WIS data available'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Step 7: If you want to add more context to the existing procedures
UPDATE wis_procedures
SET description = CASE 
  WHEN procedure_code = 'ENG001' THEN 'Engine oil change procedure for U1700L with OM366A engine (435 Series)'
  WHEN procedure_code = 'TRANS001' THEN 'Transmission service for U1700L with UG3/40 gearbox (435 Series)'
  WHEN procedure_code = 'AXLE001' THEN 'Portal axle service specific to U1700L/435 Series'
  ELSE description
END
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
AND procedure_code IN ('ENG001', 'TRANS001', 'AXLE001');

-- Final result
SELECT 
  '✅ Fix complete!' as message,
  'U1700L now has ' || COUNT(*) || ' valid procedures (should be 3)' as result
FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222';