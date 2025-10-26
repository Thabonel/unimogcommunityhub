#!/usr/bin/env ts-node
/**
 * RPS Manual Reindexing Script
 *
 * Processes all 930 local PNG files with Marker OCR to extract correct titles and content.
 * Saves checkpoints every 50 pages for crash recovery.
 * Generates SQL UPDATE statements to fix manual_chunks table.
 *
 * Usage:
 *   npm install dotenv
 *   export REPLICATE_API_TOKEN="your_token"
 *   ts-node scripts/rps/reindex-all-pages-with-marker.ts
 *
 * Cost: ~$85.56 (930 pages × $0.092)
 * Time: ~24-30 hours
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  localPngDir: path.join(__dirname, 'output/ai_illustrations'),
  checkpointDir: path.join(__dirname, 'checkpoints'),
  outputSqlFile: path.join(__dirname, '../../docs/sql/update-rps-manual-chunks.sql'),
  batchSize: 50,
  supabaseBaseUrl: 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/rps_illustrations/rps_illustrations',
  replicateApiToken: process.env.REPLICATE_API_TOKEN || process.env.VITE_REPLICATE_API_TOKEN,
  testMode: true,
  testPages: [1, 75, 100, 500, 900],
};

// Types
interface PageResult {
  pageNumber: number;
  localFilePath: string;
  supabaseUrl: string;
  title: string;
  content: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

interface Checkpoint {
  batchNumber: number;
  pageRange: string;
  timestamp: string;
  processedCount: number;
  results: PageResult[];
}

// Main execution
async function main() {
  console.log('🚀 Starting RPS Manual Reindexing...\n');

  // Validate setup
  if (!CONFIG.replicateApiToken) {
    console.error('❌ ERROR: REPLICATE_API_TOKEN not found in environment');
    console.error('   Set it with: export REPLICATE_API_TOKEN="your_token"');
    process.exit(1);
  }

  // Create directories
  if (!fs.existsSync(CONFIG.checkpointDir)) {
    fs.mkdirSync(CONFIG.checkpointDir, { recursive: true });
  }

  const sqlDir = path.dirname(CONFIG.outputSqlFile);
  if (!fs.existsSync(sqlDir)) {
    fs.mkdirSync(sqlDir, { recursive: true });
  }

  // Find all PNG files
  console.log('📂 Scanning for PNG files...');
  let pngFiles = findAllPngFiles();

  if (CONFIG.testMode) {
    console.log(`   TEST MODE: Processing only pages ${CONFIG.testPages.join(', ')}`);
    pngFiles = pngFiles.filter(file => CONFIG.testPages.includes(file.pageNumber));
  }

  console.log(`   Found ${pngFiles.length} PNG files\n`);

  if (pngFiles.length === 0) {
    console.error('❌ No PNG files found. Check localPngDir path.');
    process.exit(1);
  }

  // Check for existing checkpoints
  const lastCheckpoint = findLastCheckpoint();
  const startPage = lastCheckpoint ? lastCheckpoint.processedCount + 1 : 1;

  if (lastCheckpoint) {
    console.log(`📦 Resuming from checkpoint: batch ${lastCheckpoint.batchNumber}`);
    console.log(`   Starting at page ${startPage}\n`);
  }

  // Process all pages
  console.log(`⚙️  Processing pages ${startPage} to ${pngFiles.length}...`);
  console.log(`   Batch size: ${CONFIG.batchSize} pages`);
  console.log(`   Estimated cost: $${(pngFiles.length * 0.092).toFixed(2)}`);
  console.log(`   Estimated time: ${Math.round(pngFiles.length * 95 / 60)} minutes\n`);

  const allResults: PageResult[] = lastCheckpoint?.results || [];

  for (let i = startPage - 1; i < pngFiles.length; i++) {
    const pageNumber = i + 1;
    const pngFile = pngFiles[i];

    console.log(`\n[${pageNumber}/${pngFiles.length}] Processing: ${path.basename(pngFile.path)}`);

    try {
      const result = await processPageWithMarker(
        pngFile.supabaseUrl,
        pageNumber,
        pngFile.path
      );

      allResults.push(result);

      if (result.success) {
        console.log(`   ✅ Success: "${result.title.substring(0, 60)}..."`);
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }

      // Save checkpoint every batchSize pages
      if (pageNumber % CONFIG.batchSize === 0) {
        saveCheckpoint(allResults, Math.floor(pageNumber / CONFIG.batchSize));
        console.log(`\n📦 Checkpoint saved: batch ${Math.floor(pageNumber / CONFIG.batchSize)}`);
      }

      // Rate limiting: 2 second delay between requests
      if (i < pngFiles.length - 1) {
        await sleep(2000);
      }

    } catch (error: any) {
      console.error(`   ❌ Error processing page ${pageNumber}:`, error.message);
      allResults.push({
        pageNumber,
        localFilePath: pngFile.path,
        supabaseUrl: pngFile.supabaseUrl,
        title: '',
        content: '',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Save final checkpoint
  saveCheckpoint(allResults, Math.ceil(pngFiles.length / CONFIG.batchSize));

  // Generate SQL
  console.log('\n\n📝 Generating SQL update statements...');
  generateSqlFile(allResults);

  // Summary
  const successCount = allResults.filter(r => r.success).length;
  const failCount = allResults.filter(r => !r.success).length;

  console.log('\n\n✅ PROCESSING COMPLETE!');
  console.log(`\n📊 Summary:`);
  console.log(`   Total pages: ${allResults.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Success rate: ${((successCount / allResults.length) * 100).toFixed(1)}%`);
  console.log(`\n📄 SQL file generated: ${CONFIG.outputSqlFile}`);
  console.log(`\n🎯 Next steps:`);
  console.log(`   1. Review the SQL file`);
  console.log(`   2. Open Supabase SQL Editor`);
  console.log(`   3. Execute the SQL to update database`);
  console.log(`   4. Test Barry with queries\n`);
}

// Find all PNG files in the local directory
function findAllPngFiles(): Array<{ pageNumber: number; path: string; supabaseUrl: string }> {
  const files = fs.readdirSync(CONFIG.localPngDir)
    .filter(f => f.startsWith('rps_page_') && f.endsWith('.png'))
    .sort();

  return files.map(filename => {
    const match = filename.match(/rps_page_(\d+)\.png/);
    const pageNumber = match ? parseInt(match[1]) : 0;

    return {
      pageNumber,
      path: path.join(CONFIG.localPngDir, filename),
      supabaseUrl: `${CONFIG.supabaseBaseUrl}/${filename}`,
    };
  }).sort((a, b) => a.pageNumber - b.pageNumber);
}

// Process a single page with Marker OCR using direct API calls
async function processPageWithMarker(
  imageUrl: string,
  pageNumber: number,
  localPath: string
): Promise<PageResult> {
  const startTime = Date.now();

  try {
    console.log(`   Calling Replicate API...`);

    // Step 1: Create prediction
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${CONFIG.replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '4eb62a42c3e5b8695a796936e69afa2c004839aef15410f01492d59783baf752',
        input: {
          document: imageUrl,
          lang: 'English',
          dpi: 400,
          max_pages: 1,
          parallel_factor: 1,
          enable_editor: false
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`Replicate API error: ${createResponse.status} - ${errorText}`);
    }

    const prediction = await createResponse.json();
    const predictionId = prediction.id;

    console.log(`   Prediction created: ${predictionId}`);

    // Step 2: Poll for completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max
    let status: any;

    while (attempts < maxAttempts) {
      await sleep(5000); // Wait 5 seconds between checks

      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${CONFIG.replicateApiToken}`,
        }
      });

      if (!statusResponse.ok) {
        throw new Error(`Failed to check prediction status: ${statusResponse.status}`);
      }

      status = await statusResponse.json();

      if (status.status === 'succeeded') {
        console.log(`   Prediction succeeded`);
        break;
      }

      if (status.status === 'failed' || status.status === 'canceled') {
        throw new Error(`Prediction ${status.status}: ${status.error || 'Unknown error'}`);
      }

      attempts++;
      console.log(`   Polling... (${attempts}/${maxAttempts})`);
    }

    if (attempts >= maxAttempts) {
      throw new Error('Prediction timed out after 5 minutes');
    }

    // Step 3: Get markdown content (either direct string or URL to fetch)
    console.log(`   Marker output keys: ${JSON.stringify(Object.keys(status.output))}`);

    let markdownContent = '';
    const markdownData = status.output.markdown;

    console.log(`   Markdown type: ${typeof markdownData}`);

    if (typeof markdownData === 'string') {
      if (markdownData.startsWith('http')) {
        console.log(`   Downloading markdown from URL: ${markdownData.substring(0, 50)}...`);
        const markdownResponse = await fetch(markdownData);
        if (!markdownResponse.ok) {
          throw new Error(`Failed to download markdown: ${markdownResponse.status}`);
        }
        markdownContent = await markdownResponse.text();
      } else {
        console.log(`   Using inline markdown content`);
        markdownContent = markdownData;
      }
    } else if (markdownData && typeof markdownData === 'object') {
      console.log(`   Converting markdown object to text...`);
      markdownContent = JSON.stringify(markdownData);
    } else {
      throw new Error(`Unexpected markdown format: ${typeof markdownData}`);
    }

    console.log(`   Markdown length: ${markdownContent.length} chars`);

    // Extract title from first heading
    const title = extractTitleFromMarkdown(markdownContent);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`   OCR complete in ${elapsed}s`);

    return {
      pageNumber,
      localFilePath: localPath,
      supabaseUrl: imageUrl,
      title: title || `Page ${pageNumber}`,
      content: markdownContent,
      success: true,
      timestamp: new Date().toISOString(),
    };

  } catch (error: any) {
    return {
      pageNumber,
      localFilePath: localPath,
      supabaseUrl: imageUrl,
      title: '',
      content: '',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

// Extract title from markdown (first # heading)
function extractTitleFromMarkdown(markdown: string): string {
  const lines = markdown.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Look for first heading (# Title or ## Title)
    if (trimmed.startsWith('#')) {
      const title = trimmed.replace(/^#+\s*/, '').trim();
      if (title.length > 0) {
        return title;
      }
    }

    // Also check for all-caps lines (common in technical docs)
    if (trimmed.length > 10 && trimmed === trimmed.toUpperCase() && /^[A-Z\s,\-\(\)]+$/.test(trimmed)) {
      return trimmed;
    }
  }

  return '';
}

