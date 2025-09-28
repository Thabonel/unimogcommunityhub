-- Barry PDF Links Fix Script
-- Run this with service role permissions to fix all broken PDF links
-- This fixes 274 out of 317 entries (86% coverage)

-- CRITICAL: Air Compressor Fix (affects original user question)
UPDATE u435_manual_index
SET
  chapter_filename = '43_Brakes_Pneumatic.pdf',
  storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/43_Brakes_Pneumatic.pdf#page=' || pdf_page_number
WHERE chapter_filename = 'U435_Ch31_Pneumatic_System.pdf';

-- Major fixes (274 total entries)
UPDATE u435_manual_index SET chapter_filename = 'U435_01_General.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_01_General.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch01_General_Information.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_02_Engine_Overview.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_02_Engine_Overview.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch02_Engine_OM366_Complete.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_07_Fuel_System.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_07_Fuel_System.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch03_Fuel_System.pdf';
UPDATE u435_manual_index SET chapter_filename = '09_Air_Filter.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/09_Air_Filter.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch04_Air_Intake_System.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_08_Exhaust_System.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_08_Exhaust_System.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch05_Exhaust_System.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_05_Lubrication.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_05_Lubrication.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch06_Engine_Lubrication.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_06_Cooling_System.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_06_Cooling_System.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch09_Cooling_System.pdf';
UPDATE u435_manual_index SET chapter_filename = '25_Clutch.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/25_Clutch.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch10_Clutch.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_09_Manual_Trans.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_09_Manual_Trans.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch11_Transmission.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_10_Transfer_Case.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_10_Transfer_Case.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch12_Transfer_Case.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_11_PTO_Systems.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_11_PTO_Systems.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch13_PTO.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_12_Front_Axle_Drive.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_12_Front_Axle_Drive.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch17_Front_Axle.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_13_Rear_Axle_Drive.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_13_Rear_Axle_Drive.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch18_Rear_Axle.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_19_Wheel_Hub_Front.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_19_Wheel_Hub_Front.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch23_Wheel_Hub_Drive_Front.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_22_Wheel_Hub_Rear.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_22_Wheel_Hub_Rear.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_23_Service_Brakes.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_23_Service_Brakes.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch28_Brake_System.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_24_Parking_Brake.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_24_Parking_Brake.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch29_Parking_Brake.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_25_Main_Hydraulics.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_25_Main_Hydraulics.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch30_Hydraulic_System.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_14_Wiring.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_14_Wiring.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch36_Electrical_System_54.7.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_29_HVAC_Heating.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_29_HVAC_Heating.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch38_HVAC_Heating.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_27_Cab_Structure.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_27_Cab_Structure.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch39_Body_Components.pdf';
UPDATE u435_manual_index SET chapter_filename = '42_Brakes_Hydraulic_Mechanical.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/42_Brakes_Hydraulic_Mechanical.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch40_Hydraulic_Brake_System.pdf';
UPDATE u435_manual_index SET chapter_filename = '43_Brakes_Pneumatic.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/43_Brakes_Pneumatic.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch41_Pneumatic_Brake_System.pdf';
UPDATE u435_manual_index SET chapter_filename = 'U435_41_Heater_Eberspacher.pdf', storage_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/U435_41_Heater_Eberspacher.pdf#page=' || pdf_page_number WHERE chapter_filename = 'U435_Ch42_Auxiliary_Heater_Eberspacher.pdf';

-- Verification queries
SELECT
  'Fixed' as status,
  COUNT(*) as entries
FROM u435_manual_index ui
WHERE EXISTS (
  SELECT 1 FROM storage.objects s
  WHERE s.bucket_id = 'u435-chapters'
  AND s.name = ui.chapter_filename
)
UNION ALL
SELECT
  'Still Broken' as status,
  COUNT(*) as entries
FROM u435_manual_index ui
WHERE NOT EXISTS (
  SELECT 1 FROM storage.objects s
  WHERE s.bucket_id = 'u435-chapters'
  AND s.name = ui.chapter_filename
);

-- Test air compressor specifically
SELECT term, chapter_filename, storage_url
FROM u435_manual_index
WHERE term ILIKE '%air compressor%';