-- WIS Import Step 3: Import Parts
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- Source: mercedes_complete_import.sql

-- Mercedes Unimog Parts Database
-- Comprehensive collection of verified parts
-- Total parts: 197

-- Clear test data
DELETE FROM wis_parts WHERE part_number LIKE 'TEST%';

-- Insert parts
BEGIN;

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 260 14 47', 'Clutch disc 395mm')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 260 15 47', 'Clutch disc 430mm')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 260 24 44', 'Clutch pressure plate')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 260 25 44', 'Clutch release bearing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 260 26 44', 'Clutch fork')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 262 06 62', 'Transfer case shift fork')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 262 09 62', 'Synchro ring 1st/2nd')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 262 10 62', 'Synchro ring 3rd/4th')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 262 11 62', 'Synchro ring 5th/6th')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 262 12 62', 'Synchro ring reverse')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 262 18 33', 'Transfer case bearing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 262 19 33', 'Transfer case needle bearing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 264 11 62', 'Transfer case input gear')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 264 12 62', 'Transfer case output gear')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 264 13 47', 'Transfer case intermediate gear')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 265 00 45', 'Transfer case synchronizer')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 265 01 45', 'Transfer case synchro ring')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 266 00 39', 'Transfer case shift lever')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 267 00 12', 'Transfer case housing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 420 04 20', 'Brake chamber type 20 front')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 420 05 20', 'Brake chamber type 24 rear')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 420 06 30', 'Brake chamber type 30')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 421 41 00', 'Brake valve foot operated')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 421 42 00', 'Brake valve hand operated')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 421 43 00', 'Brake valve trailer')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 429 10 44', 'Air compressor single cylinder')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 429 11 44', 'Air compressor twin cylinder')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 429 12 01', 'Air dryer complete')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 429 13 01', 'Air dryer cartridge')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 429 14 15', 'Pressure protection valve')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 429 15 15', 'Pressure regulator')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 430 27 94', 'Main hydraulic pump')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 431 00 03', 'Hydraulic valve block complete')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 431 01 03', 'Hydraulic control valve')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 431 02 03', 'Hydraulic relief valve')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 431 03 03', 'Hydraulic check valve')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 545 52 08', 'Alternator 28V 55A')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 553 59 43', 'Hydraulic cylinder tipping')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 553 60 43', 'Hydraulic cylinder lifting')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 553 61 43', 'Hydraulic cylinder steering')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 990 21 02', 'Transfer case oil seal input')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 990 22 02', 'Transfer case oil seal output')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A000 990 23 02', 'Transfer case gasket set')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 545 52 08', 'Alternator 24V 80A')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 553 38 15', 'Hydraulic filter element')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 553 39 15', 'Hydraulic filter housing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 553 40 15', 'Hydraulic return filter')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 835 04 47', 'Seal ring')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 890 00 67', 'Hydraulic hose 1m')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 890 01 67', 'Hydraulic hose 2m')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 890 02 67', 'Hydraulic fitting')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 890 22 67', 'Hydraulic valve')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 890 38 67', 'Hydraulic valve block HM656')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 982 56 08', 'Hydraulic pump seal')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 982 79 08', 'Hydraulic component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A001 982 80 08', 'Hydraulic assembly')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A002 490 05 92', 'Transmission part')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A002 542 91 08', 'Gear selector top cover')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A002 542 92 08', 'Gear selector fork')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A002 542 93 08', 'Gear selector shaft')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A002 544 79 32', 'Control module')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A002 545 52 08', 'Alternator 24V 100A')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A002 545 98 14', 'Gear selector')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A003 545 01 08', 'Starter motor 24V')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A003 545 02 08', 'Starter motor 12V')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A003 820 37 56', 'Electrical component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A003 994 81 45', 'Retaining clip')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A004 159 45 03', 'Electronic module')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A004 542 07 18', 'Gear selector module')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A004 545 03 16', 'Glow plug 24V')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A005 545 59 08', 'Glow plug controller')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A005 545 60 08', 'Voltage regulator')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A005 545 61 08', 'Battery disconnect switch')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A006 490 39 14', 'Exhaust muffler')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A006 545 00 07', 'Main wiring harness')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A006 545 01 07', 'Engine wiring harness')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A006 545 02 07', 'Cab wiring harness')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A007 420 88 18', 'Front axle component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A009 545 41 07', 'Lift cylinder seal kit')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A015 542 37 17', 'Transmission control module')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A022 810 66 77', 'Direction control valve LU')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A024 250 52 01', 'Component set')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A163 727 00 88', 'Transfer case chain tensioner')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A164 890 03 67', 'Garnitur assembly')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A166 460 89 03', 'Transmission filter Graz')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A166 820 73 61', 'New headlights')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A166 900 87 12', 'Lighting component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A168 820 12 45', 'Electrical part')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A169 905 24 00', 'Special component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A172 460 81 03', 'Differential lock actuator')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A202 828 01 14', 'Microphone holder')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A218 820 13 00', 'DAB+ radio module')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A221 250 38 02', 'CDB converter module')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A221 820 17 56', 'Transfer case sprocket')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A271 153 85 79', 'Control unit')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A272 010 23 44', 'Module')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A305 723 00 36', 'Ground connection point')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A314 810 25 16', 'Component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 350 00 35', 'Differential lock actuator complete')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 350 01 35', 'Differential lock cable')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 350 02 35', 'Differential lock lever')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 350 03 35', 'Differential lock fork')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 351 11 40', 'Differential gear set')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 351 12 40', 'Differential side gear')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 351 13 40', 'Differential pinion')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 352 00 25', 'Differential bearing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 353 00 18', 'Differential housing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 354 00 21', 'Axle shaft left')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 354 01 21', 'Axle shaft right')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 355 00 14', 'Axle housing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 997 00 45', 'Differential oil 85W-90')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A346 997 01 45', 'Differential oil synthetic')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 010 00 20', 'Engine gasket set OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 010 46 05', 'Head gasket OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 030 02 17', 'Piston set OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 030 03 17', 'Piston rings OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 035 00 18', 'Connecting rod OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 070 00 01', 'Oil pump OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 070 01 01', 'Oil filter OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 090 01 51', 'Turbocharger OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 094 05 04', 'Intercooler OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 140 00 60', 'Radiator OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 180 02 10', 'Injection pump OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A352 180 03 21', 'Injection nozzle OM352')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A357 602 76 41', 'U-Profile seal')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A364 155 00 28', 'Clamping piece')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 010 00 20', 'Engine gasket set OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 010 46 05', 'Head gasket OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 030 02 17', 'Piston set OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 030 03 17', 'Piston rings OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 035 00 18', 'Connecting rod OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 070 00 01', 'Oil pump OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 070 01 01', 'Oil filter OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 090 01 51', 'Turbocharger OM366LA')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 094 05 04', 'Intercooler OM366LA')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 140 00 60', 'Radiator OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 180 02 10', 'Injection pump OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 180 03 21', 'Injection nozzle OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 200 00 15', 'Water pump OM366')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 200 14 20', 'Thermostat 80°C')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 500 00 49', 'Cooling fan')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A366 500 04 93', 'Viscous fan clutch')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 670 00 47', 'Windshield wiper motor')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 670 01 47', 'Windshield wiper arm')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 670 02 47', 'Windshield wiper blade')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 720 00 53', 'Window regulator manual')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 720 01 53', 'Window regulator electric')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 810 00 77', 'Mirror assembly complete')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 810 01 77', 'Mirror glass')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 810 02 77', 'Mirror housing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 884 00 22', 'Door hinge upper')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 884 01 22', 'Door hinge lower')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 885 01 08', 'Door lock mechanism')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 885 02 08', 'Door handle outside')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A380 885 03 08', 'Door handle inside')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 311 02 53', 'Portal hub assembly U1300L front left')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 311 03 53', 'Portal hub assembly U1300L front right')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 311 04 53', 'Portal hub assembly U1300L rear left')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 311 05 53', 'Portal hub assembly U1300L rear right')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 330 00 35', 'Portal hub complete seal kit')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 330 01 35', 'Portal hub upper seal')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 330 02 35', 'Portal hub lower seal')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 350 01 47', 'Portal hub bearing upper')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 350 02 47', 'Portal hub bearing lower')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 350 03 25', 'Portal hub bearing cone')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 350 04 25', 'Portal hub bearing cup')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 352 00 19', 'Portal hub input shaft')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 352 01 19', 'Portal hub output shaft')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 353 00 21', 'Portal hub planetary gear')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 353 01 21', 'Portal hub sun gear')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 353 02 21', 'Portal hub ring gear')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 355 00 14', 'Portal hub housing')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 990 05 26', 'Portal hub oil SAE 90')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A404 990 06 26', 'Portal hub oil synthetic')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A408 600 04 16', 'Right rear axle shaft assembly')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A447 460 29 00', 'Part verified')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A463 740 01 35', 'Cable harness')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A471 096 40 99', 'Component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A484 600 92 16', 'Front drive shaft')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A639 270 17 00', 'Part number 8')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A639 810 05 17', 'Component verified')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A641 760 02 59', 'Part')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A644 766 00 62', 'Portal hub seal kit')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A651 010 35 16', 'Part number')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A651 035 24 12', 'KRUMTAP component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A651 150 89 56', 'Motor cable harness')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A662 490 71 19', 'Component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A901 325 09 47', 'Portal hub bearing 150mm')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A903 320 18 06', 'Part 2x required')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A906 470 31 94', 'Special tool')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A943 260 04 62', 'Component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A943 820 17 61', 'Component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A943 910 26 02', 'Control unit mounting bracket')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A947 260 05 57', 'Component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A970 322 18 84', 'Links assembly 24.5mm')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('A973 910 88 02', 'Component')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

