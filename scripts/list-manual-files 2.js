import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function listManuals() {
  console.log('📚 Fetching manuals from storage...\n');
  
  // List files in the manuals bucket
  const { data: files, error } = await supabase.storage
    .from('manuals')
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });
  
  if (error) {
    console.error('❌ Error listing files:', error.message);
    return;
  }
  
  console.log(`Found ${files.length} files in the manuals bucket\n`);
  
  // Get metadata for each file
  const filesWithMetadata = await Promise.all(
    files.map(async (file) => {
      const { data: metadata } = await supabase
        .from('manual_metadata')
        .select('*')
        .eq('filename', file.name)
        .single();
      
      return {
        ...file,
        metadata
      };
    })
  );
  
  // Group by processing status
  const completed = filesWithMetadata.filter(f => f.metadata?.processing_status === 'completed');
  const processing = filesWithMetadata.filter(f => f.metadata?.processing_status === 'processing');
  const failed = filesWithMetadata.filter(f => f.metadata?.processing_status === 'failed');
  const unprocessed = filesWithMetadata.filter(f => !f.metadata);
  
  // Display results
  console.log('✅ COMPLETED (' + completed.length + ')');
  console.log('=================');
  completed.forEach(f => {
    console.log(`  ${f.name}`);
    console.log(`    - Chunks: ${f.metadata.chunk_count}`);
    console.log(`    - Processed: ${new Date(f.metadata.updated_at).toLocaleDateString()}`);
  });
  
  console.log('\n🔄 PROCESSING (' + processing.length + ')');
  console.log('==================');
  processing.forEach(f => {
    console.log(`  ${f.name}`);
    console.log(`    - Started: ${new Date(f.metadata.created_at).toLocaleDateString()}`);
  });
  
  console.log('\n❌ FAILED (' + failed.length + ')');
  console.log('=============');
  failed.forEach(f => {
    console.log(`  ${f.name}`);
    console.log(`    - Error: ${f.metadata.error_message || 'Unknown error'}`);
  });
  
  console.log('\n⚪ UNPROCESSED (' + unprocessed.length + ')');
  console.log('==================');
  unprocessed.forEach(f => {
    console.log(`  ${f.name} (${(f.metadata?.size / 1024 / 1024).toFixed(2)} MB)`);
  });
  
  // Summary
  console.log('\n📊 SUMMARY');
  console.log('==========');
  console.log(`Total files: ${files.length}`);
  console.log(`Completed: ${completed.length}`);
  console.log(`Processing: ${processing.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Unprocessed: ${unprocessed.length}`);
  
  // Calculate total chunks
  const totalChunks = completed.reduce((sum, f) => sum + (f.metadata?.chunk_count || 0), 0);
  console.log(`\nTotal chunks created: ${totalChunks}`);
  
  // Show public URLs for testing
  console.log('\n🔗 SAMPLE PUBLIC URLS (for testing)');
  console.log('====================================');
  const sampleFiles = files.slice(0, 3);
  sampleFiles.forEach(file => {
    const { data } = supabase.storage.from('manuals').getPublicUrl(file.name);
    console.log(`${file.name}:`);
    console.log(`  ${data.publicUrl}`);
  });
}

// Run the listing
listManuals().catch(console.error);