-- Migration: Insert Sample WIS Data
-- This migration creates sample hierarchical data for U435 based on the original Mercedes structure

-- Step 1: Create U435 model
INSERT INTO wis_models (model_code, model_name, description, year_range, sort_order) VALUES
('U435', 'Unimog U435', 'Medium duty Unimog with portal axles and differential locks', '1975-1991', 1);

-- Step 2: Create system categories for U435
WITH model AS (SELECT id FROM wis_models WHERE model_code = 'U435')
INSERT INTO wis_systems (model_id, system_code, system_name, description, icon_name, sort_order)
SELECT
    model.id,
    system_code,
    system_name,
    description,
    icon_name,
    ROW_NUMBER() OVER (ORDER BY system_code::INTEGER)
FROM model, (VALUES
    ('01', 'Engine', 'Engine and related components', 'engine'),
    ('02', 'Fuel System', 'Fuel injection, tank, and delivery system', 'fuel'),
    ('03', 'Cooling System', 'Radiator, water pump, and cooling components', 'cooling'),
    ('04', 'Intake/Exhaust', 'Air intake and exhaust system', 'exhaust'),
    ('05', 'Engine Management', 'Electronic control systems', 'computer'),
    ('10', 'Clutch', 'Clutch assembly and hydraulic system', 'clutch'),
    ('15', 'Manual Transmission', 'Gearbox and related components', 'transmission'),
    ('20', 'Transfer Case', 'Transfer case and PTO', 'transfer'),
    ('25', 'Axles/Portal Hubs', 'Front and rear axles, portal hubs, differentials', 'axle'),
    ('30', 'Suspension', 'Springs, shock absorbers, stabilizers', 'suspension'),
    ('35', 'Steering', 'Steering system and components', 'steering'),
    ('40', 'Brakes', 'Brake system and components', 'brakes'),
    ('50', 'Body/Cab', 'Body panels, doors, windows, interior', 'body'),
    ('60', 'Electrical', 'Electrical system and components', 'electric'),
    ('70', 'Special Equipment', 'Hydraulics, PTO, implements', 'hydraulic'),
    ('80', 'Service Information', 'General service data and specifications', 'info')
) AS systems(system_code, system_name, description, icon_name);

-- Step 3: Create component groups for Axles system (25)
WITH system AS (
    SELECT s.id
    FROM wis_systems s
    JOIN wis_models m ON s.model_id = m.id
    WHERE m.model_code = 'U435' AND s.system_code = '25'
)
INSERT INTO wis_components (system_id, component_code, component_name, description, sort_order)
SELECT
    system.id,
    component_code,
    component_name,
    description,
    ROW_NUMBER() OVER (ORDER BY component_code::INTEGER)
FROM system, (VALUES
    ('10', 'Front Axle Assembly', 'Complete front axle with differential and portal hubs'),
    ('20', 'Portal Hub Assembly', 'Portal hub gears, seals, housing, and bearings'),
    ('30', 'Differential', 'Differential gears, carrier, and limited slip components'),
    ('40', 'Axle Tubes', 'Axle tubes, mounting points, and brake anchors'),
    ('50', 'Drive Shafts', 'CV joints, drive shafts, and universal joints')
) AS components(component_code, component_name, description);

-- Step 4: Create components for Engine system (01)
WITH system AS (
    SELECT s.id
    FROM wis_systems s
    JOIN wis_models m ON s.model_id = m.id
    WHERE m.model_code = 'U435' AND s.system_code = '01'
)
INSERT INTO wis_components (system_id, component_code, component_name, description, sort_order)
SELECT
    system.id,
    component_code,
    component_name,
    description,
    ROW_NUMBER() OVER (ORDER BY component_code::INTEGER)
FROM system, (VALUES
    ('10', 'Cylinder Head', 'Cylinder head, valves, and camshaft'),
    ('20', 'Engine Block', 'Block, pistons, connecting rods, and crankshaft'),
    ('30', 'Oil System', 'Oil pump, filter, and lubrication system'),
    ('40', 'Timing System', 'Timing chain/belt, tensioners, and guides')
) AS components(component_code, component_name, description);

