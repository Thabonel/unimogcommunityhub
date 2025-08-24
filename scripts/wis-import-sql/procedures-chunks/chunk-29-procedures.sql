-- WIS Procedures Import - Chunk 29
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 29 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('f909d4a7-a865-440b-9516-54424dd56a91'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-SPR-OVE-5b6anv',
  'Overhaul and Rebuild Springs - Unimog U4000',
  'Suspension',
  'Springs',
  'Overhaul and Rebuild Springs - Unimog U4000',
  '# Overhaul and Rebuild Springs - Unimog U4000

## Overview
This procedure covers the overhaul of the Springs on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b653f021-36bd-4cf6-9a93-53f81916f939'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-SPR-TRO-0eh4sl',
  'Diagnose and Repair Springs - Unimog U4000',
  'Suspension',
  'Springs',
  'Diagnose and Repair Springs - Unimog U4000',
  '# Diagnose and Repair Springs - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Springs on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('31934357-6143-4ffd-babf-7b96cd4db5a9'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-SHO-REM-0uw26m',
  'Remove and Install Shock Absorbers - Unimog U4000',
  'Suspension',
  'Shock Absorbers',
  'Remove and Install Shock Absorbers - Unimog U4000',
  '# Remove and Install Shock Absorbers - Unimog U4000

## Overview
This procedure covers the removal of the Shock Absorbers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3df79ee3-0410-4c5f-bd69-dd0662944395'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-SHO-INS-9v7iyg',
  'Inspect and Test Shock Absorbers - Unimog U4000',
  'Suspension',
  'Shock Absorbers',
  'Inspect and Test Shock Absorbers - Unimog U4000',
  '# Inspect and Test Shock Absorbers - Unimog U4000

## Overview
This procedure covers the inspection of the Shock Absorbers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('17971920-e09f-4080-8b0d-237053c76155'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-SHO-ADJ-6s5ie9',
  'Adjust and Calibrate Shock Absorbers - Unimog U4000',
  'Suspension',
  'Shock Absorbers',
  'Adjust and Calibrate Shock Absorbers - Unimog U4000',
  '# Adjust and Calibrate Shock Absorbers - Unimog U4000

## Overview
This procedure covers the adjustment of the Shock Absorbers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e1cc2a5a-fa39-4077-b87a-022edb60f331'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-SHO-REP-fzrl9h5',
  'Replace Shock Absorbers - Unimog U4000',
  'Suspension',
  'Shock Absorbers',
  'Replace Shock Absorbers - Unimog U4000',
  '# Replace Shock Absorbers - Unimog U4000

## Overview
This procedure covers the replacement of the Shock Absorbers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1b9e6f82-11ed-4903-a4e7-bb541ab5667e'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-SHO-OVE-wic7bo',
  'Overhaul and Rebuild Shock Absorbers - Unimog U4000',
  'Suspension',
  'Shock Absorbers',
  'Overhaul and Rebuild Shock Absorbers - Unimog U4000',
  '# Overhaul and Rebuild Shock Absorbers - Unimog U4000

## Overview
This procedure covers the overhaul of the Shock Absorbers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('83884f8e-cb11-4679-9d8c-2d4f9621f47e'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-SHO-TRO-ugn5yg',
  'Diagnose and Repair Shock Absorbers - Unimog U4000',
  'Suspension',
  'Shock Absorbers',
  'Diagnose and Repair Shock Absorbers - Unimog U4000',
  '# Diagnose and Repair Shock Absorbers - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Shock Absorbers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c0995a84-799a-4904-ad9a-932c641ba443'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-STA-REM-bc3wwd',
  'Remove and Install Stabilizers - Unimog U4000',
  'Suspension',
  'Stabilizers',
  'Remove and Install Stabilizers - Unimog U4000',
  '# Remove and Install Stabilizers - Unimog U4000

## Overview
This procedure covers the removal of the Stabilizers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0af3c467-1158-4dbb-8e29-82d99071a8e1'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-STA-INS-hhvbv',
  'Inspect and Test Stabilizers - Unimog U4000',
  'Suspension',
  'Stabilizers',
  'Inspect and Test Stabilizers - Unimog U4000',
  '# Inspect and Test Stabilizers - Unimog U4000

## Overview
This procedure covers the inspection of the Stabilizers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a3679896-0a21-4b2c-a9e1-9578612f742d'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-STA-ADJ-fxtglg',
  'Adjust and Calibrate Stabilizers - Unimog U4000',
  'Suspension',
  'Stabilizers',
  'Adjust and Calibrate Stabilizers - Unimog U4000',
  '# Adjust and Calibrate Stabilizers - Unimog U4000

## Overview
This procedure covers the adjustment of the Stabilizers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9f50daad-456f-4bee-a26f-22dbe42ec5ef'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-STA-REP-llcbhs5',
  'Replace Stabilizers - Unimog U4000',
  'Suspension',
  'Stabilizers',
  'Replace Stabilizers - Unimog U4000',
  '# Replace Stabilizers - Unimog U4000

## Overview
This procedure covers the replacement of the Stabilizers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('578e8840-a150-4344-975a-6aa72cde0f90'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-STA-OVE-8k6b0b',
  'Overhaul and Rebuild Stabilizers - Unimog U4000',
  'Suspension',
  'Stabilizers',
  'Overhaul and Rebuild Stabilizers - Unimog U4000',
  '# Overhaul and Rebuild Stabilizers - Unimog U4000

## Overview
This procedure covers the overhaul of the Stabilizers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1a812601-b1ea-4804-bab1-310cf850b6dc'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-STA-TRO-bfc68p',
  'Diagnose and Repair Stabilizers - Unimog U4000',
  'Suspension',
  'Stabilizers',
  'Diagnose and Repair Stabilizers - Unimog U4000',
  '# Diagnose and Repair Stabilizers - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Stabilizers on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bae6abda-4b3e-42c0-9471-74c6fbeb16e0'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-AIR-REM-ydgyp',
  'Remove and Install Air Suspension - Unimog U4000',
  'Suspension',
  'Air Suspension',
  'Remove and Install Air Suspension - Unimog U4000',
  '# Remove and Install Air Suspension - Unimog U4000

## Overview
This procedure covers the removal of the Air Suspension on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('17c8a3bc-7231-4782-8817-d609c39f4a2a'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-AIR-INS-06oyk',
  'Inspect and Test Air Suspension - Unimog U4000',
  'Suspension',
  'Air Suspension',
  'Inspect and Test Air Suspension - Unimog U4000',
  '# Inspect and Test Air Suspension - Unimog U4000

## Overview
This procedure covers the inspection of the Air Suspension on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('de3f4135-2f2b-4ea8-a376-8e2b55815f00'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-AIR-ADJ-n0k8bt',
  'Adjust and Calibrate Air Suspension - Unimog U4000',
  'Suspension',
  'Air Suspension',
  'Adjust and Calibrate Air Suspension - Unimog U4000',
  '# Adjust and Calibrate Air Suspension - Unimog U4000

## Overview
This procedure covers the adjustment of the Air Suspension on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c48a6ec2-f102-4d18-966b-68e8ded70999'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-AIR-REP-3dvold',
  'Replace Air Suspension - Unimog U4000',
  'Suspension',
  'Air Suspension',
  'Replace Air Suspension - Unimog U4000',
  '# Replace Air Suspension - Unimog U4000

## Overview
This procedure covers the replacement of the Air Suspension on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7fc68348-f1a4-440a-989f-c62f7d557126'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-AIR-OVE-03bkbf',
  'Overhaul and Rebuild Air Suspension - Unimog U4000',
  'Suspension',
  'Air Suspension',
  'Overhaul and Rebuild Air Suspension - Unimog U4000',
  '# Overhaul and Rebuild Air Suspension - Unimog U4000

## Overview
This procedure covers the overhaul of the Air Suspension on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('962361cd-eee8-4e72-93b5-201299838d8e'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-SUS-AIR-TRO-j34gwn',
  'Diagnose and Repair Air Suspension - Unimog U4000',
  'Suspension',
  'Air Suspension',
  'Diagnose and Repair Air Suspension - Unimog U4000',
  '# Diagnose and Repair Air Suspension - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Air Suspension on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Sus-001 for system overview
- See U4000-Sus-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Spring compressor','Ball joint separator','Shock absorber tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2b6db49c-dcf0-48e8-96e2-b2159b196eb9'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-BAT-REM-c5s7x9',
  'Remove and Install Battery - Unimog U4000',
  'Electrical',
  'Battery',
  'Remove and Install Battery - Unimog U4000',
  '# Remove and Install Battery - Unimog U4000

## Overview
This procedure covers the removal of the Battery on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bad7f664-6fb6-48cd-8d54-9c0a9d23ec4c'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-BAT-INS-xnsdl',
  'Inspect and Test Battery - Unimog U4000',
  'Electrical',
  'Battery',
  'Inspect and Test Battery - Unimog U4000',
  '# Inspect and Test Battery - Unimog U4000

## Overview
This procedure covers the inspection of the Battery on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c3ead108-4693-40f4-8d61-f6b035fe5803'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-BAT-ADJ-f918zs',
  'Adjust and Calibrate Battery - Unimog U4000',
  'Electrical',
  'Battery',
  'Adjust and Calibrate Battery - Unimog U4000',
  '# Adjust and Calibrate Battery - Unimog U4000

## Overview
This procedure covers the adjustment of the Battery on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('12303633-c9de-4c8f-85c5-ede841667fd5'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-BAT-REP-nsniox',
  'Replace Battery - Unimog U4000',
  'Electrical',
  'Battery',
  'Replace Battery - Unimog U4000',
  '# Replace Battery - Unimog U4000

## Overview
This procedure covers the replacement of the Battery on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ebfee393-4017-45d2-9f5e-a2887780b519'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-BAT-OVE-wo5h8r',
  'Overhaul and Rebuild Battery - Unimog U4000',
  'Electrical',
  'Battery',
  'Overhaul and Rebuild Battery - Unimog U4000',
  '# Overhaul and Rebuild Battery - Unimog U4000

## Overview
This procedure covers the overhaul of the Battery on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ce0fb6e9-3a4d-4eac-9ad6-726895b5c72d'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-BAT-TRO-u0u5nk',
  'Diagnose and Repair Battery - Unimog U4000',
  'Electrical',
  'Battery',
  'Diagnose and Repair Battery - Unimog U4000',
  '# Diagnose and Repair Battery - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Battery on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('28f956d2-a906-46e2-8f3a-982470452e91'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-ALT-REM-uitefh',
  'Remove and Install Alternator - Unimog U4000',
  'Electrical',
  'Alternator',
  'Remove and Install Alternator - Unimog U4000',
  '# Remove and Install Alternator - Unimog U4000

## Overview
This procedure covers the removal of the Alternator on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('31757065-5735-4aa7-a228-aff982d9c98e'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-ALT-INS-c0ovlt',
  'Inspect and Test Alternator - Unimog U4000',
  'Electrical',
  'Alternator',
  'Inspect and Test Alternator - Unimog U4000',
  '# Inspect and Test Alternator - Unimog U4000

## Overview
This procedure covers the inspection of the Alternator on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9b4d5a3c-e526-4b10-a93d-3d54f9745d20'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-ALT-ADJ-rfvk65',
  'Adjust and Calibrate Alternator - Unimog U4000',
  'Electrical',
  'Alternator',
  'Adjust and Calibrate Alternator - Unimog U4000',
  '# Adjust and Calibrate Alternator - Unimog U4000

## Overview
This procedure covers the adjustment of the Alternator on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3d1eaef5-1e3f-4d81-947f-d4f3a3f86b6c'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-ALT-REP-5mlqqg',
  'Replace Alternator - Unimog U4000',
  'Electrical',
  'Alternator',
  'Replace Alternator - Unimog U4000',
  '# Replace Alternator - Unimog U4000

## Overview
This procedure covers the replacement of the Alternator on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0662d835-95f4-4c69-98b3-d7f9394381ad'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-ALT-OVE-zmzdwh',
  'Overhaul and Rebuild Alternator - Unimog U4000',
  'Electrical',
  'Alternator',
  'Overhaul and Rebuild Alternator - Unimog U4000',
  '# Overhaul and Rebuild Alternator - Unimog U4000

## Overview
This procedure covers the overhaul of the Alternator on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e3ea86ed-760c-4093-a9ff-6fa595d6501d'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-ALT-TRO-ilytof',
  'Diagnose and Repair Alternator - Unimog U4000',
  'Electrical',
  'Alternator',
  'Diagnose and Repair Alternator - Unimog U4000',
  '# Diagnose and Repair Alternator - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Alternator on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('00f12d13-f7c2-42f0-b417-30db0b70bac9'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-STA-REM-ancpg8',
  'Remove and Install Starter - Unimog U4000',
  'Electrical',
  'Starter',
  'Remove and Install Starter - Unimog U4000',
  '# Remove and Install Starter - Unimog U4000

## Overview
This procedure covers the removal of the Starter on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('89f4169a-bc5c-49fc-8797-051a9d79bc80'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-STA-INS-ucpl6v',
  'Inspect and Test Starter - Unimog U4000',
  'Electrical',
  'Starter',
  'Inspect and Test Starter - Unimog U4000',
  '# Inspect and Test Starter - Unimog U4000

## Overview
This procedure covers the inspection of the Starter on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('130bf66b-7984-43b0-b77c-faa10def24e6'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-STA-ADJ-gd8maa',
  'Adjust and Calibrate Starter - Unimog U4000',
  'Electrical',
  'Starter',
  'Adjust and Calibrate Starter - Unimog U4000',
  '# Adjust and Calibrate Starter - Unimog U4000

## Overview
This procedure covers the adjustment of the Starter on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7ee7c320-d670-42a1-b18f-3cef21da4e33'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-STA-REP-bfgbg',
  'Replace Starter - Unimog U4000',
  'Electrical',
  'Starter',
  'Replace Starter - Unimog U4000',
  '# Replace Starter - Unimog U4000

## Overview
This procedure covers the replacement of the Starter on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e24acbff-c260-4ea7-9f88-79d74a8fdfbd'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-STA-OVE-ap0v3a',
  'Overhaul and Rebuild Starter - Unimog U4000',
  'Electrical',
  'Starter',
  'Overhaul and Rebuild Starter - Unimog U4000',
  '# Overhaul and Rebuild Starter - Unimog U4000

## Overview
This procedure covers the overhaul of the Starter on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c36bf64c-c68e-4a7e-b0fd-0bb921f2adad'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-STA-TRO-f966kj',
  'Diagnose and Repair Starter - Unimog U4000',
  'Electrical',
  'Starter',
  'Diagnose and Repair Starter - Unimog U4000',
  '# Diagnose and Repair Starter - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Starter on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6bd59ff0-3687-49ad-bd3c-245c8c1eb450'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-LIG-REM-ec6c4',
  'Remove and Install Lighting - Unimog U4000',
  'Electrical',
  'Lighting',
  'Remove and Install Lighting - Unimog U4000',
  '# Remove and Install Lighting - Unimog U4000

## Overview
This procedure covers the removal of the Lighting on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d26b358e-3d4f-433d-b01e-dc21f3670919'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-LIG-INS-i5hg38',
  'Inspect and Test Lighting - Unimog U4000',
  'Electrical',
  'Lighting',
  'Inspect and Test Lighting - Unimog U4000',
  '# Inspect and Test Lighting - Unimog U4000

## Overview
This procedure covers the inspection of the Lighting on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('66eca566-899c-4bcf-91f2-0750155ae716'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-LIG-ADJ-bowvcs',
  'Adjust and Calibrate Lighting - Unimog U4000',
  'Electrical',
  'Lighting',
  'Adjust and Calibrate Lighting - Unimog U4000',
  '# Adjust and Calibrate Lighting - Unimog U4000

## Overview
This procedure covers the adjustment of the Lighting on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('41db6fa8-da17-4b23-a415-afdb59544a96'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-LIG-REP-hf8ib8',
  'Replace Lighting - Unimog U4000',
  'Electrical',
  'Lighting',
  'Replace Lighting - Unimog U4000',
  '# Replace Lighting - Unimog U4000

## Overview
This procedure covers the replacement of the Lighting on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('44934afc-364e-46b4-8ef1-4a21a1c3a67a'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-LIG-OVE-odknpf',
  'Overhaul and Rebuild Lighting - Unimog U4000',
  'Electrical',
  'Lighting',
  'Overhaul and Rebuild Lighting - Unimog U4000',
  '# Overhaul and Rebuild Lighting - Unimog U4000

## Overview
This procedure covers the overhaul of the Lighting on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ea6991a6-b676-4930-b24a-e456edaddecc'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-LIG-TRO-uabbtk',
  'Diagnose and Repair Lighting - Unimog U4000',
  'Electrical',
  'Lighting',
  'Diagnose and Repair Lighting - Unimog U4000',
  '# Diagnose and Repair Lighting - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Lighting on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('82294bd4-0cff-4e3c-ac55-5792376982b3'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-CON-REM-xzz4sg',
  'Remove and Install Control Units - Unimog U4000',
  'Electrical',
  'Control Units',
  'Remove and Install Control Units - Unimog U4000',
  '# Remove and Install Control Units - Unimog U4000

## Overview
This procedure covers the removal of the Control Units on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d2360811-2241-4756-ab21-00c87eeb41f6'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-CON-INS-hrp2ru',
  'Inspect and Test Control Units - Unimog U4000',
  'Electrical',
  'Control Units',
  'Inspect and Test Control Units - Unimog U4000',
  '# Inspect and Test Control Units - Unimog U4000

## Overview
This procedure covers the inspection of the Control Units on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4b11b3c2-b7df-44cc-b7c6-e6831c85aa16'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-CON-ADJ-kr0f6u',
  'Adjust and Calibrate Control Units - Unimog U4000',
  'Electrical',
  'Control Units',
  'Adjust and Calibrate Control Units - Unimog U4000',
  '# Adjust and Calibrate Control Units - Unimog U4000

## Overview
This procedure covers the adjustment of the Control Units on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bbab7714-cc74-47a2-b194-617e867cf57e'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-CON-REP-ki3iav',
  'Replace Control Units - Unimog U4000',
  'Electrical',
  'Control Units',
  'Replace Control Units - Unimog U4000',
  '# Replace Control Units - Unimog U4000

## Overview
This procedure covers the replacement of the Control Units on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bbf29624-2ee3-407a-98ce-e60201ac0da5'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-CON-OVE-ybe1xj',
  'Overhaul and Rebuild Control Units - Unimog U4000',
  'Electrical',
  'Control Units',
  'Overhaul and Rebuild Control Units - Unimog U4000',
  '# Overhaul and Rebuild Control Units - Unimog U4000

## Overview
This procedure covers the overhaul of the Control Units on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d8794af9-89f0-4a6d-95f7-f65bf843d520'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-ELE-CON-TRO-h26bzd',
  'Diagnose and Repair Control Units - Unimog U4000',
  'Electrical',
  'Control Units',
  'Diagnose and Repair Control Units - Unimog U4000',
  '# Diagnose and Repair Control Units - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Control Units on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Ele-001 for system overview
- See U4000-Ele-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Multimeter','Wire strippers','Soldering iron','Diagnostic scanner']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ ELECTRICAL HAZARD - Disconnect power source']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f0999c39-0590-47da-ab7a-30a9ac32ba30'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HYD-REM-th678j',
  'Remove and Install Hydraulic Pump - Unimog U4000',
  'Hydraulics',
  'Hydraulic Pump',
  'Remove and Install Hydraulic Pump - Unimog U4000',
  '# Remove and Install Hydraulic Pump - Unimog U4000

## Overview
This procedure covers the removal of the Hydraulic Pump on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ea41b35a-4eab-4712-8e7c-f9f54db2a465'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HYD-INS-x1rc8e',
  'Inspect and Test Hydraulic Pump - Unimog U4000',
  'Hydraulics',
  'Hydraulic Pump',
  'Inspect and Test Hydraulic Pump - Unimog U4000',
  '# Inspect and Test Hydraulic Pump - Unimog U4000

## Overview
This procedure covers the inspection of the Hydraulic Pump on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('61a21aef-2bbf-4e58-aead-3c609c34f15c'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HYD-ADJ-f2cyl5',
  'Adjust and Calibrate Hydraulic Pump - Unimog U4000',
  'Hydraulics',
  'Hydraulic Pump',
  'Adjust and Calibrate Hydraulic Pump - Unimog U4000',
  '# Adjust and Calibrate Hydraulic Pump - Unimog U4000

## Overview
This procedure covers the adjustment of the Hydraulic Pump on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e3ec99b0-ae7c-4ac4-8c0e-6ef207f4d17d'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HYD-REP-qk99ql',
  'Replace Hydraulic Pump - Unimog U4000',
  'Hydraulics',
  'Hydraulic Pump',
  'Replace Hydraulic Pump - Unimog U4000',
  '# Replace Hydraulic Pump - Unimog U4000

## Overview
This procedure covers the replacement of the Hydraulic Pump on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6281a198-2e7c-4cdd-a4a4-122c37c04afb'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HYD-OVE-2xtdmg',
  'Overhaul and Rebuild Hydraulic Pump - Unimog U4000',
  'Hydraulics',
  'Hydraulic Pump',
  'Overhaul and Rebuild Hydraulic Pump - Unimog U4000',
  '# Overhaul and Rebuild Hydraulic Pump - Unimog U4000

## Overview
This procedure covers the overhaul of the Hydraulic Pump on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f6ae853c-ca4a-459b-bfbf-996f32be0a1b'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HYD-TRO-yxbfr8',
  'Diagnose and Repair Hydraulic Pump - Unimog U4000',
  'Hydraulics',
  'Hydraulic Pump',
  'Diagnose and Repair Hydraulic Pump - Unimog U4000',
  '# Diagnose and Repair Hydraulic Pump - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Hydraulic Pump on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d40f223b-52ef-47d4-9a7d-cc6fd52b5f05'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-VAL-REM-m7x5d8',
  'Remove and Install Valves - Unimog U4000',
  'Hydraulics',
  'Valves',
  'Remove and Install Valves - Unimog U4000',
  '# Remove and Install Valves - Unimog U4000

## Overview
This procedure covers the removal of the Valves on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2a76ab8e-29ae-44e5-b781-b5d4439d0501'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-VAL-INS-suk8r',
  'Inspect and Test Valves - Unimog U4000',
  'Hydraulics',
  'Valves',
  'Inspect and Test Valves - Unimog U4000',
  '# Inspect and Test Valves - Unimog U4000

## Overview
This procedure covers the inspection of the Valves on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('38b026e2-b3b2-4e5d-aa24-a7dbff7eac49'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-VAL-ADJ-99fdm',
  'Adjust and Calibrate Valves - Unimog U4000',
  'Hydraulics',
  'Valves',
  'Adjust and Calibrate Valves - Unimog U4000',
  '# Adjust and Calibrate Valves - Unimog U4000

## Overview
This procedure covers the adjustment of the Valves on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c523fba8-9500-4690-a32f-e10fedc5f259'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-VAL-REP-e9amd',
  'Replace Valves - Unimog U4000',
  'Hydraulics',
  'Valves',
  'Replace Valves - Unimog U4000',
  '# Replace Valves - Unimog U4000

## Overview
This procedure covers the replacement of the Valves on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c94a1172-6e4e-45ec-ae36-58ea18d4012f'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-VAL-OVE-j0mqcl',
  'Overhaul and Rebuild Valves - Unimog U4000',
  'Hydraulics',
  'Valves',
  'Overhaul and Rebuild Valves - Unimog U4000',
  '# Overhaul and Rebuild Valves - Unimog U4000

## Overview
This procedure covers the overhaul of the Valves on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('612a93f1-5c80-4974-bb22-f4f81db25c6a'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-VAL-TRO-xnlnyh',
  'Diagnose and Repair Valves - Unimog U4000',
  'Hydraulics',
  'Valves',
  'Diagnose and Repair Valves - Unimog U4000',
  '# Diagnose and Repair Valves - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Valves on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('da620494-d617-4667-8747-9ae1fb7d2a38'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-CYL-REM-k56ziq',
  'Remove and Install Cylinders - Unimog U4000',
  'Hydraulics',
  'Cylinders',
  'Remove and Install Cylinders - Unimog U4000',
  '# Remove and Install Cylinders - Unimog U4000

## Overview
This procedure covers the removal of the Cylinders on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('acbe25b0-49b8-4d32-8daa-7e6a15b05fc8'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-CYL-INS-uno3no',
  'Inspect and Test Cylinders - Unimog U4000',
  'Hydraulics',
  'Cylinders',
  'Inspect and Test Cylinders - Unimog U4000',
  '# Inspect and Test Cylinders - Unimog U4000

## Overview
This procedure covers the inspection of the Cylinders on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('07ecf0d2-5420-4f06-b5f1-456b9c467831'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-CYL-ADJ-m4uejs',
  'Adjust and Calibrate Cylinders - Unimog U4000',
  'Hydraulics',
  'Cylinders',
  'Adjust and Calibrate Cylinders - Unimog U4000',
  '# Adjust and Calibrate Cylinders - Unimog U4000

## Overview
This procedure covers the adjustment of the Cylinders on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('98fc4ba4-4a1c-458a-ace0-23b1c378eb00'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-CYL-REP-049rs9',
  'Replace Cylinders - Unimog U4000',
  'Hydraulics',
  'Cylinders',
  'Replace Cylinders - Unimog U4000',
  '# Replace Cylinders - Unimog U4000

## Overview
This procedure covers the replacement of the Cylinders on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('85f855fa-5f8c-4f45-b9e7-454855efdc8d'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-CYL-OVE-69a0hs',
  'Overhaul and Rebuild Cylinders - Unimog U4000',
  'Hydraulics',
  'Cylinders',
  'Overhaul and Rebuild Cylinders - Unimog U4000',
  '# Overhaul and Rebuild Cylinders - Unimog U4000

## Overview
This procedure covers the overhaul of the Cylinders on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2f120f34-dd16-4d77-af7e-136ca4a2bf11'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-CYL-TRO-qedg',
  'Diagnose and Repair Cylinders - Unimog U4000',
  'Hydraulics',
  'Cylinders',
  'Diagnose and Repair Cylinders - Unimog U4000',
  '# Diagnose and Repair Cylinders - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Cylinders on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6cd52243-6c4b-4939-8cdd-9c47ab767a1a'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HOS-REM-ndb44x',
  'Remove and Install Hoses - Unimog U4000',
  'Hydraulics',
  'Hoses',
  'Remove and Install Hoses - Unimog U4000',
  '# Remove and Install Hoses - Unimog U4000

## Overview
This procedure covers the removal of the Hoses on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d5aafe70-e029-40a1-b9b5-b442da1113c1'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HOS-INS-nq3ld',
  'Inspect and Test Hoses - Unimog U4000',
  'Hydraulics',
  'Hoses',
  'Inspect and Test Hoses - Unimog U4000',
  '# Inspect and Test Hoses - Unimog U4000

## Overview
This procedure covers the inspection of the Hoses on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c86ec389-6506-4c39-90cd-0068f05d6103'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HOS-ADJ-itovnn',
  'Adjust and Calibrate Hoses - Unimog U4000',
  'Hydraulics',
  'Hoses',
  'Adjust and Calibrate Hoses - Unimog U4000',
  '# Adjust and Calibrate Hoses - Unimog U4000

## Overview
This procedure covers the adjustment of the Hoses on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bba5899b-2c35-4105-9ad0-7c04afcae935'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HOS-REP-qgv4el',
  'Replace Hoses - Unimog U4000',
  'Hydraulics',
  'Hoses',
  'Replace Hoses - Unimog U4000',
  '# Replace Hoses - Unimog U4000

## Overview
This procedure covers the replacement of the Hoses on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('db0b4a39-2c07-477d-ae3e-01987b53a404'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HOS-OVE-c9l7c',
  'Overhaul and Rebuild Hoses - Unimog U4000',
  'Hydraulics',
  'Hoses',
  'Overhaul and Rebuild Hoses - Unimog U4000',
  '# Overhaul and Rebuild Hoses - Unimog U4000

## Overview
This procedure covers the overhaul of the Hoses on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7f990de3-f787-4cb0-a5a4-a9ec04ca5912'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-HOS-TRO-qncbf',
  'Diagnose and Repair Hoses - Unimog U4000',
  'Hydraulics',
  'Hoses',
  'Diagnose and Repair Hoses - Unimog U4000',
  '# Diagnose and Repair Hoses - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Hoses on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c9878c35-fe1e-4a94-884c-afd86ea5e38d'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-FIL-REM-32ozgl',
  'Remove and Install Filters - Unimog U4000',
  'Hydraulics',
  'Filters',
  'Remove and Install Filters - Unimog U4000',
  '# Remove and Install Filters - Unimog U4000

## Overview
This procedure covers the removal of the Filters on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('927eea36-1941-4842-8a6d-ac36d058cbbd'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-FIL-INS-vk9mk',
  'Inspect and Test Filters - Unimog U4000',
  'Hydraulics',
  'Filters',
  'Inspect and Test Filters - Unimog U4000',
  '# Inspect and Test Filters - Unimog U4000

## Overview
This procedure covers the inspection of the Filters on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('805f9567-e0ad-448a-9dc0-91db2e5340ee'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-FIL-ADJ-r25qd',
  'Adjust and Calibrate Filters - Unimog U4000',
  'Hydraulics',
  'Filters',
  'Adjust and Calibrate Filters - Unimog U4000',
  '# Adjust and Calibrate Filters - Unimog U4000

## Overview
This procedure covers the adjustment of the Filters on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('67b92fd0-c02e-48dc-b223-d44029612a0c'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-FIL-REP-nbb7p',
  'Replace Filters - Unimog U4000',
  'Hydraulics',
  'Filters',
  'Replace Filters - Unimog U4000',
  '# Replace Filters - Unimog U4000

## Overview
This procedure covers the replacement of the Filters on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e10f2aae-6f98-45f2-8ac2-caa8540ae1c8'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-FIL-OVE-mw5ow9',
  'Overhaul and Rebuild Filters - Unimog U4000',
  'Hydraulics',
  'Filters',
  'Overhaul and Rebuild Filters - Unimog U4000',
  '# Overhaul and Rebuild Filters - Unimog U4000

## Overview
This procedure covers the overhaul of the Filters on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7df1cd00-f4fc-48aa-9fa6-f743076cc880'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-HYD-FIL-TRO-d0am4i',
  'Diagnose and Repair Filters - Unimog U4000',
  'Hydraulics',
  'Filters',
  'Diagnose and Repair Filters - Unimog U4000',
  '# Diagnose and Repair Filters - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Filters on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
- See U4000-Hyd-001 for system overview
- See U4000-Hyd-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Pressure gauge','Flow meter','Hydraulic test kit']::text[],
  ARRAY['Filter element','O-ring seal','Filter housing gasket']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work','⚠️ HIGH PRESSURE - Depressurize system before work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('17a75eb9-86d8-468a-be5d-41e9098e2b0b'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-CAB-REM-439n38',
  'Remove and Install Cab - Unimog U4000',
  'Body',
  'Cab',
  'Remove and Install Cab - Unimog U4000',
  '# Remove and Install Cab - Unimog U4000

## Overview
This procedure covers the removal of the Cab on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('eca07f45-fdf4-4854-a24b-9b6068656105'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-CAB-INS-pt4r6',
  'Inspect and Test Cab - Unimog U4000',
  'Body',
  'Cab',
  'Inspect and Test Cab - Unimog U4000',
  '# Inspect and Test Cab - Unimog U4000

## Overview
This procedure covers the inspection of the Cab on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('33e5f7df-61eb-4a89-bd2c-6baf375b49b7'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-CAB-ADJ-fsguc',
  'Adjust and Calibrate Cab - Unimog U4000',
  'Body',
  'Cab',
  'Adjust and Calibrate Cab - Unimog U4000',
  '# Adjust and Calibrate Cab - Unimog U4000

## Overview
This procedure covers the adjustment of the Cab on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('650a288f-b7fd-4cc5-942e-79f14ad8f962'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-CAB-REP-648xe',
  'Replace Cab - Unimog U4000',
  'Body',
  'Cab',
  'Replace Cab - Unimog U4000',
  '# Replace Cab - Unimog U4000

## Overview
This procedure covers the replacement of the Cab on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('2be8613b-c34a-4f06-acab-b16e52938432'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-CAB-OVE-6lc35b',
  'Overhaul and Rebuild Cab - Unimog U4000',
  'Body',
  'Cab',
  'Overhaul and Rebuild Cab - Unimog U4000',
  '# Overhaul and Rebuild Cab - Unimog U4000

## Overview
This procedure covers the overhaul of the Cab on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('9d2c11b1-6bbb-4e8a-be19-bf3740685a35'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-CAB-TRO-wxxiud',
  'Diagnose and Repair Cab - Unimog U4000',
  'Body',
  'Cab',
  'Diagnose and Repair Cab - Unimog U4000',
  '# Diagnose and Repair Cab - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Cab on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('87fdefd7-16ae-4c88-ad37-318df73859a7'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-DOO-REM-9o4bb',
  'Remove and Install Doors - Unimog U4000',
  'Body',
  'Doors',
  'Remove and Install Doors - Unimog U4000',
  '# Remove and Install Doors - Unimog U4000

## Overview
This procedure covers the removal of the Doors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('ef7e0316-11de-4351-afe0-ed4bf056d502'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-DOO-INS-fssnhr',
  'Inspect and Test Doors - Unimog U4000',
  'Body',
  'Doors',
  'Inspect and Test Doors - Unimog U4000',
  '# Inspect and Test Doors - Unimog U4000

## Overview
This procedure covers the inspection of the Doors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('84f86cd0-efe6-41cd-ab85-3cff1a8bdcc8'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-DOO-ADJ-y0z929',
  'Adjust and Calibrate Doors - Unimog U4000',
  'Body',
  'Doors',
  'Adjust and Calibrate Doors - Unimog U4000',
  '# Adjust and Calibrate Doors - Unimog U4000

## Overview
This procedure covers the adjustment of the Doors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('ba149071-11c2-48cf-b4ca-5f5a03c5fa97'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-DOO-REP-gm6sc',
  'Replace Doors - Unimog U4000',
  'Body',
  'Doors',
  'Replace Doors - Unimog U4000',
  '# Replace Doors - Unimog U4000

## Overview
This procedure covers the replacement of the Doors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('0a43fee5-16d9-4a25-b8c1-20dca9bed2c2'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-DOO-OVE-xfl7wn',
  'Overhaul and Rebuild Doors - Unimog U4000',
  'Body',
  'Doors',
  'Overhaul and Rebuild Doors - Unimog U4000',
  '# Overhaul and Rebuild Doors - Unimog U4000

## Overview
This procedure covers the overhaul of the Doors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('68426606-8e9c-45cd-8a63-fbc4bc7629e2'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-DOO-TRO-jgauia',
  'Diagnose and Repair Doors - Unimog U4000',
  'Body',
  'Doors',
  'Diagnose and Repair Doors - Unimog U4000',
  '# Diagnose and Repair Doors - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Doors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('9eee09fe-817a-47fd-8112-b7c078038976'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-WIN-REM-yq1s77',
  'Remove and Install Windows - Unimog U4000',
  'Body',
  'Windows',
  'Remove and Install Windows - Unimog U4000',
  '# Remove and Install Windows - Unimog U4000

## Overview
This procedure covers the removal of the Windows on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('ee90c173-5eb3-4c03-b604-138a741e9fc9'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-WIN-INS-me63g6',
  'Inspect and Test Windows - Unimog U4000',
  'Body',
  'Windows',
  'Inspect and Test Windows - Unimog U4000',
  '# Inspect and Test Windows - Unimog U4000

## Overview
This procedure covers the inspection of the Windows on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('dac2e223-ddc4-4fd9-801d-a32d83c76df7'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-WIN-ADJ-ekyior',
  'Adjust and Calibrate Windows - Unimog U4000',
  'Body',
  'Windows',
  'Adjust and Calibrate Windows - Unimog U4000',
  '# Adjust and Calibrate Windows - Unimog U4000

## Overview
This procedure covers the adjustment of the Windows on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('afbc2ad4-7bad-400a-95b6-4c4ee34a3440'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-WIN-REP-se6pi',
  'Replace Windows - Unimog U4000',
  'Body',
  'Windows',
  'Replace Windows - Unimog U4000',
  '# Replace Windows - Unimog U4000

## Overview
This procedure covers the replacement of the Windows on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('2f6324a8-2704-4664-8851-9c77e0982d09'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-WIN-OVE-w59ois',
  'Overhaul and Rebuild Windows - Unimog U4000',
  'Body',
  'Windows',
  'Overhaul and Rebuild Windows - Unimog U4000',
  '# Overhaul and Rebuild Windows - Unimog U4000

## Overview
This procedure covers the overhaul of the Windows on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('b97ef01e-31e4-4527-8051-39f3b79b1512'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-WIN-TRO-7dl96u',
  'Diagnose and Repair Windows - Unimog U4000',
  'Body',
  'Windows',
  'Diagnose and Repair Windows - Unimog U4000',
  '# Diagnose and Repair Windows - Unimog U4000

## Overview
This procedure covers the troubleshooting of the Windows on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('08113ab6-0194-47e4-aee2-b37af8b9fbc0'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-MIR-REM-tj7fyq',
  'Remove and Install Mirrors - Unimog U4000',
  'Body',
  'Mirrors',
  'Remove and Install Mirrors - Unimog U4000',
  '# Remove and Install Mirrors - Unimog U4000

## Overview
This procedure covers the removal of the Mirrors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
  uuid('75c8bd17-ce18-4607-8d28-7e79cbe28534'),
  uuid('eeee0002-eeee-eeee-eeee-eeeeeeeeeeee'),
  'U4000-BOD-MIR-INS-8onvae',
  'Inspect and Test Mirrors - Unimog U4000',
  'Body',
  'Mirrors',
  'Inspect and Test Mirrors - Unimog U4000',
  '# Inspect and Test Mirrors - Unimog U4000

## Overview
This procedure covers the inspection of the Mirrors on Unimog U4000 vehicles with OM924LA/OM926LA engine.
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
);

-- Verify this chunk
SELECT COUNT(*) as procedures_in_db FROM wis_procedures;