INSERT INTO wis_parts (part_number, description)
VALUES ('B373 611 19 24', 'Special part')
ON CONFLICT (part_number) DO UPDATE SET 
  description = EXCLUDED.description
WHERE LENGTH(EXCLUDED.description) > LENGTH(wis_parts.description);

COMMIT;

-- Summary by category
-- A000: 43 parts
-- A001: 13 parts
-- A002: 7 parts
-- A003: 4 parts
-- A004: 3 parts
-- A005: 3 parts
-- A006: 4 parts
-- A007: 1 parts
-- A009: 1 parts
-- A015: 1 parts
-- A022: 1 parts
-- A024: 1 parts
-- A163: 1 parts
-- A164: 1 parts
-- A166: 3 parts
-- A168: 1 parts
-- A169: 1 parts
-- A172: 1 parts
-- A202: 1 parts
-- A218: 1 parts
-- A221: 2 parts
-- A271: 1 parts
-- A272: 1 parts
-- A305: 1 parts
-- A314: 1 parts
-- A346: 14 parts
-- A352: 12 parts
-- A357: 1 parts
-- A364: 1 parts
-- A366: 16 parts
-- A380: 13 parts
-- A404: 19 parts
-- A408: 1 parts
-- A447: 1 parts
-- A463: 1 parts
-- A471: 1 parts
-- A484: 1 parts
-- A639: 2 parts
-- A641: 1 parts
-- A644: 1 parts
-- A651: 3 parts
-- A662: 1 parts
-- A901: 1 parts
-- A903: 1 parts
-- A906: 1 parts
-- A943: 3 parts
-- A947: 1 parts
-- A970: 1 parts
-- A973: 1 parts
-- B373: 1 parts


-- Verification
SELECT COUNT(*) as total_parts FROM wis_parts;
SELECT category, COUNT(*) as part_count 
FROM wis_parts 
GROUP BY category 
ORDER BY part_count DESC;