-- Step 5: Create sample procedures for Portal Hub component (25.20)
WITH component AS (
    SELECT c.id
    FROM wis_components c
    JOIN wis_systems s ON c.system_id = s.id
    JOIN wis_models m ON s.model_id = m.id
    WHERE m.model_code = 'U435' AND s.system_code = '25' AND c.component_code = '20'
)
INSERT INTO wis_procedures (component_id, procedure_code, title, description, estimated_time_hours, difficulty_level, labor_category, overview, safety_warnings)
SELECT
    component.id,
    procedure_code,
    title,
    description,
    estimated_time_hours,
    difficulty_level,
    labor_category,
    overview,
    safety_warnings
FROM component, (VALUES
    ('25.20.01', 'Remove/Install Portal Hub Assembly', 'Complete removal and installation of portal hub assembly', 4.0, 3, 'repair', 'This procedure covers the complete removal and installation of the portal hub assembly including disconnection of all related components. Requires lifting vehicle and proper support.', ARRAY['Use proper lifting equipment rated for vehicle weight', 'Ensure vehicle is securely supported on jack stands', 'Wear safety glasses and work gloves']),
    ('25.20.02', 'Replace Portal Hub Seals', 'Replace all seals in portal hub assembly', 2.5, 2, 'maintenance', 'Replacement of oil seals and dust seals in the portal hub assembly to prevent oil leakage. Can be performed with hub installed if access permits.', ARRAY['Wear safety glasses when removing old seals', 'Use nitrile gloves when handling seals and oil', 'Dispose of used oil according to local regulations']),
    ('25.20.03', 'Portal Hub Oil Change', 'Change portal hub oil and inspect components', 1.0, 1, 'maintenance', 'Regular maintenance procedure to change portal hub oil and inspect internal components. Should be performed every 50,000km or as specified in maintenance schedule.', ARRAY['Dispose of used oil properly', 'Check for metal particles in old oil', 'Ensure hub is at operating temperature before draining']),
    ('25.20.04', 'Portal Hub Bearing Replacement', 'Replace portal hub bearings and races', 3.5, 4, 'overhaul', 'Complete bearing replacement including pressing operations and preload adjustment. Requires special tools and precision measurement equipment.', ARRAY['Use proper pressing tools only - never hammer bearings', 'Follow torque specifications exactly', 'Check bearing preload with dial indicator']),
    ('25.20.05', 'Portal Hub Gear Inspection', 'Inspect and measure portal hub gears', 2.0, 3, 'inspection', 'Detailed inspection of portal hub planetary gears, sun gear, and ring gear for wear, damage, and proper backlash.', ARRAY['Clean all components thoroughly before inspection', 'Use proper measuring tools for backlash check', 'Document all measurements'])
) AS procedures(procedure_code, title, description, estimated_time_hours, difficulty_level, labor_category, overview, safety_warnings);

-- Step 6: Create sample procedures for Engine components (01.20)
WITH component AS (
    SELECT c.id
    FROM wis_components c
    JOIN wis_systems s ON c.system_id = s.id
    JOIN wis_models m ON s.model_id = m.id
    WHERE m.model_code = 'U435' AND s.system_code = '01' AND c.component_code = '20'
)
INSERT INTO wis_procedures (component_id, procedure_code, title, description, estimated_time_hours, difficulty_level, labor_category, overview, safety_warnings)
SELECT
    component.id,
    procedure_code,
    title,
    description,
    estimated_time_hours,
    difficulty_level,
    labor_category,
    overview,
    safety_warnings
