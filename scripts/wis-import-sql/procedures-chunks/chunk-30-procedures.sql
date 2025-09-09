-- WIS Procedures Import - Chunk 30
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 30 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('0b6a49ef-3c3d-42ef-8a2c-3c429b961cb8'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-MIR-ADJ-hsiput',
  'Adjust and Calibrate Mirrors - Unimog U4000',
  'Body',
  'Mirrors',
  'Adjust and Calibrate Mirrors - Unimog U4000',
  '# Adjust and Calibrate Mirrors - Unimog U4000

## Overview
This procedure covers the adjustment of the Mirrors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('02f0f7f5-94a9-4995-bceb-ec3bf13f7614'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-MIR-REP-0430yg',
  'Replace Mirrors - Unimog U4000',
  'Body',
  'Mirrors',
  'Replace Mirrors - Unimog U4000',
  '# Replace Mirrors - Unimog U4000

## Overview
This procedure covers the replacement of the Mirrors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cd05e3ea-a80e-4b6e-9796-f8b78aaf5ee3'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-MIR-OVE-fj61r',
  'Overhaul and Rebuild Mirrors - Unimog U4000',
  'Body',
  'Mirrors',
  'Overhaul and Rebuild Mirrors - Unimog U4000',
  '# Overhaul and Rebuild Mirrors - Unimog U4000

## Overview
This procedure covers the overhaul of the Mirrors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('19f9f901-928a-42f1-9096-1c958c702d08'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-MIR-TRO-nwbf2yt',
  'Diagnose and Repair Mirrors - Unimog U4000',
  'Body',
  'Mirrors',
  'Diagnose and Repair Mirrors - Unimog U4000',
  '# Diagnose and Repair Mirrors - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Mirrors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ead854ec-015a-40cf-a3d2-d8e0f559fbe7'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-SEA-REM-48evht',
  'Remove and Install Seats - Unimog U4000',
  'Body',
  'Seats',
  'Remove and Install Seats - Unimog U4000',
  '# Remove and Install Seats - Unimog U4000

## Overview
This procedure covers the removal of the Seats on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('09d6f8bb-4a13-49f2-975c-de8258122f47'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-SEA-INS-s2yapf',
  'Inspect and Test Seats - Unimog U4000',
  'Body',
  'Seats',
  'Inspect and Test Seats - Unimog U4000',
  '# Inspect and Test Seats - Unimog U4000

## Overview
This procedure covers the inspection of the Seats on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9fd53c50-92a8-43ff-9178-c31dc88dd8cc'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-SEA-ADJ-uz1iwt',
  'Adjust and Calibrate Seats - Unimog U4000',
  'Body',
  'Seats',
  'Adjust and Calibrate Seats - Unimog U4000',
  '# Adjust and Calibrate Seats - Unimog U4000

## Overview
This procedure covers the adjustment of the Seats on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('52939877-0b13-4268-9c98-107dbbe9467c'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-SEA-REP-j44zf',
  'Replace Seats - Unimog U4000',
  'Body',
  'Seats',
  'Replace Seats - Unimog U4000',
  '# Replace Seats - Unimog U4000

## Overview
This procedure covers the replacement of the Seats on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('670452b9-43ec-4774-9dcc-e9780c3c5738'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-SEA-OVE-arll6h',
  'Overhaul and Rebuild Seats - Unimog U4000',
  'Body',
  'Seats',
  'Overhaul and Rebuild Seats - Unimog U4000',
  '# Overhaul and Rebuild Seats - Unimog U4000

## Overview
This procedure covers the overhaul of the Seats on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3bb029c0-ab58-4347-a5da-0eadfda3bd91'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-SEA-TRO-sh7irc',
  'Diagnose and Repair Seats - Unimog U4000',
  'Body',
  'Seats',
  'Diagnose and Repair Seats - Unimog U4000',
  '# Diagnose and Repair Seats - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Seats on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Bod-001 for system overview
- See U4000-Bod-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Panel removal tools','Rivet gun','Body hammer set']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b5b2767b-5a83-4843-ad92-23d1c890bc60'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-WIN-REM-jayi2',
  'Remove and Install Winch - Unimog U4000',
  'Special Equipment',
  'Winch',
  'Remove and Install Winch - Unimog U4000',
  '# Remove and Install Winch - Unimog U4000

## Overview
This procedure covers the removal of the Winch on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9813ff1c-1949-451b-989a-0fed55ea5383'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-WIN-INS-3m5ge',
  'Inspect and Test Winch - Unimog U4000',
  'Special Equipment',
  'Winch',
  'Inspect and Test Winch - Unimog U4000',
  '# Inspect and Test Winch - Unimog U4000

## Overview
This procedure covers the inspection of the Winch on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bb6d0379-70ad-4704-ac2b-2479c19a36be'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-WIN-ADJ-wrs54n',
  'Adjust and Calibrate Winch - Unimog U4000',
  'Special Equipment',
  'Winch',
  'Adjust and Calibrate Winch - Unimog U4000',
  '# Adjust and Calibrate Winch - Unimog U4000

## Overview
This procedure covers the adjustment of the Winch on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ad7f794c-3fc8-46e9-8c36-42ecb7a57305'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-WIN-REP-0aopy8',
  'Replace Winch - Unimog U4000',
  'Special Equipment',
  'Winch',
  'Replace Winch - Unimog U4000',
  '# Replace Winch - Unimog U4000

## Overview
This procedure covers the replacement of the Winch on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6413bbc0-9393-4397-bf35-15ef5d7e2a5f'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-WIN-OVE-oqd7t',
  'Overhaul and Rebuild Winch - Unimog U4000',
  'Special Equipment',
  'Winch',
  'Overhaul and Rebuild Winch - Unimog U4000',
  '# Overhaul and Rebuild Winch - Unimog U4000

## Overview
This procedure covers the overhaul of the Winch on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d8778320-65fa-4df3-89d3-848574c83701'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-WIN-TRO-38zdo',
  'Diagnose and Repair Winch - Unimog U4000',
  'Special Equipment',
  'Winch',
  'Diagnose and Repair Winch - Unimog U4000',
  '# Diagnose and Repair Winch - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Winch on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('063f5071-d1a8-4b0e-82dd-90cc70767f44'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-CRA-REM-ykllz',
  'Remove and Install Crane - Unimog U4000',
  'Special Equipment',
  'Crane',
  'Remove and Install Crane - Unimog U4000',
  '# Remove and Install Crane - Unimog U4000

## Overview
This procedure covers the removal of the Crane on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d75888d5-4a68-4d24-beed-d1f7dfc37736'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-CRA-INS-ftis7',
  'Inspect and Test Crane - Unimog U4000',
  'Special Equipment',
  'Crane',
  'Inspect and Test Crane - Unimog U4000',
  '# Inspect and Test Crane - Unimog U4000

## Overview
This procedure covers the inspection of the Crane on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('46bd21f1-cfd6-450d-9392-6c7bd456f379'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-CRA-ADJ-f3r6am',
  'Adjust and Calibrate Crane - Unimog U4000',
  'Special Equipment',
  'Crane',
  'Adjust and Calibrate Crane - Unimog U4000',
  '# Adjust and Calibrate Crane - Unimog U4000

## Overview
This procedure covers the adjustment of the Crane on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bc06ce4d-28cf-4c16-9aef-3e4db9277bc4'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-CRA-REP-2lxge4',
  'Replace Crane - Unimog U4000',
  'Special Equipment',
  'Crane',
  'Replace Crane - Unimog U4000',
  '# Replace Crane - Unimog U4000

## Overview
This procedure covers the replacement of the Crane on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c169088a-2575-45d2-bb1d-47836ec35fa7'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-CRA-OVE-5frgq8',
  'Overhaul and Rebuild Crane - Unimog U4000',
  'Special Equipment',
  'Crane',
  'Overhaul and Rebuild Crane - Unimog U4000',
  '# Overhaul and Rebuild Crane - Unimog U4000

## Overview
This procedure covers the overhaul of the Crane on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1bebbdca-607c-48d9-9433-b6cf137ef9c5'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-CRA-TRO-bunde9',
  'Diagnose and Repair Crane - Unimog U4000',
  'Special Equipment',
  'Crane',
  'Diagnose and Repair Crane - Unimog U4000',
  '# Diagnose and Repair Crane - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Crane on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fe26daec-71ae-451e-8193-fd0ff1e53902'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-SNO-REM-o7fqto',
  'Remove and Install Snow Plow - Unimog U4000',
  'Special Equipment',
  'Snow Plow',
  'Remove and Install Snow Plow - Unimog U4000',
  '# Remove and Install Snow Plow - Unimog U4000

## Overview
This procedure covers the removal of the Snow Plow on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4e995d03-41d1-4893-9e04-96999503f3bd'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-SNO-INS-2y87sv',
  'Inspect and Test Snow Plow - Unimog U4000',
  'Special Equipment',
  'Snow Plow',
  'Inspect and Test Snow Plow - Unimog U4000',
  '# Inspect and Test Snow Plow - Unimog U4000

## Overview
This procedure covers the inspection of the Snow Plow on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2f158877-1f73-414e-88be-d7b683e87202'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-SNO-ADJ-wmhqzq',
  'Adjust and Calibrate Snow Plow - Unimog U4000',
  'Special Equipment',
  'Snow Plow',
  'Adjust and Calibrate Snow Plow - Unimog U4000',
  '# Adjust and Calibrate Snow Plow - Unimog U4000

## Overview
This procedure covers the adjustment of the Snow Plow on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0af27a05-98cb-4659-b40c-b49ae7dca01a'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-SNO-REP-8jmake',
  'Replace Snow Plow - Unimog U4000',
  'Special Equipment',
  'Snow Plow',
  'Replace Snow Plow - Unimog U4000',
  '# Replace Snow Plow - Unimog U4000

## Overview
This procedure covers the replacement of the Snow Plow on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2153e715-089d-4aa2-869e-c28a5138f181'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-SNO-OVE-xvbmc8',
  'Overhaul and Rebuild Snow Plow - Unimog U4000',
  'Special Equipment',
  'Snow Plow',
  'Overhaul and Rebuild Snow Plow - Unimog U4000',
  '# Overhaul and Rebuild Snow Plow - Unimog U4000

## Overview
This procedure covers the overhaul of the Snow Plow on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7ff493b8-6899-4ac4-8309-666196d34246'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-SNO-TRO-4nnknr',
  'Diagnose and Repair Snow Plow - Unimog U4000',
  'Special Equipment',
  'Snow Plow',
  'Diagnose and Repair Snow Plow - Unimog U4000',
  '# Diagnose and Repair Snow Plow - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Snow Plow on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('201b44f5-6674-4e72-b929-3f68883b918e'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-IMP-REM-rjzux',
  'Remove and Install Implement Carrier - Unimog U4000',
  'Special Equipment',
  'Implement Carrier',
  'Remove and Install Implement Carrier - Unimog U4000',
  '# Remove and Install Implement Carrier - Unimog U4000

## Overview
This procedure covers the removal of the Implement Carrier on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d1342af0-7beb-4dc4-ae53-da3f1bc45f6a'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-IMP-INS-1ost39',
  'Inspect and Test Implement Carrier - Unimog U4000',
  'Special Equipment',
  'Implement Carrier',
  'Inspect and Test Implement Carrier - Unimog U4000',
  '# Inspect and Test Implement Carrier - Unimog U4000

## Overview
This procedure covers the inspection of the Implement Carrier on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('150daca3-6eb6-429f-afaa-3c41a56eeb56'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-IMP-ADJ-a5xj9b',
  'Adjust and Calibrate Implement Carrier - Unimog U4000',
  'Special Equipment',
  'Implement Carrier',
  'Adjust and Calibrate Implement Carrier - Unimog U4000',
  '# Adjust and Calibrate Implement Carrier - Unimog U4000

## Overview
This procedure covers the adjustment of the Implement Carrier on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2f841614-fd5e-474c-8d37-d7aa3864934f'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-IMP-REP-yv7r2i',
  'Replace Implement Carrier - Unimog U4000',
  'Special Equipment',
  'Implement Carrier',
  'Replace Implement Carrier - Unimog U4000',
  '# Replace Implement Carrier - Unimog U4000

## Overview
This procedure covers the replacement of the Implement Carrier on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('272d9749-7f90-45dc-b656-3db7b3410a6b'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-IMP-OVE-hk6lrl',
  'Overhaul and Rebuild Implement Carrier - Unimog U4000',
  'Special Equipment',
  'Implement Carrier',
  'Overhaul and Rebuild Implement Carrier - Unimog U4000',
  '# Overhaul and Rebuild Implement Carrier - Unimog U4000

## Overview
This procedure covers the overhaul of the Implement Carrier on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cca48626-6697-45d6-9a91-4a50dbb22913'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-IMP-TRO-bpw3wo',
  'Diagnose and Repair Implement Carrier - Unimog U4000',
  'Special Equipment',
  'Implement Carrier',
  'Diagnose and Repair Implement Carrier - Unimog U4000',
  '# Diagnose and Repair Implement Carrier - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Implement Carrier on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('efc7d9d2-2d66-498d-bdd5-a7c3ea8a9383'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-TIP-REM-975i',
  'Remove and Install Tipper - Unimog U4000',
  'Special Equipment',
  'Tipper',
  'Remove and Install Tipper - Unimog U4000',
  '# Remove and Install Tipper - Unimog U4000

## Overview
This procedure covers the removal of the Tipper on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4a96e489-f467-4587-aa5e-5a6747023d1d'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-TIP-INS-ozkj8',
  'Inspect and Test Tipper - Unimog U4000',
  'Special Equipment',
  'Tipper',
  'Inspect and Test Tipper - Unimog U4000',
  '# Inspect and Test Tipper - Unimog U4000

## Overview
This procedure covers the inspection of the Tipper on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('900bd2c4-5f26-40f0-86c2-3b58ed8e79ee'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-TIP-ADJ-8qq27p',
  'Adjust and Calibrate Tipper - Unimog U4000',
  'Special Equipment',
  'Tipper',
  'Adjust and Calibrate Tipper - Unimog U4000',
  '# Adjust and Calibrate Tipper - Unimog U4000

## Overview
This procedure covers the adjustment of the Tipper on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f234d8f1-5d90-48bb-ad3c-17a9b23b796e'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-TIP-REP-5731i6',
  'Replace Tipper - Unimog U4000',
  'Special Equipment',
  'Tipper',
  'Replace Tipper - Unimog U4000',
  '# Replace Tipper - Unimog U4000

## Overview
This procedure covers the replacement of the Tipper on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('083a1ad1-2662-4cd5-872a-d7fee655627c'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-TIP-OVE-hg0m7',
  'Overhaul and Rebuild Tipper - Unimog U4000',
  'Special Equipment',
  'Tipper',
  'Overhaul and Rebuild Tipper - Unimog U4000',
  '# Overhaul and Rebuild Tipper - Unimog U4000

## Overview
This procedure covers the overhaul of the Tipper on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3acd7212-f027-409a-99b7-8cc31a9d1a55'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SPE-TIP-TRO-o6s5im',
  'Diagnose and Repair Tipper - Unimog U4000',
  'Special Equipment',
  'Tipper',
  'Diagnose and Repair Tipper - Unimog U4000',
  '# Diagnose and Repair Tipper - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Tipper on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Spe-001 for system overview
- See U4000-Spe-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Hydraulic crane','PTO engagement tool','Implement pins']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('909dfbda-4c2a-466f-ade2-e47989cd1ccb'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-OIL-REM-3vc2sp',
  'Remove and Install Oil System - Unimog U5000',
  'Engine',
  'Oil System',
  'Remove and Install Oil System - Unimog U5000',
  '# Remove and Install Oil System - Unimog U5000

## Overview
This procedure covers the removal of the Oil System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0268cec8-2364-4d9c-9d2f-e010ddaff691'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-OIL-INS-0wjt5',
  'Inspect and Test Oil System - Unimog U5000',
  'Engine',
  'Oil System',
  'Inspect and Test Oil System - Unimog U5000',
  '# Inspect and Test Oil System - Unimog U5000

## Overview
This procedure covers the inspection of the Oil System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2d83b9c3-66c3-4e76-b147-3947f8b52db8'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-OIL-ADJ-fuhdab',
  'Adjust and Calibrate Oil System - Unimog U5000',
  'Engine',
  'Oil System',
  'Adjust and Calibrate Oil System - Unimog U5000',
  '# Adjust and Calibrate Oil System - Unimog U5000

## Overview
This procedure covers the adjustment of the Oil System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e33d0cfa-fc4a-4db0-9310-692869b5d04c'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-OIL-REP-h10pok',
  'Replace Oil System - Unimog U5000',
  'Engine',
  'Oil System',
  'Replace Oil System - Unimog U5000',
  '# Replace Oil System - Unimog U5000

## Overview
This procedure covers the replacement of the Oil System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a396e046-1018-460b-b1bc-307d4622c7d7'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-OIL-OVE-1i4fik',
  'Overhaul and Rebuild Oil System - Unimog U5000',
  'Engine',
  'Oil System',
  'Overhaul and Rebuild Oil System - Unimog U5000',
  '# Overhaul and Rebuild Oil System - Unimog U5000

## Overview
This procedure covers the overhaul of the Oil System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('74bea083-5f10-4085-9f24-6c415e2c9da5'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-OIL-TRO-a34n0f',
  'Diagnose and Repair Oil System - Unimog U5000',
  'Engine',
  'Oil System',
  'Diagnose and Repair Oil System - Unimog U5000',
  '# Diagnose and Repair Oil System - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Oil System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Engine oil 15W-40','Oil filter A0001802609','Drain plug gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7fc23e02-049f-41e7-be01-b0059c1be47b'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-COO-REM-7slhrk',
  'Remove and Install Cooling System - Unimog U5000',
  'Engine',
  'Cooling System',
  'Remove and Install Cooling System - Unimog U5000',
  '# Remove and Install Cooling System - Unimog U5000

## Overview
This procedure covers the removal of the Cooling System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('793d9cb2-8273-4ae6-a3c8-ab27c9fe1c4d'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-COO-INS-bbmw48',
  'Inspect and Test Cooling System - Unimog U5000',
  'Engine',
  'Cooling System',
  'Inspect and Test Cooling System - Unimog U5000',
  '# Inspect and Test Cooling System - Unimog U5000

## Overview
This procedure covers the inspection of the Cooling System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5da787d4-53e8-4ce4-8a2f-3283b87d0976'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-COO-ADJ-uixvp8',
  'Adjust and Calibrate Cooling System - Unimog U5000',
  'Engine',
  'Cooling System',
  'Adjust and Calibrate Cooling System - Unimog U5000',
  '# Adjust and Calibrate Cooling System - Unimog U5000

## Overview
This procedure covers the adjustment of the Cooling System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a2c6e64b-1bc3-444c-ad57-c9599f8b7a5a'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-COO-REP-bcgogf',
  'Replace Cooling System - Unimog U5000',
  'Engine',
  'Cooling System',
  'Replace Cooling System - Unimog U5000',
  '# Replace Cooling System - Unimog U5000

## Overview
This procedure covers the replacement of the Cooling System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4de1dae7-c81f-4bc8-ab22-e29d029fd794'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-COO-OVE-d0912p',
  'Overhaul and Rebuild Cooling System - Unimog U5000',
  'Engine',
  'Cooling System',
  'Overhaul and Rebuild Cooling System - Unimog U5000',
  '# Overhaul and Rebuild Cooling System - Unimog U5000

## Overview
This procedure covers the overhaul of the Cooling System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b4ae5eec-73d9-4fd9-b0e8-ccf7bc55eff9'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-COO-TRO-6ob1ib',
  'Diagnose and Repair Cooling System - Unimog U5000',
  'Engine',
  'Cooling System',
  'Diagnose and Repair Cooling System - Unimog U5000',
  '# Diagnose and Repair Cooling System - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Cooling System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9b524b25-b0b5-4434-8b9c-a5a5aaca50f3'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-FUE-REM-zi0ewf',
  'Remove and Install Fuel System - Unimog U5000',
  'Engine',
  'Fuel System',
  'Remove and Install Fuel System - Unimog U5000',
  '# Remove and Install Fuel System - Unimog U5000

## Overview
This procedure covers the removal of the Fuel System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('191cd3ed-f5be-447c-8841-faec13e557aa'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-FUE-INS-kwj4s8',
  'Inspect and Test Fuel System - Unimog U5000',
  'Engine',
  'Fuel System',
  'Inspect and Test Fuel System - Unimog U5000',
  '# Inspect and Test Fuel System - Unimog U5000

## Overview
This procedure covers the inspection of the Fuel System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('13ae94a5-0123-417b-8b78-9d3209150553'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-FUE-ADJ-vsce27p',
  'Adjust and Calibrate Fuel System - Unimog U5000',
  'Engine',
  'Fuel System',
  'Adjust and Calibrate Fuel System - Unimog U5000',
  '# Adjust and Calibrate Fuel System - Unimog U5000

## Overview
This procedure covers the adjustment of the Fuel System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e14816fc-7291-49d5-a561-3cf657a3c934'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-FUE-REP-qibolmc',
  'Replace Fuel System - Unimog U5000',
  'Engine',
  'Fuel System',
  'Replace Fuel System - Unimog U5000',
  '# Replace Fuel System - Unimog U5000

## Overview
This procedure covers the replacement of the Fuel System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7aee321d-d00c-4b35-8034-a5f614bd0507'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-FUE-OVE-0sd423',
  'Overhaul and Rebuild Fuel System - Unimog U5000',
  'Engine',
  'Fuel System',
  'Overhaul and Rebuild Fuel System - Unimog U5000',
  '# Overhaul and Rebuild Fuel System - Unimog U5000

## Overview
This procedure covers the overhaul of the Fuel System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('037bada1-a4b9-44c7-8b23-2a6c267fbff9'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-FUE-TRO-50rcv',
  'Diagnose and Repair Fuel System - Unimog U5000',
  'Engine',
  'Fuel System',
  'Diagnose and Repair Fuel System - Unimog U5000',
  '# Diagnose and Repair Fuel System - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Fuel System on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d8de72be-497c-431a-95fd-657d3d0a76a4'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-AIR-REM-c2ku9e',
  'Remove and Install Air Intake - Unimog U5000',
  'Engine',
  'Air Intake',
  'Remove and Install Air Intake - Unimog U5000',
  '# Remove and Install Air Intake - Unimog U5000

## Overview
This procedure covers the removal of the Air Intake on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a7defba8-ab22-446f-8bab-296d3cfd17e2'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-AIR-INS-2dk97',
  'Inspect and Test Air Intake - Unimog U5000',
  'Engine',
  'Air Intake',
  'Inspect and Test Air Intake - Unimog U5000',
  '# Inspect and Test Air Intake - Unimog U5000

## Overview
This procedure covers the inspection of the Air Intake on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('50b9acc1-e3fe-470e-9e18-b7a8103ad067'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-AIR-ADJ-vuzxbe',
  'Adjust and Calibrate Air Intake - Unimog U5000',
  'Engine',
  'Air Intake',
  'Adjust and Calibrate Air Intake - Unimog U5000',
  '# Adjust and Calibrate Air Intake - Unimog U5000

## Overview
This procedure covers the adjustment of the Air Intake on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f9f926d4-ee84-4415-81f1-5733fbf24ee5'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-AIR-REP-b6l3t8',
  'Replace Air Intake - Unimog U5000',
  'Engine',
  'Air Intake',
  'Replace Air Intake - Unimog U5000',
  '# Replace Air Intake - Unimog U5000

## Overview
This procedure covers the replacement of the Air Intake on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7a946173-634a-4df4-83e9-d15bed047671'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-AIR-OVE-xixc44',
  'Overhaul and Rebuild Air Intake - Unimog U5000',
  'Engine',
  'Air Intake',
  'Overhaul and Rebuild Air Intake - Unimog U5000',
  '# Overhaul and Rebuild Air Intake - Unimog U5000

## Overview
This procedure covers the overhaul of the Air Intake on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('fb551f14-be7a-489c-b623-aff12f24b6a4'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-AIR-TRO-9dasbf',
  'Diagnose and Repair Air Intake - Unimog U5000',
  'Engine',
  'Air Intake',
  'Diagnose and Repair Air Intake - Unimog U5000',
  '# Diagnose and Repair Air Intake - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Air Intake on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5f87d5d0-32f0-41c7-b7cf-cd736583696d'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-EXH-REM-eqoe9n',
  'Remove and Install Exhaust - Unimog U5000',
  'Engine',
  'Exhaust',
  'Remove and Install Exhaust - Unimog U5000',
  '# Remove and Install Exhaust - Unimog U5000

## Overview
This procedure covers the removal of the Exhaust on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('93da2cf5-3cb5-4bce-ac04-2531b99ed69b'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-EXH-INS-2ubxee',
  'Inspect and Test Exhaust - Unimog U5000',
  'Engine',
  'Exhaust',
  'Inspect and Test Exhaust - Unimog U5000',
  '# Inspect and Test Exhaust - Unimog U5000

## Overview
This procedure covers the inspection of the Exhaust on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('12edf64d-1db1-43c6-a853-2689954aa409'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-EXH-ADJ-s420k',
  'Adjust and Calibrate Exhaust - Unimog U5000',
  'Engine',
  'Exhaust',
  'Adjust and Calibrate Exhaust - Unimog U5000',
  '# Adjust and Calibrate Exhaust - Unimog U5000

## Overview
This procedure covers the adjustment of the Exhaust on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6ed37da7-1ae2-4323-94de-bd6ae10a78ef'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-EXH-REP-b4f0k8',
  'Replace Exhaust - Unimog U5000',
  'Engine',
  'Exhaust',
  'Replace Exhaust - Unimog U5000',
  '# Replace Exhaust - Unimog U5000

## Overview
This procedure covers the replacement of the Exhaust on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bff7f7d4-72c4-4ee8-8d52-361efc0b04b5'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-EXH-OVE-e4whxm',
  'Overhaul and Rebuild Exhaust - Unimog U5000',
  'Engine',
  'Exhaust',
  'Overhaul and Rebuild Exhaust - Unimog U5000',
  '# Overhaul and Rebuild Exhaust - Unimog U5000

## Overview
This procedure covers the overhaul of the Exhaust on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('20fe3d34-5333-4678-8331-1e6e2212cbd2'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-EXH-TRO-ays6ep',
  'Diagnose and Repair Exhaust - Unimog U5000',
  'Engine',
  'Exhaust',
  'Diagnose and Repair Exhaust - Unimog U5000',
  '# Diagnose and Repair Exhaust - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Exhaust on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e92602e3-d223-4fc8-89f1-3622bae9c091'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-TUR-REM-58zzq',
  'Remove and Install Turbocharger - Unimog U5000',
  'Engine',
  'Turbocharger',
  'Remove and Install Turbocharger - Unimog U5000',
  '# Remove and Install Turbocharger - Unimog U5000

## Overview
This procedure covers the removal of the Turbocharger on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d69f8473-a1e2-42a2-bf4f-0d08f3d21f1b'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-TUR-INS-pfhmz',
  'Inspect and Test Turbocharger - Unimog U5000',
  'Engine',
  'Turbocharger',
  'Inspect and Test Turbocharger - Unimog U5000',
  '# Inspect and Test Turbocharger - Unimog U5000

## Overview
This procedure covers the inspection of the Turbocharger on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('de5607bf-f607-4c76-9851-a447ece6e71e'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-TUR-ADJ-sh9kxb',
  'Adjust and Calibrate Turbocharger - Unimog U5000',
  'Engine',
  'Turbocharger',
  'Adjust and Calibrate Turbocharger - Unimog U5000',
  '# Adjust and Calibrate Turbocharger - Unimog U5000

## Overview
This procedure covers the adjustment of the Turbocharger on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3de550db-3df0-4890-82bc-4db19510e9d2'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-TUR-REP-98rk5o',
  'Replace Turbocharger - Unimog U5000',
  'Engine',
  'Turbocharger',
  'Replace Turbocharger - Unimog U5000',
  '# Replace Turbocharger - Unimog U5000

## Overview
This procedure covers the replacement of the Turbocharger on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('35f286bc-21b8-49fd-ad0e-700a23ba3977'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-TUR-OVE-sghgef',
  'Overhaul and Rebuild Turbocharger - Unimog U5000',
  'Engine',
  'Turbocharger',
  'Overhaul and Rebuild Turbocharger - Unimog U5000',
  '# Overhaul and Rebuild Turbocharger - Unimog U5000

## Overview
This procedure covers the overhaul of the Turbocharger on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ce55fe69-4467-47d2-9ea8-37ebaab8c5c4'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-ENG-TUR-TRO-ynxesb',
  'Diagnose and Repair Turbocharger - Unimog U5000',
  'Engine',
  'Turbocharger',
  'Diagnose and Repair Turbocharger - Unimog U5000',
  '# Diagnose and Repair Turbocharger - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Turbocharger on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Eng-001 for system overview
- See U5000-Eng-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Oil filter wrench','Compression tester','Timing light','Vacuum gauge']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HOT SURFACES - Allow cooling time']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7f4e2422-3e78-4549-9e99-e0f44e68a5b1'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-MAN-REM-ytzp0j',
  'Remove and Install Manual Gearbox - Unimog U5000',
  'Transmission',
  'Manual Gearbox',
  'Remove and Install Manual Gearbox - Unimog U5000',
  '# Remove and Install Manual Gearbox - Unimog U5000

## Overview
This procedure covers the removal of the Manual Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('420f1a04-4c41-496a-879b-8c5b8d20cbbd'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-MAN-INS-ig2rha',
  'Inspect and Test Manual Gearbox - Unimog U5000',
  'Transmission',
  'Manual Gearbox',
  'Inspect and Test Manual Gearbox - Unimog U5000',
  '# Inspect and Test Manual Gearbox - Unimog U5000

## Overview
This procedure covers the inspection of the Manual Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4710591c-e65b-4371-b9bb-77f34e89c276'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-MAN-ADJ-q32eth',
  'Adjust and Calibrate Manual Gearbox - Unimog U5000',
  'Transmission',
  'Manual Gearbox',
  'Adjust and Calibrate Manual Gearbox - Unimog U5000',
  '# Adjust and Calibrate Manual Gearbox - Unimog U5000

## Overview
This procedure covers the adjustment of the Manual Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('74a85295-953d-449c-98e8-c937f0d47cba'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-MAN-REP-ibathh',
  'Replace Manual Gearbox - Unimog U5000',
  'Transmission',
  'Manual Gearbox',
  'Replace Manual Gearbox - Unimog U5000',
  '# Replace Manual Gearbox - Unimog U5000

## Overview
This procedure covers the replacement of the Manual Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1b2cd3de-3166-464b-9cef-6bfc2d5c28a6'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-MAN-OVE-8yw29',
  'Overhaul and Rebuild Manual Gearbox - Unimog U5000',
  'Transmission',
  'Manual Gearbox',
  'Overhaul and Rebuild Manual Gearbox - Unimog U5000',
  '# Overhaul and Rebuild Manual Gearbox - Unimog U5000

## Overview
This procedure covers the overhaul of the Manual Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('034d1291-7065-475d-b03f-e44922d3b2f3'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-MAN-TRO-ivi31l',
  'Diagnose and Repair Manual Gearbox - Unimog U5000',
  'Transmission',
  'Manual Gearbox',
  'Diagnose and Repair Manual Gearbox - Unimog U5000',
  '# Diagnose and Repair Manual Gearbox - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Manual Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('da897edd-ffff-482e-bd86-2196e5f38ddc'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-AUT-REM-jbeywz',
  'Remove and Install Automatic Gearbox - Unimog U5000',
  'Transmission',
  'Automatic Gearbox',
  'Remove and Install Automatic Gearbox - Unimog U5000',
  '# Remove and Install Automatic Gearbox - Unimog U5000

## Overview
This procedure covers the removal of the Automatic Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('af06d04a-4aff-489c-8140-ff4716cfe0bc'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-AUT-INS-umadqw',
  'Inspect and Test Automatic Gearbox - Unimog U5000',
  'Transmission',
  'Automatic Gearbox',
  'Inspect and Test Automatic Gearbox - Unimog U5000',
  '# Inspect and Test Automatic Gearbox - Unimog U5000

## Overview
This procedure covers the inspection of the Automatic Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('22d3bfc2-c082-4437-9a23-a1611056fb0e'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-AUT-ADJ-c2jpyh',
  'Adjust and Calibrate Automatic Gearbox - Unimog U5000',
  'Transmission',
  'Automatic Gearbox',
  'Adjust and Calibrate Automatic Gearbox - Unimog U5000',
  '# Adjust and Calibrate Automatic Gearbox - Unimog U5000

## Overview
This procedure covers the adjustment of the Automatic Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9a6e11be-11ea-44db-92de-aa98f9f9e915'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-AUT-REP-1971r',
  'Replace Automatic Gearbox - Unimog U5000',
  'Transmission',
  'Automatic Gearbox',
  'Replace Automatic Gearbox - Unimog U5000',
  '# Replace Automatic Gearbox - Unimog U5000

## Overview
This procedure covers the replacement of the Automatic Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d277d42f-2e99-415a-8a84-425725d63e3a'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-AUT-OVE-btyas',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U5000',
  'Transmission',
  'Automatic Gearbox',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U5000',
  '# Overhaul and Rebuild Automatic Gearbox - Unimog U5000

## Overview
This procedure covers the overhaul of the Automatic Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('de4f8eb8-16a6-47e3-8b97-17b7be104d0d'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-AUT-TRO-c9mfq9',
  'Diagnose and Repair Automatic Gearbox - Unimog U5000',
  'Transmission',
  'Automatic Gearbox',
  'Diagnose and Repair Automatic Gearbox - Unimog U5000',
  '# Diagnose and Repair Automatic Gearbox - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Automatic Gearbox on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7403b494-863e-442f-b519-0c3e6ad004dd'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-TRA-REM-svj2ij',
  'Remove and Install Transfer Case - Unimog U5000',
  'Transmission',
  'Transfer Case',
  'Remove and Install Transfer Case - Unimog U5000',
  '# Remove and Install Transfer Case - Unimog U5000

## Overview
This procedure covers the removal of the Transfer Case on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3cba03f1-34aa-487c-8ecf-34b34ae91b10'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-TRA-INS-g8em8k',
  'Inspect and Test Transfer Case - Unimog U5000',
  'Transmission',
  'Transfer Case',
  'Inspect and Test Transfer Case - Unimog U5000',
  '# Inspect and Test Transfer Case - Unimog U5000

## Overview
This procedure covers the inspection of the Transfer Case on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ab82336d-bb3c-4aad-8af4-2c9e00b238a6'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-TRA-ADJ-w1wa1s',
  'Adjust and Calibrate Transfer Case - Unimog U5000',
  'Transmission',
  'Transfer Case',
  'Adjust and Calibrate Transfer Case - Unimog U5000',
  '# Adjust and Calibrate Transfer Case - Unimog U5000

## Overview
This procedure covers the adjustment of the Transfer Case on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3f4dc620-5a3c-442f-9757-ecd2b6b6aa0f'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-TRA-REP-6m7ip',
  'Replace Transfer Case - Unimog U5000',
  'Transmission',
  'Transfer Case',
  'Replace Transfer Case - Unimog U5000',
  '# Replace Transfer Case - Unimog U5000

## Overview
This procedure covers the replacement of the Transfer Case on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f4562e76-7486-4c36-b11e-188a5b516157'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-TRA-OVE-62904',
  'Overhaul and Rebuild Transfer Case - Unimog U5000',
  'Transmission',
  'Transfer Case',
  'Overhaul and Rebuild Transfer Case - Unimog U5000',
  '# Overhaul and Rebuild Transfer Case - Unimog U5000

## Overview
This procedure covers the overhaul of the Transfer Case on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9aeaea9d-5f85-4f4e-b386-c76d5b6faea2'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-TRA-TRO-lt13cp',
  'Diagnose and Repair Transfer Case - Unimog U5000',
  'Transmission',
  'Transfer Case',
  'Diagnose and Repair Transfer Case - Unimog U5000',
  '# Diagnose and Repair Transfer Case - Unimog U5000

## Overview
This procedure covers the troubleshooting of the Transfer Case on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d35d98bf-483e-447f-bfd9-9df0a0120ea8'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-PTO-REM-vvvwn',
  'Remove and Install PTO - Unimog U5000',
  'Transmission',
  'PTO',
  'Remove and Install PTO - Unimog U5000',
  '# Remove and Install PTO - Unimog U5000

## Overview
This procedure covers the removal of the PTO on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7d8154b0-18eb-43d4-9016-6e74231e0431'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-PTO-INS-u3z4qq',
  'Inspect and Test PTO - Unimog U5000',
  'Transmission',
  'PTO',
  'Inspect and Test PTO - Unimog U5000',
  '# Inspect and Test PTO - Unimog U5000

## Overview
This procedure covers the inspection of the PTO on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8940494e-6bc0-4c89-b9f5-7c509ea74940'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-PTO-ADJ-a3efv',
  'Adjust and Calibrate PTO - Unimog U5000',
  'Transmission',
  'PTO',
  'Adjust and Calibrate PTO - Unimog U5000',
  '# Adjust and Calibrate PTO - Unimog U5000

## Overview
This procedure covers the adjustment of the PTO on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9bc45268-84fc-4d29-8703-fc375d98603c'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-PTO-REP-ddujd',
  'Replace PTO - Unimog U5000',
  'Transmission',
  'PTO',
  'Replace PTO - Unimog U5000',
  '# Replace PTO - Unimog U5000

## Overview
This procedure covers the replacement of the PTO on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bb78c7ca-e8c8-4836-91b8-5b706be8b2be'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-PTO-OVE-wypqzj',
  'Overhaul and Rebuild PTO - Unimog U5000',
  'Transmission',
  'PTO',
  'Overhaul and Rebuild PTO - Unimog U5000',
  '# Overhaul and Rebuild PTO - Unimog U5000

## Overview
This procedure covers the overhaul of the PTO on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('00b665a6-39d1-49c8-a080-abbfef7029c7'),
  uuid('eeee0003-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U5000-TRA-PTO-TRO-8vd95s',
  'Diagnose and Repair PTO - Unimog U5000',
  'Transmission',
  'PTO',
  'Diagnose and Repair PTO - Unimog U5000',
  '# Diagnose and Repair PTO - Unimog U5000

## Overview
This procedure covers the troubleshooting of the PTO on Unimog U5000 vehicles with OM924LA/OM926LA engine.
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
- See U5000-Tra-001 for system overview
- See U5000-Tra-TSB-01 for latest updates',
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
