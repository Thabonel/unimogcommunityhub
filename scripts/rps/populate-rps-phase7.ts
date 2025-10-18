/**
 * Phase 7: Populate RPS database with comprehensive 930-page index
 *
 * This script reads the JSON index files and populates:
 * - rps_groups table with all 93 groups and their page ranges
 * - rps_illustrations table with page numbers and CDN URLs
 *
 * Source files:
 * - scripts/rps/output/RPS_GROUP_TO_PAGES_COMPLETE.json
 * - scripts/rps/output/RPS_930_MASTER_INDEX.json
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CDN base URL for RPS illustrations
const CDN_BASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_illustrations';

interface GroupData {
  group_code: string;
  name: string;
  illustration_pages: number[];
  parts_list_pages: number[];
  page_type: string;
  callout_range: string;
  status: string;
  shared_with_groups?: string[];
  note?: string;
}

async function loadGroupMappings(): Promise<Record<string, GroupData>> {
  const filePath = path.join(__dirname, 'output', 'RPS_GROUP_TO_PAGES_COMPLETE.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.groups;
}

async function populateGroups() {
  console.log('📊 Loading group mappings from JSON...');
  const groupsData = await loadGroupMappings();

  console.log(`✅ Loaded ${Object.keys(groupsData).length} groups`);

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const [groupCode, group] of Object.entries(groupsData)) {
    try {
      // Check if group already exists
      const { data: existing } = await supabase
        .from('rps_groups')
        .select('id')
        .eq('group_code', groupCode)
        .eq('rps_number', '02155')
        .single();

      const groupRecord = {
        rps_number: '02155',
        group_code: groupCode,
        group_name: group.name,
        total_parts: 0, // Will be updated when parts are loaded
        illustration_pages: group.illustration_pages,
        parts_list_pages: group.parts_list_pages,
        callout_range: group.callout_range,
        page_type: group.page_type,
        shared_with_groups: group.shared_with_groups || null,
        status: group.status || 'verified',
        page_start: group.illustration_pages[0] || null,
        page_end: group.parts_list_pages[group.parts_list_pages.length - 1] || null,
        metadata: {
          note: group.note || null,
          total_illustration_pages: group.illustration_pages.length,
          total_parts_list_pages: group.parts_list_pages.length
        }
      };

      if (existing) {
        // Update existing group
        const { error } = await supabase
          .from('rps_groups')
          .update(groupRecord)
          .eq('id', existing.id);

        if (error) {
          console.error(`❌ Error updating ${groupCode}:`, error.message);
          errors++;
        } else {
          updated++;
          if (updated % 10 === 0) console.log(`  ⏳ Updated ${updated} groups...`);
        }
      } else {
        // Insert new group
        const { error } = await supabase
          .from('rps_groups')
          .insert(groupRecord);

        if (error) {
          console.error(`❌ Error inserting ${groupCode}:`, error.message);
          errors++;
        } else {
          inserted++;
          if (inserted % 10 === 0) console.log(`  ⏳ Inserted ${inserted} groups...`);
        }
      }
    } catch (error: any) {
      console.error(`❌ Error processing ${groupCode}:`, error.message);
      errors++;
    }
  }

  console.log('\n📊 Groups Population Summary:');
  console.log(`  ✅ Inserted: ${inserted}`);
  console.log(`  ♻️  Updated: ${updated}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📈 Total processed: ${inserted + updated}/${Object.keys(groupsData).length}`);
}

async function populateIllustrations() {
  console.log('\n🖼️  Populating illustrations table...');
  const groupsData = await loadGroupMappings();

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const [groupCode, group] of Object.entries(groupsData)) {
    for (const pageNum of group.illustration_pages) {
      try {
        const figureNumber = `${groupCode}-${pageNum}`;
        const cdnUrl = `${CDN_BASE_URL}/rps_page_${pageNum.toString().padStart(4, '0')}.png`;

        // Check if illustration already exists
        const { data: existing } = await supabase
          .from('rps_illustrations')
          .select('id')
          .eq('group_code', groupCode)
          .eq('page_number', pageNum)
          .single();

        const illustrationRecord = {
          rps_number: '02155',
          group_code: groupCode,
          figure_number: figureNumber,
          description: `${group.name} - Page ${pageNum}`,
          page_number: pageNum,
          cdn_url: cdnUrl,
          callouts: null, // Will be populated later with specific callout details
          metadata: {
            callout_range: group.callout_range,
            page_type: group.page_type
          }
        };

        if (existing) {
          // Update existing illustration
          const { error } = await supabase
            .from('rps_illustrations')
            .update(illustrationRecord)
            .eq('id', existing.id);

          if (error) {
            console.error(`❌ Error updating ${groupCode} page ${pageNum}:`, error.message);
            errors++;
          } else {
            updated++;
          }
        } else {
          // Insert new illustration
          const { error } = await supabase
            .from('rps_illustrations')
            .insert(illustrationRecord);

          if (error) {
            console.error(`❌ Error inserting ${groupCode} page ${pageNum}:`, error.message);
            errors++;
          } else {
            inserted++;
          }
        }

        if ((inserted + updated) % 50 === 0) {
          console.log(`  ⏳ Processed ${inserted + updated} illustrations...`);
        }
      } catch (error: any) {
        console.error(`❌ Error processing ${groupCode} page ${pageNum}:`, error.message);
        errors++;
      }
    }
  }

  console.log('\n📊 Illustrations Population Summary:');
  console.log(`  ✅ Inserted: ${inserted}`);
  console.log(`  ♻️  Updated: ${updated}`);
  console.log(`  ❌ Errors: ${errors}`);
  console.log(`  📈 Total illustrations: ${inserted + updated}`);
}

async function main() {
  console.log('🚀 Starting Phase 7 RPS Data Population');
  console.log('========================================\n');

  try {
    // Step 1: Populate groups table
    await populateGroups();

    // Step 2: Populate illustrations table
    await populateIllustrations();

    console.log('\n✅ Phase 7 data population complete!');
    console.log('\nNext steps:');
    console.log('1. Update Barry edge function to use new group-to-pages lookup');
    console.log('2. Test Barry queries with all 93 groups');
    console.log('3. Implement illustration + parts list pairing');

  } catch (error: any) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
