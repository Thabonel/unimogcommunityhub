-- WIS Procedures Import - Chunk 10
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 10 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('0c030d00-1714-45c3-8b54-f6d1a5839482'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-AIR-REM-phtv25i',
  'Remove and Install Air Intake - Unimog U1000',
  'Engine',
  'Air Intake',
  'Remove and Install Air Intake - Unimog U1000',
  '# Remove and Install Air Intake - Unimog U1000

## Overview
This procedure covers the removal of the Air Intake on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('29bf607d-0560-43b7-b190-b6cabe8ec4fa'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-AIR-INS-4qvtb3',
  'Inspect and Test Air Intake - Unimog U1000',
  'Engine',
  'Air Intake',
  'Inspect and Test Air Intake - Unimog U1000',
  '# Inspect and Test Air Intake - Unimog U1000

## Overview
This procedure covers the inspection of the Air Intake on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('477bafb8-3fa0-4a4b-adbd-3a3f9570ade0'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-AIR-ADJ-s4w31b',
  'Adjust and Calibrate Air Intake - Unimog U1000',
  'Engine',
  'Air Intake',
  'Adjust and Calibrate Air Intake - Unimog U1000',
  '# Adjust and Calibrate Air Intake - Unimog U1000

## Overview
This procedure covers the adjustment of the Air Intake on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d5e5d1cc-9c85-4440-934e-51435ae756db'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-AIR-REP-26l39',
  'Replace Air Intake - Unimog U1000',
  'Engine',
  'Air Intake',
  'Replace Air Intake - Unimog U1000',
  '# Replace Air Intake - Unimog U1000

## Overview
This procedure covers the replacement of the Air Intake on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d1011d3e-52e9-4ee8-9fe3-5da44417bf23'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-AIR-OVE-roe6v',
  'Overhaul and Rebuild Air Intake - Unimog U1000',
  'Engine',
  'Air Intake',
  'Overhaul and Rebuild Air Intake - Unimog U1000',
  '# Overhaul and Rebuild Air Intake - Unimog U1000

## Overview
This procedure covers the overhaul of the Air Intake on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2dc2c556-3023-4973-bf6e-0486ea2ea2ae'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-AIR-TRO-yaaxyf',
  'Diagnose and Repair Air Intake - Unimog U1000',
  'Engine',
  'Air Intake',
  'Diagnose and Repair Air Intake - Unimog U1000',
  '# Diagnose and Repair Air Intake - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Air Intake on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a399dca9-c467-4f11-8f02-1e5afdaf99a5'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-EXH-REM-y46jp',
  'Remove and Install Exhaust - Unimog U1000',
  'Engine',
  'Exhaust',
  'Remove and Install Exhaust - Unimog U1000',
  '# Remove and Install Exhaust - Unimog U1000

## Overview
This procedure covers the removal of the Exhaust on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('345b528a-555b-49c9-a65a-e99910ab758d'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-EXH-INS-mjcvtl',
  'Inspect and Test Exhaust - Unimog U1000',
  'Engine',
  'Exhaust',
  'Inspect and Test Exhaust - Unimog U1000',
  '# Inspect and Test Exhaust - Unimog U1000

## Overview
This procedure covers the inspection of the Exhaust on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('201f7e8a-101e-4d6f-bae9-6c8c591ce20d'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-EXH-ADJ-ktdvon',
  'Adjust and Calibrate Exhaust - Unimog U1000',
  'Engine',
  'Exhaust',
  'Adjust and Calibrate Exhaust - Unimog U1000',
  '# Adjust and Calibrate Exhaust - Unimog U1000

## Overview
This procedure covers the adjustment of the Exhaust on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4d33d3e2-635b-490b-8a1c-3af77d6b8224'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-EXH-REP-drd4yc',
  'Replace Exhaust - Unimog U1000',
  'Engine',
  'Exhaust',
  'Replace Exhaust - Unimog U1000',
  '# Replace Exhaust - Unimog U1000

## Overview
This procedure covers the replacement of the Exhaust on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('91ccf0f5-3125-49a1-8ff4-b2a16e3f70a8'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-EXH-OVE-vcj3qm',
  'Overhaul and Rebuild Exhaust - Unimog U1000',
  'Engine',
  'Exhaust',
  'Overhaul and Rebuild Exhaust - Unimog U1000',
  '# Overhaul and Rebuild Exhaust - Unimog U1000

## Overview
This procedure covers the overhaul of the Exhaust on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9f719d46-a5bf-485e-8b03-b93d29cd4a98'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-EXH-TRO-vvd9a',
  'Diagnose and Repair Exhaust - Unimog U1000',
  'Engine',
  'Exhaust',
  'Diagnose and Repair Exhaust - Unimog U1000',
  '# Diagnose and Repair Exhaust - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Exhaust on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('55826cc3-8178-407d-af7b-03cab238f221'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-TUR-REM-ixnunl',
  'Remove and Install Turbocharger - Unimog U1000',
  'Engine',
  'Turbocharger',
  'Remove and Install Turbocharger - Unimog U1000',
  '# Remove and Install Turbocharger - Unimog U1000

## Overview
This procedure covers the removal of the Turbocharger on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6402bfe1-a5a7-4b16-8425-c0ebdb0e7b39'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-TUR-INS-tdoc4t',
  'Inspect and Test Turbocharger - Unimog U1000',
  'Engine',
  'Turbocharger',
  'Inspect and Test Turbocharger - Unimog U1000',
  '# Inspect and Test Turbocharger - Unimog U1000

## Overview
This procedure covers the inspection of the Turbocharger on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('68cdf409-bdbe-454c-ad72-36b76d4b2b00'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-TUR-ADJ-yxtgnm',
  'Adjust and Calibrate Turbocharger - Unimog U1000',
  'Engine',
  'Turbocharger',
  'Adjust and Calibrate Turbocharger - Unimog U1000',
  '# Adjust and Calibrate Turbocharger - Unimog U1000

## Overview
This procedure covers the adjustment of the Turbocharger on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ff7fe299-2dad-4e14-8f02-9b66e8abed7b'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-TUR-REP-t3v0wn',
  'Replace Turbocharger - Unimog U1000',
  'Engine',
  'Turbocharger',
  'Replace Turbocharger - Unimog U1000',
  '# Replace Turbocharger - Unimog U1000

## Overview
This procedure covers the replacement of the Turbocharger on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f457de76-b407-4004-99a1-40f258f1ebfb'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-TUR-OVE-mvfvze',
  'Overhaul and Rebuild Turbocharger - Unimog U1000',
  'Engine',
  'Turbocharger',
  'Overhaul and Rebuild Turbocharger - Unimog U1000',
  '# Overhaul and Rebuild Turbocharger - Unimog U1000

## Overview
This procedure covers the overhaul of the Turbocharger on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1d439827-f962-4467-a3b8-feda472c9b6e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-ENG-TUR-TRO-dhfpi5',
  'Diagnose and Repair Turbocharger - Unimog U1000',
  'Engine',
  'Turbocharger',
  'Diagnose and Repair Turbocharger - Unimog U1000',
  '# Diagnose and Repair Turbocharger - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Turbocharger on Unimog U1000 vehicles with OM366 engine.
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
5. Allow engine to cool for minimum 30 minutes

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
- See U1000-Eng-001 for system overview
- See U1000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2112276e-fe17-42fd-8962-873bfa3ff229'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-MAN-REM-3uo3t',
  'Remove and Install Manual Gearbox - Unimog U1000',
  'Transmission',
  'Manual Gearbox',
  'Remove and Install Manual Gearbox - Unimog U1000',
  '# Remove and Install Manual Gearbox - Unimog U1000

## Overview
This procedure covers the removal of the Manual Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2746f672-9b5c-4570-a4be-df3a5ae91cac'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-MAN-INS-32xx3n',
  'Inspect and Test Manual Gearbox - Unimog U1000',
  'Transmission',
  'Manual Gearbox',
  'Inspect and Test Manual Gearbox - Unimog U1000',
  '# Inspect and Test Manual Gearbox - Unimog U1000

## Overview
This procedure covers the inspection of the Manual Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b668adc8-b4a2-4bba-8e26-6b199b384e5a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-MAN-ADJ-9d53gj',
  'Adjust and Calibrate Manual Gearbox - Unimog U1000',
  'Transmission',
  'Manual Gearbox',
  'Adjust and Calibrate Manual Gearbox - Unimog U1000',
  '# Adjust and Calibrate Manual Gearbox - Unimog U1000

## Overview
This procedure covers the adjustment of the Manual Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e166c106-8130-46c3-83e9-68a042c2f212'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-MAN-REP-zuv6wc',
  'Replace Manual Gearbox - Unimog U1000',
  'Transmission',
  'Manual Gearbox',
  'Replace Manual Gearbox - Unimog U1000',
  '# Replace Manual Gearbox - Unimog U1000

## Overview
This procedure covers the replacement of the Manual Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c1ca189-33f2-4401-95e0-22bfbd69b23e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-MAN-OVE-5vla8',
  'Overhaul and Rebuild Manual Gearbox - Unimog U1000',
  'Transmission',
  'Manual Gearbox',
  'Overhaul and Rebuild Manual Gearbox - Unimog U1000',
  '# Overhaul and Rebuild Manual Gearbox - Unimog U1000

## Overview
This procedure covers the overhaul of the Manual Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('11e5b210-cecf-4079-850b-ef0d0f7cf482'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-MAN-TRO-5kswe',
  'Diagnose and Repair Manual Gearbox - Unimog U1000',
  'Transmission',
  'Manual Gearbox',
  'Diagnose and Repair Manual Gearbox - Unimog U1000',
  '# Diagnose and Repair Manual Gearbox - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Manual Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('303bf27d-83f1-49de-86d7-809cf9951c65'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-AUT-REM-gkxm3b',
  'Remove and Install Automatic Gearbox - Unimog U1000',
  'Transmission',
  'Automatic Gearbox',
  'Remove and Install Automatic Gearbox - Unimog U1000',
  '# Remove and Install Automatic Gearbox - Unimog U1000

## Overview
This procedure covers the removal of the Automatic Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('71db2c4b-2008-45e7-ae7e-cc697f5213c6'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-AUT-INS-7lgwoe',
  'Inspect and Test Automatic Gearbox - Unimog U1000',
  'Transmission',
  'Automatic Gearbox',
  'Inspect and Test Automatic Gearbox - Unimog U1000',
  '# Inspect and Test Automatic Gearbox - Unimog U1000

## Overview
This procedure covers the inspection of the Automatic Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5fd72b98-5f25-4174-b2b5-3f63426ca24c'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-AUT-ADJ-4erhs',
  'Adjust and Calibrate Automatic Gearbox - Unimog U1000',
  'Transmission',
  'Automatic Gearbox',
  'Adjust and Calibrate Automatic Gearbox - Unimog U1000',
  '# Adjust and Calibrate Automatic Gearbox - Unimog U1000

## Overview
This procedure covers the adjustment of the Automatic Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d0f29c9e-95ac-49dd-9d40-7cb4cc6bfac0'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-AUT-REP-rrjng',
  'Replace Automatic Gearbox - Unimog U1000',
  'Transmission',
  'Automatic Gearbox',
  'Replace Automatic Gearbox - Unimog U1000',
  '# Replace Automatic Gearbox - Unimog U1000

## Overview
This procedure covers the replacement of the Automatic Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('94e84d29-fa95-4cd7-b994-62521210f786'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-AUT-OVE-vewbd',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U1000',
  'Transmission',
  'Automatic Gearbox',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U1000',
  '# Overhaul and Rebuild Automatic Gearbox - Unimog U1000

## Overview
This procedure covers the overhaul of the Automatic Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d36c4a3d-9e0b-4f14-9b72-28257c05e18a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-AUT-TRO-3uiynu',
  'Diagnose and Repair Automatic Gearbox - Unimog U1000',
  'Transmission',
  'Automatic Gearbox',
  'Diagnose and Repair Automatic Gearbox - Unimog U1000',
  '# Diagnose and Repair Automatic Gearbox - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Automatic Gearbox on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3f949a5b-aa35-4447-8ad6-31521d3ee1a4'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-TRA-REM-dwzxmk',
  'Remove and Install Transfer Case - Unimog U1000',
  'Transmission',
  'Transfer Case',
  'Remove and Install Transfer Case - Unimog U1000',
  '# Remove and Install Transfer Case - Unimog U1000

## Overview
This procedure covers the removal of the Transfer Case on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d220c2da-b1ca-4e8c-ae5d-1b1536f9b2d6'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-TRA-INS-ovbbbd',
  'Inspect and Test Transfer Case - Unimog U1000',
  'Transmission',
  'Transfer Case',
  'Inspect and Test Transfer Case - Unimog U1000',
  '# Inspect and Test Transfer Case - Unimog U1000

## Overview
This procedure covers the inspection of the Transfer Case on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9a0154b9-d29d-42af-9bbd-7ecf65cc1391'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-TRA-ADJ-4k3u5',
  'Adjust and Calibrate Transfer Case - Unimog U1000',
  'Transmission',
  'Transfer Case',
  'Adjust and Calibrate Transfer Case - Unimog U1000',
  '# Adjust and Calibrate Transfer Case - Unimog U1000

## Overview
This procedure covers the adjustment of the Transfer Case on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('21d763a0-ab94-416c-ac73-0d010784cc0a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-TRA-REP-0fe81q',
  'Replace Transfer Case - Unimog U1000',
  'Transmission',
  'Transfer Case',
  'Replace Transfer Case - Unimog U1000',
  '# Replace Transfer Case - Unimog U1000

## Overview
This procedure covers the replacement of the Transfer Case on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('938e3b51-d057-4707-9378-63daebeb32ff'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-TRA-OVE-ah6mj5',
  'Overhaul and Rebuild Transfer Case - Unimog U1000',
  'Transmission',
  'Transfer Case',
  'Overhaul and Rebuild Transfer Case - Unimog U1000',
  '# Overhaul and Rebuild Transfer Case - Unimog U1000

## Overview
This procedure covers the overhaul of the Transfer Case on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('487590da-1bb2-4562-a1d4-ff1c286b6063'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-TRA-TRO-xrntd',
  'Diagnose and Repair Transfer Case - Unimog U1000',
  'Transmission',
  'Transfer Case',
  'Diagnose and Repair Transfer Case - Unimog U1000',
  '# Diagnose and Repair Transfer Case - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Transfer Case on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4a435df0-3b7c-4fd1-8128-99f5e2dfea00'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-PTO-REM-xymelm',
  'Remove and Install PTO - Unimog U1000',
  'Transmission',
  'PTO',
  'Remove and Install PTO - Unimog U1000',
  '# Remove and Install PTO - Unimog U1000

## Overview
This procedure covers the removal of the PTO on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8a407b51-f798-4905-bf07-fc13736f0bbc'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-PTO-INS-k6vgxno',
  'Inspect and Test PTO - Unimog U1000',
  'Transmission',
  'PTO',
  'Inspect and Test PTO - Unimog U1000',
  '# Inspect and Test PTO - Unimog U1000

## Overview
This procedure covers the inspection of the PTO on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('03f486e2-e9eb-4bbf-994a-d446b18d9f7f'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-PTO-ADJ-whnjz',
  'Adjust and Calibrate PTO - Unimog U1000',
  'Transmission',
  'PTO',
  'Adjust and Calibrate PTO - Unimog U1000',
  '# Adjust and Calibrate PTO - Unimog U1000

## Overview
This procedure covers the adjustment of the PTO on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('002c96bc-dda5-4e47-929e-4ba0cf796a18'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-PTO-REP-jsxtci',
  'Replace PTO - Unimog U1000',
  'Transmission',
  'PTO',
  'Replace PTO - Unimog U1000',
  '# Replace PTO - Unimog U1000

## Overview
This procedure covers the replacement of the PTO on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2b14f932-e90c-457f-86bd-b226e9f45c22'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-PTO-OVE-e3akyl',
  'Overhaul and Rebuild PTO - Unimog U1000',
  'Transmission',
  'PTO',
  'Overhaul and Rebuild PTO - Unimog U1000',
  '# Overhaul and Rebuild PTO - Unimog U1000

## Overview
This procedure covers the overhaul of the PTO on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b0a7981d-04f2-4397-b027-b70e9bd2bd9b'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-PTO-TRO-84pcfs',
  'Diagnose and Repair PTO - Unimog U1000',
  'Transmission',
  'PTO',
  'Diagnose and Repair PTO - Unimog U1000',
  '# Diagnose and Repair PTO - Unimog U1000

## Overview
This procedure covers the troubleshooting of the PTO on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5f0b4359-71dc-4039-9ff5-55210cdccff9'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-CLU-REM-gwvr4',
  'Remove and Install Clutch - Unimog U1000',
  'Transmission',
  'Clutch',
  'Remove and Install Clutch - Unimog U1000',
  '# Remove and Install Clutch - Unimog U1000

## Overview
This procedure covers the removal of the Clutch on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bdadc50a-fc87-45fe-9518-074b1b9d662a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-CLU-INS-0fwlv',
  'Inspect and Test Clutch - Unimog U1000',
  'Transmission',
  'Clutch',
  'Inspect and Test Clutch - Unimog U1000',
  '# Inspect and Test Clutch - Unimog U1000

## Overview
This procedure covers the inspection of the Clutch on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b64b80b0-0792-4873-832e-807cc34b1f74'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-CLU-ADJ-cggrj',
  'Adjust and Calibrate Clutch - Unimog U1000',
  'Transmission',
  'Clutch',
  'Adjust and Calibrate Clutch - Unimog U1000',
  '# Adjust and Calibrate Clutch - Unimog U1000

## Overview
This procedure covers the adjustment of the Clutch on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fca9155a-d9da-47f3-8003-8bfa8f01e486'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-CLU-REP-1q0bvm',
  'Replace Clutch - Unimog U1000',
  'Transmission',
  'Clutch',
  'Replace Clutch - Unimog U1000',
  '# Replace Clutch - Unimog U1000

## Overview
This procedure covers the replacement of the Clutch on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d79408cf-10ea-4d0b-b01e-e880b7d3f937'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-CLU-OVE-l58mf',
  'Overhaul and Rebuild Clutch - Unimog U1000',
  'Transmission',
  'Clutch',
  'Overhaul and Rebuild Clutch - Unimog U1000',
  '# Overhaul and Rebuild Clutch - Unimog U1000

## Overview
This procedure covers the overhaul of the Clutch on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fbb0c3ef-a41c-4110-ac67-82847d01574d'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-TRA-CLU-TRO-hpdh4m',
  'Diagnose and Repair Clutch - Unimog U1000',
  'Transmission',
  'Clutch',
  'Diagnose and Repair Clutch - Unimog U1000',
  '# Diagnose and Repair Clutch - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Clutch on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Tra-001 for system overview
- See U1000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('927e3511-3e19-4e9b-bc66-e76ad0a24f60'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-POR-REM-6coikk',
  'Remove and Install Portal Axles - Unimog U1000',
  'Drivetrain',
  'Portal Axles',
  'Remove and Install Portal Axles - Unimog U1000',
  '# Remove and Install Portal Axles - Unimog U1000

## Overview
This procedure covers the removal of the Portal Axles on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4624227e-0621-4214-835f-26b4b9a5856b'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-POR-INS-g1drjr',
  'Inspect and Test Portal Axles - Unimog U1000',
  'Drivetrain',
  'Portal Axles',
  'Inspect and Test Portal Axles - Unimog U1000',
  '# Inspect and Test Portal Axles - Unimog U1000

## Overview
This procedure covers the inspection of the Portal Axles on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6f88e2b5-80e8-4aff-b3e2-3be180b8196f'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-POR-ADJ-8nhuqp',
  'Adjust and Calibrate Portal Axles - Unimog U1000',
  'Drivetrain',
  'Portal Axles',
  'Adjust and Calibrate Portal Axles - Unimog U1000',
  '# Adjust and Calibrate Portal Axles - Unimog U1000

## Overview
This procedure covers the adjustment of the Portal Axles on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f5de04e4-44e2-4e6d-a6e1-3a8c38722628'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-POR-REP-klqlp4',
  'Replace Portal Axles - Unimog U1000',
  'Drivetrain',
  'Portal Axles',
  'Replace Portal Axles - Unimog U1000',
  '# Replace Portal Axles - Unimog U1000

## Overview
This procedure covers the replacement of the Portal Axles on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8ea58f05-e79a-4d43-af39-bb3df80b23da'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-POR-OVE-hm7s18',
  'Overhaul and Rebuild Portal Axles - Unimog U1000',
  'Drivetrain',
  'Portal Axles',
  'Overhaul and Rebuild Portal Axles - Unimog U1000',
  '# Overhaul and Rebuild Portal Axles - Unimog U1000

## Overview
This procedure covers the overhaul of the Portal Axles on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cab019e7-57c0-41bf-a934-4d7ba532c5b6'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-POR-TRO-4sbyo',
  'Diagnose and Repair Portal Axles - Unimog U1000',
  'Drivetrain',
  'Portal Axles',
  'Diagnose and Repair Portal Axles - Unimog U1000',
  '# Diagnose and Repair Portal Axles - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Portal Axles on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('354c66fa-fd4d-4aa4-b796-4c39fce6ddde'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DIF-REM-erfjp',
  'Remove and Install Differentials - Unimog U1000',
  'Drivetrain',
  'Differentials',
  'Remove and Install Differentials - Unimog U1000',
  '# Remove and Install Differentials - Unimog U1000

## Overview
This procedure covers the removal of the Differentials on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('dd811dd4-665d-4417-b223-f2e7c8029cb3'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DIF-INS-tlhleg',
  'Inspect and Test Differentials - Unimog U1000',
  'Drivetrain',
  'Differentials',
  'Inspect and Test Differentials - Unimog U1000',
  '# Inspect and Test Differentials - Unimog U1000

## Overview
This procedure covers the inspection of the Differentials on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('687fec81-cad2-4979-961a-16d0a6cc9a97'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DIF-ADJ-y65bf',
  'Adjust and Calibrate Differentials - Unimog U1000',
  'Drivetrain',
  'Differentials',
  'Adjust and Calibrate Differentials - Unimog U1000',
  '# Adjust and Calibrate Differentials - Unimog U1000

## Overview
This procedure covers the adjustment of the Differentials on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('af6f3b2a-feac-4cbd-8dad-8cea16f52361'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DIF-REP-rlxj4j',
  'Replace Differentials - Unimog U1000',
  'Drivetrain',
  'Differentials',
  'Replace Differentials - Unimog U1000',
  '# Replace Differentials - Unimog U1000

## Overview
This procedure covers the replacement of the Differentials on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('46c22271-4ce8-4be0-a327-e98c9fa170b8'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DIF-OVE-tma7za',
  'Overhaul and Rebuild Differentials - Unimog U1000',
  'Drivetrain',
  'Differentials',
  'Overhaul and Rebuild Differentials - Unimog U1000',
  '# Overhaul and Rebuild Differentials - Unimog U1000

## Overview
This procedure covers the overhaul of the Differentials on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('455480f6-90e7-4558-aa84-f495bcd6fa8f'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DIF-TRO-5dialp',
  'Diagnose and Repair Differentials - Unimog U1000',
  'Drivetrain',
  'Differentials',
  'Diagnose and Repair Differentials - Unimog U1000',
  '# Diagnose and Repair Differentials - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Differentials on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1b9ade61-ad12-401c-93e5-3a19ab06e021'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DRI-REM-8l7gbt',
  'Remove and Install Drive Shafts - Unimog U1000',
  'Drivetrain',
  'Drive Shafts',
  'Remove and Install Drive Shafts - Unimog U1000',
  '# Remove and Install Drive Shafts - Unimog U1000

## Overview
This procedure covers the removal of the Drive Shafts on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e667d0ed-16b0-4afd-9b1d-5d96d62dd72d'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DRI-INS-j1izbj',
  'Inspect and Test Drive Shafts - Unimog U1000',
  'Drivetrain',
  'Drive Shafts',
  'Inspect and Test Drive Shafts - Unimog U1000',
  '# Inspect and Test Drive Shafts - Unimog U1000

## Overview
This procedure covers the inspection of the Drive Shafts on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5bb2b44c-6d75-4102-8c17-2d9392795fd3'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DRI-ADJ-fbjltk',
  'Adjust and Calibrate Drive Shafts - Unimog U1000',
  'Drivetrain',
  'Drive Shafts',
  'Adjust and Calibrate Drive Shafts - Unimog U1000',
  '# Adjust and Calibrate Drive Shafts - Unimog U1000

## Overview
This procedure covers the adjustment of the Drive Shafts on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e583a6e9-949a-475c-8ba4-a7eccf644cb6'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DRI-REP-4nzrsd',
  'Replace Drive Shafts - Unimog U1000',
  'Drivetrain',
  'Drive Shafts',
  'Replace Drive Shafts - Unimog U1000',
  '# Replace Drive Shafts - Unimog U1000

## Overview
This procedure covers the replacement of the Drive Shafts on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('28bf85d3-a224-4a60-9863-5d82958a81b3'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DRI-OVE-59pz88',
  'Overhaul and Rebuild Drive Shafts - Unimog U1000',
  'Drivetrain',
  'Drive Shafts',
  'Overhaul and Rebuild Drive Shafts - Unimog U1000',
  '# Overhaul and Rebuild Drive Shafts - Unimog U1000

## Overview
This procedure covers the overhaul of the Drive Shafts on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('423176d6-d4ac-49dc-bb51-b97125f0bedd'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-DRI-TRO-391jcf6',
  'Diagnose and Repair Drive Shafts - Unimog U1000',
  'Drivetrain',
  'Drive Shafts',
  'Diagnose and Repair Drive Shafts - Unimog U1000',
  '# Diagnose and Repair Drive Shafts - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Drive Shafts on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('805a529b-7f5f-4ea1-9b02-aab18820995d'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-WHE-REM-cm5zwf',
  'Remove and Install Wheel Hubs - Unimog U1000',
  'Drivetrain',
  'Wheel Hubs',
  'Remove and Install Wheel Hubs - Unimog U1000',
  '# Remove and Install Wheel Hubs - Unimog U1000

## Overview
This procedure covers the removal of the Wheel Hubs on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('117c0d2f-08cb-4c97-a83b-3bed598dc5e4'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-WHE-INS-uidh1',
  'Inspect and Test Wheel Hubs - Unimog U1000',
  'Drivetrain',
  'Wheel Hubs',
  'Inspect and Test Wheel Hubs - Unimog U1000',
  '# Inspect and Test Wheel Hubs - Unimog U1000

## Overview
This procedure covers the inspection of the Wheel Hubs on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('61c86c8d-d5f7-492c-9a31-f8763937594e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-WHE-ADJ-it816',
  'Adjust and Calibrate Wheel Hubs - Unimog U1000',
  'Drivetrain',
  'Wheel Hubs',
  'Adjust and Calibrate Wheel Hubs - Unimog U1000',
  '# Adjust and Calibrate Wheel Hubs - Unimog U1000

## Overview
This procedure covers the adjustment of the Wheel Hubs on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4db11524-c118-4e1e-94b9-117fb12e8ad4'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-WHE-REP-vx6n0j',
  'Replace Wheel Hubs - Unimog U1000',
  'Drivetrain',
  'Wheel Hubs',
  'Replace Wheel Hubs - Unimog U1000',
  '# Replace Wheel Hubs - Unimog U1000

## Overview
This procedure covers the replacement of the Wheel Hubs on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f5bfbdf8-7ef3-4e8a-b7ec-335095bd0c74'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-WHE-OVE-yftv9j',
  'Overhaul and Rebuild Wheel Hubs - Unimog U1000',
  'Drivetrain',
  'Wheel Hubs',
  'Overhaul and Rebuild Wheel Hubs - Unimog U1000',
  '# Overhaul and Rebuild Wheel Hubs - Unimog U1000

## Overview
This procedure covers the overhaul of the Wheel Hubs on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6541f1f4-649a-4370-a61c-9bbdd6e5034b'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-WHE-TRO-j0lial',
  'Diagnose and Repair Wheel Hubs - Unimog U1000',
  'Drivetrain',
  'Wheel Hubs',
  'Diagnose and Repair Wheel Hubs - Unimog U1000',
  '# Diagnose and Repair Wheel Hubs - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Wheel Hubs on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6d94d174-acde-4e36-8362-512212c7c787'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-CV -REM-b04ogi',
  'Remove and Install CV Joints - Unimog U1000',
  'Drivetrain',
  'CV Joints',
  'Remove and Install CV Joints - Unimog U1000',
  '# Remove and Install CV Joints - Unimog U1000

## Overview
This procedure covers the removal of the CV Joints on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ed404d3d-e3b9-4a9a-a646-0cdad193fcfd'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-CV -INS-01etzv',
  'Inspect and Test CV Joints - Unimog U1000',
  'Drivetrain',
  'CV Joints',
  'Inspect and Test CV Joints - Unimog U1000',
  '# Inspect and Test CV Joints - Unimog U1000

## Overview
This procedure covers the inspection of the CV Joints on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('02b296b1-6046-4634-a639-f11122518a98'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-CV -ADJ-zibdzh',
  'Adjust and Calibrate CV Joints - Unimog U1000',
  'Drivetrain',
  'CV Joints',
  'Adjust and Calibrate CV Joints - Unimog U1000',
  '# Adjust and Calibrate CV Joints - Unimog U1000

## Overview
This procedure covers the adjustment of the CV Joints on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('18d70b7e-30b5-4f8f-a463-d34396aff106'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-CV -REP-byz8x',
  'Replace CV Joints - Unimog U1000',
  'Drivetrain',
  'CV Joints',
  'Replace CV Joints - Unimog U1000',
  '# Replace CV Joints - Unimog U1000

## Overview
This procedure covers the replacement of the CV Joints on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f8012e27-69f7-4e95-bf04-b0613f2afac6'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-CV -OVE-vz3hx',
  'Overhaul and Rebuild CV Joints - Unimog U1000',
  'Drivetrain',
  'CV Joints',
  'Overhaul and Rebuild CV Joints - Unimog U1000',
  '# Overhaul and Rebuild CV Joints - Unimog U1000

## Overview
This procedure covers the overhaul of the CV Joints on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('60feca8c-385f-4b68-a43f-98df764971ec'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-DRI-CV -TRO-8qpteb',
  'Diagnose and Repair CV Joints - Unimog U1000',
  'Drivetrain',
  'CV Joints',
  'Diagnose and Repair CV Joints - Unimog U1000',
  '# Diagnose and Repair CV Joints - Unimog U1000

## Overview
This procedure covers the troubleshooting of the CV Joints on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Dri-001 for system overview
- See U1000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6be31899-5b61-4504-9f31-07b302d60801'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-SER-REM-n8n59',
  'Remove and Install Service Brakes - Unimog U1000',
  'Brakes',
  'Service Brakes',
  'Remove and Install Service Brakes - Unimog U1000',
  '# Remove and Install Service Brakes - Unimog U1000

## Overview
This procedure covers the removal of the Service Brakes on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('02ffd2ca-129d-4f70-b514-2bb9f616ea15'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-SER-INS-2dfbz',
  'Inspect and Test Service Brakes - Unimog U1000',
  'Brakes',
  'Service Brakes',
  'Inspect and Test Service Brakes - Unimog U1000',
  '# Inspect and Test Service Brakes - Unimog U1000

## Overview
This procedure covers the inspection of the Service Brakes on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('990597bf-361a-4b86-b5cf-036a538c8e81'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-SER-ADJ-ehk3mm',
  'Adjust and Calibrate Service Brakes - Unimog U1000',
  'Brakes',
  'Service Brakes',
  'Adjust and Calibrate Service Brakes - Unimog U1000',
  '# Adjust and Calibrate Service Brakes - Unimog U1000

## Overview
This procedure covers the adjustment of the Service Brakes on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e7ed51c2-ad69-4e5f-a9e2-40038a3ba76f'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-SER-REP-301h0cf',
  'Replace Service Brakes - Unimog U1000',
  'Brakes',
  'Service Brakes',
  'Replace Service Brakes - Unimog U1000',
  '# Replace Service Brakes - Unimog U1000

## Overview
This procedure covers the replacement of the Service Brakes on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3b787676-d6ec-4485-a7d1-d9b9dfba5b3c'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-SER-OVE-flt05e',
  'Overhaul and Rebuild Service Brakes - Unimog U1000',
  'Brakes',
  'Service Brakes',
  'Overhaul and Rebuild Service Brakes - Unimog U1000',
  '# Overhaul and Rebuild Service Brakes - Unimog U1000

## Overview
This procedure covers the overhaul of the Service Brakes on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ce824da7-0acb-46a3-8ce7-1d53df3e0e97'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-SER-TRO-dd0ktf',
  'Diagnose and Repair Service Brakes - Unimog U1000',
  'Brakes',
  'Service Brakes',
  'Diagnose and Repair Service Brakes - Unimog U1000',
  '# Diagnose and Repair Service Brakes - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Service Brakes on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3810daf2-bc43-4991-b85e-1d11cdc2e35e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-PAR-REM-vohv3c',
  'Remove and Install Parking Brake - Unimog U1000',
  'Brakes',
  'Parking Brake',
  'Remove and Install Parking Brake - Unimog U1000',
  '# Remove and Install Parking Brake - Unimog U1000

## Overview
This procedure covers the removal of the Parking Brake on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1e5e1e3f-2ed5-4cf7-8808-f869365f01ff'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-PAR-INS-pmie5o',
  'Inspect and Test Parking Brake - Unimog U1000',
  'Brakes',
  'Parking Brake',
  'Inspect and Test Parking Brake - Unimog U1000',
  '# Inspect and Test Parking Brake - Unimog U1000

## Overview
This procedure covers the inspection of the Parking Brake on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2fccdd4a-041f-46d8-9985-be3ac81dbc30'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-PAR-ADJ-ucfwfi',
  'Adjust and Calibrate Parking Brake - Unimog U1000',
  'Brakes',
  'Parking Brake',
  'Adjust and Calibrate Parking Brake - Unimog U1000',
  '# Adjust and Calibrate Parking Brake - Unimog U1000

## Overview
This procedure covers the adjustment of the Parking Brake on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d0aecc11-6fb3-4410-80ed-01dc1c0e97a4'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-PAR-REP-dtnhy',
  'Replace Parking Brake - Unimog U1000',
  'Brakes',
  'Parking Brake',
  'Replace Parking Brake - Unimog U1000',
  '# Replace Parking Brake - Unimog U1000

## Overview
This procedure covers the replacement of the Parking Brake on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('213dfca7-dcf1-43c0-929f-b7383f81bddb'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-PAR-OVE-y73i38',
  'Overhaul and Rebuild Parking Brake - Unimog U1000',
  'Brakes',
  'Parking Brake',
  'Overhaul and Rebuild Parking Brake - Unimog U1000',
  '# Overhaul and Rebuild Parking Brake - Unimog U1000

## Overview
This procedure covers the overhaul of the Parking Brake on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f8ba7474-3383-4c2b-9c21-c6a83a799eeb'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-PAR-TRO-suh1p9',
  'Diagnose and Repair Parking Brake - Unimog U1000',
  'Brakes',
  'Parking Brake',
  'Diagnose and Repair Parking Brake - Unimog U1000',
  '# Diagnose and Repair Parking Brake - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Parking Brake on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9d35c4b8-5f0d-480d-917e-79d3380a213c'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-ABS-REM-ygfdsq',
  'Remove and Install ABS System - Unimog U1000',
  'Brakes',
  'ABS System',
  'Remove and Install ABS System - Unimog U1000',
  '# Remove and Install ABS System - Unimog U1000

## Overview
This procedure covers the removal of the ABS System on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4e9f17cc-1a99-48d8-a493-8882bdd6726c'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-ABS-INS-bo793j',
  'Inspect and Test ABS System - Unimog U1000',
  'Brakes',
  'ABS System',
  'Inspect and Test ABS System - Unimog U1000',
  '# Inspect and Test ABS System - Unimog U1000

## Overview
This procedure covers the inspection of the ABS System on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('91d5128a-ac86-4146-ac4f-dfdb10b8274e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-ABS-ADJ-rzh5ql',
  'Adjust and Calibrate ABS System - Unimog U1000',
  'Brakes',
  'ABS System',
  'Adjust and Calibrate ABS System - Unimog U1000',
  '# Adjust and Calibrate ABS System - Unimog U1000

## Overview
This procedure covers the adjustment of the ABS System on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8e8866c6-6f28-4f5f-b063-269b24dedae4'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-ABS-REP-h12a9p',
  'Replace ABS System - Unimog U1000',
  'Brakes',
  'ABS System',
  'Replace ABS System - Unimog U1000',
  '# Replace ABS System - Unimog U1000

## Overview
This procedure covers the replacement of the ABS System on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cb8615e6-283d-4f15-8242-dbf2f12b1d80'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-ABS-OVE-i6hqr',
  'Overhaul and Rebuild ABS System - Unimog U1000',
  'Brakes',
  'ABS System',
  'Overhaul and Rebuild ABS System - Unimog U1000',
  '# Overhaul and Rebuild ABS System - Unimog U1000

## Overview
This procedure covers the overhaul of the ABS System on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('091c9a23-99fb-44e1-bfbc-861875ba3901'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-ABS-TRO-ptdnz',
  'Diagnose and Repair ABS System - Unimog U1000',
  'Brakes',
  'ABS System',
  'Diagnose and Repair ABS System - Unimog U1000',
  '# Diagnose and Repair ABS System - Unimog U1000

## Overview
This procedure covers the troubleshooting of the ABS System on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('429a9fbb-13aa-4ce1-92b8-96dfb102b1c4'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-BRA-REM-0m8mei',
  'Remove and Install Brake Lines - Unimog U1000',
  'Brakes',
  'Brake Lines',
  'Remove and Install Brake Lines - Unimog U1000',
  '# Remove and Install Brake Lines - Unimog U1000

## Overview
This procedure covers the removal of the Brake Lines on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5d832ff1-2692-4d6c-a3d5-e493e791a769'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-BRA-INS-clykqt',
  'Inspect and Test Brake Lines - Unimog U1000',
  'Brakes',
  'Brake Lines',
  'Inspect and Test Brake Lines - Unimog U1000',
  '# Inspect and Test Brake Lines - Unimog U1000

## Overview
This procedure covers the inspection of the Brake Lines on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('35f61d03-6f73-48bf-93a4-77069e3de096'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-BRA-ADJ-9a4k4k',
  'Adjust and Calibrate Brake Lines - Unimog U1000',
  'Brakes',
  'Brake Lines',
  'Adjust and Calibrate Brake Lines - Unimog U1000',
  '# Adjust and Calibrate Brake Lines - Unimog U1000

## Overview
This procedure covers the adjustment of the Brake Lines on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('724bbf96-c58a-4ba2-aa64-e1d65e0ad2ec'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BRA-BRA-REP-snhmwn',
  'Replace Brake Lines - Unimog U1000',
  'Brakes',
  'Brake Lines',
  'Replace Brake Lines - Unimog U1000',
  '# Replace Brake Lines - Unimog U1000

## Overview
This procedure covers the replacement of the Brake Lines on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Bra-001 for system overview
- See U1000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
);

-- Verify this chunk
SELECT COUNT(*) as procedures_in_db FROM wis_procedures;