FROM component, (VALUES
    ('01.20.01', 'Engine Block Inspection', 'Inspect engine block for cracks and wear', 3.0, 3, 'inspection', 'Comprehensive inspection of engine block including cylinder bore measurement, deck surface check, and crack detection.', ARRAY['Use proper lifting equipment when handling engine block', 'Wear safety glasses during cleaning operations', 'Use appropriate solvents in ventilated area']),
    ('01.20.02', 'Piston and Rod Assembly', 'Remove, inspect, and install piston assemblies', 6.0, 4, 'overhaul', 'Complete piston and connecting rod service including removal, inspection, ring replacement, and installation with proper torque specifications.', ARRAY['Support engine properly during disassembly', 'Follow torque sequence exactly for rod bolts', 'Check ring gap and end clearance'])
) AS procedures(procedure_code, title, description, estimated_time_hours, difficulty_level, labor_category, overview, safety_warnings);

-- Step 7: Create sample procedure steps for Portal Hub Seal Replacement
WITH procedure AS (
    SELECT p.id
    FROM wis_procedures p
    JOIN wis_components c ON p.component_id = c.id
    JOIN wis_systems s ON c.system_id = s.id
    JOIN wis_models m ON s.model_id = m.id
    WHERE m.model_code = 'U435' AND p.procedure_code = '25.20.02'
)
INSERT INTO wis_procedure_steps (procedure_id, step_number, step_title, instruction, detailed_notes, safety_warnings, torque_specs, verification_points)
SELECT
    procedure.id,
    step_number,
    step_title,
    instruction,
    detailed_notes,
    safety_warnings,
    torque_specs::jsonb,
    verification_points
FROM procedure, (VALUES
    (1, 'Preparation and Safety', 'Raise vehicle safely and remove wheel assembly. Drain portal hub oil completely.', 'Use vehicle-specific lifting points. Allow hub to cool if vehicle was recently driven. Have drain pan ready with minimum 2-liter capacity.', ARRAY['Ensure vehicle is on level ground before lifting', 'Use jack stands rated for vehicle weight'], '{}', ARRAY['Vehicle securely supported', 'Oil completely drained', 'Work area clean and organized']),
    (2, 'Remove Hub Cover', 'Remove the 6 hub cover bolts using 13mm socket. Remove cover and gasket.', 'Bolts may be tight due to thread locker. Clean threads thoroughly. Inspect cover for cracks or damage.', ARRAY['Support cover weight when removing last bolts'], '{"hub_cover_bolts": "25 Nm"}', ARRAY['All bolts removed and stored safely', 'Cover removed without damage', 'Gasket condition noted']),
    (3, 'Access Seals', 'Remove circlip retaining outer seal. Use appropriate pullers to remove old seals.', 'Note seal orientation before removal. Some seals may be press-fit and require special pullers. Do not damage seal housing.', ARRAY['Use proper seal pullers to avoid housing damage'], '{}', ARRAY['Circlip removed without distortion', 'Seals removed cleanly', 'Housing inspected for damage']),
    (4, 'Clean and Inspect', 'Clean all seal surfaces with solvent. Inspect housing for scratches or damage.', 'Use lint-free cloths. Minor scratches can be polished out with fine abrasive. Replace housing if severely damaged.', ARRAY['Use solvents in ventilated area'], '{}', ARRAY['All surfaces clean and dry', 'No significant housing damage', 'Seal surfaces smooth']),
    (5, 'Install New Seals', 'Install new seals using proper installation tools. Apply thin coat of gear oil to seal lips.', 'Ensure seals are oriented correctly. Use seal installation tools to prevent damage. Do not hammer directly on seals.', ARRAY['Use appropriate installation tools only'], '{}', ARRAY['Seals fully seated', 'No visible damage to seal lips', 'Correct orientation verified']),
    (6, 'Reassemble and Fill', 'Install new gasket and hub cover. Torque bolts to specification in cross pattern. Fill with specified oil.', 'Use new gasket only. Apply thin coat of sealant if specified. Check oil level after initial filling and running.', ARRAY['Do not overtighten bolts'], '{"hub_cover_bolts": "25 Nm"}', ARRAY['Cover properly seated', 'All bolts torqued to specification', 'Oil level correct', 'No leaks visible']),
    (7, 'Final Check', 'Test drive vehicle and recheck oil level and for leaks after 50km.', 'Allow hub to reach operating temperature. Check for unusual noises or vibration. Top up oil if necessary.', ARRAY['Check for leaks before returning vehicle to service'], '{}', ARRAY['No oil leaks present', 'Oil level stable', 'No unusual noises or vibration'])
) AS steps(step_number, step_title, instruction, detailed_notes, safety_warnings, torque_specs, verification_points);

