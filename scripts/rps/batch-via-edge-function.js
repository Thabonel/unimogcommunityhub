#!/usr/bin/env node

/**
 * Batch OCR Processor - Calls Edge Function Repeatedly
 *
 * This script calls the process-rps-ocr edge function multiple times
 * to process all unprocessed RPS parts list pages.
 */

import https from 'https';

const EDGE_FUNCTION_URL = process.env.VITE_SUPABASE_URL?.replace('https://', '') || 'your-project.supabase.co';
const EDGE_FUNCTION_PATH = '/functions/v1/process-rps-ocr';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here';

async function callEdgeFunction() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: EDGE_FUNCTION_URL,
      path: EDGE_FUNCTION_PATH,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      timeout: 300000 // 5 minute timeout
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: 'Failed to parse response', raw: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function getRemainingCount() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: EDGE_FUNCTION_URL,
      path: '/rest/v1/rpc/get_unprocessed_rps_count',
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Just return a placeholder for now
          resolve(298);
        } catch (e) {
          resolve(298);
        }
      });
    });

    req.on('error', () => resolve(298));
    req.end();
  });
}

async function main() {
  console.log('==========================================');
  console.log('RPS OCR Batch Processing');
  console.log('Using Edge Function: process-rps-ocr');
  console.log('==========================================\n');

  const remaining = await getRemainingCount();
  const batchesNeeded = Math.ceil(remaining / 10);

  console.log(`📊 Estimated ${remaining} pages remaining`);
  console.log(`📦 Will run ~${batchesNeeded} batches (10 pages each)`);
  console.log(`⏱️  Estimated time: ~${Math.ceil(batchesNeeded * 2)} minutes\n`);

  let totalProcessed = 0;
  let totalFailed = 0;
  let batchNum = 1;
  let consecutiveEmpty = 0;

  while (consecutiveEmpty < 2) {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Batch ${batchNum}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    try {
      const result = await callEdgeFunction();

      if (result.error) {
        console.error(`❌ Error: ${result.error}`);
        break;
      }

      const processed = result.processed || 0;
      const failed = result.failed || 0;
      const total = result.total || 0;

      totalProcessed += processed;
      totalFailed += failed;

      console.log(`✓ Processed: ${processed}/${total} pages`);
      if (failed > 0) {
        console.log(`✗ Failed: ${failed} pages`);
      }
      console.log(`📊 Running total: ${totalProcessed} processed, ${totalFailed} failed\n`);

      // Check if we're done
      if (total === 0 || processed === 0) {
        consecutiveEmpty++;
        if (consecutiveEmpty >= 2) {
          console.log('✓ No more pages to process!\n');
          break;
        }
      } else {
        consecutiveEmpty = 0;
      }

      // Rate limiting between batches
      console.log(`⏳ Waiting 3 seconds before next batch...\n`);
      await new Promise(resolve => setTimeout(resolve, 3000));

      batchNum++;

      // Safety limit
      if (batchNum > 50) {
        console.log('⚠️  Safety limit reached (50 batches). Stopping.\n');
        break;
      }

    } catch (error) {
      console.error(`❌ Batch failed: ${error.message}\n`);
      // Continue to next batch
      await new Promise(resolve => setTimeout(resolve, 5000));
      batchNum++;
    }
  }

  console.log('==========================================');
  console.log('Processing Complete!');
  console.log('==========================================');
  console.log(`Total Processed: ${totalProcessed}`);
  console.log(`Total Failed: ${totalFailed}\n`);

  console.log('To verify results, check the database or visit the admin page.');
}

main()
  .then(() => {
    console.log('✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
