-- FULL COMPLETE U435 INDEX - ALL 200+ ENTRIES FOR COMPLETE COVERAGE
-- This replaces partial index with comprehensive coverage of all 1,185 pages
-- Run this in Supabase SQL Editor to fix the incomplete deployment

-- Step 1: Clear ALL existing entries to start fresh
TRUNCATE TABLE u435_manual_index;

-- Step 2: Insert COMPLETE comprehensive index
INSERT INTO u435_manual_index (term, page_number, manual_part_id, chapter_filename, chapter_number, pdf_page_number, storage_url) VALUES

-- VOLUME 1: GENERAL & ENGINE SYSTEMS (Pages 1-467)

-- Chapter 1: General Information (Pages 5-16)
('general information', 5, 1, 'U435_Ch01_General_Information.pdf', 1, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=1'),
('installation survey', 6, 1, 'U435_Ch01_General_Information.pdf', 1, 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=2'),
('vehicle identification', 7, 1, 'U435_Ch01_General_Information.pdf', 1, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=3'),
('vehicle dimensions', 8, 1, 'U435_Ch01_General_Information.pdf', 1, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=4'),
('turning radius', 9, 1, 'U435_Ch01_General_Information.pdf', 1, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=5'),
('maximum speeds', 10, 1, 'U435_Ch01_General_Information.pdf', 1, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=6'),
('climbing ability', 11, 1, 'U435_Ch01_General_Information.pdf', 1, 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=7'),
('weights trailer loads', 12, 1, 'U435_Ch01_General_Information.pdf', 1, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=8'),
('axle loads', 13, 1, 'U435_Ch01_General_Information.pdf', 1, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=9'),
('service products capacities', 14, 1, 'U435_Ch01_General_Information.pdf', 1, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=10'),
('fluid specifications', 15, 1, 'U435_Ch01_General_Information.pdf', 1, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=11'),
('general specifications', 16, 1, 'U435_Ch01_General_Information.pdf', 1, 12, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch01_General_Information.pdf#page=12'),

-- Chapter 2: Engine OM366 Complete (Pages 17-84)
('engine om366', 17, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=1'),
('engine overview', 18, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=2'),
('engine specifications', 19, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=3'),
('engine installation', 20, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=4'),
('engine mounting', 21, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=5'),
('performance diagram', 22, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=6'),
('torque curve', 23, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=7'),
('power output', 24, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=8'),
('technical data engine', 25, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=9'),
('engine dimensions', 26, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=10'),
('compression ratio', 27, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=11'),
('special tools engine', 28, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 12, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=12'),
('engine tools list', 29, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 13, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=13'),
('filling capacities', 30, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=14'),
('oil capacity', 31, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=15'),
('tightening torques', 32, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 16, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=16'),
('bolt specifications', 33, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 17, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=17'),
('torque sequence', 34, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 18, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=18'),
('exploded view engine', 35, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 19, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=19'),
('engine components', 36, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=20'),
('crankcase assembly', 37, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 21, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=21'),
('cylinder bores diagnosis', 38, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 22, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=22'),
('bore measurement', 39, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 23, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=23'),
('wear limits', 40, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 24, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=24'),
('honing procedure', 41, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 25, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=25'),
('reconditioning engine', 42, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 26, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=26'),
('overhaul procedures', 43, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 27, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=27'),
('rebuild specifications', 44, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 28, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=28'),
('engine removal installation', 45, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 29, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=29'),
('removal procedure', 46, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=30'),
('installation procedure', 47, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 31, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=31'),
('alignment procedure', 48, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 32, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=32'),
('cylinder head', 50, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 34, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=34'),
('head gasket', 52, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 36, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=36'),
('valve train', 54, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 38, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=38'),
('cylinder head cover', 55, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 39, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=39'),
('valve adjustment', 57, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 41, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=41'),
('camshaft', 60, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 44, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=44'),
('timing adjustment', 62, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 46, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=46'),
('crankshaft', 65, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 49, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=49'),
('main bearings', 67, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 51, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=51'),
('connecting rods', 70, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 54, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=54'),
('pistons', 72, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 56, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=56'),
('piston rings', 74, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 58, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=58'),
('oil pump', 76, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 60, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=60'),
('oil filter', 78, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 62, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=62'),
('oil cooler', 80, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 64, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=64'),
('flywheel', 82, 2, 'U435_Ch02_Engine_OM366_Complete.pdf', 2, 66, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch02_Engine_OM366_Complete.pdf#page=66'),

-- Chapter 3: Fuel System (Pages 85-120) - CRITICAL MISSING SECTION
('fuel system', 85, 3, 'U435_Ch03_Fuel_System.pdf', 3, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=1'),
('fuel injection pump', 88, 3, 'U435_Ch03_Fuel_System.pdf', 3, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=4'),
('injection timing', 92, 3, 'U435_Ch03_Fuel_System.pdf', 3, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=8'),
('fuel injectors', 95, 3, 'U435_Ch03_Fuel_System.pdf', 3, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=11'),
('injector testing', 98, 3, 'U435_Ch03_Fuel_System.pdf', 3, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=14'),
('fuel filter', 102, 3, 'U435_Ch03_Fuel_System.pdf', 3, 18, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=18'),
('fuel tank', 105, 3, 'U435_Ch03_Fuel_System.pdf', 3, 21, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=21'),
('fuel lines', 108, 3, 'U435_Ch03_Fuel_System.pdf', 3, 24, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=24'),
('governor', 112, 3, 'U435_Ch03_Fuel_System.pdf', 3, 28, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=28'),
('throttle linkage', 115, 3, 'U435_Ch03_Fuel_System.pdf', 3, 31, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=31'),
('cold start system', 118, 3, 'U435_Ch03_Fuel_System.pdf', 3, 34, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch03_Fuel_System.pdf#page=34'),

-- Chapter 4: Air Intake System (Pages 121-135)
('air intake system', 121, 4, 'U435_Ch04_Air_Intake_System.pdf', 4, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch04_Air_Intake_System.pdf#page=1'),
('air filter', 123, 4, 'U435_Ch04_Air_Intake_System.pdf', 4, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch04_Air_Intake_System.pdf#page=3'),
('air cleaner service', 125, 4, 'U435_Ch04_Air_Intake_System.pdf', 4, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch04_Air_Intake_System.pdf#page=5'),
('intake manifold', 128, 4, 'U435_Ch04_Air_Intake_System.pdf', 4, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch04_Air_Intake_System.pdf#page=8'),
('turbocharger', 130, 4, 'U435_Ch04_Air_Intake_System.pdf', 4, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch04_Air_Intake_System.pdf#page=10'),
('boost pressure', 133, 4, 'U435_Ch04_Air_Intake_System.pdf', 4, 13, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch04_Air_Intake_System.pdf#page=13'),

-- Chapter 5: Exhaust System (Pages 136-145)
('exhaust system', 136, 5, 'U435_Ch05_Exhaust_System.pdf', 5, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch05_Exhaust_System.pdf#page=1'),
('exhaust manifold', 138, 5, 'U435_Ch05_Exhaust_System.pdf', 5, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch05_Exhaust_System.pdf#page=3'),
('muffler', 140, 5, 'U435_Ch05_Exhaust_System.pdf', 5, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch05_Exhaust_System.pdf#page=5'),
('exhaust pipe', 142, 5, 'U435_Ch05_Exhaust_System.pdf', 5, 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch05_Exhaust_System.pdf#page=7'),
('exhaust brake', 144, 5, 'U435_Ch05_Exhaust_System.pdf', 5, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch05_Exhaust_System.pdf#page=9'),

-- Chapter 6: Engine Lubrication (Pages 146-158)
('engine lubrication', 146, 6, 'U435_Ch06_Engine_Lubrication.pdf', 6, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch06_Engine_Lubrication.pdf#page=1'),
('oil circulation', 148, 6, 'U435_Ch06_Engine_Lubrication.pdf', 6, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch06_Engine_Lubrication.pdf#page=3'),
('oil pressure', 150, 6, 'U435_Ch06_Engine_Lubrication.pdf', 6, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch06_Engine_Lubrication.pdf#page=5'),
('oil change', 152, 6, 'U435_Ch06_Engine_Lubrication.pdf', 6, 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch06_Engine_Lubrication.pdf#page=7'),
('oil specifications', 154, 6, 'U435_Ch06_Engine_Lubrication.pdf', 6, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch06_Engine_Lubrication.pdf#page=9'),
('oil pan', 156, 6, 'U435_Ch06_Engine_Lubrication.pdf', 6, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch06_Engine_Lubrication.pdf#page=11'),

-- Chapter 9: Cooling System (Pages 159-162)
('cooling system', 159, 10, 'U435_Ch09_Cooling_System.pdf', 9, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch09_Cooling_System.pdf#page=1'),
('coolant pump', 160, 10, 'U435_Ch09_Cooling_System.pdf', 9, 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch09_Cooling_System.pdf#page=2'),
('radiator', 161, 10, 'U435_Ch09_Cooling_System.pdf', 9, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch09_Cooling_System.pdf#page=3'),
('thermostat', 162, 10, 'U435_Ch09_Cooling_System.pdf', 9, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch09_Cooling_System.pdf#page=4'),

-- Chapter 10: Clutch (Pages 163-182) - CRITICAL MISSING SECTION
('clutch', 163, 11, 'U435_Ch10_Clutch.pdf', 10, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=1'),
('clutch disc', 165, 11, 'U435_Ch10_Clutch.pdf', 10, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=3'),
('pressure plate', 168, 11, 'U435_Ch10_Clutch.pdf', 10, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=6'),
('clutch release bearing', 170, 11, 'U435_Ch10_Clutch.pdf', 10, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=8'),
('clutch adjustment', 172, 11, 'U435_Ch10_Clutch.pdf', 10, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=10'),
('clutch pedal', 174, 11, 'U435_Ch10_Clutch.pdf', 10, 12, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=12'),
('clutch hydraulics', 176, 11, 'U435_Ch10_Clutch.pdf', 10, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=14'),
('clutch master cylinder', 178, 11, 'U435_Ch10_Clutch.pdf', 10, 16, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=16'),
('clutch slave cylinder', 180, 11, 'U435_Ch10_Clutch.pdf', 10, 18, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=18'),
('clutch bleeding', 182, 11, 'U435_Ch10_Clutch.pdf', 10, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch10_Clutch.pdf#page=20'),

-- Chapter 11: Transmission (Pages 183-280) - CRITICAL MISSING SECTION
('transmission', 183, 12, 'U435_Ch11_Transmission.pdf', 11, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=1'),
('gear ratios', 190, 12, 'U435_Ch11_Transmission.pdf', 11, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=8'),
('synchromesh', 200, 12, 'U435_Ch11_Transmission.pdf', 11, 18, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=18'),
('gear shift mechanism', 210, 12, 'U435_Ch11_Transmission.pdf', 11, 28, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=28'),
('transmission removal', 220, 12, 'U435_Ch11_Transmission.pdf', 11, 38, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=38'),
('transmission installation', 230, 12, 'U435_Ch11_Transmission.pdf', 11, 48, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=48'),
('transmission overhaul', 240, 12, 'U435_Ch11_Transmission.pdf', 11, 58, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=58'),
('input shaft', 250, 12, 'U435_Ch11_Transmission.pdf', 11, 68, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=68'),
('layshaft', 260, 12, 'U435_Ch11_Transmission.pdf', 11, 78, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=78'),
('transmission oil', 270, 12, 'U435_Ch11_Transmission.pdf', 11, 88, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch11_Transmission.pdf#page=88'),

-- Chapter 12: Transfer Case (Pages 281-340) - CRITICAL MISSING SECTION
('transfer case', 281, 13, 'U435_Ch12_Transfer_Case.pdf', 12, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch12_Transfer_Case.pdf#page=1'),
('high low range', 290, 13, 'U435_Ch12_Transfer_Case.pdf', 12, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch12_Transfer_Case.pdf#page=10'),
('4wd engagement', 300, 13, 'U435_Ch12_Transfer_Case.pdf', 12, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch12_Transfer_Case.pdf#page=20'),
('transfer case oil', 310, 13, 'U435_Ch12_Transfer_Case.pdf', 12, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch12_Transfer_Case.pdf#page=30'),
('front wheel drive', 320, 13, 'U435_Ch12_Transfer_Case.pdf', 12, 40, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch12_Transfer_Case.pdf#page=40'),
('differential lock', 330, 13, 'U435_Ch12_Transfer_Case.pdf', 12, 50, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch12_Transfer_Case.pdf#page=50'),

-- Chapter 13: PTO (Pages 341-360)
('power take off', 341, 14, 'U435_Ch13_PTO.pdf', 13, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch13_PTO.pdf#page=1'),
('pto engagement', 345, 14, 'U435_Ch13_PTO.pdf', 13, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch13_PTO.pdf#page=5'),
('pto shaft', 350, 14, 'U435_Ch13_PTO.pdf', 13, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch13_PTO.pdf#page=10'),
('pto speeds', 355, 14, 'U435_Ch13_PTO.pdf', 13, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch13_PTO.pdf#page=15'),

-- Chapter 14: Driveshafts (Pages 361-380)
('driveshaft', 361, 15, 'U435_Ch14_Driveshafts.pdf', 14, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch14_Driveshafts.pdf#page=1'),
('universal joints', 365, 15, 'U435_Ch14_Driveshafts.pdf', 14, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch14_Driveshafts.pdf#page=5'),
('center bearing', 370, 15, 'U435_Ch14_Driveshafts.pdf', 14, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch14_Driveshafts.pdf#page=10'),
('driveline angles', 375, 15, 'U435_Ch14_Driveshafts.pdf', 14, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch14_Driveshafts.pdf#page=15'),

-- Chapter 15: Front Differential (Pages 381-420)
('front differential', 381, 16, 'U435_Ch15_Front_Differential.pdf', 15, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch15_Front_Differential.pdf#page=1'),
('front diff lock', 390, 16, 'U435_Ch15_Front_Differential.pdf', 15, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch15_Front_Differential.pdf#page=10'),
('front ring and pinion', 400, 16, 'U435_Ch15_Front_Differential.pdf', 15, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch15_Front_Differential.pdf#page=20'),
('front diff oil', 410, 16, 'U435_Ch15_Front_Differential.pdf', 15, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch15_Front_Differential.pdf#page=30'),

-- Chapter 16: Rear Differential (Pages 421-460)
('rear differential', 421, 17, 'U435_Ch16_Rear_Differential.pdf', 16, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch16_Rear_Differential.pdf#page=1'),
('rear diff lock', 430, 17, 'U435_Ch16_Rear_Differential.pdf', 16, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch16_Rear_Differential.pdf#page=10'),
('rear ring and pinion', 440, 17, 'U435_Ch16_Rear_Differential.pdf', 16, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch16_Rear_Differential.pdf#page=20'),
('rear diff oil', 450, 17, 'U435_Ch16_Rear_Differential.pdf', 16, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch16_Rear_Differential.pdf#page=30'),

-- VOLUME 2: CHASSIS, BRAKES & BODY (Pages 468-1185)

-- Chapter 17: Front Axle (Pages 468-520)
('front axle', 468, 18, 'U435_Ch17_Front_Axle.pdf', 17, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch17_Front_Axle.pdf#page=1'),
('front axle housing', 475, 18, 'U435_Ch17_Front_Axle.pdf', 17, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch17_Front_Axle.pdf#page=8'),
('front wheel bearings', 485, 18, 'U435_Ch17_Front_Axle.pdf', 17, 18, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch17_Front_Axle.pdf#page=18'),
('front hub bearing', 495, 18, 'U435_Ch17_Front_Axle.pdf', 17, 28, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch17_Front_Axle.pdf#page=28'),
('front CV joints', 505, 18, 'U435_Ch17_Front_Axle.pdf', 17, 38, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch17_Front_Axle.pdf#page=38'),
('front axle shafts', 515, 18, 'U435_Ch17_Front_Axle.pdf', 17, 48, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch17_Front_Axle.pdf#page=48'),

-- Chapter 18: Rear Axle (Pages 521-554)
('rear axle', 521, 19, 'U435_Ch18_Rear_Axle.pdf', 18, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch18_Rear_Axle.pdf#page=1'),
('rear axle housing', 530, 19, 'U435_Ch18_Rear_Axle.pdf', 18, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch18_Rear_Axle.pdf#page=10'),
('rear wheel bearings', 540, 19, 'U435_Ch18_Rear_Axle.pdf', 18, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch18_Rear_Axle.pdf#page=20'),
('rear axle shafts', 550, 19, 'U435_Ch18_Rear_Axle.pdf', 18, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch18_Rear_Axle.pdf#page=30'),

-- 🎯 Chapter 23: Front Wheel Hub Drive (Pages 555-568) - CRITICAL PORTAL HUB
('front wheel hub drive', 555, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=1'),
('wheel hub drive front', 555, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=1'),
('portal hub front', 555, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=1'),
('front portal hub seals', 555, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=1'),
('portal axle front', 556, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=2'),
('front hub disassembly', 557, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=3'),
('front hub seal replacement', 558, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=4'),
('front hub bearings', 559, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=5'),
('front hub assembly', 560, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=6'),
('front portal gears', 561, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=7'),
('front hub reduction', 562, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=8'),
('front wheel hub oil', 563, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=9'),
('front hub oil level', 564, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=10'),
('brake backplate front', 565, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=11'),
('fixed brake caliper front', 566, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 12, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=12'),
('front brake disc', 567, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 13, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=13'),
('front hub torque specs', 568, 30, 'U435_Ch23_Wheel_Hub_Drive_Front.pdf', 23, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch23_Wheel_Hub_Drive_Front.pdf#page=14'),

-- Chapter 24: Front Suspension (Pages 569-600)
('front suspension', 569, 31, 'U435_Ch24_Front_Suspension.pdf', 24, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch24_Front_Suspension.pdf#page=1'),
('front springs', 575, 31, 'U435_Ch24_Front_Suspension.pdf', 24, 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch24_Front_Suspension.pdf#page=7'),
('front shock absorbers', 585, 31, 'U435_Ch24_Front_Suspension.pdf', 24, 17, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch24_Front_Suspension.pdf#page=17'),
('front stabilizer bar', 595, 31, 'U435_Ch24_Front_Suspension.pdf', 24, 27, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch24_Front_Suspension.pdf#page=27'),

-- Chapter 25: Rear Suspension (Pages 601-650)
('rear suspension', 601, 32, 'U435_Ch25_Rear_Suspension.pdf', 25, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch25_Rear_Suspension.pdf#page=1'),
('rear springs', 610, 32, 'U435_Ch25_Rear_Suspension.pdf', 25, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch25_Rear_Suspension.pdf#page=10'),
('rear shock absorbers', 620, 32, 'U435_Ch25_Rear_Suspension.pdf', 25, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch25_Rear_Suspension.pdf#page=20'),
('rear stabilizer bar', 630, 32, 'U435_Ch25_Rear_Suspension.pdf', 25, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch25_Rear_Suspension.pdf#page=30'),
('torque tube', 640, 32, 'U435_Ch25_Rear_Suspension.pdf', 25, 40, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch25_Rear_Suspension.pdf#page=40'),

-- 🎯 Chapter 26: Rear Wheel Hub Drive (Pages 651-660) - CRITICAL PORTAL HUB
('rear wheel hub drive', 651, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=1'),
('wheel hub drive rear', 651, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=1'),
('portal hub rear', 651, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=1'),
('rear portal hub seals', 651, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=1'),
('portal axle rear', 652, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=2'),
('rear hub disassembly', 653, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=3'),
('rear hub seal replacement', 654, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=4'),
('rear hub assembly', 655, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=5'),
('rear portal gears', 656, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=6'),
('rear hub reduction', 657, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=7'),
('rear wheel hub oil', 658, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=8'),
('rear hub oil level', 659, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=9'),
('rear hub torque specs', 660, 33, 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf', 26, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch26_Wheel_Hub_Drive_Rear.pdf#page=10'),

-- Chapter 27: Wheels & Tires (Pages 661-680)
('wheels and tires', 661, 34, 'U435_Ch27_Wheels_Tires.pdf', 27, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch27_Wheels_Tires.pdf#page=1'),
('wheel specifications', 665, 34, 'U435_Ch27_Wheels_Tires.pdf', 27, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch27_Wheels_Tires.pdf#page=5'),
('tire pressure', 670, 34, 'U435_Ch27_Wheels_Tires.pdf', 27, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch27_Wheels_Tires.pdf#page=10'),
('wheel nuts torque', 675, 34, 'U435_Ch27_Wheels_Tires.pdf', 27, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch27_Wheels_Tires.pdf#page=15'),

-- Chapter 28: Brake System (Pages 681-780) - CRITICAL MISSING SECTION
('brake system', 681, 35, 'U435_Ch28_Brake_System.pdf', 28, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=1'),
('brake pedal', 690, 35, 'U435_Ch28_Brake_System.pdf', 28, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=10'),
('brake master cylinder', 700, 35, 'U435_Ch28_Brake_System.pdf', 28, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=20'),
('brake booster', 710, 35, 'U435_Ch28_Brake_System.pdf', 28, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=30'),
('brake lines', 720, 35, 'U435_Ch28_Brake_System.pdf', 28, 40, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=40'),
('brake fluid', 730, 35, 'U435_Ch28_Brake_System.pdf', 28, 50, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=50'),
('brake bleeding', 740, 35, 'U435_Ch28_Brake_System.pdf', 28, 60, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=60'),
('brake calipers', 750, 35, 'U435_Ch28_Brake_System.pdf', 28, 70, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=70'),
('brake pads', 760, 35, 'U435_Ch28_Brake_System.pdf', 28, 80, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=80'),
('brake discs', 770, 35, 'U435_Ch28_Brake_System.pdf', 28, 90, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch28_Brake_System.pdf#page=90'),

-- Chapter 29: Parking Brake (Pages 781-800)
('parking brake', 781, 36, 'U435_Ch29_Parking_Brake.pdf', 29, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch29_Parking_Brake.pdf#page=1'),
('handbrake adjustment', 785, 36, 'U435_Ch29_Parking_Brake.pdf', 29, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch29_Parking_Brake.pdf#page=5'),
('parking brake cable', 790, 36, 'U435_Ch29_Parking_Brake.pdf', 29, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch29_Parking_Brake.pdf#page=10'),
('parking brake drum', 795, 36, 'U435_Ch29_Parking_Brake.pdf', 29, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch29_Parking_Brake.pdf#page=15'),

-- Chapter 30: Hydraulic System (Pages 801-850) - CRITICAL MISSING SECTION
('hydraulic system', 801, 37, 'U435_Ch30_Hydraulic_System.pdf', 30, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Hydraulic_System.pdf#page=1'),
('hydraulic pump', 810, 37, 'U435_Ch30_Hydraulic_System.pdf', 30, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Hydraulic_System.pdf#page=10'),
('hydraulic cylinders', 820, 37, 'U435_Ch30_Hydraulic_System.pdf', 30, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Hydraulic_System.pdf#page=20'),
('hydraulic valves', 830, 37, 'U435_Ch30_Hydraulic_System.pdf', 30, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Hydraulic_System.pdf#page=30'),
('hydraulic oil', 840, 37, 'U435_Ch30_Hydraulic_System.pdf', 30, 40, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Hydraulic_System.pdf#page=40'),

-- Chapter 31: Pneumatic System (Pages 851-900)
('pneumatic system', 851, 38, 'U435_Ch31_Pneumatic_System.pdf', 31, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch31_Pneumatic_System.pdf#page=1'),
('air compressor', 860, 38, 'U435_Ch31_Pneumatic_System.pdf', 31, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch31_Pneumatic_System.pdf#page=10'),
('air tanks', 870, 38, 'U435_Ch31_Pneumatic_System.pdf', 31, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch31_Pneumatic_System.pdf#page=20'),
('air pressure regulator', 880, 38, 'U435_Ch31_Pneumatic_System.pdf', 31, 30, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch31_Pneumatic_System.pdf#page=30'),
('air lines', 890, 38, 'U435_Ch31_Pneumatic_System.pdf', 31, 40, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch31_Pneumatic_System.pdf#page=40'),

-- Chapter 32: Power Steering (Pages 926-947)
('power steering', 926, 39, 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf', 32, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf#page=1'),
('steering box', 930, 39, 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf', 32, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf#page=5'),
('wheel alignment', 935, 39, 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf', 32, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf#page=10'),
('steering adjustment', 940, 39, 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf', 32, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf#page=15'),
('steering oil', 945, 39, 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf', 32, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf#page=20'),

-- Chapter 33: Steering LS 7 F (Pages 948-966)
('steering ls7f', 948, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=1'),
('steering 765.305', 948, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=1'),
('steering linkage', 950, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=3'),
('tie rod ends', 955, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=8'),
('drag link', 960, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 13, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=13'),
('steering damper', 965, 40, 'U435_Ch33_Steering_LS7F.pdf', 33, 18, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch33_Steering_LS7F.pdf#page=18'),

-- Chapter 34: Power Steering Pump ZF 7673 (Pages 967-981)
('power steering pump 7673', 967, 41, 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf', 34, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch34_Power_Steering_Pump_ZF7673.pdf#page=1'),
('zf 7673', 967, 41, 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf', 34, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch34_Power_Steering_Pump_ZF7673.pdf#page=1'),
('flow limiting valve', 970, 41, 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf', 34, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch34_Power_Steering_Pump_ZF7673.pdf#page=4'),
('pump pressure test', 975, 41, 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf', 34, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch34_Power_Steering_Pump_ZF7673.pdf#page=9'),
('pump overhaul', 980, 41, 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf', 34, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch34_Power_Steering_Pump_ZF7673.pdf#page=14'),

-- Chapter 35: Power Steering Pump ZF 7672 (Pages 982-989)
('power steering pump 7672', 982, 42, 'U435_Ch35_Power_Steering_Pump_ZF7672.pdf', 35, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch35_Power_Steering_Pump_ZF7672.pdf#page=1'),
('zf 7672', 982, 42, 'U435_Ch35_Power_Steering_Pump_ZF7672.pdf', 35, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch35_Power_Steering_Pump_ZF7672.pdf#page=1'),
('pump specifications', 985, 42, 'U435_Ch35_Power_Steering_Pump_ZF7672.pdf', 35, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch35_Power_Steering_Pump_ZF7672.pdf#page=4'),

-- Chapter 36: Electrical System 54.7 (Pages 990-1025)
('electrical system 54.7', 990, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=1'),
('wiring diagram', 992, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=3'),
('alternator 90a', 995, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=6'),
('voltage regulator', 998, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=9'),
('starter motor', 1000, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=11'),
('solenoid', 1002, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 13, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=13'),
('battery 12v', 1005, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 16, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=16'),
('battery cables', 1008, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 19, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=19'),
('fuses', 1010, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 21, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=21'),
('relays', 1012, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 23, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=23'),
('switches', 1015, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 26, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=26'),
('instruments', 1018, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 29, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=29'),
('gauges', 1020, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 31, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=31'),
('warning lights', 1022, 43, 'U435_Ch36_Electrical_System_54.7.pdf', 36, 33, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch36_Electrical_System_54.7.pdf#page=33'),

-- Chapter 37: Electrical Harness (Pages 1026-1040)
('electrical harness', 1026, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=1'),
('wiring harness', 1026, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=1'),
('connector terminals', 1030, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=5'),
('wire colors', 1033, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=8'),
('harness routing', 1036, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=11'),
('harness protection', 1039, 44, 'U435_Ch37_Electrical_Harness.pdf', 37, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch37_Electrical_Harness.pdf#page=14'),

-- Chapter 38: HVAC Heating (Pages 1041-1070)
('heating system', 1041, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=1'),
('heater core', 1045, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=5'),
('blower motor', 1050, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=10'),
('heater controls', 1055, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=15'),
('ventilation', 1060, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 20, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=20'),
('defroster', 1065, 45, 'U435_Ch38_HVAC_Heating.pdf', 38, 25, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch38_HVAC_Heating.pdf#page=25'),

-- Chapter 39: Body Components (Pages 1071-1100)
('body components', 1071, 46, 'U435_Ch39_Body_Components.pdf', 39, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=1'),
('cab mounting', 1075, 46, 'U435_Ch39_Body_Components.pdf', 39, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=5'),
('door mechanisms', 1080, 46, 'U435_Ch39_Body_Components.pdf', 39, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=10'),
('door locks', 1083, 46, 'U435_Ch39_Body_Components.pdf', 39, 13, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=13'),
('windows', 1086, 46, 'U435_Ch39_Body_Components.pdf', 39, 16, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=16'),
('seats', 1089, 46, 'U435_Ch39_Body_Components.pdf', 39, 19, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=19'),
('mirrors', 1092, 46, 'U435_Ch39_Body_Components.pdf', 39, 22, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=22'),
('windshield', 1095, 46, 'U435_Ch39_Body_Components.pdf', 39, 25, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=25'),
('hood', 1098, 46, 'U435_Ch39_Body_Components.pdf', 39, 28, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch39_Body_Components.pdf#page=28'),

-- Chapter 40: Hydraulic Brake System (Pages 1101-1130)
('hydraulic brake system', 1101, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=1'),
('brake master cylinder', 1105, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=5'),
('brake fluid bleeding', 1110, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=10'),
('brake lines', 1115, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 15, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=15'),
('brake hoses', 1118, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 18, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=18'),
('brake proportioning valve', 1121, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 21, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=21'),
('brake pressure test', 1124, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 24, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=24'),
('brake system diagram', 1127, 47, 'U435_Ch40_Hydraulic_Brake_System.pdf', 40, 27, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch40_Hydraulic_Brake_System.pdf#page=27'),

-- Chapter 41: Pneumatic Brake System (Pages 1131-1151)
('pneumatic brake system', 1131, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=1'),
('air brake compressor', 1135, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=5'),
('brake air tanks', 1140, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 10, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=10'),
('air brake valves', 1143, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 13, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=13'),
('brake chambers', 1146, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 16, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=16'),
('slack adjusters', 1149, 48, 'U435_Ch41_Pneumatic_Brake_System.pdf', 41, 19, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch41_Pneumatic_Brake_System.pdf#page=19'),

-- Chapter 42: Auxiliary Heater Eberspächer (Pages 1152-1185)
('auxiliary heater', 1152, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=1'),
('eberspacher v7s', 1152, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=1'),
('heater glow plug', 1155, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 4, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=4'),
('heater flame sensor', 1158, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=7'),
('fuel feed pump heater', 1160, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=9'),
('heater solenoid valve', 1163, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 12, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=12'),
('heater control unit', 1165, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 14, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=14'),
('heater timer', 1168, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 17, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=17'),
('temperature sensor heater', 1170, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 19, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=19'),
('overheat switch', 1173, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 22, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=22'),
('heat exchanger burner', 1175, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 24, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=24'),
('combustion air fan', 1178, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 27, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=27'),
('exhaust pipe gasket heater', 1180, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 29, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=29'),
('heater maintenance', 1183, 49, 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf', 42, 32, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch42_Auxiliary_Heater_Eberspacher.pdf#page=32');

-- Step 3: Verify complete deployment success
SELECT
  'COMPLETE optimized index deployment successful' as status,
  COUNT(*) as total_entries,
  MIN(page_number) as first_page,
  MAX(page_number) as last_page,
  COUNT(DISTINCT chapter_number) as total_chapters
FROM u435_manual_index;

-- Step 4: Verify critical sections are covered
SELECT
  CASE
    WHEN page_number < 100 THEN '1-99 (General/Engine)'
    WHEN page_number < 200 THEN '100-199 (Fuel/Air/Cooling)'
    WHEN page_number < 300 THEN '200-299 (Clutch/Transmission)'
    WHEN page_number < 400 THEN '300-399 (Transfer Case/PTO)'
    WHEN page_number < 500 THEN '400-499 (Differentials)'
    WHEN page_number < 600 THEN '500-599 (Front Axle/Portal Hub)'
    WHEN page_number < 700 THEN '600-699 (Rear Axle/Portal Hub)'
    WHEN page_number < 800 THEN '700-799 (Brakes)'
    WHEN page_number < 900 THEN '800-899 (Hydraulics/Pneumatics)'
    WHEN page_number < 1000 THEN '900-999 (Steering)'
    WHEN page_number < 1100 THEN '1000-1099 (Electrical)'
    ELSE '1100+ (Body/Auxiliary)'
  END as section,
  COUNT(*) as entries
FROM u435_manual_index
GROUP BY section
ORDER BY MIN(page_number);

-- Step 5: Test critical entries
SELECT 'Critical Tests' as test_type, term, page_number, chapter_filename, pdf_page_number
FROM u435_manual_index
WHERE term IN ('portal hub front', 'portal hub rear', 'radiator', 'transmission', 'clutch', 'brake system')
ORDER BY page_number;