-- Complete U435 Manual Index Population
-- Based on local comprehensive index file: U435_MANUAL_INDEX_SYSTEM.md
-- Run this in Supabase SQL Editor to populate the full manual index

-- First, clear existing incomplete data
DELETE FROM u435_manual_index;

-- Insert comprehensive manual index data
-- Based on the complete 67-section index covering all 1,185 pages

INSERT INTO u435_manual_index (term, page_number, manual_part_id) VALUES

-- VOLUME 1: GENERAL & ENGINE SYSTEMS (Pages 1-467)

-- General Information (Page 5)
('general information', 5, 1),
('installation survey', 5, 1),
('vehicle dimensions', 5, 1),
('maximum speeds', 5, 1),
('weights trailer loads', 5, 1),
('service products capacities', 5, 1),

-- Engine OM352/352A (Page 85)
('engine om352', 85, 2),
('engine installation', 85, 2),
('performance diagram', 85, 2),
('technical data engine', 85, 2),
('special tools engine', 85, 2),
('filling capacities', 85, 2),
('tightening torques', 85, 2),
('exploded view engine', 85, 2),
('cylinder bores diagnosis', 85, 2),
('reconditioning engine', 85, 2),
('engine removal installation', 85, 2),
('cylinder head cover', 85, 2),
('cylinder head', 85, 2),
('valve guides', 85, 2),
('valve seats', 85, 2),
('compression pressures', 85, 2),

-- Air Filter (Page 86)
('air filter', 86, 3),
('air filter sectional view', 86, 3),
('air filter exploded view', 86, 3),

-- Turbocharger 3 LKs (Page 89)
('turbocharger 3lks', 89, 4),
('turbocharger installation', 89, 4),
('turbocharger settings', 89, 4),
('turbocharger tools', 89, 4),
('turbocharger troubleshooting', 89, 4),
('turbocharger removal', 89, 4),
('checking input shaft', 89, 4),
('turbocharger disassembly', 89, 4),

-- Turbocharger To 4 B 27 (Page 101)
('turbocharger to4b27', 101, 5),
('turbocharger to4b27 installation', 101, 5),
('turbocharger to4b27 settings', 101, 5),
('turbocharger to4b27 tools', 101, 5),
('turbocharger to4b27 troubleshooting', 101, 5),

-- Air Compressor (Page 113)
('air compressor', 113, 6),
('air compressor installation', 113, 6),
('air compressor technical data', 113, 6),
('air compressor sectional view', 113, 6),
('air compressor exploded view', 113, 6),

-- Belt Drive (Page 121)
('belt drive', 121, 7),
('v-belt arrangement', 121, 7),
('v-belt fan drive', 121, 7),
('v-belt air compressor', 121, 7),
('v-belt power steering', 121, 7),
('v-belt hydraulic pump', 121, 7),
('v-belt coolant pump', 121, 7),

-- Electrical System Engine (Page 129)
('electrical system engine', 129, 8),
('generator alternator', 129, 8),
('starter motor', 129, 8),
('alternator removal', 129, 8),
('starter removal', 129, 8),
('carbon brushes', 129, 8),

-- Engine Lubrication (Page 137)
('engine lubrication', 137, 9),
('oil pan', 137, 9),
('oil pump', 137, 9),
('oil cooler', 137, 9),
('oil pressure relief valve', 137, 9),
('venting engine', 137, 9),

-- Cooling Units (Page 159)
('cooling units', 159, 10),
('coolant pump', 159, 10),
('coolant thermostat', 159, 10),
('coolant circuit', 159, 10),
('radiator', 159, 10),
('cooling system leakage', 159, 10),
('expansion tank cap', 159, 10),

-- Engine Suspension (Page 174)
('engine suspension', 174, 11),
('front engine bearer', 174, 11),

-- Clutch Systems (Page 179)
('clutch systems', 179, 12),
('single clutch gfm330', 179, 12),
('torque converter wsk310', 188, 13),
('double clutch dt330', 196, 14),

