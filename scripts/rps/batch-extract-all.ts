#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { extractGroup, discoverChunk } from './extract-group';

const OUTPUT_DIR = path.join(__dirname, 'output');

const ALL_CHUNKS = [
  { chunk: '003', groups: ['AA', 'AB', 'AC'] },
  { chunk: '004', groups: ['AD', 'AE', 'AF'] },
  { chunk: '005', groups: ['AG', 'AH', 'AJ'] },
  { chunk: '006', groups: ['AK', 'AL', 'AM'] },
  { chunk: '007', groups: ['AN', 'AP', 'AQ'] },
  { chunk: '008', groups: ['AR', 'AS', 'AT'] },
  { chunk: '009', groups: ['AU', 'AV', 'AW'] },
  { chunk: '010', groups: ['AX', 'AY', 'AZ'] },
];

interface ExtractedGroup {
  group_code: string;
  group_name: string;
  parts_count: number;
  illustrations_count: number;
  chunk: string;
  file: string;
  success: boolean;
  error?: string;
}

async function batchExtractAll() {
  console.log('🚀 Starting batch extraction of ALL RPS groups...\n');

  const results: ExtractedGroup[] = [];
  let totalParts = 0;
  let totalIllustrations = 0;
  let successCount = 0;
  let failureCount = 0;

  for (const chunkConfig of ALL_CHUNKS) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📦 Processing Chunk ${chunkConfig.chunk}`);
    console.log(`${'='.repeat(80)}\n`);

    // Step 1: Discover chunk (if not already done)
    try {
      const discoveryPath = path.join(OUTPUT_DIR, `chunk_${chunkConfig.chunk}_discovery.json`);
      if (!fs.existsSync(discoveryPath)) {
        console.log(`🔍 Running discovery for chunk ${chunkConfig.chunk}...`);
        await discoverChunk(chunkConfig.chunk);
      } else {
        console.log(`✅ Discovery already exists for chunk ${chunkConfig.chunk}`);
      }
    } catch (error) {
      console.error(`❌ Discovery failed for chunk ${chunkConfig.chunk}:`, error);
      continue;
    }

    // Step 2: Extract each group
    for (const groupCode of chunkConfig.groups) {
      try {
        console.log(`\n📋 Extracting Group ${groupCode}...`);

        const groupData = await extractGroup(groupCode, chunkConfig.chunk);

        results.push({
          group_code: groupCode,
          group_name: groupData.group_name,
          parts_count: groupData.parts.length,
          illustrations_count: groupData.illustrations.length,
          chunk: chunkConfig.chunk,
          file: `group_${groupCode.toLowerCase()}_complete.json`,
          success: true,
        });

        totalParts += groupData.parts.length;
        totalIllustrations += groupData.illustrations.length;
        successCount++;

        console.log(`✅ Group ${groupCode} complete: ${groupData.parts.length} parts, ${groupData.illustrations.length} illustrations`);

        // Add delay to avoid rate limits
        console.log('⏳ Waiting 5 seconds before next group...');
        await new Promise(resolve => setTimeout(resolve, 5000));

      } catch (error) {
        console.error(`❌ Group ${groupCode} failed:`, error);

        results.push({
          group_code: groupCode,
          group_name: 'UNKNOWN',
          parts_count: 0,
          illustrations_count: 0,
          chunk: chunkConfig.chunk,
          file: '',
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });

        failureCount++;
      }
    }
  }

  // Generate summary report
  const summary = {
    total_groups: results.length,
    successful: successCount,
    failed: failureCount,
    total_parts: totalParts,
    total_illustrations: totalIllustrations,
    extraction_date: new Date().toISOString(),
    results,
  };

  const summaryPath = path.join(OUTPUT_DIR, 'extraction_summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`\n${'='.repeat(80)}`);
  console.log('🎉 BATCH EXTRACTION COMPLETE');
  console.log(`${'='.repeat(80)}\n`);
  console.log(`📊 Summary:`);
  console.log(`   Total Groups: ${results.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${failureCount}`);
  console.log(`   Total Parts: ${totalParts}`);
  console.log(`   Total Illustrations: ${totalIllustrations}`);
  console.log(`\n📄 Summary report: ${summaryPath}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  if (failureCount > 0) {
    console.log('⚠️ Some groups failed to extract:');
    results
      .filter(r => !r.success)
      .forEach(r => console.log(`   - Group ${r.group_code}: ${r.error}`));
  }

  return summary;
}

if (require.main === module) {
  batchExtractAll()
    .then(() => {
      console.log('✅ All done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Batch extraction failed:', error);
      process.exit(1);
    });
}

export { batchExtractAll };
