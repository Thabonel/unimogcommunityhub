/**
 * Batch Embedding Generation for Phase 8 Updated Chunks
 *
 * Generates embeddings in small batches to avoid edge function timeouts.
 * Processes 25 chunks at a time with delays between batches.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BATCH_SIZE = 25; // Small batch to stay under timeout
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds between batches

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface Chunk {
  id: string;
  content: string;
  page_number: number;
  section_title: string;
}

// Call edge function to process a batch
async function processBatch(batchSize: number): Promise<{ processed: number; errors: number }> {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embeddings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      batchSize: batchSize,
      resume: true // Only process chunks without embeddings
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding generation failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(`Embedding generation failed: ${data.error || 'Unknown error'}`);
  }

  return {
    processed: data.processed || 0,
    errors: data.errors || 0
  };
}

// Delay helper
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('='.repeat(70));
  console.log('BATCH EMBEDDING GENERATION');
  console.log('='.repeat(70));
  console.log('');

  // Count chunks needing embeddings
  const { count, error: countError } = await supabase
    .from('manual_chunks')
    .select('id', { count: 'exact', head: true })
    .eq('manual_title', 'RPS Catalog')
    .eq('extraction_method', 'enhanced')
    .is('embedding', null);

  if (countError) {
    console.error('Error counting chunks:', countError);
    process.exit(1);
  }

  if (!count || count === 0) {
    console.log('No chunks need embeddings!');
    process.exit(0);
  }

  console.log(`Found ${count} chunks needing embeddings`);
  console.log(`Processing in batches of ${BATCH_SIZE} via edge function`);
  console.log('');

  let totalProcessed = 0;
  let totalErrors = 0;
  let batchNumber = 1;

  // Keep calling edge function until no more chunks need processing
  while (totalProcessed < count) {
    console.log(`[Batch ${batchNumber}] Calling edge function for up to ${BATCH_SIZE} chunks...`);

    try {
      const result = await processBatch(BATCH_SIZE);

      totalProcessed += result.processed;
      totalErrors += result.errors;

      console.log(`  Batch complete: ${result.processed} processed, ${result.errors} errors`);
      console.log(`  Total progress: ${totalProcessed}/${count} chunks (${((totalProcessed / count) * 100).toFixed(1)}%)`);
      console.log('');

      // If no chunks were processed, we're done
      if (result.processed === 0) {
        console.log('No more chunks to process.');
        break;
      }

      // Delay between batches
      if (totalProcessed < count) {
        console.log(`Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`);
        await delay(DELAY_BETWEEN_BATCHES);
        console.log('');
      }

      batchNumber++;
    } catch (error) {
      console.error(`Batch ${batchNumber} failed:`, error instanceof Error ? error.message : String(error));
      console.log('');

      // Wait longer on error before retrying
      console.log(`Waiting ${DELAY_BETWEEN_BATCHES * 2}ms before retry...`);
      await delay(DELAY_BETWEEN_BATCHES * 2);
      console.log('');

      batchNumber++;
    }
  }

  console.log('='.repeat(70));
  console.log('GENERATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`Total chunks processed: ${totalProcessed}`);
  console.log(`Total errors: ${totalErrors}`);
  console.log(`Success rate: ${totalProcessed > 0 ? ((totalProcessed / (totalProcessed + totalErrors)) * 100).toFixed(1) : 0}%`);
  console.log('');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
