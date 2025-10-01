-- Seed WIS data

-- Insert sample vehicles
INSERT INTO public.wis_models (model_code, model_name, year_from, year_to, engine_options, specifications)
VALUES 
  ('U400', 'Unimog 400', 2000, 2013, '{"engines": ["OM904LA", "OM906LA"]}', '{"wheelbase": "2900mm", "gvw": "7490kg", "payload": "3500kg"}'),
  ('U500', 'Unimog 500', 2013, 2023, '{"engines": ["OM934LA", "OM936LA"]}', '{"wheelbase": "3350mm", "gvw": "14500kg", "payload": "8500kg"}'),
  ('U5000', 'Unimog 5000', 2002, 2015, '{"engines": ["OM924LA", "OM926LA"]}', '{"wheelbase": "3850mm", "gvw": "14000kg", "payload": "8000kg"}')
ON CONFLICT (model_code) DO UPDATE 
SET 
  model_name = EXCLUDED.model_name,
  year_from = EXCLUDED.year_from,
  year_to = EXCLUDED.year_to;

-- Insert sample procedures
INSERT INTO public.wis_procedures (procedure_code, title, model, system, subsystem, content, tools_required, parts_required, safety_warnings, time_estimate, difficulty)
VALUES 
  ('PROC-001', 'Engine Oil and Filter Change - Unimog 400', 'Unimog 400', 'Engine', 'Lubrication', 
   '<h2>Engine Oil Change Procedure</h2><p>Complete step-by-step guide for changing engine oil and filter on Unimog 400 series vehicles.</p><h3>Preparation</h3><ol><li>Park vehicle on level ground</li><li>Apply parking brake</li><li>Allow engine to cool for 10 minutes</li></ol><h3>Procedure</h3><ol><li>Remove oil filler cap</li><li>Position drain pan under oil pan</li><li>Remove drain plug and drain oil completely</li><li>Replace drain plug with new gasket</li><li>Remove and replace oil filter</li><li>Add new oil to specified level</li><li>Start engine and check for leaks</li></ol>', 
   ARRAY['Oil drain pan', 'Filter wrench', 'Socket set', '17mm wrench'], 
   ARRAY['Engine oil 15W-40 (8 liters)', 'Oil filter A 000 180 06 09', 'Drain plug gasket'], 
   ARRAY['Engine must be warm but not hot', 'Use jack stands if lifting vehicle', 'Dispose of oil properly'], 
   45, 'easy'),
  
  ('PROC-002', 'Portal Axle Oil Change', 'Unimog 400', 'Drivetrain', 'Portal Axles',
   '<h2>Portal Axle Service</h2><p>Maintenance procedure for portal axle gear oil replacement.</p>',
   ARRAY['Drain pan', 'Pump for gear oil', 'Allen key set'],
   ARRAY['Gear oil 85W-90 (1.5L per axle)', 'New gaskets'],
   ARRAY['Support vehicle properly', 'Check for metal particles in old oil'],
   60, 'medium');

-- Insert sample parts
INSERT INTO public.wis_parts (part_number, description, category, models, superseded_by, price, availability, specifications)
VALUES 
  ('A 435 350 01 35', 'Portal Axle Housing - Front Left', 'Portal Axle Assembly', ARRAY['U400', 'U500'], NULL, 3450.00, 'In Stock', '{"notes": "Includes mounting hardware"}'),
  ('A 435 350 02 35', 'Portal Axle Housing - Front Right', 'Portal Axle Assembly', ARRAY['U400', 'U500'], NULL, 3450.00, 'In Stock', '{"notes": "Includes mounting hardware"}'),
  ('A 000 260 56 46', 'Portal Gear Set', 'Portal Axle Assembly', ARRAY['U400', 'U500'], 'A 000 260 58 46', 890.00, 'In Stock', '{"notes": "Updated part number for improved durability"}'),
  ('A 000 260 58 46', 'Portal Gear Set - Improved', 'Portal Axle Assembly', ARRAY['U400', 'U500'], NULL, 920.00, 'In Stock', '{"notes": "Latest revision with improved heat treatment"}'),
  ('A 000 180 06 09', 'Engine Oil Filter', 'Engine', ARRAY['U400'], NULL, 24.50, 'In Stock', '{"notes": "OEM specification filter"}'),
  ('A 435 320 03 72', 'Portal Axle Seal Kit', 'Portal Axle Assembly', ARRAY['U400', 'U500'], NULL, 145.00, 'In Stock', '{"notes": "Complete seal kit for one axle"}');

-- Insert sample bulletins
INSERT INTO public.wis_bulletins (bulletin_number, title, models_affected, issue_date, category, content, priority)
VALUES 
  ('TSB-2020-001', 'Portal Axle Seal Replacement Procedure', ARRAY['Unimog 400', 'Unimog 500'], '2020-03-15', 'Drivetrain', 
   'Updated procedure for portal axle seal replacement to address premature wear. New seal design provides improved durability. Applicable to vehicles manufactured between 2015-2019.', 'recommended'),
  ('TSB-2021-003', 'Engine Oil Specification Update', ARRAY['Unimog 400', 'Unimog 500', 'Unimog 5000'], '2021-06-01', 'Engine',
   'Revised engine oil specification to 5W-40 fully synthetic for improved cold weather performance and extended service intervals.', 'info'),
  ('TSB-2022-005', 'Brake System Safety Recall', ARRAY['Unimog 500'], '2022-09-10', 'Safety',
   'Mandatory inspection and potential replacement of brake master cylinder on specific VIN ranges. Contact authorized service center immediately.', 'safety');

-- Create storage bucket for WIS manuals (this needs to be done via Supabase dashboard or API)
-- The bucket should be named 'wis-manuals' with public access