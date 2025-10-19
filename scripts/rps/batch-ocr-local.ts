/**
 * Local OCR Processing Script
 *
 * Processes all RPS parts list pages locally using OpenAI GPT-4o Vision
 * Generates SQL file to update the database
 *
 * Usage:
 *   OPENAI_API_KEY=<OPENAI_API_KEY> SUPABASE_URL=url SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> npx tsx scripts/rps/batch-ocr-local.ts
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = <SUPABASE_SERVICE_ROLE_KEY>
const OPENAI_API_KEY = <OPENAI_API_KEY>

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error('Missing required environment variables:');
  console.error('- SUPABASE_URL or VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('- OPENAI_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

interface PartsListPage {
  id: string;
  page_number: number;
  section_title: string;
  page_image_url: string;
  metadata: {
    group_code: string;
    group_name: string;
  };
}

async function ocrPageWithGPT4Vision(imageUrl: string, groupInfo: string): Promise<string> {
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

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    max_tokens: 4096,
    temperature: 0.1
  });

  return response.choices[0]?.message?.content || '';
}

async function main() {
  console.log('========================================');
  console.log('RPS OCR Processing - Local Batch');
  console.log('========================================');
  console.log('');

  // Fetch unprocessed pages
  console.log('Fetching unprocessed RPS pages...');
  const { data: pages, error } = await supabase
    .from('manual_chunks')
    .select('*')
    .eq('manual_title', 'RPS Catalog')
    .eq('ocr_processed', false)
    .order('page_number', { ascending: true });

  if (error) {
    console.error('Failed to fetch pages:', error);
    process.exit(1);
  }

  // Filter to parts lists only
  const partsListPages = (pages || []).filter(
    (page: any) => page.metadata?.is_parts_list === true
  ) as PartsListPage[];

  console.log(`Found ${partsListPages.length} unprocessed parts list pages`);
  console.log('');

  const results: Array<{ id: string; ocr_text: string; page_number: number }> = [];
  let successCount = 0;
  let errorCount = 0;

  // Process each page
  for (let i = 0; i < partsListPages.length; i++) {
    const page = partsListPages[i];
    const progress = `[${i + 1}/${partsListPages.length}]`;

    console.log(`${progress} Page ${page.page_number}: ${page.section_title}`);

    try {
      const groupInfo = `${page.metadata.group_code} - ${page.metadata.group_name}`;
      const ocrText = await ocrPageWithGPT4Vision(page.page_image_url, groupInfo);

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

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (err: any) {
      console.error(`  ✗ Error: ${err.message}`);
      errorCount++;
    }
  }

  console.log('');
  console.log('========================================');
  console.log('Processing Complete');
  console.log('========================================');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log('');

  // Generate SQL file
  console.log('Generating SQL update file...');

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

  const outputPath = path.join(__dirname, 'output', 'rps_ocr_updates.sql');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, sqlContent);

  console.log(`✓ SQL file saved to: ${outputPath}`);
  console.log('');
  console.log('To apply updates:');
  console.log('1. Review the SQL file');
  console.log('2. Run in Supabase SQL Editor');
  console.log('');
}

main()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
