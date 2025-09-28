-- Barry PDF Links Final Fix Script
-- Fixes remaining 74 broken entries to achieve 100% accuracy
-- Run this after the first fix script

-- 1. Pre-Steering Systems (7 entries) -> Main Steering PDF
UPDATE u435_manual_index
SET
  chapter_filename = 'U435_18_Steering.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_18_Steering.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch46_Pre_Steering_Systems.pdf';

-- 2. Steering LS7F (6 entries) -> Alternative Steering PDF
UPDATE u435_manual_index
SET
  chapter_filename = '46_Steering.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/46_Steering.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch33_Steering_LS7F.pdf';

-- 3. Pneumatic Brake Extended (6 entries) -> Same pneumatic brake PDF
UPDATE u435_manual_index
SET
  chapter_filename = '43_Brakes_Pneumatic.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/43_Brakes_Pneumatic.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch44_Pneumatic_Brake_Extended.pdf';

-- 4. Electrical Harness (6 entries) -> Advanced Electrical PDF
UPDATE u435_manual_index
SET
  chapter_filename = 'U435_32_Advanced_Electrical.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_32_Advanced_Electrical.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch37_Electrical_Harness.pdf';

-- 5. Power Steering LS3B (5 entries) -> Main Steering PDF
UPDATE u435_manual_index
SET
  chapter_filename = 'U435_18_Steering.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_18_Steering.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch32_Worm_Nut_Power_Steering_LS3B.pdf';

-- 6. Rear Suspension (5 entries) -> Suspension PDF
UPDATE u435_manual_index
SET
  chapter_filename = 'U435_17_Suspension.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_17_Suspension.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch25_Rear_Suspension.pdf';

-- 7. Power Steering Pump ZF7673 (5 entries) -> Main Steering PDF
UPDATE u435_manual_index
SET
  chapter_filename = 'U435_18_Steering.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_18_Steering.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch34_Power_Steering_Pump_ZF7673.pdf';

-- 8. Brake Equipment Venting (4 entries) -> Pneumatic Brakes PDF
UPDATE u435_manual_index
SET
  chapter_filename = '43_Brakes_Pneumatic.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/43_Brakes_Pneumatic.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch45_Brake_Equipment_Venting.pdf';

-- 9. Brake Pedal (4 entries) -> Pedal Linkage PDF
UPDATE u435_manual_index
SET
  chapter_filename = '29_Pedal_Linkage.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/29_Pedal_Linkage.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch30_Brake_Pedal.pdf';

-- 10. Wheels and Tires (4 entries) -> Wheels and Prop Shafts PDF
UPDATE u435_manual_index
SET
  chapter_filename = '40_Wheels_Prop_Shafts.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/40_Wheels_Prop_Shafts.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch27_Wheels_Tires.pdf';

-- 11. Front Differential (4 entries) -> Front Axle PDF
UPDATE u435_manual_index
SET
  chapter_filename = '33_Front_Axle.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/33_Front_Axle.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch15_Front_Differential.pdf';

-- 12. Driveshafts (4 entries) -> Wheels and Prop Shafts PDF
UPDATE u435_manual_index
SET
  chapter_filename = '40_Wheels_Prop_Shafts.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/40_Wheels_Prop_Shafts.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch14_Driveshafts.pdf';

-- 13. Front Suspension (4 entries) -> Suspension PDF
UPDATE u435_manual_index
SET
  chapter_filename = '32_Suspension.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/32_Suspension.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch24_Front_Suspension.pdf';

-- 14. Rear Differential (4 entries) -> Rear Axle PDF
UPDATE u435_manual_index
SET
  chapter_filename = '35_Rear_Axle.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/35_Rear_Axle.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch16_Rear_Differential.pdf';

-- 15. Power Steering Pump ZF7672 (3 entries) -> Main Steering PDF
UPDATE u435_manual_index
SET
  chapter_filename = 'U435_18_Steering.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_18_Steering.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch35_Power_Steering_Pump_ZF7672.pdf';

-- 16. Control Systems (3 entries) -> Pedal Linkage PDF
UPDATE u435_manual_index
SET
  chapter_filename = '29_Pedal_Linkage.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/29_Pedal_Linkage.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch31_Control_Systems.pdf';

-- VERIFICATION: Check that we achieved 100% success
SELECT
  CASE WHEN EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id = 'u435-chapters' AND name = ui.chapter_filename)
  THEN 'Fixed' ELSE 'Still Broken' END as status,
  COUNT(*) as entries
FROM u435_manual_index ui
GROUP BY
  CASE WHEN EXISTS(SELECT 1 FROM storage.objects WHERE bucket_id = 'u435-chapters' AND name = ui.chapter_filename)
  THEN 'Fixed' ELSE 'Still Broken' END;

-- CRITICAL TEST: Verify air compressor still works
SELECT 'Air Compressor Test' as test_name, term, chapter_filename, storage_url
FROM u435_manual_index
WHERE term ILIKE '%air compressor%';

-- SAMPLE TEST: Check various systems work
SELECT 'Sample Systems Test' as test_name, term, chapter_filename
FROM u435_manual_index
WHERE term IN ('steering', 'brakes', 'suspension', 'differential', 'transmission')
LIMIT 10;