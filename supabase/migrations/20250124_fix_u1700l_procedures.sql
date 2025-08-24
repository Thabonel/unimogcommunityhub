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

-- Delete the generic U2000 procedures that were incorrectly assigned to U1700L
DELETE FROM wis_procedures 
WHERE vehicle_id = '22222222-2222-2222-2222-222222222222'
AND procedure_code LIKE 'U2000-%';

-- Create a view that shows U1300L procedures for U1700L
CREATE OR REPLACE VIEW wis_procedures_with_435_series AS
SELECT 
  p.id,
  CASE 
    WHEN vm.model_code = 'U1700L' THEN '22222222-2222-2222-2222-222222222222'::uuid
    ELSE p.vehicle_id
  END as vehicle_id,
  p.procedure_code,
  p.title,
  p.category,
  p.subcategory,
  p.description,
  p.content,
  p.difficulty_level,
  p.estimated_time_minutes,
  p.tools_required,
  p.parts_required,
  p.safety_warnings,
  p.steps,
  p.is_published,
  p.created_at,
  p.updated_at
FROM wis_procedures p
JOIN wis_models vm ON vm.id = '11111111-1111-1111-1111-111111111111'
WHERE p.vehicle_id = '11111111-1111-1111-1111-111111111111'
UNION ALL
SELECT * FROM wis_procedures 
WHERE vehicle_id != '11111111-1111-1111-1111-111111111111';

-- Create a function to get procedures for a vehicle, handling 435 series sharing
CREATE OR REPLACE FUNCTION get_vehicle_procedures(vehicle_uuid UUID)
RETURNS TABLE (
  id UUID,
  vehicle_id UUID,
  procedure_code TEXT,
  title TEXT,
  category TEXT,
  subcategory TEXT,
  description TEXT,
  content TEXT,
  difficulty_level INTEGER,
  estimated_time_minutes INTEGER,
  tools_required TEXT[],
  parts_required TEXT[],
  safety_warnings TEXT[],
  steps JSONB,
  is_published BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- If U1700L is selected, return U1300L procedures
  IF vehicle_uuid = '22222222-2222-2222-2222-222222222222' THEN
    RETURN QUERY
    SELECT 
      p.id,
      '22222222-2222-2222-2222-222222222222'::uuid as vehicle_id,
      p.procedure_code,
      REPLACE(p.title, 'U1300L', 'U1700L/U1300L (435 Series)') as title,
      p.category,
      p.subcategory,
      REPLACE(p.description, 'U1300L', 'U1700L/U1300L (435 Series)') as description,
      REPLACE(p.content, 'U1300L', 'U1700L/U1300L (435 Series)') as content,
      p.difficulty_level,
      p.estimated_time_minutes,
      p.tools_required,
      p.parts_required,
      p.safety_warnings,
      p.steps,
      p.is_published,
      p.created_at,
      p.updated_at
    FROM wis_procedures p
    WHERE p.vehicle_id = '11111111-1111-1111-1111-111111111111';
  ELSE
    -- For all other vehicles, return their own procedures
    RETURN QUERY
    SELECT * FROM wis_procedures p
    WHERE p.vehicle_id = vehicle_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Do the same for parts
CREATE OR REPLACE FUNCTION get_vehicle_parts(vehicle_uuid UUID)
RETURNS TABLE (
  id UUID,
  vehicle_id UUID,
  part_number TEXT,
  part_name TEXT,
  category TEXT,
  subcategory TEXT,
  description TEXT,
  price_estimate DECIMAL,
  availability_status TEXT,
  superseded_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  -- If U1700L is selected, return U1300L parts
  IF vehicle_uuid = '22222222-2222-2222-2222-222222222222' THEN
    RETURN QUERY
    SELECT 
      p.id,
      '22222222-2222-2222-2222-222222222222'::uuid as vehicle_id,
      p.part_number,
      p.part_name,
      p.category,
      p.subcategory,
      p.description,
      p.price_estimate,
      p.availability_status,
      p.superseded_by,
      p.notes,
      p.created_at,
      p.updated_at
    FROM wis_parts p
    WHERE p.vehicle_id = '11111111-1111-1111-1111-111111111111';
  ELSE
    -- For all other vehicles, return their own parts
    RETURN QUERY
    SELECT * FROM wis_parts p
    WHERE p.vehicle_id = vehicle_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies for the functions (if needed)
GRANT EXECUTE ON FUNCTION get_vehicle_procedures(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_vehicle_parts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_vehicle_procedures(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_vehicle_parts(UUID) TO anon;