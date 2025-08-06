#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample Unimog models
const unimogModels = [
  { code: 'U1300L', name: 'Unimog U1300L', yearFrom: 1976, yearTo: 1989 },
  { code: 'U1700', name: 'Unimog U1700', yearFrom: 1988, yearTo: 2000 },
  { code: 'U4000', name: 'Unimog U4000', yearFrom: 2000, yearTo: 2013 },
  { code: 'U5000', name: 'Unimog U5000', yearFrom: 2002, yearTo: 2013 },
  { code: 'U5023', name: 'Unimog U5023', yearFrom: 2013, yearTo: 2023 },
];

// Sample procedures
const sampleProcedures = [
  {
    procedure_code: 'ENGINE-001',
    title: 'Engine Oil and Filter Change',
    model: 'U1300L',
    system: 'Engine',
    subsystem: 'Lubrication',
    content: `
<h2>Engine Oil and Filter Change Procedure</h2>
<p>This procedure covers the complete oil and filter change for the OM352 engine in the Unimog U1300L.</p>

<h3>Safety Warnings</h3>
<ul>
  <li>Ensure engine is warm but not hot (60-80°C)</li>
  <li>Use proper PPE including gloves and safety glasses</li>
  <li>Dispose of used oil properly</li>
</ul>

<h3>Required Tools</h3>
<ul>
  <li>27mm socket for drain plug</li>
  <li>Oil filter wrench</li>
  <li>Oil drain pan (min 15L capacity)</li>
  <li>New drain plug gasket</li>
</ul>

<h3>Procedure</h3>
<ol>
  <li>Position vehicle on level ground</li>
  <li>Warm engine to operating temperature</li>
  <li>Turn off engine and wait 5 minutes</li>
  <li>Place drain pan under oil pan</li>
  <li>Remove drain plug and allow oil to drain completely</li>
  <li>Remove old oil filter</li>
  <li>Clean filter mounting surface</li>
  <li>Apply clean oil to new filter gasket</li>
  <li>Install new filter (hand tight plus 3/4 turn)</li>
  <li>Install drain plug with new gasket (torque: 60 Nm)</li>
  <li>Add new oil through filler cap</li>
  <li>Start engine and check for leaks</li>
  <li>Check oil level after engine cools</li>
</ol>
    `,
    steps: [
      { step: 1, description: 'Position vehicle on level ground', timeMinutes: 5 },
      { step: 2, description: 'Warm engine to operating temperature', timeMinutes: 10 },
      { step: 3, description: 'Turn off engine and wait 5 minutes', timeMinutes: 5 },
      { step: 4, description: 'Drain old oil', timeMinutes: 15 },
      { step: 5, description: 'Replace oil filter', timeMinutes: 10 },
      { step: 6, description: 'Add new oil', timeMinutes: 10 },
      { step: 7, description: 'Start engine and check', timeMinutes: 5 },
    ],
    tools_required: ['27mm socket', 'Oil filter wrench', 'Oil drain pan', 'Torque wrench'],
    parts_required: ['A0001802609', 'A0001800109'],
    safety_warnings: ['Hot oil hazard', 'Proper disposal required', 'Use PPE'],
    time_estimate: 60,
    difficulty: 'easy'
  },
  {
    procedure_code: 'TRANS-001',
    title: 'Manual Transmission Fluid Change',
    model: 'U1300L',
    system: 'Transmission',
    subsystem: 'Maintenance',
    content: `<h2>Manual Transmission Fluid Change</h2><p>Complete procedure for changing transmission fluid in UG3/40 gearbox.</p>`,
    steps: [
      { step: 1, description: 'Warm transmission to operating temperature', timeMinutes: 15 },
      { step: 2, description: 'Remove fill and drain plugs', timeMinutes: 10 },
      { step: 3, description: 'Drain old fluid completely', timeMinutes: 20 },
      { step: 4, description: 'Install drain plug', timeMinutes: 5 },
      { step: 5, description: 'Fill with new fluid to level', timeMinutes: 15 },
    ],
    tools_required: ['24mm hex socket', 'Fluid pump', 'Drain pan'],
    parts_required: ['A0019897803'],
    safety_warnings: ['Hot fluid hazard', 'Use proper PPE'],
    time_estimate: 65,
    difficulty: 'medium'
  },
  {
    procedure_code: 'BRAKE-001',
    title: 'Front Brake Pad Replacement',
    model: 'U1700',
    system: 'Brakes',
    subsystem: 'Front Axle',
    content: `<h2>Front Brake Pad Replacement</h2><p>Step-by-step guide for replacing front brake pads on U1700.</p>`,
    steps: [
      { step: 1, description: 'Secure vehicle and remove wheels', timeMinutes: 20 },
      { step: 2, description: 'Remove caliper bolts', timeMinutes: 10 },
      { step: 3, description: 'Remove old pads and hardware', timeMinutes: 10 },
      { step: 4, description: 'Compress caliper piston', timeMinutes: 10 },
      { step: 5, description: 'Install new pads and hardware', timeMinutes: 15 },
      { step: 6, description: 'Reinstall caliper and wheels', timeMinutes: 20 },
      { step: 7, description: 'Bed in new pads', timeMinutes: 15 },
    ],
    tools_required: ['19mm socket', '22mm socket', 'Caliper piston tool', 'Torque wrench'],
    parts_required: ['A0034201220', 'A0034201020'],
    safety_warnings: ['Support vehicle properly', 'Brake dust hazard', 'Test brakes before driving'],
    time_estimate: 100,
    difficulty: 'medium'
  }
];

