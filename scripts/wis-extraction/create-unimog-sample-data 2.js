#!/usr/bin/env node

/**
 * Create comprehensive Unimog-specific sample data
 * Provides immediate functionality while real WIS extraction is completed
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🚜 Creating Comprehensive Unimog Sample Data...\n');

/**
 * Unimog Models Data - Matches actual schema
 */
const unimogModels = [
  { model_code: 'U300', model_name: 'Unimog U300', year_from: 1995, year_to: 2000, engine_type: 'OM364', series: 'U300' },
  { model_code: 'U400', model_name: 'Unimog U400', year_from: 2000, year_to: 2013, engine_type: 'OM924', series: 'U400' },
  { model_code: 'U500', model_name: 'Unimog U500', year_from: 2013, year_to: 2025, engine_type: 'OM924', series: 'U500' },
  { model_code: 'U1000', model_name: 'Unimog U1000', year_from: 1975, year_to: 1989, engine_type: 'OM352', series: 'U1000' },
  { model_code: 'U1300', model_name: 'Unimog U1300', year_from: 1980, year_to: 2006, engine_type: 'OM366', series: 'U1300' },
  { model_code: 'U1700', model_name: 'Unimog U1700', year_from: 1990, year_to: 2006, engine_type: 'OM366', series: 'U1700' },
  { model_code: 'U2000', model_name: 'Unimog U2000', year_from: 1993, year_to: 2000, engine_type: 'OM366', series: 'U2000' },
  { model_code: 'U2400', model_name: 'Unimog U2400', year_from: 2000, year_to: 2013, engine_type: 'OM924', series: 'U2400' },
  { model_code: 'U4000', model_name: 'Unimog U4000', year_from: 2000, year_to: 2013, engine_type: 'OM924', series: 'U4000' },
  { model_code: 'U5000', model_name: 'Unimog U5000', year_from: 2013, year_to: 2025, engine_type: 'OM934', series: 'U5000' }
];

/**
 * Common Unimog Procedures
 */
