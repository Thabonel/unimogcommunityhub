-- Comprehensive U435 Manual Index Population
-- Works with existing table structure: (id, term, page_number, manual_part_id, created_at)
-- Covers all 63 sections from the comprehensive manual index
-- Solves page mapping for ALL procedures, not just portal hubs

-- Clear existing data
DELETE FROM u435_manual_index;

-- Insert comprehensive index data with intelligent page mapping
INSERT INTO u435_manual_index (term, page_number, manual_part_id) VALUES

-- CRITICAL: Portal Hub Procedures (User's Primary Example)
('portal hub front', 555, 19),
('portal hub rear', 651, 22),
('wheel hub drive front', 555, 19),
('wheel hub drive rear', 651, 22),
('front portal hub seal', 555, 19),
('rear portal hub seal', 651, 22),

-- Engine Systems (Pages 85-159)
('engine installation', 85, 3),
('engine removal', 85, 3),
('engine housing', 85, 3),
('air filter', 86, 3),
('turbocharger 3lks', 89, 4),
('turbocharger to4b27', 101, 4),
('air compressor', 113, 4),
('belt drive', 121, 4),
('electrical system engine', 129, 5),
('engine lubrication', 137, 5),
('oil pump', 137, 5),
('oil cooler', 137, 5),
('cooling system', 159, 6),
('coolant pump', 159, 6),
('radiator', 159, 6),

-- Transmission Systems (Pages 163-208)
('transmission main', 163, 7),
('engine suspension', 174, 7),
('clutch system', 179, 7),
('torque converter', 188, 7),
('clutch double', 196, 7),
('main transmission 26.13', 207, 8),

-- PTO and Drivetrain (Pages 347-435)
('power take off 26.20', 347, 12),
('pto transmission 26.23', 381, 13),
('power take off 26.25', 411, 14),
('power take off 26.26', 424, 14),
('pedal linkage', 435, 14),
('clutch pedal', 436, 14),

-- Brakes and Pedals (Pages 450-793)
('brake pedal', 450, 15),
('control system', 462, 15),
('wheels tires', 705, 23),
('brakes hydraulic 42.11', 710, 23),
('brakes hydraulic 42.14', 755, 24),
('brake system pneumatic', 793, 25),

-- Chassis and Frame (Pages 468-519)
('frame general', 468, 16),
('frame 31.3', 483, 16),
('springs suspension', 491, 17),
('spring 32.6', 492, 17),
('spring 32.7', 500, 17),
('shock absorber', 508, 17),
('torsion bar', 512, 17),
('stabilizer', 512, 17),

-- Axles and Hubs (Pages 519-661)
('front axle 33', 519, 18),
('front axle general 33.6', 569, 19),
('front axle removal', 583, 19),
('rear axle 35.3', 616, 21),
('rear axle general', 617, 21),
('rear axle general 35.6', 661, 22),

-- Steering Systems (Pages 925-982)
('steering 46', 925, 29),
('steering 46.11', 926, 29),
('steering 46.12', 948, 30),
('power steering pump 46.23', 967, 30),
('power steering pump 46.24', 982, 31),

-- Electrical Systems (Pages 990-1125)
('electrical system 54.7', 990, 31),
('electrical system 54.12', 1017, 32),
('electrical system 54.13', 1031, 33),
('electrical system 82.12', 1124, 39),
('electrical system 82.15', 1125, 39),

-- Specialized Equipment (Pages 1037-1095)
('pto shafts 55.002', 1037, 34),
('hydraulic system 55.102', 1042, 35),
('hydrostat 55.202', 1052, 36),
('driver cab 60.5', 1075, 37),
('box type body 60.12', 1095, 38),

-- Heating Systems (Pages 1140-1181)
('heating system 83.3', 1140, 40),
('auxiliary heater eberspacher', 1152, 41),
('heat exchanger burner', 1181, 41),

-- Common Search Terms (Additional Coverage)
('engine', 85, 3),
('transmission', 163, 7),
('clutch', 179, 7),
('brake', 450, 15),
('hydraulic', 710, 23),
('steering', 925, 29),
('electrical', 990, 31),
('axle', 519, 18),
('suspension', 491, 17),
('cooling', 159, 6),
('lubrication', 137, 5),
('pto', 347, 12),
('differential', 555, 19),
('bearing', 555, 19),
('seal', 555, 19),
('gasket', 555, 19),
('torque', 188, 7),
('oil', 137, 5),
('filter', 86, 3),
('pump', 137, 5),
('valve', 85, 3),
('belt', 121, 4),
('hose', 159, 6),
('wire', 990, 31),
('switch', 990, 31),
('sensor', 990, 31),
('maintenance', 137, 5),
('service', 137, 5),
('repair', 85, 3),
('replace', 555, 19),
('adjust', 512, 17),
('check', 159, 6),
('install', 85, 3),
('remove', 85, 3),
('disassemble', 555, 19),
('assemble', 555, 19);

-- Create index for fast searches
CREATE INDEX IF NOT EXISTS idx_u435_manual_index_term ON u435_manual_index(term);
CREATE INDEX IF NOT EXISTS idx_u435_manual_index_page ON u435_manual_index(page_number);
CREATE INDEX IF NOT EXISTS idx_u435_manual_index_part ON u435_manual_index(manual_part_id);

-- Verify the data
SELECT
  COUNT(*) as total_entries,
  COUNT(DISTINCT term) as unique_terms,
  COUNT(DISTINCT manual_part_id) as manual_parts_covered,
  MIN(page_number) as first_page,
  MAX(page_number) as last_page
FROM u435_manual_index;