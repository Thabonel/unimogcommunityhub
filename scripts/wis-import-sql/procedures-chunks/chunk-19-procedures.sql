-- WIS Procedures Import - Chunk 19
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 19 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('5e6e205e-74c0-488f-b471-f74214363b8b'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-MAN-REM-4a9a8e',
  'Remove and Install Manual Gearbox - Unimog U1600',
  'Transmission',
  'Manual Gearbox',
  'Remove and Install Manual Gearbox - Unimog U1600',
  '# Remove and Install Manual Gearbox - Unimog U1600

## Overview
This procedure covers the removal of the Manual Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d0253b29-df78-44a5-a0bb-4869e3b28dd0'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-MAN-INS-yxp2b',
  'Inspect and Test Manual Gearbox - Unimog U1600',
  'Transmission',
  'Manual Gearbox',
  'Inspect and Test Manual Gearbox - Unimog U1600',
  '# Inspect and Test Manual Gearbox - Unimog U1600

## Overview
This procedure covers the inspection of the Manual Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fe05f977-b834-41d7-afb9-fc34562132a6'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-MAN-ADJ-z429t9',
  'Adjust and Calibrate Manual Gearbox - Unimog U1600',
  'Transmission',
  'Manual Gearbox',
  'Adjust and Calibrate Manual Gearbox - Unimog U1600',
  '# Adjust and Calibrate Manual Gearbox - Unimog U1600

## Overview
This procedure covers the adjustment of the Manual Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bc2f6fb0-e8ce-452f-811e-edb8ae9fe2a1'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-MAN-REP-anllzb',
  'Replace Manual Gearbox - Unimog U1600',
  'Transmission',
  'Manual Gearbox',
  'Replace Manual Gearbox - Unimog U1600',
  '# Replace Manual Gearbox - Unimog U1600

## Overview
This procedure covers the replacement of the Manual Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2ea19e8a-e5da-444c-b1e4-5827265f4baf'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-MAN-OVE-dklsvd',
  'Overhaul and Rebuild Manual Gearbox - Unimog U1600',
  'Transmission',
  'Manual Gearbox',
  'Overhaul and Rebuild Manual Gearbox - Unimog U1600',
  '# Overhaul and Rebuild Manual Gearbox - Unimog U1600

## Overview
This procedure covers the overhaul of the Manual Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4693fc89-9a09-4591-985e-acea133a0dd4'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-MAN-TRO-6lby2',
  'Diagnose and Repair Manual Gearbox - Unimog U1600',
  'Transmission',
  'Manual Gearbox',
  'Diagnose and Repair Manual Gearbox - Unimog U1600',
  '# Diagnose and Repair Manual Gearbox - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Manual Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('94b187c4-3716-4c53-bd3f-d149ba5778fe'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-AUT-REM-4oxcgj',
  'Remove and Install Automatic Gearbox - Unimog U1600',
  'Transmission',
  'Automatic Gearbox',
  'Remove and Install Automatic Gearbox - Unimog U1600',
  '# Remove and Install Automatic Gearbox - Unimog U1600

## Overview
This procedure covers the removal of the Automatic Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0ac630e5-db02-4290-a747-d81feb84bf08'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-AUT-INS-u08jw7',
  'Inspect and Test Automatic Gearbox - Unimog U1600',
  'Transmission',
  'Automatic Gearbox',
  'Inspect and Test Automatic Gearbox - Unimog U1600',
  '# Inspect and Test Automatic Gearbox - Unimog U1600

## Overview
This procedure covers the inspection of the Automatic Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('426ff035-6ec2-4091-a71b-c1e756218fc3'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-AUT-ADJ-sw5oss',
  'Adjust and Calibrate Automatic Gearbox - Unimog U1600',
  'Transmission',
  'Automatic Gearbox',
  'Adjust and Calibrate Automatic Gearbox - Unimog U1600',
  '# Adjust and Calibrate Automatic Gearbox - Unimog U1600

## Overview
This procedure covers the adjustment of the Automatic Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('35877132-75d5-4f08-a2c2-696b480ede5e'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-AUT-REP-h2k81',
  'Replace Automatic Gearbox - Unimog U1600',
  'Transmission',
  'Automatic Gearbox',
  'Replace Automatic Gearbox - Unimog U1600',
  '# Replace Automatic Gearbox - Unimog U1600

## Overview
This procedure covers the replacement of the Automatic Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e0692edb-06eb-4cb7-ac1f-6de846a7e4ae'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-AUT-OVE-cjcskd',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U1600',
  'Transmission',
  'Automatic Gearbox',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U1600',
  '# Overhaul and Rebuild Automatic Gearbox - Unimog U1600

## Overview
This procedure covers the overhaul of the Automatic Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('309e1ff8-bfd2-49d2-b692-36ae9cee1f7d'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-AUT-TRO-x5vga',
  'Diagnose and Repair Automatic Gearbox - Unimog U1600',
  'Transmission',
  'Automatic Gearbox',
  'Diagnose and Repair Automatic Gearbox - Unimog U1600',
  '# Diagnose and Repair Automatic Gearbox - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Automatic Gearbox on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('888a525d-eba4-4ae8-88c6-b3b913fa7263'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-TRA-REM-872su',
  'Remove and Install Transfer Case - Unimog U1600',
  'Transmission',
  'Transfer Case',
  'Remove and Install Transfer Case - Unimog U1600',
  '# Remove and Install Transfer Case - Unimog U1600

## Overview
This procedure covers the removal of the Transfer Case on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('63b90498-8c97-49d5-ab2b-5f4d9202717b'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-TRA-INS-5thnuf',
  'Inspect and Test Transfer Case - Unimog U1600',
  'Transmission',
  'Transfer Case',
  'Inspect and Test Transfer Case - Unimog U1600',
  '# Inspect and Test Transfer Case - Unimog U1600

## Overview
This procedure covers the inspection of the Transfer Case on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c0b8528f-bc78-4df2-b8e6-d74c16d5ae03'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-TRA-ADJ-drddmu',
  'Adjust and Calibrate Transfer Case - Unimog U1600',
  'Transmission',
  'Transfer Case',
  'Adjust and Calibrate Transfer Case - Unimog U1600',
  '# Adjust and Calibrate Transfer Case - Unimog U1600

## Overview
This procedure covers the adjustment of the Transfer Case on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('47f62d53-b96a-41f1-bbba-b944add48c2c'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-TRA-REP-cj6h4',
  'Replace Transfer Case - Unimog U1600',
  'Transmission',
  'Transfer Case',
  'Replace Transfer Case - Unimog U1600',
  '# Replace Transfer Case - Unimog U1600

## Overview
This procedure covers the replacement of the Transfer Case on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('30b2762f-ceb1-4757-88e5-a1e2d4727cb7'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-TRA-OVE-3zeui',
  'Overhaul and Rebuild Transfer Case - Unimog U1600',
  'Transmission',
  'Transfer Case',
  'Overhaul and Rebuild Transfer Case - Unimog U1600',
  '# Overhaul and Rebuild Transfer Case - Unimog U1600

## Overview
This procedure covers the overhaul of the Transfer Case on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('133e6e79-680b-461e-a32d-70b45d9e669f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-TRA-TRO-xwqcnr',
  'Diagnose and Repair Transfer Case - Unimog U1600',
  'Transmission',
  'Transfer Case',
  'Diagnose and Repair Transfer Case - Unimog U1600',
  '# Diagnose and Repair Transfer Case - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Transfer Case on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4f05fec1-f222-459d-83f2-36d38fce7a3c'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-PTO-REM-qkr2p',
  'Remove and Install PTO - Unimog U1600',
  'Transmission',
  'PTO',
  'Remove and Install PTO - Unimog U1600',
  '# Remove and Install PTO - Unimog U1600

## Overview
This procedure covers the removal of the PTO on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5429ad4b-166d-45a2-b86e-c09ee415a650'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-PTO-INS-sg5cwn',
  'Inspect and Test PTO - Unimog U1600',
  'Transmission',
  'PTO',
  'Inspect and Test PTO - Unimog U1600',
  '# Inspect and Test PTO - Unimog U1600

## Overview
This procedure covers the inspection of the PTO on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6cb14bde-1cb4-4fc5-bade-ac484199f70f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-PTO-ADJ-17jof',
  'Adjust and Calibrate PTO - Unimog U1600',
  'Transmission',
  'PTO',
  'Adjust and Calibrate PTO - Unimog U1600',
  '# Adjust and Calibrate PTO - Unimog U1600

## Overview
This procedure covers the adjustment of the PTO on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('418384cb-5339-4d20-a9c2-49d16fb40587'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-PTO-REP-4kj7ul',
  'Replace PTO - Unimog U1600',
  'Transmission',
  'PTO',
  'Replace PTO - Unimog U1600',
  '# Replace PTO - Unimog U1600

## Overview
This procedure covers the replacement of the PTO on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7fb6c7bf-895e-44d1-9c10-ebfd355226e9'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-PTO-OVE-2ds8zf',
  'Overhaul and Rebuild PTO - Unimog U1600',
  'Transmission',
  'PTO',
  'Overhaul and Rebuild PTO - Unimog U1600',
  '# Overhaul and Rebuild PTO - Unimog U1600

## Overview
This procedure covers the overhaul of the PTO on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ad1bf928-a4c2-4bfe-8d02-b3d8f3a143eb'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-PTO-TRO-0u5ebl',
  'Diagnose and Repair PTO - Unimog U1600',
  'Transmission',
  'PTO',
  'Diagnose and Repair PTO - Unimog U1600',
  '# Diagnose and Repair PTO - Unimog U1600

## Overview
This procedure covers the troubleshooting of the PTO on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0340e8b4-ea62-481b-8595-ba368c4f276c'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-CLU-REM-bboq6g',
  'Remove and Install Clutch - Unimog U1600',
  'Transmission',
  'Clutch',
  'Remove and Install Clutch - Unimog U1600',
  '# Remove and Install Clutch - Unimog U1600

## Overview
This procedure covers the removal of the Clutch on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e3c9d885-291d-4e4c-9b4c-250c0cf22f96'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-CLU-INS-ckovtn',
  'Inspect and Test Clutch - Unimog U1600',
  'Transmission',
  'Clutch',
  'Inspect and Test Clutch - Unimog U1600',
  '# Inspect and Test Clutch - Unimog U1600

## Overview
This procedure covers the inspection of the Clutch on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1cdd56a2-3f02-4d69-a98d-38a23261fd77'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-CLU-ADJ-39aazb',
  'Adjust and Calibrate Clutch - Unimog U1600',
  'Transmission',
  'Clutch',
  'Adjust and Calibrate Clutch - Unimog U1600',
  '# Adjust and Calibrate Clutch - Unimog U1600

## Overview
This procedure covers the adjustment of the Clutch on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6b106839-9c74-444e-a457-814718da56c6'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-CLU-REP-ns5n3l',
  'Replace Clutch - Unimog U1600',
  'Transmission',
  'Clutch',
  'Replace Clutch - Unimog U1600',
  '# Replace Clutch - Unimog U1600

## Overview
This procedure covers the replacement of the Clutch on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('75c98a96-810d-4ac1-9e25-f015e50dbfad'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-CLU-OVE-z6iifn',
  'Overhaul and Rebuild Clutch - Unimog U1600',
  'Transmission',
  'Clutch',
  'Overhaul and Rebuild Clutch - Unimog U1600',
  '# Overhaul and Rebuild Clutch - Unimog U1600

## Overview
This procedure covers the overhaul of the Clutch on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ef061066-4b27-4881-9b78-b0aa0b298332'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-TRA-CLU-TRO-1cq105',
  'Diagnose and Repair Clutch - Unimog U1600',
  'Transmission',
  'Clutch',
  'Diagnose and Repair Clutch - Unimog U1600',
  '# Diagnose and Repair Clutch - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Clutch on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Tra-001 for system overview
- See U1600-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('31992e69-2951-41c7-a693-9e0a7983d1e6'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-POR-REM-9i2de2',
  'Remove and Install Portal Axles - Unimog U1600',
  'Drivetrain',
  'Portal Axles',
  'Remove and Install Portal Axles - Unimog U1600',
  '# Remove and Install Portal Axles - Unimog U1600

## Overview
This procedure covers the removal of the Portal Axles on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- Raise vehicle on appropriate lift points
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('39057e12-1656-4bef-967f-6ced5287a5ab'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-POR-INS-jxlfvq',
  'Inspect and Test Portal Axles - Unimog U1600',
  'Drivetrain',
  'Portal Axles',
  'Inspect and Test Portal Axles - Unimog U1600',
  '# Inspect and Test Portal Axles - Unimog U1600

## Overview
This procedure covers the inspection of the Portal Axles on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- Raise vehicle on appropriate lift points
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('72733c4a-9315-4d9a-b250-9c097a7bf57f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-POR-ADJ-l2ycgm',
  'Adjust and Calibrate Portal Axles - Unimog U1600',
  'Drivetrain',
  'Portal Axles',
  'Adjust and Calibrate Portal Axles - Unimog U1600',
  '# Adjust and Calibrate Portal Axles - Unimog U1600

## Overview
This procedure covers the adjustment of the Portal Axles on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- Raise vehicle on appropriate lift points
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1d8bcc0b-f535-4172-a95f-05f6ee575af4'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-POR-REP-3wwnkn',
  'Replace Portal Axles - Unimog U1600',
  'Drivetrain',
  'Portal Axles',
  'Replace Portal Axles - Unimog U1600',
  '# Replace Portal Axles - Unimog U1600

## Overview
This procedure covers the replacement of the Portal Axles on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- Raise vehicle on appropriate lift points
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('eb702dcf-9647-4d2c-ba1a-ddda240c0458'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-POR-OVE-e4x2rk',
  'Overhaul and Rebuild Portal Axles - Unimog U1600',
  'Drivetrain',
  'Portal Axles',
  'Overhaul and Rebuild Portal Axles - Unimog U1600',
  '# Overhaul and Rebuild Portal Axles - Unimog U1600

## Overview
This procedure covers the overhaul of the Portal Axles on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- Raise vehicle on appropriate lift points
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('64fdecde-02d8-4064-bf4f-0ec9ba5dceaa'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-POR-TRO-szd5vm',
  'Diagnose and Repair Portal Axles - Unimog U1600',
  'Drivetrain',
  'Portal Axles',
  'Diagnose and Repair Portal Axles - Unimog U1600',
  '# Diagnose and Repair Portal Axles - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Portal Axles on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- Raise vehicle on appropriate lift points
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('12d7328d-3b1f-429b-8b27-45c401cac0c8'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DIF-REM-dek9z',
  'Remove and Install Differentials - Unimog U1600',
  'Drivetrain',
  'Differentials',
  'Remove and Install Differentials - Unimog U1600',
  '# Remove and Install Differentials - Unimog U1600

## Overview
This procedure covers the removal of the Differentials on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c810063f-9392-483f-8e85-5c77df443d99'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DIF-INS-k4cz8l',
  'Inspect and Test Differentials - Unimog U1600',
  'Drivetrain',
  'Differentials',
  'Inspect and Test Differentials - Unimog U1600',
  '# Inspect and Test Differentials - Unimog U1600

## Overview
This procedure covers the inspection of the Differentials on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1525c72f-1ed9-4f4e-a07b-8996c8df99c5'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DIF-ADJ-xt5hwp',
  'Adjust and Calibrate Differentials - Unimog U1600',
  'Drivetrain',
  'Differentials',
  'Adjust and Calibrate Differentials - Unimog U1600',
  '# Adjust and Calibrate Differentials - Unimog U1600

## Overview
This procedure covers the adjustment of the Differentials on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('89a5dc8e-1a0a-4165-ba1b-b0675fb02986'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DIF-REP-clonnm',
  'Replace Differentials - Unimog U1600',
  'Drivetrain',
  'Differentials',
  'Replace Differentials - Unimog U1600',
  '# Replace Differentials - Unimog U1600

## Overview
This procedure covers the replacement of the Differentials on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('24445b44-526e-42ff-a0c1-493967e5ef12'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DIF-OVE-sd3jcl',
  'Overhaul and Rebuild Differentials - Unimog U1600',
  'Drivetrain',
  'Differentials',
  'Overhaul and Rebuild Differentials - Unimog U1600',
  '# Overhaul and Rebuild Differentials - Unimog U1600

## Overview
This procedure covers the overhaul of the Differentials on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d0a79e48-32f4-49cc-8407-057a792566ce'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DIF-TRO-xoejb9',
  'Diagnose and Repair Differentials - Unimog U1600',
  'Drivetrain',
  'Differentials',
  'Diagnose and Repair Differentials - Unimog U1600',
  '# Diagnose and Repair Differentials - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Differentials on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bf331790-9d5f-49ce-97e3-aead5f7649c6'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DRI-REM-6y17ye',
  'Remove and Install Drive Shafts - Unimog U1600',
  'Drivetrain',
  'Drive Shafts',
  'Remove and Install Drive Shafts - Unimog U1600',
  '# Remove and Install Drive Shafts - Unimog U1600

## Overview
This procedure covers the removal of the Drive Shafts on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('09bd4ef6-7161-4784-849d-cafec5a4fdc6'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DRI-INS-wajfku',
  'Inspect and Test Drive Shafts - Unimog U1600',
  'Drivetrain',
  'Drive Shafts',
  'Inspect and Test Drive Shafts - Unimog U1600',
  '# Inspect and Test Drive Shafts - Unimog U1600

## Overview
This procedure covers the inspection of the Drive Shafts on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d6539c4a-a660-4c8e-911e-bdd0d99d870b'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DRI-ADJ-rhx89zs',
  'Adjust and Calibrate Drive Shafts - Unimog U1600',
  'Drivetrain',
  'Drive Shafts',
  'Adjust and Calibrate Drive Shafts - Unimog U1600',
  '# Adjust and Calibrate Drive Shafts - Unimog U1600

## Overview
This procedure covers the adjustment of the Drive Shafts on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7e132407-74fa-46ff-806f-f90979103777'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DRI-REP-657n9',
  'Replace Drive Shafts - Unimog U1600',
  'Drivetrain',
  'Drive Shafts',
  'Replace Drive Shafts - Unimog U1600',
  '# Replace Drive Shafts - Unimog U1600

## Overview
This procedure covers the replacement of the Drive Shafts on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8a3846ec-b97f-454f-acd9-81586daf5d2a'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DRI-OVE-fmn8xo',
  'Overhaul and Rebuild Drive Shafts - Unimog U1600',
  'Drivetrain',
  'Drive Shafts',
  'Overhaul and Rebuild Drive Shafts - Unimog U1600',
  '# Overhaul and Rebuild Drive Shafts - Unimog U1600

## Overview
This procedure covers the overhaul of the Drive Shafts on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('932f7d2a-2b4f-4494-8d28-d144785ff73f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-DRI-TRO-55pnn9',
  'Diagnose and Repair Drive Shafts - Unimog U1600',
  'Drivetrain',
  'Drive Shafts',
  'Diagnose and Repair Drive Shafts - Unimog U1600',
  '# Diagnose and Repair Drive Shafts - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Drive Shafts on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('60239b4f-aa35-413b-bf83-1fd60ee913df'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-WHE-REM-yfvvjj',
  'Remove and Install Wheel Hubs - Unimog U1600',
  'Drivetrain',
  'Wheel Hubs',
  'Remove and Install Wheel Hubs - Unimog U1600',
  '# Remove and Install Wheel Hubs - Unimog U1600

## Overview
This procedure covers the removal of the Wheel Hubs on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2318c85d-de18-400b-83dd-3c058b0e5c20'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-WHE-INS-xqm898',
  'Inspect and Test Wheel Hubs - Unimog U1600',
  'Drivetrain',
  'Wheel Hubs',
  'Inspect and Test Wheel Hubs - Unimog U1600',
  '# Inspect and Test Wheel Hubs - Unimog U1600

## Overview
This procedure covers the inspection of the Wheel Hubs on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f3dc3e69-bbee-41b7-8873-c58b62786da8'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-WHE-ADJ-77vr9',
  'Adjust and Calibrate Wheel Hubs - Unimog U1600',
  'Drivetrain',
  'Wheel Hubs',
  'Adjust and Calibrate Wheel Hubs - Unimog U1600',
  '# Adjust and Calibrate Wheel Hubs - Unimog U1600

## Overview
This procedure covers the adjustment of the Wheel Hubs on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5112182b-2184-46fa-a145-5bf47f79a1f3'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-WHE-REP-lsllhx',
  'Replace Wheel Hubs - Unimog U1600',
  'Drivetrain',
  'Wheel Hubs',
  'Replace Wheel Hubs - Unimog U1600',
  '# Replace Wheel Hubs - Unimog U1600

## Overview
This procedure covers the replacement of the Wheel Hubs on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e79d4083-7f04-4264-a08d-fe8bc0b0ee90'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-WHE-OVE-0zog2',
  'Overhaul and Rebuild Wheel Hubs - Unimog U1600',
  'Drivetrain',
  'Wheel Hubs',
  'Overhaul and Rebuild Wheel Hubs - Unimog U1600',
  '# Overhaul and Rebuild Wheel Hubs - Unimog U1600

## Overview
This procedure covers the overhaul of the Wheel Hubs on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('09b4d453-6328-4189-bf7b-5a67cc0a7457'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-WHE-TRO-2rcxsa',
  'Diagnose and Repair Wheel Hubs - Unimog U1600',
  'Drivetrain',
  'Wheel Hubs',
  'Diagnose and Repair Wheel Hubs - Unimog U1600',
  '# Diagnose and Repair Wheel Hubs - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Wheel Hubs on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a2d0ea2b-d7d1-46ed-b729-46b0feff9fd3'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-CV -REM-n55q1h',
  'Remove and Install CV Joints - Unimog U1600',
  'Drivetrain',
  'CV Joints',
  'Remove and Install CV Joints - Unimog U1600',
  '# Remove and Install CV Joints - Unimog U1600

## Overview
This procedure covers the removal of the CV Joints on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cf3240f9-5c95-4058-ab6c-befca87f8007'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-CV -INS-g2ywdnu',
  'Inspect and Test CV Joints - Unimog U1600',
  'Drivetrain',
  'CV Joints',
  'Inspect and Test CV Joints - Unimog U1600',
  '# Inspect and Test CV Joints - Unimog U1600

## Overview
This procedure covers the inspection of the CV Joints on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3f0a28ed-e5bd-41ee-ad44-c4d47c555f4f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-CV -ADJ-k43o3g',
  'Adjust and Calibrate CV Joints - Unimog U1600',
  'Drivetrain',
  'CV Joints',
  'Adjust and Calibrate CV Joints - Unimog U1600',
  '# Adjust and Calibrate CV Joints - Unimog U1600

## Overview
This procedure covers the adjustment of the CV Joints on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3d7c7d6c-e536-4e15-82de-a68341744b33'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-CV -REP-jo40a8',
  'Replace CV Joints - Unimog U1600',
  'Drivetrain',
  'CV Joints',
  'Replace CV Joints - Unimog U1600',
  '# Replace CV Joints - Unimog U1600

## Overview
This procedure covers the replacement of the CV Joints on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('972bd5ca-3084-4f6d-8665-d9f35f40e7a6'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-CV -OVE-17wfy9',
  'Overhaul and Rebuild CV Joints - Unimog U1600',
  'Drivetrain',
  'CV Joints',
  'Overhaul and Rebuild CV Joints - Unimog U1600',
  '# Overhaul and Rebuild CV Joints - Unimog U1600

## Overview
This procedure covers the overhaul of the CV Joints on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b1c1b872-d12f-424e-bc6b-cabc80db8531'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-DRI-CV -TRO-9vv0gm',
  'Diagnose and Repair CV Joints - Unimog U1600',
  'Drivetrain',
  'CV Joints',
  'Diagnose and Repair CV Joints - Unimog U1600',
  '# Diagnose and Repair CV Joints - Unimog U1600

## Overview
This procedure covers the troubleshooting of the CV Joints on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Dri-001 for system overview
- See U1600-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('222ec0b5-26f7-46a8-afec-5cc2e9b3cdca'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-SER-REM-671lh',
  'Remove and Install Service Brakes - Unimog U1600',
  'Brakes',
  'Service Brakes',
  'Remove and Install Service Brakes - Unimog U1600',
  '# Remove and Install Service Brakes - Unimog U1600

## Overview
This procedure covers the removal of the Service Brakes on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b76fae1b-9f9e-4fa1-b00e-91d6a1c7bd65'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-SER-INS-tsuoci',
  'Inspect and Test Service Brakes - Unimog U1600',
  'Brakes',
  'Service Brakes',
  'Inspect and Test Service Brakes - Unimog U1600',
  '# Inspect and Test Service Brakes - Unimog U1600

## Overview
This procedure covers the inspection of the Service Brakes on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('302f9d12-e2ba-4b7e-a2ba-cd6f60ff72e4'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-SER-ADJ-7bsvnpac',
  'Adjust and Calibrate Service Brakes - Unimog U1600',
  'Brakes',
  'Service Brakes',
  'Adjust and Calibrate Service Brakes - Unimog U1600',
  '# Adjust and Calibrate Service Brakes - Unimog U1600

## Overview
This procedure covers the adjustment of the Service Brakes on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('06c39164-b79c-408c-b955-c3152aaf0e14'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-SER-REP-zqfik',
  'Replace Service Brakes - Unimog U1600',
  'Brakes',
  'Service Brakes',
  'Replace Service Brakes - Unimog U1600',
  '# Replace Service Brakes - Unimog U1600

## Overview
This procedure covers the replacement of the Service Brakes on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4595d75c-e4f4-4c3a-a371-9ff100d64b80'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-SER-OVE-hhrsn',
  'Overhaul and Rebuild Service Brakes - Unimog U1600',
  'Brakes',
  'Service Brakes',
  'Overhaul and Rebuild Service Brakes - Unimog U1600',
  '# Overhaul and Rebuild Service Brakes - Unimog U1600

## Overview
This procedure covers the overhaul of the Service Brakes on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f60bd9d1-84bd-4ec9-9553-0346e6a6352f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-SER-TRO-yhbpfd',
  'Diagnose and Repair Service Brakes - Unimog U1600',
  'Brakes',
  'Service Brakes',
  'Diagnose and Repair Service Brakes - Unimog U1600',
  '# Diagnose and Repair Service Brakes - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Service Brakes on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4cf04cdb-db13-49c6-a9ef-93d39183e369'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-PAR-REM-52rd4',
  'Remove and Install Parking Brake - Unimog U1600',
  'Brakes',
  'Parking Brake',
  'Remove and Install Parking Brake - Unimog U1600',
  '# Remove and Install Parking Brake - Unimog U1600

## Overview
This procedure covers the removal of the Parking Brake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('50037d19-5543-447f-ba17-0fe2d90029ed'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-PAR-INS-n2iji',
  'Inspect and Test Parking Brake - Unimog U1600',
  'Brakes',
  'Parking Brake',
  'Inspect and Test Parking Brake - Unimog U1600',
  '# Inspect and Test Parking Brake - Unimog U1600

## Overview
This procedure covers the inspection of the Parking Brake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c8325f44-fabd-4cd4-8348-112f44dbdd05'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-PAR-ADJ-bpsdz',
  'Adjust and Calibrate Parking Brake - Unimog U1600',
  'Brakes',
  'Parking Brake',
  'Adjust and Calibrate Parking Brake - Unimog U1600',
  '# Adjust and Calibrate Parking Brake - Unimog U1600

## Overview
This procedure covers the adjustment of the Parking Brake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bfdcca89-86c5-4fa0-ac8b-3c8c7d063d39'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-PAR-REP-oj598o',
  'Replace Parking Brake - Unimog U1600',
  'Brakes',
  'Parking Brake',
  'Replace Parking Brake - Unimog U1600',
  '# Replace Parking Brake - Unimog U1600

## Overview
This procedure covers the replacement of the Parking Brake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('af301fb5-6763-42c0-bb89-381ff43756bd'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-PAR-OVE-vwq5ue',
  'Overhaul and Rebuild Parking Brake - Unimog U1600',
  'Brakes',
  'Parking Brake',
  'Overhaul and Rebuild Parking Brake - Unimog U1600',
  '# Overhaul and Rebuild Parking Brake - Unimog U1600

## Overview
This procedure covers the overhaul of the Parking Brake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('af4fd423-d29c-4633-a955-6b56a4f70c0f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-PAR-TRO-2km1k',
  'Diagnose and Repair Parking Brake - Unimog U1600',
  'Brakes',
  'Parking Brake',
  'Diagnose and Repair Parking Brake - Unimog U1600',
  '# Diagnose and Repair Parking Brake - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Parking Brake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2c9aff29-bbc6-4fff-b935-5383eb2e6a4f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-ABS-REM-o2y5ev',
  'Remove and Install ABS System - Unimog U1600',
  'Brakes',
  'ABS System',
  'Remove and Install ABS System - Unimog U1600',
  '# Remove and Install ABS System - Unimog U1600

## Overview
This procedure covers the removal of the ABS System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('11df64c2-0c47-4eea-bbbe-b8dc22dfdf9f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-ABS-INS-q95xr8',
  'Inspect and Test ABS System - Unimog U1600',
  'Brakes',
  'ABS System',
  'Inspect and Test ABS System - Unimog U1600',
  '# Inspect and Test ABS System - Unimog U1600

## Overview
This procedure covers the inspection of the ABS System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('89c52d63-e936-4ec3-a386-989e5cc82e5c'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-ABS-ADJ-d9pk3e',
  'Adjust and Calibrate ABS System - Unimog U1600',
  'Brakes',
  'ABS System',
  'Adjust and Calibrate ABS System - Unimog U1600',
  '# Adjust and Calibrate ABS System - Unimog U1600

## Overview
This procedure covers the adjustment of the ABS System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6166c0c3-30d3-47d4-bf1d-d38989851909'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-ABS-REP-1a7ab8',
  'Replace ABS System - Unimog U1600',
  'Brakes',
  'ABS System',
  'Replace ABS System - Unimog U1600',
  '# Replace ABS System - Unimog U1600

## Overview
This procedure covers the replacement of the ABS System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('07c3df16-aab2-40c0-9dec-a253879b3475'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-ABS-OVE-emjum',
  'Overhaul and Rebuild ABS System - Unimog U1600',
  'Brakes',
  'ABS System',
  'Overhaul and Rebuild ABS System - Unimog U1600',
  '# Overhaul and Rebuild ABS System - Unimog U1600

## Overview
This procedure covers the overhaul of the ABS System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a6d70fce-93cd-4a5d-ad3f-be57473cd915'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-ABS-TRO-4lf3m9',
  'Diagnose and Repair ABS System - Unimog U1600',
  'Brakes',
  'ABS System',
  'Diagnose and Repair ABS System - Unimog U1600',
  '# Diagnose and Repair ABS System - Unimog U1600

## Overview
This procedure covers the troubleshooting of the ABS System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8e667972-ff40-4a1d-b25a-0e153ee2ce7f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-BRA-REM-t6jui0n',
  'Remove and Install Brake Lines - Unimog U1600',
  'Brakes',
  'Brake Lines',
  'Remove and Install Brake Lines - Unimog U1600',
  '# Remove and Install Brake Lines - Unimog U1600

## Overview
This procedure covers the removal of the Brake Lines on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bd4b0d11-7da4-4a32-bd45-e887ec27e8a7'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-BRA-INS-ygmwg',
  'Inspect and Test Brake Lines - Unimog U1600',
  'Brakes',
  'Brake Lines',
  'Inspect and Test Brake Lines - Unimog U1600',
  '# Inspect and Test Brake Lines - Unimog U1600

## Overview
This procedure covers the inspection of the Brake Lines on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('529a2954-9333-4d2f-8fb3-96a72cefb0ba'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-BRA-ADJ-4rc53',
  'Adjust and Calibrate Brake Lines - Unimog U1600',
  'Brakes',
  'Brake Lines',
  'Adjust and Calibrate Brake Lines - Unimog U1600',
  '# Adjust and Calibrate Brake Lines - Unimog U1600

## Overview
This procedure covers the adjustment of the Brake Lines on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ff9f27a6-a64d-440f-b7ae-13f4b66419c0'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-BRA-REP-0g3yno',
  'Replace Brake Lines - Unimog U1600',
  'Brakes',
  'Brake Lines',
  'Replace Brake Lines - Unimog U1600',
  '# Replace Brake Lines - Unimog U1600

## Overview
This procedure covers the replacement of the Brake Lines on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('96ab6b62-2f02-46d3-94e3-c36cbbd914ed'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-BRA-OVE-saxc39',
  'Overhaul and Rebuild Brake Lines - Unimog U1600',
  'Brakes',
  'Brake Lines',
  'Overhaul and Rebuild Brake Lines - Unimog U1600',
  '# Overhaul and Rebuild Brake Lines - Unimog U1600

## Overview
This procedure covers the overhaul of the Brake Lines on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2ab54ea0-ac9b-4eee-9bd9-8bedbe8c1e12'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-BRA-TRO-n6lnr',
  'Diagnose and Repair Brake Lines - Unimog U1600',
  'Brakes',
  'Brake Lines',
  'Diagnose and Repair Brake Lines - Unimog U1600',
  '# Diagnose and Repair Brake Lines - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Brake Lines on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('776176bf-3fc9-40ec-a894-9246f25cf98f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-AIR-REM-xyq2ap',
  'Remove and Install Air System - Unimog U1600',
  'Brakes',
  'Air System',
  'Remove and Install Air System - Unimog U1600',
  '# Remove and Install Air System - Unimog U1600

## Overview
This procedure covers the removal of the Air System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('aadc2d1b-131a-4e6e-893b-6b9df561e448'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-AIR-INS-dpayqb',
  'Inspect and Test Air System - Unimog U1600',
  'Brakes',
  'Air System',
  'Inspect and Test Air System - Unimog U1600',
  '# Inspect and Test Air System - Unimog U1600

## Overview
This procedure covers the inspection of the Air System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4d63fc9a-f47f-4bff-adf0-f78748db0868'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-AIR-ADJ-k65n7m',
  'Adjust and Calibrate Air System - Unimog U1600',
  'Brakes',
  'Air System',
  'Adjust and Calibrate Air System - Unimog U1600',
  '# Adjust and Calibrate Air System - Unimog U1600

## Overview
This procedure covers the adjustment of the Air System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b30e4816-e132-46c5-b178-e0b39e3c507e'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-AIR-REP-6qh846',
  'Replace Air System - Unimog U1600',
  'Brakes',
  'Air System',
  'Replace Air System - Unimog U1600',
  '# Replace Air System - Unimog U1600

## Overview
This procedure covers the replacement of the Air System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0ec54423-314a-474c-a9c1-5c3218fc0c40'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-AIR-OVE-hklj9e',
  'Overhaul and Rebuild Air System - Unimog U1600',
  'Brakes',
  'Air System',
  'Overhaul and Rebuild Air System - Unimog U1600',
  '# Overhaul and Rebuild Air System - Unimog U1600

## Overview
This procedure covers the overhaul of the Air System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0e20aec2-13e9-413a-a2e9-d36881c94b60'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-BRA-AIR-TRO-ut2kvf',
  'Diagnose and Repair Air System - Unimog U1600',
  'Brakes',
  'Air System',
  'Diagnose and Repair Air System - Unimog U1600',
  '# Diagnose and Repair Air System - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Air System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Bra-001 for system overview
- See U1600-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6a5af357-9e42-4131-a574-ca926da4e82f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-STE-REM-193jtf',
  'Remove and Install Steering Box - Unimog U1600',
  'Steering',
  'Steering Box',
  'Remove and Install Steering Box - Unimog U1600',
  '# Remove and Install Steering Box - Unimog U1600

## Overview
This procedure covers the removal of the Steering Box on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('67a8b9c7-7b39-40ae-88c4-a1883f5dc457'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-STE-INS-wtgt9n',
  'Inspect and Test Steering Box - Unimog U1600',
  'Steering',
  'Steering Box',
  'Inspect and Test Steering Box - Unimog U1600',
  '# Inspect and Test Steering Box - Unimog U1600

## Overview
This procedure covers the inspection of the Steering Box on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c2dc81c6-c7fb-4488-8b80-f5952156e8eb'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-STE-ADJ-kn5du',
  'Adjust and Calibrate Steering Box - Unimog U1600',
  'Steering',
  'Steering Box',
  'Adjust and Calibrate Steering Box - Unimog U1600',
  '# Adjust and Calibrate Steering Box - Unimog U1600

## Overview
This procedure covers the adjustment of the Steering Box on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f6e0d795-b1dd-4746-8d6e-04b51c0acff2'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-STE-REP-y2t9lf',
  'Replace Steering Box - Unimog U1600',
  'Steering',
  'Steering Box',
  'Replace Steering Box - Unimog U1600',
  '# Replace Steering Box - Unimog U1600

## Overview
This procedure covers the replacement of the Steering Box on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('baae2227-b6d6-471a-bbaf-c7172031db3d'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-STE-OVE-j3nqlo',
  'Overhaul and Rebuild Steering Box - Unimog U1600',
  'Steering',
  'Steering Box',
  'Overhaul and Rebuild Steering Box - Unimog U1600',
  '# Overhaul and Rebuild Steering Box - Unimog U1600

## Overview
This procedure covers the overhaul of the Steering Box on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Overhaul
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('73eef585-daa1-4e41-b9b4-15dfd272a487'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-STE-TRO-8nuv1',
  'Diagnose and Repair Steering Box - Unimog U1600',
  'Steering',
  'Steering Box',
  'Diagnose and Repair Steering Box - Unimog U1600',
  '# Diagnose and Repair Steering Box - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Steering Box on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Troubleshooting
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('91bacba5-1e62-4e89-9798-97c4ccc23d62'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-POW-REM-8jf4gh',
  'Remove and Install Power Steering - Unimog U1600',
  'Steering',
  'Power Steering',
  'Remove and Install Power Steering - Unimog U1600',
  '# Remove and Install Power Steering - Unimog U1600

## Overview
This procedure covers the removal of the Power Steering on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Removal
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('538392ea-cb35-4a74-a4fd-f0ce2d2bcc30'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-POW-INS-3dq2x8',
  'Inspect and Test Power Steering - Unimog U1600',
  'Steering',
  'Power Steering',
  'Inspect and Test Power Steering - Unimog U1600',
  '# Inspect and Test Power Steering - Unimog U1600

## Overview
This procedure covers the inspection of the Power Steering on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Inspection
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6fead1f7-a36e-4c9c-b488-77636305c716'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-POW-ADJ-xtrg9',
  'Adjust and Calibrate Power Steering - Unimog U1600',
  'Steering',
  'Power Steering',
  'Adjust and Calibrate Power Steering - Unimog U1600',
  '# Adjust and Calibrate Power Steering - Unimog U1600

## Overview
This procedure covers the adjustment of the Power Steering on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Adjustment
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ed25fa4c-d374-41b2-9736-ce7d457dc926'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-STE-POW-REP-lboc0j',
  'Replace Power Steering - Unimog U1600',
  'Steering',
  'Power Steering',
  'Replace Power Steering - Unimog U1600',
  '# Replace Power Steering - Unimog U1600

## Overview
This procedure covers the replacement of the Power Steering on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. 
5. 

## Main Procedure

### Step 1: Access Component
- Remove protective covers as necessary
- 
- Clean area around component to prevent contamination

### Step 2: Component Replacement
- Follow torque specifications in table below
- Use new seals and gaskets where specified
- Apply specified lubricants to moving parts

### Step 3: System Check
- Perform functional test
- Check for leaks (if applicable)
- Verify proper operation

## Torque Specifications
| Component | Torque (Nm) | Thread Lock |
|-----------|------------|-------------|
| Main bolts | 85 ± 5 | Loctite 243 |
| Cover bolts | 25 ± 3 | None |
| Drain plug | 40 ± 5 | New seal |

## Final Steps
1. Reconnect battery
2. Clear any fault codes
3. Perform road test
4. Document work completed

## Technical Data
- Working pressure: N/A
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1600-Ste-001 for system overview
- See U1600-Ste-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
);

-- Verify this chunk
SELECT COUNT(*) as procedures_in_db FROM wis_procedures;
