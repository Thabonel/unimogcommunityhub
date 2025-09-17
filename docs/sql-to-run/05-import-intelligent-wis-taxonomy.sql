-- 05 - Import Intelligent WIS Component Taxonomy
-- This creates the foundation for intelligent media recommendations and semantic search
-- Run in Supabase Dashboard SQL Editor after creating the intelligent WIS tables

-- Insert Component Taxonomy (Level 1: Major Systems)
INSERT INTO wis_component_taxonomy (system_name, subsystem_name, component_category, parent_category, level, description, metadata) VALUES
('engine_systems', NULL, 'Engine Systems', NULL, 1, 'Engine components and assemblies', '{"total_parts": 13, "subsystem_count": 2, "category_count": 7}'),
('transmission_systems', NULL, 'Transmission Systems', NULL, 1, 'Transmission components and assemblies', '{"total_parts": 3, "subsystem_count": 1, "category_count": 2}'),
('hydraulic_systems', NULL, 'Hydraulic Systems', NULL, 1, 'Hydraulic components and assemblies', '{"total_parts": 1, "subsystem_count": 1, "category_count": 1}'),
('chassis_suspension', NULL, 'Chassis Suspension', NULL, 1, 'Chassis suspension components and assemblies', '{"total_parts": 2, "subsystem_count": 2, "category_count": 2}'),
('brake_systems', NULL, 'Brake Systems', NULL, 1, 'Brake components and assemblies', '{"total_parts": 1, "subsystem_count": 1, "category_count": 1}'),
('electrical_systems', NULL, 'Electrical Systems', NULL, 1, 'Electrical components and assemblies', '{"total_parts": 1, "subsystem_count": 1, "category_count": 1}'),
('service_parts', NULL, 'Service Parts', NULL, 1, 'Service and maintenance parts', '{"total_parts": 2, "subsystem_count": 1, "category_count": 1}'),
('body_cab', NULL, 'Body Cab', NULL, 1, 'Body and cab components', '{"total_parts": 1, "subsystem_count": 1, "category_count": 1}');

-- Insert Level 2: Subsystems
INSERT INTO wis_component_taxonomy (system_name, subsystem_name, component_category, parent_category, level, description, metadata) VALUES
('engine_systems', 'om352_engine', 'OM352 ENGINE', 'Engine Systems', 2, 'OM352 ENGINE components', '{"part_count": 10, "categories": ["Engine Block", "Cylinder Head", "Pistons", "Connecting Rods", "Crankshaft", "Valve Train", "Valves"], "price_range": {"min": 18.5, "max": 12450}, "year_range": {"min": 1974, "max": 1978}}'),
('engine_systems', 'om366_engine', 'OM366 ENGINE', 'Engine Systems', 2, 'OM366 ENGINE components', '{"part_count": 3, "categories": ["Engine Block", "Cylinder Head", "Pistons"], "price_range": {"min": 32, "max": 3850}, "year_range": {"min": 1979, "max": 1991}}'),
('transmission_systems', 'ug8_1_transmission', 'UG8 1_TRANSMISSION', 'Transmission Systems', 2, 'UG8 1_TRANSMISSION components', '{"part_count": 3, "categories": ["Case & Housing", "Synchronizers"]}'),
('hydraulic_systems', 'single_circuit', 'SINGLE CIRCUIT', 'Hydraulic Systems', 2, 'SINGLE CIRCUIT components', '{"part_count": 1, "categories": ["Filtration"]}'),
('chassis_suspension', 'front_axle', 'FRONT AXLE', 'Chassis Suspension', 2, 'FRONT AXLE components', '{"part_count": 1, "categories": ["Portal Axle Housing"]}'),
('chassis_suspension', 'rear_axle', 'REAR AXLE', 'Chassis Suspension', 2, 'REAR AXLE components', '{"part_count": 1, "categories": ["Axle Assembly"]}'),
('brake_systems', 'master_cylinder', 'MASTER CYLINDER', 'Brake Systems', 2, 'MASTER CYLINDER components', '{"part_count": 1, "categories": ["Master Cylinder"]}'),
('electrical_systems', 'charging_system', 'CHARGING SYSTEM', 'Electrical Systems', 2, 'CHARGING SYSTEM components', '{"part_count": 1, "categories": ["Charging"]}'),
('service_parts', 'filters', 'FILTERS', 'Service Parts', 2, 'FILTERS components', '{"part_count": 2, "categories": ["Oil Filter"]}'),
('body_cab', 'doors', 'DOORS', 'Body Cab', 2, 'DOORS components', '{"part_count": 1, "categories": ["Doors"]}');

