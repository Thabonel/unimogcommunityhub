import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL:', !!supabaseUrl);
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function processExistingManuals() {
  try {
    console.log('🔍 Fetching existing manuals from storage...');
    
    // List all files in the manuals bucket
    const { data: files, error: listError } = await supabase.storage
      .from('manuals')
      .list();

    if (listError) {
      console.error('❌ Error listing files:', listError);
      return;
    }

    if (!files || files.length === 0) {
      console.log('📄 No files found in manuals bucket');
      return;
    }

    console.log(`📚 Found ${files.length} files in storage`);
    
    // Filter for PDF files only
    const pdfFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.pdf') && 
      !file.name.startsWith('.') // Skip hidden files
    );

    if (pdfFiles.length === 0) {
      console.log('📄 No PDF files found to process');
      return;
    }

    console.log(`📋 Processing ${pdfFiles.length} PDF files:`);
    pdfFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (${(file.metadata?.size || 0 / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Check which files are already processed
    const { data: processedFiles, error: processedError } = await supabase
      .from('manual_metadata')
      .select('filename, processed_at')
      .in('filename', pdfFiles.map(f => f.name));

    if (processedError) {
      console.warn('⚠️  Could not check processed files:', processedError);
    }

    const processedFilenames = new Set(
      (processedFiles || [])
        .filter(f => f.processed_at) // Only count actually processed files
        .map(f => f.filename)
    );

    const unprocessedFiles = pdfFiles.filter(file => !processedFilenames.has(file.name));
    
    if (processedFilenames.size > 0) {
      console.log(`✅ ${processedFilenames.size} files already processed`);
    }
    
    if (unprocessedFiles.length === 0) {
      console.log('🎉 All PDF files are already processed!');
      return;
    }

    console.log(`🚀 Processing ${unprocessedFiles.length} unprocessed files...`);

    // Process each unprocessed file
    const results = [];
    for (let i = 0; i < unprocessedFiles.length; i++) {
      const file = unprocessedFiles[i];
      console.log(`\n📖 Processing ${i + 1}/${unprocessedFiles.length}: ${file.name}`);
      
      try {
        // Call the process-manual edge function
        const response = await fetch(`${supabaseUrl}/functions/v1/process-manual`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            filename: file.name,
            bucket: 'manuals'
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        results.push({
          filename: file.name,
          success: true,
          result
        });

        console.log(`   ✅ Success: ${result.chunks} chunks from ${result.pages} pages`);
        if (result.model_codes && result.model_codes.length > 0) {
          console.log(`   🚗 Models: ${result.model_codes.join(', ')}`);
        }
        console.log(`   📂 Category: ${result.category}`);

      } catch (error) {
        console.error(`   ❌ Error processing ${file.name}:`, error.message);
        results.push({
          filename: file.name,
          success: false,
          error: error.message
        });
      }

      // Add a small delay between processing to avoid overwhelming the system
      if (i < unprocessedFiles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Summary
    console.log('\n📊 Processing Summary:');
    console.log('═'.repeat(50));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successfully processed: ${successful.length}`);
    successful.forEach(r => {
      const chunks = r.result?.chunks || 0;
      const pages = r.result?.pages || 0;
      console.log(`   • ${r.filename}: ${chunks} chunks, ${pages} pages`);
    });
    
    if (failed.length > 0) {
      console.log(`❌ Failed to process: ${failed.length}`);
      failed.forEach(r => {
        console.log(`   • ${r.filename}: ${r.error}`);
      });
    }

    const totalChunks = successful.reduce((sum, r) => sum + (r.result?.chunks || 0), 0);
    const totalPages = successful.reduce((sum, r) => sum + (r.result?.pages || 0), 0);
    
    console.log(`\n🎯 Total: ${totalChunks} chunks from ${totalPages} pages`);
    console.log('🤖 Barry can now access all processed manuals!');

  } catch (error) {
    console.error('💥 Script error:', error);
    process.exit(1);
  }
}

// Run the script
processExistingManuals()
  .then(() => {
    console.log('\n✨ Processing complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });