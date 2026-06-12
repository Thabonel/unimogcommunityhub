#!/usr/bin/env node

/**
 * Simple RPS OCR Batch Processor
 *
 * This script processes RPS parts list pages using OpenAI GPT-4o Vision
 * and generates a SQL file for database update.
 *
 * Usage:
 *   node scripts/rps/simple-batch-ocr.js
 *
 * Required environment variables:
 *   - OPENAI_API_KEY
 *   - SUPABASE_SERVICE_ROLE_KEY (optional, will prompt if not set)
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_KEY = <SUPABASE_ANON_KEY>
const OPENAI_API_KEY = <OPENAI_API_KEY>

// Check for required environment variables
if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable not set');
  console.error('Please run: export OPENAI_API_KEY=<OPENAI_API_KEY>
  process.exit(1);
}

if (!SUPABASE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  console.error('Please run: export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
  process.exit(1);
}

// Make HTTPS request
function makeRequest(options, data = null) {
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

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Fetch unprocessed pages from Supabase
async function fetchUnprocessedPages() {
  console.log('📥 Fetching unprocessed RPS pages from database...');

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

  // Filter to only parts lists
  const partsLists = response.data.filter(page =>
    page.metadata && page.metadata.is_parts_list === true
  );

  console.log(`✓ Found ${partsLists.length} unprocessed parts list pages\n`);
  return partsLists;
}

// OCR a single page with GPT-4o Vision
async function ocrPage(page) {
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

  const response = await makeRequest(options, requestBody);

  if (response.status !== 200) {
    throw new Error(`OpenAI API error: ${JSON.stringify(response.data)}`);
  }

  return response.data.choices[0].message.content;
}

// Main processing function
async function main() {
  console.log('==========================================');
  console.log('RPS OCR Processing - Local Batch');
  console.log('==========================================\n');

  // Fetch pages
  const pages = await fetchUnprocessedPages();

  if (pages.length === 0) {
    console.log('✓ No pages to process!');
    return;
  }

  console.log(`Processing ${pages.length} pages...`);
  console.log(`Estimated time: ~${Math.ceil(pages.length * 6 / 60)} minutes\n`);

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  // Process each page
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const progress = `[${i + 1}/${pages.length}]`;

    console.log(`${progress} Page ${page.page_number}: ${page.section_title}`);

    try {
      const ocrText = await ocrPage(page);

      if (ocrText) {
        results.push({
          id: page.id,
          ocr_text: ocrText,
          page_number: page.page_number
        });
        successCount++;
        console.log(`  ✓ Extracted ${ocrText.length} characters`);
      } else {
        console.log(`  ✗ Empty response`);
        errorCount++;
      }

      // Rate limiting - wait 1 second between requests
      if (i < pages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log('\n==========================================');
  console.log('Processing Complete');
  console.log('==========================================');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}\n`);

  // Generate SQL file
  console.log('📝 Generating SQL update file...');

  const sqlStatements = results.map(result => {
    const escapedText = result.ocr_text.replace(/'/g, "''");
    return `UPDATE manual_chunks
SET
  ocr_text = '${escapedText}',
  content = '${escapedText}',
  ocr_processed = true,
  ocr_processed_at = NOW()
WHERE id = '${result.id}';`;
  });

  const sqlContent = `-- RPS OCR Updates
-- Generated: ${new Date().toISOString()}
-- Pages processed: ${results.length}

BEGIN;

${sqlStatements.join('\n\n')}

COMMIT;

-- Verify results
SELECT
  COUNT(*) FILTER (WHERE ocr_processed = true) as processed,
  COUNT(*) FILTER (WHERE ocr_processed = false) as unprocessed
FROM manual_chunks
WHERE manual_title = 'RPS Catalog';
`;

  const outputDir = path.join(__dirname, 'output');
  const outputPath = path.join(outputDir, 'rps_ocr_updates.sql');

  // Create output directory if needed
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, sqlContent);

  console.log(`✓ SQL file saved to: ${outputPath}\n`);
  console.log('To apply updates:');
  console.log('1. Review the SQL file');
  console.log('2. Run in Supabase SQL Editor\n');
}

// Run
main()
  .then(() => {
    console.log('✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
