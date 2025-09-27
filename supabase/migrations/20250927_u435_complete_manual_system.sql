-- U435 Complete Manual System Migration
-- Combines Workshop Manual (41 parts) and Maintenance Manual (26 sections)
-- Total: 67 PDFs for direct Barry AI navigation

-- Drop existing tables if they exist
DROP TABLE IF EXISTS u435_manual_parts CASCADE;
DROP TABLE IF EXISTS u435_manual_index CASCADE;

-- Create the main manual parts table
CREATE TABLE u435_manual_parts (
    id SERIAL PRIMARY KEY,
    manual_type TEXT NOT NULL CHECK (manual_type IN ('workshop', 'maintenance')),
    part_number INTEGER,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    start_page INTEGER,
    end_page INTEGER,
    page_count INTEGER,
    file_size_mb DECIMAL(5,1),
    storage_bucket TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    priority TEXT DEFAULT 'standard' CHECK (priority IN ('critical', 'high', 'standard')),
    keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX idx_manual_parts_type ON u435_manual_parts(manual_type);
CREATE INDEX idx_manual_parts_slug ON u435_manual_parts(slug);
CREATE INDEX idx_manual_parts_keywords ON u435_manual_parts USING GIN(keywords);
CREATE INDEX idx_manual_parts_pages ON u435_manual_parts(start_page, end_page);

-- Insert Workshop Manual parts (41 entries)
INSERT INTO u435_manual_parts (manual_type, part_number, slug, title, filename, start_page, end_page, page_count, file_size_mb, storage_bucket, storage_path, priority, keywords) VALUES
-- Workshop Manual Parts
('workshop', 1, '01_General', 'General Information', 'U435_01_General.pdf', 5, 16, 12, 3.5, 'u435-chapters', 'U435_01_General.pdf', 'standard', ARRAY['general', 'specifications', 'overview']),
('workshop', 2, '02_Engine_Overview', 'Engine Overview', 'U435_02_Engine_Overview.pdf', 17, 50, 34, 9.6, 'u435-chapters', 'U435_02_Engine_Overview.pdf', 'high', ARRAY['engine', 'om366', 'overview']),
('workshop', 3, '03_Cylinder_Head', 'Cylinder Head System', 'U435_03_Cylinder_Head.pdf', 51, 88, 38, 11.4, 'u435-chapters', 'U435_03_Cylinder_Head.pdf', 'standard', ARRAY['cylinder', 'head', 'valve', 'timing']),
('workshop', 4, '04_Engine_Block', 'Engine Block System', 'U435_04_Engine_Block.pdf', 89, 126, 38, 4.1, 'u435-chapters', 'U435_04_Engine_Block.pdf', 'high', ARRAY['engine', 'block', 'pistons', 'crankshaft']),
('workshop', 5, '05_Lubrication', 'Engine Lubrication', 'U435_05_Lubrication.pdf', 127, 144, 18, 2.3, 'u435-chapters', 'U435_05_Lubrication.pdf', 'high', ARRAY['lubrication', 'oil', 'pump', 'filter']),
('workshop', 6, '06_Cooling_System', 'Cooling System', 'U435_06_Cooling_System.pdf', 145, 162, 18, 2.6, 'u435-chapters', 'U435_06_Cooling_System.pdf', 'standard', ARRAY['cooling', 'radiator', 'thermostat', 'coolant']),
('workshop', 7, '07_Fuel_System', 'Fuel System', 'U435_07_Fuel_System.pdf', 163, 200, 38, 4.5, 'u435-chapters', 'U435_07_Fuel_System.pdf', 'standard', ARRAY['fuel', 'injection', 'diesel', 'pump']),
('workshop', 8, '08_Exhaust_System', 'Exhaust System', 'U435_08_Exhaust_System.pdf', 201, 214, 14, 1.5, 'u435-chapters', 'U435_08_Exhaust_System.pdf', 'standard', ARRAY['exhaust', 'manifold', 'emissions']),
('workshop', 9, '09_Manual_Trans', 'Manual Transmission', 'U435_09_Manual_Trans.pdf', 215, 258, 44, 5.3, 'u435-chapters', 'U435_09_Manual_Trans.pdf', 'high', ARRAY['transmission', 'gearbox', 'clutch', 'manual']),
('workshop', 10, '10_Transfer_Case', 'Transfer Case', 'U435_10_Transfer_Case.pdf', 259, 292, 34, 4.5, 'u435-chapters', 'U435_10_Transfer_Case.pdf', 'standard', ARRAY['transfer', 'case', 'differential', '4wd']),
('workshop', 11, '11_PTO_Systems', 'PTO Systems', 'U435_11_PTO_Systems.pdf', 293, 326, 34, 4.4, 'u435-chapters', 'U435_11_PTO_Systems.pdf', 'standard', ARRAY['pto', 'power', 'takeoff', 'hydraulic']),
('workshop', 12, '12_Front_Axle_Drive', 'Front Axle Drivetrain', 'U435_12_Front_Axle_Drive.pdf', 327, 364, 38, 4.8, 'u435-chapters', 'U435_12_Front_Axle_Drive.pdf', 'standard', ARRAY['front', 'axle', 'portal', 'drive']),
('workshop', 13, '13_Rear_Axle_Drive', 'Rear Axle Drivetrain', 'U435_13_Rear_Axle_Drive.pdf', 365, 402, 38, 4.5, 'u435-chapters', 'U435_13_Rear_Axle_Drive.pdf', 'standard', ARRAY['rear', 'axle', 'differential']),
('workshop', 14, '14_Wiring', 'Electrical Wiring', 'U435_14_Wiring.pdf', 403, 440, 38, 4.3, 'u435-chapters', 'U435_14_Wiring.pdf', 'standard', ARRAY['electrical', 'wiring', 'harness', 'connectors']),
('workshop', 15, '15_Instruments', 'Instruments Dashboard', 'U435_15_Instruments.pdf', 441, 467, 27, 3.1, 'u435-chapters', 'U435_15_Instruments.pdf', 'standard', ARRAY['instruments', 'gauges', 'dashboard', 'display']),
('workshop', 16, '16_Frame', 'Chassis Frame', 'U435_16_Frame.pdf', 468, 484, 17, 1.5, 'u435-chapters', 'U435_16_Frame.pdf', 'standard', ARRAY['chassis', 'frame', 'structure', 'mounting']),
('workshop', 17, '17_Suspension', 'Chassis Suspension', 'U435_17_Suspension.pdf', 485, 518, 34, 2.2, 'u435-chapters', 'U435_17_Suspension.pdf', 'standard', ARRAY['suspension', 'springs', 'shock', 'absorbers']),
('workshop', 18, '18_Steering', 'Chassis Steering', 'U435_18_Steering.pdf', 519, 554, 36, 3.9, 'u435-chapters', 'U435_18_Steering.pdf', 'standard', ARRAY['steering', 'wheel', 'power', 'assist']),
('workshop', 19, '19_Wheel_Hub_Front', 'Front Wheel Hub Drive', 'U435_19_Wheel_Hub_Front.pdf', 555, 586, 32, 3.7, 'u435-chapters', 'U435_19_Wheel_Hub_Front.pdf', 'critical', ARRAY['wheel', 'hub', 'drive', 'front', 'portal', 'bearing', 'disassembly']),
('workshop', 20, '20_Hub_Components', 'Hub Components', 'U435_20_Hub_Components.pdf', 587, 614, 28, 3.1, 'u435-chapters', 'U435_20_Hub_Components.pdf', 'standard', ARRAY['hub', 'components', 'bearing', 'seal']),
('workshop', 21, '21_Hub_Maintenance', 'Hub Maintenance', 'U435_21_Hub_Maintenance.pdf', 615, 650, 36, 3.7, 'u435-chapters', 'U435_21_Hub_Maintenance.pdf', 'standard', ARRAY['hub', 'maintenance', 'service', 'inspection']),
('workshop', 22, '22_Wheel_Hub_Rear', 'Rear Wheel Hub Drive', 'U435_22_Wheel_Hub_Rear.pdf', 651, 686, 36, 4.0, 'u435-chapters', 'U435_22_Wheel_Hub_Rear.pdf', 'critical', ARRAY['wheel', 'hub', 'drive', 'rear', 'disassembly']),
('workshop', 23, '23_Service_Brakes', 'Service Brakes', 'U435_23_Service_Brakes.pdf', 687, 722, 36, 3.5, 'u435-chapters', 'U435_23_Service_Brakes.pdf', 'high', ARRAY['brakes', 'hydraulic', 'disc', 'drum']),
('workshop', 24, '24_Parking_Brake', 'Parking Brake', 'U435_24_Parking_Brake.pdf', 723, 758, 36, 3.5, 'u435-chapters', 'U435_24_Parking_Brake.pdf', 'high', ARRAY['parking', 'brake', 'handbrake', 'mechanical']),
('workshop', 25, '25_Main_Hydraulics', 'Main Hydraulic System', 'U435_25_Main_Hydraulics.pdf', 759, 794, 36, 3.4, 'u435-chapters', 'U435_25_Main_Hydraulics.pdf', 'standard', ARRAY['hydraulic', 'pump', 'cylinder', 'valve']),
('workshop', 26, '26_Aux_Hydraulics', 'Auxiliary Hydraulic System', 'U435_26_Aux_Hydraulics.pdf', 795, 830, 36, 2.9, 'u435-chapters', 'U435_26_Aux_Hydraulics.pdf', 'standard', ARRAY['auxiliary', 'hydraulic', 'implements', 'attachments']),
('workshop', 27, '27_Cab_Structure', 'Cab Structure', 'U435_27_Cab_Structure.pdf', 831, 866, 36, 4.3, 'u435-chapters', 'U435_27_Cab_Structure.pdf', 'standard', ARRAY['cab', 'structure', 'body', 'mounting']),
('workshop', 28, '28_Doors_Windows', 'Doors and Windows', 'U435_28_Doors_Windows.pdf', 867, 902, 36, 3.9, 'u435-chapters', 'U435_28_Doors_Windows.pdf', 'standard', ARRAY['doors', 'windows', 'seals', 'mechanisms']),
('workshop', 29, '29_HVAC_Heating', 'HVAC Heating System', 'U435_29_HVAC_Heating.pdf', 903, 938, 36, 3.5, 'u435-chapters', 'U435_29_HVAC_Heating.pdf', 'high', ARRAY['hvac', 'heating', 'climate', 'control']),
('workshop', 30, '30_Lighting', 'Lighting System', 'U435_30_Lighting.pdf', 939, 974, 36, 4.1, 'u435-chapters', 'U435_30_Lighting.pdf', 'standard', ARRAY['lighting', 'headlights', 'taillights', 'work', 'lights']),
('workshop', 31, '31_Special_Equipment', 'Special Equipment', 'U435_31_Special_Equipment.pdf', 975, 1016, 42, 16.6, 'u435-chapters', 'U435_31_Special_Equipment.pdf', 'standard', ARRAY['special', 'equipment', 'implements', 'attachments']),
('workshop', 32, '32_Advanced_Electrical', 'Advanced Electrical SA35', 'U435_32_Advanced_Electrical.pdf', 1017, 1030, 14, 3.5, 'u435-chapters', 'U435_32_Advanced_Electrical.pdf', 'standard', ARRAY['electrical', 'sa35', 'automatic', 'cutouts']),
('workshop', 33, '33_Box_Electrical', 'Box-Type Body Electrical', 'U435_33_Box_Electrical.pdf', 1031, 1036, 6, 2.3, 'u435-chapters', 'U435_33_Box_Electrical.pdf', 'standard', ARRAY['box', 'body', 'electrical', 'auxiliary']),
('workshop', 34, '34_PTO_Shafts', 'PTO Shafts Assembly', 'U435_34_PTO_Shafts.pdf', 1037, 1041, 5, 0.3, 'u435-chapters', 'U435_34_PTO_Shafts.pdf', 'standard', ARRAY['pto', 'shafts', 'power', 'assembly']),
('workshop', 35, '35_Hydraulic_Advanced', 'Advanced Hydraulic System', 'U435_35_Hydraulic_Advanced.pdf', 1042, 1051, 10, 0.9, 'u435-chapters', 'U435_35_Hydraulic_Advanced.pdf', 'standard', ARRAY['hydraulic', 'system', 'pump', 'cylinder']),
('workshop', 36, '36_Hydrostat_Trans', 'Hydrostat Transmission', 'U435_36_Hydrostat_Trans.pdf', 1052, 1074, 23, 3.0, 'u435-chapters', 'U435_36_Hydrostat_Trans.pdf', 'high', ARRAY['hydrostat', 'transmission', 'hydromotor', 'hydropump']),
('workshop', 37, '37_Driver_Cab_Tilt', 'Driver Cab Tilting', 'U435_37_Driver_Cab_Tilt.pdf', 1075, 1094, 20, 2.5, 'u435-chapters', 'U435_37_Driver_Cab_Tilt.pdf', 'standard', ARRAY['driver', 'cab', 'tilting', 'device']),
('workshop', 38, '38_Box_Body_System', 'Box-Type Body System', 'U435_38_Box_Body_System.pdf', 1095, 1123, 29, 3.3, 'u435-chapters', 'U435_38_Box_Body_System.pdf', 'standard', ARRAY['box', 'type', 'body', 'roof', 'hatch']),
('workshop', 39, '39_Headlight_System', 'Headlight System', 'U435_39_Headlight_System.pdf', 1124, 1139, 16, 1.3, 'u435-chapters', 'U435_39_Headlight_System.pdf', 'standard', ARRAY['headlight', 'checking', 'adjusting', 'lights']),
('workshop', 40, '40_Heating_Basic', 'Basic Heating System', 'U435_40_Heating_Basic.pdf', 1140, 1151, 12, 1.4, 'u435-chapters', 'U435_40_Heating_Basic.pdf', 'high', ARRAY['heating', 'system', 'installation', 'heat', 'exchanger']),
('workshop', 41, '41_Heater_Eberspacher', 'Auxiliary Heater Eberspacher', 'U435_41_Heater_Eberspacher.pdf', 1152, 1185, 34, 2.8, 'u435-chapters', 'U435_41_Heater_Eberspacher.pdf', 'standard', ARRAY['auxiliary', 'heater', 'eberspacher']);

-- Insert Maintenance Manual sections (26 entries)
INSERT INTO u435_manual_parts (manual_type, part_number, slug, title, filename, start_page, end_page, page_count, file_size_mb, storage_bucket, storage_path, priority, keywords) VALUES
('maintenance', 0, '0_Foreward', 'Foreward', '0_Foreward.pdf', NULL, NULL, NULL, 0.2, 'u435-maintenance', '0_Foreward.pdf', 'standard', ARRAY['foreward', 'introduction']),
('maintenance', 0, '00_General', 'General', '00_General.pdf', NULL, NULL, NULL, 34.0, 'u435-maintenance', '00_General.pdf', 'high', ARRAY['general', 'overview', 'maintenance', 'schedule']),
('maintenance', 1, '01_Engine_Housing', 'Engine Housing', '01_Engine_Housing.pdf', NULL, NULL, NULL, 2.2, 'u435-maintenance', '01_Engine_Housing.pdf', 'standard', ARRAY['engine', 'housing', 'block']),
('maintenance', 5, '05_Engine_Timing', 'Engine Timing', '05_Engine_Timing.pdf', NULL, NULL, NULL, 2.4, 'u435-maintenance', '05_Engine_Timing.pdf', 'standard', ARRAY['engine', 'timing', 'valve']),
('maintenance', 7, '07_Fuel_Injectors', 'Fuel Injectors', '07_Fuel_Injectors.pdf', NULL, NULL, NULL, 4.5, 'u435-maintenance', '07_Fuel_Injectors.pdf', 'standard', ARRAY['fuel', 'injectors', 'diesel']),
('maintenance', 9, '09_Air_Filter', 'Air Filter', '09_Air_Filter.pdf', NULL, NULL, NULL, 2.8, 'u435-maintenance', '09_Air_Filter.pdf', 'standard', ARRAY['air', 'filter', 'filtration']),
('maintenance', 13, '13_Air_Compressor_Belts', 'Air Compressor + Belts', '13_Air_Compressor_Belts.pdf', NULL, NULL, NULL, 7.9, 'u435-maintenance', '13_Air_Compressor_Belts.pdf', 'standard', ARRAY['air', 'compressor', 'belts', 'drive']),
('maintenance', 18, '18_Engine_Lubrication', 'Engine Lubrication', '18_Engine_Lubrication.pdf', NULL, NULL, NULL, 2.5, 'u435-maintenance', '18_Engine_Lubrication.pdf', 'high', ARRAY['engine', 'lubrication', 'oil']),
('maintenance', 24, '24_Engine_Mounts', 'Engine Mounts', '24_Engine_Mounts.pdf', NULL, NULL, NULL, 3.0, 'u435-maintenance', '24_Engine_Mounts.pdf', 'standard', ARRAY['engine', 'mounts', 'suspension']),
('maintenance', 25, '25_Clutch', 'Clutch', '25_Clutch.pdf', NULL, NULL, NULL, 1.0, 'u435-maintenance', '25_Clutch.pdf', 'standard', ARRAY['clutch', 'engagement', 'adjustment']),
('maintenance', 26, '26_Transmission', 'Transmission', '26_Transmission.pdf', NULL, NULL, NULL, 2.8, 'u435-maintenance', '26_Transmission.pdf', 'high', ARRAY['transmission', 'gearbox', 'maintenance']),
('maintenance', 29, '29_Pedal_Linkage', 'Pedal Linkage', '29_Pedal_Linkage.pdf', NULL, NULL, NULL, 2.1, 'u435-maintenance', '29_Pedal_Linkage.pdf', 'standard', ARRAY['pedal', 'linkage', 'clutch', 'brake']),
('maintenance', 31, '31_Frame', 'Frame', '31_Frame.pdf', NULL, NULL, NULL, 2.2, 'u435-maintenance', '31_Frame.pdf', 'standard', ARRAY['frame', 'chassis', 'structure']),
('maintenance', 32, '32_Suspension', 'Suspension', '32_Suspension.pdf', NULL, NULL, NULL, 1.0, 'u435-maintenance', '32_Suspension.pdf', 'standard', ARRAY['suspension', 'springs', 'maintenance']),
('maintenance', 33, '33_Front_Axle', 'Front Axle', '33_Front_Axle.pdf', NULL, NULL, NULL, 5.1, 'u435-maintenance', '33_Front_Axle.pdf', 'high', ARRAY['front', 'axle', 'maintenance', 'oil']),
('maintenance', 35, '35_Rear_Axle', 'Rear Axle', '35_Rear_Axle.pdf', NULL, NULL, NULL, 0.4, 'u435-maintenance', '35_Rear_Axle.pdf', 'standard', ARRAY['rear', 'axle', 'maintenance']),
('maintenance', 40, '40_Wheels_Prop_Shafts', 'Wheels + Prop Shafts', '40_Wheels_Prop_Shafts.pdf', NULL, NULL, NULL, 4.1, 'u435-maintenance', '40_Wheels_Prop_Shafts.pdf', 'standard', ARRAY['wheels', 'prop', 'shafts', 'tires']),
('maintenance', 42, '42_Brakes_Hydraulic_Mechanical', 'Brakes - Hydraulic + Mechanical', '42_Brakes_Hydraulic_Mechanical.pdf', NULL, NULL, NULL, 11.0, 'u435-maintenance', '42_Brakes_Hydraulic_Mechanical.pdf', 'high', ARRAY['brakes', 'hydraulic', 'mechanical', 'maintenance']),
('maintenance', 43, '43_Brakes_Pneumatic', 'Brakes - Pneumatic', '43_Brakes_Pneumatic.pdf', NULL, NULL, NULL, 0.8, 'u435-maintenance', '43_Brakes_Pneumatic.pdf', 'standard', ARRAY['brakes', 'pneumatic', 'air']),
('maintenance', 46, '46_Steering', 'Steering', '46_Steering.pdf', NULL, NULL, NULL, 5.3, 'u435-maintenance', '46_Steering.pdf', 'standard', ARRAY['steering', 'maintenance', 'adjustment']),
('maintenance', 49, '49_Exhaust', 'Exhaust', '49_Exhaust.pdf', NULL, NULL, NULL, 1.4, 'u435-maintenance', '49_Exhaust.pdf', 'standard', ARRAY['exhaust', 'system', 'maintenance']),
('maintenance', 50, '50_Cooling_System', 'Cooling System', '50_Cooling_System.pdf', NULL, NULL, NULL, 3.1, 'u435-maintenance', '50_Cooling_System.pdf', 'standard', ARRAY['cooling', 'system', 'coolant', 'maintenance']),
('maintenance', 54, '54_Batteries', 'Batteries', '54_Batteries.pdf', NULL, NULL, NULL, 2.1, 'u435-maintenance', '54_Batteries.pdf', 'standard', ARRAY['batteries', 'electrical', 'maintenance']),
('maintenance', 55, '55_Special_Equipment', 'Special Equipment', '55_Special_Equipment.pdf', NULL, NULL, NULL, 8.3, 'u435-maintenance', '55_Special_Equipment.pdf', 'standard', ARRAY['special', 'equipment', 'maintenance']),
('maintenance', 60, '60_Body', 'Body', '60_Body.pdf', NULL, NULL, NULL, 17.0, 'u435-maintenance', '60_Body.pdf', 'standard', ARRAY['body', 'cab', 'maintenance']),
('maintenance', 82, '82_Headlights', 'Headlights', '82_Headlights.pdf', NULL, NULL, NULL, 1.2, 'u435-maintenance', '82_Headlights.pdf', 'standard', ARRAY['headlights', 'lighting', 'adjustment']);

-- Create searchable index table for terms
CREATE TABLE u435_manual_index (
    id SERIAL PRIMARY KEY,
    term TEXT NOT NULL,
    page_number INTEGER,
    manual_part_id INTEGER REFERENCES u435_manual_parts(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for search
CREATE INDEX idx_manual_index_term ON u435_manual_index(term);
CREATE INDEX idx_manual_index_page ON u435_manual_index(page_number);
CREATE INDEX idx_manual_index_part ON u435_manual_index(manual_part_id);

-- Insert key search terms with page references
INSERT INTO u435_manual_index (term, page_number, manual_part_id)
SELECT term, page, parts.id
FROM (VALUES
    ('wheel hub drive', 555, '19_Wheel_Hub_Front'),
    ('front hub', 555, '19_Wheel_Hub_Front'),
    ('portal axle', 327, '12_Front_Axle_Drive'),
    ('rear wheel hub', 651, '22_Wheel_Hub_Rear'),
    ('disassembly', 555, '19_Wheel_Hub_Front'),
    ('assembly', 555, '19_Wheel_Hub_Front'),
    ('engine', 17, '02_Engine_Overview'),
    ('om366', 17, '02_Engine_Overview'),
    ('transmission', 215, '09_Manual_Trans'),
    ('gearbox', 215, '09_Manual_Trans'),
    ('clutch', 215, '09_Manual_Trans'),
    ('brakes', 687, '23_Service_Brakes'),
    ('hydraulic brakes', 687, '23_Service_Brakes'),
    ('parking brake', 723, '24_Parking_Brake'),
    ('cooling system', 145, '06_Cooling_System'),
    ('fuel system', 163, '07_Fuel_System'),
    ('electrical', 403, '14_Wiring'),
    ('wiring', 403, '14_Wiring'),
    ('suspension', 485, '17_Suspension'),
    ('steering', 519, '18_Steering'),
    ('frame', 468, '16_Frame'),
    ('heating', 903, '29_HVAC_Heating'),
    ('hvac', 903, '29_HVAC_Heating')
) AS t(term, page, slug)
JOIN u435_manual_parts parts ON parts.slug = t.slug;

-- Create function to search manuals
CREATE OR REPLACE FUNCTION search_u435_manuals(search_term TEXT)
RETURNS TABLE (
    manual_type TEXT,
    part_number INTEGER,
    slug TEXT,
    title TEXT,
    filename TEXT,
    storage_path TEXT,
    relevance REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        p.manual_type,
        p.part_number,
        p.slug,
        p.title,
        p.filename,
        p.storage_bucket || '/' || p.storage_path as storage_path,
        CASE
            WHEN p.title ILIKE '%' || search_term || '%' THEN 1.0
            WHEN search_term = ANY(p.keywords) THEN 0.9
            WHEN EXISTS (
                SELECT 1 FROM u435_manual_index i
                WHERE i.manual_part_id = p.id
                AND i.term ILIKE '%' || search_term || '%'
            ) THEN 0.8
            ELSE 0.5
        END as relevance
    FROM u435_manual_parts p
    WHERE
        p.title ILIKE '%' || search_term || '%'
        OR search_term = ANY(p.keywords)
        OR EXISTS (
            SELECT 1 FROM u435_manual_index i
            WHERE i.manual_part_id = p.id
            AND i.term ILIKE '%' || search_term || '%'
        )
    ORDER BY relevance DESC, p.manual_type, p.part_number;
END;
$$ LANGUAGE plpgsql;

-- Create view for Barry AI quick access
CREATE OR REPLACE VIEW barry_manual_navigation AS
SELECT
    manual_type,
    part_number,
    slug,
    title,
    filename,
    CASE
        WHEN manual_type = 'workshop' THEN
            'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/' || filename
        WHEN manual_type = 'maintenance' THEN
            'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-maintenance/' || filename
    END as direct_url,
    start_page,
    end_page,
    page_count,
    file_size_mb,
    priority,
    keywords
FROM u435_manual_parts
ORDER BY manual_type, part_number;

-- Grant permissions
GRANT SELECT ON u435_manual_parts TO anon, authenticated;
GRANT SELECT ON u435_manual_index TO anon, authenticated;
GRANT SELECT ON barry_manual_navigation TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_u435_manuals TO anon, authenticated;

-- Add update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_manual_parts_updated_at
    BEFORE UPDATE ON u435_manual_parts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Summary comment
COMMENT ON TABLE u435_manual_parts IS 'Complete U435 manual system with 67 PDFs: 41 workshop manual parts + 26 maintenance manual sections';
COMMENT ON VIEW barry_manual_navigation IS 'Direct URL access for Barry AI to link to specific manual sections without semantic search';