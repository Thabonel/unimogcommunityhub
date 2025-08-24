-- WIS Procedures Import - Chunk 18
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 18 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('a0154b67-15c6-4ccd-a784-8175e6d6d067'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-FIL-ADJ-uxnjx',
  'Adjust and Calibrate Filters - Unimog U1400',
  'Hydraulics',
  'Filters',
  'Adjust and Calibrate Filters - Unimog U1400',
  '# Adjust and Calibrate Filters - Unimog U1400

## Overview
This procedure covers the adjustment of the Filters on Unimog U1400 vehicles with OM366A engine.
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
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a2a5bebc-ac22-4863-844f-dd3e3e9dadce'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-FIL-REP-wvtlk',
  'Replace Filters - Unimog U1400',
  'Hydraulics',
  'Filters',
  'Replace Filters - Unimog U1400',
  '# Replace Filters - Unimog U1400

## Overview
This procedure covers the replacement of the Filters on Unimog U1400 vehicles with OM366A engine.
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
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d211547f-f527-422a-98f0-abdfb67339c6'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-FIL-OVE-8xhdz',
  'Overhaul and Rebuild Filters - Unimog U1400',
  'Hydraulics',
  'Filters',
  'Overhaul and Rebuild Filters - Unimog U1400',
  '# Overhaul and Rebuild Filters - Unimog U1400

## Overview
This procedure covers the overhaul of the Filters on Unimog U1400 vehicles with OM366A engine.
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
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ba7597c6-9636-4110-a195-ac85d7283d5c'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-HYD-FIL-TRO-o4kya9',
  'Diagnose and Repair Filters - Unimog U1400',
  'Hydraulics',
  'Filters',
  'Diagnose and Repair Filters - Unimog U1400',
  '# Diagnose and Repair Filters - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Filters on Unimog U1400 vehicles with OM366A engine.
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
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0251304b-93ef-46b9-8fe9-5716d1c04fd5'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-CAB-REM-9jyumd',
  'Remove and Install Cab - Unimog U1400',
  'Body',
  'Cab',
  'Remove and Install Cab - Unimog U1400',
  '# Remove and Install Cab - Unimog U1400

## Overview
This procedure covers the removal of the Cab on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e55f30a3-be30-4484-8eb4-a639396a5363'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-CAB-INS-znc9vk',
  'Inspect and Test Cab - Unimog U1400',
  'Body',
  'Cab',
  'Inspect and Test Cab - Unimog U1400',
  '# Inspect and Test Cab - Unimog U1400

## Overview
This procedure covers the inspection of the Cab on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ad957e7c-d3b0-4b74-bf90-1c1fc28a27f1'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-CAB-ADJ-xyzh5',
  'Adjust and Calibrate Cab - Unimog U1400',
  'Body',
  'Cab',
  'Adjust and Calibrate Cab - Unimog U1400',
  '# Adjust and Calibrate Cab - Unimog U1400

## Overview
This procedure covers the adjustment of the Cab on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d4d039d5-81bb-402a-a42d-79df6d420325'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-CAB-REP-ubol6c',
  'Replace Cab - Unimog U1400',
  'Body',
  'Cab',
  'Replace Cab - Unimog U1400',
  '# Replace Cab - Unimog U1400

## Overview
This procedure covers the replacement of the Cab on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c6282681-d5e8-40bc-9f1d-e4a7531820a0'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-CAB-OVE-zha2ng',
  'Overhaul and Rebuild Cab - Unimog U1400',
  'Body',
  'Cab',
  'Overhaul and Rebuild Cab - Unimog U1400',
  '# Overhaul and Rebuild Cab - Unimog U1400

## Overview
This procedure covers the overhaul of the Cab on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0e8f14d3-14e7-4ac6-9bd3-5b9b3e46f120'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-CAB-TRO-hxc11u',
  'Diagnose and Repair Cab - Unimog U1400',
  'Body',
  'Cab',
  'Diagnose and Repair Cab - Unimog U1400',
  '# Diagnose and Repair Cab - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Cab on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3d172417-f6a4-4222-a7ea-494d6c5bdf64'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-DOO-REM-nc5ace',
  'Remove and Install Doors - Unimog U1400',
  'Body',
  'Doors',
  'Remove and Install Doors - Unimog U1400',
  '# Remove and Install Doors - Unimog U1400

## Overview
This procedure covers the removal of the Doors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f4af0b97-a64e-4573-942e-2cbc779c47ed'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-DOO-INS-bjlm0a',
  'Inspect and Test Doors - Unimog U1400',
  'Body',
  'Doors',
  'Inspect and Test Doors - Unimog U1400',
  '# Inspect and Test Doors - Unimog U1400

## Overview
This procedure covers the inspection of the Doors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fbb1d555-06f4-4a1f-adb7-6f8b00b22914'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-DOO-ADJ-p1j4ieu',
  'Adjust and Calibrate Doors - Unimog U1400',
  'Body',
  'Doors',
  'Adjust and Calibrate Doors - Unimog U1400',
  '# Adjust and Calibrate Doors - Unimog U1400

## Overview
This procedure covers the adjustment of the Doors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1e7713d4-a41e-4543-ba91-c31875dcf8e8'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-DOO-REP-nuy8m2',
  'Replace Doors - Unimog U1400',
  'Body',
  'Doors',
  'Replace Doors - Unimog U1400',
  '# Replace Doors - Unimog U1400

## Overview
This procedure covers the replacement of the Doors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1f680733-d676-42fd-9d96-8f0716a22da2'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-DOO-OVE-sr5s1',
  'Overhaul and Rebuild Doors - Unimog U1400',
  'Body',
  'Doors',
  'Overhaul and Rebuild Doors - Unimog U1400',
  '# Overhaul and Rebuild Doors - Unimog U1400

## Overview
This procedure covers the overhaul of the Doors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('453da2fd-56f0-4733-88ac-b83e10fd0aa4'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-DOO-TRO-k5wcvf',
  'Diagnose and Repair Doors - Unimog U1400',
  'Body',
  'Doors',
  'Diagnose and Repair Doors - Unimog U1400',
  '# Diagnose and Repair Doors - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Doors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('65f413c5-a45d-468e-aeab-e770a7068d23'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-WIN-REM-uo6ka',
  'Remove and Install Windows - Unimog U1400',
  'Body',
  'Windows',
  'Remove and Install Windows - Unimog U1400',
  '# Remove and Install Windows - Unimog U1400

## Overview
This procedure covers the removal of the Windows on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ecfc1ecc-2f78-4f92-b4b2-5cf419405708'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-WIN-INS-irmvqf',
  'Inspect and Test Windows - Unimog U1400',
  'Body',
  'Windows',
  'Inspect and Test Windows - Unimog U1400',
  '# Inspect and Test Windows - Unimog U1400

## Overview
This procedure covers the inspection of the Windows on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1d282496-7191-412c-ba4d-ad70cb3502d7'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-WIN-ADJ-66lbcd',
  'Adjust and Calibrate Windows - Unimog U1400',
  'Body',
  'Windows',
  'Adjust and Calibrate Windows - Unimog U1400',
  '# Adjust and Calibrate Windows - Unimog U1400

## Overview
This procedure covers the adjustment of the Windows on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6e7e20c0-5657-4a5d-8eb6-353a8bc9f183'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-WIN-REP-boh5ga',
  'Replace Windows - Unimog U1400',
  'Body',
  'Windows',
  'Replace Windows - Unimog U1400',
  '# Replace Windows - Unimog U1400

## Overview
This procedure covers the replacement of the Windows on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3d5cb308-a60d-463e-bb6f-6a4d02b0e060'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-WIN-OVE-w2qcjz',
  'Overhaul and Rebuild Windows - Unimog U1400',
  'Body',
  'Windows',
  'Overhaul and Rebuild Windows - Unimog U1400',
  '# Overhaul and Rebuild Windows - Unimog U1400

## Overview
This procedure covers the overhaul of the Windows on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('623458f3-43c4-4964-8544-bfbd158b4a1a'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-WIN-TRO-fajf5c',
  'Diagnose and Repair Windows - Unimog U1400',
  'Body',
  'Windows',
  'Diagnose and Repair Windows - Unimog U1400',
  '# Diagnose and Repair Windows - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Windows on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f0f7bd62-c0bc-43d9-a828-eab5845955e7'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-MIR-REM-317tjc',
  'Remove and Install Mirrors - Unimog U1400',
  'Body',
  'Mirrors',
  'Remove and Install Mirrors - Unimog U1400',
  '# Remove and Install Mirrors - Unimog U1400

## Overview
This procedure covers the removal of the Mirrors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3cfdcf87-69d0-4532-a129-7328792f755e'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-MIR-INS-tc22ve9',
  'Inspect and Test Mirrors - Unimog U1400',
  'Body',
  'Mirrors',
  'Inspect and Test Mirrors - Unimog U1400',
  '# Inspect and Test Mirrors - Unimog U1400

## Overview
This procedure covers the inspection of the Mirrors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2101b3f5-bdd5-4fe1-89d2-f45eee53aac6'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-MIR-ADJ-3bb5a7',
  'Adjust and Calibrate Mirrors - Unimog U1400',
  'Body',
  'Mirrors',
  'Adjust and Calibrate Mirrors - Unimog U1400',
  '# Adjust and Calibrate Mirrors - Unimog U1400

## Overview
This procedure covers the adjustment of the Mirrors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b63c769d-772e-4c5d-a332-626beee91695'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-MIR-REP-p7diw',
  'Replace Mirrors - Unimog U1400',
  'Body',
  'Mirrors',
  'Replace Mirrors - Unimog U1400',
  '# Replace Mirrors - Unimog U1400

## Overview
This procedure covers the replacement of the Mirrors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d03a6dc6-adec-4707-8d34-7f9dae718831'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-MIR-OVE-7ahya',
  'Overhaul and Rebuild Mirrors - Unimog U1400',
  'Body',
  'Mirrors',
  'Overhaul and Rebuild Mirrors - Unimog U1400',
  '# Overhaul and Rebuild Mirrors - Unimog U1400

## Overview
This procedure covers the overhaul of the Mirrors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('408b2711-593a-4e0e-8879-ef936780780c'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-MIR-TRO-lzmgd',
  'Diagnose and Repair Mirrors - Unimog U1400',
  'Body',
  'Mirrors',
  'Diagnose and Repair Mirrors - Unimog U1400',
  '# Diagnose and Repair Mirrors - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Mirrors on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e144399b-8eeb-4d1a-b515-b3ff954fa406'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-SEA-REM-izw50d',
  'Remove and Install Seats - Unimog U1400',
  'Body',
  'Seats',
  'Remove and Install Seats - Unimog U1400',
  '# Remove and Install Seats - Unimog U1400

## Overview
This procedure covers the removal of the Seats on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2ac9d318-53fb-4c6a-9e28-3a2e96f7448a'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-SEA-INS-in040k',
  'Inspect and Test Seats - Unimog U1400',
  'Body',
  'Seats',
  'Inspect and Test Seats - Unimog U1400',
  '# Inspect and Test Seats - Unimog U1400

## Overview
This procedure covers the inspection of the Seats on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('040d7ee8-7693-4218-99c4-f07d1ed0bb4b'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-SEA-ADJ-ijnytw',
  'Adjust and Calibrate Seats - Unimog U1400',
  'Body',
  'Seats',
  'Adjust and Calibrate Seats - Unimog U1400',
  '# Adjust and Calibrate Seats - Unimog U1400

## Overview
This procedure covers the adjustment of the Seats on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d3c6034b-0280-4228-819d-98d49c7c2b4f'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-SEA-REP-cx4kvp',
  'Replace Seats - Unimog U1400',
  'Body',
  'Seats',
  'Replace Seats - Unimog U1400',
  '# Replace Seats - Unimog U1400

## Overview
This procedure covers the replacement of the Seats on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('845c7074-a516-4a36-818d-254ebbd05fcd'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-SEA-OVE-md3il6',
  'Overhaul and Rebuild Seats - Unimog U1400',
  'Body',
  'Seats',
  'Overhaul and Rebuild Seats - Unimog U1400',
  '# Overhaul and Rebuild Seats - Unimog U1400

## Overview
This procedure covers the overhaul of the Seats on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e4948dd7-e46b-4c73-9995-5afe9f48dd93'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-BOD-SEA-TRO-4lppn8',
  'Diagnose and Repair Seats - Unimog U1400',
  'Body',
  'Seats',
  'Diagnose and Repair Seats - Unimog U1400',
  '# Diagnose and Repair Seats - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Seats on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Bod-001 for system overview
- See U1400-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('95da0174-7b26-45fa-b182-30747d4edd1c'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-WIN-REM-6ty1m',
  'Remove and Install Winch - Unimog U1400',
  'Special Equipment',
  'Winch',
  'Remove and Install Winch - Unimog U1400',
  '# Remove and Install Winch - Unimog U1400

## Overview
This procedure covers the removal of the Winch on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c6445ce2-21e2-4bfa-8319-2b3049cf2291'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-WIN-INS-f0k1jq',
  'Inspect and Test Winch - Unimog U1400',
  'Special Equipment',
  'Winch',
  'Inspect and Test Winch - Unimog U1400',
  '# Inspect and Test Winch - Unimog U1400

## Overview
This procedure covers the inspection of the Winch on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0458cc92-0893-422d-a0ed-0ac8b8f71c77'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-WIN-ADJ-kqokub',
  'Adjust and Calibrate Winch - Unimog U1400',
  'Special Equipment',
  'Winch',
  'Adjust and Calibrate Winch - Unimog U1400',
  '# Adjust and Calibrate Winch - Unimog U1400

## Overview
This procedure covers the adjustment of the Winch on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d5881539-f933-4684-81a2-84483bdfdc43'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-WIN-REP-m3lyw7',
  'Replace Winch - Unimog U1400',
  'Special Equipment',
  'Winch',
  'Replace Winch - Unimog U1400',
  '# Replace Winch - Unimog U1400

## Overview
This procedure covers the replacement of the Winch on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a94f38f4-3cfb-41e4-825e-8362b242a171'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-WIN-OVE-dxchw8',
  'Overhaul and Rebuild Winch - Unimog U1400',
  'Special Equipment',
  'Winch',
  'Overhaul and Rebuild Winch - Unimog U1400',
  '# Overhaul and Rebuild Winch - Unimog U1400

## Overview
This procedure covers the overhaul of the Winch on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('12c8ef4d-1da4-456c-b28d-d1acc6e55329'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-WIN-TRO-njvdom',
  'Diagnose and Repair Winch - Unimog U1400',
  'Special Equipment',
  'Winch',
  'Diagnose and Repair Winch - Unimog U1400',
  '# Diagnose and Repair Winch - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Winch on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('76a4543c-c01f-43c0-a156-f701551fdf87'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-CRA-REM-1oqatnh',
  'Remove and Install Crane - Unimog U1400',
  'Special Equipment',
  'Crane',
  'Remove and Install Crane - Unimog U1400',
  '# Remove and Install Crane - Unimog U1400

## Overview
This procedure covers the removal of the Crane on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('79c71cc2-a7d3-4568-a601-e51bbebbc7db'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-CRA-INS-rljgf8',
  'Inspect and Test Crane - Unimog U1400',
  'Special Equipment',
  'Crane',
  'Inspect and Test Crane - Unimog U1400',
  '# Inspect and Test Crane - Unimog U1400

## Overview
This procedure covers the inspection of the Crane on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a4e9a796-28a0-4544-b3a3-a8eb1def87d0'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-CRA-ADJ-acna6',
  'Adjust and Calibrate Crane - Unimog U1400',
  'Special Equipment',
  'Crane',
  'Adjust and Calibrate Crane - Unimog U1400',
  '# Adjust and Calibrate Crane - Unimog U1400

## Overview
This procedure covers the adjustment of the Crane on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1e6f5367-2767-45bf-b814-37213d11dbb5'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-CRA-REP-6m15jw',
  'Replace Crane - Unimog U1400',
  'Special Equipment',
  'Crane',
  'Replace Crane - Unimog U1400',
  '# Replace Crane - Unimog U1400

## Overview
This procedure covers the replacement of the Crane on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('134c0c75-a3c7-4b62-87b7-a9e6cfc5bf47'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-CRA-OVE-ppjo7',
  'Overhaul and Rebuild Crane - Unimog U1400',
  'Special Equipment',
  'Crane',
  'Overhaul and Rebuild Crane - Unimog U1400',
  '# Overhaul and Rebuild Crane - Unimog U1400

## Overview
This procedure covers the overhaul of the Crane on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c4e2381-b777-451a-81fc-3eb8762814e1'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-CRA-TRO-hrg4s',
  'Diagnose and Repair Crane - Unimog U1400',
  'Special Equipment',
  'Crane',
  'Diagnose and Repair Crane - Unimog U1400',
  '# Diagnose and Repair Crane - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Crane on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b036bf80-a0d5-48f8-bcee-34fb01977dd9'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-SNO-REM-9n5yph',
  'Remove and Install Snow Plow - Unimog U1400',
  'Special Equipment',
  'Snow Plow',
  'Remove and Install Snow Plow - Unimog U1400',
  '# Remove and Install Snow Plow - Unimog U1400

## Overview
This procedure covers the removal of the Snow Plow on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('df08e0da-f788-43b1-8705-00c819ac997f'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-SNO-INS-o47hv',
  'Inspect and Test Snow Plow - Unimog U1400',
  'Special Equipment',
  'Snow Plow',
  'Inspect and Test Snow Plow - Unimog U1400',
  '# Inspect and Test Snow Plow - Unimog U1400

## Overview
This procedure covers the inspection of the Snow Plow on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('03e33676-97ee-4608-9b20-4f5897e00837'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-SNO-ADJ-wy0tio',
  'Adjust and Calibrate Snow Plow - Unimog U1400',
  'Special Equipment',
  'Snow Plow',
  'Adjust and Calibrate Snow Plow - Unimog U1400',
  '# Adjust and Calibrate Snow Plow - Unimog U1400

## Overview
This procedure covers the adjustment of the Snow Plow on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c8f353d5-3986-444c-bf91-9ac389d1c900'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-SNO-REP-juw92b',
  'Replace Snow Plow - Unimog U1400',
  'Special Equipment',
  'Snow Plow',
  'Replace Snow Plow - Unimog U1400',
  '# Replace Snow Plow - Unimog U1400

## Overview
This procedure covers the replacement of the Snow Plow on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2b089136-fb57-45da-8f35-b02488cd0026'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-SNO-OVE-v6l22q',
  'Overhaul and Rebuild Snow Plow - Unimog U1400',
  'Special Equipment',
  'Snow Plow',
  'Overhaul and Rebuild Snow Plow - Unimog U1400',
  '# Overhaul and Rebuild Snow Plow - Unimog U1400

## Overview
This procedure covers the overhaul of the Snow Plow on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('59d61502-c348-4d70-9c9b-02f2c48a106e'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-SNO-TRO-k96sji',
  'Diagnose and Repair Snow Plow - Unimog U1400',
  'Special Equipment',
  'Snow Plow',
  'Diagnose and Repair Snow Plow - Unimog U1400',
  '# Diagnose and Repair Snow Plow - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Snow Plow on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('075e6ab1-2281-4865-a7cb-feb73b0660bf'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-IMP-REM-7rbhwo',
  'Remove and Install Implement Carrier - Unimog U1400',
  'Special Equipment',
  'Implement Carrier',
  'Remove and Install Implement Carrier - Unimog U1400',
  '# Remove and Install Implement Carrier - Unimog U1400

## Overview
This procedure covers the removal of the Implement Carrier on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('736505cf-65f8-4e98-84cc-9983b22505a9'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-IMP-INS-9xbv3h',
  'Inspect and Test Implement Carrier - Unimog U1400',
  'Special Equipment',
  'Implement Carrier',
  'Inspect and Test Implement Carrier - Unimog U1400',
  '# Inspect and Test Implement Carrier - Unimog U1400

## Overview
This procedure covers the inspection of the Implement Carrier on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a6ea301d-bf6f-45d8-8ca6-a3a3e97979d8'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-IMP-ADJ-kzb02',
  'Adjust and Calibrate Implement Carrier - Unimog U1400',
  'Special Equipment',
  'Implement Carrier',
  'Adjust and Calibrate Implement Carrier - Unimog U1400',
  '# Adjust and Calibrate Implement Carrier - Unimog U1400

## Overview
This procedure covers the adjustment of the Implement Carrier on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6765ad02-23f9-4a5e-bf82-304d3e0feac7'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-IMP-REP-kmm4ek',
  'Replace Implement Carrier - Unimog U1400',
  'Special Equipment',
  'Implement Carrier',
  'Replace Implement Carrier - Unimog U1400',
  '# Replace Implement Carrier - Unimog U1400

## Overview
This procedure covers the replacement of the Implement Carrier on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('543ad97e-ec72-40d3-8ec5-e9abacbe0c41'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-IMP-OVE-tkizp',
  'Overhaul and Rebuild Implement Carrier - Unimog U1400',
  'Special Equipment',
  'Implement Carrier',
  'Overhaul and Rebuild Implement Carrier - Unimog U1400',
  '# Overhaul and Rebuild Implement Carrier - Unimog U1400

## Overview
This procedure covers the overhaul of the Implement Carrier on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1902e4d7-95e8-42bc-87c8-202c295fd6ae'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-IMP-TRO-tukv3w',
  'Diagnose and Repair Implement Carrier - Unimog U1400',
  'Special Equipment',
  'Implement Carrier',
  'Diagnose and Repair Implement Carrier - Unimog U1400',
  '# Diagnose and Repair Implement Carrier - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Implement Carrier on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d3ff31df-8364-46a6-a7a2-880457be8e24'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-TIP-REM-q3gk1',
  'Remove and Install Tipper - Unimog U1400',
  'Special Equipment',
  'Tipper',
  'Remove and Install Tipper - Unimog U1400',
  '# Remove and Install Tipper - Unimog U1400

## Overview
This procedure covers the removal of the Tipper on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b9579feb-538b-451f-a514-7f876795b3f3'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-TIP-INS-qk48r',
  'Inspect and Test Tipper - Unimog U1400',
  'Special Equipment',
  'Tipper',
  'Inspect and Test Tipper - Unimog U1400',
  '# Inspect and Test Tipper - Unimog U1400

## Overview
This procedure covers the inspection of the Tipper on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('786a2d30-1044-46eb-ae46-270b93d2fa7b'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-TIP-ADJ-0tps6n',
  'Adjust and Calibrate Tipper - Unimog U1400',
  'Special Equipment',
  'Tipper',
  'Adjust and Calibrate Tipper - Unimog U1400',
  '# Adjust and Calibrate Tipper - Unimog U1400

## Overview
This procedure covers the adjustment of the Tipper on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1588176d-36f5-4416-af44-422eae413c57'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-TIP-REP-i4icuo',
  'Replace Tipper - Unimog U1400',
  'Special Equipment',
  'Tipper',
  'Replace Tipper - Unimog U1400',
  '# Replace Tipper - Unimog U1400

## Overview
This procedure covers the replacement of the Tipper on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('80f3bcf4-7461-4c6a-9800-4cc84f9c74df'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-TIP-OVE-m7z2wy',
  'Overhaul and Rebuild Tipper - Unimog U1400',
  'Special Equipment',
  'Tipper',
  'Overhaul and Rebuild Tipper - Unimog U1400',
  '# Overhaul and Rebuild Tipper - Unimog U1400

## Overview
This procedure covers the overhaul of the Tipper on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3208786c-02b4-4ccc-a1ce-f897d000d60b'),
  uuid('cccc0004-cccc-cccc-cccc-cccccccccccc'),
  'U1400-SPE-TIP-TRO-kg64t',
  'Diagnose and Repair Tipper - Unimog U1400',
  'Special Equipment',
  'Tipper',
  'Diagnose and Repair Tipper - Unimog U1400',
  '# Diagnose and Repair Tipper - Unimog U1400

## Overview
This procedure covers the troubleshooting of the Tipper on Unimog U1400 vehicles with OM366A engine.
Applicable to model years: 1985-2000

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U1400-Spe-001 for system overview
- See U1400-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c791a77b-6dfe-435d-98a1-14f6b9436172'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-OIL-REM-n8kfa7',
  'Remove and Install Oil System - Unimog U1600',
  'Engine',
  'Oil System',
  'Remove and Install Oil System - Unimog U1600',
  '# Remove and Install Oil System - Unimog U1600

## Overview
This procedure covers the removal of the Oil System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c8ceb469-a701-4d47-8306-f6d9fbcaeb1f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-OIL-INS-1klpd',
  'Inspect and Test Oil System - Unimog U1600',
  'Engine',
  'Oil System',
  'Inspect and Test Oil System - Unimog U1600',
  '# Inspect and Test Oil System - Unimog U1600

## Overview
This procedure covers the inspection of the Oil System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('042b441c-6848-405c-b9c2-a6b745345498'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-OIL-ADJ-9hsri',
  'Adjust and Calibrate Oil System - Unimog U1600',
  'Engine',
  'Oil System',
  'Adjust and Calibrate Oil System - Unimog U1600',
  '# Adjust and Calibrate Oil System - Unimog U1600

## Overview
This procedure covers the adjustment of the Oil System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c10e8f7-1862-4835-8333-600da57e6bb7'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-OIL-REP-v6heg',
  'Replace Oil System - Unimog U1600',
  'Engine',
  'Oil System',
  'Replace Oil System - Unimog U1600',
  '# Replace Oil System - Unimog U1600

## Overview
This procedure covers the replacement of the Oil System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d1777352-4914-411e-9d94-8dae2f26f88a'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-OIL-OVE-qnuh3q',
  'Overhaul and Rebuild Oil System - Unimog U1600',
  'Engine',
  'Oil System',
  'Overhaul and Rebuild Oil System - Unimog U1600',
  '# Overhaul and Rebuild Oil System - Unimog U1600

## Overview
This procedure covers the overhaul of the Oil System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('de18f017-0703-4659-9f8d-a5db994951fb'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-OIL-TRO-sqmyld',
  'Diagnose and Repair Oil System - Unimog U1600',
  'Engine',
  'Oil System',
  'Diagnose and Repair Oil System - Unimog U1600',
  '# Diagnose and Repair Oil System - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Oil System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c486f110-790b-4fa6-952d-9253dabab659'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-COO-REM-tupkz',
  'Remove and Install Cooling System - Unimog U1600',
  'Engine',
  'Cooling System',
  'Remove and Install Cooling System - Unimog U1600',
  '# Remove and Install Cooling System - Unimog U1600

## Overview
This procedure covers the removal of the Cooling System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('77d920c8-1298-4b92-8694-774a1f4631f5'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-COO-INS-j7533',
  'Inspect and Test Cooling System - Unimog U1600',
  'Engine',
  'Cooling System',
  'Inspect and Test Cooling System - Unimog U1600',
  '# Inspect and Test Cooling System - Unimog U1600

## Overview
This procedure covers the inspection of the Cooling System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d36f51b3-ad4d-4618-9173-66ab6d672e50'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-COO-ADJ-3r46h9',
  'Adjust and Calibrate Cooling System - Unimog U1600',
  'Engine',
  'Cooling System',
  'Adjust and Calibrate Cooling System - Unimog U1600',
  '# Adjust and Calibrate Cooling System - Unimog U1600

## Overview
This procedure covers the adjustment of the Cooling System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('975629a9-d37c-4b08-9efa-ef3378aa240e'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-COO-REP-peygg',
  'Replace Cooling System - Unimog U1600',
  'Engine',
  'Cooling System',
  'Replace Cooling System - Unimog U1600',
  '# Replace Cooling System - Unimog U1600

## Overview
This procedure covers the replacement of the Cooling System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c849bf0-1dc9-4bc0-8820-d0cd0c8f4e93'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-COO-OVE-0y4w5c',
  'Overhaul and Rebuild Cooling System - Unimog U1600',
  'Engine',
  'Cooling System',
  'Overhaul and Rebuild Cooling System - Unimog U1600',
  '# Overhaul and Rebuild Cooling System - Unimog U1600

## Overview
This procedure covers the overhaul of the Cooling System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5ad48f8f-82f7-4b67-853e-1a0727b3adf6'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-COO-TRO-7mv2ve',
  'Diagnose and Repair Cooling System - Unimog U1600',
  'Engine',
  'Cooling System',
  'Diagnose and Repair Cooling System - Unimog U1600',
  '# Diagnose and Repair Cooling System - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Cooling System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0b025151-e834-42d7-8f74-76fb6c472fc0'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-FUE-REM-80tui',
  'Remove and Install Fuel System - Unimog U1600',
  'Engine',
  'Fuel System',
  'Remove and Install Fuel System - Unimog U1600',
  '# Remove and Install Fuel System - Unimog U1600

## Overview
This procedure covers the removal of the Fuel System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f6415244-00ed-49ef-844b-f466bc3514af'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-FUE-INS-uyp8wg',
  'Inspect and Test Fuel System - Unimog U1600',
  'Engine',
  'Fuel System',
  'Inspect and Test Fuel System - Unimog U1600',
  '# Inspect and Test Fuel System - Unimog U1600

## Overview
This procedure covers the inspection of the Fuel System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('437461df-5949-422c-9774-3d70c257fe4c'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-FUE-ADJ-kbre1f',
  'Adjust and Calibrate Fuel System - Unimog U1600',
  'Engine',
  'Fuel System',
  'Adjust and Calibrate Fuel System - Unimog U1600',
  '# Adjust and Calibrate Fuel System - Unimog U1600

## Overview
This procedure covers the adjustment of the Fuel System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('612b350a-9458-43b8-848d-3f67c5f8f228'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-FUE-REP-ieu27',
  'Replace Fuel System - Unimog U1600',
  'Engine',
  'Fuel System',
  'Replace Fuel System - Unimog U1600',
  '# Replace Fuel System - Unimog U1600

## Overview
This procedure covers the replacement of the Fuel System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('42a32fb7-76c7-43c9-825a-590e91016f21'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-FUE-OVE-p68brc',
  'Overhaul and Rebuild Fuel System - Unimog U1600',
  'Engine',
  'Fuel System',
  'Overhaul and Rebuild Fuel System - Unimog U1600',
  '# Overhaul and Rebuild Fuel System - Unimog U1600

## Overview
This procedure covers the overhaul of the Fuel System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('02b20cda-c5c6-4065-89d2-947655d0718f'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-FUE-TRO-215eg',
  'Diagnose and Repair Fuel System - Unimog U1600',
  'Engine',
  'Fuel System',
  'Diagnose and Repair Fuel System - Unimog U1600',
  '# Diagnose and Repair Fuel System - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Fuel System on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2e79f548-a722-4fe7-9781-48169c1f373e'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-AIR-REM-lgkr28',
  'Remove and Install Air Intake - Unimog U1600',
  'Engine',
  'Air Intake',
  'Remove and Install Air Intake - Unimog U1600',
  '# Remove and Install Air Intake - Unimog U1600

## Overview
This procedure covers the removal of the Air Intake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8c5ff8d1-3fb5-4107-b0f5-cb1e9b8cb0cc'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-AIR-INS-1521ao',
  'Inspect and Test Air Intake - Unimog U1600',
  'Engine',
  'Air Intake',
  'Inspect and Test Air Intake - Unimog U1600',
  '# Inspect and Test Air Intake - Unimog U1600

## Overview
This procedure covers the inspection of the Air Intake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cd154dc3-c134-44a1-80c7-4ef6d1852af9'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-AIR-ADJ-qgiuc8',
  'Adjust and Calibrate Air Intake - Unimog U1600',
  'Engine',
  'Air Intake',
  'Adjust and Calibrate Air Intake - Unimog U1600',
  '# Adjust and Calibrate Air Intake - Unimog U1600

## Overview
This procedure covers the adjustment of the Air Intake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e420ac01-b529-4d21-a4ac-1c5536591fb0'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-AIR-REP-6qwfed',
  'Replace Air Intake - Unimog U1600',
  'Engine',
  'Air Intake',
  'Replace Air Intake - Unimog U1600',
  '# Replace Air Intake - Unimog U1600

## Overview
This procedure covers the replacement of the Air Intake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c158bcdf-ae42-47a4-b458-c4e3b240dac7'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-AIR-OVE-nhqanr',
  'Overhaul and Rebuild Air Intake - Unimog U1600',
  'Engine',
  'Air Intake',
  'Overhaul and Rebuild Air Intake - Unimog U1600',
  '# Overhaul and Rebuild Air Intake - Unimog U1600

## Overview
This procedure covers the overhaul of the Air Intake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7d011742-16b1-4ce4-b05a-3bdc481cc13b'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-AIR-TRO-e2i06',
  'Diagnose and Repair Air Intake - Unimog U1600',
  'Engine',
  'Air Intake',
  'Diagnose and Repair Air Intake - Unimog U1600',
  '# Diagnose and Repair Air Intake - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Air Intake on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('29ecf194-9b9e-4cea-bd48-1a0cd912736c'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-EXH-REM-5j0miv',
  'Remove and Install Exhaust - Unimog U1600',
  'Engine',
  'Exhaust',
  'Remove and Install Exhaust - Unimog U1600',
  '# Remove and Install Exhaust - Unimog U1600

## Overview
This procedure covers the removal of the Exhaust on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ad3f7209-165f-4ef8-beb6-3fe7b2172c64'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-EXH-INS-rabo20i',
  'Inspect and Test Exhaust - Unimog U1600',
  'Engine',
  'Exhaust',
  'Inspect and Test Exhaust - Unimog U1600',
  '# Inspect and Test Exhaust - Unimog U1600

## Overview
This procedure covers the inspection of the Exhaust on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5531b1d1-3c8c-40a3-bddd-7ff0b28cbc95'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-EXH-ADJ-ws9n28',
  'Adjust and Calibrate Exhaust - Unimog U1600',
  'Engine',
  'Exhaust',
  'Adjust and Calibrate Exhaust - Unimog U1600',
  '# Adjust and Calibrate Exhaust - Unimog U1600

## Overview
This procedure covers the adjustment of the Exhaust on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d63258ad-321d-4ae5-a602-42fcfddae99b'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-EXH-REP-kxs77h',
  'Replace Exhaust - Unimog U1600',
  'Engine',
  'Exhaust',
  'Replace Exhaust - Unimog U1600',
  '# Replace Exhaust - Unimog U1600

## Overview
This procedure covers the replacement of the Exhaust on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('24481b58-1ed6-44e5-a959-e429c0715818'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-EXH-OVE-aowqc',
  'Overhaul and Rebuild Exhaust - Unimog U1600',
  'Engine',
  'Exhaust',
  'Overhaul and Rebuild Exhaust - Unimog U1600',
  '# Overhaul and Rebuild Exhaust - Unimog U1600

## Overview
This procedure covers the overhaul of the Exhaust on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e36523e2-5860-4d8a-b9a0-bd7d82fe9573'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-EXH-TRO-vhlstc',
  'Diagnose and Repair Exhaust - Unimog U1600',
  'Engine',
  'Exhaust',
  'Diagnose and Repair Exhaust - Unimog U1600',
  '# Diagnose and Repair Exhaust - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Exhaust on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6eac072d-70a6-4565-a6a7-f099d951a7c2'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-TUR-REM-tjubcn',
  'Remove and Install Turbocharger - Unimog U1600',
  'Engine',
  'Turbocharger',
  'Remove and Install Turbocharger - Unimog U1600',
  '# Remove and Install Turbocharger - Unimog U1600

## Overview
This procedure covers the removal of the Turbocharger on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4d0aa8c9-fa33-4bd7-8c7c-ab6c55cbcfbc'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-TUR-INS-2r8mqk',
  'Inspect and Test Turbocharger - Unimog U1600',
  'Engine',
  'Turbocharger',
  'Inspect and Test Turbocharger - Unimog U1600',
  '# Inspect and Test Turbocharger - Unimog U1600

## Overview
This procedure covers the inspection of the Turbocharger on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fee68a02-f291-4cc2-a6e2-9d25a3c07d01'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-TUR-ADJ-f0snj',
  'Adjust and Calibrate Turbocharger - Unimog U1600',
  'Engine',
  'Turbocharger',
  'Adjust and Calibrate Turbocharger - Unimog U1600',
  '# Adjust and Calibrate Turbocharger - Unimog U1600

## Overview
This procedure covers the adjustment of the Turbocharger on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('84ebcd52-9037-48ec-88af-ad283771adae'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-TUR-REP-9dromb',
  'Replace Turbocharger - Unimog U1600',
  'Engine',
  'Turbocharger',
  'Replace Turbocharger - Unimog U1600',
  '# Replace Turbocharger - Unimog U1600

## Overview
This procedure covers the replacement of the Turbocharger on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9f098d35-9815-4ee6-9eed-c02de68f1802'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-TUR-OVE-y8g67d',
  'Overhaul and Rebuild Turbocharger - Unimog U1600',
  'Engine',
  'Turbocharger',
  'Overhaul and Rebuild Turbocharger - Unimog U1600',
  '# Overhaul and Rebuild Turbocharger - Unimog U1600

## Overview
This procedure covers the overhaul of the Turbocharger on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('875359eb-36ca-4d58-bea1-5fa0f5dae267'),
  uuid('cccc0008-cccc-cccc-cccc-cccccccccccc'),
  'U1600-ENG-TUR-TRO-y6d8mp',
  'Diagnose and Repair Turbocharger - Unimog U1600',
  'Engine',
  'Turbocharger',
  'Diagnose and Repair Turbocharger - Unimog U1600',
  '# Diagnose and Repair Turbocharger - Unimog U1600

## Overview
This procedure covers the troubleshooting of the Turbocharger on Unimog U1600 vehicles with OM366A engine.
Applicable to model years: 1985-2000

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
- See U1600-Eng-001 for system overview
- See U1600-Eng-TSB-01 for latest updates',
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
