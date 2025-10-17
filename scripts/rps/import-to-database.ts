#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   VITE_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const OUTPUT_DIR = path.join(__dirname, 'output');

interface Part {
  item_number: string;
  niin: string;
  nsn?: string;
  description: string;
  quantity?: number;
  repair_grade?: 'L' | 'M' | 'H';
}

interface Illustration {
  figure_number: string;
  page_number: number;
  title?: string;
  description?: string;
  callouts?: Record<string, any>;
}

interface GroupData {
  group_code: string;
  group_name: string;
  rps_number: string;
  page_start: number;
  page_end?: number;
  parts: Part[];
  illustrations: Illustration[];
}

interface ImportResult {
  group_code: string;
  parts_imported: number;
  illustrations_imported: number;
  success: boolean;
  error?: string;
}

async function importGroup(groupCode: string): Promise<ImportResult> {
  const filename = `group_${groupCode.toLowerCase()}_complete.json`;
  const filePath = path.join(OUTPUT_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return {
      group_code: groupCode,
      parts_imported: 0,
      illustrations_imported: 0,
      success: false,
      error: 'JSON file not found',
    };
  }

  try {
    console.log(`📥 Importing Group ${groupCode}...`);

    const groupData: GroupData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Step 1: Upsert group metadata
    const { error: groupError } = await supabase
      .from('rps_groups')
      .upsert({
        rps_number: groupData.rps_number,
        group_code: groupData.group_code,
        group_name: groupData.group_name,
        total_parts: groupData.parts.length,
        page_start: groupData.page_start,
        page_end: groupData.page_end,
        chunk_file: filename,
        metadata: {
          imported_at: new Date().toISOString(),
          parts_count: groupData.parts.length,
          illustrations_count: groupData.illustrations.length,
        },
      }, {
        onConflict: 'group_code',
      });

    if (groupError) {
      throw new Error(`Failed to import group metadata: ${groupError.message}`);
    }

    // Step 2: Upsert parts (batch insert for performance)
    if (groupData.parts.length > 0) {
      const partsToInsert = groupData.parts.map(part => ({
        niin: part.niin,
        nsn: part.nsn || null,
        group_code: groupData.group_code,
        item_number: part.item_number,
        description: part.description,
        rps_number: groupData.rps_number,
        quantity: part.quantity || null,
        repair_grade: part.repair_grade || null,
        page_number: groupData.page_start,
        chunk_file: filename,
      }));

      const { error: partsError } = await supabase
        .from('rps_parts')
        .upsert(partsToInsert, {
          onConflict: 'niin',
        });

      if (partsError) {
        throw new Error(`Failed to import parts: ${partsError.message}`);
      }
    }

    // Step 3: Upsert illustrations
    let illustrationsImported = 0;
    if (groupData.illustrations.length > 0) {
      const illustrationsToInsert = groupData.illustrations.map(illus => ({
        rps_number: groupData.rps_number,
        group_code: groupData.group_code,
        figure_number: illus.figure_number,
        description: illus.description || null,
        page_number: illus.page_number,
        callouts: illus.callouts || null,
      }));

      const { error: illusError } = await supabase
        .from('rps_illustrations')
        .upsert(illustrationsToInsert, {
          onConflict: 'rps_number,group_code,figure_number',
          ignoreDuplicates: true,
        });

      if (illusError) {
        console.warn(`⚠️ Illustrations import warning: ${illusError.message}`);
      } else {
        illustrationsImported = groupData.illustrations.length;
      }
    }

    console.log(`✅ Group ${groupCode}: ${groupData.parts.length} parts, ${illustrationsImported} illustrations`);

    return {
      group_code: groupCode,
      parts_imported: groupData.parts.length,
      illustrations_imported: illustrationsImported,
      success: true,
    };
  } catch (error) {
    console.error(`❌ Import failed for Group ${groupCode}:`, error);

    return {
      group_code: groupCode,
      parts_imported: 0,
      illustrations_imported: 0,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function importAllGroups() {
  console.log('🚀 Starting database import of all RPS groups...\n');

  // Step 1: Read extraction summary
  const summaryPath = path.join(OUTPUT_DIR, 'extraction_summary.json');

  if (!fs.existsSync(summaryPath)) {
    throw new Error('Extraction summary not found. Run batch-extract-all.ts first.');
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
  const successfulGroups = summary.results.filter((r: any) => r.success);

  console.log(`📋 Found ${successfulGroups.length} groups to import\n`);

  // Step 2: Check database connection
  const { error: connectionError } = await supabase.from('rps_groups').select('count').limit(1);

  if (connectionError) {
    throw new Error(`Database connection failed: ${connectionError.message}`);
  }

  console.log('✅ Database connection verified\n');

  // Step 3: Import each group
  const importResults: ImportResult[] = [];
  let totalParts = 0;
  let totalIllustrations = 0;

  for (const group of successfulGroups) {
    const result = await importGroup(group.group_code);
    importResults.push(result);

    if (result.success) {
      totalParts += result.parts_imported;
      totalIllustrations += result.illustrations_imported;
    }

    // Small delay to avoid overwhelming database
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // Step 4: Generate import summary
  const importSummary = {
    total_groups: importResults.length,
    successful_imports: importResults.filter(r => r.success).length,
    failed_imports: importResults.filter(r => !r.success).length,
    total_parts: totalParts,
    total_illustrations: totalIllustrations,
    import_date: new Date().toISOString(),
    results: importResults,
  };

  const importSummaryPath = path.join(OUTPUT_DIR, 'import_summary.json');
  fs.writeFileSync(importSummaryPath, JSON.stringify(importSummary, null, 2));

  console.log(`\n${'='.repeat(80)}`);
  console.log('🎉 DATABASE IMPORT COMPLETE');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`📊 Summary:`);
  console.log(`   Total Groups: ${importResults.length}`);
  console.log(`   Successful: ${importSummary.successful_imports}`);
  console.log(`   Failed: ${importSummary.failed_imports}`);
  console.log(`   Total Parts: ${totalParts}`);
  console.log(`   Total Illustrations: ${totalIllustrations}`);
  console.log(`\n📄 Import summary: ${importSummaryPath}\n`);

  if (importSummary.failed_imports > 0) {
    console.log('⚠️ Some imports failed:');
    importResults
      .filter(r => !r.success)
      .forEach(r => console.log(`   - Group ${r.group_code}: ${r.error}`));
  }

  // Step 5: Verify database counts
  console.log('\n🔍 Verifying database...');

  const { count: groupCount } = await supabase
    .from('rps_groups')
    .select('*', { count: 'exact', head: true });

  const { count: partsCount } = await supabase
    .from('rps_parts')
    .select('*', { count: 'exact', head: true });

  const { count: illusCount } = await supabase
    .from('rps_illustrations')
    .select('*', { count: 'exact', head: true });

  console.log(`✅ Database counts:`);
  console.log(`   Groups: ${groupCount}`);
  console.log(`   Parts: ${partsCount}`);
  console.log(`   Illustrations: ${illusCount}\n`);

  return importSummary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  importAllGroups()
    .then(() => {
      console.log('✅ All data imported successfully!');
      console.log('\n🔗 Next steps:');
      console.log('   1. Test Barry: "What is NIIN 12-126-0420?"');
      console.log('   2. Test Barry: "Show me Group AA"');
      console.log('   3. Deploy to staging for user testing\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Import failed:', error);
      process.exit(1);
    });
}

export { importAllGroups, importGroup };
