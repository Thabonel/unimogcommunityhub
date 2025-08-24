-- WIS Procedures Import - Chunk 24
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 24 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('666bd6ab-2c14-4105-b326-2cd915c5022c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-DOO-ADJ-36n4sm',
  'Adjust and Calibrate Doors - Unimog U2000',
  'Body',
  'Doors',
  'Adjust and Calibrate Doors - Unimog U2000',
  '# Adjust and Calibrate Doors - Unimog U2000

## Overview
This procedure covers the adjustment of the Doors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e9dd5e47-efe5-4aba-b077-1575095cc0d5'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-DOO-REP-eb4bk',
  'Replace Doors - Unimog U2000',
  'Body',
  'Doors',
  'Replace Doors - Unimog U2000',
  '# Replace Doors - Unimog U2000

## Overview
This procedure covers the replacement of the Doors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b0431a7d-5ae4-4a71-a554-3f2f4d623960'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-DOO-OVE-67p67i',
  'Overhaul and Rebuild Doors - Unimog U2000',
  'Body',
  'Doors',
  'Overhaul and Rebuild Doors - Unimog U2000',
  '# Overhaul and Rebuild Doors - Unimog U2000

## Overview
This procedure covers the overhaul of the Doors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('623ef044-c2b9-42b1-9244-dccae0ac1787'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-DOO-TRO-amh63b',
  'Diagnose and Repair Doors - Unimog U2000',
  'Body',
  'Doors',
  'Diagnose and Repair Doors - Unimog U2000',
  '# Diagnose and Repair Doors - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Doors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d3a12bb0-2d3c-45c6-b0c0-3f661dd182dd'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-WIN-REM-m7ul57',
  'Remove and Install Windows - Unimog U2000',
  'Body',
  'Windows',
  'Remove and Install Windows - Unimog U2000',
  '# Remove and Install Windows - Unimog U2000

## Overview
This procedure covers the removal of the Windows on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e489613a-e658-4306-a71a-95ea405ed9b1'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-WIN-INS-gok5ak',
  'Inspect and Test Windows - Unimog U2000',
  'Body',
  'Windows',
  'Inspect and Test Windows - Unimog U2000',
  '# Inspect and Test Windows - Unimog U2000

## Overview
This procedure covers the inspection of the Windows on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2829b173-7c40-4ff4-8247-07e32b6ed332'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-WIN-ADJ-09xro2',
  'Adjust and Calibrate Windows - Unimog U2000',
  'Body',
  'Windows',
  'Adjust and Calibrate Windows - Unimog U2000',
  '# Adjust and Calibrate Windows - Unimog U2000

## Overview
This procedure covers the adjustment of the Windows on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f7af8886-248d-4a59-98e4-d2d18a94faf1'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-WIN-REP-d66g4f',
  'Replace Windows - Unimog U2000',
  'Body',
  'Windows',
  'Replace Windows - Unimog U2000',
  '# Replace Windows - Unimog U2000

## Overview
This procedure covers the replacement of the Windows on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5a652aa5-b519-43fe-8a22-f19ceba28101'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-WIN-OVE-n39lxw',
  'Overhaul and Rebuild Windows - Unimog U2000',
  'Body',
  'Windows',
  'Overhaul and Rebuild Windows - Unimog U2000',
  '# Overhaul and Rebuild Windows - Unimog U2000

## Overview
This procedure covers the overhaul of the Windows on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3772ec3e-4c9d-47f5-abbd-5e278ad2a622'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-WIN-TRO-fxsl6',
  'Diagnose and Repair Windows - Unimog U2000',
  'Body',
  'Windows',
  'Diagnose and Repair Windows - Unimog U2000',
  '# Diagnose and Repair Windows - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Windows on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4c217362-0d10-4ef3-92f2-948a1ba91e4c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-MIR-REM-wagad',
  'Remove and Install Mirrors - Unimog U2000',
  'Body',
  'Mirrors',
  'Remove and Install Mirrors - Unimog U2000',
  '# Remove and Install Mirrors - Unimog U2000

## Overview
This procedure covers the removal of the Mirrors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('41599764-96fb-4e2d-99fe-46f82b84fefd'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-MIR-INS-2bx99i',
  'Inspect and Test Mirrors - Unimog U2000',
  'Body',
  'Mirrors',
  'Inspect and Test Mirrors - Unimog U2000',
  '# Inspect and Test Mirrors - Unimog U2000

## Overview
This procedure covers the inspection of the Mirrors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bf9f08ce-57b7-4080-922d-4f68948465aa'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-MIR-ADJ-bt9p76',
  'Adjust and Calibrate Mirrors - Unimog U2000',
  'Body',
  'Mirrors',
  'Adjust and Calibrate Mirrors - Unimog U2000',
  '# Adjust and Calibrate Mirrors - Unimog U2000

## Overview
This procedure covers the adjustment of the Mirrors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('859aed80-6fa7-4006-ba89-2a0354cfccee'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-MIR-REP-i9ky8d',
  'Replace Mirrors - Unimog U2000',
  'Body',
  'Mirrors',
  'Replace Mirrors - Unimog U2000',
  '# Replace Mirrors - Unimog U2000

## Overview
This procedure covers the replacement of the Mirrors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('04407ac8-af34-4705-8b71-d3b6b5ca5a1b'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-MIR-OVE-bvoge',
  'Overhaul and Rebuild Mirrors - Unimog U2000',
  'Body',
  'Mirrors',
  'Overhaul and Rebuild Mirrors - Unimog U2000',
  '# Overhaul and Rebuild Mirrors - Unimog U2000

## Overview
This procedure covers the overhaul of the Mirrors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5e8ba82b-6156-4c69-8648-23f6add12b1f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-MIR-TRO-uph24',
  'Diagnose and Repair Mirrors - Unimog U2000',
  'Body',
  'Mirrors',
  'Diagnose and Repair Mirrors - Unimog U2000',
  '# Diagnose and Repair Mirrors - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Mirrors on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('67e31cf0-5ef4-4a62-913b-475d8e40cd6d'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-SEA-REM-nph4a',
  'Remove and Install Seats - Unimog U2000',
  'Body',
  'Seats',
  'Remove and Install Seats - Unimog U2000',
  '# Remove and Install Seats - Unimog U2000

## Overview
This procedure covers the removal of the Seats on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3ae78c39-5f6d-4931-89b2-c0bb600f8d31'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-SEA-INS-relejl',
  'Inspect and Test Seats - Unimog U2000',
  'Body',
  'Seats',
  'Inspect and Test Seats - Unimog U2000',
  '# Inspect and Test Seats - Unimog U2000

## Overview
This procedure covers the inspection of the Seats on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4f59c559-3e1f-4a8f-85cf-7fe0cbf3c5c5'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-SEA-ADJ-dsjq6',
  'Adjust and Calibrate Seats - Unimog U2000',
  'Body',
  'Seats',
  'Adjust and Calibrate Seats - Unimog U2000',
  '# Adjust and Calibrate Seats - Unimog U2000

## Overview
This procedure covers the adjustment of the Seats on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a235efd4-1c20-40e8-831e-2a6bbf898483'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-SEA-REP-d3vlgm',
  'Replace Seats - Unimog U2000',
  'Body',
  'Seats',
  'Replace Seats - Unimog U2000',
  '# Replace Seats - Unimog U2000

## Overview
This procedure covers the replacement of the Seats on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('80326d03-61bf-4139-8063-1af83d88cb56'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-SEA-OVE-oe7l5r',
  'Overhaul and Rebuild Seats - Unimog U2000',
  'Body',
  'Seats',
  'Overhaul and Rebuild Seats - Unimog U2000',
  '# Overhaul and Rebuild Seats - Unimog U2000

## Overview
This procedure covers the overhaul of the Seats on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d55b60ae-d64b-4b3c-aa4a-8a4c8b5cc527'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BOD-SEA-TRO-7034q',
  'Diagnose and Repair Seats - Unimog U2000',
  'Body',
  'Seats',
  'Diagnose and Repair Seats - Unimog U2000',
  '# Diagnose and Repair Seats - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Seats on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Bod-001 for system overview
- See U2000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4f5f464e-465d-4134-91db-f454ca065580'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-WIN-REM-ovkej',
  'Remove and Install Winch - Unimog U2000',
  'Special Equipment',
  'Winch',
  'Remove and Install Winch - Unimog U2000',
  '# Remove and Install Winch - Unimog U2000

## Overview
This procedure covers the removal of the Winch on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('24c68c04-550b-433f-b851-52fa174f9510'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-WIN-INS-3zqo4g',
  'Inspect and Test Winch - Unimog U2000',
  'Special Equipment',
  'Winch',
  'Inspect and Test Winch - Unimog U2000',
  '# Inspect and Test Winch - Unimog U2000

## Overview
This procedure covers the inspection of the Winch on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7410aa70-f651-471c-a588-8b4fdaf25d50'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-WIN-ADJ-bbdxp',
  'Adjust and Calibrate Winch - Unimog U2000',
  'Special Equipment',
  'Winch',
  'Adjust and Calibrate Winch - Unimog U2000',
  '# Adjust and Calibrate Winch - Unimog U2000

## Overview
This procedure covers the adjustment of the Winch on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('13a0695f-13df-431d-97ed-587607f48e65'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-WIN-REP-h9a2c',
  'Replace Winch - Unimog U2000',
  'Special Equipment',
  'Winch',
  'Replace Winch - Unimog U2000',
  '# Replace Winch - Unimog U2000

## Overview
This procedure covers the replacement of the Winch on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('44c2ae9c-1c89-421f-90bf-741b514477f0'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-WIN-OVE-sarqaj',
  'Overhaul and Rebuild Winch - Unimog U2000',
  'Special Equipment',
  'Winch',
  'Overhaul and Rebuild Winch - Unimog U2000',
  '# Overhaul and Rebuild Winch - Unimog U2000

## Overview
This procedure covers the overhaul of the Winch on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('02bd8010-fed0-49a7-bafe-77477e04f56f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-WIN-TRO-k9fzf',
  'Diagnose and Repair Winch - Unimog U2000',
  'Special Equipment',
  'Winch',
  'Diagnose and Repair Winch - Unimog U2000',
  '# Diagnose and Repair Winch - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Winch on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f6e7c394-9061-49ee-be3b-9af690af17f7'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-CRA-REM-x9muq9',
  'Remove and Install Crane - Unimog U2000',
  'Special Equipment',
  'Crane',
  'Remove and Install Crane - Unimog U2000',
  '# Remove and Install Crane - Unimog U2000

## Overview
This procedure covers the removal of the Crane on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('41c66657-5695-4b88-961d-7a49d42b682f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-CRA-INS-xxrzxw',
  'Inspect and Test Crane - Unimog U2000',
  'Special Equipment',
  'Crane',
  'Inspect and Test Crane - Unimog U2000',
  '# Inspect and Test Crane - Unimog U2000

## Overview
This procedure covers the inspection of the Crane on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('39542942-669f-484b-92cd-1677e6e33939'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-CRA-ADJ-8zp8n9',
  'Adjust and Calibrate Crane - Unimog U2000',
  'Special Equipment',
  'Crane',
  'Adjust and Calibrate Crane - Unimog U2000',
  '# Adjust and Calibrate Crane - Unimog U2000

## Overview
This procedure covers the adjustment of the Crane on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('de8c57b4-1cae-48e4-8d7e-c55eb46caa90'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-CRA-REP-2mind',
  'Replace Crane - Unimog U2000',
  'Special Equipment',
  'Crane',
  'Replace Crane - Unimog U2000',
  '# Replace Crane - Unimog U2000

## Overview
This procedure covers the replacement of the Crane on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('83326ab0-b91b-4fcc-9d16-ac1949a2a439'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-CRA-OVE-yywat',
  'Overhaul and Rebuild Crane - Unimog U2000',
  'Special Equipment',
  'Crane',
  'Overhaul and Rebuild Crane - Unimog U2000',
  '# Overhaul and Rebuild Crane - Unimog U2000

## Overview
This procedure covers the overhaul of the Crane on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2ab9e3c9-a611-4187-bebd-d186117d6858'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-CRA-TRO-xm783',
  'Diagnose and Repair Crane - Unimog U2000',
  'Special Equipment',
  'Crane',
  'Diagnose and Repair Crane - Unimog U2000',
  '# Diagnose and Repair Crane - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Crane on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('71ef0b08-3d1a-4989-89c2-2191a640453f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-SNO-REM-49a1k',
  'Remove and Install Snow Plow - Unimog U2000',
  'Special Equipment',
  'Snow Plow',
  'Remove and Install Snow Plow - Unimog U2000',
  '# Remove and Install Snow Plow - Unimog U2000

## Overview
This procedure covers the removal of the Snow Plow on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f0717ce6-197c-48e2-87d6-ed3a77529bf8'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-SNO-INS-s818bf',
  'Inspect and Test Snow Plow - Unimog U2000',
  'Special Equipment',
  'Snow Plow',
  'Inspect and Test Snow Plow - Unimog U2000',
  '# Inspect and Test Snow Plow - Unimog U2000

## Overview
This procedure covers the inspection of the Snow Plow on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1cb095f3-8cd9-47a1-a094-43b7c6e72907'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-SNO-ADJ-8v8znn',
  'Adjust and Calibrate Snow Plow - Unimog U2000',
  'Special Equipment',
  'Snow Plow',
  'Adjust and Calibrate Snow Plow - Unimog U2000',
  '# Adjust and Calibrate Snow Plow - Unimog U2000

## Overview
This procedure covers the adjustment of the Snow Plow on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bb14db8f-9819-4f1d-8579-fb3a256b04ee'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-SNO-REP-5crptc',
  'Replace Snow Plow - Unimog U2000',
  'Special Equipment',
  'Snow Plow',
  'Replace Snow Plow - Unimog U2000',
  '# Replace Snow Plow - Unimog U2000

## Overview
This procedure covers the replacement of the Snow Plow on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('51f020b5-8a89-4ce9-a951-4838543abdba'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-SNO-OVE-c0ghbd',
  'Overhaul and Rebuild Snow Plow - Unimog U2000',
  'Special Equipment',
  'Snow Plow',
  'Overhaul and Rebuild Snow Plow - Unimog U2000',
  '# Overhaul and Rebuild Snow Plow - Unimog U2000

## Overview
This procedure covers the overhaul of the Snow Plow on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('90f40c1f-9556-4cb4-9b3b-485daeeb5485'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-SNO-TRO-q9czdm',
  'Diagnose and Repair Snow Plow - Unimog U2000',
  'Special Equipment',
  'Snow Plow',
  'Diagnose and Repair Snow Plow - Unimog U2000',
  '# Diagnose and Repair Snow Plow - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Snow Plow on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f430ffe0-70a5-4f8a-9536-f89b89fa547c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-IMP-REM-ccuezn',
  'Remove and Install Implement Carrier - Unimog U2000',
  'Special Equipment',
  'Implement Carrier',
  'Remove and Install Implement Carrier - Unimog U2000',
  '# Remove and Install Implement Carrier - Unimog U2000

## Overview
This procedure covers the removal of the Implement Carrier on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1942b5db-8440-4f91-9893-47505a98b792'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-IMP-INS-gtz7hw',
  'Inspect and Test Implement Carrier - Unimog U2000',
  'Special Equipment',
  'Implement Carrier',
  'Inspect and Test Implement Carrier - Unimog U2000',
  '# Inspect and Test Implement Carrier - Unimog U2000

## Overview
This procedure covers the inspection of the Implement Carrier on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0bc15ddd-b913-470a-9d48-07c0815a1b30'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-IMP-ADJ-bmul9',
  'Adjust and Calibrate Implement Carrier - Unimog U2000',
  'Special Equipment',
  'Implement Carrier',
  'Adjust and Calibrate Implement Carrier - Unimog U2000',
  '# Adjust and Calibrate Implement Carrier - Unimog U2000

## Overview
This procedure covers the adjustment of the Implement Carrier on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('31d5c240-5ffc-4fd2-b5fb-8a6dfef32cb1'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-IMP-REP-vlv2wn',
  'Replace Implement Carrier - Unimog U2000',
  'Special Equipment',
  'Implement Carrier',
  'Replace Implement Carrier - Unimog U2000',
  '# Replace Implement Carrier - Unimog U2000

## Overview
This procedure covers the replacement of the Implement Carrier on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8b987a5f-13f1-4846-9c52-6232aa81ca90'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-IMP-OVE-5rxbm',
  'Overhaul and Rebuild Implement Carrier - Unimog U2000',
  'Special Equipment',
  'Implement Carrier',
  'Overhaul and Rebuild Implement Carrier - Unimog U2000',
  '# Overhaul and Rebuild Implement Carrier - Unimog U2000

## Overview
This procedure covers the overhaul of the Implement Carrier on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f2ffdaa6-c31f-4728-a584-21a0964fb069'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-IMP-TRO-0fg7i9',
  'Diagnose and Repair Implement Carrier - Unimog U2000',
  'Special Equipment',
  'Implement Carrier',
  'Diagnose and Repair Implement Carrier - Unimog U2000',
  '# Diagnose and Repair Implement Carrier - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Implement Carrier on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('da931059-347a-4266-a646-c71d461ec72b'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-TIP-REM-khe53b',
  'Remove and Install Tipper - Unimog U2000',
  'Special Equipment',
  'Tipper',
  'Remove and Install Tipper - Unimog U2000',
  '# Remove and Install Tipper - Unimog U2000

## Overview
This procedure covers the removal of the Tipper on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f3fe743a-054a-498c-8f67-5fe5190792a8'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-TIP-INS-rk24hr',
  'Inspect and Test Tipper - Unimog U2000',
  'Special Equipment',
  'Tipper',
  'Inspect and Test Tipper - Unimog U2000',
  '# Inspect and Test Tipper - Unimog U2000

## Overview
This procedure covers the inspection of the Tipper on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4f3ac7fd-bacd-42e5-9a18-71714f28d956'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-TIP-ADJ-827qd',
  'Adjust and Calibrate Tipper - Unimog U2000',
  'Special Equipment',
  'Tipper',
  'Adjust and Calibrate Tipper - Unimog U2000',
  '# Adjust and Calibrate Tipper - Unimog U2000

## Overview
This procedure covers the adjustment of the Tipper on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('876d921e-8aea-4f09-ad54-dafbdebecfce'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-TIP-REP-5j46bt',
  'Replace Tipper - Unimog U2000',
  'Special Equipment',
  'Tipper',
  'Replace Tipper - Unimog U2000',
  '# Replace Tipper - Unimog U2000

## Overview
This procedure covers the replacement of the Tipper on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bcfae415-e040-4403-92d0-0f1bcf788969'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-TIP-OVE-0r79rh',
  'Overhaul and Rebuild Tipper - Unimog U2000',
  'Special Equipment',
  'Tipper',
  'Overhaul and Rebuild Tipper - Unimog U2000',
  '# Overhaul and Rebuild Tipper - Unimog U2000

## Overview
This procedure covers the overhaul of the Tipper on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c77c7486-52a6-4ac9-9a06-7aca1dbf261d'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-SPE-TIP-TRO-g3dfbn',
  'Diagnose and Repair Tipper - Unimog U2000',
  'Special Equipment',
  'Tipper',
  'Diagnose and Repair Tipper - Unimog U2000',
  '# Diagnose and Repair Tipper - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Tipper on Unimog U2000 vehicles with OM906LA engine.
Applicable to model years: 1990-2005

## Special Tools Required
- Mercedes-Benz Special Tool 276589001100
- Torque wrench (10-300 Nm)
- Diagnostic scanner with Mercedes software

## Preliminary Work
1. Park vehicle on level ground
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
- See U2000-Spe-001 for system overview
- See U2000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a34962b4-b246-44fe-8288-7850d847c0d9'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-OIL-REM-9ydh5u',
  'Remove and Install Oil System - Unimog U3000',
  'Engine',
  'Oil System',
  'Remove and Install Oil System - Unimog U3000',
  '# Remove and Install Oil System - Unimog U3000

## Overview
This procedure covers the removal of the Oil System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('30374188-600b-4c9d-8a12-4393bfad1a7b'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-OIL-INS-aks28g',
  'Inspect and Test Oil System - Unimog U3000',
  'Engine',
  'Oil System',
  'Inspect and Test Oil System - Unimog U3000',
  '# Inspect and Test Oil System - Unimog U3000

## Overview
This procedure covers the inspection of the Oil System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('db04c5f1-d7e0-4a04-aa5d-691fbf8a797f'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-OIL-ADJ-qj7yf',
  'Adjust and Calibrate Oil System - Unimog U3000',
  'Engine',
  'Oil System',
  'Adjust and Calibrate Oil System - Unimog U3000',
  '# Adjust and Calibrate Oil System - Unimog U3000

## Overview
This procedure covers the adjustment of the Oil System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('965a4f27-d8a0-44d1-9e79-cb624a1f7337'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-OIL-REP-a36iezb',
  'Replace Oil System - Unimog U3000',
  'Engine',
  'Oil System',
  'Replace Oil System - Unimog U3000',
  '# Replace Oil System - Unimog U3000

## Overview
This procedure covers the replacement of the Oil System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a995deae-375d-480e-b64c-bc53e195b8b1'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-OIL-OVE-36ebk',
  'Overhaul and Rebuild Oil System - Unimog U3000',
  'Engine',
  'Oil System',
  'Overhaul and Rebuild Oil System - Unimog U3000',
  '# Overhaul and Rebuild Oil System - Unimog U3000

## Overview
This procedure covers the overhaul of the Oil System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b306464a-9f4e-46ed-a7b6-7fdaacf1c4ee'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-OIL-TRO-dzoddh',
  'Diagnose and Repair Oil System - Unimog U3000',
  'Engine',
  'Oil System',
  'Diagnose and Repair Oil System - Unimog U3000',
  '# Diagnose and Repair Oil System - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Oil System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('94e95406-77b1-444e-a176-e083168c0200'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-COO-REM-t1ajgv',
  'Remove and Install Cooling System - Unimog U3000',
  'Engine',
  'Cooling System',
  'Remove and Install Cooling System - Unimog U3000',
  '# Remove and Install Cooling System - Unimog U3000

## Overview
This procedure covers the removal of the Cooling System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('645402cd-7bcd-43b5-87d3-72b1f8c3a00c'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-COO-INS-kcjd5n',
  'Inspect and Test Cooling System - Unimog U3000',
  'Engine',
  'Cooling System',
  'Inspect and Test Cooling System - Unimog U3000',
  '# Inspect and Test Cooling System - Unimog U3000

## Overview
This procedure covers the inspection of the Cooling System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b657adcf-d397-40c2-8820-cb7fe8d71483'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-COO-ADJ-g0xmfq',
  'Adjust and Calibrate Cooling System - Unimog U3000',
  'Engine',
  'Cooling System',
  'Adjust and Calibrate Cooling System - Unimog U3000',
  '# Adjust and Calibrate Cooling System - Unimog U3000

## Overview
This procedure covers the adjustment of the Cooling System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ef4f065f-1a8d-4f7a-a394-7d6060624395'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-COO-REP-qf5zvq',
  'Replace Cooling System - Unimog U3000',
  'Engine',
  'Cooling System',
  'Replace Cooling System - Unimog U3000',
  '# Replace Cooling System - Unimog U3000

## Overview
This procedure covers the replacement of the Cooling System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('074c01aa-4e29-42c8-8710-6d1589602f6b'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-COO-OVE-kc5kmn',
  'Overhaul and Rebuild Cooling System - Unimog U3000',
  'Engine',
  'Cooling System',
  'Overhaul and Rebuild Cooling System - Unimog U3000',
  '# Overhaul and Rebuild Cooling System - Unimog U3000

## Overview
This procedure covers the overhaul of the Cooling System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8a5cf726-fe10-4e4e-a1ca-5cfd40f7dc52'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-COO-TRO-i4dom',
  'Diagnose and Repair Cooling System - Unimog U3000',
  'Engine',
  'Cooling System',
  'Diagnose and Repair Cooling System - Unimog U3000',
  '# Diagnose and Repair Cooling System - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Cooling System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('dfcbf545-2b4d-4d67-8cf7-6eed1070e585'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-FUE-REM-dyuveh',
  'Remove and Install Fuel System - Unimog U3000',
  'Engine',
  'Fuel System',
  'Remove and Install Fuel System - Unimog U3000',
  '# Remove and Install Fuel System - Unimog U3000

## Overview
This procedure covers the removal of the Fuel System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ab45e2e5-087e-4ff1-bb51-543419d72745'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-FUE-INS-060awn',
  'Inspect and Test Fuel System - Unimog U3000',
  'Engine',
  'Fuel System',
  'Inspect and Test Fuel System - Unimog U3000',
  '# Inspect and Test Fuel System - Unimog U3000

## Overview
This procedure covers the inspection of the Fuel System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('82980a0e-957b-4189-9575-4cf9d1394034'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-FUE-ADJ-cbcxjr',
  'Adjust and Calibrate Fuel System - Unimog U3000',
  'Engine',
  'Fuel System',
  'Adjust and Calibrate Fuel System - Unimog U3000',
  '# Adjust and Calibrate Fuel System - Unimog U3000

## Overview
This procedure covers the adjustment of the Fuel System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('720ae613-68ef-4491-aa7d-e096998579b1'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-FUE-REP-djyrr',
  'Replace Fuel System - Unimog U3000',
  'Engine',
  'Fuel System',
  'Replace Fuel System - Unimog U3000',
  '# Replace Fuel System - Unimog U3000

## Overview
This procedure covers the replacement of the Fuel System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ad7b835c-d6ad-4dac-b75c-803e76ddcfad'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-FUE-OVE-qjeqz',
  'Overhaul and Rebuild Fuel System - Unimog U3000',
  'Engine',
  'Fuel System',
  'Overhaul and Rebuild Fuel System - Unimog U3000',
  '# Overhaul and Rebuild Fuel System - Unimog U3000

## Overview
This procedure covers the overhaul of the Fuel System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2868fa6f-5df0-4205-9a73-a8da54ec8ad8'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-FUE-TRO-350vuv',
  'Diagnose and Repair Fuel System - Unimog U3000',
  'Engine',
  'Fuel System',
  'Diagnose and Repair Fuel System - Unimog U3000',
  '# Diagnose and Repair Fuel System - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Fuel System on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c09df6f-a08a-4fed-8cb7-3206dce914f9'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-AIR-REM-2pdo4n',
  'Remove and Install Air Intake - Unimog U3000',
  'Engine',
  'Air Intake',
  'Remove and Install Air Intake - Unimog U3000',
  '# Remove and Install Air Intake - Unimog U3000

## Overview
This procedure covers the removal of the Air Intake on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8785bb80-44a6-4073-8719-de5b412f7597'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-AIR-INS-19tx0l',
  'Inspect and Test Air Intake - Unimog U3000',
  'Engine',
  'Air Intake',
  'Inspect and Test Air Intake - Unimog U3000',
  '# Inspect and Test Air Intake - Unimog U3000

## Overview
This procedure covers the inspection of the Air Intake on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('171fe622-5af5-4e79-84a8-32759a0bdad9'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-AIR-ADJ-n0fy8j',
  'Adjust and Calibrate Air Intake - Unimog U3000',
  'Engine',
  'Air Intake',
  'Adjust and Calibrate Air Intake - Unimog U3000',
  '# Adjust and Calibrate Air Intake - Unimog U3000

## Overview
This procedure covers the adjustment of the Air Intake on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('893c6606-02d6-4f88-9059-73bcaeca5d81'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-AIR-REP-c4e7ed',
  'Replace Air Intake - Unimog U3000',
  'Engine',
  'Air Intake',
  'Replace Air Intake - Unimog U3000',
  '# Replace Air Intake - Unimog U3000

## Overview
This procedure covers the replacement of the Air Intake on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ac31ef90-c82d-4606-bf85-ada6ea1f5203'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-AIR-OVE-ghxfn',
  'Overhaul and Rebuild Air Intake - Unimog U3000',
  'Engine',
  'Air Intake',
  'Overhaul and Rebuild Air Intake - Unimog U3000',
  '# Overhaul and Rebuild Air Intake - Unimog U3000

## Overview
This procedure covers the overhaul of the Air Intake on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0b1fb295-7e7b-4b94-b421-47ba9ee4f30b'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-AIR-TRO-37r7b',
  'Diagnose and Repair Air Intake - Unimog U3000',
  'Engine',
  'Air Intake',
  'Diagnose and Repair Air Intake - Unimog U3000',
  '# Diagnose and Repair Air Intake - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Air Intake on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1d91f821-d344-4889-94d1-c2678817b84f'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-EXH-REM-ppirfl',
  'Remove and Install Exhaust - Unimog U3000',
  'Engine',
  'Exhaust',
  'Remove and Install Exhaust - Unimog U3000',
  '# Remove and Install Exhaust - Unimog U3000

## Overview
This procedure covers the removal of the Exhaust on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('508d70c9-db02-4e94-8ced-ce8dc263befd'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-EXH-INS-81jz2g',
  'Inspect and Test Exhaust - Unimog U3000',
  'Engine',
  'Exhaust',
  'Inspect and Test Exhaust - Unimog U3000',
  '# Inspect and Test Exhaust - Unimog U3000

## Overview
This procedure covers the inspection of the Exhaust on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('50792de7-0416-4918-a446-5e20af0926e5'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-EXH-ADJ-ho467',
  'Adjust and Calibrate Exhaust - Unimog U3000',
  'Engine',
  'Exhaust',
  'Adjust and Calibrate Exhaust - Unimog U3000',
  '# Adjust and Calibrate Exhaust - Unimog U3000

## Overview
This procedure covers the adjustment of the Exhaust on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('248754ff-d282-4986-bab3-b3de1c83bde6'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-EXH-REP-qdz34j',
  'Replace Exhaust - Unimog U3000',
  'Engine',
  'Exhaust',
  'Replace Exhaust - Unimog U3000',
  '# Replace Exhaust - Unimog U3000

## Overview
This procedure covers the replacement of the Exhaust on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2a5ff6cf-3ed5-41ac-a27e-3d9066099703'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-EXH-OVE-mkfy58',
  'Overhaul and Rebuild Exhaust - Unimog U3000',
  'Engine',
  'Exhaust',
  'Overhaul and Rebuild Exhaust - Unimog U3000',
  '# Overhaul and Rebuild Exhaust - Unimog U3000

## Overview
This procedure covers the overhaul of the Exhaust on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0b706678-8471-4e62-a125-c3124dc64bf1'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-EXH-TRO-shbhos',
  'Diagnose and Repair Exhaust - Unimog U3000',
  'Engine',
  'Exhaust',
  'Diagnose and Repair Exhaust - Unimog U3000',
  '# Diagnose and Repair Exhaust - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Exhaust on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9335bf5a-d433-4aeb-9f18-7586599b3dd7'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-TUR-REM-ffkta',
  'Remove and Install Turbocharger - Unimog U3000',
  'Engine',
  'Turbocharger',
  'Remove and Install Turbocharger - Unimog U3000',
  '# Remove and Install Turbocharger - Unimog U3000

## Overview
This procedure covers the removal of the Turbocharger on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1930ec41-7738-4585-8420-a112781b684a'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-TUR-INS-lpxe5',
  'Inspect and Test Turbocharger - Unimog U3000',
  'Engine',
  'Turbocharger',
  'Inspect and Test Turbocharger - Unimog U3000',
  '# Inspect and Test Turbocharger - Unimog U3000

## Overview
This procedure covers the inspection of the Turbocharger on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f09b51ae-93e4-418d-9ecc-833d75616f79'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-TUR-ADJ-eg474q',
  'Adjust and Calibrate Turbocharger - Unimog U3000',
  'Engine',
  'Turbocharger',
  'Adjust and Calibrate Turbocharger - Unimog U3000',
  '# Adjust and Calibrate Turbocharger - Unimog U3000

## Overview
This procedure covers the adjustment of the Turbocharger on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6ac24383-c745-4b08-8a0a-3380bb6999ae'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-TUR-REP-k18v97',
  'Replace Turbocharger - Unimog U3000',
  'Engine',
  'Turbocharger',
  'Replace Turbocharger - Unimog U3000',
  '# Replace Turbocharger - Unimog U3000

## Overview
This procedure covers the replacement of the Turbocharger on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('30d6d890-8f1c-4f6b-aa88-076550c34585'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-TUR-OVE-uel78',
  'Overhaul and Rebuild Turbocharger - Unimog U3000',
  'Engine',
  'Turbocharger',
  'Overhaul and Rebuild Turbocharger - Unimog U3000',
  '# Overhaul and Rebuild Turbocharger - Unimog U3000

## Overview
This procedure covers the overhaul of the Turbocharger on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('41118498-330d-4469-bbf2-ed3e3e526c7e'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-ENG-TUR-TRO-hp1jua',
  'Diagnose and Repair Turbocharger - Unimog U3000',
  'Engine',
  'Turbocharger',
  'Diagnose and Repair Turbocharger - Unimog U3000',
  '# Diagnose and Repair Turbocharger - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Turbocharger on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Eng-001 for system overview
- See U3000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2474206d-a232-4f64-b2c8-41f11aa3dbb2'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-MAN-REM-e6qez',
  'Remove and Install Manual Gearbox - Unimog U3000',
  'Transmission',
  'Manual Gearbox',
  'Remove and Install Manual Gearbox - Unimog U3000',
  '# Remove and Install Manual Gearbox - Unimog U3000

## Overview
This procedure covers the removal of the Manual Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('12dac53d-3b2b-44cc-9c55-22aa3ee07d22'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-MAN-INS-sg3va6',
  'Inspect and Test Manual Gearbox - Unimog U3000',
  'Transmission',
  'Manual Gearbox',
  'Inspect and Test Manual Gearbox - Unimog U3000',
  '# Inspect and Test Manual Gearbox - Unimog U3000

## Overview
This procedure covers the inspection of the Manual Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('557830d0-5e97-4d8a-a816-10fd08261f4e'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-MAN-ADJ-f5jhwy',
  'Adjust and Calibrate Manual Gearbox - Unimog U3000',
  'Transmission',
  'Manual Gearbox',
  'Adjust and Calibrate Manual Gearbox - Unimog U3000',
  '# Adjust and Calibrate Manual Gearbox - Unimog U3000

## Overview
This procedure covers the adjustment of the Manual Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('377a0781-de52-437a-a56a-b4d7bfdff5a1'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-MAN-REP-jqcp3',
  'Replace Manual Gearbox - Unimog U3000',
  'Transmission',
  'Manual Gearbox',
  'Replace Manual Gearbox - Unimog U3000',
  '# Replace Manual Gearbox - Unimog U3000

## Overview
This procedure covers the replacement of the Manual Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0473c8f5-2cea-463f-853d-1b97bdb985fe'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-MAN-OVE-eshyje',
  'Overhaul and Rebuild Manual Gearbox - Unimog U3000',
  'Transmission',
  'Manual Gearbox',
  'Overhaul and Rebuild Manual Gearbox - Unimog U3000',
  '# Overhaul and Rebuild Manual Gearbox - Unimog U3000

## Overview
This procedure covers the overhaul of the Manual Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('89549a79-d471-4fa1-a252-1d9c0784789a'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-MAN-TRO-47kj1cq',
  'Diagnose and Repair Manual Gearbox - Unimog U3000',
  'Transmission',
  'Manual Gearbox',
  'Diagnose and Repair Manual Gearbox - Unimog U3000',
  '# Diagnose and Repair Manual Gearbox - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Manual Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1befa208-9e5e-45ff-a3e6-7cf90b04236f'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-AUT-REM-t6ayr',
  'Remove and Install Automatic Gearbox - Unimog U3000',
  'Transmission',
  'Automatic Gearbox',
  'Remove and Install Automatic Gearbox - Unimog U3000',
  '# Remove and Install Automatic Gearbox - Unimog U3000

## Overview
This procedure covers the removal of the Automatic Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('db1f52b2-7791-430a-99e2-9294b96afcc5'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-AUT-INS-ply7f',
  'Inspect and Test Automatic Gearbox - Unimog U3000',
  'Transmission',
  'Automatic Gearbox',
  'Inspect and Test Automatic Gearbox - Unimog U3000',
  '# Inspect and Test Automatic Gearbox - Unimog U3000

## Overview
This procedure covers the inspection of the Automatic Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2dcfba08-9ce5-401a-8243-98068e94bc54'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-AUT-ADJ-fo9w2l',
  'Adjust and Calibrate Automatic Gearbox - Unimog U3000',
  'Transmission',
  'Automatic Gearbox',
  'Adjust and Calibrate Automatic Gearbox - Unimog U3000',
  '# Adjust and Calibrate Automatic Gearbox - Unimog U3000

## Overview
This procedure covers the adjustment of the Automatic Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4200e11e-26f4-43b1-9603-3183f7c68144'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-AUT-REP-kwofm2',
  'Replace Automatic Gearbox - Unimog U3000',
  'Transmission',
  'Automatic Gearbox',
  'Replace Automatic Gearbox - Unimog U3000',
  '# Replace Automatic Gearbox - Unimog U3000

## Overview
This procedure covers the replacement of the Automatic Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('864cc8ad-49ed-4b5e-8acc-4d3ed51f5151'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-AUT-OVE-cu5lkf',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U3000',
  'Transmission',
  'Automatic Gearbox',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U3000',
  '# Overhaul and Rebuild Automatic Gearbox - Unimog U3000

## Overview
This procedure covers the overhaul of the Automatic Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ccdc6b5d-9442-41ce-beaf-b4d4eb3bb254'),
  uuid('eeee0001-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U3000-TRA-AUT-TRO-49ft0k',
  'Diagnose and Repair Automatic Gearbox - Unimog U3000',
  'Transmission',
  'Automatic Gearbox',
  'Diagnose and Repair Automatic Gearbox - Unimog U3000',
  '# Diagnose and Repair Automatic Gearbox - Unimog U3000

## Overview
This procedure covers the troubleshooting of the Automatic Gearbox on Unimog U3000 vehicles with OM926LA engine.
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
- See U3000-Tra-001 for system overview
- See U3000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
);

-- Verify this chunk
SELECT COUNT(*) as procedures_in_db FROM wis_procedures;