const procedures = [
  {
    procedure_id: 'PROC_001',
    title: 'Engine Oil Change - OM366 Engine',
    category: 'Engine',
    model_codes: ['U1300', 'U1700', 'U2000'],
    version: '1.0',
    content: `PROCEDURE: Engine Oil Change - OM366

TOOLS REQUIRED:
- 19mm socket wrench
- Oil filter wrench
- Oil drain pan (minimum 12L capacity)
- Funnel

MATERIALS:
- Engine oil: 10W-40 (11 liters)
- Oil filter: Mercedes part #0001802609
- Drain plug gasket: A0009831435

SAFETY:
- Engine should be warm but not hot
- Wear safety glasses and gloves
- Ensure vehicle is on level ground

PROCEDURE:
1. Position oil drain pan under drain plug
2. Remove drain plug with 19mm socket
3. Allow oil to drain completely (15-20 minutes)
4. Replace drain plug gasket and reinstall plug (45 Nm)
5. Locate oil filter (driver side of engine)
6. Remove old filter with filter wrench
7. Apply thin layer of oil to new filter gasket
8. Install new filter hand-tight plus 3/4 turn
9. Add 10 liters of new oil through filler cap
10. Start engine and check for leaks
11. Check oil level after engine cools
12. Top up to maximum mark if needed

DISPOSAL:
- Used oil and filter must be disposed of properly
- Take to authorized recycling center`
  },
  {
    procedure_id: 'PROC_002', 
    title: 'Portal Axle Oil Change',
    description: 'Procedure for changing portal axle gear oil in Unimog portal axles (front and rear).',
    system_category: 'Drivetrain',
    procedure_type: 'Maintenance',
    model_id: 'U400',
    content: `
PROCEDURE: Portal Axle Oil Change

APPLICABILITY: All Unimog models with portal axles

TOOLS REQUIRED:
- 17mm hex socket
- 14mm hex socket
- Oil suction pump or funnel
- Oil drain pan

MATERIALS:
- SAE 90 gear oil (2L per axle)
- New drain plug gaskets

PROCEDURE:
1. Drive vehicle to warm gear oil
2. Position on level surface
3. Locate drain plugs at bottom of each portal
4. Remove drain plugs (17mm hex)
5. Allow oil to drain completely
6. Clean and inspect drain plugs
7. Install new gaskets on drain plugs
8. Reinstall drain plugs (25 Nm)
9. Locate fill plugs (side of portal housing)
10. Remove fill plugs (14mm hex)
11. Fill with SAE 90 oil until level with fill hole
12. Reinstall fill plugs (20 Nm)
13. Test drive and recheck levels

CAPACITY:
- Front portals: 0.8L each
- Rear portals: 1.2L each

INTERVAL: Every 50,000 km or 2 years
    `,
    metadata: {
      difficulty: 'Intermediate',
      estimated_time: '2 hours',
      special_notes: 'Check for metal particles in old oil'
    }
  },
  {
    procedure_id: 'PROC_003',
    title: 'Diff Lock System Check',
    description: 'Testing and troubleshooting procedure for Unimog differential lock system.',
    system_category: 'Drivetrain', 
    procedure_type: 'Diagnostic',
    model_id: 'U500',
    content: `
PROCEDURE: Differential Lock System Check

SYSTEM: Pneumatic/Electric diff locks

TOOLS REQUIRED:
- Multimeter
- Pressure gauge (0-10 bar)
- Basic hand tools

TEST PROCEDURE:
1. Check air pressure at tank (minimum 6 bar)
2. Test center diff lock switch operation
3. Check warning lights on dashboard
4. Test front axle diff lock engagement
5. Test rear axle diff lock engagement
6. Check for air leaks in system
7. Verify disengage function works correctly

ELECTRICAL TESTS:
- Switch continuity: <1 ohm closed, >10k ohm open
- Solenoid resistance: 25-35 ohms
- Warning light operation: 12V supply

PNEUMATIC TESTS:
- System pressure: 6-8 bar operating
- Lock engagement pressure: 4-6 bar
- Air cylinder movement: Full stroke

COMMON FAULTS:
- Air leaks at cylinder seals
- Faulty pressure switches
- Corroded electrical connections
- Worn selector switches

ADJUSTMENT:
- Lock switches should engage at 50% travel
- Full engagement within 2 seconds
- Automatic disengagement above 20 km/h
    `,
    metadata: {
      difficulty: 'Advanced',
      estimated_time: '1.5 hours',
      special_tools: 'Pressure gauge, multimeter'
    }
  },
  {
    procedure_id: 'PROC_004',
    title: 'PTO System Service',
    description: 'Service and maintenance procedure for Unimog Power Take-Off (PTO) system.',
    system_category: 'PTO',
    procedure_type: 'Maintenance',
    model_id: 'U1300',
    content: `
PROCEDURE: PTO System Service

APPLICABILITY: All Unimog models with PTO

COMPONENTS:
- Front PTO (engine-driven)
- Rear PTO (transmission-driven) 
- PTO control valves

MAINTENANCE TASKS:
1. Check PTO oil level
2. Test engagement/disengagement
3. Inspect mounting bolts
4. Check control linkages
5. Test safety interlocks

OIL SERVICE:
- Drain plug location: Bottom of PTO housing
- Fill plug: Side of housing  
- Capacity: 1.5L SAE 90 gear oil
- Service interval: 100,000 km

OPERATIONAL TESTS:
1. Engine at idle, transmission in neutral
2. Engage PTO using control lever
3. Verify smooth engagement (no grinding)
4. Check PTO output shaft rotation
5. Test disengagement function
6. Verify interlock prevents engagement while driving

SAFETY CHECKS:
- PTO guard properly installed
- Warning labels legible
- Control lever returns to neutral
- Emergency stop accessible

TROUBLESHOOTING:
- Won't engage: Check oil level, linkage adjustment
- Grinding noise: Worn synchronizers, service required
- Won't disengage: Sticking control valve, linkage binding
- Overheating: Low oil level, excessive load
    `,
    metadata: {
      difficulty: 'Intermediate',
      estimated_time: '1 hour',
      safety_critical: true
    }
  },
  {
    procedure_id: 'PROC_005',
    title: 'Hydraulic System Bleeding',
    description: 'Procedure for bleeding air from Unimog hydraulic systems (steering, brakes, implements).',
    system_category: 'Hydraulics',
    procedure_type: 'Maintenance',
    model_id: 'U400',
    content: `
PROCEDURE: Hydraulic System Bleeding

SYSTEMS COVERED:
- Power steering
- Hydraulic brakes
- Implement hydraulics

TOOLS REQUIRED:
- Bleeding equipment
- Hydraulic fluid (Pentosin CHF 202)
- Container for waste fluid

POWER STEERING BLEEDING:
1. Fill reservoir to MAX mark
2. Start engine, turn wheel lock-to-lock slowly
3. Check for air bubbles in reservoir
4. Top up fluid as needed
5. Repeat until no air bubbles visible

BRAKE SYSTEM BLEEDING:
1. Start with wheel furthest from master cylinder
2. Connect bleeding equipment to brake nipple
3. Have assistant pump brake pedal
4. Open nipple 1/4 turn during pedal stroke
5. Close nipple before pedal reaches bottom
6. Repeat until fluid runs clear
7. Work progressively toward master cylinder

IMPLEMENT HYDRAULICS:
1. Raise all implements to maximum height
2. Lower slowly to minimum position
3. Repeat 5-10 cycles
4. Check fluid level and top up
5. Test all functions for smooth operation

FLUID SPECIFICATIONS:
- Power steering: Pentosin CHF 202
- Brake system: DOT 4 brake fluid
- Implement hydraulics: ISO 46 hydraulic oil

BLEEDING ORDER (brakes):
1. Right rear
2. Left rear  
3. Right front
4. Left front
    `,
    metadata: {
      difficulty: 'Intermediate',
      estimated_time: '2 hours',
      special_tools: 'Brake bleeding kit'
    }
  }
];

