-- WIS Import Step 4: Import Bulletins
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- Total bulletins to import: 100

INSERT INTO wis_bulletins (id, vehicle_id, bulletin_number, title, category, issue_date, description, content, affected_systems, priority, is_active) VALUES
(
  uuid('66417e7a-52d3-4af1-a2d3-d616c9f8bacf'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-001',
  'Safety Recall: Transmission System Update',
  'Safety Recall',
  '2023-08-18',
  'Safety Recall: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('f280abe3-686c-4135-a087-67033c2a506a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-002',
  'Technical Update: Electrical System Update',
  'Technical Update',
  '2020-01-25',
  'Technical Update: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('7ba85dc0-49cf-4fbb-b006-174bdd0e6315'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-003',
  'Service Campaign: Brakes System Update',
  'Service Campaign',
  '2020-05-13',
  'Service Campaign: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('8086dd1a-fab0-4e19-8520-5674b483a893'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-004',
  'Safety Recall: Engine System Update',
  'Safety Recall',
  '2022-03-01',
  'Safety Recall: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('2ba0229f-9956-4d71-a479-93557b083904'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-005',
  'Technical Update: Electrical System Update',
  'Technical Update',
  '2021-08-21',
  'Technical Update: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('971b81ed-cf9f-41f4-92d4-344f0faf9e66'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-006',
  'Safety Recall: Engine System Update',
  'Safety Recall',
  '2023-05-05',
  'Safety Recall: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('0dbaa55c-ac1e-43ce-96ec-a0b6c1d7b05d'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-007',
  'Product Improvement: Transmission System Update',
  'Product Improvement',
  '2022-03-06',
  'Product Improvement: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('38b48c6b-aca5-4945-b736-405b45d3a362'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-008',
  'Safety Recall: Electrical System Update',
  'Safety Recall',
  '2023-08-19',
  'Safety Recall: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('7b6a6219-0d55-425e-a2a5-7f57f5e2bc19'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-009',
  'Service Campaign: Transmission System Update',
  'Service Campaign',
  '2021-03-27',
  'Service Campaign: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('4bb94cfb-75ea-4cd2-b843-015adbe1507a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-010',
  'Service Campaign: Brakes System Update',
  'Service Campaign',
  '2022-05-25',
  'Service Campaign: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('413f64d6-6fef-4dc8-b0e3-4f9103c3550e'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-011',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2021-05-22',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('cfedceb7-7684-4d11-b164-6451c6bbf7ce'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-012',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2024-09-07',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('8f1b3598-99e6-4ca2-a212-1b1d557b22b0'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-013',
  'Service Campaign: Engine System Update',
  'Service Campaign',
  '2021-04-30',
  'Service Campaign: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('4139e109-3c3f-4f61-9b81-05830c1e9fed'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-014',
  'Safety Recall: Electrical System Update',
  'Safety Recall',
  '2023-04-08',
  'Safety Recall: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('c7b9ea20-2bd0-4ff9-8528-ec39d9f95e47'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-015',
  'Product Improvement: Electrical System Update',
  'Product Improvement',
  '2021-06-22',
  'Product Improvement: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('84d298d1-ee33-46ef-ae82-817f05d6032a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-016',
  'Product Improvement: Engine System Update',
  'Product Improvement',
  '2024-04-22',
  'Product Improvement: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('0f12163c-1b5a-4e10-8ab9-4e9c25152f05'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-017',
  'Safety Recall: Transmission System Update',
  'Safety Recall',
  '2020-10-13',
  'Safety Recall: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('747d4c47-afd9-49ff-8e7c-7720e57ca2e9'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-018',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2020-10-12',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('2d726a5d-a768-430d-8639-a2da6a3337e4'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-019',
  'Service Campaign: Transmission System Update',
  'Service Campaign',
  '2020-08-12',
  'Service Campaign: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('975ca37c-d190-47d2-ae32-36174e88a185'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-020',
  'Safety Recall: Transmission System Update',
  'Safety Recall',
  '2023-01-25',
  'Safety Recall: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('4397cfb1-ec85-4da6-8441-d442e7d0f6c9'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-021',
  'Service Campaign: Electrical System Update',
  'Service Campaign',
  '2022-11-03',
  'Service Campaign: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('bb80fd04-d329-4166-8598-101cbe1c7911'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-022',
  'Safety Recall: Engine System Update',
  'Safety Recall',
  '2020-05-24',
  'Safety Recall: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('c74d1e63-8025-4b55-b7d3-3a7d23c4cef6'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-023',
  'Product Improvement: Electrical System Update',
  'Product Improvement',
  '2024-08-01',
  'Product Improvement: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('7e2698b8-74f7-4bac-9f82-9be5ab7644ae'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-024',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2023-08-25',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('676f65ec-2fd5-4a26-a6b2-544fc778d04d'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-025',
  'Product Improvement: Brakes System Update',
  'Product Improvement',
  '2020-06-17',
  'Product Improvement: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('867bf9c3-2fc4-4ff9-b1a0-9c60cba7bd90'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-026',
  'Service Campaign: Brakes System Update',
  'Service Campaign',
  '2020-07-11',
  'Service Campaign: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('a065c9e9-139b-4341-bfeb-8ec552ddfd39'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-027',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2022-11-23',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('926fe5a6-5a8e-4b03-b145-a3dbfbbd706d'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-028',
  'Product Improvement: Brakes System Update',
  'Product Improvement',
  '2023-04-22',
  'Product Improvement: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('e7168bd2-f6d4-4c8c-93a0-366afc9452dd'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-029',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2021-05-08',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('ee1c116b-cb5b-4052-bf45-42de7941d523'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-030',
  'Safety Recall: Electrical System Update',
  'Safety Recall',
  '2024-09-25',
  'Safety Recall: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('f61da865-750c-4f9a-a04b-6f960ea54c3b'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-031',
  'Safety Recall: Transmission System Update',
  'Safety Recall',
  '2020-04-25',
  'Safety Recall: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('ec741ad6-b180-4b59-a81f-f84142c4752a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-032',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2020-03-10',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('4a359ec2-bfb8-437f-85d5-e1fa9e009135'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-033',
  'Service Campaign: Engine System Update',
  'Service Campaign',
  '2020-01-05',
  'Service Campaign: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('6a7298bd-ff4b-4c4b-bb6f-26e0c58fc19a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-034',
  'Technical Update: Electrical System Update',
  'Technical Update',
  '2020-07-12',
  'Technical Update: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('8cc969a7-246e-45d3-81fc-c7d7a60cea50'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-035',
  'Technical Update: Brakes System Update',
  'Technical Update',
  '2022-08-09',
  'Technical Update: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('05fa4100-c2ca-4e46-88fc-00c065a6b981'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-036',
  'Product Improvement: Transmission System Update',
  'Product Improvement',
  '2020-11-09',
  'Product Improvement: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('ce7df594-e7b0-40c6-8d1d-f2c118bce5f5'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-037',
  'Technical Update: Brakes System Update',
  'Technical Update',
  '2021-06-04',
  'Technical Update: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('69c02aba-2950-4316-8acc-cb5754b6e0f4'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-038',
  'Safety Recall: Electrical System Update',
  'Safety Recall',
  '2024-04-26',
  'Safety Recall: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('39757c1d-711a-4196-b855-9c03eba844aa'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-039',
  'Service Campaign: Electrical System Update',
  'Service Campaign',
  '2021-12-04',
  'Service Campaign: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('b8f105ad-60e5-4742-98d1-4aed7cc4c869'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-040',
  'Product Improvement: Brakes System Update',
  'Product Improvement',
  '2022-01-15',
  'Product Improvement: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('c8a35126-dd09-4336-8199-2850662db991'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-041',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2020-06-27',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('79c974c2-6c10-43d1-8c59-a2423556ccf2'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-042',
  'Safety Recall: Transmission System Update',
  'Safety Recall',
  '2020-05-15',
  'Safety Recall: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('95f2ab70-e518-4b39-aee5-cc12036ad747'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-043',
  'Product Improvement: Engine System Update',
  'Product Improvement',
  '2024-07-03',
  'Product Improvement: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('dd3c2818-8570-4b06-9017-dd4e0a0a018d'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-044',
  'Safety Recall: Engine System Update',
  'Safety Recall',
  '2021-12-24',
  'Safety Recall: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('db88088b-6100-405b-a243-8829c721f032'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-045',
  'Safety Recall: Engine System Update',
  'Safety Recall',
  '2024-04-18',
  'Safety Recall: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('38d72e9f-a989-468d-9ecc-e38be12daa42'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-046',
  'Safety Recall: Electrical System Update',
  'Safety Recall',
  '2024-06-27',
  'Safety Recall: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('f92e1e96-1cac-431e-9681-33a181bcfe69'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-047',
  'Service Campaign: Engine System Update',
  'Service Campaign',
  '2020-05-05',
  'Service Campaign: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('cf1064c2-dd32-4e9d-b65a-f9d3f8e953f8'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-048',
  'Safety Recall: Engine System Update',
  'Safety Recall',
  '2020-07-16',
  'Safety Recall: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('e0b619f9-5284-4716-add5-ea6e7cd451c3'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-049',
  'Product Improvement: Electrical System Update',
  'Product Improvement',
  '2021-08-01',
  'Product Improvement: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('8a5931e4-285e-45de-b883-76a927b33858'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-050',
  'Service Campaign: Transmission System Update',
  'Service Campaign',
  '2021-04-21',
  'Service Campaign: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('69e19af1-d1fe-43d1-88b8-1b3e3c5fa84a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-051',
  'Service Campaign: Electrical System Update',
  'Service Campaign',
  '2021-10-22',
  'Service Campaign: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('667fed63-a362-4206-a752-51f9b9a6c89e'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-052',
  'Safety Recall: Brakes System Update',
  'Safety Recall',
  '2020-12-13',
  'Safety Recall: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('25252c36-bc66-484a-b8f7-03b02042b19b'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-053',
  'Service Campaign: Electrical System Update',
  'Service Campaign',
  '2023-11-12',
  'Service Campaign: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('1fcf734f-66b3-4424-9d37-0c13641d082b'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-054',
  'Safety Recall: Transmission System Update',
  'Safety Recall',
  '2024-11-18',
  'Safety Recall: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('231ec0a0-f4db-43b8-8663-fd5241f0fb01'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-055',
  'Product Improvement: Electrical System Update',
  'Product Improvement',
  '2023-05-26',
  'Product Improvement: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('ed490c6b-89a7-4967-9961-499bac071274'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-056',
  'Technical Update: Transmission System Update',
  'Technical Update',
  '2021-06-20',
  'Technical Update: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('d64d2d8f-f400-49e0-a35d-594195263e68'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-057',
  'Safety Recall: Transmission System Update',
  'Safety Recall',
  '2021-05-23',
  'Safety Recall: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('8a0e2fa8-9463-4c20-b121-25b9d2185c74'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-058',
  'Technical Update: Brakes System Update',
  'Technical Update',
  '2023-12-09',
  'Technical Update: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('828b25f8-962a-463a-8087-0e2402d5fd47'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-059',
  'Technical Update: Brakes System Update',
  'Technical Update',
  '2023-01-27',
  'Technical Update: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('2e8f9136-0248-4026-a2df-2e271e796f77'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-060',
  'Technical Update: Electrical System Update',
  'Technical Update',
  '2024-01-02',
  'Technical Update: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('aa5790b6-c370-4742-8220-ce4fb4dcb971'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-061',
  'Product Improvement: Transmission System Update',
  'Product Improvement',
  '2021-09-10',
  'Product Improvement: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('c7af592d-00f7-446b-a36d-427f6cb335c7'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-062',
  'Product Improvement: Transmission System Update',
  'Product Improvement',
  '2021-08-13',
  'Product Improvement: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('f049812b-4d1d-4902-8d45-0ab61d160094'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-063',
  'Technical Update: Brakes System Update',
  'Technical Update',
  '2024-02-16',
  'Technical Update: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('0f939307-88d1-4b47-8d81-2c53c6d61b61'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-064',
  'Service Campaign: Brakes System Update',
  'Service Campaign',
  '2023-07-20',
  'Service Campaign: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('ff1da6d3-15d7-4c26-bc73-dd4b33253575'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-065',
  'Technical Update: Transmission System Update',
  'Technical Update',
  '2021-08-07',
  'Technical Update: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('f0ca024d-6fbb-45de-b5fb-f9c1e366ccf3'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-066',
  'Safety Recall: Electrical System Update',
  'Safety Recall',
  '2023-08-05',
  'Safety Recall: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('45e237b0-2fe6-4cbb-a571-a8ff8cd9a9e0'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-067',
  'Technical Update: Transmission System Update',
  'Technical Update',
  '2023-09-10',
  'Technical Update: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('193c34db-298f-47e1-92a0-b5cecedcc7a7'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-068',
  'Safety Recall: Brakes System Update',
  'Safety Recall',
  '2021-06-26',
  'Safety Recall: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('72a17358-15f4-4a6a-9bd2-39c757d2a2cd'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-069',
  'Product Improvement: Transmission System Update',
  'Product Improvement',
  '2021-10-05',
  'Product Improvement: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('59541abc-abe3-4274-b0b4-f256d64ba8d6'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-070',
  'Product Improvement: Brakes System Update',
  'Product Improvement',
  '2023-05-02',
  'Product Improvement: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('06d98d04-6521-4b8f-9e4d-6fbf746b647c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-071',
  'Product Improvement: Engine System Update',
  'Product Improvement',
  '2020-02-25',
  'Product Improvement: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('a072a5ee-ba09-4062-bf06-c66605ee0d36'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-072',
  'Technical Update: Brakes System Update',
  'Technical Update',
  '2020-03-16',
  'Technical Update: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('8ac8d39b-5dfe-4c0e-990b-71038e8b0677'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-073',
  'Technical Update: Brakes System Update',
  'Technical Update',
  '2020-09-02',
  'Technical Update: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('eb7b8653-81cf-4091-85a0-14505df2e0cc'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-074',
  'Service Campaign: Electrical System Update',
  'Service Campaign',
  '2020-09-19',
  'Service Campaign: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('0f13d2b4-f97d-44ed-af1c-b5dc1a48c3c3'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-075',
  'Product Improvement: Engine System Update',
  'Product Improvement',
  '2023-03-22',
  'Product Improvement: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('5c7c15a0-ffc5-4154-83fa-a030777cf494'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-076',
  'Technical Update: Transmission System Update',
  'Technical Update',
  '2021-05-31',
  'Technical Update: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('5feb1fd3-499b-49da-8588-3940dce109be'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-077',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2023-11-10',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('a4600b00-c269-41f9-ac53-2dacfd626e5f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-078',
  'Product Improvement: Brakes System Update',
  'Product Improvement',
  '2022-04-05',
  'Product Improvement: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('d8360ea2-5c7b-4078-a2f7-427e6b405d35'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-079',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2020-11-03',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('67aba8d5-99db-4061-a108-5cb937b19940'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-080',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2023-07-16',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('c1b3caab-e381-4061-ac15-3793c7f71d27'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-081',
  'Service Campaign: Electrical System Update',
  'Service Campaign',
  '2024-02-10',
  'Service Campaign: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('9a0d68b2-3f64-40b0-8697-c0665806c3be'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-082',
  'Product Improvement: Brakes System Update',
  'Product Improvement',
  '2023-03-03',
  'Product Improvement: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('9fa3cfb3-b23d-4a0c-aeef-16a0b56778e5'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-083',
  'Service Campaign: Electrical System Update',
  'Service Campaign',
  '2024-11-19',
  'Service Campaign: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('9065b821-294c-412c-be02-e6dbcbb5ed63'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-084',
  'Safety Recall: Engine System Update',
  'Safety Recall',
  '2024-03-17',
  'Safety Recall: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('2ebb3fe1-bde0-45e2-8856-d15388624eb0'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-085',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2023-08-13',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('3b09cee3-3424-42e0-a35a-c94bd11ab6e1'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-086',
  'Service Campaign: Engine System Update',
  'Service Campaign',
  '2024-06-21',
  'Service Campaign: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('667fc4f0-f61a-4b5d-b6e2-6d2a37b1d121'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-087',
  'Technical Update: Transmission System Update',
  'Technical Update',
  '2022-01-25',
  'Technical Update: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('30765793-2510-434f-8376-227c8b750233'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-088',
  'Safety Recall: Electrical System Update',
  'Safety Recall',
  '2022-02-26',
  'Safety Recall: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('7937c361-c546-4ba1-9e08-1f0937818af9'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-089',
  'Product Improvement: Engine System Update',
  'Product Improvement',
  '2021-09-25',
  'Product Improvement: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('ba65054c-4651-431a-b9b8-ec97bd57e868'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-090',
  'Product Improvement: Electrical System Update',
  'Product Improvement',
  '2021-02-11',
  'Product Improvement: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('26bf0074-feb9-4875-9f20-f62cd788b95b'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-091',
  'Service Campaign: Brakes System Update',
  'Service Campaign',
  '2023-01-19',
  'Service Campaign: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('c32fe3af-fffb-44c0-a9db-c4211752f1e3'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-092',
  'Service Campaign: Transmission System Update',
  'Service Campaign',
  '2022-10-20',
  'Service Campaign: Transmission System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('566ac760-cb8d-461c-b88c-157010c17580'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-093',
  'Technical Update: Electrical System Update',
  'Technical Update',
  '2023-10-23',
  'Technical Update: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('e80c80a4-c3ba-4e63-87b8-776f517b3780'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-094',
  'Product Improvement: Engine System Update',
  'Product Improvement',
  '2021-05-16',
  'Product Improvement: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('4767cbe3-963c-4317-97b3-e78c168e80b0'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-095',
  'Technical Update: Engine System Update',
  'Technical Update',
  '2020-06-21',
  'Technical Update: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('dd6cb9ce-f07f-4264-a897-f27479430b3f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-096',
  'Safety Recall: Engine System Update',
  'Safety Recall',
  '2023-06-15',
  'Safety Recall: Engine System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'mandatory',
  true
),
(
  uuid('e506dde7-6a1f-4598-a850-782e5c3937ac'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-097',
  'Product Improvement: Brakes System Update',
  'Product Improvement',
  '2022-03-17',
  'Product Improvement: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('07c1a017-7b7b-471d-afef-a6c411db386e'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-098',
  'Product Improvement: Brakes System Update',
  'Product Improvement',
  '2023-07-20',
  'Product Improvement: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
),
(
  uuid('264c60cb-22f0-4f6f-a6a8-0efe74403771'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-099',
  'Technical Update: Brakes System Update',
  'Technical Update',
  '2022-01-18',
  'Technical Update: Brakes System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'info',
  true
),
(
  uuid('6bf53136-509f-44ae-a223-e0a3913c3bbb'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'TSB-2025-100',
  'Product Improvement: Electrical System Update',
  'Product Improvement',
  '2020-08-03',
  'Product Improvement: Electrical System Update',
  'This bulletin addresses a potential issue that may affect vehicle operation. 
                 Affected vehicles should be inspected and updated according to the procedure outlined below.
                 
                 Symptoms: Intermittent operation, unusual noise, or performance degradation.
                 
                 Corrective Action: Replace affected component with updated part number.
                 Labor Time: 1.5 hours
                 Parts Required: See attached parts list',
  ARRAY[]::text[],
  'recommended',
  true
);

-- Verification
SELECT COUNT(*) as total_bulletins FROM wis_bulletins;
SELECT vehicle_id, COUNT(*) as bulletin_count 
FROM wis_bulletins 
GROUP BY vehicle_id 
ORDER BY bulletin_count DESC;