-- Insert Sample Parts Data (U435 Unimog 1974-1991)
INSERT INTO wis_parts_catalog (part_number, description, category, system_name, subsystem_name, weight_kg, price_eur, availability, compatible_years, technical_specs, related_parts) VALUES
-- OM352 Engine Parts (1974-1978)
('A000 010 07 20', 'Engine Block Assembly - OM352', 'Engine Block', 'engine_systems', 'om352_engine', 245.0, 12450.00, 'NLA - Core Exchange Only', ARRAY[1974,1975,1976,1977,1978], '{"cross_reference": ["352 010 07 20"]}', ARRAY['352 010 07 20']),
('A000 010 12 01', 'Cylinder Head - OM352', 'Cylinder Head', 'engine_systems', 'om352_engine', 38.5, 3250.00, 'Available', ARRAY[1974,1975,1976,1977,1978], '{"torque_spec_nm": 140, "sequence": "Cross pattern, 3 stages: 70Nm, 105Nm, 140Nm"}', ARRAY[]::TEXT[]),
('A000 030 00 17', 'Piston Assembly - OM352 (Set of 6)', 'Pistons', 'engine_systems', 'om352_engine', 8.4, 890.00, 'Available', ARRAY[1974,1975,1976,1977,1978], '{"bore_mm": 97.0, "compression_ratio": "17:1"}', ARRAY[]::TEXT[]),
('A000 030 10 20', 'Connecting Rod - OM352', 'Connecting Rods', 'engine_systems', 'om352_engine', 1.85, 185.00, 'Available', ARRAY[1974,1975,1976,1977,1978], '{"length_mm": 165, "big_end_bearing": "A000 030 15 84"}', ARRAY['A000 030 15 84']),
('A000 030 25 01', 'Crankshaft Assembly - OM352', 'Crankshaft', 'engine_systems', 'om352_engine', 89.0, 4850.00, 'Core Exchange', ARRAY[1974,1975,1976,1977,1978], '{"stroke_mm": 128.0, "main_bearing": "A000 030 30 84"}', ARRAY['A000 030 30 84']),
('A000 070 03 09', 'Camshaft - OM352', 'Valve Train', 'engine_systems', 'om352_engine', 12.5, 1250.00, 'Available', ARRAY[1974,1975,1976,1977,1978], '{"lift_intake_mm": 10.5, "lift_exhaust_mm": 10.0}', ARRAY[]::TEXT[]),
('A000 051 01 33', 'Intake Valve - OM352', 'Valves', 'engine_systems', 'om352_engine', 0.165, 45.00, 'Available', ARRAY[1974,1975,1976,1977,1978], '{"diameter_mm": 44.0, "length_mm": 108.5}', ARRAY[]::TEXT[]),
('A000 051 02 33', 'Exhaust Valve - OM352', 'Valves', 'engine_systems', 'om352_engine', 0.175, 48.50, 'Available', ARRAY[1974,1975,1976,1977,1978], '{"diameter_mm": 40.0, "length_mm": 108.5}', ARRAY[]::TEXT[]),

