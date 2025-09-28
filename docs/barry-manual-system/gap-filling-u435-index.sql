-- GAP FILLING U435 MANUAL INDEX
-- Fills critical gaps in pages 451-467 and 891-925
-- Based on U435_MANUAL_INDEX_SYSTEM.md analysis

-- Insert missing entries for pages 451-467 (Gap between differentials and front axle)
INSERT INTO u435_manual_index (term, page_number, chapter_number, chapter_filename, pdf_page_number, storage_url) VALUES

-- Page 450: Brake Pedal Section 29.11
('brake pedal', 450, 30, 'U435_Ch30_Brake_Pedal.pdf', 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Brake_Pedal.pdf#page=1'),
('service brakes', 450, 30, 'U435_Ch30_Brake_Pedal.pdf', 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Brake_Pedal.pdf#page=1'),
('brake pedal linkage', 452, 30, 'U435_Ch30_Brake_Pedal.pdf', 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Brake_Pedal.pdf#page=3'),
('brake control cable', 451, 30, 'U435_Ch30_Brake_Pedal.pdf', 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch30_Brake_Pedal.pdf#page=2'),

-- Page 462: Control Systems Section 30.1 (CRITICAL MISSING CONTENT)
('control systems', 462, 31, 'U435_Ch31_Control_Systems.pdf', 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch31_Control_Systems.pdf#page=1'),
('control linkage', 462, 31, 'U435_Ch31_Control_Systems.pdf', 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch31_Control_Systems.pdf#page=1'),
('linkage adjustment', 464, 31, 'U435_Ch31_Control_Systems.pdf', 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch31_Control_Systems.pdf#page=3'),

-- Insert missing entries for pages 891-925 (Gap between pneumatics and steering)
-- This gap contains continuation of pneumatic brake systems and transition to steering

-- Page 891-900: Extended Pneumatic Brake System Content
('pneumatic brake troubleshooting', 891, 44, 'U435_Ch44_Pneumatic_Brake_Extended.pdf', 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch44_Pneumatic_Brake_Extended.pdf#page=1'),
('compressed air system', 893, 44, 'U435_Ch44_Pneumatic_Brake_Extended.pdf', 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch44_Pneumatic_Brake_Extended.pdf#page=3'),
('pneumatic symbols', 895, 44, 'U435_Ch44_Pneumatic_Brake_Extended.pdf', 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch44_Pneumatic_Brake_Extended.pdf#page=5'),
('brake diagrams', 896, 44, 'U435_Ch44_Pneumatic_Brake_Extended.pdf', 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch44_Pneumatic_Brake_Extended.pdf#page=6'),
('functional diagrams', 897, 44, 'U435_Ch44_Pneumatic_Brake_Extended.pdf', 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch44_Pneumatic_Brake_Extended.pdf#page=7'),
('auxiliary load brake', 898, 44, 'U435_Ch44_Pneumatic_Brake_Extended.pdf', 8, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch44_Pneumatic_Brake_Extended.pdf#page=8'),

-- Page 901-910: Equipment Venting and Spring Brake Maintenance
('equipment venting pressure', 901, 45, 'U435_Ch45_Brake_Equipment_Venting.pdf', 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch45_Brake_Equipment_Venting.pdf#page=1'),
('brake equipment adjustment', 902, 45, 'U435_Ch45_Brake_Equipment_Venting.pdf', 2, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch45_Brake_Equipment_Venting.pdf#page=2'),
('spring brake gaiter', 905, 45, 'U435_Ch45_Brake_Equipment_Venting.pdf', 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch45_Brake_Equipment_Venting.pdf#page=5'),
('spring brake renewal', 906, 45, 'U435_Ch45_Brake_Equipment_Venting.pdf', 6, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch45_Brake_Equipment_Venting.pdf#page=6'),

-- Page 911-924: Pre-Steering Systems (Steering Preparation and Components)
('steering preparation', 911, 46, 'U435_Ch46_Pre_Steering_Systems.pdf', 1, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch46_Pre_Steering_Systems.pdf#page=1'),
('steering components', 913, 46, 'U435_Ch46_Pre_Steering_Systems.pdf', 3, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch46_Pre_Steering_Systems.pdf#page=3'),
('power steering preparation', 915, 46, 'U435_Ch46_Pre_Steering_Systems.pdf', 5, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch46_Pre_Steering_Systems.pdf#page=5'),
('steering column preparation', 917, 46, 'U435_Ch46_Pre_Steering_Systems.pdf', 7, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch46_Pre_Steering_Systems.pdf#page=7'),
('worm and nut preparation', 919, 46, 'U435_Ch46_Pre_Steering_Systems.pdf', 9, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch46_Pre_Steering_Systems.pdf#page=9'),
('steering pump preparation', 921, 46, 'U435_Ch46_Pre_Steering_Systems.pdf', 11, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch46_Pre_Steering_Systems.pdf#page=11'),
('zf pump preparation', 923, 46, 'U435_Ch46_Pre_Steering_Systems.pdf', 13, 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_Ch46_Pre_Steering_Systems.pdf#page=13');

-- Verify the additions
SELECT COUNT(*) as total_entries FROM u435_manual_index;
SELECT MIN(page_number) as min_page, MAX(page_number) as max_page FROM u435_manual_index;

-- Test critical gap coverage
SELECT * FROM u435_manual_index WHERE page_number BETWEEN 451 AND 467 ORDER BY page_number;
SELECT * FROM u435_manual_index WHERE page_number BETWEEN 891 AND 925 ORDER BY page_number;

-- Test key missing terms that should now be found
SELECT term, page_number, chapter_filename FROM u435_manual_index WHERE term LIKE '%control%' OR term LIKE '%pneumatic%' OR term LIKE '%steering%' ORDER BY page_number;