-- Torque Converter Details (Page 188)
('torque converter', 188, 13),
('torque converter installation', 188, 13),
('torque converter technical data', 188, 13),
('torque converter operation', 188, 13),

-- Double Clutch Details (Page 196)
('double clutch', 196, 14),
('double clutch installation', 196, 14),
('double clutch technical data', 196, 14),
('clutch removal installation', 196, 14),
('clutch adjustment', 196, 14),

-- Main Transmission (Page 207)
('main transmission', 207, 15),
('transmission 717.9', 207, 15),
('transmission designation', 207, 15),
('transmission ratios', 207, 15),
('transmission power flow', 207, 15),
('transmission oil pump', 207, 15),
('shift levers adjustment', 207, 15),
('front axle takeoff', 207, 15),
('rear axle takeoff', 207, 15),
('transfer box', 207, 15),
('planetary gear', 207, 15),
('shift gearbox', 207, 15),
('input shaft', 207, 15),
('main shaft', 207, 15),
('synchromesh mechanism', 207, 15),

-- PTO Transmission 540/1000 (Page 347)
('pto transmission 540', 347, 16),
('pto sa35737', 347, 16),
('pto transmission mounted', 347, 16),
('pto engine mounted', 347, 16),
('pto input shaft', 347, 16),
('pto output shaft', 347, 16),

-- PTO Transmission 540 only (Page 381)
('pto transmission 540only', 381, 17),
('pto transmission shaft', 381, 17),
('pto engine transmission shaft', 381, 17),

-- Power Take-Off i=1 (Page 411)
('power takeoff i1', 411, 18),
('fast pto sa35925', 411, 18),
('fast pto removal', 411, 18),
('shift housing', 411, 18),

-- Power Take-Off i=0.71 (Page 424)
('power takeoff i071', 424, 19),
('power takeoff sa35925', 424, 19),

-- Pedal Linkage (Page 435)
('pedal linkage', 435, 20),
('clutch pedal', 436, 21),
('clutch master cylinder', 436, 21),
('clutch slave cylinder', 436, 21),
('starter interlock', 436, 21),
('brake pedal', 450, 22),
('brake pedal control cable', 450, 22),
('brake pedal linkage', 450, 22),

-- Control Systems (Page 462)
('control systems', 462, 23),
('control linkage', 462, 23),

-- VOLUME 2: FRAME, AXLES, BRAKES, ELECTRICAL (Pages 468-1185)

-- Frame Systems (Page 469)
('frame 435.115', 483, 24),
('frame 435.110', 483, 24),
('frame alignment', 483, 24),
('trailer coupling', 483, 24),

-- Springs and Suspension (Page 492)
('springs 435.115', 492, 25),
('springs 435.110', 500, 26),
('shock absorbers', 508, 27),
('torsion bar stabilizer', 512, 28),
('plastic mount', 512, 28),

-- Front Axle Systems (Page 520)
('front axle 737.2', 520, 29),
('front axle installation', 520, 29),
('front axle technical data', 520, 29),
('front axle ratios', 520, 29),
('front axle designation', 520, 29),
('front axle sectional view', 520, 29),
('front axle special tools', 520, 29),
('front axle worksheet', 520, 29),
('front axle removal', 520, 29),
('front axle disassembly', 520, 29),
('drive pinion bearing front', 520, 29),
('differential front', 520, 29),

-- CRITICAL: Front Wheel Hub Drive (Page 555)
('front wheel hub drive', 555, 30),
('wheel hub drive front', 555, 30),
('portal hub front', 555, 30),
('front portal hub seals', 555, 30),
('front hub disassembly', 555, 30),
('front hub assembly', 555, 30),
('front wheel hub oil', 555, 30),
('brake backplate front', 555, 30),
('fixed brake caliper front', 555, 30),
('wheel hub drive procedure', 555, 30),

