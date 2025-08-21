#!/usr/bin/env node

/**
 * Create simple Unimog sample data matching the actual schema
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🚜 Creating Simple Unimog Sample Data...\n');

const unimogModels = [
  { model_code: 'U300', model_name: 'Unimog U300', year_from: 1995, year_to: 2000, engine_type: 'OM364', series: 'U300' },
  { model_code: 'U400', model_name: 'Unimog U400', year_from: 2000, year_to: 2013, engine_type: 'OM924', series: 'U400' },
  { model_code: 'U500', model_name: 'Unimog U500', year_from: 2013, year_to: 2025, engine_type: 'OM924', series: 'U500' },
  { model_code: 'U1300', model_name: 'Unimog U1300', year_from: 1980, year_to: 2006, engine_type: 'OM366', series: 'U1300' },
  { model_code: 'U1700', model_name: 'Unimog U1700', year_from: 1990, year_to: 2006, engine_type: 'OM366', series: 'U1700' }
];

const procedures = [
  {
    procedure_id: 'PROC_001',
    title: 'Engine Oil Change - OM366 Engine',
    category: 'Engine',
    model_codes: ['U1300', 'U1700'],
    version: '1.0',
    content: `PROCEDURE: Engine Oil Change - OM366

TOOLS REQUIRED:
- 19mm socket wrench
- Oil filter wrench  
- Oil drain pan (12L capacity)
- Funnel

MATERIALS:
- Engine oil: 10W-40 (11 liters)
- Oil filter: Mercedes part #0001802609
- Drain plug gasket: A0009831435

PROCEDURE:
1. Position drain pan under drain plug
2. Remove drain plug with 19mm socket
3. Allow oil to drain completely (15-20 minutes)
4. Replace gasket and reinstall plug (45 Nm)
5. Remove old oil filter with filter wrench
6. Apply thin oil layer to new filter gasket
7. Install new filter hand-tight plus 3/4 turn
8. Add 10 liters new oil through filler cap
9. Start engine and check for leaks
10. Check oil level after engine cools
11. Top up to maximum mark if needed`
  },
  {
    procedure_id: 'PROC_002',
    title: 'Portal Axle Oil Change',
    category: 'Drivetrain',
    model_codes: ['U300', 'U400', 'U500'],
    version: '1.0',
    content: `PROCEDURE: Portal Axle Oil Change

TOOLS REQUIRED:
- 17mm hex socket
- 14mm hex socket
- Oil drain pan
- Funnel

MATERIALS:
- SAE 90 gear oil (2L per axle)
- New drain plug gaskets

PROCEDURE:
1. Drive vehicle to warm gear oil
2. Position on level surface
3. Remove drain plugs (17mm hex)
4. Allow oil to drain completely
5. Install new gaskets on drain plugs
6. Reinstall drain plugs (25 Nm)
7. Remove fill plugs (14mm hex)
8. Fill with SAE 90 oil until level with fill hole
9. Reinstall fill plugs (20 Nm)
10. Test drive and recheck levels

CAPACITY:
- Front portals: 0.8L each
- Rear portals: 1.2L each`
  },
  {
    procedure_id: 'PROC_003',
    title: 'Differential Lock System Check',
    category: 'Drivetrain',
    model_codes: ['U400', 'U500', 'U1300', 'U1700'],
    version: '1.0',
    content: `PROCEDURE: Differential Lock System Check

TOOLS REQUIRED:
- Multimeter
- Pressure gauge (0-10 bar)

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

COMMON FAULTS:
- Air leaks at cylinder seals
- Faulty pressure switches
- Corroded electrical connections`
  }
];

const parts = [
  {
    part_number: '0001802609',
    description: 'Engine Oil Filter - OM366 Engine',
    model_codes: ['U1300', 'U1700'],
    price: 45.50,
    availability: 'In Stock'
  },
  {
    part_number: 'A0009831435', 
    description: 'Drain Plug Gasket - Copper',
    model_codes: ['U300', 'U400', 'U500', 'U1300', 'U1700'],
    price: 2.50,
    availability: 'In Stock'
  },
  {
    part_number: '3052601981',
    description: 'Portal Axle Pinion Seal',
    model_codes: ['U300', 'U400', 'U500'],
    price: 28.75,
    availability: 'In Stock'
  },
  {
    part_number: '0014606618',
    description: 'Differential Lock Pressure Switch',
    model_codes: ['U400', 'U500', 'U1300', 'U1700'],
    price: 125.00,
    availability: 'Limited'
  }
];

const bulletins = [
  {
    bulletin_number: 'TSB-2024-001',
    title: 'Portal Axle Oil Seal Improvement',
    model_codes: ['U400', 'U500'],
    issue_date: '2024-01-15',
    priority: 'Medium',
    content: 'Updated portal axle oil seals with improved design to prevent leakage. Affects all U400/U500 models built before 2020. New part number 3052601981 supersedes previous versions.'
  },
  {
    bulletin_number: 'TSB-2024-002',
    title: 'Engine Oil Specification Update',
    model_codes: ['U1300', 'U1700'],
    issue_date: '2024-03-10',
    priority: 'Low',
    content: 'Updated engine oil specification for OM366 engines. New specification allows use of 5W-40 synthetic oil in addition to existing 10W-40 mineral oil.'
  },
  {
    bulletin_number: 'TSB-2024-003',
    title: 'Differential Lock Diagnostic Update',
    model_codes: ['U400', 'U500', 'U1300', 'U1700'],
    issue_date: '2024-05-20',
    priority: 'High', 
    content: 'Updated diagnostic procedure for intermittent differential lock faults. Includes new test sequences and fault code interpretation.'
  }
];

async function uploadSampleData() {
  let totalUploaded = 0;
  
  try {
    // Upload models
    console.log('📋 Uploading Unimog models...');
    const { error: modelError } = await supabase
      .from('wis_models')
      .upsert(unimogModels, { onConflict: 'model_code' });
    
    if (modelError) {
      console.log('⚠️  Model upload error:', modelError.message);
    } else {
      console.log(`✅ Uploaded ${unimogModels.length} models`);
      totalUploaded += unimogModels.length;
    }

    // Upload procedures  
    console.log('🔧 Uploading maintenance procedures...');
    const { error: procError } = await supabase
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
    const { error: partsError } = await supabase
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
    const { error: bulletinError } = await supabase
      .from('wis_bulletins')
      .upsert(bulletins, { onConflict: 'bulletin_number' });
    
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
    console.log('   - "U1300"');

  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

uploadSampleData().catch(console.error);