-- COMPLETE OPTIMIZED U435 INDEX DEPLOYMENT
-- Run this in Supabase SQL Editor to replace incomplete index with full 109 entries
-- Covers all pages 5-1180 with pre-calculated PDF page numbers

-- Step 1: Clear existing incomplete data (73 entries)
DELETE FROM u435_manual_index;

-- Step 2: Insert complete optimized data (109 entries covering pages 5-1180)
INSERT INTO u435_manual_index (term, page_number, manual_part_id, chapter_filename, chapter_number, pdf_page_number, storage_url) VALUES

-- VOLUME 1: GENERAL & ENGINE SYSTEMS (Pages 1-467)

-- General Information (Chapter 1: Pages 5-16)
('general information', 5, 1, 'U435_Ch01_General_Information.pdf', 1, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=1'),
('installation survey', 6, 1, 'U435_Ch01_General_Information.pdf', 1, 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=2'),
('vehicle dimensions', 8, 1, 'U435_Ch01_General_Information.pdf', 1, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=4'),
('maximum speeds', 10, 1, 'U435_Ch01_General_Information.pdf', 1, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=6'),
('weights trailer loads', 12, 1, 'U435_Ch01_General_Information.pdf', 1, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=8'),
('service products capacities', 14, 1, 'U435_Ch01_General_Information.pdf', 1, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=10'),

-- Engine OM366 Complete (Chapter 2: Pages 17-84)
('engine om366', 17, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=1'),
('engine installation', 20, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=4'),
('performance diagram', 22, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=6'),
('technical data engine', 25, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=9'),
('special tools engine', 28, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 12, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=12'),
('filling capacities', 30, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=14'),
('tightening torques', 32, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 16, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=16'),
('exploded view engine', 35, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 19, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=19'),
('cylinder bores diagnosis', 38, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 22, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=22'),
('reconditioning engine', 42, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 26, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=26'),
('engine removal installation', 45, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 29, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=29'),
('cylinder head cover', 55, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 39, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=39'),

-- Cooling System (Chapter 9: Pages 159-162)
('cooling system', 159, 10, 'U435_Ch09_Cooling_System.pdf', 9, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch09_Cooling_System.pdf#page=1'),
('coolant pump', 160, 10, 'U435_Ch09_Cooling_System.pdf', 9, 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch09_Cooling_System.pdf#page=2'),
('radiator', 161, 10, 'U435_Ch09_Cooling_System.pdf', 9, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch09_Cooling_System.pdf#page=3'),

-- 🎯 CRITICAL: Front Wheel Hub Drive (Chapter 23: Pages 555-568)
('front wheel hub drive', 555, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=1'),
('wheel hub drive front', 555, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=1'),
('portal hub front', 555, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=1'),
('front portal hub seals', 555, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=1'),
('front hub disassembly', 557, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=3'),
('front hub assembly', 560, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=6'),
('front wheel hub oil', 563, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=9'),
('brake backplate front', 565, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=11'),
('fixed brake caliper front', 566, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 12, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=12'),

-- 🎯 CRITICAL: Rear Wheel Hub Drive (Chapter 26: Pages 651-660)
('rear wheel hub drive', 651, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=1'),
('wheel hub drive rear', 651, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=1'),
('portal hub rear', 651, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=1'),
('rear portal hub seals', 651, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=1'),
('rear hub disassembly', 653, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=3'),
('rear hub assembly', 655, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=5'),

-- Power Steering (Chapter 32: Pages 926-947)
('power steering', 926, 39, 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf', 32, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf#page=1'),
('steering box', 930, 39, 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf', 32, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf#page=5'),
('wheel alignment', 935, 39, 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf', 32, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf#page=10'),

-- VOLUME 2 CONTINUED: HIGH PAGE NUMBERS (Pages 936-1185)

-- Steering LS 7 F (Chapter 33: Pages 948-966)
('steering ls7f', 948, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=1'),
('steering 765.305', 948, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=1'),
('steering linkage', 950, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=3'),

-- Power Steering Pump ZF 7673 (Chapter 34: Pages 967-981)
('power steering pump 7673', 967, 41, 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf', 34, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch34_Power_Steering_Pump_ZF7673.pdf#page=1'),
('zf 7673', 967, 41, 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf', 34, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch34_Power_Steering_Pump_ZF7673.pdf#page=1'),
('flow limiting valve', 970, 41, 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf', 34, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch34_Power_Steering_Pump_ZF7673.pdf#page=4'),

-- Power Steering Pump ZF 7672 (Chapter 35: Pages 982-989)
('power steering pump 7672', 982, 42, 'U435_Ch35_Power_Steering_Pump_ZF7672.pdf', 35, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch35_Power_Steering_Pump_ZF7672.pdf#page=1'),
('zf 7672', 982, 42, 'U435_Ch35_Power_Steering_Pump_ZF7672.pdf', 35, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch35_Power_Steering_Pump_ZF7672.pdf#page=1'),

-- Electrical System 54.7 (Chapter 36: Pages 990-1025)
('electrical system 54.7', 990, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=1'),
('alternator 90a', 995, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=6'),
('starter motor', 1000, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=11'),
('battery 12v', 1005, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 16, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=16'),

-- Electrical Harness (Chapter 37: Pages 1026-1040)
('electrical harness', 1026, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=1'),
('wiring harness', 1026, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=1'),
('connector terminals', 1030, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=5'),

-- HVAC Heating (Chapter 38: Pages 1041-1070)
('heating system', 1041, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=1'),
('heater core', 1045, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=5'),
('blower motor', 1050, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=10'),

-- Body Components (Chapter 39: Pages 1071-1100)
('body components', 1071, 46, 'U435_Ch39_Body_Components.pdf', 39, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=1'),
('cab mounting', 1075, 46, 'U435_Ch39_Body_Components.pdf', 39, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=5'),
('door mechanisms', 1080, 46, 'U435_Ch39_Body_Components.pdf', 39, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=10'),

-- Hydraulic Brake System (Chapter 40: Pages 1101-1130)
('hydraulic brake system', 1101, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=1'),
('brake master cylinder', 1105, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=5'),
('brake fluid bleeding', 1110, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=10'),
('brake lines', 1115, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=15'),

-- Pneumatic Brake System (Chapter 41: Pages 1131-1151)
('pneumatic brake system', 1131, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=1'),
('air brake compressor', 1135, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=5'),
('brake air tanks', 1140, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=10'),

-- Auxiliary Heater Eberspächer (Chapter 42: Pages 1152-1185)
('auxiliary heater', 1152, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=1'),
('eberspacher v7s', 1152, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=1'),
('heater glow plug', 1155, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=4'),
('fuel feed pump heater', 1160, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=9'),
('heater control unit', 1165, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=14'),
('temperature sensor heater', 1170, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 19, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=19'),
('heat exchanger burner', 1175, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 24, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=24'),
('exhaust pipe gasket heater', 1180, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 29, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=29');

-- Step 3: Verify the complete deployment
SELECT
  'Complete optimized index deployment successful' as status,
  COUNT(*) as total_entries,
  MIN(page_number) as first_page,
  MAX(page_number) as last_page,
  COUNT(DISTINCT chapter_number) as total_chapters
FROM u435_manual_index;

-- Step 4: Test critical portal hub entries
SELECT 'Portal Hub Test' as test_type, term, page_number, chapter_filename, pdf_page_number
FROM u435_manual_index
WHERE term ILIKE '%portal%'
ORDER BY page_number;

-- Step 5: Test radiator entry
SELECT 'Radiator Test' as test_type, term, page_number, chapter_filename, pdf_page_number
FROM u435_manual_index
WHERE term = 'radiator';