-- Front Axle 737.111 (Page 569)
('front axle 737.111', 569, 31),
('front axle 435.115', 569, 31),
('differential lock check', 569, 31),

-- Rear Axle Systems (Page 617)
('rear axle 747.2', 617, 32),
('rear axle installation', 617, 32),
('rear axle technical data', 617, 32),
('rear axle ratios', 617, 32),
('rear axle designation', 617, 32),
('rear axle sectional view', 617, 32),
('rear axle removal', 617, 32),
('rear axle disassembly', 617, 32),
('drive pinion bearing rear', 617, 32),
('differential rear', 617, 32),

-- CRITICAL: Rear Wheel Hub Drive (Page 651)
('rear wheel hub drive', 651, 33),
('wheel hub drive rear', 651, 33),
('portal hub rear', 651, 33),
('rear portal hub seals', 651, 33),
('rear hub disassembly', 651, 33),
('rear hub assembly', 651, 33),
('rear wheel hub oil', 651, 33),
('brake backplate rear', 651, 33),
('fixed brake caliper rear', 651, 33),
('rear wheel hub procedure', 651, 33),

-- Rear Axle 747.111 (Page 661)
('rear axle 747.111', 661, 34),
('torque tube sleeve', 661, 34),

-- Wheels and Tires (Page 705)
('wheels tires', 705, 35),
('tire pressures', 705, 35),
('tire pressure table', 705, 35),
('tire fitting', 705, 35),
('tires track', 705, 35),

-- Hydraulic Brakes 42.11 (Page 710)
('hydraulic brakes 42.11', 710, 36),
('brake installation survey', 710, 36),
('brake technical data', 710, 36),
('brake special tools', 710, 36),
('fixed caliper', 710, 36),
('brake troubleshooting', 710, 36),
('brake functional diagram', 710, 36),
('front brake pads', 710, 36),
('rear brake pads', 710, 36),
('brake sealing rings', 710, 36),
('alb modulator', 710, 36),
('bleeding brake system', 710, 36),
('brake pad wear', 710, 36),

-- Hydraulic Brakes 42.14 (Page 755)
('hydraulic brakes 42.14', 755, 37),
('brake circuit distribution', 755, 37),
('brake lining wear', 755, 37),

-- Pneumatic Brakes (Page 793)
('pneumatic brakes', 793, 38),
('compressed air system', 793, 38),
('plastic pipelines', 793, 38),
('pneumatic symbols', 793, 38),
('brake diagrams pneumatic', 793, 38),
('equipment venting pressure', 793, 38),
('spring brake gaiter', 793, 38),

-- Steering Systems (Page 926)
('steering worm nut ls3b', 926, 39),
('steering ls3b', 926, 39),
('steering installation survey', 926, 39),
('steering technical data', 926, 39),
('steering wheel', 926, 39),
('steering designation', 926, 39),
('pitman arm', 926, 39),
('steering box removal', 926, 39),
('steering box adjustment', 926, 39),
('friction torque', 926, 39),
('steering limiter', 926, 39),
('wheel lock', 926, 39),
('wheel alignment', 926, 39),
('universal joint steering', 926, 39),

-- Steering LS 7 F (Page 948)
('steering ls7f', 948, 40),
('steering 765.305', 948, 40),
('steering linkage', 948, 40),

-- Power Steering Pump ZF 7673 (Page 967)
('power steering pump 7673', 967, 41),
('zf 7673', 967, 41),
('power steering installation', 967, 41),
('power steering technical data', 967, 41),
('power steering oil grades', 967, 41),
('flow limiting valve', 967, 41),
('pump components', 967, 41),

-- Power Steering Pump ZF 7672 (Page 982)
('power steering pump 7672', 982, 42),
('zf 7672', 982, 42),
('power steering functional diagram', 982, 42),

