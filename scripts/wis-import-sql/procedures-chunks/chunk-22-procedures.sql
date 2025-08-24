-- WIS Procedures Import - Chunk 22
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new
-- This is chunk 22 of the procedures import

INSERT INTO wis_procedures (id, vehicle_id, procedure_code, title, category, subcategory, description, content, difficulty_level, estimated_time_minutes, tools_required, parts_required, safety_warnings, steps, is_published) VALUES
(
  uuid('a445a247-65d3-4e47-95a7-e1bb9518bf0a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-AUT-REM-xs3e0r',
  'Remove and Install Automatic Gearbox - Unimog U2000',
  'Transmission',
  'Automatic Gearbox',
  'Remove and Install Automatic Gearbox - Unimog U2000',
  '# Remove and Install Automatic Gearbox - Unimog U2000

## Overview
This procedure covers the removal of the Automatic Gearbox on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ca27ac68-d3dd-4d67-94b7-e43bae83f699'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-AUT-INS-7iwj8f',
  'Inspect and Test Automatic Gearbox - Unimog U2000',
  'Transmission',
  'Automatic Gearbox',
  'Inspect and Test Automatic Gearbox - Unimog U2000',
  '# Inspect and Test Automatic Gearbox - Unimog U2000

## Overview
This procedure covers the inspection of the Automatic Gearbox on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bf9ceed7-741b-447d-b827-00081d43576d'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-AUT-ADJ-gqq3vl',
  'Adjust and Calibrate Automatic Gearbox - Unimog U2000',
  'Transmission',
  'Automatic Gearbox',
  'Adjust and Calibrate Automatic Gearbox - Unimog U2000',
  '# Adjust and Calibrate Automatic Gearbox - Unimog U2000

## Overview
This procedure covers the adjustment of the Automatic Gearbox on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('71d8bea1-393d-4e0e-a8e6-bd0e8ae882fe'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-AUT-REP-ng3nfn',
  'Replace Automatic Gearbox - Unimog U2000',
  'Transmission',
  'Automatic Gearbox',
  'Replace Automatic Gearbox - Unimog U2000',
  '# Replace Automatic Gearbox - Unimog U2000

## Overview
This procedure covers the replacement of the Automatic Gearbox on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6df79a68-8266-4c63-8e12-874bcf4b6e1d'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-AUT-OVE-r6evq',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U2000',
  'Transmission',
  'Automatic Gearbox',
  'Overhaul and Rebuild Automatic Gearbox - Unimog U2000',
  '# Overhaul and Rebuild Automatic Gearbox - Unimog U2000

## Overview
This procedure covers the overhaul of the Automatic Gearbox on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('23300b59-875f-44f1-b579-8f41c1ace454'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-AUT-TRO-65kf9k',
  'Diagnose and Repair Automatic Gearbox - Unimog U2000',
  'Transmission',
  'Automatic Gearbox',
  'Diagnose and Repair Automatic Gearbox - Unimog U2000',
  '# Diagnose and Repair Automatic Gearbox - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Automatic Gearbox on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1bd96e97-3008-43e2-8ac5-0eb11dc5f6c7'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-TRA-REM-x3l0zd',
  'Remove and Install Transfer Case - Unimog U2000',
  'Transmission',
  'Transfer Case',
  'Remove and Install Transfer Case - Unimog U2000',
  '# Remove and Install Transfer Case - Unimog U2000

## Overview
This procedure covers the removal of the Transfer Case on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9751f40d-5a2b-44b6-ac97-ad62a333a179'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-TRA-INS-u07i77',
  'Inspect and Test Transfer Case - Unimog U2000',
  'Transmission',
  'Transfer Case',
  'Inspect and Test Transfer Case - Unimog U2000',
  '# Inspect and Test Transfer Case - Unimog U2000

## Overview
This procedure covers the inspection of the Transfer Case on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('358138c9-0f66-4d44-8bd5-782b90a58113'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-TRA-ADJ-ynb4v',
  'Adjust and Calibrate Transfer Case - Unimog U2000',
  'Transmission',
  'Transfer Case',
  'Adjust and Calibrate Transfer Case - Unimog U2000',
  '# Adjust and Calibrate Transfer Case - Unimog U2000

## Overview
This procedure covers the adjustment of the Transfer Case on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ca6537fc-12f3-4ce8-a585-3de2f3ced516'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-TRA-REP-a2iogc',
  'Replace Transfer Case - Unimog U2000',
  'Transmission',
  'Transfer Case',
  'Replace Transfer Case - Unimog U2000',
  '# Replace Transfer Case - Unimog U2000

## Overview
This procedure covers the replacement of the Transfer Case on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ab55b268-5783-4bc3-b4c5-9486aaec6bce'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-TRA-OVE-ituk9e',
  'Overhaul and Rebuild Transfer Case - Unimog U2000',
  'Transmission',
  'Transfer Case',
  'Overhaul and Rebuild Transfer Case - Unimog U2000',
  '# Overhaul and Rebuild Transfer Case - Unimog U2000

## Overview
This procedure covers the overhaul of the Transfer Case on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e512585a-99b9-4f5a-8d57-59cab83b155f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-TRA-TRO-u2c46n',
  'Diagnose and Repair Transfer Case - Unimog U2000',
  'Transmission',
  'Transfer Case',
  'Diagnose and Repair Transfer Case - Unimog U2000',
  '# Diagnose and Repair Transfer Case - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Transfer Case on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4aaa5984-b10b-43e0-99c0-0350a3b758d3'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-PTO-REM-101wiu',
  'Remove and Install PTO - Unimog U2000',
  'Transmission',
  'PTO',
  'Remove and Install PTO - Unimog U2000',
  '# Remove and Install PTO - Unimog U2000

## Overview
This procedure covers the removal of the PTO on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('063628bb-bd6d-4c88-841e-4bcf0b9c10e1'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-PTO-INS-2au0xq',
  'Inspect and Test PTO - Unimog U2000',
  'Transmission',
  'PTO',
  'Inspect and Test PTO - Unimog U2000',
  '# Inspect and Test PTO - Unimog U2000

## Overview
This procedure covers the inspection of the PTO on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9ef55b43-d1e4-44d9-ab69-a8e0cbaf8353'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-PTO-ADJ-yjytc9',
  'Adjust and Calibrate PTO - Unimog U2000',
  'Transmission',
  'PTO',
  'Adjust and Calibrate PTO - Unimog U2000',
  '# Adjust and Calibrate PTO - Unimog U2000

## Overview
This procedure covers the adjustment of the PTO on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('b050cb35-f418-4f71-9f12-fd536ea33c25'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-PTO-REP-pr5dnl',
  'Replace PTO - Unimog U2000',
  'Transmission',
  'PTO',
  'Replace PTO - Unimog U2000',
  '# Replace PTO - Unimog U2000

## Overview
This procedure covers the replacement of the PTO on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bfa9cb97-446c-4cc7-a913-88fd0744422a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-PTO-OVE-tctwbn',
  'Overhaul and Rebuild PTO - Unimog U2000',
  'Transmission',
  'PTO',
  'Overhaul and Rebuild PTO - Unimog U2000',
  '# Overhaul and Rebuild PTO - Unimog U2000

## Overview
This procedure covers the overhaul of the PTO on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('975eb766-36ce-495b-a74d-2d07776c793a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-PTO-TRO-s39w6',
  'Diagnose and Repair PTO - Unimog U2000',
  'Transmission',
  'PTO',
  'Diagnose and Repair PTO - Unimog U2000',
  '# Diagnose and Repair PTO - Unimog U2000

## Overview
This procedure covers the troubleshooting of the PTO on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('32f533fd-fc26-4ce0-9db1-e9c4c5e37e74'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-CLU-REM-m7k4qn',
  'Remove and Install Clutch - Unimog U2000',
  'Transmission',
  'Clutch',
  'Remove and Install Clutch - Unimog U2000',
  '# Remove and Install Clutch - Unimog U2000

## Overview
This procedure covers the removal of the Clutch on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1c4fdf27-4a5e-4ac7-be23-7da332cf7fa2'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-CLU-INS-wnsl2',
  'Inspect and Test Clutch - Unimog U2000',
  'Transmission',
  'Clutch',
  'Inspect and Test Clutch - Unimog U2000',
  '# Inspect and Test Clutch - Unimog U2000

## Overview
This procedure covers the inspection of the Clutch on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e3b7acf6-274f-49d3-af67-91f7a34b6d35'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-CLU-ADJ-xkxqf',
  'Adjust and Calibrate Clutch - Unimog U2000',
  'Transmission',
  'Clutch',
  'Adjust and Calibrate Clutch - Unimog U2000',
  '# Adjust and Calibrate Clutch - Unimog U2000

## Overview
This procedure covers the adjustment of the Clutch on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('43248aa6-a65e-4186-b83f-766978a43788'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-CLU-REP-veob2w',
  'Replace Clutch - Unimog U2000',
  'Transmission',
  'Clutch',
  'Replace Clutch - Unimog U2000',
  '# Replace Clutch - Unimog U2000

## Overview
This procedure covers the replacement of the Clutch on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a4986157-d631-4401-ab5e-40abe57d2db9'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-CLU-OVE-fh99yg',
  'Overhaul and Rebuild Clutch - Unimog U2000',
  'Transmission',
  'Clutch',
  'Overhaul and Rebuild Clutch - Unimog U2000',
  '# Overhaul and Rebuild Clutch - Unimog U2000

## Overview
This procedure covers the overhaul of the Clutch on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f3ff8392-47b4-45c1-aa23-12f3283d5c21'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-TRA-CLU-TRO-t7qve6',
  'Diagnose and Repair Clutch - Unimog U2000',
  'Transmission',
  'Clutch',
  'Diagnose and Repair Clutch - Unimog U2000',
  '# Diagnose and Repair Clutch - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Clutch on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Tra-001 for system overview
- See U2000-Tra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Clutch alignment tool','Transmission jack','Snap ring pliers']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('427ce8e4-980f-407e-97a9-825cb8cdd4b9'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-POR-REM-6yekvq',
  'Remove and Install Portal Axles - Unimog U2000',
  'Drivetrain',
  'Portal Axles',
  'Remove and Install Portal Axles - Unimog U2000',
  '# Remove and Install Portal Axles - Unimog U2000

## Overview
This procedure covers the removal of the Portal Axles on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a280ef90-2384-4b4f-8660-d3401c157d87'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-POR-INS-4u8xhl',
  'Inspect and Test Portal Axles - Unimog U2000',
  'Drivetrain',
  'Portal Axles',
  'Inspect and Test Portal Axles - Unimog U2000',
  '# Inspect and Test Portal Axles - Unimog U2000

## Overview
This procedure covers the inspection of the Portal Axles on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('85cd2563-086c-4ec9-b2ab-7e2cac0c17b0'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-POR-ADJ-vr1sn',
  'Adjust and Calibrate Portal Axles - Unimog U2000',
  'Drivetrain',
  'Portal Axles',
  'Adjust and Calibrate Portal Axles - Unimog U2000',
  '# Adjust and Calibrate Portal Axles - Unimog U2000

## Overview
This procedure covers the adjustment of the Portal Axles on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0ee5408f-1fd5-4d8c-b42d-c03a161113b9'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-POR-REP-tc1rzr',
  'Replace Portal Axles - Unimog U2000',
  'Drivetrain',
  'Portal Axles',
  'Replace Portal Axles - Unimog U2000',
  '# Replace Portal Axles - Unimog U2000

## Overview
This procedure covers the replacement of the Portal Axles on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6af64b67-946c-421f-bd74-f4b82b041134'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-POR-OVE-cot1j',
  'Overhaul and Rebuild Portal Axles - Unimog U2000',
  'Drivetrain',
  'Portal Axles',
  'Overhaul and Rebuild Portal Axles - Unimog U2000',
  '# Overhaul and Rebuild Portal Axles - Unimog U2000

## Overview
This procedure covers the overhaul of the Portal Axles on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('58f303e3-899a-4a88-a77b-8d1efab80924'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-POR-TRO-im3k1',
  'Diagnose and Repair Portal Axles - Unimog U2000',
  'Drivetrain',
  'Portal Axles',
  'Diagnose and Repair Portal Axles - Unimog U2000',
  '# Diagnose and Repair Portal Axles - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Portal Axles on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Portal axle oil 85W-90','Axle seals','Wheel bearings']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('d78e91c4-ea64-4845-8785-a1e7476501ca'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DIF-REM-e2pzkf',
  'Remove and Install Differentials - Unimog U2000',
  'Drivetrain',
  'Differentials',
  'Remove and Install Differentials - Unimog U2000',
  '# Remove and Install Differentials - Unimog U2000

## Overview
This procedure covers the removal of the Differentials on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('96047d59-fba3-4889-821d-90d437be4202'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DIF-INS-jouiiw',
  'Inspect and Test Differentials - Unimog U2000',
  'Drivetrain',
  'Differentials',
  'Inspect and Test Differentials - Unimog U2000',
  '# Inspect and Test Differentials - Unimog U2000

## Overview
This procedure covers the inspection of the Differentials on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('49dde2ad-200e-4a57-8457-693e0a04954f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DIF-ADJ-5hxpe7',
  'Adjust and Calibrate Differentials - Unimog U2000',
  'Drivetrain',
  'Differentials',
  'Adjust and Calibrate Differentials - Unimog U2000',
  '# Adjust and Calibrate Differentials - Unimog U2000

## Overview
This procedure covers the adjustment of the Differentials on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('43c3e645-a558-48e4-9a7e-70792a9d2d51'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DIF-REP-1rhkxd',
  'Replace Differentials - Unimog U2000',
  'Drivetrain',
  'Differentials',
  'Replace Differentials - Unimog U2000',
  '# Replace Differentials - Unimog U2000

## Overview
This procedure covers the replacement of the Differentials on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ab5a7cce-5414-4262-b6e4-49938ac2fc26'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DIF-OVE-5g0wzm',
  'Overhaul and Rebuild Differentials - Unimog U2000',
  'Drivetrain',
  'Differentials',
  'Overhaul and Rebuild Differentials - Unimog U2000',
  '# Overhaul and Rebuild Differentials - Unimog U2000

## Overview
This procedure covers the overhaul of the Differentials on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('93a59254-ea82-4c81-a38c-f18569fe5937'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DIF-TRO-zbaej',
  'Diagnose and Repair Differentials - Unimog U2000',
  'Drivetrain',
  'Differentials',
  'Diagnose and Repair Differentials - Unimog U2000',
  '# Diagnose and Repair Differentials - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Differentials on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0bd42817-9977-4879-93d4-06180ab21723'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DRI-REM-y8a8k',
  'Remove and Install Drive Shafts - Unimog U2000',
  'Drivetrain',
  'Drive Shafts',
  'Remove and Install Drive Shafts - Unimog U2000',
  '# Remove and Install Drive Shafts - Unimog U2000

## Overview
This procedure covers the removal of the Drive Shafts on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('edd03f0c-fcff-4872-8056-9d4079ca6a2c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DRI-INS-gmfyi',
  'Inspect and Test Drive Shafts - Unimog U2000',
  'Drivetrain',
  'Drive Shafts',
  'Inspect and Test Drive Shafts - Unimog U2000',
  '# Inspect and Test Drive Shafts - Unimog U2000

## Overview
This procedure covers the inspection of the Drive Shafts on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6763f458-a2e5-4416-a5d3-a53cbad1fa94'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DRI-ADJ-t0eml9',
  'Adjust and Calibrate Drive Shafts - Unimog U2000',
  'Drivetrain',
  'Drive Shafts',
  'Adjust and Calibrate Drive Shafts - Unimog U2000',
  '# Adjust and Calibrate Drive Shafts - Unimog U2000

## Overview
This procedure covers the adjustment of the Drive Shafts on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1fba3cac-53f6-46de-bed2-88578f9c2bf0'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DRI-REP-vo450n',
  'Replace Drive Shafts - Unimog U2000',
  'Drivetrain',
  'Drive Shafts',
  'Replace Drive Shafts - Unimog U2000',
  '# Replace Drive Shafts - Unimog U2000

## Overview
This procedure covers the replacement of the Drive Shafts on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('828f8327-671a-464f-9784-07943e366786'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DRI-OVE-d3gks9',
  'Overhaul and Rebuild Drive Shafts - Unimog U2000',
  'Drivetrain',
  'Drive Shafts',
  'Overhaul and Rebuild Drive Shafts - Unimog U2000',
  '# Overhaul and Rebuild Drive Shafts - Unimog U2000

## Overview
This procedure covers the overhaul of the Drive Shafts on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c23a3b69-2f48-4412-8e23-a775921119e4'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-DRI-TRO-jiuljr',
  'Diagnose and Repair Drive Shafts - Unimog U2000',
  'Drivetrain',
  'Drive Shafts',
  'Diagnose and Repair Drive Shafts - Unimog U2000',
  '# Diagnose and Repair Drive Shafts - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Drive Shafts on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e097249d-a013-4543-b0c9-3da506ffb335'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-WHE-REM-f5w4v',
  'Remove and Install Wheel Hubs - Unimog U2000',
  'Drivetrain',
  'Wheel Hubs',
  'Remove and Install Wheel Hubs - Unimog U2000',
  '# Remove and Install Wheel Hubs - Unimog U2000

## Overview
This procedure covers the removal of the Wheel Hubs on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f187f709-ea8b-48c1-97ab-2f01fd81d488'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-WHE-INS-ttl06t',
  'Inspect and Test Wheel Hubs - Unimog U2000',
  'Drivetrain',
  'Wheel Hubs',
  'Inspect and Test Wheel Hubs - Unimog U2000',
  '# Inspect and Test Wheel Hubs - Unimog U2000

## Overview
This procedure covers the inspection of the Wheel Hubs on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a0a88379-cced-49ba-b7f0-8e2b00c5795a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-WHE-ADJ-urld5b',
  'Adjust and Calibrate Wheel Hubs - Unimog U2000',
  'Drivetrain',
  'Wheel Hubs',
  'Adjust and Calibrate Wheel Hubs - Unimog U2000',
  '# Adjust and Calibrate Wheel Hubs - Unimog U2000

## Overview
This procedure covers the adjustment of the Wheel Hubs on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('f5b9d5cf-3d42-486e-abf1-ef04f38ac536'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-WHE-REP-7su33',
  'Replace Wheel Hubs - Unimog U2000',
  'Drivetrain',
  'Wheel Hubs',
  'Replace Wheel Hubs - Unimog U2000',
  '# Replace Wheel Hubs - Unimog U2000

## Overview
This procedure covers the replacement of the Wheel Hubs on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('e16a7c21-ae18-4b59-b230-11d2bedda94c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-WHE-OVE-do8tjc',
  'Overhaul and Rebuild Wheel Hubs - Unimog U2000',
  'Drivetrain',
  'Wheel Hubs',
  'Overhaul and Rebuild Wheel Hubs - Unimog U2000',
  '# Overhaul and Rebuild Wheel Hubs - Unimog U2000

## Overview
This procedure covers the overhaul of the Wheel Hubs on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c4aeb5d5-e0f2-4332-9150-6b88c7380bd7'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-WHE-TRO-ladb8g',
  'Diagnose and Repair Wheel Hubs - Unimog U2000',
  'Drivetrain',
  'Wheel Hubs',
  'Diagnose and Repair Wheel Hubs - Unimog U2000',
  '# Diagnose and Repair Wheel Hubs - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Wheel Hubs on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('76afaae5-24c4-400a-a3ca-9c69ae9ce7b2'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-CV -REM-aj23tvm',
  'Remove and Install CV Joints - Unimog U2000',
  'Drivetrain',
  'CV Joints',
  'Remove and Install CV Joints - Unimog U2000',
  '# Remove and Install CV Joints - Unimog U2000

## Overview
This procedure covers the removal of the CV Joints on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7a84859f-e9a2-46d6-96f1-acf9acb5a9fb'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-CV -INS-09dsat',
  'Inspect and Test CV Joints - Unimog U2000',
  'Drivetrain',
  'CV Joints',
  'Inspect and Test CV Joints - Unimog U2000',
  '# Inspect and Test CV Joints - Unimog U2000

## Overview
This procedure covers the inspection of the CV Joints on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('86a8ad48-7176-4d01-ae62-c19a5bfe74b4'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-CV -ADJ-xjcsw8',
  'Adjust and Calibrate CV Joints - Unimog U2000',
  'Drivetrain',
  'CV Joints',
  'Adjust and Calibrate CV Joints - Unimog U2000',
  '# Adjust and Calibrate CV Joints - Unimog U2000

## Overview
This procedure covers the adjustment of the CV Joints on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('6d117e18-428b-41b0-83c6-9f44a89dbeaa'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-CV -REP-us6wy',
  'Replace CV Joints - Unimog U2000',
  'Drivetrain',
  'CV Joints',
  'Replace CV Joints - Unimog U2000',
  '# Replace CV Joints - Unimog U2000

## Overview
This procedure covers the replacement of the CV Joints on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4e571ca5-bb99-4570-92ba-d9655bdc640f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-CV -OVE-jzb2n',
  'Overhaul and Rebuild CV Joints - Unimog U2000',
  'Drivetrain',
  'CV Joints',
  'Overhaul and Rebuild CV Joints - Unimog U2000',
  '# Overhaul and Rebuild CV Joints - Unimog U2000

## Overview
This procedure covers the overhaul of the CV Joints on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('9b87fd4f-1d0b-4034-bb84-bded25e23615'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-DRI-CV -TRO-ylpk0k',
  'Diagnose and Repair CV Joints - Unimog U2000',
  'Drivetrain',
  'CV Joints',
  'Diagnose and Repair CV Joints - Unimog U2000',
  '# Diagnose and Repair CV Joints - Unimog U2000

## Overview
This procedure covers the troubleshooting of the CV Joints on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Dri-001 for system overview
- See U2000-Dri-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Portal axle oil pump','CV joint separator','Bearing puller']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cf57c74f-1fa6-4fac-b403-834dcf63a455'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-SER-REM-78ihl',
  'Remove and Install Service Brakes - Unimog U2000',
  'Brakes',
  'Service Brakes',
  'Remove and Install Service Brakes - Unimog U2000',
  '# Remove and Install Service Brakes - Unimog U2000

## Overview
This procedure covers the removal of the Service Brakes on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('82325aa9-5c3d-474e-be83-50e478a51eb1'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-SER-INS-qd3oj',
  'Inspect and Test Service Brakes - Unimog U2000',
  'Brakes',
  'Service Brakes',
  'Inspect and Test Service Brakes - Unimog U2000',
  '# Inspect and Test Service Brakes - Unimog U2000

## Overview
This procedure covers the inspection of the Service Brakes on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('166142c0-639b-471c-839b-fa708e05407a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-SER-ADJ-pb2ozd',
  'Adjust and Calibrate Service Brakes - Unimog U2000',
  'Brakes',
  'Service Brakes',
  'Adjust and Calibrate Service Brakes - Unimog U2000',
  '# Adjust and Calibrate Service Brakes - Unimog U2000

## Overview
This procedure covers the adjustment of the Service Brakes on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('15ea126e-542f-4940-bed8-fc019099df14'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-SER-REP-i7n39d',
  'Replace Service Brakes - Unimog U2000',
  'Brakes',
  'Service Brakes',
  'Replace Service Brakes - Unimog U2000',
  '# Replace Service Brakes - Unimog U2000

## Overview
This procedure covers the replacement of the Service Brakes on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('41755f06-3528-4b83-a3ee-09ca870177e9'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-SER-OVE-8ctle',
  'Overhaul and Rebuild Service Brakes - Unimog U2000',
  'Brakes',
  'Service Brakes',
  'Overhaul and Rebuild Service Brakes - Unimog U2000',
  '# Overhaul and Rebuild Service Brakes - Unimog U2000

## Overview
This procedure covers the overhaul of the Service Brakes on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c09adc45-1cf5-4f7e-a21a-22b6b8b2a956'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-SER-TRO-m2gru',
  'Diagnose and Repair Service Brakes - Unimog U2000',
  'Brakes',
  'Service Brakes',
  'Diagnose and Repair Service Brakes - Unimog U2000',
  '# Diagnose and Repair Service Brakes - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Service Brakes on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('86201e65-65fd-49d7-aa65-dc68baa05a7e'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-PAR-REM-43v5wp',
  'Remove and Install Parking Brake - Unimog U2000',
  'Brakes',
  'Parking Brake',
  'Remove and Install Parking Brake - Unimog U2000',
  '# Remove and Install Parking Brake - Unimog U2000

## Overview
This procedure covers the removal of the Parking Brake on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0015199b-9337-475e-839b-a0a64ec766fd'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-PAR-INS-bmpph',
  'Inspect and Test Parking Brake - Unimog U2000',
  'Brakes',
  'Parking Brake',
  'Inspect and Test Parking Brake - Unimog U2000',
  '# Inspect and Test Parking Brake - Unimog U2000

## Overview
This procedure covers the inspection of the Parking Brake on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cb0431ba-174a-4625-bbd0-3ddbdf5010c4'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-PAR-ADJ-kjb7el',
  'Adjust and Calibrate Parking Brake - Unimog U2000',
  'Brakes',
  'Parking Brake',
  'Adjust and Calibrate Parking Brake - Unimog U2000',
  '# Adjust and Calibrate Parking Brake - Unimog U2000

## Overview
This procedure covers the adjustment of the Parking Brake on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1746d652-3df0-474b-a96b-e3aa9ca38c32'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-PAR-REP-m5396u',
  'Replace Parking Brake - Unimog U2000',
  'Brakes',
  'Parking Brake',
  'Replace Parking Brake - Unimog U2000',
  '# Replace Parking Brake - Unimog U2000

## Overview
This procedure covers the replacement of the Parking Brake on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('daaf828f-657e-40ac-9a1a-ca247e61acef'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-PAR-OVE-iyt5cd',
  'Overhaul and Rebuild Parking Brake - Unimog U2000',
  'Brakes',
  'Parking Brake',
  'Overhaul and Rebuild Parking Brake - Unimog U2000',
  '# Overhaul and Rebuild Parking Brake - Unimog U2000

## Overview
This procedure covers the overhaul of the Parking Brake on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a5e30252-39c6-4bf2-aadd-2cb9a898c133'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-PAR-TRO-xtpm5',
  'Diagnose and Repair Parking Brake - Unimog U2000',
  'Brakes',
  'Parking Brake',
  'Diagnose and Repair Parking Brake - Unimog U2000',
  '# Diagnose and Repair Parking Brake - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Parking Brake on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('66883702-d6bd-403e-8092-436fb08475e4'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-ABS-REM-g50cg',
  'Remove and Install ABS System - Unimog U2000',
  'Brakes',
  'ABS System',
  'Remove and Install ABS System - Unimog U2000',
  '# Remove and Install ABS System - Unimog U2000

## Overview
This procedure covers the removal of the ABS System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('de6c8bf1-50bc-4e69-946f-fbbe1e8f3149'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-ABS-INS-zuvt8b',
  'Inspect and Test ABS System - Unimog U2000',
  'Brakes',
  'ABS System',
  'Inspect and Test ABS System - Unimog U2000',
  '# Inspect and Test ABS System - Unimog U2000

## Overview
This procedure covers the inspection of the ABS System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('1111db63-242b-476c-ad88-b3a128ed7635'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-ABS-ADJ-l0519k',
  'Adjust and Calibrate ABS System - Unimog U2000',
  'Brakes',
  'ABS System',
  'Adjust and Calibrate ABS System - Unimog U2000',
  '# Adjust and Calibrate ABS System - Unimog U2000

## Overview
This procedure covers the adjustment of the ABS System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('47e44b8e-378f-47eb-912f-bc3a61ceff28'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-ABS-REP-obhbih',
  'Replace ABS System - Unimog U2000',
  'Brakes',
  'ABS System',
  'Replace ABS System - Unimog U2000',
  '# Replace ABS System - Unimog U2000

## Overview
This procedure covers the replacement of the ABS System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('08806dfa-997a-4efa-b1d9-5686ff0a233c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-ABS-OVE-yjssh',
  'Overhaul and Rebuild ABS System - Unimog U2000',
  'Brakes',
  'ABS System',
  'Overhaul and Rebuild ABS System - Unimog U2000',
  '# Overhaul and Rebuild ABS System - Unimog U2000

## Overview
This procedure covers the overhaul of the ABS System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('3b4aa888-b4a7-464c-8cb6-3ec28f1e3a56'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-ABS-TRO-hzdm5d',
  'Diagnose and Repair ABS System - Unimog U2000',
  'Brakes',
  'ABS System',
  'Diagnose and Repair ABS System - Unimog U2000',
  '# Diagnose and Repair ABS System - Unimog U2000

## Overview
This procedure covers the troubleshooting of the ABS System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8b4abd58-7054-4b16-a1ce-7c63394461da'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-BRA-REM-v9yd3c',
  'Remove and Install Brake Lines - Unimog U2000',
  'Brakes',
  'Brake Lines',
  'Remove and Install Brake Lines - Unimog U2000',
  '# Remove and Install Brake Lines - Unimog U2000

## Overview
This procedure covers the removal of the Brake Lines on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('0d1cd99d-e8cd-4859-aa93-e0df5df3332c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-BRA-INS-8x24qn',
  'Inspect and Test Brake Lines - Unimog U2000',
  'Brakes',
  'Brake Lines',
  'Inspect and Test Brake Lines - Unimog U2000',
  '# Inspect and Test Brake Lines - Unimog U2000

## Overview
This procedure covers the inspection of the Brake Lines on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2235a6a8-04f2-41a5-8dcd-56a081c5e8df'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-BRA-ADJ-rlhkk8',
  'Adjust and Calibrate Brake Lines - Unimog U2000',
  'Brakes',
  'Brake Lines',
  'Adjust and Calibrate Brake Lines - Unimog U2000',
  '# Adjust and Calibrate Brake Lines - Unimog U2000

## Overview
This procedure covers the adjustment of the Brake Lines on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2135dcd0-25b8-497c-86e2-8964378d4465'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-BRA-REP-55se8m',
  'Replace Brake Lines - Unimog U2000',
  'Brakes',
  'Brake Lines',
  'Replace Brake Lines - Unimog U2000',
  '# Replace Brake Lines - Unimog U2000

## Overview
This procedure covers the replacement of the Brake Lines on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('4f923ce2-9462-4632-bb03-6d25aae23f72'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-BRA-OVE-wb5v3p',
  'Overhaul and Rebuild Brake Lines - Unimog U2000',
  'Brakes',
  'Brake Lines',
  'Overhaul and Rebuild Brake Lines - Unimog U2000',
  '# Overhaul and Rebuild Brake Lines - Unimog U2000

## Overview
This procedure covers the overhaul of the Brake Lines on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c1bdd0fb-0f7c-4c5e-9863-0e20876d4fbd'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-BRA-TRO-5obun',
  'Diagnose and Repair Brake Lines - Unimog U2000',
  'Brakes',
  'Brake Lines',
  'Diagnose and Repair Brake Lines - Unimog U2000',
  '# Diagnose and Repair Brake Lines - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Brake Lines on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Brake pads','Brake fluid DOT 4','Brake lines']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('8232e93a-c1cd-4acd-ac2f-2645a1fc9958'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-AIR-REM-zy0xqt',
  'Remove and Install Air System - Unimog U2000',
  'Brakes',
  'Air System',
  'Remove and Install Air System - Unimog U2000',
  '# Remove and Install Air System - Unimog U2000

## Overview
This procedure covers the removal of the Air System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ec55124f-836a-4218-8c5d-3bd1e5f906c5'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-AIR-INS-ol81wr',
  'Inspect and Test Air System - Unimog U2000',
  'Brakes',
  'Air System',
  'Inspect and Test Air System - Unimog U2000',
  '# Inspect and Test Air System - Unimog U2000

## Overview
This procedure covers the inspection of the Air System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('df28c8cb-6abe-4bb2-88bf-05e80561437a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-AIR-ADJ-4x4zj',
  'Adjust and Calibrate Air System - Unimog U2000',
  'Brakes',
  'Air System',
  'Adjust and Calibrate Air System - Unimog U2000',
  '# Adjust and Calibrate Air System - Unimog U2000

## Overview
This procedure covers the adjustment of the Air System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cd85b788-1e1e-4e27-84c4-a56621d2eac8'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-AIR-REP-vto2kt',
  'Replace Air System - Unimog U2000',
  'Brakes',
  'Air System',
  'Replace Air System - Unimog U2000',
  '# Replace Air System - Unimog U2000

## Overview
This procedure covers the replacement of the Air System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('cb6ca834-587e-4f4a-aca9-31cd681b126c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-AIR-OVE-7a91ub',
  'Overhaul and Rebuild Air System - Unimog U2000',
  'Brakes',
  'Air System',
  'Overhaul and Rebuild Air System - Unimog U2000',
  '# Overhaul and Rebuild Air System - Unimog U2000

## Overview
This procedure covers the overhaul of the Air System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5a0a4a50-6964-4704-baf8-5fc6a0163261'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-BRA-AIR-TRO-b1o5jj',
  'Diagnose and Repair Air System - Unimog U2000',
  'Brakes',
  'Air System',
  'Diagnose and Repair Air System - Unimog U2000',
  '# Diagnose and Repair Air System - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Air System on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Bra-001 for system overview
- See U2000-Bra-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Brake bleeder','Caliper piston tool','Brake line flaring tool']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7fdae1ef-fedb-44ee-9b3d-e15d65b14c15'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-REM-z9m36q',
  'Remove and Install Steering Box - Unimog U2000',
  'Steering',
  'Steering Box',
  'Remove and Install Steering Box - Unimog U2000',
  '# Remove and Install Steering Box - Unimog U2000

## Overview
This procedure covers the removal of the Steering Box on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('7f025b2f-3b0e-4911-85c0-73793a40d020'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-INS-vhovn',
  'Inspect and Test Steering Box - Unimog U2000',
  'Steering',
  'Steering Box',
  'Inspect and Test Steering Box - Unimog U2000',
  '# Inspect and Test Steering Box - Unimog U2000

## Overview
This procedure covers the inspection of the Steering Box on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('2640ea0e-d0ec-4a43-8184-f8c023f7effc'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-ADJ-cokg4n',
  'Adjust and Calibrate Steering Box - Unimog U2000',
  'Steering',
  'Steering Box',
  'Adjust and Calibrate Steering Box - Unimog U2000',
  '# Adjust and Calibrate Steering Box - Unimog U2000

## Overview
This procedure covers the adjustment of the Steering Box on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('a20040fe-5e8d-4108-a670-d5ca9de05b57'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-REP-qi6uwf',
  'Replace Steering Box - Unimog U2000',
  'Steering',
  'Steering Box',
  'Replace Steering Box - Unimog U2000',
  '# Replace Steering Box - Unimog U2000

## Overview
This procedure covers the replacement of the Steering Box on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('eb590568-7d4a-4746-b33e-861a175f7f0a'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-OVE-yc1swu',
  'Overhaul and Rebuild Steering Box - Unimog U2000',
  'Steering',
  'Steering Box',
  'Overhaul and Rebuild Steering Box - Unimog U2000',
  '# Overhaul and Rebuild Steering Box - Unimog U2000

## Overview
This procedure covers the overhaul of the Steering Box on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('460c60a1-a009-4e10-993b-ab55f772a945'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-TRO-9se5b',
  'Diagnose and Repair Steering Box - Unimog U2000',
  'Steering',
  'Steering Box',
  'Diagnose and Repair Steering Box - Unimog U2000',
  '# Diagnose and Repair Steering Box - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Steering Box on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('bd3753ac-ca07-48f8-a2a3-6dc1ba4da47b'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-POW-REM-gehaef',
  'Remove and Install Power Steering - Unimog U2000',
  'Steering',
  'Power Steering',
  'Remove and Install Power Steering - Unimog U2000',
  '# Remove and Install Power Steering - Unimog U2000

## Overview
This procedure covers the removal of the Power Steering on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('380d5807-2a4f-41ad-85b0-765a30e96f37'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-POW-INS-nl26qg',
  'Inspect and Test Power Steering - Unimog U2000',
  'Steering',
  'Power Steering',
  'Inspect and Test Power Steering - Unimog U2000',
  '# Inspect and Test Power Steering - Unimog U2000

## Overview
This procedure covers the inspection of the Power Steering on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('eae89650-9a36-4104-b96b-9ee4863cfe18'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-POW-ADJ-uybr8h',
  'Adjust and Calibrate Power Steering - Unimog U2000',
  'Steering',
  'Power Steering',
  'Adjust and Calibrate Power Steering - Unimog U2000',
  '# Adjust and Calibrate Power Steering - Unimog U2000

## Overview
This procedure covers the adjustment of the Power Steering on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('ac88831d-e0bb-4973-9a18-033b8d7df0ea'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-POW-REP-z76qan',
  'Replace Power Steering - Unimog U2000',
  'Steering',
  'Power Steering',
  'Replace Power Steering - Unimog U2000',
  '# Replace Power Steering - Unimog U2000

## Overview
This procedure covers the replacement of the Power Steering on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  3,
  180,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform replacement procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5a11ed3b-1bc6-4dbd-a080-cff3d510dce5'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-POW-OVE-77vcnc',
  'Overhaul and Rebuild Power Steering - Unimog U2000',
  'Steering',
  'Power Steering',
  'Overhaul and Rebuild Power Steering - Unimog U2000',
  '# Overhaul and Rebuild Power Steering - Unimog U2000

## Overview
This procedure covers the overhaul of the Power Steering on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  4,
  480,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform overhaul procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('21c96012-3a44-43d5-98d6-3f8455688481'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-POW-TRO-fqx5tc',
  'Diagnose and Repair Power Steering - Unimog U2000',
  'Steering',
  'Power Steering',
  'Diagnose and Repair Power Steering - Unimog U2000',
  '# Diagnose and Repair Power Steering - Unimog U2000

## Overview
This procedure covers the troubleshooting of the Power Steering on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  2,
  90,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform troubleshooting procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('961471b3-6be8-4f50-9295-fb9b88c1688f'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-REM-nztyf',
  'Remove and Install Steering Linkage - Unimog U2000',
  'Steering',
  'Steering Linkage',
  'Remove and Install Steering Linkage - Unimog U2000',
  '# Remove and Install Steering Linkage - Unimog U2000

## Overview
This procedure covers the removal of the Steering Linkage on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  2,
  120,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform removal procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('5fa070e6-60ca-4c76-ba74-a5b1f29f6258'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-INS-u4zpti',
  'Inspect and Test Steering Linkage - Unimog U2000',
  'Steering',
  'Steering Linkage',
  'Inspect and Test Steering Linkage - Unimog U2000',
  '# Inspect and Test Steering Linkage - Unimog U2000

## Overview
This procedure covers the inspection of the Steering Linkage on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  1,
  45,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform inspection procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('56390244-5e75-4c1c-83ab-dec6d2a1067c'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-ADJ-o3h7ac',
  'Adjust and Calibrate Steering Linkage - Unimog U2000',
  'Steering',
  'Steering Linkage',
  'Adjust and Calibrate Steering Linkage - Unimog U2000',
  '# Adjust and Calibrate Steering Linkage - Unimog U2000

## Overview
This procedure covers the adjustment of the Steering Linkage on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
  2,
  60,
  ARRAY['Tie rod separator','Steering wheel puller','Alignment gauges']::text[],
  ARRAY['Check parts catalog for specific requirements']::text[],
  ARRAY['Always wear appropriate PPE','Ensure vehicle is properly supported','Disconnect battery before electrical work']::text[],
  '[{"step":1,"description":"Prepare vehicle and work area","time":10},{"step":2,"description":"Remove necessary components for access","time":20},{"step":3,"description":"Perform adjustment procedure","time":45},{"step":4,"description":"Reinstall removed components","time":20},{"step":5,"description":"Test and verify operation","time":15}]',
  true
),
(
  uuid('c46c30c2-b324-439c-bf3c-a3d1f1e7da4e'),
  uuid('22222222-2222-2222-2222-222222222222'),
  'U2000-STE-STE-REP-6n5aa8',
  'Replace Steering Linkage - Unimog U2000',
  'Steering',
  'Steering Linkage',
  'Replace Steering Linkage - Unimog U2000',
  '# Replace Steering Linkage - Unimog U2000

## Overview
This procedure covers the replacement of the Steering Linkage on Unimog U2000 vehicles with OM906LA engine.
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
- See U2000-Ste-001 for system overview
- See U2000-Ste-TSB-01 for latest updates',
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
