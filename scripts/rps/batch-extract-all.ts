#!/usr/bin/env tsx

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { extractGroup, discoverChunk } from './extract-group';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'output');
const RPS_CHUNKS_DIR = '/Users/thabonel/Code/Work/rps_processed';

interface ChunkConfig {
  chunk: string;
  groups: string[];
}

/**
 * Build chunk/group configuration by reading discovery files
 * Note: Discovery files may be misnamed (chunk_003_discovery.json might contain chunk 001)
 * We read the actual chunk_number from inside the discovery file
 */
function buildChunkConfiguration(): ChunkConfig[] {
  const chunkConfigs: ChunkConfig[] = [];
  const processedChunks = new Set<string>();

  try {
    // Read all discovery files
    const discoveryFiles = fs.readdirSync(OUTPUT_DIR)
      .filter(f => f.match(/chunk_\d+_discovery\.json$/))
      .sort();

    console.log(`Found ${discoveryFiles.length} discovery files`);

    for (const discoveryFile of discoveryFiles) {
      try {
        const discoveryPath = path.join(OUTPUT_DIR, discoveryFile);
        const discovery = JSON.parse(fs.readFileSync(discoveryPath, 'utf-8'));

        if (discovery.chunk_info && discovery.groups_found) {
          const actualChunkNum = String(discovery.chunk_info.chunk_number).padStart(3, '0');

          if (processedChunks.has(actualChunkNum)) {
            console.warn(`Chunk ${actualChunkNum} already processed, skipping duplicate`);
            continue;
          }

          processedChunks.add(actualChunkNum);

          const groups = discovery.groups_found.map((g: any) => g.group_code);
          if (groups.length > 0) {
            chunkConfigs.push({
              chunk: actualChunkNum,
              groups: groups,
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to parse ${discoveryFile}:`, error);
      }
    }

    // Sort by chunk number
    chunkConfigs.sort((a, b) => parseInt(a.chunk) - parseInt(b.chunk));

    return chunkConfigs;
  } catch (error) {
    console.error('Failed to build chunk configuration:', error);
    return [];
  }
}

const ALL_CHUNKS = buildChunkConfiguration();

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

  if (ALL_CHUNKS.length === 0) {
    console.error('❌ No chunks found! Make sure discovery files exist in output directory.');
    throw new Error('No chunks configured for extraction');
  }

  console.log(`📊 Configuration Summary:`);
  console.log(`   Total Chunks: ${ALL_CHUNKS.length}`);
  const totalGroups = ALL_CHUNKS.reduce((sum, chunk) => sum + chunk.groups.length, 0);
  console.log(`   Total Groups: ${totalGroups}`);
  ALL_CHUNKS.forEach(chunk => {
    console.log(`   - Chunk ${chunk.chunk}: ${chunk.groups.join(', ')}`);
  });
  console.log('');

  const results: ExtractedGroup[] = [];
  let totalParts = 0;
  let totalIllustrations = 0;
  let successCount = 0;
  let failureCount = 0;

  for (const chunkConfig of ALL_CHUNKS) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📦 Processing Chunk ${chunkConfig.chunk.padStart(3, '0')}`);
    console.log(`${'='.repeat(80)}\n`);

    // Note: Discovery already completed for these chunks
    console.log(`✅ Using pre-computed discovery for chunk ${chunkConfig.chunk.padStart(3, '0')}`);

    // Step 2: Extract each group
    for (const groupCode of chunkConfig.groups) {
      try {
        console.log(`\n📋 Extracting Group ${groupCode}...`);

        const groupData = await extractGroup(groupCode, chunkConfig.chunk.padStart(3, '0'));

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

if (import.meta.url === `file://${process.argv[1]}`) {
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
