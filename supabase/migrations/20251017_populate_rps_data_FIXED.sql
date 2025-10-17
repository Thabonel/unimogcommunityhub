BEGIN;

INSERT INTO rps_groups (rps_number, group_code, group_name, total_parts, page_start, page_end, chunk_file, metadata)
VALUES (
  '02155',
  'DHA',
  'Turbocharger, Airesearch',
  50,
  104,
  106,
  'rps_02155_chunk_003c_pages_0251-0285.pdf',
  '{"illustration_pages": [105], "sheet_count": 2}'
) ON CONFLICT (rps_number, group_code) DO NOTHING;

INSERT INTO rps_illustrations (rps_number, group_code, figure_number, description, page_number, callouts, metadata)
VALUES (
  '02155',
  'DHA',
  'DHA-1',
  'Turbocharger, Airesearch - Exploded view showing oil lines, gaskets, clamps, and mounting hardware',
  105,
  '["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50"]'::jsonb,
  '{"sheet": 2}'::jsonb
) ON CONFLICT (rps_number, group_code, figure_number) DO NOTHING;

INSERT INTO rps_parts (niin, nsn, group_code, item_number, description, rps_number, quantity, repair_grade, page_number, chunk_file, figure_reference, callout, vehicle_model, metadata)
VALUES
  ('12-168-5836', '5330 12-168-5836', 'DHA', '014', 'GASKET ASBESTOS, TURBOCHARGER', '02155', 1, 'M', 104, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'DHA-1', '14', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/3521B70080", "D8046/3521B70080"], "uoi": "EA"}'::jsonb),
  ('12-301-8395', '4720 12-301-8395', 'DHA', '017', 'HOSE,NONMETALLIC RUBBER SYNTHETIC,22.0 MM ID,30.0 MM OD', '02155', 1, 'M', 104, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'DHA-1', '17', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/0149973382", "D8046/0149973382"], "repair_grade_text": "MR X M", "uoi": "MR"}'::jsonb),
  ('12-161-4632', '4730 12-161-4632', 'DHA', '018', 'CLAMP,HOSE STEEL, ZINC', '02155', 2, 'M', 104, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'DHA-1', '18', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/916017020000", "D8046/916017020000"], "repair_grade_text": "EA X M", "uoi": "EA"}'::jsonb),
  ('12-143-6289', '5330 12-143-6289', 'DHA', '020', 'GASKET ALUMINIUM,26 MM ID,32 MM OD', '02155', 2, 'M', 104, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'DHA-1', '20', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/007603026106", "D8046/007603026106"], "repair_grade_text": "EA X M", "uoi": "EA"}'::jsonb)
ON CONFLICT (niin) DO NOTHING;

INSERT INTO rps_groups (rps_number, group_code, group_name, total_parts, page_start, page_end, chunk_file, metadata)
VALUES (
  '02155',
  'DHB',
  'Turbocharger, KKK',
  47,
  107,
  110,
  'rps_02155_chunk_003c_pages_0251-0285.pdf',
  '{"illustration_pages": [107, 108, 109, 110], "sheet_count": 2}'
) ON CONFLICT (rps_number, group_code) DO NOTHING;

INSERT INTO rps_illustrations (rps_number, group_code, figure_number, description, page_number, callouts, metadata)
VALUES (
  '02155',
  'DHB',
  'DHB-1',
  'Turbocharger, KKK - Sheet 1 showing intake connections and mounting',
  107,
  '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"]'::jsonb,
  '{"sheet": 1}'::jsonb
),
  ('02155',
  'DHB',
  'DHB-2',
  'Turbocharger, KKK - Sheet 2 showing compressor and turbine assembly',
  109,
  '["25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]'::jsonb,
  '{"sheet": 2}'::jsonb
)
ON CONFLICT (rps_number, group_code, figure_number) DO NOTHING;

INSERT INTO rps_parts (niin, nsn, group_code, item_number, description, rps_number, quantity, repair_grade, page_number, chunk_file, figure_reference, callout, vehicle_model, metadata)
VALUES
  ('12-314-1490', '2950 12-314-1490', 'DHB', '011', 'TURBOSUPERCHARGER,ENGINE,NON-AIRCRAFT KKK TURBOCHARGER (ALTERNATIVE TO ITEM DHA 011 INCLUDES DHB 012 DHB 013)', '02155', 1, NULL, 107, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'DHB-1', '11', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/3520968299", "D8046/3520968299"], "repair_grade_text": "AY LM", "uoi": "AY"}'::jsonb)
ON CONFLICT (niin) DO NOTHING;

INSERT INTO rps_groups (rps_number, group_code, group_name, total_parts, page_start, page_end, chunk_file, metadata)
VALUES (
  '02155',
  'DK',
  'Air Cleaner Assembly, Intake and Connections',
  31,
  111,
  113,
  'rps_02155_chunk_003c_pages_0251-0285.pdf',
  '{"illustration_pages": [111, 112, 113], "sheet_count": 2}'
) ON CONFLICT (rps_number, group_code) DO NOTHING;

INSERT INTO rps_illustrations (rps_number, group_code, figure_number, description, page_number, callouts, metadata)
VALUES (
  '02155',
  'DK',
  'DK-1',
  'Air Cleaner Assembly, Intake and Connections - Sheet 1',
  111,
  '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]'::jsonb,
  '{"sheet": 1}'::jsonb
),
  ('02155',
  'DK',
  'DK-2',
  'Air Cleaner Assembly, Intake and Connections - Sheet 2 showing mounting bracket',
  112,
  '["21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]'::jsonb,
  '{"sheet": 2}'::jsonb
)
ON CONFLICT (rps_number, group_code, figure_number) DO NOTHING;

INSERT INTO rps_parts (niin, nsn, group_code, item_number, description, rps_number, quantity, repair_grade, page_number, chunk_file, figure_reference, callout, vehicle_model, metadata)
VALUES
  ('12-180-3198', '2940 12-180-3198', 'DK', '003', 'FILTER ELEMENT, INTAKE AIR CLEANER (ALSO PART OF DK 001)', '02155', 1, 'L', 111, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'DK-1', '3', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["Z4067/0010947304", "Z4067/0010947304"], "repair_grade_text": "EA X LM", "uoi": "EA"}'::jsonb),
  ('12-192-6441', '4730 12-192-6441', 'DK', '013', 'CLAMP,HOSE 110 MM TO 130 MM', '02155', 1, 'L', 111, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'DK-1', '13', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/916017110000", "D8046/916017110000"], "repair_grade_text": "EA X LM", "uoi": "EA"}'::jsonb)
ON CONFLICT (niin) DO NOTHING;

INSERT INTO rps_groups (rps_number, group_code, group_name, total_parts, page_start, page_end, chunk_file, metadata)
VALUES (
  '02155',
  'EA',
  'Clutch Master Cylinder, Pedal and Bracket',
  58,
  114,
  118,
  'rps_02155_chunk_003c_pages_0251-0285.pdf',
  '{"illustration_pages": [114, 115, 116, 117, 118], "sheet_count": 1}'
) ON CONFLICT (rps_number, group_code) DO NOTHING;

INSERT INTO rps_illustrations (rps_number, group_code, figure_number, description, page_number, callouts, metadata)
VALUES (
  '02155',
  'EA',
  'EA-1',
  'Clutch Master Cylinder, Pedal and Bracket - Complete assembly with hydraulic components',
  114,
  '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58"]'::jsonb,
  '{}'::jsonb
)
ON CONFLICT (rps_number, group_code, figure_number) DO NOTHING;

INSERT INTO rps_parts (niin, nsn, group_code, item_number, description, rps_number, quantity, repair_grade, page_number, chunk_file, figure_reference, callout, vehicle_model, metadata)
VALUES
  ('12-142-8173', '5310 12-142-8173', 'EA', '002', 'WASHER,SPRING TENSION RD,STEEL,ZINC COATED,8.4MM ID,15MM OD 0.8MM THK', '02155', 4, 'L', 114, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'EA-1', '2', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/000137008204", "D8046/000137008204"], "repair_grade_text": "EA X LM", "uoi": "EA"}'::jsonb),
  ('12-325-6726', '2520 12-325-6726', 'EA', '038', 'SLAVE CYLINDER,CLUTCH (INCLUDES EA 039 AND EA 040)', '02155', 1, 'L', 116, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'EA-1', '38', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/0012957706", "D8046/0012957706"], "repair_grade_text": "AY N LM", "uoi": "AY"}'::jsonb),
  ('12-191-5911', '2540 12-191-5911', 'EA', '901', 'PAD,PEDAL', '02155', 1, 'L', 115, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'EA-1', NULL, 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/1072910182", "D8046/1072910182"], "repair_grade_text": "EA LM", "uoi": "EA"}'::jsonb)
ON CONFLICT (niin) DO NOTHING;

INSERT INTO rps_groups (rps_number, group_code, group_name, total_parts, page_start, page_end, chunk_file, metadata)
VALUES (
  '02155',
  'EC',
  'Clutch Slave Cylinder and Pipes',
  21,
  119,
  120,
  'rps_02155_chunk_003c_pages_0251-0285.pdf',
  '{"illustration_pages": [119, 120], "sheet_count": 1}'
) ON CONFLICT (rps_number, group_code) DO NOTHING;

INSERT INTO rps_illustrations (rps_number, group_code, figure_number, description, page_number, callouts, metadata)
VALUES (
  '02155',
  'EC',
  'EC-1',
  'Clutch Slave Cylinder and Pipes - Hydraulic line assembly and mounting',
  119,
  '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"]'::jsonb,
  '{}'::jsonb
)
ON CONFLICT (rps_number, group_code, figure_number) DO NOTHING;

INSERT INTO rps_parts (niin, nsn, group_code, item_number, description, rps_number, quantity, repair_grade, page_number, chunk_file, figure_reference, callout, vehicle_model, metadata)
VALUES
  ('12-136-8560', '4730 12-136-8560', 'EC', '001', 'SLEEVE,CLINCH,TUBE FITTING STEEL,8 MM OD TUBE SIZE,CAD PLATED', '02155', 1, 'L', 119, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'EC-1', '1', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/003861008004", "D8046/003861008004"], "repair_grade_text": "EA X LM", "uoi": "EA"}'::jsonb),
  ('12-319-0820', '2520 12-319-0820', 'EC', '009', 'SLAVE CYLINDER,CLUTCH (INCLUDES EC 010 TO EC 018, LATER TYPE CYLINDER)', '02155', 1, 'L', 119, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'EC-1', '9', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/0012957707", "Z4067/0012957707"], "repair_grade_text": "AY LM", "uoi": "AY"}'::jsonb)
ON CONFLICT (niin) DO NOTHING;

INSERT INTO rps_groups (rps_number, group_code, group_name, total_parts, page_start, page_end, chunk_file, metadata)
VALUES (
  '02155',
  'ED',
  'Clutch and Housing',
  12,
  121,
  121,
  'rps_02155_chunk_003c_pages_0251-0285.pdf',
  '{"illustration_pages": [121], "sheet_count": 1}'
) ON CONFLICT (rps_number, group_code) DO NOTHING;

INSERT INTO rps_illustrations (rps_number, group_code, figure_number, description, page_number, callouts, metadata)
VALUES (
  '02155',
  'ED',
  'ED-1',
  'Clutch and Housing - Clutch disc, pressure plate, and bell housing assembly',
  121,
  '["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"]'::jsonb,
  '{}'::jsonb
)
ON CONFLICT (rps_number, group_code, figure_number) DO NOTHING;

INSERT INTO rps_parts (niin, nsn, group_code, item_number, description, rps_number, quantity, repair_grade, page_number, chunk_file, figure_reference, callout, vehicle_model, metadata)
VALUES
  ('12-315-1428', '2520 12-315-1428', 'ED', '001', 'DISK,CLUTCH 330 MM NOMINAL OD, RIVETED FACING, 8 DAMPER SPRINGS, SPLINE 35.9 MM ID, 39.9 MM OD, NON ASBESTOS', '02155', 1, 'M', 121, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'ED-1', '1', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["Z4067/0092505703", "D8046/0092505703"], "repair_grade_text": "EA N M", "uoi": "EA"}'::jsonb),
  ('12-196-7664', '2520 12-196-7664', 'ED', '002', 'PRESSURE PLATE ASSEMBLY, CLUTCH', '02155', 1, 'M', 121, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'ED-1', '2', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/004 250 07 04", "D8046/004 250 07 04"], "repair_grade_text": "EA N M", "uoi": "EA"}'::jsonb),
  ('12-172-9788', '5340 12-172-9788', 'ED', '006', 'PLUNGER, DETENT', '02155', 1, 'M', 121, 'rps_02155_chunk_003c_pages_0251-0285.pdf', 'ED-1', '6', 'Mercedes Unimog GS Base', '{"manufacturer_codes": ["D8046/4259910220", "D8046/4259910220"], "repair_grade_text": "EA X M", "uoi": "EA"}'::jsonb)
ON CONFLICT (niin) DO NOTHING;

COMMIT;