// Sample parts
const sampleParts = [
  {
    part_number: 'A0001802609',
    description: 'Oil Filter - OM352/OM366 Engine',
    category: 'Engine',
    models: ['U1300L', 'U1700', 'U4000'],
    price: 24.50,
    availability: 'In Stock',
    specifications: {
      type: 'Spin-on filter',
      thread: 'M27x2',
      height: '145mm',
      diameter: '93mm',
      manufacturer: 'Mann Filter'
    }
  },
  {
    part_number: 'A0001800109',
    description: 'Drain Plug Gasket - Copper',
    category: 'Engine',
    models: ['U1300L', 'U1700', 'U4000', 'U5000'],
    price: 2.80,
    availability: 'In Stock',
    specifications: {
      innerDiameter: '28mm',
      outerDiameter: '34mm',
      thickness: '2mm',
      material: 'Copper'
    }
  },
  {
    part_number: 'A0034201220',
    description: 'Front Brake Pad Set - Heavy Duty',
    category: 'Brakes',
    models: ['U1700', 'U4000'],
    price: 185.00,
    availability: 'In Stock',
    specifications: {
      width: '180mm',
      height: '75mm',
      thickness: '20mm',
      wearIndicator: true
    }
  },
  {
    part_number: 'A0019897803',
    description: 'Manual Transmission Fluid - MB 235.1',
    category: 'Transmission',
    models: ['U1300L', 'U1700', 'U4000', 'U5000', 'U5023'],
    price: 28.90,
    availability: 'In Stock',
    specifications: {
      viscosity: '80W-90',
      specification: 'MB 235.1',
      volume: '1L',
      type: 'Mineral'
    }
  }
];

// Sample bulletins
const sampleBulletins = [
  {
    bulletin_number: 'TSB-2023-001',
    title: 'Updated Torque Specifications for Engine Mounts',
    models_affected: ['U4000', 'U5000', 'U5023'],
    issue_date: '2023-03-15',
    category: 'Engine',
    content: 'New torque specifications for engine mount bolts to prevent loosening.',
    priority: 'recommended'
  },
  {
    bulletin_number: 'RECALL-2022-003',
    title: 'Brake Line Inspection Required',
    models_affected: ['U5023'],
    issue_date: '2022-11-20',
    category: 'Brakes',
    content: 'Mandatory inspection of brake lines for vehicles manufactured between 2020-2022.',
    priority: 'mandatory'
  }
];

async function seedSampleData() {
  console.log('🌱 Seeding WIS EPC sample data...\n');
  
  try {
    // Insert models
    console.log('📋 Inserting Unimog models...');
    for (const model of unimogModels) {
      const { error } = await supabase
        .from('wis_models')
        .upsert({
          model_code: model.code,
          model_name: model.name,
          year_from: model.yearFrom,
          year_to: model.yearTo,
          specifications: {
            engineOptions: ['OM352', 'OM366'],
            transmissionOptions: ['UG3/40', 'UG3/65'],
            axleOptions: ['Portal axles', 'Planetary hubs']
          }
        }, { onConflict: 'model_code' });
      
      if (error) {
        console.error(`❌ Error inserting model ${model.code}:`, error.message);
      } else {
        console.log(`✅ ${model.name}`);
      }
    }
    
    // Insert procedures
    console.log('\n📋 Inserting procedures...');
    for (const procedure of sampleProcedures) {
      const { error } = await supabase
        .from('wis_procedures')
        .upsert(procedure, { onConflict: 'procedure_code' });
      
      if (error) {
        console.error(`❌ Error inserting procedure ${procedure.procedure_code}:`, error.message);
      } else {
        console.log(`✅ ${procedure.title}`);
      }
    }
    
    // Insert parts
    console.log('\n📋 Inserting parts...');
    for (const part of sampleParts) {
      const { error } = await supabase
        .from('wis_parts')
        .upsert(part, { onConflict: 'part_number' });
      
      if (error) {
        console.error(`❌ Error inserting part ${part.part_number}:`, error.message);
      } else {
        console.log(`✅ ${part.description}`);
      }
    }
    
    // Insert bulletins
    console.log('\n📋 Inserting technical bulletins...');
    for (const bulletin of sampleBulletins) {
      const { error } = await supabase
        .from('wis_bulletins')
        .upsert(bulletin, { onConflict: 'bulletin_number' });
      
      if (error) {
        console.error(`❌ Error inserting bulletin ${bulletin.bulletin_number}:`, error.message);
      } else {
        console.log(`✅ ${bulletin.title}`);
      }
    }
    
    // Test search function
    console.log('\n🔍 Testing search function...');
    const { data: searchResults, error: searchError } = await supabase
      .rpc('search_wis_content', { search_query: 'oil' });
    
    if (searchError) {
      console.error('❌ Search function error:', searchError.message);
    } else {
      console.log(`✅ Search found ${searchResults?.length || 0} results for "oil"`);
    }
    
    console.log('\n✅ Sample data seeding complete!');
    console.log('\n📌 Next steps:');
    console.log('1. Run npm run dev to test the new WIS content viewer');
    console.log('2. Visit /knowledge/wis-epc to see the interface');
    console.log('3. Search for "oil", "brake", or "transmission" to test');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

seedSampleData();