-- Step 8: Create sample parts for Portal Hub Seal Replacement
-- First add some sample parts to the parts catalog
INSERT INTO wis_parts (mercedes_part_number, description, category, specifications, status) VALUES
('A 000 330 00 03', 'Portal Hub Oil Seal - Inner', 'seal', '{"diameter": "85mm", "width": "12mm", "material": "NBR"}', 'available'),
('A 000 330 00 04', 'Portal Hub Dust Seal', 'seal', '{"diameter": "90mm", "width": "15mm", "material": "Polyurethane"}', 'available'),
('A 000 997 01 47', 'Cover Gasket O-Ring', 'gasket', '{"diameter": "180mm", "cross_section": "3mm", "material": "EPDM"}', 'available'),
('MB 235.8', 'Portal Hub Oil SAE 90', 'fluid', '{"viscosity": "SAE 90", "specification": "MB 235.8", "quantity": "1.8L"}', 'available'),
('A 000 989 25 10', 'Hub Cover Gasket', 'gasket', '{"material": "Cork/Rubber", "thickness": "2mm"}', 'available');

-- Link parts to the Portal Hub Seal Replacement procedure
WITH procedure AS (
    SELECT p.id
    FROM wis_procedures p
    JOIN wis_components c ON p.component_id = c.id
    JOIN wis_systems s ON c.system_id = s.id
    JOIN wis_models m ON s.model_id = m.id
    WHERE m.model_code = 'U435' AND p.procedure_code = '25.20.02'
)
INSERT INTO wis_procedure_parts (procedure_id, part_id, quantity, usage_note, required, step_numbers)
SELECT
    procedure.id,
    parts.id,
    quantity,
    usage_note,
    required,
    step_numbers
FROM procedure, (
    SELECT
        p.id,
        q.quantity,
        q.usage_note,
        q.required,
        q.step_numbers
    FROM wis_parts p, (VALUES
        ('A 000 330 00 03', 2, 'One per side', true, ARRAY[5]),
        ('A 000 330 00 04', 2, 'One per side', true, ARRAY[5]),
        ('A 000 997 01 47', 1, 'Replace if damaged', false, ARRAY[6]),
        ('MB 235.8', 1, 'Approximately 1.8L capacity', true, ARRAY[6]),
        ('A 000 989 25 10', 1, 'Always replace', true, ARRAY[6])
    ) AS q(part_number, quantity, usage_note, required, step_numbers)
    WHERE p.mercedes_part_number = q.part_number
) AS parts;

-- Step 9: Create sample tools
INSERT INTO wis_tools (tool_name, tool_type, mercedes_tool_number, description, specifications) VALUES
('Socket Set Metric', 'standard', NULL, 'Complete metric socket set 8-24mm', '{"sizes": "8-24mm", "drive": "1/2 inch"}'),
('Torque Wrench', 'standard', NULL, 'Torque wrench 10-150 Nm', '{"range": "10-150 Nm", "accuracy": "±3%"}'),
('Seal Puller Set', 'special', 'A 123 589 00 21', 'Seal removal tool set', '{"sizes": "Various", "type": "Hook and slide hammer"}'),
('Seal Installation Tool', 'special', 'A 123 589 01 63', 'Seal installation mandrels', '{"sizes": "80-100mm", "material": "Aluminum"}'),
('Oil Drain Pan', 'standard', NULL, 'Oil drain container minimum 3L', '{"capacity": "3L minimum", "material": "Metal or plastic"}');

