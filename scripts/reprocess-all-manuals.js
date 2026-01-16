import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

/**
 * REPROCESS ALL MANUALS
 *
 * This script will:
 * 1. Delete ALL existing chunks from manual_chunks (they have bad page numbers)
 * 2. Reprocess ALL manuals using the proper edge function that:
 *    - Extracts text page-by-page using PDF.js
 *    - Stores ACTUAL page numbers
 *    - Generates embeddings for vector search
 *
 * Run with: node scripts/reprocess-all-manuals.js
 */

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL not found in .env file');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deleteAllChunks() {
  console.log('🗑️  Deleting ALL existing manual chunks...');

  // Get count first
  const { count: beforeCount } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true });

  console.log(`   Found ${beforeCount || 0} existing chunks`);

  if (beforeCount && beforeCount > 0) {
    // Delete in batches to avoid timeout
    let deleted = 0;
    while (true) {
      const { data, error } = await supabase
        .from('manual_chunks')
        .delete()
        .limit(1000)
        .select('id');

      if (error) {
        console.error('   Error deleting chunks:', error.message);
        break;
      }

      if (!data || data.length === 0) break;

      deleted += data.length;
      console.log(`   Deleted ${deleted} chunks so far...`);
    }

    console.log(`✅ Deleted ${deleted} chunks total`);
  }

  // Also reset manual_metadata processing status
  const { error: resetError } = await supabase
    .from('manual_metadata')
    .update({
      processing_status: 'pending',
      chunk_count: 0,
      processed_at: null
    })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all rows

  if (resetError) {
    console.log('   Note: Could not reset manual_metadata:', resetError.message);
  } else {
    console.log('✅ Reset manual_metadata processing status');
  }
}

async function processManual(filename, index, total) {
  console.log(`\n[${index + 1}/${total}] Processing: ${filename}`);

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/process-manual`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: filename,
          bucket: 'manuals'
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge Function error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log(`   ✅ Success! Created ${result.chunks} chunks from ${result.pages} pages`);
    return { success: true, chunks: result.chunks, pages: result.pages };

  } catch (error) {
    console.error(`   ❌ Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('REPROCESS ALL MANUALS - FIX PAGE NUMBERS & ADD EMBEDDINGS');
  console.log('='.repeat(60));
  console.log('');
  console.log('This will DELETE all existing chunks and reprocess from scratch.');
  console.log('The new chunks will have:');
  console.log('  ✓ ACTUAL page numbers (not fake chunk_index/3)');
  console.log('  ✓ OpenAI embeddings for vector search');
  console.log('  ✓ Proper section titles');
  console.log('');

  // Step 1: Get all PDF files from storage
  console.log('📚 Fetching files from storage...');
  const { data: files, error: listError } = await supabase.storage
    .from('manuals')
    .list('', { limit: 200 });

  if (listError) {
    console.error('❌ Failed to list files:', listError.message);
    process.exit(1);
  }

  const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
  console.log(`Found ${pdfFiles.length} PDF files\n`);

  if (pdfFiles.length === 0) {
    console.log('No PDF files found in storage bucket.');
    process.exit(0);
  }

  // Step 2: Delete all existing chunks
  await deleteAllChunks();

  // Step 3: Process each file
  console.log('\n' + '='.repeat(60));
  console.log('STARTING REPROCESSING');
  console.log('='.repeat(60));

  let successCount = 0;
  let failureCount = 0;
  let totalChunks = 0;
  let totalPages = 0;
  const errors = [];

  for (let i = 0; i < pdfFiles.length; i++) {
    const file = pdfFiles[i];
    const result = await processManual(file.name, i, pdfFiles.length);

    if (result.success) {
      successCount++;
      totalChunks += result.chunks || 0;
      totalPages += result.pages || 0;
    } else {
      failureCount++;
      errors.push({ file: file.name, error: result.error });
    }

    // Delay between files to avoid rate limits and give the edge function time
    if (i < pdfFiles.length - 1) {
      console.log('   ⏳ Waiting 3 seconds before next file...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Step 4: Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 REPROCESSING COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount} manuals`);
  console.log(`❌ Failed: ${failureCount} manuals`);
  console.log(`📄 Total pages processed: ${totalPages}`);
  console.log(`📝 Total chunks created: ${totalChunks}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(e => {
      console.log(`   ${e.file}: ${e.error}`);
    });
  }

  // Verify final state
  const { count: finalCount } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true });

  const { count: withEmbeddings } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null);

  console.log('\n📈 Final database status:');
  console.log(`   Total chunks: ${finalCount || 0}`);
  console.log(`   Chunks with embeddings: ${withEmbeddings || 0}`);

  if (finalCount && withEmbeddings) {
    const coverage = ((withEmbeddings / finalCount) * 100).toFixed(1);
    console.log(`   Embedding coverage: ${coverage}%`);
  }

  console.log('\n✨ Barry should now return correct manual pages!');
  console.log('   Test with: "How do I change the portal hub oil on my U435?"');
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