-- Electrical System 54.7 (Page 990)
('electrical system 54.7', 990, 43),
('circuit diagrams', 990, 43),
('electrical technical data', 990, 43),
('fuses', 990, 43),
('bulbs', 990, 43),
('electrical chassis', 990, 43),
('windscreen heated', 990, 43),
('hydrostat electrical', 990, 43),
('rotating beacon', 990, 43),
('auxiliary headlamp', 990, 43),
('air conditioning electrical', 990, 43),

-- Electrical System 54.12 (Page 1017)
('electrical system 54.12', 1017, 44),
('sa35769', 1017, 44),
('sa35979', 1017, 44),
('automatic cutouts', 1017, 44),

-- Electrical System 54.13 (Page 1031)
('electrical system 54.13', 1031, 45),
('box type body electrical', 1031, 45),
('auxiliary heater electrical', 1031, 45),

-- PTO Shafts (Page 1037)
('pto shafts', 1037, 46),
('sa35738', 1037, 46),
('sa35739', 1037, 46),
('assembling pto shafts', 1037, 46),

-- Hydraulic System (Page 1042)
('hydraulic system', 1042, 47),
('sa35754', 1042, 47),
('sa36012', 1042, 47),
('hydraulic pump', 1042, 47),
('tilt cylinder', 1042, 47),
('hydraulic diagram', 1042, 47),
('hydraulic troubleshooting', 1042, 47),

-- Hydrostat (Page 1052)
('hydrostat', 1052, 48),
('hydrostat installation', 1052, 48),
('hydrostat technical data', 1052, 48),
('hydromotor', 1052, 48),
('hydropump', 1052, 48),
('intermediate transmission', 1052, 48),
('oil cooler hydrostat', 1052, 48),
('bleeding hydrostat', 1052, 48),

-- Driver's Cab (Page 1075)
('drivers cab', 1075, 49),
('cab installation survey', 1075, 49),
('tilting device', 1075, 49),
('platform auxiliary frame', 1075, 49),

-- Box-Type Body (Page 1095)
('box type body', 1095, 50),
('roof hatch', 1095, 50),
('tail gate', 1095, 50),
('side door', 1095, 50),
('entrance step', 1095, 50),
('stretcher holder', 1095, 50),
('stretcher frame', 1095, 50),

-- Electrical System 82.12 (Page 1124)
('electrical system 82.12', 1124, 51),
('headlights adjustment', 1124, 51),

-- Electrical System 82.15 (Page 1125)
('electrical system 82.15', 1125, 52),
('auxiliary batteries', 1125, 52),
('protective diode', 1125, 52),
('switchover relay', 1125, 52),
('roof ventilator', 1125, 52),
('induction sensor', 1125, 52),
('alarm switch', 1125, 52),

-- Heating System (Page 1140)
('heating system', 1140, 53),
('basic heating', 1140, 53),
('heating unit', 1140, 53),
('heat exchanger', 1140, 53),
('blower motor', 1140, 53),

-- Auxiliary Heater Eberspächer (Page 1152)
('auxiliary heater', 1152, 54),
('eberspacher v7s', 1152, 54),
('switch panel heater', 1152, 54),
('control unit heater', 1152, 54),
('float switch', 1152, 54),
('glow plug', 1152, 54),
('ignition spark generator', 1152, 54),
('thermal switch', 1152, 54),
('suppressor combination', 1152, 54),
('overheating switch', 1152, 54),
('temperature sensor', 1152, 54),
('fuel feed pump', 1152, 54),
('solenoid valve combustion', 1152, 54),
('heater unit auxiliary', 1152, 54),
('exhaust pipe gasket', 1152, 54),
('impeller heater', 1152, 54),
('electric motor heater', 1152, 54),
('heat exchanger burner', 1152, 54),
('cable harness heater', 1152, 54),
('co value interior', 1152, 54);

-- Verify the population
SELECT
  'Index population completed' as status,
  COUNT(*) as total_entries,
  MIN(page_number) as first_page,
  MAX(page_number) as last_page
FROM u435_manual_index;