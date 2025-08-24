-- WIS Procedures Import - Chunk 26
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 26 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('77a6fe78-ce56-4a03-beb4-c822926f68b2'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-STE-4-W-OVE-rtgaz',
  'Overhaul and Rebuild 4-Wheel Steering - Unimog U3000',
  'Steering',
  '4-Wheel Steering',
  'Overhaul and Rebuild 4-Wheel Steering - Unimog U3000',
  '# Overhaul and Rebuild 4-Wheel Steering - Unimog U3000

## Overview
This procedure covers the overhaul of the 4-Wheel Steering on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ste-001 for system overview
- See U3000-Ste-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f4934f0e-169d-46ac-a9b5-026723363d73'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-STE-4-W-TRO-kcqyf',
  'Diagnose and Repair 4-Wheel Steering - Unimog U3000',
  'Steering',
  '4-Wheel Steering',
  'Diagnose and Repair 4-Wheel Steering - Unimog U3000',
  '# Diagnose and Repair 4-Wheel Steering - Unimog U3000

## Overview
This procedure covers the troubleshooting of the 4-Wheel Steering on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ste-001 for system overview
- See U3000-Ste-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d853e6c9-9540-4f8e-8d56-65cc0bfd4290'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SPR-REM-aebgz',
  'Remove and Install Springs - Unimog U3000',
  'Suspension',
  'Springs',
  'Remove and Install Springs - Unimog U3000',
  '# Remove and Install Springs - Unimog U3000

## Overview
This procedure covers the removal of the Springs on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6c7e670d-b380-41b0-8eb7-4023ca34dc19'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SPR-INS-sft2vd',
  'Inspect and Test Springs - Unimog U3000',
  'Suspension',
  'Springs',
  'Inspect and Test Springs - Unimog U3000',
  '# Inspect and Test Springs - Unimog U3000

## Overview
This procedure covers the inspection of the Springs on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2719a1d5-8fbd-4c1f-8ecf-50faf49c9f86'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SPR-ADJ-d6hne',
  'Adjust and Calibrate Springs - Unimog U3000',
  'Suspension',
  'Springs',
  'Adjust and Calibrate Springs - Unimog U3000',
  '# Adjust and Calibrate Springs - Unimog U3000

## Overview
This procedure covers the adjustment of the Springs on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5c61bd12-b8eb-478f-ab73-157d893651ee'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SPR-REP-i1047s',
  'Replace Springs - Unimog U3000',
  'Suspension',
  'Springs',
  'Replace Springs - Unimog U3000',
  '# Replace Springs - Unimog U3000

## Overview
This procedure covers the replacement of the Springs on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b11f84b8-a044-4975-b5b9-a09ecb59b30c'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SPR-OVE-vjablq',
  'Overhaul and Rebuild Springs - Unimog U3000',
  'Suspension',
  'Springs',
  'Overhaul and Rebuild Springs - Unimog U3000',
  '# Overhaul and Rebuild Springs - Unimog U3000

## Overview
This procedure covers the overhaul of the Springs on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bf7537ce-0cd9-492d-9d8c-a6c8193478b9'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SPR-TRO-e7er4i',
  'Diagnose and Repair Springs - Unimog U3000',
  'Suspension',
  'Springs',
  'Diagnose and Repair Springs - Unimog U3000',
  '# Diagnose and Repair Springs - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Springs on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bd4df518-9b4e-4dda-be49-7428b3be6d87'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SHO-REM-3qbyfi',
  'Remove and Install Shock Absorbers - Unimog U3000',
  'Suspension',
  'Shock Absorbers',
  'Remove and Install Shock Absorbers - Unimog U3000',
  '# Remove and Install Shock Absorbers - Unimog U3000

## Overview
This procedure covers the removal of the Shock Absorbers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('dcbe74ba-2083-45c1-83d2-35656e39a3a6'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SHO-INS-i5ey1a',
  'Inspect and Test Shock Absorbers - Unimog U3000',
  'Suspension',
  'Shock Absorbers',
  'Inspect and Test Shock Absorbers - Unimog U3000',
  '# Inspect and Test Shock Absorbers - Unimog U3000

## Overview
This procedure covers the inspection of the Shock Absorbers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('085f6c04-0ffa-4fc3-8001-d3069ec36b84'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SHO-ADJ-shz9d',
  'Adjust and Calibrate Shock Absorbers - Unimog U3000',
  'Suspension',
  'Shock Absorbers',
  'Adjust and Calibrate Shock Absorbers - Unimog U3000',
  '# Adjust and Calibrate Shock Absorbers - Unimog U3000

## Overview
This procedure covers the adjustment of the Shock Absorbers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1211e6ce-d2ef-466b-a0a3-9f2a9e005ec4'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SHO-REP-ivpc2',
  'Replace Shock Absorbers - Unimog U3000',
  'Suspension',
  'Shock Absorbers',
  'Replace Shock Absorbers - Unimog U3000',
  '# Replace Shock Absorbers - Unimog U3000

## Overview
This procedure covers the replacement of the Shock Absorbers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c8bd1d08-4565-4948-9cc5-93d4f731db83'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SHO-OVE-5jzfco',
  'Overhaul and Rebuild Shock Absorbers - Unimog U3000',
  'Suspension',
  'Shock Absorbers',
  'Overhaul and Rebuild Shock Absorbers - Unimog U3000',
  '# Overhaul and Rebuild Shock Absorbers - Unimog U3000

## Overview
This procedure covers the overhaul of the Shock Absorbers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('881d0eec-ef0a-4d57-a753-d363ad2de618'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-SHO-TRO-j069q',
  'Diagnose and Repair Shock Absorbers - Unimog U3000',
  'Suspension',
  'Shock Absorbers',
  'Diagnose and Repair Shock Absorbers - Unimog U3000',
  '# Diagnose and Repair Shock Absorbers - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Shock Absorbers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cc9b812a-6721-4788-be0e-1cf3bf912344'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-STA-REM-8ps2vb',
  'Remove and Install Stabilizers - Unimog U3000',
  'Suspension',
  'Stabilizers',
  'Remove and Install Stabilizers - Unimog U3000',
  '# Remove and Install Stabilizers - Unimog U3000

## Overview
This procedure covers the removal of the Stabilizers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ad96941d-c694-4872-8a55-e951cb92d1d7'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-STA-INS-28oxiq',
  'Inspect and Test Stabilizers - Unimog U3000',
  'Suspension',
  'Stabilizers',
  'Inspect and Test Stabilizers - Unimog U3000',
  '# Inspect and Test Stabilizers - Unimog U3000

## Overview
This procedure covers the inspection of the Stabilizers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c5000de5-4927-446c-a6b0-4e4a62f37a9c'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-STA-ADJ-7ynljy',
  'Adjust and Calibrate Stabilizers - Unimog U3000',
  'Suspension',
  'Stabilizers',
  'Adjust and Calibrate Stabilizers - Unimog U3000',
  '# Adjust and Calibrate Stabilizers - Unimog U3000

## Overview
This procedure covers the adjustment of the Stabilizers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9e4bcfac-8e41-477f-8b7a-ca632e7ed12c'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-STA-REP-dijtg8',
  'Replace Stabilizers - Unimog U3000',
  'Suspension',
  'Stabilizers',
  'Replace Stabilizers - Unimog U3000',
  '# Replace Stabilizers - Unimog U3000

## Overview
This procedure covers the replacement of the Stabilizers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e3f47285-fa77-4c86-975a-f93797d91fdb'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-STA-OVE-1zcczk',
  'Overhaul and Rebuild Stabilizers - Unimog U3000',
  'Suspension',
  'Stabilizers',
  'Overhaul and Rebuild Stabilizers - Unimog U3000',
  '# Overhaul and Rebuild Stabilizers - Unimog U3000

## Overview
This procedure covers the overhaul of the Stabilizers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4cfbf4bc-a326-47a3-8728-508334284b18'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-STA-TRO-89hcf',
  'Diagnose and Repair Stabilizers - Unimog U3000',
  'Suspension',
  'Stabilizers',
  'Diagnose and Repair Stabilizers - Unimog U3000',
  '# Diagnose and Repair Stabilizers - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Stabilizers on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ac2f11d3-e4ac-41c9-9415-6ad88ca5b2b2'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-AIR-REM-p8cfaq',
  'Remove and Install Air Suspension - Unimog U3000',
  'Suspension',
  'Air Suspension',
  'Remove and Install Air Suspension - Unimog U3000',
  '# Remove and Install Air Suspension - Unimog U3000

## Overview
This procedure covers the removal of the Air Suspension on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('51519de3-9d12-4ac9-b93c-6fd124fc8652'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-AIR-INS-0gyxcr',
  'Inspect and Test Air Suspension - Unimog U3000',
  'Suspension',
  'Air Suspension',
  'Inspect and Test Air Suspension - Unimog U3000',
  '# Inspect and Test Air Suspension - Unimog U3000

## Overview
This procedure covers the inspection of the Air Suspension on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('48c9cb94-fe5e-407f-ad30-2ecd022e9b72'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-AIR-ADJ-1v6r7',
  'Adjust and Calibrate Air Suspension - Unimog U3000',
  'Suspension',
  'Air Suspension',
  'Adjust and Calibrate Air Suspension - Unimog U3000',
  '# Adjust and Calibrate Air Suspension - Unimog U3000

## Overview
This procedure covers the adjustment of the Air Suspension on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fbf0dbef-505d-4c24-b3a6-3634bcdf06ca'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-AIR-REP-hycs3r',
  'Replace Air Suspension - Unimog U3000',
  'Suspension',
  'Air Suspension',
  'Replace Air Suspension - Unimog U3000',
  '# Replace Air Suspension - Unimog U3000

## Overview
This procedure covers the replacement of the Air Suspension on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6d66f8a8-e7c2-4a1a-b135-7c8d3c8d8b54'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-AIR-OVE-r2al3x',
  'Overhaul and Rebuild Air Suspension - Unimog U3000',
  'Suspension',
  'Air Suspension',
  'Overhaul and Rebuild Air Suspension - Unimog U3000',
  '# Overhaul and Rebuild Air Suspension - Unimog U3000

## Overview
This procedure covers the overhaul of the Air Suspension on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ed8779cf-b335-484b-8e2e-43281a947e43'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-SUS-AIR-TRO-1opsb',
  'Diagnose and Repair Air Suspension - Unimog U3000',
  'Suspension',
  'Air Suspension',
  'Diagnose and Repair Air Suspension - Unimog U3000',
  '# Diagnose and Repair Air Suspension - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Air Suspension on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Sus-001 for system overview
- See U3000-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a137afcd-9418-478c-81f9-509fe44389d3'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-BAT-REM-via589',
  'Remove and Install Battery - Unimog U3000',
  'Electrical',
  'Battery',
  'Remove and Install Battery - Unimog U3000',
  '# Remove and Install Battery - Unimog U3000

## Overview
This procedure covers the removal of the Battery on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d463f2f4-4c90-4471-bdd2-530b48a6b7ce'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-BAT-INS-0k60zh',
  'Inspect and Test Battery - Unimog U3000',
  'Electrical',
  'Battery',
  'Inspect and Test Battery - Unimog U3000',
  '# Inspect and Test Battery - Unimog U3000

## Overview
This procedure covers the inspection of the Battery on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0e5a5e32-6144-4d3d-977d-0e467a78c2d7'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-BAT-ADJ-75k4o',
  'Adjust and Calibrate Battery - Unimog U3000',
  'Electrical',
  'Battery',
  'Adjust and Calibrate Battery - Unimog U3000',
  '# Adjust and Calibrate Battery - Unimog U3000

## Overview
This procedure covers the adjustment of the Battery on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('33fb90c7-1fde-413d-9a9e-0586f59e3909'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-BAT-REP-g64gl2',
  'Replace Battery - Unimog U3000',
  'Electrical',
  'Battery',
  'Replace Battery - Unimog U3000',
  '# Replace Battery - Unimog U3000

## Overview
This procedure covers the replacement of the Battery on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7afdb061-02c7-44a5-ae08-a3da1084790e'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-BAT-OVE-ayokz',
  'Overhaul and Rebuild Battery - Unimog U3000',
  'Electrical',
  'Battery',
  'Overhaul and Rebuild Battery - Unimog U3000',
  '# Overhaul and Rebuild Battery - Unimog U3000

## Overview
This procedure covers the overhaul of the Battery on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('06b45b74-ca86-489c-bb85-4f587b5e9aef'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-BAT-TRO-sz45ml',
  'Diagnose and Repair Battery - Unimog U3000',
  'Electrical',
  'Battery',
  'Diagnose and Repair Battery - Unimog U3000',
  '# Diagnose and Repair Battery - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Battery on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5ad06fa3-37b3-4391-941e-b461447a2aff'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-ALT-REM-8zqjv',
  'Remove and Install Alternator - Unimog U3000',
  'Electrical',
  'Alternator',
  'Remove and Install Alternator - Unimog U3000',
  '# Remove and Install Alternator - Unimog U3000

## Overview
This procedure covers the removal of the Alternator on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('334b54bf-d6a0-431d-9f05-6fe5a9f8f0e4'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-ALT-INS-jajv6zc',
  'Inspect and Test Alternator - Unimog U3000',
  'Electrical',
  'Alternator',
  'Inspect and Test Alternator - Unimog U3000',
  '# Inspect and Test Alternator - Unimog U3000

## Overview
This procedure covers the inspection of the Alternator on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b7be0b24-3984-44f0-9e65-621d9378980e'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-ALT-ADJ-93gpka',
  'Adjust and Calibrate Alternator - Unimog U3000',
  'Electrical',
  'Alternator',
  'Adjust and Calibrate Alternator - Unimog U3000',
  '# Adjust and Calibrate Alternator - Unimog U3000

## Overview
This procedure covers the adjustment of the Alternator on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f9eb5816-190c-4998-adc2-3be3d50e1b00'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-ALT-REP-zf33k',
  'Replace Alternator - Unimog U3000',
  'Electrical',
  'Alternator',
  'Replace Alternator - Unimog U3000',
  '# Replace Alternator - Unimog U3000

## Overview
This procedure covers the replacement of the Alternator on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('63c39cc9-0e79-4ba3-a642-fcf645bf0f96'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-ALT-OVE-bvzsxf',
  'Overhaul and Rebuild Alternator - Unimog U3000',
  'Electrical',
  'Alternator',
  'Overhaul and Rebuild Alternator - Unimog U3000',
  '# Overhaul and Rebuild Alternator - Unimog U3000

## Overview
This procedure covers the overhaul of the Alternator on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8465d959-2499-41bc-845f-a045caeb1222'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-ALT-TRO-pr58k',
  'Diagnose and Repair Alternator - Unimog U3000',
  'Electrical',
  'Alternator',
  'Diagnose and Repair Alternator - Unimog U3000',
  '# Diagnose and Repair Alternator - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Alternator on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('adc60285-5f18-4e20-9b3a-d12e4a834710'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-STA-REM-jtj1yf',
  'Remove and Install Starter - Unimog U3000',
  'Electrical',
  'Starter',
  'Remove and Install Starter - Unimog U3000',
  '# Remove and Install Starter - Unimog U3000

## Overview
This procedure covers the removal of the Starter on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('24a12342-355f-46ed-b89e-6339e2eecb7c'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-STA-INS-9flq9k',
  'Inspect and Test Starter - Unimog U3000',
  'Electrical',
  'Starter',
  'Inspect and Test Starter - Unimog U3000',
  '# Inspect and Test Starter - Unimog U3000

## Overview
This procedure covers the inspection of the Starter on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('29b06b60-3aa1-43d4-be5d-4e76884f233b'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-STA-ADJ-czh9qph',
  'Adjust and Calibrate Starter - Unimog U3000',
  'Electrical',
  'Starter',
  'Adjust and Calibrate Starter - Unimog U3000',
  '# Adjust and Calibrate Starter - Unimog U3000

## Overview
This procedure covers the adjustment of the Starter on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1fedf3e5-e210-4320-8d42-71c94617dba9'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-STA-REP-tiea7b',
  'Replace Starter - Unimog U3000',
  'Electrical',
  'Starter',
  'Replace Starter - Unimog U3000',
  '# Replace Starter - Unimog U3000

## Overview
This procedure covers the replacement of the Starter on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('25c91fc8-997f-453d-9021-b0932182bc7c'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-STA-OVE-14zgy',
  'Overhaul and Rebuild Starter - Unimog U3000',
  'Electrical',
  'Starter',
  'Overhaul and Rebuild Starter - Unimog U3000',
  '# Overhaul and Rebuild Starter - Unimog U3000

## Overview
This procedure covers the overhaul of the Starter on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('eba81a7f-b754-4b1c-998f-b53ed4cc5076'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-STA-TRO-t71g3k',
  'Diagnose and Repair Starter - Unimog U3000',
  'Electrical',
  'Starter',
  'Diagnose and Repair Starter - Unimog U3000',
  '# Diagnose and Repair Starter - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Starter on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('36980ee1-578e-467e-85a4-2bbf9af330d6'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-LIG-REM-k4i2na',
  'Remove and Install Lighting - Unimog U3000',
  'Electrical',
  'Lighting',
  'Remove and Install Lighting - Unimog U3000',
  '# Remove and Install Lighting - Unimog U3000

## Overview
This procedure covers the removal of the Lighting on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0f3c8077-18ad-4706-8973-662b9ebe870b'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-LIG-INS-lif08n',
  'Inspect and Test Lighting - Unimog U3000',
  'Electrical',
  'Lighting',
  'Inspect and Test Lighting - Unimog U3000',
  '# Inspect and Test Lighting - Unimog U3000

## Overview
This procedure covers the inspection of the Lighting on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c55b768-de73-46f2-b62f-d8b0dbf4f70d'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-LIG-ADJ-9n4687',
  'Adjust and Calibrate Lighting - Unimog U3000',
  'Electrical',
  'Lighting',
  'Adjust and Calibrate Lighting - Unimog U3000',
  '# Adjust and Calibrate Lighting - Unimog U3000

## Overview
This procedure covers the adjustment of the Lighting on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('60b88b26-d204-4b6b-bd82-9cbf5f30a21f'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-LIG-REP-gty6x',
  'Replace Lighting - Unimog U3000',
  'Electrical',
  'Lighting',
  'Replace Lighting - Unimog U3000',
  '# Replace Lighting - Unimog U3000

## Overview
This procedure covers the replacement of the Lighting on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('86e5c94c-5b8c-4b04-a490-f5461ece001d'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-LIG-OVE-3n8poq',
  'Overhaul and Rebuild Lighting - Unimog U3000',
  'Electrical',
  'Lighting',
  'Overhaul and Rebuild Lighting - Unimog U3000',
  '# Overhaul and Rebuild Lighting - Unimog U3000

## Overview
This procedure covers the overhaul of the Lighting on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2d73cd8d-107f-41db-bf38-a512d66b3043'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-LIG-TRO-1k66dp',
  'Diagnose and Repair Lighting - Unimog U3000',
  'Electrical',
  'Lighting',
  'Diagnose and Repair Lighting - Unimog U3000',
  '# Diagnose and Repair Lighting - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Lighting on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a369e582-6805-4738-bc21-7e255dce7354'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-CON-REM-xwhq9w',
  'Remove and Install Control Units - Unimog U3000',
  'Electrical',
  'Control Units',
  'Remove and Install Control Units - Unimog U3000',
  '# Remove and Install Control Units - Unimog U3000

## Overview
This procedure covers the removal of the Control Units on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1bd1f01d-ef45-4726-af57-9f91e348e3ad'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-CON-INS-g68t8v',
  'Inspect and Test Control Units - Unimog U3000',
  'Electrical',
  'Control Units',
  'Inspect and Test Control Units - Unimog U3000',
  '# Inspect and Test Control Units - Unimog U3000

## Overview
This procedure covers the inspection of the Control Units on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e02823a2-96ff-4714-8821-32bcccbd10cf'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-CON-ADJ-2xzrk5',
  'Adjust and Calibrate Control Units - Unimog U3000',
  'Electrical',
  'Control Units',
  'Adjust and Calibrate Control Units - Unimog U3000',
  '# Adjust and Calibrate Control Units - Unimog U3000

## Overview
This procedure covers the adjustment of the Control Units on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('28cad7f5-1114-41bf-957b-4e44c7bdc298'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-CON-REP-734dq',
  'Replace Control Units - Unimog U3000',
  'Electrical',
  'Control Units',
  'Replace Control Units - Unimog U3000',
  '# Replace Control Units - Unimog U3000

## Overview
This procedure covers the replacement of the Control Units on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('dc3e3b9d-906d-4d3b-b055-c3c9d9bf2a17'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-CON-OVE-0r2atl',
  'Overhaul and Rebuild Control Units - Unimog U3000',
  'Electrical',
  'Control Units',
  'Overhaul and Rebuild Control Units - Unimog U3000',
  '# Overhaul and Rebuild Control Units - Unimog U3000

## Overview
This procedure covers the overhaul of the Control Units on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('703772a3-c8b9-4f8f-86c8-5a20dd04219b'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ELE-CON-TRO-syszdj',
  'Diagnose and Repair Control Units - Unimog U3000',
  'Electrical',
  'Control Units',
  'Diagnose and Repair Control Units - Unimog U3000',
  '# Diagnose and Repair Control Units - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Control Units on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Ele-001 for system overview
- See U3000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('affdb6f0-b3a5-4ebd-921f-b80f902592aa'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HYD-REM-x6g8r',
  'Remove and Install Hydraulic Pump - Unimog U3000',
  'Hydraulics',
  'Hydraulic Pump',
  'Remove and Install Hydraulic Pump - Unimog U3000',
  '# Remove and Install Hydraulic Pump - Unimog U3000

## Overview
This procedure covers the removal of the Hydraulic Pump on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0ab966c7-b37c-4d69-ab1e-35b6728f6dd4'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HYD-INS-vf2mgo',
  'Inspect and Test Hydraulic Pump - Unimog U3000',
  'Hydraulics',
  'Hydraulic Pump',
  'Inspect and Test Hydraulic Pump - Unimog U3000',
  '# Inspect and Test Hydraulic Pump - Unimog U3000

## Overview
This procedure covers the inspection of the Hydraulic Pump on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4fb671e9-65fd-47b9-b523-76ad327b0c22'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HYD-ADJ-d8erbc',
  'Adjust and Calibrate Hydraulic Pump - Unimog U3000',
  'Hydraulics',
  'Hydraulic Pump',
  'Adjust and Calibrate Hydraulic Pump - Unimog U3000',
  '# Adjust and Calibrate Hydraulic Pump - Unimog U3000

## Overview
This procedure covers the adjustment of the Hydraulic Pump on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c9399580-1a21-4f36-a5a3-b66e5207d276'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HYD-REP-qrjxkl',
  'Replace Hydraulic Pump - Unimog U3000',
  'Hydraulics',
  'Hydraulic Pump',
  'Replace Hydraulic Pump - Unimog U3000',
  '# Replace Hydraulic Pump - Unimog U3000

## Overview
This procedure covers the replacement of the Hydraulic Pump on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c8f2060-4e29-4f25-8406-82bbad46b22f'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HYD-OVE-ra7e9e',
  'Overhaul and Rebuild Hydraulic Pump - Unimog U3000',
  'Hydraulics',
  'Hydraulic Pump',
  'Overhaul and Rebuild Hydraulic Pump - Unimog U3000',
  '# Overhaul and Rebuild Hydraulic Pump - Unimog U3000

## Overview
This procedure covers the overhaul of the Hydraulic Pump on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('701f4285-a0c4-4bfc-b0f4-4915932eb212'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HYD-TRO-bab09j',
  'Diagnose and Repair Hydraulic Pump - Unimog U3000',
  'Hydraulics',
  'Hydraulic Pump',
  'Diagnose and Repair Hydraulic Pump - Unimog U3000',
  '# Diagnose and Repair Hydraulic Pump - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Hydraulic Pump on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('dcaf2a19-3592-4a70-906d-9baf046f966f'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-VAL-REM-a4ljhw',
  'Remove and Install Valves - Unimog U3000',
  'Hydraulics',
  'Valves',
  'Remove and Install Valves - Unimog U3000',
  '# Remove and Install Valves - Unimog U3000

## Overview
This procedure covers the removal of the Valves on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('95d895ba-ae7f-4609-ab1f-4ffafb9535fb'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-VAL-INS-7vi8kq',
  'Inspect and Test Valves - Unimog U3000',
  'Hydraulics',
  'Valves',
  'Inspect and Test Valves - Unimog U3000',
  '# Inspect and Test Valves - Unimog U3000

## Overview
This procedure covers the inspection of the Valves on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b8b9a306-d899-4e1a-86cc-c5949c5159a3'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-VAL-ADJ-qdjuvq',
  'Adjust and Calibrate Valves - Unimog U3000',
  'Hydraulics',
  'Valves',
  'Adjust and Calibrate Valves - Unimog U3000',
  '# Adjust and Calibrate Valves - Unimog U3000

## Overview
This procedure covers the adjustment of the Valves on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('690a85a9-288d-44d6-80e6-33728ebf9099'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-VAL-REP-lcg7j8',
  'Replace Valves - Unimog U3000',
  'Hydraulics',
  'Valves',
  'Replace Valves - Unimog U3000',
  '# Replace Valves - Unimog U3000

## Overview
This procedure covers the replacement of the Valves on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cf3c9372-3709-407d-93d3-7bf2148f30cb'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-VAL-OVE-jl3g3p',
  'Overhaul and Rebuild Valves - Unimog U3000',
  'Hydraulics',
  'Valves',
  'Overhaul and Rebuild Valves - Unimog U3000',
  '# Overhaul and Rebuild Valves - Unimog U3000

## Overview
This procedure covers the overhaul of the Valves on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a45a8fec-d970-4fff-b1f3-9954ee770c30'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-VAL-TRO-cxw83',
  'Diagnose and Repair Valves - Unimog U3000',
  'Hydraulics',
  'Valves',
  'Diagnose and Repair Valves - Unimog U3000',
  '# Diagnose and Repair Valves - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Valves on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('82b92145-86e4-4c8b-a74b-88ce8e725513'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-CYL-REM-0ayej',
  'Remove and Install Cylinders - Unimog U3000',
  'Hydraulics',
  'Cylinders',
  'Remove and Install Cylinders - Unimog U3000',
  '# Remove and Install Cylinders - Unimog U3000

## Overview
This procedure covers the removal of the Cylinders on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('90acae79-13b5-499a-ad69-53199963ff10'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-CYL-INS-43u0w',
  'Inspect and Test Cylinders - Unimog U3000',
  'Hydraulics',
  'Cylinders',
  'Inspect and Test Cylinders - Unimog U3000',
  '# Inspect and Test Cylinders - Unimog U3000

## Overview
This procedure covers the inspection of the Cylinders on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e9f5504b-356f-4a8f-8ad4-d343bacdbef8'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-CYL-ADJ-ojieqd',
  'Adjust and Calibrate Cylinders - Unimog U3000',
  'Hydraulics',
  'Cylinders',
  'Adjust and Calibrate Cylinders - Unimog U3000',
  '# Adjust and Calibrate Cylinders - Unimog U3000

## Overview
This procedure covers the adjustment of the Cylinders on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a477f5ea-e1e8-4992-9ddb-f4da02be7dc9'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-CYL-REP-9qoxrp',
  'Replace Cylinders - Unimog U3000',
  'Hydraulics',
  'Cylinders',
  'Replace Cylinders - Unimog U3000',
  '# Replace Cylinders - Unimog U3000

## Overview
This procedure covers the replacement of the Cylinders on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8eac5aff-6249-4aa7-8775-f8c1d10f2713'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-CYL-OVE-op69v',
  'Overhaul and Rebuild Cylinders - Unimog U3000',
  'Hydraulics',
  'Cylinders',
  'Overhaul and Rebuild Cylinders - Unimog U3000',
  '# Overhaul and Rebuild Cylinders - Unimog U3000

## Overview
This procedure covers the overhaul of the Cylinders on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('508d3c0f-a12e-4542-8ad2-d8c4fbcf9754'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-CYL-TRO-eegtpg',
  'Diagnose and Repair Cylinders - Unimog U3000',
  'Hydraulics',
  'Cylinders',
  'Diagnose and Repair Cylinders - Unimog U3000',
  '# Diagnose and Repair Cylinders - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Cylinders on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9674cf43-3e58-4f2f-81f2-21b3a07121bc'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HOS-REM-qdriet',
  'Remove and Install Hoses - Unimog U3000',
  'Hydraulics',
  'Hoses',
  'Remove and Install Hoses - Unimog U3000',
  '# Remove and Install Hoses - Unimog U3000

## Overview
This procedure covers the removal of the Hoses on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('db8b30b7-f0ac-4264-ae60-cfa3aa51fd5b'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HOS-INS-tm7su',
  'Inspect and Test Hoses - Unimog U3000',
  'Hydraulics',
  'Hoses',
  'Inspect and Test Hoses - Unimog U3000',
  '# Inspect and Test Hoses - Unimog U3000

## Overview
This procedure covers the inspection of the Hoses on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ee627320-da47-476f-8b83-d31ba8d5bb0e'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HOS-ADJ-vt7jj',
  'Adjust and Calibrate Hoses - Unimog U3000',
  'Hydraulics',
  'Hoses',
  'Adjust and Calibrate Hoses - Unimog U3000',
  '# Adjust and Calibrate Hoses - Unimog U3000

## Overview
This procedure covers the adjustment of the Hoses on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e585cb12-f14f-45e3-8ecd-24c1269c1518'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HOS-REP-grzftp',
  'Replace Hoses - Unimog U3000',
  'Hydraulics',
  'Hoses',
  'Replace Hoses - Unimog U3000',
  '# Replace Hoses - Unimog U3000

## Overview
This procedure covers the replacement of the Hoses on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fb7734d1-6cd5-43fc-b359-4b09802556b1'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HOS-OVE-fpvt25',
  'Overhaul and Rebuild Hoses - Unimog U3000',
  'Hydraulics',
  'Hoses',
  'Overhaul and Rebuild Hoses - Unimog U3000',
  '# Overhaul and Rebuild Hoses - Unimog U3000

## Overview
This procedure covers the overhaul of the Hoses on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f8f4d2b4-d377-47ab-98af-bece91141a1a'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-HOS-TRO-uwowlv',
  'Diagnose and Repair Hoses - Unimog U3000',
  'Hydraulics',
  'Hoses',
  'Diagnose and Repair Hoses - Unimog U3000',
  '# Diagnose and Repair Hoses - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Hoses on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9daaede0-a637-4f81-b7be-1943a2ea67fd'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-FIL-REM-xrc7yk',
  'Remove and Install Filters - Unimog U3000',
  'Hydraulics',
  'Filters',
  'Remove and Install Filters - Unimog U3000',
  '# Remove and Install Filters - Unimog U3000

## Overview
This procedure covers the removal of the Filters on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('54b1c53b-10b2-4706-9d29-e52c1b6d6321'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-FIL-INS-55w87e',
  'Inspect and Test Filters - Unimog U3000',
  'Hydraulics',
  'Filters',
  'Inspect and Test Filters - Unimog U3000',
  '# Inspect and Test Filters - Unimog U3000

## Overview
This procedure covers the inspection of the Filters on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('03f5285a-6b3e-433c-a474-ee6f6727def4'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-FIL-ADJ-voe1wo',
  'Adjust and Calibrate Filters - Unimog U3000',
  'Hydraulics',
  'Filters',
  'Adjust and Calibrate Filters - Unimog U3000',
  '# Adjust and Calibrate Filters - Unimog U3000

## Overview
This procedure covers the adjustment of the Filters on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('78a03a38-0047-462f-8ebb-5f59f769664e'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-FIL-REP-c4l7jx',
  'Replace Filters - Unimog U3000',
  'Hydraulics',
  'Filters',
  'Replace Filters - Unimog U3000',
  '# Replace Filters - Unimog U3000

## Overview
This procedure covers the replacement of the Filters on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4d2ebeef-b9cf-4523-8cf1-3c0437b7ad4f'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-FIL-OVE-1gu72',
  'Overhaul and Rebuild Filters - Unimog U3000',
  'Hydraulics',
  'Filters',
  'Overhaul and Rebuild Filters - Unimog U3000',
  '# Overhaul and Rebuild Filters - Unimog U3000

## Overview
This procedure covers the overhaul of the Filters on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8792cd8e-f1a8-4746-9d7f-eca637ef03b6'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-HYD-FIL-TRO-mlgn7',
  'Diagnose and Repair Filters - Unimog U3000',
  'Hydraulics',
  'Filters',
  'Diagnose and Repair Filters - Unimog U3000',
  '# Diagnose and Repair Filters - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Filters on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Hyd-001 for system overview
- See U3000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d7103573-1768-4627-adc8-ec8de9927ac7'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-CAB-REM-o8hlkj',
  'Remove and Install Cab - Unimog U3000',
  'Body',
  'Cab',
  'Remove and Install Cab - Unimog U3000',
  '# Remove and Install Cab - Unimog U3000

## Overview
This procedure covers the removal of the Cab on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d00df375-a6ba-49e1-9881-5f64f26fcb48'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-CAB-INS-l7ec7b',
  'Inspect and Test Cab - Unimog U3000',
  'Body',
  'Cab',
  'Inspect and Test Cab - Unimog U3000',
  '# Inspect and Test Cab - Unimog U3000

## Overview
This procedure covers the inspection of the Cab on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8152b2f2-dec8-4dbf-a2b4-4de02b31229d'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-CAB-ADJ-mnog67',
  'Adjust and Calibrate Cab - Unimog U3000',
  'Body',
  'Cab',
  'Adjust and Calibrate Cab - Unimog U3000',
  '# Adjust and Calibrate Cab - Unimog U3000

## Overview
This procedure covers the adjustment of the Cab on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('628d5ffb-c10b-4035-8424-76375b6f5f5c'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-CAB-REP-4yci48',
  'Replace Cab - Unimog U3000',
  'Body',
  'Cab',
  'Replace Cab - Unimog U3000',
  '# Replace Cab - Unimog U3000

## Overview
This procedure covers the replacement of the Cab on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9c34228e-8cd5-4575-bd14-45febbef57fd'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-CAB-OVE-hi34pk',
  'Overhaul and Rebuild Cab - Unimog U3000',
  'Body',
  'Cab',
  'Overhaul and Rebuild Cab - Unimog U3000',
  '# Overhaul and Rebuild Cab - Unimog U3000

## Overview
This procedure covers the overhaul of the Cab on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b89d0e68-d02b-45b4-85e8-900efed67f88'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-CAB-TRO-3u3alr',
  'Diagnose and Repair Cab - Unimog U3000',
  'Body',
  'Cab',
  'Diagnose and Repair Cab - Unimog U3000',
  '# Diagnose and Repair Cab - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Cab on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cd1e951b-ff1a-4471-a2ea-7ccfb644d23d'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-DOO-REM-cgvg7v',
  'Remove and Install Doors - Unimog U3000',
  'Body',
  'Doors',
  'Remove and Install Doors - Unimog U3000',
  '# Remove and Install Doors - Unimog U3000

## Overview
This procedure covers the removal of the Doors on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('46634507-95bd-42e3-8cb2-2a6758e195bb'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-DOO-INS-iw54ii',
  'Inspect and Test Doors - Unimog U3000',
  'Body',
  'Doors',
  'Inspect and Test Doors - Unimog U3000',
  '# Inspect and Test Doors - Unimog U3000

## Overview
This procedure covers the inspection of the Doors on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('98e56849-f8a2-4d34-9ac3-b388ed48c0ba'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-DOO-ADJ-ua3woo',
  'Adjust and Calibrate Doors - Unimog U3000',
  'Body',
  'Doors',
  'Adjust and Calibrate Doors - Unimog U3000',
  '# Adjust and Calibrate Doors - Unimog U3000

## Overview
This procedure covers the adjustment of the Doors on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('09d0be64-e91a-4a3a-82e9-80332e1fc37e'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-DOO-REP-cbvx5i',
  'Replace Doors - Unimog U3000',
  'Body',
  'Doors',
  'Replace Doors - Unimog U3000',
  '# Replace Doors - Unimog U3000

## Overview
This procedure covers the replacement of the Doors on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('34109b97-178e-41f7-9983-c059b1b2d77d'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-DOO-OVE-bb2nu',
  'Overhaul and Rebuild Doors - Unimog U3000',
  'Body',
  'Doors',
  'Overhaul and Rebuild Doors - Unimog U3000',
  '# Overhaul and Rebuild Doors - Unimog U3000

## Overview
This procedure covers the overhaul of the Doors on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7ef9c8aa-e288-4775-a5e3-ecac4194e43d'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-DOO-TRO-78ljwe',
  'Diagnose and Repair Doors - Unimog U3000',
  'Body',
  'Doors',
  'Diagnose and Repair Doors - Unimog U3000',
  '# Diagnose and Repair Doors - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Doors on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('60350013-460b-471b-a373-9acd993683bf'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-WIN-REM-o4nt6k',
  'Remove and Install Windows - Unimog U3000',
  'Body',
  'Windows',
  'Remove and Install Windows - Unimog U3000',
  '# Remove and Install Windows - Unimog U3000

## Overview
This procedure covers the removal of the Windows on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('62683784-a8b9-4c5d-8b6a-45fba389e5b2'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-BOD-WIN-INS-xwbjs',
  'Inspect and Test Windows - Unimog U3000',
  'Body',
  'Windows',
  'Inspect and Test Windows - Unimog U3000',
  '# Inspect and Test Windows - Unimog U3000

## Overview
This procedure covers the inspection of the Windows on Unimog U3000 vehicles with OM926LA engine.
Applicable to model years: 2002-present

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
- See U3000-Bod-001 for system overview
- See U3000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
);

-- Verify this chunk
SELECT COUNT(*) as procedures_in_db FROM wis_procedures;
