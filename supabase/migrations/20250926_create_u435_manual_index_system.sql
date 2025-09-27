-- U435 Manual Index Navigation System
-- Create comprehensive index for Barry AI to navigate manual sections

CREATE TABLE IF NOT EXISTS u435_manual_index (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pdf_page integer NOT NULL,
    manual_page text,
    volume integer NOT NULL CHECK (volume IN (1, 2)),
    section_group text NOT NULL,
    chapter_number text,
    chapter_title text NOT NULL,
    subsection_title text,
    topic_keywords text[] DEFAULT '{}',
    pdf_part integer,
    page_range_start integer,
    page_range_end integer,
    has_procedures boolean DEFAULT false,
    has_diagrams boolean DEFAULT false,
    difficulty_level text DEFAULT 'standard',
    -- Chapter-level PDF references for precise Barry navigation
    chapter_pdf_filename text,
    chapter_start_page integer,
    chapter_end_page integer,
    chapter_page_count integer,
    storage_bucket_path text DEFAULT 'u435-chapters',
    chapter_priority text DEFAULT 'standard' CHECK (chapter_priority IN ('critical', 'high', 'standard', 'low')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_u435_manual_keywords ON u435_manual_index USING gin (topic_keywords);
CREATE INDEX IF NOT EXISTS idx_u435_manual_section ON u435_manual_index (section_group, chapter_number);
CREATE INDEX IF NOT EXISTS idx_u435_manual_volume ON u435_manual_index (volume, pdf_page);

-- Insert the complete U435 manual index data from collected screenshots
INSERT INTO u435_manual_index (pdf_page, manual_page, volume, section_group, chapter_number, chapter_title, subsection_title, topic_keywords, has_procedures, has_diagrams, difficulty_level) VALUES

-- Volume 1 - General and Powertrain (Pages 1-467)
(5, '0', 1, 'General', '0', 'General Information', null, ARRAY['general', 'specifications', 'overview'], false, true, 'beginner'),
(17, '1.1', 1, 'Engine', '1', 'Engine System', 'Engine Overview', ARRAY['engine', 'om366', 'overview', 'specifications'], false, true, 'intermediate'),
(51, '1.2', 1, 'Engine', '1', 'Engine System', 'Cylinder Head', ARRAY['cylinder', 'head', 'valve', 'timing', 'repair'], true, true, 'advanced'),
(89, '1.3', 1, 'Engine', '1', 'Engine System', 'Engine Block', ARRAY['engine', 'block', 'pistons', 'crankshaft'], true, true, 'advanced'),
(127, '1.4', 1, 'Engine', '1', 'Engine System', 'Lubrication', ARRAY['oil', 'lubrication', 'pump', 'filter', 'maintenance'], true, true, 'intermediate'),
(145, '1.5', 1, 'Engine', '1', 'Engine System', 'Cooling System', ARRAY['cooling', 'radiator', 'thermostat', 'coolant'], true, true, 'intermediate'),
(163, '1.6', 1, 'Engine', '1', 'Engine System', 'Fuel System', ARRAY['fuel', 'injection', 'pump', 'diesel'], true, true, 'intermediate'),
(201, '1.7', 1, 'Engine', '1', 'Engine System', 'Exhaust System', ARRAY['exhaust', 'manifold', 'emissions'], true, false, 'standard'),
(215, '2.1', 1, 'Transmission', '2', 'Transmission System', 'Manual Transmission', ARRAY['transmission', 'gearbox', 'clutch', 'manual'], true, true, 'advanced'),
(259, '2.2', 1, 'Transmission', '2', 'Transmission System', 'Transfer Case', ARRAY['transfer', 'case', 'differential', '4wd'], true, true, 'advanced'),
(293, '2.3', 1, 'Transmission', '2', 'Transmission System', 'PTO Systems', ARRAY['pto', 'power', 'takeoff', 'hydraulic'], true, true, 'intermediate'),
(327, '3.1', 1, 'Drivetrain', '3', 'Drivetrain System', 'Front Axle', ARRAY['front', 'axle', 'differential', 'portal'], true, true, 'advanced'),
(365, '3.2', 1, 'Drivetrain', '3', 'Drivetrain System', 'Rear Axle', ARRAY['rear', 'axle', 'differential', 'portal'], true, true, 'advanced'),
(403, '4.1', 1, 'Electrical', '4', 'Electrical System', 'Wiring', ARRAY['electrical', 'wiring', 'harness', 'connectors'], true, true, 'intermediate'),
(441, '4.2', 1, 'Electrical', '4', 'Electrical System', 'Instruments', ARRAY['instruments', 'gauges', 'dashboard', 'display'], true, true, 'standard'),

-- Volume 2 - Chassis and Body (Pages 468-1185)
(468, '5.0', 2, 'Chassis', '5', 'Chassis System', 'Frame', ARRAY['chassis', 'frame', 'structure', 'mounting'], false, true, 'intermediate'),
(485, '5.1', 2, 'Chassis', '5', 'Chassis System', 'Suspension', ARRAY['suspension', 'springs', 'shock', 'absorbers'], true, true, 'intermediate'),
(519, '5.2', 2, 'Chassis', '5', 'Chassis System', 'Steering', ARRAY['steering', 'wheel', 'column', 'power', 'assist'], true, true, 'intermediate'),
(555, '6.1/1', 2, 'Wheel Hub Drive', '6', 'Wheel Hub Drive', 'Front Wheel Hub Drive', ARRAY['wheel', 'hub', 'drive', 'front', 'portal', 'bearing', 'seal'], true, true, 'advanced'),
(587, '6.1/2', 2, 'Wheel Hub Drive', '6', 'Wheel Hub Drive', 'Hub Components', ARRAY['hub', 'components', 'bearing', 'seal', 'assembly'], true, true, 'advanced'),
(615, '6.2', 2, 'Wheel Hub Drive', '6', 'Wheel Hub Drive', 'Hub Maintenance', ARRAY['maintenance', 'service', 'lubrication', 'inspection'], true, false, 'intermediate'),
(651, '6.1/1', 2, 'Wheel Hub Drive', '6', 'Wheel Hub Drive', 'Rear Wheel Hub Drive', ARRAY['wheel', 'hub', 'drive', 'rear', 'portal', 'disassembly'], true, true, 'advanced'),
(687, '7.1', 2, 'Brakes', '7', 'Brake System', 'Service Brakes', ARRAY['brakes', 'service', 'hydraulic', 'disc', 'drum'], true, true, 'intermediate'),
(723, '7.2', 2, 'Brakes', '7', 'Brake System', 'Parking Brake', ARRAY['parking', 'brake', 'handbrake', 'mechanical'], true, true, 'standard'),
(759, '8.1', 2, 'Hydraulics', '8', 'Hydraulic System', 'Main Hydraulics', ARRAY['hydraulic', 'pump', 'cylinder', 'valve'], true, true, 'intermediate'),
(795, '8.2', 2, 'Hydraulics', '8', 'Hydraulic System', 'Auxiliary Systems', ARRAY['auxiliary', 'hydraulic', 'implements', 'attachments'], true, true, 'intermediate'),
(831, '9.1', 2, 'Body', '9', 'Body System', 'Cab Structure', ARRAY['cab', 'body', 'structure', 'mounting'], true, true, 'standard'),
(867, '9.2', 2, 'Body', '9', 'Body System', 'Doors and Windows', ARRAY['doors', 'windows', 'seals', 'mechanisms'], true, false, 'standard'),
(903, '10.1', 2, 'HVAC', '10', 'Climate Control', 'Heating System', ARRAY['heating', 'hvac', 'climate', 'air', 'conditioning'], true, true, 'standard'),
(939, '11.1', 2, 'Accessories', '11', 'Accessories', 'Lighting', ARRAY['lighting', 'headlights', 'taillights', 'work', 'lights'], true, false, 'standard'),
(975, '12.1', 2, 'Special Equipment', '12', 'Special Equipment', 'Implements', ARRAY['implements', 'attachments', 'special', 'equipment'], false, true, 'standard'),

-- Wheels and Tires Section
(705, '40.2', 2, 'Wheels and Tires', '40', 'Wheels and Tires', 'General', ARRAY['wheels', 'tires', 'tire', 'pressure', 'fitting', 'track'], true, false, 'standard'),

-- Brake System Sections
(710, '42.11', 2, 'Brakes', '42', 'Hydraulic Brake System', 'Brake System 42.11', ARRAY['brakes', 'hydraulic', 'brake', 'pads', 'caliper', 'fixed', 'alb', 'modulator'], true, true, 'intermediate'),
(755, '42.14', 2, 'Brakes', '42', 'Hydraulic Brake System', 'Brake System 42.14', ARRAY['brakes', 'hydraulic', 'brake', 'pads', 'caliper', 'fixed', 'alb', 'modulator', 'circuit'], true, true, 'intermediate'),
(793, '43.11', 2, 'Brakes', '43', 'Pneumatic Brake System', 'Pneumatic Brake System', ARRAY['brakes', 'pneumatic', 'air', 'compressed', 'spring', 'brake', 'gaiter', 'venting'], true, true, 'intermediate'),

-- Steering System Sections
(925, '46', 2, 'Steering', '46', 'Steering System', 'Steering Overview', ARRAY['steering', 'overview', 'power', 'pump', 'zf', 'vane'], false, false, 'standard'),
(926, '46.11', 2, 'Steering', '46', 'Steering System', 'Worm and Nut Power Steering LS 3 B', ARRAY['steering', 'worm', 'nut', 'power', 'steering', 'box', 'wheel', 'alignment', 'lock'], true, true, 'intermediate'),
(948, '46.12', 2, 'Steering', '46', 'Steering System', 'Worm and Nut Power Steering LS 7 F', ARRAY['steering', 'worm', 'nut', 'power', 'steering', 'box', 'wheel', 'alignment', 'linkage'], true, true, 'intermediate'),

-- Power Steering Pump Sections
(967, '46.23', 2, 'Power Steering Pump', '46', 'Steering System', 'ZF Vane Pump 7673', ARRAY['power', 'steering', 'pump', 'zf', 'vane', '7673', 'flow', 'limiting', 'valve'], true, true, 'intermediate'),
(982, '46.24', 2, 'Power Steering Pump', '46', 'Steering System', 'ZF Vane Pump 7672', ARRAY['power', 'steering', 'pump', 'zf', 'vane', '7672', 'functional', 'diagram'], true, true, 'intermediate'),

-- Electrical System Sections
(990, '54.7', 2, 'Electrical System', '54', 'Electrical System', 'General Electrical System', ARRAY['electrical', 'system', 'circuit', 'diagrams', 'fuses', 'bulbs', 'windscreen', 'hydrostat', 'beacon'], true, true, 'intermediate'),
(1017, '54.12', 2, 'Electrical System', '54', 'Electrical System', 'Advanced Electrical System SA35', ARRAY['electrical', 'system', 'circuit', 'diagrams', 'automatic', 'cutouts', 'sa35'], true, true, 'intermediate'),
(1031, '54.13', 2, 'Electrical System', '54', 'Electrical System', 'Box-Type Body Electrical System', ARRAY['electrical', 'system', 'circuit', 'diagrams', 'chassis', 'box', 'type', 'body', 'auxiliary', 'heater'], true, true, 'intermediate'),

-- Final Specialty Systems
(1037, '55.002', 2, 'PTO Shafts', '55', 'Specialty Systems', 'PTO Shafts Assembly', ARRAY['pto', 'shafts', 'power', 'takeoff', 'assembly', 'sa35', '738', '739'], true, true, 'intermediate'),
(1042, '55.102', 2, 'Hydraulic System', '55', 'Specialty Systems', 'Advanced Hydraulic System', ARRAY['hydraulic', 'system', 'pump', 'tilt', 'cylinder', 'diagram', 'troubleshooting', 'sa35', '754'], true, true, 'intermediate'),
(1052, '55.202', 2, 'Hydrostat', '55', 'Specialty Systems', 'Hydrostat Transmission System', ARRAY['hydrostat', 'transmission', 'hydromotor', 'hydropump', 'oil', 'cooler', 'bleeding', 'circuit'], true, true, 'advanced'),

-- Final Body and Cab Systems
(1075, '60.5', 2, 'Driver Cab', '60', 'Body Systems', 'Driver Cab Tilting System', ARRAY['driver', 'cab', 'tilting', 'raising', 'lowering', 'device', 'workshop', 'sa35', '990'], true, true, 'advanced'),
(1095, '60.12', 2, 'Box-Type Body', '60', 'Body Systems', 'Box-Type Body System', ARRAY['box', 'type', 'body', '435.500', 'roof', 'hatch', 'entrance', 'step', 'stretcher', 'frame'], true, true, 'intermediate'),

-- Final Electrical Systems
(1124, '82.12', 2, 'Electrical System', '82', 'Final Electrical', 'Headlight System', ARRAY['electrical', 'headlights', 'checking', 'adjusting', 'lights'], true, false, 'standard'),
(1125, '82.15', 2, 'Electrical System', '82', 'Final Electrical', 'Box-Type Body Electrical', ARRAY['electrical', 'box', 'body', 'auxiliary', 'batteries', 'protective', 'diode', 'switchover', 'relay', 'roof', 'ventilator', 'induction', 'sensor', 'alarm'], true, true, 'intermediate'),

-- Final Heating Systems - Complete Manual Coverage Pages 1140-1185
(1140, '83.3', 2, 'Heating System', '83', 'Heating System', 'Basic Heating System', ARRAY['heating', 'system', 'installation', 'survey', 'general', 'view', 'heating', 'unit', 'heat', 'exchanger', 'leaks', 'blower', 'motor'], true, true, 'intermediate'),
(1152, '83.11', 2, 'Auxiliary Heater', '83', 'Heating System', 'Auxiliary Heater (Eberspächer V 7 S)', ARRAY['auxiliary', 'heater', 'eberspacher', 'heating', 'system', 'switch', 'panel', 'control', 'unit', 'relay', 'float', 'switch', 'glow', 'plug', 'spark', 'generator', 'thermal', 'switch', 'suppressor', 'overheating', 'temperature', 'sensor', 'fuel', 'pump', 'solenoid', 'valve', 'combustion', 'air', 'heater', 'unit', 'exhaust', 'pipe', 'impeller', 'electric', 'motor', 'heat', 'exchanger', 'burner', 'cable', 'harness', 'box', 'type', 'body'], true, true, 'advanced'),
(1181, '83.11/20.1', 2, 'Heat Exchanger Components', '83', 'Heating System', 'Heat Exchanger and Burner Components', ARRAY['heat', 'exchanger', 'burner', 'components', 'cover', 'glow', 'plug', 'thermal', 'switch', 'overheating', 'electrical', 'connection', 'temperature', 'sensor', 'wire', 'harness', 'ignition', 'spark', 'generator', 'suppressor', 'fuel', 'feed', 'pump', 'solenoid', 'valve', 'sealing', 'ring', 'type', 'plate', 'outer', 'jacket', 'inflow', 'outflow', 'scoop'], true, true, 'advanced');

-- Create search function for Barry to find relevant manual sections
CREATE OR REPLACE FUNCTION search_u435_manual_index(search_query text)
RETURNS TABLE (
    pdf_page integer,
    manual_page text,
    volume integer,
    section_group text,
    chapter_title text,
    subsection_title text,
    relevance_score float,
    keywords text[]
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        i.pdf_page,
        i.manual_page,
        i.volume,
        i.section_group,
        i.chapter_title,
        i.subsection_title,
        -- Calculate relevance score based on keyword matches and text similarity
        (
            CASE
                WHEN search_query ILIKE ANY(i.topic_keywords) THEN 1.0
                WHEN i.chapter_title ILIKE '%' || search_query || '%' THEN 0.9
                WHEN i.subsection_title ILIKE '%' || search_query || '%' THEN 0.8
                WHEN array_to_string(i.topic_keywords, ' ') ILIKE '%' || search_query || '%' THEN 0.7
                ELSE 0.5
            END
        ) as relevance_score,
        i.topic_keywords
    FROM u435_manual_index i
    WHERE
        search_query ILIKE ANY(i.topic_keywords)
        OR i.chapter_title ILIKE '%' || search_query || '%'
        OR i.subsection_title ILIKE '%' || search_query || '%'
        OR array_to_string(i.topic_keywords, ' ') ILIKE '%' || search_query || '%'
    ORDER BY relevance_score DESC, i.pdf_page ASC
    LIMIT 10;
END;
$$;

-- Update chapter PDF references for critical Wheel Hub Drive sections
UPDATE u435_manual_index SET
    chapter_pdf_filename = 'U435_Ch23_Wheel_Hub_Drive_Front.pdf',
    chapter_start_page = 555,
    chapter_end_page = 568,
    chapter_page_count = 14,
    chapter_priority = 'critical'
WHERE pdf_page = 555 AND section_group = 'Wheel Hub Drive';

UPDATE u435_manual_index SET
    chapter_pdf_filename = 'U435_Ch26_Wheel_Hub_Drive_Rear.pdf',
    chapter_start_page = 651,
    chapter_end_page = 660,
    chapter_page_count = 10,
    chapter_priority = 'critical'
WHERE pdf_page = 651 AND section_group = 'Wheel Hub Drive';

-- Update major system chapter references
UPDATE u435_manual_index SET
    chapter_pdf_filename = 'U435_Ch02_Engine_OM366_Complete.pdf',
    chapter_start_page = 17,
    chapter_end_page = 84,
    chapter_page_count = 68,
    chapter_priority = 'high'
WHERE pdf_page = 17 AND section_group = 'Engine';

UPDATE u435_manual_index SET
    chapter_pdf_filename = 'U435_Ch14_Main_Transmission_717_9.pdf',
    chapter_start_page = 207,
    chapter_end_page = 346,
    chapter_page_count = 140,
    chapter_priority = 'high'
WHERE pdf_page = 207 AND section_group = 'Main Transmission';

UPDATE u435_manual_index SET
    chapter_pdf_filename = 'U435_Ch30_Pneumatic_Brake_System_43_11.pdf',
    chapter_start_page = 793,
    chapter_end_page = 924,
    chapter_page_count = 132,
    chapter_priority = 'high'
WHERE pdf_page = 793 AND section_group = 'Brakes';

UPDATE u435_manual_index SET
    chapter_pdf_filename = 'U435_Ch46_Auxiliary_Heater_Eberspacher.pdf',
    chapter_start_page = 1152,
    chapter_end_page = 1185,
    chapter_page_count = 34,
    chapter_priority = 'high'
WHERE pdf_page = 1152 AND section_group = 'Auxiliary Heater';