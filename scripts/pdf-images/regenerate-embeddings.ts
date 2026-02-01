/**
 * Regenerate Embeddings Script
 * Updates embeddings to 1536 dimensions using text-embedding-3-small
 *
 * Usage:
 * SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> OPENAI_API_KEY=<OPENAI_API_KEY> npx ts-node regenerate-embeddings.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = <SUPABASE_SERVICE_ROLE_KEY> || '';
const OPENAI_API_KEY = <OPENAI_API_KEY> || '';
const EMBEDDING_MODEL = 'text-embedding-3-small';
const TARGET_DIMENSION = 1536;
const BATCH_SIZE = 10;
const RATE_LIMIT_DELAY = 100;

interface Chunk {
  id: string;
  content: string;
  manual_title: string;
  section_title: string;
  page_number: number;
  embedding: number[] | null;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      input: text,
      model: EMBEDDING_MODEL,
      encoding_format: 'float'
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function createEmbeddingText(chunk: Chunk): string {
  const parts = [];
  if (chunk.manual_title) parts.push(`Manual: ${chunk.manual_title}`);
  if (chunk.section_title) parts.push(`Section: ${chunk.section_title}`);
  if (chunk.page_number) parts.push(`Page: ${chunk.page_number}`);
  if (chunk.content) parts.push(`Content: ${chunk.content}`);
  return parts.join('\n\n');
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  console.log('Checking for embeddings needing regeneration...');

  const { data: stats, error: statsError } = await supabase
    .rpc('check_embedding_stats');

  if (statsError) {
    console.log('Stats function not available, checking manually...');
  } else {
    console.log('Embedding stats:', stats);
  }

  const { data: wrongDimChunks, error: fetchError } = await supabase
    .from('manual_chunks')
    .select('id, content, manual_title, section_title, page_number')
    .not('embedding', 'is', null)
    .limit(1000);

  if (fetchError) {
    console.error('Error fetching chunks:', fetchError);
    process.exit(1);
  }

  const chunksToProcess = wrongDimChunks || [];
  console.log(`Found ${chunksToProcess.length} chunks to check`);

  let processed = 0;
  let errors = 0;
  let skipped = 0;

  for (let i = 0; i < chunksToProcess.length; i += BATCH_SIZE) {
    const batch = chunksToProcess.slice(i, i + BATCH_SIZE);

    for (const chunk of batch) {
      try {
        const { data: fullChunk } = await supabase
          .from('manual_chunks')
          .select('embedding')
          .eq('id', chunk.id)
          .single();

        if (fullChunk?.embedding) {
          const embeddingArray = typeof fullChunk.embedding === 'string'
            ? JSON.parse(fullChunk.embedding)
            : fullChunk.embedding;

          if (embeddingArray.length === TARGET_DIMENSION) {
            skipped++;
            continue;
          }
        }

        const embeddingText = createEmbeddingText(chunk as Chunk);
        const newEmbedding = await generateEmbedding(embeddingText);

        if (newEmbedding.length !== TARGET_DIMENSION) {
          console.error(`Unexpected dimension: ${newEmbedding.length}`);
          errors++;
          continue;
        }

        const { error: updateError } = await supabase
          .from('manual_chunks')
          .update({ embedding: `[${newEmbedding.join(',')}]` })
          .eq('id', chunk.id);

        if (updateError) {
          console.error(`Update error for ${chunk.id}:`, updateError);
          errors++;
          continue;
        }

        processed++;
        console.log(`Regenerated embedding for chunk ${chunk.id} (${processed} done)`);

        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));

      } catch (err) {
        console.error(`Error processing chunk ${chunk.id}:`, err);
        errors++;
      }
    }

    console.log(`Progress: ${i + batch.length}/${chunksToProcess.length}`);
  }

  console.log('\n=== Regeneration Complete ===');
  console.log(`Processed: ${processed}`);
  console.log(`Skipped (already correct): ${skipped}`);
  console.log(`Errors: ${errors}`);
}

main().catch(console.error);
