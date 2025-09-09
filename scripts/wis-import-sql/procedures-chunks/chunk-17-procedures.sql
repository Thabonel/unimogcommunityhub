-- WIS Procedures Import - Chunk 17
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 17 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('6cbc385e-80b6-4239-8bfa-e917ccbd2e7e'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-STE-OVE-lhb39',
  'Overhaul and Rebuild Steering Box - Unimog U1400',
  'Steering',
  'Steering Box',
  'Overhaul and Rebuild Steering Box - Unimog U1400',
  '# Overhaul and Rebuild Steering Box - Unimog U1400

## Overview
This procedure covers the overhaul of the Steering Box on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a76f7610-9cec-4bab-bad1-88d51bc95166'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-STE-TRO-inh63y',
  'Diagnose and Repair Steering Box - Unimog U1400',
  'Steering',
  'Steering Box',
  'Diagnose and Repair Steering Box - Unimog U1400',
  '# Diagnose and Repair Steering Box - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Steering Box on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('390c46d8-d1f9-4d42-bdb2-91d5694b6e8c'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-POW-REM-4e4zxo',
  'Remove and Install Power Steering - Unimog U1400',
  'Steering',
  'Power Steering',
  'Remove and Install Power Steering - Unimog U1400',
  '# Remove and Install Power Steering - Unimog U1400

## Overview
This procedure covers the removal of the Power Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b796470c-f76f-445d-9a6c-1c809766ae21'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-POW-INS-nzjvmg',
  'Inspect and Test Power Steering - Unimog U1400',
  'Steering',
  'Power Steering',
  'Inspect and Test Power Steering - Unimog U1400',
  '# Inspect and Test Power Steering - Unimog U1400

## Overview
This procedure covers the inspection of the Power Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('98a0ba6d-17e3-40c6-adc9-46317f3da30b'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-POW-ADJ-o6pyn9',
  'Adjust and Calibrate Power Steering - Unimog U1400',
  'Steering',
  'Power Steering',
  'Adjust and Calibrate Power Steering - Unimog U1400',
  '# Adjust and Calibrate Power Steering - Unimog U1400

## Overview
This procedure covers the adjustment of the Power Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('06769680-2afe-4a45-a5f5-624843d948de'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-POW-REP-b3h2o',
  'Replace Power Steering - Unimog U1400',
  'Steering',
  'Power Steering',
  'Replace Power Steering - Unimog U1400',
  '# Replace Power Steering - Unimog U1400

## Overview
This procedure covers the replacement of the Power Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fdeea4ba-871d-497b-a4c3-13474cd9db40'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-POW-OVE-xwkrxf',
  'Overhaul and Rebuild Power Steering - Unimog U1400',
  'Steering',
  'Power Steering',
  'Overhaul and Rebuild Power Steering - Unimog U1400',
  '# Overhaul and Rebuild Power Steering - Unimog U1400

## Overview
This procedure covers the overhaul of the Power Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('91591ccb-9e8d-45c4-b101-5e5029708034'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-POW-TRO-ygcrjm',
  'Diagnose and Repair Power Steering - Unimog U1400',
  'Steering',
  'Power Steering',
  'Diagnose and Repair Power Steering - Unimog U1400',
  '# Diagnose and Repair Power Steering - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Power Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c615107e-ff5b-4c57-b971-ff457ac4095b'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-STE-REM-utxocw',
  'Remove and Install Steering Linkage - Unimog U1400',
  'Steering',
  'Steering Linkage',
  'Remove and Install Steering Linkage - Unimog U1400',
  '# Remove and Install Steering Linkage - Unimog U1400

## Overview
This procedure covers the removal of the Steering Linkage on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('75f02e94-f599-4592-adf5-88a25ed11eaa'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-STE-INS-dc5s6e',
  'Inspect and Test Steering Linkage - Unimog U1400',
  'Steering',
  'Steering Linkage',
  'Inspect and Test Steering Linkage - Unimog U1400',
  '# Inspect and Test Steering Linkage - Unimog U1400

## Overview
This procedure covers the inspection of the Steering Linkage on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6815744b-e051-4389-99ef-986b72e85991'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-STE-ADJ-7iaorq',
  'Adjust and Calibrate Steering Linkage - Unimog U1400',
  'Steering',
  'Steering Linkage',
  'Adjust and Calibrate Steering Linkage - Unimog U1400',
  '# Adjust and Calibrate Steering Linkage - Unimog U1400

## Overview
This procedure covers the adjustment of the Steering Linkage on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d54cba26-ea2c-4e56-a7f4-f9cc41446a91'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-STE-REP-bshr1',
  'Replace Steering Linkage - Unimog U1400',
  'Steering',
  'Steering Linkage',
  'Replace Steering Linkage - Unimog U1400',
  '# Replace Steering Linkage - Unimog U1400

## Overview
This procedure covers the replacement of the Steering Linkage on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e93dc8d8-3ba2-4af7-9bad-0daae5ff4762'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-STE-OVE-k3p228',
  'Overhaul and Rebuild Steering Linkage - Unimog U1400',
  'Steering',
  'Steering Linkage',
  'Overhaul and Rebuild Steering Linkage - Unimog U1400',
  '# Overhaul and Rebuild Steering Linkage - Unimog U1400

## Overview
This procedure covers the overhaul of the Steering Linkage on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('659e8ab3-1b6d-4e68-b62f-0de552cee678'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-STE-TRO-8xsi8g',
  'Diagnose and Repair Steering Linkage - Unimog U1400',
  'Steering',
  'Steering Linkage',
  'Diagnose and Repair Steering Linkage - Unimog U1400',
  '# Diagnose and Repair Steering Linkage - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Steering Linkage on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a82354ec-3cc3-409c-89bc-9df9dcdd15dc'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-4-W-REM-k4miqw',
  'Remove and Install 4-Wheel Steering - Unimog U1400',
  'Steering',
  '4-Wheel Steering',
  'Remove and Install 4-Wheel Steering - Unimog U1400',
  '# Remove and Install 4-Wheel Steering - Unimog U1400

## Overview
This procedure covers the removal of the 4-Wheel Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f8741ae7-85c2-424f-9905-d4fca8c53988'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-4-W-INS-0tfw2j',
  'Inspect and Test 4-Wheel Steering - Unimog U1400',
  'Steering',
  '4-Wheel Steering',
  'Inspect and Test 4-Wheel Steering - Unimog U1400',
  '# Inspect and Test 4-Wheel Steering - Unimog U1400

## Overview
This procedure covers the inspection of the 4-Wheel Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cc7ccb47-6676-4432-b984-bb1dd19e7a59'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-4-W-ADJ-cb6za',
  'Adjust and Calibrate 4-Wheel Steering - Unimog U1400',
  'Steering',
  '4-Wheel Steering',
  'Adjust and Calibrate 4-Wheel Steering - Unimog U1400',
  '# Adjust and Calibrate 4-Wheel Steering - Unimog U1400

## Overview
This procedure covers the adjustment of the 4-Wheel Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('672afae7-39c9-4d71-a538-2d243f91eeda'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-4-W-REP-va22j',
  'Replace 4-Wheel Steering - Unimog U1400',
  'Steering',
  '4-Wheel Steering',
  'Replace 4-Wheel Steering - Unimog U1400',
  '# Replace 4-Wheel Steering - Unimog U1400

## Overview
This procedure covers the replacement of the 4-Wheel Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('58c66a2d-aa32-43ca-864d-9210993beede'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-4-W-OVE-pwtp4o',
  'Overhaul and Rebuild 4-Wheel Steering - Unimog U1400',
  'Steering',
  '4-Wheel Steering',
  'Overhaul and Rebuild 4-Wheel Steering - Unimog U1400',
  '# Overhaul and Rebuild 4-Wheel Steering - Unimog U1400

## Overview
This procedure covers the overhaul of the 4-Wheel Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9bd9e27c-0079-4ab1-855e-8598aa579d88'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-STE-4-W-TRO-kotzyj',
  'Diagnose and Repair 4-Wheel Steering - Unimog U1400',
  'Steering',
  '4-Wheel Steering',
  'Diagnose and Repair 4-Wheel Steering - Unimog U1400',
  '# Diagnose and Repair 4-Wheel Steering - Unimog U1400

## Overview
This procedure covers the troubleshooting of the 4-Wheel Steering on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ste-001 for system overview
- See U1400-Ste-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('91aff752-42a6-4c82-a11f-c3e4f2c637d2'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SPR-REM-x1af5',
  'Remove and Install Springs - Unimog U1400',
  'Suspension',
  'Springs',
  'Remove and Install Springs - Unimog U1400',
  '# Remove and Install Springs - Unimog U1400

## Overview
This procedure covers the removal of the Springs on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('87776b80-e827-4ced-893a-c4e3739b7d09'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SPR-INS-pe5qn',
  'Inspect and Test Springs - Unimog U1400',
  'Suspension',
  'Springs',
  'Inspect and Test Springs - Unimog U1400',
  '# Inspect and Test Springs - Unimog U1400

## Overview
This procedure covers the inspection of the Springs on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('09056538-45e9-42e4-b011-def7edd6e30e'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SPR-ADJ-jmqrzs',
  'Adjust and Calibrate Springs - Unimog U1400',
  'Suspension',
  'Springs',
  'Adjust and Calibrate Springs - Unimog U1400',
  '# Adjust and Calibrate Springs - Unimog U1400

## Overview
This procedure covers the adjustment of the Springs on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('23111ba0-aeba-4538-b61f-be81e50030ca'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SPR-REP-l1w69',
  'Replace Springs - Unimog U1400',
  'Suspension',
  'Springs',
  'Replace Springs - Unimog U1400',
  '# Replace Springs - Unimog U1400

## Overview
This procedure covers the replacement of the Springs on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6ef73576-6769-4c8e-876a-81afb13ff169'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SPR-OVE-0fvp6c',
  'Overhaul and Rebuild Springs - Unimog U1400',
  'Suspension',
  'Springs',
  'Overhaul and Rebuild Springs - Unimog U1400',
  '# Overhaul and Rebuild Springs - Unimog U1400

## Overview
This procedure covers the overhaul of the Springs on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('34b0a5e4-82f5-4ea1-9f3c-bc12d6533885'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SPR-TRO-7ei6z',
  'Diagnose and Repair Springs - Unimog U1400',
  'Suspension',
  'Springs',
  'Diagnose and Repair Springs - Unimog U1400',
  '# Diagnose and Repair Springs - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Springs on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f2f27135-2d79-4fe8-97fe-19b3ceb89bd3'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SHO-REM-b0kznf',
  'Remove and Install Shock Absorbers - Unimog U1400',
  'Suspension',
  'Shock Absorbers',
  'Remove and Install Shock Absorbers - Unimog U1400',
  '# Remove and Install Shock Absorbers - Unimog U1400

## Overview
This procedure covers the removal of the Shock Absorbers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3d2dc077-1ac5-4ba1-8aad-30c411413354'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SHO-INS-umisvm',
  'Inspect and Test Shock Absorbers - Unimog U1400',
  'Suspension',
  'Shock Absorbers',
  'Inspect and Test Shock Absorbers - Unimog U1400',
  '# Inspect and Test Shock Absorbers - Unimog U1400

## Overview
This procedure covers the inspection of the Shock Absorbers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('41037506-016a-4c6a-82a3-7b2876c8a860'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SHO-ADJ-idwn1n',
  'Adjust and Calibrate Shock Absorbers - Unimog U1400',
  'Suspension',
  'Shock Absorbers',
  'Adjust and Calibrate Shock Absorbers - Unimog U1400',
  '# Adjust and Calibrate Shock Absorbers - Unimog U1400

## Overview
This procedure covers the adjustment of the Shock Absorbers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ce81084e-7195-4c52-a74f-591df6df670f'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SHO-REP-5qgb7ld',
  'Replace Shock Absorbers - Unimog U1400',
  'Suspension',
  'Shock Absorbers',
  'Replace Shock Absorbers - Unimog U1400',
  '# Replace Shock Absorbers - Unimog U1400

## Overview
This procedure covers the replacement of the Shock Absorbers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c5871d1-03fd-413e-a217-3c11abcf6171'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SHO-OVE-s7dk34',
  'Overhaul and Rebuild Shock Absorbers - Unimog U1400',
  'Suspension',
  'Shock Absorbers',
  'Overhaul and Rebuild Shock Absorbers - Unimog U1400',
  '# Overhaul and Rebuild Shock Absorbers - Unimog U1400

## Overview
This procedure covers the overhaul of the Shock Absorbers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('559f7bae-4223-4a66-9d0e-99cf2bbfc0af'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-SHO-TRO-yac63e',
  'Diagnose and Repair Shock Absorbers - Unimog U1400',
  'Suspension',
  'Shock Absorbers',
  'Diagnose and Repair Shock Absorbers - Unimog U1400',
  '# Diagnose and Repair Shock Absorbers - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Shock Absorbers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('68b0e468-78f1-4d0b-a1a4-8a86c7f83935'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-STA-REM-qi3uah',
  'Remove and Install Stabilizers - Unimog U1400',
  'Suspension',
  'Stabilizers',
  'Remove and Install Stabilizers - Unimog U1400',
  '# Remove and Install Stabilizers - Unimog U1400

## Overview
This procedure covers the removal of the Stabilizers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('39b95b16-c936-49c2-ae6b-9240645862d2'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-STA-INS-c5x3p',
  'Inspect and Test Stabilizers - Unimog U1400',
  'Suspension',
  'Stabilizers',
  'Inspect and Test Stabilizers - Unimog U1400',
  '# Inspect and Test Stabilizers - Unimog U1400

## Overview
This procedure covers the inspection of the Stabilizers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c6e51099-6847-44b6-9720-9087a9eb3d86'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-STA-ADJ-bbuhgo',
  'Adjust and Calibrate Stabilizers - Unimog U1400',
  'Suspension',
  'Stabilizers',
  'Adjust and Calibrate Stabilizers - Unimog U1400',
  '# Adjust and Calibrate Stabilizers - Unimog U1400

## Overview
This procedure covers the adjustment of the Stabilizers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('39636874-2322-42d3-9f24-d2e2e04f9c98'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-STA-REP-2u598c',
  'Replace Stabilizers - Unimog U1400',
  'Suspension',
  'Stabilizers',
  'Replace Stabilizers - Unimog U1400',
  '# Replace Stabilizers - Unimog U1400

## Overview
This procedure covers the replacement of the Stabilizers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5aaaa646-bf82-4d76-9575-999a5331d71c'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-STA-OVE-vgq1td',
  'Overhaul and Rebuild Stabilizers - Unimog U1400',
  'Suspension',
  'Stabilizers',
  'Overhaul and Rebuild Stabilizers - Unimog U1400',
  '# Overhaul and Rebuild Stabilizers - Unimog U1400

## Overview
This procedure covers the overhaul of the Stabilizers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cb47b942-e182-4183-aa19-f1ae89f19c7e'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-STA-TRO-6cq35',
  'Diagnose and Repair Stabilizers - Unimog U1400',
  'Suspension',
  'Stabilizers',
  'Diagnose and Repair Stabilizers - Unimog U1400',
  '# Diagnose and Repair Stabilizers - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Stabilizers on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('af13262a-906f-4ef5-a498-64e6ead631d0'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-AIR-REM-d54fsn',
  'Remove and Install Air Suspension - Unimog U1400',
  'Suspension',
  'Air Suspension',
  'Remove and Install Air Suspension - Unimog U1400',
  '# Remove and Install Air Suspension - Unimog U1400

## Overview
This procedure covers the removal of the Air Suspension on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('eb656a3f-1452-46e2-8d08-ada353dc9e10'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-AIR-INS-qszaga',
  'Inspect and Test Air Suspension - Unimog U1400',
  'Suspension',
  'Air Suspension',
  'Inspect and Test Air Suspension - Unimog U1400',
  '# Inspect and Test Air Suspension - Unimog U1400

## Overview
This procedure covers the inspection of the Air Suspension on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('da879522-0baa-4f9e-9985-0a975391ff85'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-AIR-ADJ-9m40oe',
  'Adjust and Calibrate Air Suspension - Unimog U1400',
  'Suspension',
  'Air Suspension',
  'Adjust and Calibrate Air Suspension - Unimog U1400',
  '# Adjust and Calibrate Air Suspension - Unimog U1400

## Overview
This procedure covers the adjustment of the Air Suspension on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c944be32-e925-4392-aeac-202eebd2a869'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-AIR-REP-0rgn',
  'Replace Air Suspension - Unimog U1400',
  'Suspension',
  'Air Suspension',
  'Replace Air Suspension - Unimog U1400',
  '# Replace Air Suspension - Unimog U1400

## Overview
This procedure covers the replacement of the Air Suspension on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7b4b80c8-fccb-449d-a63a-13a4b8132153'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-AIR-OVE-fscxie',
  'Overhaul and Rebuild Air Suspension - Unimog U1400',
  'Suspension',
  'Air Suspension',
  'Overhaul and Rebuild Air Suspension - Unimog U1400',
  '# Overhaul and Rebuild Air Suspension - Unimog U1400

## Overview
This procedure covers the overhaul of the Air Suspension on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('83be22ff-e759-4ec8-b75d-cc7a8a21446c'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SUS-AIR-TRO-rqm6zk',
  'Diagnose and Repair Air Suspension - Unimog U1400',
  'Suspension',
  'Air Suspension',
  'Diagnose and Repair Air Suspension - Unimog U1400',
  '# Diagnose and Repair Air Suspension - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Air Suspension on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Sus-001 for system overview
- See U1400-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('03a34ac4-6a51-441a-b099-e186918b54bf'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-BAT-REM-oi2ao',
  'Remove and Install Battery - Unimog U1400',
  'Electrical',
  'Battery',
  'Remove and Install Battery - Unimog U1400',
  '# Remove and Install Battery - Unimog U1400

## Overview
This procedure covers the removal of the Battery on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('231a3230-d7bb-4246-ac67-f4d026dd6cfd'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-BAT-INS-8q4pln',
  'Inspect and Test Battery - Unimog U1400',
  'Electrical',
  'Battery',
  'Inspect and Test Battery - Unimog U1400',
  '# Inspect and Test Battery - Unimog U1400

## Overview
This procedure covers the inspection of the Battery on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d546f0d2-5494-41ff-ab1d-6fec1c7aecb5'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-BAT-ADJ-whtohc',
  'Adjust and Calibrate Battery - Unimog U1400',
  'Electrical',
  'Battery',
  'Adjust and Calibrate Battery - Unimog U1400',
  '# Adjust and Calibrate Battery - Unimog U1400

## Overview
This procedure covers the adjustment of the Battery on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f6e9c66f-001e-47d0-9e4d-a6dd3256c83a'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-BAT-REP-2d36i',
  'Replace Battery - Unimog U1400',
  'Electrical',
  'Battery',
  'Replace Battery - Unimog U1400',
  '# Replace Battery - Unimog U1400

## Overview
This procedure covers the replacement of the Battery on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c2210a1e-062a-4d6a-a286-3e0c0a4c6552'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-BAT-OVE-99ztjm',
  'Overhaul and Rebuild Battery - Unimog U1400',
  'Electrical',
  'Battery',
  'Overhaul and Rebuild Battery - Unimog U1400',
  '# Overhaul and Rebuild Battery - Unimog U1400

## Overview
This procedure covers the overhaul of the Battery on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('91615694-61e8-4e3e-a05a-8075c69dfccb'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-BAT-TRO-jwym8o',
  'Diagnose and Repair Battery - Unimog U1400',
  'Electrical',
  'Battery',
  'Diagnose and Repair Battery - Unimog U1400',
  '# Diagnose and Repair Battery - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Battery on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0c4fd40c-2cf7-4599-8b3c-3525a25beabd'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-ALT-REM-mhw1je',
  'Remove and Install Alternator - Unimog U1400',
  'Electrical',
  'Alternator',
  'Remove and Install Alternator - Unimog U1400',
  '# Remove and Install Alternator - Unimog U1400

## Overview
This procedure covers the removal of the Alternator on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('87ad291e-1e5d-4cc9-999e-9b363c436d07'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-ALT-INS-rzjop8',
  'Inspect and Test Alternator - Unimog U1400',
  'Electrical',
  'Alternator',
  'Inspect and Test Alternator - Unimog U1400',
  '# Inspect and Test Alternator - Unimog U1400

## Overview
This procedure covers the inspection of the Alternator on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4933f0aa-a823-438a-ab2f-2ba7847a83b5'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-ALT-ADJ-2wcdki',
  'Adjust and Calibrate Alternator - Unimog U1400',
  'Electrical',
  'Alternator',
  'Adjust and Calibrate Alternator - Unimog U1400',
  '# Adjust and Calibrate Alternator - Unimog U1400

## Overview
This procedure covers the adjustment of the Alternator on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('661546ab-a396-4a4e-8d38-0edf7af162a1'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-ALT-REP-21ixkp',
  'Replace Alternator - Unimog U1400',
  'Electrical',
  'Alternator',
  'Replace Alternator - Unimog U1400',
  '# Replace Alternator - Unimog U1400

## Overview
This procedure covers the replacement of the Alternator on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0752b1dd-ee5d-48ce-a3de-6b98b77335e3'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-ALT-OVE-dnwhpf',
  'Overhaul and Rebuild Alternator - Unimog U1400',
  'Electrical',
  'Alternator',
  'Overhaul and Rebuild Alternator - Unimog U1400',
  '# Overhaul and Rebuild Alternator - Unimog U1400

## Overview
This procedure covers the overhaul of the Alternator on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('db21d400-7334-41cd-a6b7-eed8f74ff3f6'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-ALT-TRO-j9vmc',
  'Diagnose and Repair Alternator - Unimog U1400',
  'Electrical',
  'Alternator',
  'Diagnose and Repair Alternator - Unimog U1400',
  '# Diagnose and Repair Alternator - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Alternator on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b815ea05-f46d-4155-a813-4c11a117bea6'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-STA-REM-29sawm',
  'Remove and Install Starter - Unimog U1400',
  'Electrical',
  'Starter',
  'Remove and Install Starter - Unimog U1400',
  '# Remove and Install Starter - Unimog U1400

## Overview
This procedure covers the removal of the Starter on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('62e94f3c-69c1-46bf-ab39-debf535edfba'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-STA-INS-cxse6l',
  'Inspect and Test Starter - Unimog U1400',
  'Electrical',
  'Starter',
  'Inspect and Test Starter - Unimog U1400',
  '# Inspect and Test Starter - Unimog U1400

## Overview
This procedure covers the inspection of the Starter on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fba934a4-29a4-48af-8244-30d2b97db017'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-STA-ADJ-7tuoy',
  'Adjust and Calibrate Starter - Unimog U1400',
  'Electrical',
  'Starter',
  'Adjust and Calibrate Starter - Unimog U1400',
  '# Adjust and Calibrate Starter - Unimog U1400

## Overview
This procedure covers the adjustment of the Starter on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4e3596ad-faee-4e38-9973-3d59c80e6df1'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-STA-REP-d2kdv3',
  'Replace Starter - Unimog U1400',
  'Electrical',
  'Starter',
  'Replace Starter - Unimog U1400',
  '# Replace Starter - Unimog U1400

## Overview
This procedure covers the replacement of the Starter on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ac5d00ae-4978-4de2-9d51-a91995f3cb1d'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-STA-OVE-eexk5r',
  'Overhaul and Rebuild Starter - Unimog U1400',
  'Electrical',
  'Starter',
  'Overhaul and Rebuild Starter - Unimog U1400',
  '# Overhaul and Rebuild Starter - Unimog U1400

## Overview
This procedure covers the overhaul of the Starter on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5c2708fb-d122-4f4e-a1cb-dda665cc9d60'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-STA-TRO-l56yf',
  'Diagnose and Repair Starter - Unimog U1400',
  'Electrical',
  'Starter',
  'Diagnose and Repair Starter - Unimog U1400',
  '# Diagnose and Repair Starter - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Starter on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4da2b0c9-78e9-419b-b31f-ecab4bb57b18'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-LIG-REM-lm8jws',
  'Remove and Install Lighting - Unimog U1400',
  'Electrical',
  'Lighting',
  'Remove and Install Lighting - Unimog U1400',
  '# Remove and Install Lighting - Unimog U1400

## Overview
This procedure covers the removal of the Lighting on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9ea422fa-b1c1-47e9-9a8f-438a3483e688'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-LIG-INS-3mpsc',
  'Inspect and Test Lighting - Unimog U1400',
  'Electrical',
  'Lighting',
  'Inspect and Test Lighting - Unimog U1400',
  '# Inspect and Test Lighting - Unimog U1400

## Overview
This procedure covers the inspection of the Lighting on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c72b7fe5-1589-4cca-8103-aa4e78a15af9'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-LIG-ADJ-iuvyi',
  'Adjust and Calibrate Lighting - Unimog U1400',
  'Electrical',
  'Lighting',
  'Adjust and Calibrate Lighting - Unimog U1400',
  '# Adjust and Calibrate Lighting - Unimog U1400

## Overview
This procedure covers the adjustment of the Lighting on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1e04b5c1-c7c4-436a-aa5b-00802b6de114'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-LIG-REP-50nq8',
  'Replace Lighting - Unimog U1400',
  'Electrical',
  'Lighting',
  'Replace Lighting - Unimog U1400',
  '# Replace Lighting - Unimog U1400

## Overview
This procedure covers the replacement of the Lighting on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bef69dd9-0428-42e7-b79d-52733c72820a'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-LIG-OVE-80552u',
  'Overhaul and Rebuild Lighting - Unimog U1400',
  'Electrical',
  'Lighting',
  'Overhaul and Rebuild Lighting - Unimog U1400',
  '# Overhaul and Rebuild Lighting - Unimog U1400

## Overview
This procedure covers the overhaul of the Lighting on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8a5fb34a-183d-401d-b0aa-efecd247780a'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-LIG-TRO-rza1j',
  'Diagnose and Repair Lighting - Unimog U1400',
  'Electrical',
  'Lighting',
  'Diagnose and Repair Lighting - Unimog U1400',
  '# Diagnose and Repair Lighting - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Lighting on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('97e2f700-4590-4e1c-8157-3c84a079331d'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-CON-REM-vbu4ie',
  'Remove and Install Control Units - Unimog U1400',
  'Electrical',
  'Control Units',
  'Remove and Install Control Units - Unimog U1400',
  '# Remove and Install Control Units - Unimog U1400

## Overview
This procedure covers the removal of the Control Units on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b4ae88ab-b93f-4881-a2e0-07880441609d'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-CON-INS-ze5rxe',
  'Inspect and Test Control Units - Unimog U1400',
  'Electrical',
  'Control Units',
  'Inspect and Test Control Units - Unimog U1400',
  '# Inspect and Test Control Units - Unimog U1400

## Overview
This procedure covers the inspection of the Control Units on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('48d26d18-1d7e-4fe2-9c73-638fa0ab49c2'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-CON-ADJ-hca5al',
  'Adjust and Calibrate Control Units - Unimog U1400',
  'Electrical',
  'Control Units',
  'Adjust and Calibrate Control Units - Unimog U1400',
  '# Adjust and Calibrate Control Units - Unimog U1400

## Overview
This procedure covers the adjustment of the Control Units on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3965cefc-13a0-4d70-a6f6-b33723ceda33'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-CON-REP-2e3v6s',
  'Replace Control Units - Unimog U1400',
  'Electrical',
  'Control Units',
  'Replace Control Units - Unimog U1400',
  '# Replace Control Units - Unimog U1400

## Overview
This procedure covers the replacement of the Control Units on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2b8a41a7-0ccf-4194-9f56-0dcbb883d10f'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-CON-OVE-wy1kdh',
  'Overhaul and Rebuild Control Units - Unimog U1400',
  'Electrical',
  'Control Units',
  'Overhaul and Rebuild Control Units - Unimog U1400',
  '# Overhaul and Rebuild Control Units - Unimog U1400

## Overview
This procedure covers the overhaul of the Control Units on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6b0fdc7d-65b5-4cd8-9774-7496b6f80502'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-ELE-CON-TRO-5xls7',
  'Diagnose and Repair Control Units - Unimog U1400',
  'Electrical',
  'Control Units',
  'Diagnose and Repair Control Units - Unimog U1400',
  '# Diagnose and Repair Control Units - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Control Units on Unimog U1400 vehicles with OM366A engine.
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
- See U1400-Ele-001 for system overview
- See U1400-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('952b91c1-c666-4517-981c-654e55c1d047'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HYD-REM-xsd3zb',
  'Remove and Install Hydraulic Pump - Unimog U1400',
  'Hydraulics',
  'Hydraulic Pump',
  'Remove and Install Hydraulic Pump - Unimog U1400',
  '# Remove and Install Hydraulic Pump - Unimog U1400

## Overview
This procedure covers the removal of the Hydraulic Pump on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4c961c95-3367-4444-8b2e-420325baf0fe'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HYD-INS-9pzyk',
  'Inspect and Test Hydraulic Pump - Unimog U1400',
  'Hydraulics',
  'Hydraulic Pump',
  'Inspect and Test Hydraulic Pump - Unimog U1400',
  '# Inspect and Test Hydraulic Pump - Unimog U1400

## Overview
This procedure covers the inspection of the Hydraulic Pump on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a4c74f0f-20cf-48c1-a32b-56124adc65c7'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HYD-ADJ-29fouo',
  'Adjust and Calibrate Hydraulic Pump - Unimog U1400',
  'Hydraulics',
  'Hydraulic Pump',
  'Adjust and Calibrate Hydraulic Pump - Unimog U1400',
  '# Adjust and Calibrate Hydraulic Pump - Unimog U1400

## Overview
This procedure covers the adjustment of the Hydraulic Pump on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5a81e2ec-b79e-429e-ad2f-88200e749a32'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HYD-REP-i2ymb',
  'Replace Hydraulic Pump - Unimog U1400',
  'Hydraulics',
  'Hydraulic Pump',
  'Replace Hydraulic Pump - Unimog U1400',
  '# Replace Hydraulic Pump - Unimog U1400

## Overview
This procedure covers the replacement of the Hydraulic Pump on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1474c048-0321-47f3-b06c-bec55173da12'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HYD-OVE-39mvjv',
  'Overhaul and Rebuild Hydraulic Pump - Unimog U1400',
  'Hydraulics',
  'Hydraulic Pump',
  'Overhaul and Rebuild Hydraulic Pump - Unimog U1400',
  '# Overhaul and Rebuild Hydraulic Pump - Unimog U1400

## Overview
This procedure covers the overhaul of the Hydraulic Pump on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fba87077-3f85-4ee7-9613-0f70982161c4'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HYD-TRO-pk3h89',
  'Diagnose and Repair Hydraulic Pump - Unimog U1400',
  'Hydraulics',
  'Hydraulic Pump',
  'Diagnose and Repair Hydraulic Pump - Unimog U1400',
  '# Diagnose and Repair Hydraulic Pump - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Hydraulic Pump on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('db50889a-749e-446d-bacc-1ba65d49d6c9'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-VAL-REM-gj869r',
  'Remove and Install Valves - Unimog U1400',
  'Hydraulics',
  'Valves',
  'Remove and Install Valves - Unimog U1400',
  '# Remove and Install Valves - Unimog U1400

## Overview
This procedure covers the removal of the Valves on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('838a8be3-c090-495e-ab1e-4e3fe395c9fb'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-VAL-INS-u72h6n',
  'Inspect and Test Valves - Unimog U1400',
  'Hydraulics',
  'Valves',
  'Inspect and Test Valves - Unimog U1400',
  '# Inspect and Test Valves - Unimog U1400

## Overview
This procedure covers the inspection of the Valves on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('035612a5-fca8-4a70-9214-dadb577845ef'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-VAL-ADJ-djhp8m',
  'Adjust and Calibrate Valves - Unimog U1400',
  'Hydraulics',
  'Valves',
  'Adjust and Calibrate Valves - Unimog U1400',
  '# Adjust and Calibrate Valves - Unimog U1400

## Overview
This procedure covers the adjustment of the Valves on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e5367d15-8813-4910-8637-9cf61c7cfa81'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-VAL-REP-9lpw29',
  'Replace Valves - Unimog U1400',
  'Hydraulics',
  'Valves',
  'Replace Valves - Unimog U1400',
  '# Replace Valves - Unimog U1400

## Overview
This procedure covers the replacement of the Valves on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e88e0149-a769-41a6-b2c9-a0b1d4a29597'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-VAL-OVE-ps976v',
  'Overhaul and Rebuild Valves - Unimog U1400',
  'Hydraulics',
  'Valves',
  'Overhaul and Rebuild Valves - Unimog U1400',
  '# Overhaul and Rebuild Valves - Unimog U1400

## Overview
This procedure covers the overhaul of the Valves on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fe0cc727-ecd4-46cc-9239-58d8c2e1bccd'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-VAL-TRO-8mbmu',
  'Diagnose and Repair Valves - Unimog U1400',
  'Hydraulics',
  'Valves',
  'Diagnose and Repair Valves - Unimog U1400',
  '# Diagnose and Repair Valves - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Valves on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d1b61a35-b7b0-44fb-a5fc-2dd57253412c'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-CYL-REM-zk4emf',
  'Remove and Install Cylinders - Unimog U1400',
  'Hydraulics',
  'Cylinders',
  'Remove and Install Cylinders - Unimog U1400',
  '# Remove and Install Cylinders - Unimog U1400

## Overview
This procedure covers the removal of the Cylinders on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8fd56356-752f-42c4-b015-83bc068d67d4'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-CYL-INS-vypyvn',
  'Inspect and Test Cylinders - Unimog U1400',
  'Hydraulics',
  'Cylinders',
  'Inspect and Test Cylinders - Unimog U1400',
  '# Inspect and Test Cylinders - Unimog U1400

## Overview
This procedure covers the inspection of the Cylinders on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('83ff6e6e-31d9-4c4d-8445-025f1133069d'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-CYL-ADJ-3k4n7f',
  'Adjust and Calibrate Cylinders - Unimog U1400',
  'Hydraulics',
  'Cylinders',
  'Adjust and Calibrate Cylinders - Unimog U1400',
  '# Adjust and Calibrate Cylinders - Unimog U1400

## Overview
This procedure covers the adjustment of the Cylinders on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d10d40e4-5415-4b8b-865f-63377078a4da'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-CYL-REP-zk09mgc',
  'Replace Cylinders - Unimog U1400',
  'Hydraulics',
  'Cylinders',
  'Replace Cylinders - Unimog U1400',
  '# Replace Cylinders - Unimog U1400

## Overview
This procedure covers the replacement of the Cylinders on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('528aed42-6786-406f-a679-4d846112789f'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-CYL-OVE-1g5o4h',
  'Overhaul and Rebuild Cylinders - Unimog U1400',
  'Hydraulics',
  'Cylinders',
  'Overhaul and Rebuild Cylinders - Unimog U1400',
  '# Overhaul and Rebuild Cylinders - Unimog U1400

## Overview
This procedure covers the overhaul of the Cylinders on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('93f99b17-8af8-4496-8ed0-f3d6d00db0f8'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-CYL-TRO-kr371o',
  'Diagnose and Repair Cylinders - Unimog U1400',
  'Hydraulics',
  'Cylinders',
  'Diagnose and Repair Cylinders - Unimog U1400',
  '# Diagnose and Repair Cylinders - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Cylinders on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('86da8221-cc40-4039-8844-f514c2d1ae5d'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HOS-REM-nlyfxf',
  'Remove and Install Hoses - Unimog U1400',
  'Hydraulics',
  'Hoses',
  'Remove and Install Hoses - Unimog U1400',
  '# Remove and Install Hoses - Unimog U1400

## Overview
This procedure covers the removal of the Hoses on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6ce81dcd-6b77-47d0-9c23-155880fa3a3b'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HOS-INS-el78io',
  'Inspect and Test Hoses - Unimog U1400',
  'Hydraulics',
  'Hoses',
  'Inspect and Test Hoses - Unimog U1400',
  '# Inspect and Test Hoses - Unimog U1400

## Overview
This procedure covers the inspection of the Hoses on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('12945453-acad-4c96-a6ba-918c9da183ed'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HOS-ADJ-y5jk7i',
  'Adjust and Calibrate Hoses - Unimog U1400',
  'Hydraulics',
  'Hoses',
  'Adjust and Calibrate Hoses - Unimog U1400',
  '# Adjust and Calibrate Hoses - Unimog U1400

## Overview
This procedure covers the adjustment of the Hoses on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b70d0aa8-7396-4d41-8675-814f907200af'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HOS-REP-v740v',
  'Replace Hoses - Unimog U1400',
  'Hydraulics',
  'Hoses',
  'Replace Hoses - Unimog U1400',
  '# Replace Hoses - Unimog U1400

## Overview
This procedure covers the replacement of the Hoses on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7eca7f55-ac58-4a6d-aed2-bbeea23cfe32'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HOS-OVE-7tva6',
  'Overhaul and Rebuild Hoses - Unimog U1400',
  'Hydraulics',
  'Hoses',
  'Overhaul and Rebuild Hoses - Unimog U1400',
  '# Overhaul and Rebuild Hoses - Unimog U1400

## Overview
This procedure covers the overhaul of the Hoses on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('73b9eddd-0141-46be-af0d-2f33327d583d'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-HOS-TRO-yeoc9r',
  'Diagnose and Repair Hoses - Unimog U1400',
  'Hydraulics',
  'Hoses',
  'Diagnose and Repair Hoses - Unimog U1400',
  '# Diagnose and Repair Hoses - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Hoses on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1d3a52cf-beb8-4095-abaf-377fb9aae714'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-FIL-REM-io5n9a',
  'Remove and Install Filters - Unimog U1400',
  'Hydraulics',
  'Filters',
  'Remove and Install Filters - Unimog U1400',
  '# Remove and Install Filters - Unimog U1400

## Overview
This procedure covers the removal of the Filters on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e8564e4d-e5d7-4526-aea2-7f8f30f5e6f4'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-FIL-INS-hrzkht',
  'Inspect and Test Filters - Unimog U1400',
  'Hydraulics',
  'Filters',
  'Inspect and Test Filters - Unimog U1400',
  '# Inspect and Test Filters - Unimog U1400

## Overview
This procedure covers the inspection of the Filters on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
2. Apply parking brake
3. Disconnect battery negative terminal
4. Depressurize hydraulic system
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
- Working pressure: 200 bar
- Operating temperature: -40°C to +85°C
- Service interval: 10,000 km or annually

## Related Procedures
- See U1400-Hyd-001 for system overview
- See U1400-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
);

-- Verify this chunk
SELECT COUNT(*) as procedures_in_db FROM wis_procedures;