-- Link tools to the Portal Hub Seal Replacement procedure
WITH procedure AS (
    SELECT p.id
    FROM wis_procedures p
    JOIN wis_components c ON p.component_id = c.id
    JOIN wis_systems s ON c.system_id = s.id
    JOIN wis_models m ON s.model_id = m.id
    WHERE m.model_code = 'U435' AND p.procedure_code = '25.20.02'
)
INSERT INTO wis_procedure_tools (procedure_id, tool_id, required, usage_note, step_numbers)
SELECT
    procedure.id,
    tools.id,
    required,
    usage_note,
    step_numbers
FROM procedure, (
    SELECT
        t.id,
        tq.required,
        tq.usage_note,
        tq.step_numbers
    FROM wis_tools t, (VALUES
        ('Socket Set Metric', true, 'For hub cover bolts', ARRAY[2, 6]),
        ('Torque Wrench', true, 'For final bolt tightening', ARRAY[6]),
        ('Seal Puller Set', true, 'For seal removal', ARRAY[3]),
        ('Seal Installation Tool', true, 'For new seal installation', ARRAY[5]),
        ('Oil Drain Pan', true, 'For oil drainage', ARRAY[1])
    ) AS tq(tool_name, required, usage_note, step_numbers)
    WHERE t.tool_name = tq.tool_name
) AS tools;

-- Step 10: Create sample service bulletin
INSERT INTO wis_service_bulletins (bulletin_number, title, description, content, applicable_models, applicable_systems, effective_date, severity, category, status) VALUES
('TB-2019-001', 'Updated Portal Hub Seal Design', 'New seal design improves durability and reduces oil leakage', 'Mercedes-Benz has introduced an updated portal hub seal design (part number A 000 330 00 03) that provides improved sealing performance and extended service life. The new seal features a modified lip design and enhanced material composition. When replacing portal hub seals, always use the latest part number.', ARRAY['U435', 'U400'], ARRAY['25'], '2019-03-15', 'important', 'update', 'active');

-- Link bulletin to procedure
WITH bulletin AS (SELECT id FROM wis_service_bulletins WHERE bulletin_number = 'TB-2019-001'),
     procedure AS (
         SELECT p.id
         FROM wis_procedures p
         JOIN wis_components c ON p.component_id = c.id
         JOIN wis_systems s ON c.system_id = s.id
         JOIN wis_models m ON s.model_id = m.id
         WHERE m.model_code = 'U435' AND p.procedure_code = '25.20.02'
     )
INSERT INTO wis_bulletin_procedures (bulletin_id, procedure_id, relationship_type, notes)
SELECT bulletin.id, procedure.id, 'updates', 'Use updated seal part number when available'
FROM bulletin, procedure;

-- Step 11: Create procedure relationships (cross-references)
WITH procedures AS (
    SELECT p.id, p.procedure_code
    FROM wis_procedures p
    JOIN wis_components c ON p.component_id = c.id
    JOIN wis_systems s ON c.system_id = s.id
    JOIN wis_models m ON s.model_id = m.id
    WHERE m.model_code = 'U435'
)
INSERT INTO wis_procedure_relationships (source_procedure_id, target_procedure_id, relationship_type, relationship_description)
SELECT
    source.id,
    target.id,
    relationship_type::procedure_relationship_type,
    relationship_description
FROM procedures source, procedures target, (VALUES
    ('25.20.02', '25.20.01', 'prerequisite', 'Hub removal may be required for complete seal replacement'),
    ('25.20.02', '25.20.03', 'follow_up', 'Oil change recommended after seal replacement'),
    ('25.20.01', '25.20.04', 'related', 'Both procedures involve hub disassembly'),
    ('25.20.03', '25.20.05', 'related', 'Gear inspection can be performed during oil change')
) AS relations(source_code, target_code, relationship_type, relationship_description)
WHERE source.procedure_code = relations.source_code
AND target.procedure_code = relations.target_code;

-- Update procedure counts in components and systems
UPDATE wis_components SET estimated_procedures = (
    SELECT COUNT(*) FROM wis_procedures p WHERE p.component_id = wis_components.id
);

UPDATE wis_systems SET estimated_procedures = (
    SELECT SUM(c.estimated_procedures) FROM wis_components c WHERE c.system_id = wis_systems.id
);