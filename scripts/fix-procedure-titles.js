#!/usr/bin/env node
/**
 * Fix Procedure Titles - Replace generic/code-based titles with descriptive ones
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Title mappings based on procedure codes and systems
const TITLE_MAPPINGS = {
  // General Information (00)
  'SI00.00': 'General Service Information',
  'SI00.01': 'Vehicle Identification',
  'SI00.20': 'Technical Specifications',

  // Maintenance (01)
  'SI01.00': 'Scheduled Maintenance',

  // Engine (03, 05, 07)
  'SI03.00': 'Engine Mechanical Service',
  'SI05.00': 'Fuel System Service',
  'SI07.00': 'Exhaust System Service',

  // Transmission (09)
  'SI09.00': 'Transmission Service',

  // Cooling (13)
  'SI13.00': 'Cooling System Service',

  // Suspension (14)
  'SI14.40': 'Suspension System Service',

  // Steering (15)
  'SI15.00': 'Steering System Service',

  // Power Train (18)
  'SI18.00': 'Power Train Service',

  // Front Axle (20)
  'SI20.00': 'Front Axle Service',

  // Wheels (22)
  'SI22.00': 'Wheel and Tire Service',

  // Propeller Shaft (25)
  'SI25.00': 'Propeller Shaft Service',

  // Transfer Case (26)
  'SI26.00': 'Transfer Case Service',

  // Rear Axle (27)
  'SI27.00': 'Rear Axle Service',

  // Portal Axle (29)
  'SI29.00': 'Portal Axle Service',

  // Instruments (30)
  'SI30.00': 'Instrument Cluster Service',

  // Lighting (35)
  'SI35.00': 'Lighting System Service',

  // Frame/Body (40)
  'SI40.00': 'Frame and Body Service',

  // Doors (42)
  'SI42.00': 'Door and Hatch Service',

  // HVAC (46)
  'SI46.00': 'Heating and AC Service',

  // Hydraulics (49)
  'SI49.00': 'Hydraulic System Service',

  // Seats (54)
  'SI54.10': 'Seat Adjustment and Repair',

  // Special Tools (58)
  'SI58.00': 'Special Tools Guide',

  // Cab Mounting (60)
  'SI60.00': 'Cab Mounting Service',

  // Platform Body (62)
  'SI62.00': 'Platform Body Service',

  // PTO (82)
  'SI82.00': 'Power Take-Off Service',

  // Winch (83)
  'SI83.00': 'Winch System Service',

  // System 99 (special)
  'SI99.00': 'Technical Bulletins and Updates',

  // System 67
  'SI67.00': 'Electrical Systems Service'
};

async function fixTitles() {
  console.log('Fixing Procedure Titles');
  console.log('='.repeat(50));
  console.log('');

  const { data: procs } = await supabase
    .from('wis_procedures')
    .select('id, procedure_code, title')
    .order('procedure_code');

  let fixed = 0;

  for (const proc of procs) {
    // Check if title needs fixing
    const needsFix =
      !proc.title ||
      proc.title === proc.procedure_code ||
      proc.title.match(/^SI\d{2}\.\d{2}/) ||
      proc.title === 'Untitled Procedure' ||
      proc.title === 'Unimog Service Procedure';

    if (!needsFix) continue;

    // Find matching title
    let newTitle = null;
    const codePrefix = proc.procedure_code.substring(0, 7); // e.g., "SI00.00"

    if (TITLE_MAPPINGS[codePrefix]) {
      newTitle = TITLE_MAPPINGS[codePrefix];
    } else {
      // Try to infer from system code
      const sysCode = proc.procedure_code.substring(2, 4);
      const systemNames = {
        '00': 'General Information',
        '01': 'Maintenance',
        '03': 'Engine Mechanical',
        '05': 'Fuel System',
        '07': 'Exhaust System',
        '09': 'Transmission',
        '13': 'Cooling System',
        '14': 'Suspension',
        '15': 'Steering',
        '18': 'Power Train',
        '20': 'Front Axle',
        '22': 'Wheels and Tires',
        '25': 'Propeller Shaft',
        '26': 'Transfer Case',
        '27': 'Rear Axle',
        '28': 'Differential Lock',
        '29': 'Portal Axle',
        '30': 'Instruments',
        '35': 'Lighting',
        '40': 'Frame/Body',
        '42': 'Doors/Hatches',
        '46': 'Heating/AC',
        '49': 'Hydraulics',
        '54': 'Seats',
        '58': 'Special Tools',
        '60': 'Cab Mounting',
        '62': 'Platform Body',
        '67': 'Electrical Systems',
        '82': 'Power Take-Off',
        '83': 'Winch',
        '99': 'Technical Bulletins'
      };

      if (systemNames[sysCode]) {
        newTitle = `${systemNames[sysCode]} - Service Procedure`;
      } else {
        newTitle = `Service Procedure ${proc.procedure_code}`;
      }
    }

    console.log(`${proc.procedure_code}: "${proc.title}" -> "${newTitle}"`);

    const { error } = await supabase
      .from('wis_procedures')
      .update({ title: newTitle })
      .eq('id', proc.id);

    if (error) {
      console.log(`  Error: ${error.message}`);
    } else {
      fixed++;
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log(`Fixed ${fixed} procedure titles`);
  console.log('');
}

fixTitles().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
