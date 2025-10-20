/**
 * Quick test: Verify Phase 8 script correctly distinguishes fuel pump vs fuel tank
 *
 * Tests pages 165 (DA - FUEL TANK) and 171 (DEA - FUEL PUMP)
 * to ensure content field has distinctive text.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface GroupMapping {
  group_code: string;
  name: string;
  illustration_pages: number[];
  parts_list_pages: number[];
  callout_range: string;
}

interface MappingFile {
  groups: { [key: string]: GroupMapping };
}

// Load Phase 6 mapping
function loadMapping(): MappingFile {
  const mappingPath = path.join(__dirname, 'output', 'RPS_GROUP_TO_PAGES_COMPLETE.json');
  const rawData = fs.readFileSync(mappingPath, 'utf-8');
  return JSON.parse(rawData);
}

async function main() {
  console.log('='.repeat(70));
  console.log('TEST: Fuel Pump vs Fuel Tank Distinction');
  console.log('='.repeat(70));
  console.log('');

  const mapping = loadMapping();

  // Find DA and DEA groups
  const DA = mapping.groups['DA'];
  const DEA = mapping.groups['DEA'];

  console.log('Phase 6 Mapping Data:');
  console.log(`  DA (page 165): "${DA.name}"`);
  console.log(`  DEA (page 171): "${DEA.name}"`);
  console.log('');

  // Check current database state
  console.log('Current database state:');
  const { data, error } = await supabase
    .from('manual_chunks')
    .select('page_number, section_title, content, extraction_method')
    .eq('manual_title', 'RPS Catalog')
    .in('page_number', [165, 171])
    .order('page_number');

  if (error) {
    console.error('Database error:', error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('No entries found for pages 165 and 171');
  } else {
    for (const row of data) {
      console.log(`  Page ${row.page_number}:`);
      console.log(`    Section: ${row.section_title}`);
      console.log(`    Content: "${row.content.substring(0, 100)}..."`);
      console.log(`    Method: ${row.extraction_method || 'unknown'}`);
      console.log('');
    }
  }

  // Analysis
  console.log('='.repeat(70));
  console.log('ANALYSIS');
  console.log('='.repeat(70));
  console.log('');

  if (data && data.length === 2) {
    const page165 = data.find(r => r.page_number === 165);
    const page171 = data.find(r => r.page_number === 171);

    if (page165 && page171) {
      const content165 = page165.content.toLowerCase();
      const content171 = page171.content.toLowerCase();

      console.log('Content comparison:');
      console.log(`  Page 165 contains "tank": ${content165.includes('tank')}`);
      console.log(`  Page 165 contains "pump": ${content165.includes('pump')}`);
      console.log(`  Page 171 contains "tank": ${content171.includes('tank')}`);
      console.log(`  Page 171 contains "pump": ${content171.includes('pump')}`);
      console.log('');

      const areDifferent = page165.content !== page171.content;
      const correctLabels =
        content165.includes('tank') && !content165.includes('pump') &&
        content171.includes('pump') && !content171.includes('tank');

      if (areDifferent && correctLabels) {
        console.log('✓ SUCCESS: Pages have distinctive content');
        console.log('  - Page 165 clearly labeled as FUEL TANK');
        console.log('  - Page 171 clearly labeled as FUEL PUMP');
        console.log('  - Content is different between pages');
        console.log('  - Barry should be able to distinguish them');
      } else {
        console.log('✗ PROBLEM: Pages still have issues');
        if (!areDifferent) {
          console.log('  - Content is identical (templated)');
        }
        if (!correctLabels) {
          console.log('  - Labels are incorrect or ambiguous');
        }
        console.log('  - Phase 8 script needs to run');
      }
    }
  }

  console.log('');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
