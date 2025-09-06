-- Update U1300L model to include U1700L variant for Australian users
-- This makes U1300L the default selection since it covers the most common 435 series variants

-- Update U1300L model name and description to include U1700L variant
UPDATE wis_models 
SET 
  model_name = 'Unimog U1300L/U1700L (435 Series)',
  description = 'Medium/Heavy-duty Unimog 435 series - covers U1300L and U1700L variants with OM352A engine, 3250mm wheelbase. Popular in Australia and worldwide.'
WHERE model_code = 'U1300L';

-- Check the update
SELECT id, model_code, model_name, description 
FROM wis_models 
WHERE model_code = 'U1300L';