/**
 * Common Unimog Parts
 */
const parts = [
  {
    part_number: '0001802609',
    description: 'Engine Oil Filter - OM366 Engine',
    quantity: 1,
    unit: 'EA',
    category: 'Engine',
    metadata: {
      oem_part: true,
      fits_models: ['U1300', 'U1700'],
      weight_kg: 1.2,
      replaces: ['0001802107', '0001802207']
    }
  },
  {
    part_number: 'A0009831435',
    description: 'Drain Plug Gasket - Copper',
    quantity: 1,
    unit: 'EA', 
    category: 'Engine',
    metadata: {
      material: 'Copper',
      diameter_mm: 18,
      fits_models: ['U300', 'U400', 'U500', 'U1300', 'U1700']
    }
  },
  {
    part_number: '3052601981',
    description: 'Portal Axle Pinion Seal',
    quantity: 2,
    unit: 'EA',
    category: 'Drivetrain',
    metadata: {
      location: 'Portal axle',
      fits_models: ['U300', 'U400', 'U500'],
      service_kit: '3052602098'
    }
  },
  {
    part_number: '0014606618',
    description: 'Differential Lock Pressure Switch',
    quantity: 1,
    unit: 'EA',
    category: 'Drivetrain',
    metadata: {
      operating_pressure: '4-6 bar',
      fits_models: ['All with diff locks'],
      electrical_spec: '12V 25A'
    }
  },
  {
    part_number: '0024209651',
    description: 'PTO Control Valve',
    quantity: 1,
    unit: 'EA',
    category: 'PTO',
    metadata: {
      valve_type: 'Pneumatic',
      fits_models: ['U1300', 'U1700', 'U2000'],
      service_kit_available: true
    }
  },
  {
    part_number: '0014602048',
    description: 'Hydraulic Filter Element',
    quantity: 1,
    unit: 'EA',
    category: 'Hydraulics',
    metadata: {
      micron_rating: 25,
      flow_rate: '120 L/min',
      fits_models: ['U400', 'U500', 'U2400', 'U4000', 'U5000']
    }
  }
];

/**
 * Technical Service Bulletins
 */
