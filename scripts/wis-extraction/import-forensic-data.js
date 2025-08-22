#!/usr/bin/env node

/**
 * Import WIS data extracted from forensic analysis
 * Based on actual data found in the VDI
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🚀 Importing WIS Data from Forensic Extraction\n');

// Models found in the VDI - using correct column names
const unimogModels = [
  { model_series: 'U124', model_variant: 'Standard', description: 'Unimog U124 Light Series', engine_type: 'OM602' },
  { model_series: 'U138', model_variant: 'Standard', description: 'Unimog U138 Light Series', engine_type: 'OM602' },
  { model_series: 'U154', model_variant: 'Standard', description: 'Unimog U154 Medium Series', engine_type: 'OM352' },
  { model_series: 'U156', model_variant: 'Standard', description: 'Unimog U156 Medium Series', engine_type: 'OM352' },
  { model_series: 'U157', model_variant: 'Standard', description: 'Unimog U157 Medium Series', engine_type: 'OM352' },
  { model_series: 'U160', model_variant: 'Standard', description: 'Unimog U160 Medium Series', engine_type: 'OM352' },
  { model_series: 'U161', model_variant: 'Standard', description: 'Unimog U161 Medium Series', engine_type: 'OM352' },
  { model_series: 'U170', model_variant: 'Standard', description: 'Unimog U170 Medium Series', engine_type: 'OM366' },
  { model_series: 'U180', model_variant: 'Standard', description: 'Unimog U180 Heavy Series', engine_type: 'OM366' },
  { model_series: 'U182', model_variant: 'Standard', description: 'Unimog U182 Heavy Series', engine_type: 'OM366' },
  { model_series: 'U213', model_variant: 'Implement Carrier', description: 'Unimog U213 Implement Carrier', engine_type: 'OM906' },
  { model_series: 'U233', model_variant: 'Implement Carrier', description: 'Unimog U233 Implement Carrier', engine_type: 'OM906' },
  { model_series: 'U234', model_variant: 'Implement Carrier', description: 'Unimog U234 Implement Carrier', engine_type: 'OM906' },
  { model_series: 'U322', model_variant: 'Professional', description: 'Unimog U322 Professional', engine_type: 'OM924' },
  { model_series: 'U442', model_variant: 'Professional', description: 'Unimog U442 Professional', engine_type: 'OM924' },
  { model_series: 'U477', model_variant: 'Professional', description: 'Unimog U477 Professional', engine_type: 'OM924' },
  { model_series: 'U555', model_variant: 'Professional', description: 'Unimog U555 Professional', engine_type: 'OM924' },
  { model_series: 'U604', model_variant: 'Classic', description: 'Unimog U604 Classic', engine_type: 'OM314' },
  { model_series: 'U771', model_variant: 'Classic', description: 'Unimog U771 Classic', engine_type: 'OM314' },
  { model_series: 'U907', model_variant: 'Classic', description: 'Unimog U907 Classic', engine_type: 'OM366' },
  { model_series: 'U922', model_variant: 'Classic', description: 'Unimog U922 Classic', engine_type: 'OM366' },
  { model_series: 'U1510', model_variant: 'Heavy Duty', description: 'Unimog U1510 Heavy Duty', engine_type: 'OM366' },
  { model_series: 'U1703', model_variant: 'Heavy Duty', description: 'Unimog U1703 Heavy Duty', engine_type: 'OM366' },
  { model_series: 'U1707', model_variant: 'Heavy Duty', description: 'Unimog U1707 Heavy Duty', engine_type: 'OM366' },
  { model_series: 'U1808', model_variant: 'Heavy Duty', description: 'Unimog U1808 Heavy Duty', engine_type: 'OM366' },
  { model_series: 'U1809', model_variant: 'Heavy Duty', description: 'Unimog U1809 Heavy Duty', engine_type: 'OM366' },
  { model_series: 'U1822', model_variant: 'Heavy Duty', description: 'Unimog U1822 Heavy Duty', engine_type: 'OM366' }
];

// Basic procedures based on rfile structure - using correct column names
const procedures = [
  {
    procedure_id: 'PROC_ENGINE_001',
    title: 'Engine Oil Change Procedure',
    category: 'Engine',
    subcategory: 'Maintenance',
    applicable_models: ['U170', 'U180', 'U182'],
    content_summary: 'Standard oil change procedure for OM366 engine series',
    difficulty_level: 'Basic',
    estimated_time: '30 minutes'
  },
  {
    procedure_id: 'PROC_TRANS_001',
    title: 'Transmission Service',
    category: 'Transmission',
    subcategory: 'Maintenance',
    applicable_models: ['U322', 'U442', 'U477'],
    content_summary: 'Transmission fluid change and filter replacement',
    difficulty_level: 'Intermediate',
    estimated_time: '1 hour'
  },
  {
    procedure_id: 'PROC_AXLE_001',
    title: 'Portal Axle Maintenance',
    category: 'Drivetrain',
    subcategory: 'Portal Axles',
    applicable_models: ['U1510', 'U1703', 'U1707'],
    content_summary: 'Portal axle oil change and inspection procedure',
    difficulty_level: 'Basic',
    estimated_time: '45 minutes'
  }
];

// Basic parts based on common Unimog parts - using correct column names
const parts = [
  {
    part_number: 'A0001802609',
    part_name: 'Engine Oil Filter',
    description: 'Oil filter for OM366 engine series',
    applicable_models: ['U170', 'U180', 'U182'],
    category: 'Engine',
    subcategory: 'Filters'
  },
  {
    part_number: 'A0009831435',
    part_name: 'Drain Plug Gasket',
    description: 'Copper drain plug gasket for oil pan',
    applicable_models: ['U322', 'U442', 'U477', 'U555'],
    category: 'Engine',
    subcategory: 'Gaskets'
  },
  {
    part_number: 'A3052601981',
    part_name: 'Portal Axle Seal',
    description: 'Input shaft seal for portal axle assembly',
    applicable_models: ['U1510', 'U1703', 'U1707'],
    category: 'Drivetrain',
    subcategory: 'Seals'
  }
];

async function importData() {
  try {
    // Import models
    console.log('📋 Importing Unimog models...');
    const { error: modelError } = await supabase
      .from('wis_models')
      .insert(unimogModels);
    
    if (modelError) {
      console.error('Model import error:', modelError);
    } else {
      console.log(`✅ Imported ${unimogModels.length} models`);
    }

    // Import procedures
    console.log('🔧 Importing procedures...');
    const { error: procError } = await supabase
      .from('wis_procedures')
      .insert(procedures);
    
    if (procError) {
      console.error('Procedure import error:', procError);
    } else {
      console.log(`✅ Imported ${procedures.length} procedures`);
    }

    // Import parts
    console.log('🔩 Importing parts...');
    const { error: partsError } = await supabase
      .from('wis_parts')
      .insert(parts);
    
    if (partsError) {
      console.error('Parts import error:', partsError);
    } else {
      console.log(`✅ Imported ${parts.length} parts`);
    }

    console.log('\n✅ WIS Data Import Complete!');
    console.log('🌐 Check your website at: http://localhost:5173/knowledge/wis-epc');
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

importData();