-- OM366 Engine Parts (1979-1991)
('A000 010 07 21', 'Engine Block Assembly - OM366', 'Engine Block', 'engine_systems', 'om366_engine', 285.0, 14850.00, 'Core Exchange', ARRAY[1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{}', ARRAY[]::TEXT[]),
('A000 010 12 02', 'Cylinder Head - OM366', 'Cylinder Head', 'engine_systems', 'om366_engine', 42.0, 3850.00, 'Available', ARRAY[1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{"torque_spec_nm": 160}', ARRAY[]::TEXT[]),
('A000 030 00 18', 'Piston Assembly - OM366 (Set of 6)', 'Pistons', 'engine_systems', 'om366_engine', 9.2, 1150.00, 'Available', ARRAY[1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{"bore_mm": 97.0}', ARRAY[]::TEXT[]),

-- Transmission Parts
('G85 001 01', 'Transmission Case - UG8/1', 'Case & Housing', 'transmission_systems', 'ug8_1_transmission', 125.0, 2850.00, 'NLA - Core Exchange Only', ARRAY[1974,1975,1976,1977,1978], '{}', ARRAY[]::TEXT[]),
('G85 201 02', 'Synchro Ring Set - UG8/1', 'Synchronizers', 'transmission_systems', 'ug8_1_transmission', 2.8, 380.00, 'Available', ARRAY[1974,1975,1976,1977,1978], '{}', ARRAY[]::TEXT[]),
('G85 301 01', 'Output Shaft - UG8/1', 'Case & Housing', 'transmission_systems', 'ug8_1_transmission', 18.5, 1250.00, 'Available', ARRAY[1974,1975,1976,1977,1978], '{}', ARRAY[]::TEXT[]),

-- Service Parts
('A000 180 01 09', 'Engine Oil Filter - OM352', 'Oil Filter', 'service_parts', 'filters', 1.05, 28.50, 'Available', ARRAY[1974,1975,1976,1977,1978], '{"thread": "M20 x 1.5", "cross_reference": ["W 930/14"]}', ARRAY['W 930/14']),
('A000 180 02 09', 'Engine Oil Filter - OM366', 'Oil Filter', 'service_parts', 'filters', 1.1, 32.00, 'Available', ARRAY[1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{"thread": "M22 x 1.5"}', ARRAY[]::TEXT[]),

-- Other System Parts
('H001 050 01', 'Hydraulic Filter Element', 'Filtration', 'hydraulic_systems', 'single_circuit', 0.8, 85.00, 'Available', ARRAY[1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{}', ARRAY[]::TEXT[]),
('P435 100 01', 'Portal Axle Housing Front', 'Portal Axle Housing', 'chassis_suspension', 'front_axle', 185.0, 4250.00, 'NLA - Core Exchange Only', ARRAY[1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{}', ARRAY[]::TEXT[]),
('P435 200 01', 'Rear Axle Assembly Complete', 'Axle Assembly', 'chassis_suspension', 'rear_axle', 285.0, 6850.00, 'Core Exchange', ARRAY[1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{}', ARRAY[]::TEXT[]),
('B001 010 01', 'Brake Master Cylinder', 'Master Cylinder', 'brake_systems', 'master_cylinder', 4.2, 385.00, 'Available', ARRAY[1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{}', ARRAY[]::TEXT[]),
('E001 050 01', 'Alternator 24V', 'Charging', 'electrical_systems', 'charging_system', 8.5, 650.00, 'Available', ARRAY[1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{}', ARRAY[]::TEXT[]),
('C001 010 01', 'Door Assembly Left', 'Doors', 'body_cab', 'doors', 45.0, 1850.00, 'NLA', ARRAY[1974,1975,1976,1977,1978,1979,1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991], '{}', ARRAY[]::TEXT[]);

-- Insert Component Relationships (only between parts that exist in catalog)
INSERT INTO wis_component_relationships (source_part_number, target_part_number, relationship_type, description, strength) VALUES
-- Remove the relationships to non-existent parts (A000 030 15 84, A000 030 30 84, W 930/14)
-- Add relationships between existing parts only
('A000 010 07 20', 'A000 010 12 01', 'connects_to', 'Engine block connects to cylinder head', 0.95),
('A000 030 00 17', 'A000 030 10 20', 'connects_to', 'Pistons connect to connecting rods', 0.95),
('A000 030 10 20', 'A000 030 25 01', 'connects_to', 'Connecting rods connect to crankshaft', 0.95),
('A000 051 01 33', 'A000 010 12 01', 'connects_to', 'Intake valve fits in cylinder head', 0.9),
('A000 051 02 33', 'A000 010 12 01', 'connects_to', 'Exhaust valve fits in cylinder head', 0.9),
('A000 070 03 09', 'A000 051 01 33', 'connects_to', 'Camshaft operates intake valves', 0.85),
('A000 070 03 09', 'A000 051 02 33', 'connects_to', 'Camshaft operates exhaust valves', 0.85);

-- Verify the import
SELECT
  'Component Taxonomy' as table_name, COUNT(*) as count
FROM wis_component_taxonomy
UNION ALL
SELECT 'Parts Catalog', COUNT(*) FROM wis_parts_catalog
UNION ALL
SELECT 'Component Relationships', COUNT(*) FROM wis_component_relationships;

-- Expected results:
-- Component Taxonomy: 18
-- Parts Catalog: 24
-- Component Relationships: 7