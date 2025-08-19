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

// Admin credentials - you should replace these or use environment variables
const ADMIN_EMAIL = 'thabonel0@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loginAsAdmin() {
  console.log('🔐 Logging in as admin...');
  
  if (!ADMIN_PASSWORD) {
    console.error('❌ ADMIN_PASSWORD environment variable not set');
    console.log('Please set ADMIN_PASSWORD in your .env file or run:');
    console.log('ADMIN_PASSWORD=yourpassword node scripts/process-manuals-admin.js');
    return false;
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  });
  
  if (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
  
  console.log('✅ Logged in as:', ADMIN_EMAIL);
  return true;
}

async function processManual(filename) {
  console.log(`\n🔄 Processing: ${filename}`);
  
  try {
    // Check if already processed
    const { data: existingMetadata } = await supabase
      .from('manual_metadata')
      .select('id, processing_status, chunk_count')
      .eq('filename', filename)
      .single();
    
    if (existingMetadata?.processing_status === 'completed') {
      console.log(`✅ Already processed: ${filename} (${existingMetadata.chunk_count} chunks)`);
      return true;
    }
    
    // Call the process-manual Edge Function
    console.log(`🚀 Calling Edge Function...`);
    
    const { data, error } = await supabase.functions.invoke('process-manual', {
      body: {
        filename: filename,
        bucket: 'manuals'
      }
    });
    
    if (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
      return false;
    }
    
    console.log(`✅ Successfully queued: ${filename}`);
    
    // Wait a bit before checking status
    await delay(5000);
    
    // Check processing status
    const { data: metadata } = await supabase
      .from('manual_metadata')
      .select('processing_status, chunk_count, error_message')
      .eq('filename', filename)
      .single();
    
    if (metadata) {
      console.log(`📈 Status: ${metadata.processing_status}`);
      if (metadata.chunk_count) {
        console.log(`📄 Chunks created: ${metadata.chunk_count}`);
      }
      if (metadata.error_message) {
        console.log(`⚠️ Error: ${metadata.error_message}`);
      }
    }
    
    return true;
    
  } catch (err) {
    console.error(`❌ Failed to process ${filename}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting manual processing with admin authentication...');
  
  // Login first
  const isLoggedIn = await loginAsAdmin();
  if (!isLoggedIn) {
    process.exit(1);
  }
  
  // Get list of manuals
  console.log('\n📚 Fetching manual list...');
  const { data: files, error: listError } = await supabase.storage
    .from('manuals')
    .list('', {
      limit: 100,
      offset: 0
    });
  
  if (listError) {
    console.error('❌ Error listing files:', listError.message);
    process.exit(1);
  }
  
  console.log(`📚 Found ${files.length} manuals`);
  
  // Filter out already processed manuals
  const unprocessedFiles = [];
  for (const file of files) {
    const { data: metadata } = await supabase
      .from('manual_metadata')
      .select('processing_status')
      .eq('filename', file.name)
      .single();
    
    if (!metadata || metadata.processing_status !== 'completed') {
      unprocessedFiles.push(file.name);
    }
  }
  
  console.log(`📋 ${unprocessedFiles.length} manuals need processing`);
  
  if (unprocessedFiles.length === 0) {
    console.log('✨ All manuals are already processed!');
    return;
  }
  
  // Process each manual
  let successCount = 0;
  let failureCount = 0;
  
  // Process in smaller batches
  const BATCH_SIZE = 5;
  for (let i = 0; i < unprocessedFiles.length; i += BATCH_SIZE) {
    const batch = unprocessedFiles.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Processing batch ${Math.floor(i/BATCH_SIZE) + 1} of ${Math.ceil(unprocessedFiles.length/BATCH_SIZE)}`);
    
    for (const filename of batch) {
      const success = await processManual(filename);
      
      if (success) {
        successCount++;
      } else {
        failureCount++;
      }
      
      // Wait between files
      console.log('\n⏳ Waiting 10 seconds before next manual...\n');
      await delay(10000);
    }
    
    // Longer wait between batches
    if (i + BATCH_SIZE < unprocessedFiles.length) {
      console.log('\n⏳ Waiting 30 seconds before next batch...\n');
      await delay(30000);
    }
  }
  
  console.log('\n✨ Processing complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  
  // Show final status
  const { data: allMetadata } = await supabase
    .from('manual_metadata')
    .select('filename, processing_status, chunk_count')
    .order('created_at', { ascending: false });
  
  console.log('\n📊 Final Status Summary:');
  const completed = allMetadata?.filter(m => m.processing_status === 'completed').length || 0;
  const failed = allMetadata?.filter(m => m.processing_status === 'failed').length || 0;
  const processing = allMetadata?.filter(m => m.processing_status === 'processing').length || 0;
  
  console.log(`✅ Completed: ${completed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`🔄 Still processing: ${processing}`);
  
  // Calculate total chunks
  const totalChunks = allMetadata?.reduce((sum, m) => sum + (m.chunk_count || 0), 0) || 0;
  console.log(`📄 Total chunks created: ${totalChunks}`);
}

// Run the processing
main().catch(console.error);