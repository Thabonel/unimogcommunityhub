/**
 * Fix RPS Illustration Descriptions
 *
 * Re-populates rps_illustrations table with correct descriptions and image URLs
 * based on the Phase 6 complete mapping data.
 *
 * Problem: Current rps_illustrations has wrong AI-generated descriptions
 * Solution: Use group names + page numbers to generate accurate descriptions
 *
 * Usage:
 *   export VITE_SUPABASE_URL="https://ydevatqwkoccxhtejdor.supabase.co"
 *   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
 *   npx tsx scripts/rps/fix-illustration-descriptions.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL or SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface GroupMapping {
  group_code: string;
  name: string;
  illustration_pages: number[];
  parts_list_pages: number[];
  callout_range: string;
  page_type: string;
  status: string;
}

interface MappingFile {
  metadata: {
    total_groups: number;
    total_pages_mapped: number;
  };
  groups: {
    [key: string]: GroupMapping;
  };
}

// Read Phase 6 mapping data
function loadMappingData(): MappingFile {
  const mappingPath = path.join(__dirname, 'output', 'RPS_GROUP_TO_PAGES_COMPLETE.json');

  if (!fs.existsSync(mappingPath)) {
    throw new Error(`Mapping file not found: ${mappingPath}`);
  }

  const rawData = fs.readFileSync(mappingPath, 'utf-8');
  return JSON.parse(rawData) as MappingFile;
}

// Generate callout array from range string
function generateCallouts(calloutRange: string): string[] {
  // Examples: "1-31", "Sheet 1: 1-24, Sheet 2: 25-50", "28-48"
  const callouts: string[] = [];

  // Extract all number ranges
  const rangeMatches = calloutRange.matchAll(/(\d+)-(\d+)/g);

  for (const match of rangeMatches) {
    const start = parseInt(match[1]);
    const end = parseInt(match[2]);

    for (let i = start; i <= end; i++) {
      callouts.push(i.toString());
    }
  }

  return callouts;
}

// Clear existing illustrations
async function clearExistingIllustrations(): Promise<void> {
  console.log('Clearing existing rps_illustrations...');

  const { error } = await supabase
    .from('rps_illustrations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    throw new Error(`Failed to clear illustrations: ${error.message}`);
  }

  console.log('Cleared existing illustrations');
}

// Insert illustrations for a group
async function insertIllustrationsForGroup(
  groupCode: string,
  groupData: GroupMapping
): Promise<number> {
  const { name, illustration_pages, callout_range } = groupData;

  let insertCount = 0;
  let sheetNum = 1;

  for (const pageNum of illustration_pages) {
    // Generate correct description
    const description = illustration_pages.length > 1
      ? `${name} - Sheet ${sheetNum} (Page ${pageNum})`
      : `${name} - Exploded view (Page ${pageNum})`;

    // Build image URL
    const paddedPage = pageNum.toString().padStart(4, '0');
    const imageUrl = `https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_illustrations/rps_page_${paddedPage}.png`;

    // Generate callouts
    const callouts = generateCallouts(callout_range);

    // Prepare figure number
    const figureNumber = illustration_pages.length > 1
      ? `${groupCode}-${sheetNum}`
      : `${groupCode}-1`;

    // Insert to database
    const { error } = await supabase
      .from('rps_illustrations')
      .insert({
        rps_number: '02155',
        group_code: groupCode,
        figure_number: figureNumber,
        description: description,
        page_number: pageNum,
        image_url: imageUrl,
        cdn_url: imageUrl,
        callouts: callouts,
        metadata: {
          sheet: sheetNum,
          total_sheets: illustration_pages.length,
          source: 'Phase 6 complete mapping',
          generated_at: new Date().toISOString()
        }
      });

    if (error) {
      console.error(`  Failed to insert ${groupCode} page ${pageNum}: ${error.message}`);
    } else {
      insertCount++;
    }

    sheetNum++;
  }

  return insertCount;
}

// Main processing function
async function fixIllustrationDescriptions(): Promise<void> {
  console.log('='.repeat(70));
  console.log('FIX RPS ILLUSTRATION DESCRIPTIONS');
  console.log('='.repeat(70));
  console.log('');

  // Load mapping data
  console.log('Loading Phase 6 mapping data...');
  const mappingData = loadMappingData();
  const groupCount = Object.keys(mappingData.groups).length;
  console.log(`Loaded ${groupCount} groups`);
  console.log('');

  // Calculate total illustrations
  let totalIllustrations = 0;
  for (const groupData of Object.values(mappingData.groups)) {
    totalIllustrations += groupData.illustration_pages.length;
  }
  console.log(`Expected total illustrations: ${totalIllustrations}`);
  console.log('');

  // Clear existing data
  await clearExistingIllustrations();
  console.log('');

  // Process each group
  console.log('Inserting illustrations with correct descriptions...');
  console.log('');

  let processedGroups = 0;
  let totalInserted = 0;

  for (const [groupCode, groupData] of Object.entries(mappingData.groups)) {
    const illCount = groupData.illustration_pages.length;
    console.log(`[${processedGroups + 1}/${groupCount}] ${groupCode}: ${groupData.name}`);
    console.log(`  Illustrations: ${illCount} pages - ${groupData.illustration_pages.join(', ')}`);

    const inserted = await insertIllustrationsForGroup(groupCode, groupData);
    totalInserted += inserted;

    console.log(`  Inserted: ${inserted}/${illCount}`);
    console.log('');

    processedGroups++;
  }

  // Summary
  console.log('='.repeat(70));
  console.log('PROCESSING COMPLETE');
  console.log('='.repeat(70));
  console.log(`Total groups processed: ${processedGroups}/${groupCount}`);
  console.log(`Total illustrations inserted: ${totalInserted}/${totalIllustrations}`);
  console.log('');

  if (totalInserted === totalIllustrations) {
    console.log('SUCCESS: All illustrations inserted correctly!');
  } else {
    console.log(`WARNING: Expected ${totalIllustrations} but inserted ${totalInserted}`);
  }
  console.log('');
}

// Run the script
fixIllustrationDescriptions()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
