-- WIS Procedures Import - Chunk 12
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 12 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('6d2d85e4-4f87-4986-8deb-312cb0c287a7'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-CYL-ADJ-xcr0tb',
  'Adjust and Calibrate Cylinders - Unimog U1000',
  'Hydraulics',
  'Cylinders',
  'Adjust and Calibrate Cylinders - Unimog U1000',
  '# Adjust and Calibrate Cylinders - Unimog U1000

## Overview
This procedure covers the adjustment of the Cylinders on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('722a231b-70fe-4c62-b198-562190a9bbec'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-CYL-REP-70gxz4',
  'Replace Cylinders - Unimog U1000',
  'Hydraulics',
  'Cylinders',
  'Replace Cylinders - Unimog U1000',
  '# Replace Cylinders - Unimog U1000

## Overview
This procedure covers the replacement of the Cylinders on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6d0afe15-8e37-40f4-9fa4-8d10aaad1e03'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-CYL-OVE-t256cr',
  'Overhaul and Rebuild Cylinders - Unimog U1000',
  'Hydraulics',
  'Cylinders',
  'Overhaul and Rebuild Cylinders - Unimog U1000',
  '# Overhaul and Rebuild Cylinders - Unimog U1000

## Overview
This procedure covers the overhaul of the Cylinders on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('378e1014-ab4f-4157-8d52-212214cc39c2'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-CYL-TRO-gg6jug',
  'Diagnose and Repair Cylinders - Unimog U1000',
  'Hydraulics',
  'Cylinders',
  'Diagnose and Repair Cylinders - Unimog U1000',
  '# Diagnose and Repair Cylinders - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Cylinders on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b8fa5ffc-cc75-4f28-9f3d-b36e53de4c52'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-HOS-REM-2amw9r',
  'Remove and Install Hoses - Unimog U1000',
  'Hydraulics',
  'Hoses',
  'Remove and Install Hoses - Unimog U1000',
  '# Remove and Install Hoses - Unimog U1000

## Overview
This procedure covers the removal of the Hoses on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('dc3789f0-5034-41a8-9931-3dc7aee35493'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-HOS-INS-ez4l5c',
  'Inspect and Test Hoses - Unimog U1000',
  'Hydraulics',
  'Hoses',
  'Inspect and Test Hoses - Unimog U1000',
  '# Inspect and Test Hoses - Unimog U1000

## Overview
This procedure covers the inspection of the Hoses on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('62772a4e-890f-4c5a-9ff6-49c97debb24b'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-HOS-ADJ-5eg9wa',
  'Adjust and Calibrate Hoses - Unimog U1000',
  'Hydraulics',
  'Hoses',
  'Adjust and Calibrate Hoses - Unimog U1000',
  '# Adjust and Calibrate Hoses - Unimog U1000

## Overview
This procedure covers the adjustment of the Hoses on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('248e8398-8354-493b-8b8e-5a421b5760dc'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-HOS-REP-avneyh',
  'Replace Hoses - Unimog U1000',
  'Hydraulics',
  'Hoses',
  'Replace Hoses - Unimog U1000',
  '# Replace Hoses - Unimog U1000

## Overview
This procedure covers the replacement of the Hoses on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fe216bc8-cfe3-4b23-9635-94551cc8c14e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-HOS-OVE-y276ro',
  'Overhaul and Rebuild Hoses - Unimog U1000',
  'Hydraulics',
  'Hoses',
  'Overhaul and Rebuild Hoses - Unimog U1000',
  '# Overhaul and Rebuild Hoses - Unimog U1000

## Overview
This procedure covers the overhaul of the Hoses on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cdb0429c-f7a0-4011-843f-ab0750f3b036'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-HOS-TRO-i8tel',
  'Diagnose and Repair Hoses - Unimog U1000',
  'Hydraulics',
  'Hoses',
  'Diagnose and Repair Hoses - Unimog U1000',
  '# Diagnose and Repair Hoses - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Hoses on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fb81af2e-3163-43e5-808b-f000d8d2342a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-FIL-REM-lfk4uw',
  'Remove and Install Filters - Unimog U1000',
  'Hydraulics',
  'Filters',
  'Remove and Install Filters - Unimog U1000',
  '# Remove and Install Filters - Unimog U1000

## Overview
This procedure covers the removal of the Filters on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('deb2bdb9-0f7b-4cb7-a975-4dcbf5caad63'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-FIL-INS-jcwgmh',
  'Inspect and Test Filters - Unimog U1000',
  'Hydraulics',
  'Filters',
  'Inspect and Test Filters - Unimog U1000',
  '# Inspect and Test Filters - Unimog U1000

## Overview
This procedure covers the inspection of the Filters on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b7e54bec-c590-4318-920a-1d9e7c4f00fd'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-FIL-ADJ-v4vu25',
  'Adjust and Calibrate Filters - Unimog U1000',
  'Hydraulics',
  'Filters',
  'Adjust and Calibrate Filters - Unimog U1000',
  '# Adjust and Calibrate Filters - Unimog U1000

## Overview
This procedure covers the adjustment of the Filters on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6475e2d8-d103-469c-b61e-28e58e287934'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-FIL-REP-gjt9o',
  'Replace Filters - Unimog U1000',
  'Hydraulics',
  'Filters',
  'Replace Filters - Unimog U1000',
  '# Replace Filters - Unimog U1000

## Overview
This procedure covers the replacement of the Filters on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ebb43cec-d762-4b32-8517-84696c5d246a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-FIL-OVE-dy3rda',
  'Overhaul and Rebuild Filters - Unimog U1000',
  'Hydraulics',
  'Filters',
  'Overhaul and Rebuild Filters - Unimog U1000',
  '# Overhaul and Rebuild Filters - Unimog U1000

## Overview
This procedure covers the overhaul of the Filters on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('873ffbd5-1fb5-435e-8d8b-94bdd0a20474'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-HYD-FIL-TRO-torikk',
  'Diagnose and Repair Filters - Unimog U1000',
  'Hydraulics',
  'Filters',
  'Diagnose and Repair Filters - Unimog U1000',
  '# Diagnose and Repair Filters - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Filters on Unimog U1000 vehicles with OM366 engine.
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
- See U1000-Hyd-001 for system overview
- See U1000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9c884056-c4dc-49ee-8c3a-60357fe382ba'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-CAB-REM-a17a5w',
  'Remove and Install Cab - Unimog U1000',
  'Body',
  'Cab',
  'Remove and Install Cab - Unimog U1000',
  '# Remove and Install Cab - Unimog U1000

## Overview
This procedure covers the removal of the Cab on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('aee73740-cbb8-451b-9b97-596cab12b90a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-CAB-INS-m5fqke',
  'Inspect and Test Cab - Unimog U1000',
  'Body',
  'Cab',
  'Inspect and Test Cab - Unimog U1000',
  '# Inspect and Test Cab - Unimog U1000

## Overview
This procedure covers the inspection of the Cab on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('57e678f9-635d-4768-a02b-baa513b93113'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-CAB-ADJ-0ootwge',
  'Adjust and Calibrate Cab - Unimog U1000',
  'Body',
  'Cab',
  'Adjust and Calibrate Cab - Unimog U1000',
  '# Adjust and Calibrate Cab - Unimog U1000

## Overview
This procedure covers the adjustment of the Cab on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4a679cd1-7867-4614-a62f-baa0b92c4349'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-CAB-REP-sj1h2x',
  'Replace Cab - Unimog U1000',
  'Body',
  'Cab',
  'Replace Cab - Unimog U1000',
  '# Replace Cab - Unimog U1000

## Overview
This procedure covers the replacement of the Cab on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a6f2f7ad-fdc5-4dc7-89cb-fcf425ae71e3'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-CAB-OVE-lryddg',
  'Overhaul and Rebuild Cab - Unimog U1000',
  'Body',
  'Cab',
  'Overhaul and Rebuild Cab - Unimog U1000',
  '# Overhaul and Rebuild Cab - Unimog U1000

## Overview
This procedure covers the overhaul of the Cab on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4f7032e8-c15f-4e2d-a7ce-ef38d8d1844c'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-CAB-TRO-zhe37',
  'Diagnose and Repair Cab - Unimog U1000',
  'Body',
  'Cab',
  'Diagnose and Repair Cab - Unimog U1000',
  '# Diagnose and Repair Cab - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Cab on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5f43546b-f768-466e-8a0d-0fc1729f77b4'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-DOO-REM-67e8f',
  'Remove and Install Doors - Unimog U1000',
  'Body',
  'Doors',
  'Remove and Install Doors - Unimog U1000',
  '# Remove and Install Doors - Unimog U1000

## Overview
This procedure covers the removal of the Doors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('12b924a2-8d65-45ff-8755-5d45adc8c192'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-DOO-INS-ulo4t1',
  'Inspect and Test Doors - Unimog U1000',
  'Body',
  'Doors',
  'Inspect and Test Doors - Unimog U1000',
  '# Inspect and Test Doors - Unimog U1000

## Overview
This procedure covers the inspection of the Doors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6841a56e-a9a8-413c-a83b-deb245cf01ce'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-DOO-ADJ-n01b8',
  'Adjust and Calibrate Doors - Unimog U1000',
  'Body',
  'Doors',
  'Adjust and Calibrate Doors - Unimog U1000',
  '# Adjust and Calibrate Doors - Unimog U1000

## Overview
This procedure covers the adjustment of the Doors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('859d25f9-5774-42fe-b049-2f944eba86a7'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-DOO-REP-m8zit',
  'Replace Doors - Unimog U1000',
  'Body',
  'Doors',
  'Replace Doors - Unimog U1000',
  '# Replace Doors - Unimog U1000

## Overview
This procedure covers the replacement of the Doors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('64683984-5779-46e4-8902-0a1060214037'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-DOO-OVE-mj2832',
  'Overhaul and Rebuild Doors - Unimog U1000',
  'Body',
  'Doors',
  'Overhaul and Rebuild Doors - Unimog U1000',
  '# Overhaul and Rebuild Doors - Unimog U1000

## Overview
This procedure covers the overhaul of the Doors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('52633cb3-aec5-437d-9a5c-fc9f567c7732'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-DOO-TRO-ydxila',
  'Diagnose and Repair Doors - Unimog U1000',
  'Body',
  'Doors',
  'Diagnose and Repair Doors - Unimog U1000',
  '# Diagnose and Repair Doors - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Doors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('64719489-8403-4bc8-b07b-7f63729019a6'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-WIN-REM-vayhe',
  'Remove and Install Windows - Unimog U1000',
  'Body',
  'Windows',
  'Remove and Install Windows - Unimog U1000',
  '# Remove and Install Windows - Unimog U1000

## Overview
This procedure covers the removal of the Windows on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7bb0e5b9-713b-4f1c-a9c6-3a87df4a689e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-WIN-INS-xufka8',
  'Inspect and Test Windows - Unimog U1000',
  'Body',
  'Windows',
  'Inspect and Test Windows - Unimog U1000',
  '# Inspect and Test Windows - Unimog U1000

## Overview
This procedure covers the inspection of the Windows on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d4616bac-65c4-4ccc-9e81-61f131463193'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-WIN-ADJ-hy3rl',
  'Adjust and Calibrate Windows - Unimog U1000',
  'Body',
  'Windows',
  'Adjust and Calibrate Windows - Unimog U1000',
  '# Adjust and Calibrate Windows - Unimog U1000

## Overview
This procedure covers the adjustment of the Windows on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('35255eaf-bb87-48ec-b561-18a0d9bdae8b'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-WIN-REP-vy7sff',
  'Replace Windows - Unimog U1000',
  'Body',
  'Windows',
  'Replace Windows - Unimog U1000',
  '# Replace Windows - Unimog U1000

## Overview
This procedure covers the replacement of the Windows on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c8d5df8f-0ac2-4c5e-a7b2-0096d80fe45c'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-WIN-OVE-kyay8',
  'Overhaul and Rebuild Windows - Unimog U1000',
  'Body',
  'Windows',
  'Overhaul and Rebuild Windows - Unimog U1000',
  '# Overhaul and Rebuild Windows - Unimog U1000

## Overview
This procedure covers the overhaul of the Windows on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('47365c7d-d0f0-45c2-aa79-16bd834957ef'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-WIN-TRO-x544ji',
  'Diagnose and Repair Windows - Unimog U1000',
  'Body',
  'Windows',
  'Diagnose and Repair Windows - Unimog U1000',
  '# Diagnose and Repair Windows - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Windows on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2705e164-ed2b-4a56-910f-4961d66c8df7'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-MIR-REM-hd5sl',
  'Remove and Install Mirrors - Unimog U1000',
  'Body',
  'Mirrors',
  'Remove and Install Mirrors - Unimog U1000',
  '# Remove and Install Mirrors - Unimog U1000

## Overview
This procedure covers the removal of the Mirrors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9f592a33-f56d-45a6-9778-592252886570'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-MIR-INS-dk6ezsh',
  'Inspect and Test Mirrors - Unimog U1000',
  'Body',
  'Mirrors',
  'Inspect and Test Mirrors - Unimog U1000',
  '# Inspect and Test Mirrors - Unimog U1000

## Overview
This procedure covers the inspection of the Mirrors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a5975468-c52a-4813-9aad-c67432934830'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-MIR-ADJ-rubspr',
  'Adjust and Calibrate Mirrors - Unimog U1000',
  'Body',
  'Mirrors',
  'Adjust and Calibrate Mirrors - Unimog U1000',
  '# Adjust and Calibrate Mirrors - Unimog U1000

## Overview
This procedure covers the adjustment of the Mirrors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('536ee818-8ea6-4b7b-b1fc-5f12aca8194a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-MIR-REP-cbqqoi',
  'Replace Mirrors - Unimog U1000',
  'Body',
  'Mirrors',
  'Replace Mirrors - Unimog U1000',
  '# Replace Mirrors - Unimog U1000

## Overview
This procedure covers the replacement of the Mirrors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('12b692f6-bce7-47e2-a954-afa44eb12812'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-MIR-OVE-w6y6us',
  'Overhaul and Rebuild Mirrors - Unimog U1000',
  'Body',
  'Mirrors',
  'Overhaul and Rebuild Mirrors - Unimog U1000',
  '# Overhaul and Rebuild Mirrors - Unimog U1000

## Overview
This procedure covers the overhaul of the Mirrors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4d1a1d4d-4ba6-4afd-bdd2-fc48a42ea503'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-MIR-TRO-r7x4xh',
  'Diagnose and Repair Mirrors - Unimog U1000',
  'Body',
  'Mirrors',
  'Diagnose and Repair Mirrors - Unimog U1000',
  '# Diagnose and Repair Mirrors - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Mirrors on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e9446f47-0524-4876-854b-c63b1c106e34'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-SEA-REM-6s2jis',
  'Remove and Install Seats - Unimog U1000',
  'Body',
  'Seats',
  'Remove and Install Seats - Unimog U1000',
  '# Remove and Install Seats - Unimog U1000

## Overview
This procedure covers the removal of the Seats on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8ed3cca2-0760-4a61-b31c-1f853be130a9'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-SEA-INS-jtr7z',
  'Inspect and Test Seats - Unimog U1000',
  'Body',
  'Seats',
  'Inspect and Test Seats - Unimog U1000',
  '# Inspect and Test Seats - Unimog U1000

## Overview
This procedure covers the inspection of the Seats on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('306ca05c-b31f-470e-a08b-f72ad4e928bc'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-SEA-ADJ-ualgi',
  'Adjust and Calibrate Seats - Unimog U1000',
  'Body',
  'Seats',
  'Adjust and Calibrate Seats - Unimog U1000',
  '# Adjust and Calibrate Seats - Unimog U1000

## Overview
This procedure covers the adjustment of the Seats on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('655c5d74-6534-4205-afd8-76d1e2dace2a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-SEA-REP-dg94mf',
  'Replace Seats - Unimog U1000',
  'Body',
  'Seats',
  'Replace Seats - Unimog U1000',
  '# Replace Seats - Unimog U1000

## Overview
This procedure covers the replacement of the Seats on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f93a3402-705d-43dd-8204-0662919c0aa6'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-SEA-OVE-ml8j8z',
  'Overhaul and Rebuild Seats - Unimog U1000',
  'Body',
  'Seats',
  'Overhaul and Rebuild Seats - Unimog U1000',
  '# Overhaul and Rebuild Seats - Unimog U1000

## Overview
This procedure covers the overhaul of the Seats on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f548da69-8e0e-465e-83f8-60ca28384463'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-BOD-SEA-TRO-olf1bq',
  'Diagnose and Repair Seats - Unimog U1000',
  'Body',
  'Seats',
  'Diagnose and Repair Seats - Unimog U1000',
  '# Diagnose and Repair Seats - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Seats on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Bod-001 for system overview
- See U1000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d8a290ec-ad7f-4257-8dec-4ea05470c071'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-WIN-REM-gd3oy',
  'Remove and Install Winch - Unimog U1000',
  'Special Equipment',
  'Winch',
  'Remove and Install Winch - Unimog U1000',
  '# Remove and Install Winch - Unimog U1000

## Overview
This procedure covers the removal of the Winch on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8d3392e9-ecb5-4ee3-bd1c-7fa8caad1a6e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-WIN-INS-8edyhv',
  'Inspect and Test Winch - Unimog U1000',
  'Special Equipment',
  'Winch',
  'Inspect and Test Winch - Unimog U1000',
  '# Inspect and Test Winch - Unimog U1000

## Overview
This procedure covers the inspection of the Winch on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('469d3eef-1bd1-4605-8eee-bb192168108d'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-WIN-ADJ-tzh2kq',
  'Adjust and Calibrate Winch - Unimog U1000',
  'Special Equipment',
  'Winch',
  'Adjust and Calibrate Winch - Unimog U1000',
  '# Adjust and Calibrate Winch - Unimog U1000

## Overview
This procedure covers the adjustment of the Winch on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('233954af-3fbc-4693-b4c1-b77d5997fade'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-WIN-REP-jnu6ig',
  'Replace Winch - Unimog U1000',
  'Special Equipment',
  'Winch',
  'Replace Winch - Unimog U1000',
  '# Replace Winch - Unimog U1000

## Overview
This procedure covers the replacement of the Winch on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0f8819e6-4f66-4425-9c2a-2943a268a579'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-WIN-OVE-fzemek',
  'Overhaul and Rebuild Winch - Unimog U1000',
  'Special Equipment',
  'Winch',
  'Overhaul and Rebuild Winch - Unimog U1000',
  '# Overhaul and Rebuild Winch - Unimog U1000

## Overview
This procedure covers the overhaul of the Winch on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a89e9a65-6e21-4557-a856-4ac830fc66b2'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-WIN-TRO-zlslpg',
  'Diagnose and Repair Winch - Unimog U1000',
  'Special Equipment',
  'Winch',
  'Diagnose and Repair Winch - Unimog U1000',
  '# Diagnose and Repair Winch - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Winch on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b781e13b-13c3-4b45-81d0-0a8b590baf2b'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-CRA-REM-fhy5c',
  'Remove and Install Crane - Unimog U1000',
  'Special Equipment',
  'Crane',
  'Remove and Install Crane - Unimog U1000',
  '# Remove and Install Crane - Unimog U1000

## Overview
This procedure covers the removal of the Crane on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('951b693a-bcb6-452a-8118-1db2fd0cbbbb'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-CRA-INS-odtr32',
  'Inspect and Test Crane - Unimog U1000',
  'Special Equipment',
  'Crane',
  'Inspect and Test Crane - Unimog U1000',
  '# Inspect and Test Crane - Unimog U1000

## Overview
This procedure covers the inspection of the Crane on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9dfb1c87-cfaa-4942-9046-94b0b4b9bef2'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-CRA-ADJ-dqxl1m',
  'Adjust and Calibrate Crane - Unimog U1000',
  'Special Equipment',
  'Crane',
  'Adjust and Calibrate Crane - Unimog U1000',
  '# Adjust and Calibrate Crane - Unimog U1000

## Overview
This procedure covers the adjustment of the Crane on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('efb46de9-f8d1-4414-bb51-80934ed1492e'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-CRA-REP-ge31m',
  'Replace Crane - Unimog U1000',
  'Special Equipment',
  'Crane',
  'Replace Crane - Unimog U1000',
  '# Replace Crane - Unimog U1000

## Overview
This procedure covers the replacement of the Crane on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('490b29bc-6e5c-4234-a1bd-c3eecf8c2255'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-CRA-OVE-wmsych',
  'Overhaul and Rebuild Crane - Unimog U1000',
  'Special Equipment',
  'Crane',
  'Overhaul and Rebuild Crane - Unimog U1000',
  '# Overhaul and Rebuild Crane - Unimog U1000

## Overview
This procedure covers the overhaul of the Crane on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2c0a4690-729b-4475-b04d-4410ddcf2a0b'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-CRA-TRO-g5wg3l',
  'Diagnose and Repair Crane - Unimog U1000',
  'Special Equipment',
  'Crane',
  'Diagnose and Repair Crane - Unimog U1000',
  '# Diagnose and Repair Crane - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Crane on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('165a80c4-72ff-4213-a5d2-63e7773f1564'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-SNO-REM-a85lni',
  'Remove and Install Snow Plow - Unimog U1000',
  'Special Equipment',
  'Snow Plow',
  'Remove and Install Snow Plow - Unimog U1000',
  '# Remove and Install Snow Plow - Unimog U1000

## Overview
This procedure covers the removal of the Snow Plow on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9f1571d2-6086-4cf7-bb34-52f06cadcf31'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-SNO-INS-asm91a',
  'Inspect and Test Snow Plow - Unimog U1000',
  'Special Equipment',
  'Snow Plow',
  'Inspect and Test Snow Plow - Unimog U1000',
  '# Inspect and Test Snow Plow - Unimog U1000

## Overview
This procedure covers the inspection of the Snow Plow on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('694f7ef4-1c70-4e30-9e2d-8f3e6c00d346'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-SNO-ADJ-3ojm7c',
  'Adjust and Calibrate Snow Plow - Unimog U1000',
  'Special Equipment',
  'Snow Plow',
  'Adjust and Calibrate Snow Plow - Unimog U1000',
  '# Adjust and Calibrate Snow Plow - Unimog U1000

## Overview
This procedure covers the adjustment of the Snow Plow on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('200cb809-9cf0-4242-a027-a06bf368c1dc'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-SNO-REP-9mj1jr',
  'Replace Snow Plow - Unimog U1000',
  'Special Equipment',
  'Snow Plow',
  'Replace Snow Plow - Unimog U1000',
  '# Replace Snow Plow - Unimog U1000

## Overview
This procedure covers the replacement of the Snow Plow on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0ba5e7de-31a8-4f7a-a026-b05e5aefc45d'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-SNO-OVE-68xqgl',
  'Overhaul and Rebuild Snow Plow - Unimog U1000',
  'Special Equipment',
  'Snow Plow',
  'Overhaul and Rebuild Snow Plow - Unimog U1000',
  '# Overhaul and Rebuild Snow Plow - Unimog U1000

## Overview
This procedure covers the overhaul of the Snow Plow on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e586525a-9780-4a4a-a01a-46ddeb812779'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-SNO-TRO-2g3ife',
  'Diagnose and Repair Snow Plow - Unimog U1000',
  'Special Equipment',
  'Snow Plow',
  'Diagnose and Repair Snow Plow - Unimog U1000',
  '# Diagnose and Repair Snow Plow - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Snow Plow on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4dd2cbe4-24c6-4d07-b90c-6249345e7519'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-IMP-REM-4mj5h4',
  'Remove and Install Implement Carrier - Unimog U1000',
  'Special Equipment',
  'Implement Carrier',
  'Remove and Install Implement Carrier - Unimog U1000',
  '# Remove and Install Implement Carrier - Unimog U1000

## Overview
This procedure covers the removal of the Implement Carrier on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ecc9404a-36ed-4e1f-87b0-39d603e2d016'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-IMP-INS-fxcibi',
  'Inspect and Test Implement Carrier - Unimog U1000',
  'Special Equipment',
  'Implement Carrier',
  'Inspect and Test Implement Carrier - Unimog U1000',
  '# Inspect and Test Implement Carrier - Unimog U1000

## Overview
This procedure covers the inspection of the Implement Carrier on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('69b4e127-7d44-4a5a-b96c-d28f25a17094'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-IMP-ADJ-nblfhr',
  'Adjust and Calibrate Implement Carrier - Unimog U1000',
  'Special Equipment',
  'Implement Carrier',
  'Adjust and Calibrate Implement Carrier - Unimog U1000',
  '# Adjust and Calibrate Implement Carrier - Unimog U1000

## Overview
This procedure covers the adjustment of the Implement Carrier on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('848e7e39-3061-44fc-9877-95aee75f15f9'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-IMP-REP-j5xds',
  'Replace Implement Carrier - Unimog U1000',
  'Special Equipment',
  'Implement Carrier',
  'Replace Implement Carrier - Unimog U1000',
  '# Replace Implement Carrier - Unimog U1000

## Overview
This procedure covers the replacement of the Implement Carrier on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f4167574-95fe-453c-b7e4-259f7b151eca'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-IMP-OVE-mqt8pl',
  'Overhaul and Rebuild Implement Carrier - Unimog U1000',
  'Special Equipment',
  'Implement Carrier',
  'Overhaul and Rebuild Implement Carrier - Unimog U1000',
  '# Overhaul and Rebuild Implement Carrier - Unimog U1000

## Overview
This procedure covers the overhaul of the Implement Carrier on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('77d40471-97d6-4ce5-a8c5-70536e3a8f97'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-IMP-TRO-lle4gg',
  'Diagnose and Repair Implement Carrier - Unimog U1000',
  'Special Equipment',
  'Implement Carrier',
  'Diagnose and Repair Implement Carrier - Unimog U1000',
  '# Diagnose and Repair Implement Carrier - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Implement Carrier on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ac0c247f-4dcf-4ed1-8b4d-7c40fb101826'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-TIP-REM-vq71c',
  'Remove and Install Tipper - Unimog U1000',
  'Special Equipment',
  'Tipper',
  'Remove and Install Tipper - Unimog U1000',
  '# Remove and Install Tipper - Unimog U1000

## Overview
This procedure covers the removal of the Tipper on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('69fe09be-30df-4237-ad34-8026020be2b5'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-TIP-INS-snu1f',
  'Inspect and Test Tipper - Unimog U1000',
  'Special Equipment',
  'Tipper',
  'Inspect and Test Tipper - Unimog U1000',
  '# Inspect and Test Tipper - Unimog U1000

## Overview
This procedure covers the inspection of the Tipper on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('34a5d5bf-e69d-4432-8460-5276c7376cbb'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-TIP-ADJ-dcbm9h',
  'Adjust and Calibrate Tipper - Unimog U1000',
  'Special Equipment',
  'Tipper',
  'Adjust and Calibrate Tipper - Unimog U1000',
  '# Adjust and Calibrate Tipper - Unimog U1000

## Overview
This procedure covers the adjustment of the Tipper on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('761d7e51-5622-491e-b4b5-2992aecadaec'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-TIP-REP-5h36ak',
  'Replace Tipper - Unimog U1000',
  'Special Equipment',
  'Tipper',
  'Replace Tipper - Unimog U1000',
  '# Replace Tipper - Unimog U1000

## Overview
This procedure covers the replacement of the Tipper on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2b1c7989-852f-4787-a4df-556a9443a09a'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-TIP-OVE-wn6o0e',
  'Overhaul and Rebuild Tipper - Unimog U1000',
  'Special Equipment',
  'Tipper',
  'Overhaul and Rebuild Tipper - Unimog U1000',
  '# Overhaul and Rebuild Tipper - Unimog U1000

## Overview
This procedure covers the overhaul of the Tipper on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fe46d494-b13f-44f3-83bb-ad226df65e21'),
  uuid('cccc0001-cccc-cccc-cccc-cccccccccccc'),
  'U1000-SPE-TIP-TRO-hoh7em',
  'Diagnose and Repair Tipper - Unimog U1000',
  'Special Equipment',
  'Tipper',
  'Diagnose and Repair Tipper - Unimog U1000',
  '# Diagnose and Repair Tipper - Unimog U1000

## Overview
This procedure covers the troubleshooting of the Tipper on Unimog U1000 vehicles with OM366 engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1000-Spe-001 for system overview
- See U1000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('13190496-c186-4ef1-ba6d-3302a27903f7'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-OIL-REM-rbep8qv',
  'Remove and Install Oil System - Unimog U1200',
  'Engine',
  'Oil System',
  'Remove and Install Oil System - Unimog U1200',
  '# Remove and Install Oil System - Unimog U1200

## Overview
This procedure covers the removal of the Oil System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b50d9cc9-1127-4622-8d60-5ab453069e26'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-OIL-INS-i7zy7f',
  'Inspect and Test Oil System - Unimog U1200',
  'Engine',
  'Oil System',
  'Inspect and Test Oil System - Unimog U1200',
  '# Inspect and Test Oil System - Unimog U1200

## Overview
This procedure covers the inspection of the Oil System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('eadca417-503e-4ef7-92b2-604df5a935ff'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-OIL-ADJ-6mojki',
  'Adjust and Calibrate Oil System - Unimog U1200',
  'Engine',
  'Oil System',
  'Adjust and Calibrate Oil System - Unimog U1200',
  '# Adjust and Calibrate Oil System - Unimog U1200

## Overview
This procedure covers the adjustment of the Oil System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c2c32460-0d9b-460c-aa45-6b737fc19dbf'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-OIL-REP-i1mz85',
  'Replace Oil System - Unimog U1200',
  'Engine',
  'Oil System',
  'Replace Oil System - Unimog U1200',
  '# Replace Oil System - Unimog U1200

## Overview
This procedure covers the replacement of the Oil System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('75c1b2dd-bf35-4040-ac83-52842ccfe99f'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-OIL-OVE-wptzkk',
  'Overhaul and Rebuild Oil System - Unimog U1200',
  'Engine',
  'Oil System',
  'Overhaul and Rebuild Oil System - Unimog U1200',
  '# Overhaul and Rebuild Oil System - Unimog U1200

## Overview
This procedure covers the overhaul of the Oil System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e0562f1e-ff68-4e9e-9666-1236a8b7b7f6'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-OIL-TRO-1qhyxc',
  'Diagnose and Repair Oil System - Unimog U1200',
  'Engine',
  'Oil System',
  'Diagnose and Repair Oil System - Unimog U1200',
  '# Diagnose and Repair Oil System - Unimog U1200

## Overview
This procedure covers the troubleshooting of the Oil System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bec35ec1-c636-4c5e-be26-2cf520f71958'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-COO-REM-l5vapv',
  'Remove and Install Cooling System - Unimog U1200',
  'Engine',
  'Cooling System',
  'Remove and Install Cooling System - Unimog U1200',
  '# Remove and Install Cooling System - Unimog U1200

## Overview
This procedure covers the removal of the Cooling System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8daa2057-191b-4866-b3d4-3939027eeff9'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-COO-INS-0oqiwm',
  'Inspect and Test Cooling System - Unimog U1200',
  'Engine',
  'Cooling System',
  'Inspect and Test Cooling System - Unimog U1200',
  '# Inspect and Test Cooling System - Unimog U1200

## Overview
This procedure covers the inspection of the Cooling System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('660ecb6d-eccc-49c6-bb8e-58422ea2601e'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-COO-ADJ-117fth',
  'Adjust and Calibrate Cooling System - Unimog U1200',
  'Engine',
  'Cooling System',
  'Adjust and Calibrate Cooling System - Unimog U1200',
  '# Adjust and Calibrate Cooling System - Unimog U1200

## Overview
This procedure covers the adjustment of the Cooling System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7a23fdd8-e757-42b3-9b91-cc7cbe5bd559'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-COO-REP-ogy3ao',
  'Replace Cooling System - Unimog U1200',
  'Engine',
  'Cooling System',
  'Replace Cooling System - Unimog U1200',
  '# Replace Cooling System - Unimog U1200

## Overview
This procedure covers the replacement of the Cooling System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e7b50124-b81b-4085-80a8-a81e360e75b2'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-COO-OVE-v2dtn7',
  'Overhaul and Rebuild Cooling System - Unimog U1200',
  'Engine',
  'Cooling System',
  'Overhaul and Rebuild Cooling System - Unimog U1200',
  '# Overhaul and Rebuild Cooling System - Unimog U1200

## Overview
This procedure covers the overhaul of the Cooling System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5e30504c-246e-40c8-b7f5-81c54709f80f'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-COO-TRO-7d5f4w',
  'Diagnose and Repair Cooling System - Unimog U1200',
  'Engine',
  'Cooling System',
  'Diagnose and Repair Cooling System - Unimog U1200',
  '# Diagnose and Repair Cooling System - Unimog U1200

## Overview
This procedure covers the troubleshooting of the Cooling System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b3fe184b-ef33-470b-beda-2c863b9dee2f'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-FUE-REM-5k8aba',
  'Remove and Install Fuel System - Unimog U1200',
  'Engine',
  'Fuel System',
  'Remove and Install Fuel System - Unimog U1200',
  '# Remove and Install Fuel System - Unimog U1200

## Overview
This procedure covers the removal of the Fuel System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fe3b1105-7139-4a8d-9232-972d407ed402'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-FUE-INS-wpz3x',
  'Inspect and Test Fuel System - Unimog U1200',
  'Engine',
  'Fuel System',
  'Inspect and Test Fuel System - Unimog U1200',
  '# Inspect and Test Fuel System - Unimog U1200

## Overview
This procedure covers the inspection of the Fuel System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('90db7c56-004b-4c07-8feb-06b663845868'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-FUE-ADJ-hjoh5k',
  'Adjust and Calibrate Fuel System - Unimog U1200',
  'Engine',
  'Fuel System',
  'Adjust and Calibrate Fuel System - Unimog U1200',
  '# Adjust and Calibrate Fuel System - Unimog U1200

## Overview
This procedure covers the adjustment of the Fuel System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b9eca3c2-c3f2-4903-8028-94654db09da0'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-FUE-REP-smh6gy',
  'Replace Fuel System - Unimog U1200',
  'Engine',
  'Fuel System',
  'Replace Fuel System - Unimog U1200',
  '# Replace Fuel System - Unimog U1200

## Overview
This procedure covers the replacement of the Fuel System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('00cac7eb-1db1-4131-b338-52524aaa4fc0'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-FUE-OVE-9shb7b',
  'Overhaul and Rebuild Fuel System - Unimog U1200',
  'Engine',
  'Fuel System',
  'Overhaul and Rebuild Fuel System - Unimog U1200',
  '# Overhaul and Rebuild Fuel System - Unimog U1200

## Overview
This procedure covers the overhaul of the Fuel System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e83e9a49-e05e-4cc0-9949-d0d21d17c054'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-FUE-TRO-nducp',
  'Diagnose and Repair Fuel System - Unimog U1200',
  'Engine',
  'Fuel System',
  'Diagnose and Repair Fuel System - Unimog U1200',
  '# Diagnose and Repair Fuel System - Unimog U1200

## Overview
This procedure covers the troubleshooting of the Fuel System on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('dc9f94a1-dd21-4e5e-bf13-41a9b6bc221e'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-AIR-REM-r13ruf',
  'Remove and Install Air Intake - Unimog U1200',
  'Engine',
  'Air Intake',
  'Remove and Install Air Intake - Unimog U1200',
  '# Remove and Install Air Intake - Unimog U1200

## Overview
This procedure covers the removal of the Air Intake on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a62cb161-5c17-499c-9cd2-5042dfff6f51'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-AIR-INS-3eyk4c',
  'Inspect and Test Air Intake - Unimog U1200',
  'Engine',
  'Air Intake',
  'Inspect and Test Air Intake - Unimog U1200',
  '# Inspect and Test Air Intake - Unimog U1200

## Overview
This procedure covers the inspection of the Air Intake on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('233f003e-e1bc-44d5-adca-0d90e9bc515f'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-AIR-ADJ-d6yrar',
  'Adjust and Calibrate Air Intake - Unimog U1200',
  'Engine',
  'Air Intake',
  'Adjust and Calibrate Air Intake - Unimog U1200',
  '# Adjust and Calibrate Air Intake - Unimog U1200

## Overview
This procedure covers the adjustment of the Air Intake on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8e2eac99-1e08-4cf2-b3e6-9c28369e6630'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-AIR-REP-9mn13b',
  'Replace Air Intake - Unimog U1200',
  'Engine',
  'Air Intake',
  'Replace Air Intake - Unimog U1200',
  '# Replace Air Intake - Unimog U1200

## Overview
This procedure covers the replacement of the Air Intake on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('07deef83-cc33-476a-9c0a-4f3396e09ec5'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-AIR-OVE-5km3a6',
  'Overhaul and Rebuild Air Intake - Unimog U1200',
  'Engine',
  'Air Intake',
  'Overhaul and Rebuild Air Intake - Unimog U1200',
  '# Overhaul and Rebuild Air Intake - Unimog U1200

## Overview
This procedure covers the overhaul of the Air Intake on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a026c0f0-4deb-460e-8a61-f19260ecf782'),
  uuid('cccc0003-cccc-cccc-cccc-cccccccccccc'),
  'U1200-ENG-AIR-TRO-2jdfil',
  'Diagnose and Repair Air Intake - Unimog U1200',
  'Engine',
  'Air Intake',
  'Diagnose and Repair Air Intake - Unimog U1200',
  '# Diagnose and Repair Air Intake - Unimog U1200

## Overview
This procedure covers the troubleshooting of the Air Intake on Unimog U1200 vehicles with OM366 engine.
Applicable to model years: 1985-2000

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
- See U1200-Eng-001 for system overview
- See U1200-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
);

-- Verify this chunk
SELECT COUNT(*) as procedures_in_db FROM wis_procedures;