const bulletins = [
  {
    bulletin_id: 'TSB_2024_001',
    title: 'Portal Axle Oil Seal Improvement',
    bulletin_number: 'MB-TSB-2024-001',
    issue_date: '2024-01-15T00:00:00.000Z',
    category: 'Drivetrain',
    content: 'Updated portal axle oil seals with improved design to prevent leakage. Affects all U400/U500 models built before 2020. New part number 3052601981 supersedes previous versions.',
    affected_models: 'U400, U500',
    metadata: {
      supersedes: ['TSB_2023_012'],
      warranty_extension: true,
      dealer_action_required: true
    }
  },
  {
    bulletin_id: 'TSB_2024_002', 
    title: 'Engine Oil Specification Update',
    bulletin_number: 'MB-TSB-2024-002',
    issue_date: '2024-03-10T00:00:00.000Z',
    category: 'Engine',
    content: 'Updated engine oil specification for OM366 engines. New specification allows use of 5W-40 synthetic oil in addition to existing 10W-40 mineral oil. Improved cold weather performance.',
    affected_models: 'U1300, U1700',
    metadata: {
      oil_spec_change: true,
      cold_weather_improvement: true,
      retroactive: true
    }
  },
  {
    bulletin_id: 'TSB_2024_003',
    title: 'Differential Lock System Diagnostic Procedure',
    bulletin_number: 'MB-TSB-2024-003', 
    issue_date: '2024-05-20T00:00:00.000Z',
    category: 'Drivetrain',
    content: 'Updated diagnostic procedure for intermittent differential lock faults. Includes new test sequences and fault code interpretation. Addresses customer complaints of locks not engaging consistently.',
    affected_models: 'All models with diff locks',
    metadata: {
      diagnostic_update: true,
      software_related: false,
      training_required: true
    }
  }
];

/**
 * Upload data to Supabase
 */
async function uploadSampleData() {
  let totalUploaded = 0;
  
  try {
    // Upload models
    console.log('📋 Uploading Unimog models...');
    const { data: modelData, error: modelError } = await supabase
      .from('wis_models')
      .upsert(unimogModels, { onConflict: 'model_id' });
    
    if (modelError) {
      console.log('⚠️  Model upload error:', modelError.message);
    } else {
      console.log(`✅ Uploaded ${unimogModels.length} models`);
      totalUploaded += unimogModels.length;
    }

    // Upload procedures
    console.log('🔧 Uploading maintenance procedures...');
    const { data: procData, error: procError } = await supabase
      .from('wis_procedures')
      .upsert(procedures, { onConflict: 'procedure_id' });
    
    if (procError) {
      console.log('⚠️  Procedure upload error:', procError.message);
    } else {
      console.log(`✅ Uploaded ${procedures.length} procedures`);
      totalUploaded += procedures.length;
    }

    // Upload parts
    console.log('🔩 Uploading parts catalog...');
    const { data: partsData, error: partsError } = await supabase
      .from('wis_parts')
      .upsert(parts, { onConflict: 'part_number' });
    
    if (partsError) {
      console.log('⚠️  Parts upload error:', partsError.message);
    } else {
      console.log(`✅ Uploaded ${parts.length} parts`);
      totalUploaded += parts.length;
    }

    // Upload bulletins
    console.log('📢 Uploading service bulletins...');
    const { data: bulletinData, error: bulletinError } = await supabase
      .from('wis_bulletins')
      .upsert(bulletins, { onConflict: 'bulletin_id' });
    
    if (bulletinError) {
      console.log('⚠️  Bulletin upload error:', bulletinError.message);
    } else {
      console.log(`✅ Uploaded ${bulletins.length} bulletins`);
      totalUploaded += bulletins.length;
    }

    console.log('\n🎉 Sample Data Upload Complete!');
    console.log(`📊 Total items uploaded: ${totalUploaded}`);
    console.log('\n🔗 Your WIS system is now ready at:');
    console.log('   http://localhost:5173/knowledge/wis-epc');
    console.log('\n🔍 Try searching for:');
    console.log('   - "oil change"');
    console.log('   - "portal axle"');
    console.log('   - "differential lock"');
    console.log('   - "hydraulic"');

  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

// Run the upload
uploadSampleData().catch(console.error);