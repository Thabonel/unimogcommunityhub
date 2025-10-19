/**
 * RPS Parts Lists OCR Processor
 *
 * Batch processes all RPS parts list pages (82 total) using Unstructured.io
 * to extract part numbers, NIIN, NSN, and descriptions from PNG images.
 *
 * Usage:
 *   npx tsx scripts/rps/ocr-parts-lists.ts
 *
 * Environment variables required:
 *   - SUPABASE_URL or VITE_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - UNSTRUCTURED_API_KEY or VITE_UNSTRUCTURED_API_KEY
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = <SUPABASE_SERVICE_ROLE_KEY>
const UNSTRUCTURED_API_KEY = process.env.UNSTRUCTURED_API_KEY || process.env.VITE_UNSTRUCTURED_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !UNSTRUCTURED_API_KEY) {
  console.error('Missing required environment variables:');
  console.error('- SUPABASE_URL or VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('- UNSTRUCTURED_API_KEY or VITE_UNSTRUCTURED_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const UNSTRUCTURED_API_URL = 'https://api.unstructured.io/general/v0/partition';

interface PartsListPage {
  id: string;
  page_number: number;
  section_title: string;
  page_image_url: string;
  metadata: {
    group_code: string;
    group_name: string;
    callout_range: string;
  };
}

async function getUnprocessedPartsLists(): Promise<PartsListPage[]> {
  console.log('Fetching unprocessed RPS parts list pages...');

  const { data, error } = await supabase
    .from('manual_chunks')
    .select('id, page_number, section_title, page_image_url, metadata')
    .eq('manual_title', 'RPS Catalog')
    .eq('ocr_processed', false)
    .order('page_number', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch pages: ${error.message}`);
  }

  // Filter to only parts list pages
  const partsListPages = (data || []).filter(
    (page: any) => page.metadata?.is_parts_list === true
  );

  console.log(`Found ${partsListPages.length} unprocessed parts list pages`);
  return partsListPages as PartsListPage[];
}

async function ocrPartsListWithUnstructured(imageUrl: string, groupInfo: string): Promise<string> {
  console.log(`  OCR processing: ${imageUrl}`);

  try {
    // Download the PNG image first
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }

    const imageBlob = await imageResponse.blob();
    const imageFile = new File([imageBlob], 'parts_list.png', { type: 'image/png' });

    // Prepare form data for Unstructured.io API
    const formData = new FormData();
    formData.append('files', imageFile);

    // Use hi_res strategy for accurate table extraction
    formData.append('strategy', 'hi_res');
    formData.append('extract_image_block_types', '["Table"]');
    formData.append('infer_table_structure', 'true');
    formData.append('languages', 'eng');

    // Call Unstructured.io API
    const response = await fetch(UNSTRUCTURED_API_URL, {
      method: 'POST',
      headers: {
        'unstructured-api-key': UNSTRUCTURED_API_KEY!,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Unstructured API error: ${response.status} - ${errorText}`);
    }

    const elements = await response.json();

    if (!elements || elements.length === 0) {
      throw new Error('No elements extracted from image');
    }

    // Extract text from all elements and combine
    const extractedText = elements
      .map((el: any) => el.text || '')
      .filter((text: string) => text.trim().length > 0)
      .join('\n');

    if (!extractedText) {
      throw new Error('Empty OCR response from Unstructured.io');
    }

    console.log(`  ✓ OCR complete: ${extractedText.length} characters extracted`);
    return extractedText;
  } catch (error: any) {
    console.error(`  ✗ OCR failed: ${error.message}`);
    throw error;
  }
}

async function updatePageWithOCR(pageId: string, ocrText: string): Promise<void> {
  const { error } = await supabase
    .from('manual_chunks')
    .update({
      ocr_text: ocrText,
      ocr_processed: true,
      ocr_processed_at: new Date().toISOString(),
      // Also update content field for Barry's RAG search
      content: ocrText
    })
    .eq('id', pageId);

  if (error) {
    throw new Error(`Failed to update page: ${error.message}`);
  }

  console.log(`  ✓ Database updated`);
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processAllPartsLists(): Promise<void> {
  console.log('='.repeat(60));
  console.log('RPS PARTS LISTS - BATCH OCR PROCESSOR');
  console.log('='.repeat(60));
  console.log('');

  const pages = await getUnprocessedPartsLists();

  if (pages.length === 0) {
    console.log('No unprocessed pages found. All done!');
    return;
  }

  console.log(`Processing ${pages.length} parts list pages...`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const progress = `[${i + 1}/${pages.length}]`;

    console.log(`${progress} Page ${page.page_number} - ${page.section_title}`);

    try {
      // OCR the image
      const groupInfo = `${page.metadata.group_code} - ${page.metadata.group_name}`;
      const ocrText = await ocrPartsListWithUnstructured(page.page_image_url, groupInfo);

      // Update database
      await updatePageWithOCR(page.id, ocrText);

      successCount++;
      console.log(`${progress} ✓ Success`);

      // Rate limiting: 1 request per second
      if (i < pages.length - 1) {
        console.log(`  Waiting 1 second before next request...`);
        await sleep(1000);
      }

    } catch (error: any) {
      errorCount++;
      console.error(`${progress} ✗ Error: ${error.message}`);
      console.log(`  Continuing with next page...`);
    }

    console.log('');
  }

  console.log('='.repeat(60));
  console.log('BATCH OCR PROCESSING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total pages processed: ${pages.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log('');

  if (errorCount > 0) {
    console.log('Pages with errors can be reprocessed by running this script again.');
  }
}

// Run the script
processAllPartsLists()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