// Find the last completed checkpoint
function findLastCheckpoint(): Checkpoint | null {
  if (!fs.existsSync(CONFIG.checkpointDir)) {
    return null;
  }

  const checkpointFiles = fs.readdirSync(CONFIG.checkpointDir)
    .filter(f => f.startsWith('batch_') && f.endsWith('.json'))
    .sort()
    .reverse();

  if (checkpointFiles.length === 0) {
    return null;
  }

  const lastFile = path.join(CONFIG.checkpointDir, checkpointFiles[0]);
  const checkpoint: Checkpoint = JSON.parse(fs.readFileSync(lastFile, 'utf-8'));

  return checkpoint;
}

// Save checkpoint to file
function saveCheckpoint(results: PageResult[], batchNumber: number) {
  const checkpoint: Checkpoint = {
    batchNumber,
    pageRange: `${(batchNumber - 1) * CONFIG.batchSize + 1}-${Math.min(batchNumber * CONFIG.batchSize, results.length)}`,
    timestamp: new Date().toISOString(),
    processedCount: results.length,
    results,
  };

  const filename = `batch_${String(batchNumber).padStart(3, '0')}.json`;
  const filepath = path.join(CONFIG.checkpointDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(checkpoint, null, 2));
}

// Generate SQL file with deduplication and updates
function generateSqlFile(results: PageResult[]) {
  const sqlLines: string[] = [
    '-- RPS Manual Chunks Update SQL',
    '-- Generated by reindex-all-pages-with-marker.ts',
    `-- Generated: ${new Date().toISOString()}`,
    `-- Total pages: ${results.length}`,
    '',
    '-- Step 1: Backup current data',
    'CREATE TABLE IF NOT EXISTS manual_chunks_backup_' + new Date().toISOString().split('T')[0].replace(/-/g, '') + ' AS',
    'SELECT * FROM manual_chunks',
    "WHERE manual_title = 'RPS Catalog';",
    '',
    'BEGIN;',
    '',
    '-- Step 2: Delete duplicate records (keep only one per page)',
    '-- We will keep the record with the most metadata and longest content',
    'DELETE FROM manual_chunks',
    'WHERE id IN (',
    '  SELECT id',
    '  FROM (',
    '    SELECT',
    '      id,',
    '      page_number,',
    '      ROW_NUMBER() OVER (',
    '        PARTITION BY page_number',
    '        ORDER BY',
    '          LENGTH(COALESCE(content, \'\')) DESC,',
    '          CASE WHEN metadata IS NOT NULL THEN 1 ELSE 2 END,',
    '          created_at DESC',
    '      ) as rank',
    '    FROM manual_chunks',
    "    WHERE manual_title = 'RPS Catalog'",
    '  ) ranked',
    '  WHERE rank > 1',
    ');',
    '',
    '-- Step 3: Update remaining records with correct OCR data',
    '',
  ];

  // Generate UPDATE statement for each successful page
  const successfulResults = results.filter(r => r.success);

  for (const result of successfulResults) {
    const title = result.title.replace(/'/g, "''"); // Escape single quotes
    const content = result.content.replace(/'/g, "''"); // Escape single quotes

    sqlLines.push(`-- Page ${result.pageNumber}`);
    sqlLines.push(`UPDATE manual_chunks`);
    sqlLines.push(`SET`);
    sqlLines.push(`  section_title = '${title}',`);
    sqlLines.push(`  content = '${content}',`);
    sqlLines.push(`  ocr_processed = true,`);
    sqlLines.push(`  metadata = jsonb_set(`);
    sqlLines.push(`    COALESCE(metadata, '{}'::jsonb),`);
    sqlLines.push(`    '{ocr_method}',`);
    sqlLines.push(`    '"marker"'`);
    sqlLines.push(`  ),`);
    sqlLines.push(`  updated_at = NOW()`);
    sqlLines.push(`WHERE manual_title = 'RPS Catalog'`);
    sqlLines.push(`  AND page_number = ${result.pageNumber};`);
    sqlLines.push('');
  }

  sqlLines.push('COMMIT;');
  sqlLines.push('');
  sqlLines.push('-- Step 4: Verify results');
  sqlLines.push('SELECT');
  sqlLines.push('  COUNT(*) as total_records,');
  sqlLines.push('  COUNT(DISTINCT page_number) as unique_pages,');
  sqlLines.push('  COUNT(CASE WHEN ocr_processed = true THEN 1 END) as ocr_processed_count');
  sqlLines.push('FROM manual_chunks');
  sqlLines.push("WHERE manual_title = 'RPS Catalog';");
  sqlLines.push('-- Expected: total_records = unique_pages = ocr_processed_count');

  fs.writeFileSync(CONFIG.outputSqlFile, sqlLines.join('\n'));
}

// Sleep utility
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run main function
main().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});
