#!/usr/bin/env node

/**
 * Import WIS data to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function importWISData() {
  console.log('Starting WIS data import to Supabase...\n');

  // Sample procedures
  const procedures = [
    {
      title: 'Remove front axle differential',
      content: 'Remove the front axle differential assembly. Drain oil before removal.',
      procedure_type: 'repair'
    },
    {
      title: 'Install portal hub reduction gear',
      content: 'Install the portal hub reduction gear assembly. Fill with specified oil after installation.',
      procedure_type: 'repair'
    },
    {
      title: 'Check transmission oil level',
      content: 'Check the transmission oil level with engine running and transmission at operating temperature.',
      procedure_type: 'repair'
    },
    {
      title: 'Replace transfer case chain',
      content: 'Replace the transfer case drive chain. Check for wear on sprockets.',
      procedure_type: 'repair'
    },
    {
      title: 'Adjust differential lock cable',
      content: 'Adjust the differential lock cable for proper engagement and disengagement.',
      procedure_type: 'repair'
    },
    {
      title: 'Test hydraulic pump pressure',
      content: 'Test the hydraulic pump pressure at specified RPM ranges.',
      procedure_type: 'repair'
    },
    {
      title: 'Repair power take-off unit',
      content: 'Repair or replace the power take-off unit components as needed.',
      procedure_type: 'repair'
    },
    {
      title: 'Install winch control valve',
      content: 'Install the hydraulic winch control valve and connect hydraulic lines.',
      procedure_type: 'repair'
    },
    {
      title: 'Check portal axle oil seals',
      content: 'Check portal axle oil seals for leaks and replace if necessary.',
      procedure_type: 'repair'
    },
    {
      title: 'Replace torque converter',
      content: 'Remove and replace the torque converter assembly.',
      procedure_type: 'repair'
    }
  ];

  // Sample parts (from extraction)
  const parts = [
    { part_number: 'A906 470 31 94', description: 'Differential seal' },
    { part_number: 'A901 325 09 47', description: 'Portal hub bearing' },
    { part_number: 'A009 545 41 07', description: 'Lift cylinder seal kit' },
    { part_number: 'A221 820 17 56', description: 'Transfer case sprocket' },
    { part_number: 'A221 250 38 02', description: 'CDB converter module' },
    { part_number: 'A408 600 04 16', description: 'Right rear axle shaft' },
    { part_number: 'A218 820 13 00', description: 'DAB+ radio module' },
    { part_number: 'A001 982 56 08', description: 'Hydraulic pump seal' },
    { part_number: 'A484 600 92 16', description: 'Front drive shaft' },
    { part_number: 'A166 460 89 03', description: 'Transmission filter' }
  ];

  // Sample bulletins
  const bulletins = [
    { content: 'Service Bulletin 2024-01: Portal axle seal replacement procedure updated' },
    { content: 'Service Bulletin 2024-02: New torque specifications for differential housing bolts' },
    { content: 'Service Bulletin 2024-03: Transfer case chain tensioner adjustment procedure' },
    { content: 'Service Bulletin 2024-04: Hydraulic pump pressure test specifications revised' },
    { content: 'Service Bulletin 2024-05: Power steering fluid recommendation change' }
  ];

  try {
    // Import procedures
    console.log('Importing procedures...');
    const { data: procData, error: procError } = await supabase
      .from('wis_procedures')
      .upsert(procedures, { onConflict: 'title' });
    
    if (procError) {
      console.error('Error importing procedures:', procError);
    } else {
      console.log(`✅ Imported ${procedures.length} procedures`);
    }

    // Import parts
    console.log('Importing parts...');
    const { data: partData, error: partError } = await supabase
      .from('wis_parts')
      .upsert(parts, { onConflict: 'part_number' });
    
    if (partError) {
      console.error('Error importing parts:', partError);
    } else {
      console.log(`✅ Imported ${parts.length} parts`);
    }

    // Import bulletins
    console.log('Importing bulletins...');
    const { data: bulletinData, error: bulletinError } = await supabase
      .from('wis_bulletins')
      .insert(bulletins);
    
    if (bulletinError) {
      console.error('Error importing bulletins:', bulletinError);
    } else {
      console.log(`✅ Imported ${bulletins.length} bulletins`);
    }

    console.log('\n🎉 WIS data import complete!');
    console.log('You can now test the data at: /knowledge/wis-epc');

  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Run import
importWISData();