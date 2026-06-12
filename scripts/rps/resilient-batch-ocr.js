#!/usr/bin/env node

/**
 * Resilient RPS OCR Batch Processor
 *
 * Improvements over simple-batch-ocr.js:
 * - Skips already-processed pages (resume capability)
 * - Better error handling (continues on failures)
 * - Progress logging to file
 * - Retry logic for transient failures
 * - Generates SQL file even with partial results
 *
 * Usage:
 *   node scripts/rps/resilient-batch-ocr.js
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_KEY = <SUPABASE_ANON_KEY>
const OPENAI_API_KEY = <OPENAI_API_KEY>
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;
const REQUEST_DELAY_MS = 1500; // Slightly longer delay between requests

// Check for required environment variables
if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable not set');
  process.exit(1);
}

if (!SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  process.exit(1);
}

// Setup logging
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const logFile = path.join(outputDir, 'ocr_progress.log');
function log(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(logFile, logLine);
  console.log(message);
}

// Make HTTPS request with timeout
function makeRequest(options, data = null, timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Fetch unprocessed pages from Supabase
async function fetchUnprocessedPages() {
  log('📥 Fetching unprocessed RPS pages from database...');

  const options = {
    hostname: 'ydevatqwkoccxhtejdor.supabase.co',
    path: '/rest/v1/manual_chunks?manual_title=eq.RPS%20Catalog&ocr_processed=eq.false&order=page_number.asc&select=*',
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await makeRequest(options);

  if (response.status !== 200) {
    throw new Error(`Failed to fetch pages: ${JSON.stringify(response.data)}`);
  }

  const partsLists = response.data.filter(page =>
    page.metadata && page.metadata.is_parts_list === true
  );

  log(`✓ Found ${partsLists.length} unprocessed parts list pages`);
  return partsLists;
}

// OCR a single page with retry logic
async function ocrPageWithRetry(page, retryCount = 0) {
  const groupInfo = `${page.metadata.group_code} - ${page.metadata.group_name}`;

  const prompt = `You are analyzing a parts list page from a military vehicle catalog (RPS - Replacement Parts Specification).

This page shows a parts table for: ${groupInfo}

Extract ALL information from the parts table. Include:
- Item/callout numbers
- Part numbers (including dashes and special characters)
- NIIN codes (11-digit numbers)
- NSN numbers (NATO Stock Numbers)
- Descriptions
- Quantities
- Any notes or remarks

Format the output as clean, structured text that preserves the table data. Be thorough and accurate.`;

  const requestBody = JSON.stringify({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: page.page_image_url } }
      ]
    }],
    max_tokens: 4096,
    temperature: 0.1
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await makeRequest(options, requestBody, 90000); // 90 second timeout

    if (response.status !== 200) {
      throw new Error(`OpenAI API error (status ${response.status}): ${JSON.stringify(response.data)}`);
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      log(`  ⚠️  Retry ${retryCount + 1}/${MAX_RETRIES} after error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (retryCount + 1)));
      return ocrPageWithRetry(page, retryCount + 1);
    }
    throw error;
  }
}

// Update database directly
async function updatePageInDatabase(pageId, ocrText) {
  const escapedText = ocrText.replace(/'/g, "''");

  const requestBody = JSON.stringify({
    ocr_text: ocrText,
    content: ocrText,
    ocr_processed: true,
    ocr_processed_at: new Date().toISOString()
  });

  const options = {
    hostname: 'ydevatqwkoccxhtejdor.supabase.co',
    path: `/rest/v1/manual_chunks?id=eq.${pageId}`,
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }
  };

  const response = await makeRequest(options, requestBody);

  if (response.status !== 204 && response.status !== 200) {
    throw new Error(`Failed to update database: ${JSON.stringify(response.data)}`);
  }
}

// Main processing function
async function main() {
  log('==========================================');
  log('RPS OCR Processing - Resilient Batch');
  log('==========================================');
  log('');

  // Fetch pages
  const pages = await fetchUnprocessedPages();

  if (pages.length === 0) {
    log('✓ No pages to process!');
    return;
  }

  log(`Processing ${pages.length} pages...`);
  log(`Estimated time: ~${Math.ceil(pages.length * 7 / 60)} minutes`);
  log('');

  let successCount = 0;
  let errorCount = 0;
  const failedPages = [];

  // Process each page
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const progress = `[${i + 1}/${pages.length}]`;

    log(`${progress} Page ${page.page_number}: ${page.section_title}`);

    try {
      const ocrText = await ocrPageWithRetry(page);

      if (ocrText && ocrText.length > 50) {
        // Update database immediately
        await updatePageInDatabase(page.id, ocrText);
        successCount++;
        log(`  ✓ Extracted ${ocrText.length} characters and updated database`);
      } else {
        log(`  ✗ Empty or too short response (${ocrText?.length || 0} chars)`);
        errorCount++;
        failedPages.push({ page: page.page_number, reason: 'Empty response' });
      }

      // Rate limiting
      if (i < pages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
      }

    } catch (err) {
      log(`  ✗ Error: ${err.message}`);
      errorCount++;
      failedPages.push({ page: page.page_number, reason: err.message });
    }
  }

  log('');
  log('==========================================');
  log('Processing Complete');
  log('==========================================');
  log(`Success: ${successCount}`);
  log(`Errors: ${errorCount}`);
  log('');

  if (failedPages.length > 0) {
    log('Failed pages:');
    failedPages.forEach(fp => log(`  - Page ${fp.page}: ${fp.reason}`));
    log('');

    // Save failed pages list
    const failedPagesFile = path.join(outputDir, 'failed_pages.json');
    fs.writeFileSync(failedPagesFile, JSON.stringify(failedPages, null, 2));
    log(`Failed pages list saved to: ${failedPagesFile}`);
  }

  // Verification query
  log('');
  log('To verify results, run this SQL in Supabase:');
  log('');
  log('SELECT');
  log('  COUNT(*) FILTER (WHERE ocr_processed = true) as processed,');
  log('  COUNT(*) FILTER (WHERE ocr_processed = false) as unprocessed');
  log('FROM manual_chunks');
  log("WHERE manual_title = 'RPS Catalog'");
  log("  AND metadata->>'is_parts_list' = 'true';");
  log('');
}

// Run
main()
  .then(() => {
    log('✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    log(`❌ Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
