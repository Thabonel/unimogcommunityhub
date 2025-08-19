import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// IMPORTANT: You need to add SUPABASE_SERVICE_ROLE_KEY to your .env file
// Get it from: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env file');
  console.log('\nTo get your service role key:');
  console.log('1. Go to https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api');
  console.log('2. Copy the "service_role" key (starts with eyJ...)');
  console.log('3. Add to .env file: SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function processAllManuals() {
  console.log('🚀 Starting batch manual processing with service role...\n');
  
  try {
    // Step 1: Get all files from storage
    console.log('📚 Fetching files from storage...');
    const { data: files, error: listError } = await supabase.storage
      .from('manuals')
      .list('', { limit: 100 });
    
    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`);
    }
    
    const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
    console.log(`Found ${pdfFiles.length} PDF files\n`);
    
    // Step 2: Check which ones need processing
    console.log('🔍 Checking processing status...');
    const { data: existingMetadata } = await supabase
      .from('manual_metadata')
      .select('filename, processing_status, chunk_count');
    
    const processedFiles = new Set(
      existingMetadata
        ?.filter(m => m.processing_status === 'completed' && m.chunk_count > 0)
        ?.map(m => m.filename) || []
    );
    
    const unprocessedFiles = pdfFiles.filter(f => !processedFiles.has(f.name));
    console.log(`✅ Already processed: ${processedFiles.size}`);
    console.log(`📋 Need processing: ${unprocessedFiles.length}\n`);
    
    if (unprocessedFiles.length === 0) {
      console.log('✨ All files are already processed!');
      return;
    }
    
    // Step 3: Process each unprocessed file
    let successCount = 0;
    let failureCount = 0;
    const errors = [];
    
    for (let i = 0; i < unprocessedFiles.length; i++) {
      const file = unprocessedFiles[i];
      console.log(`\n[${i + 1}/${unprocessedFiles.length}] Processing: ${file.name}`);
      
      try {
        // Create or update metadata entry
        const { data: metadata, error: metadataError } = await supabase
          .from('manual_metadata')
          .upsert({
            filename: file.name,
            title: file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
            category: categorizeManual(file.name),
            model_codes: extractModelCodes(file.name),
            file_size: file.metadata?.size || 0,
            uploaded_by: 'c2a7f96f-09f0-4b8d-b5d3-0f8e0f8e0f8e', // System user
            approval_status: 'approved',
            processing_status: 'pending'
          }, { 
            onConflict: 'filename',
            ignoreDuplicates: false 
          })
          .select()
          .single();
        
        if (metadataError) {
          throw new Error(`Metadata error: ${metadataError.message}`);
        }
        
        // Call the Edge Function
        console.log('   📡 Calling Edge Function...');
        const response = await fetch(
          `${process.env.VITE_SUPABASE_URL}/functions/v1/process-manual`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              filename: file.name,
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
        successCount++;
        
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}`);
        errors.push({ file: file.name, error: error.message });
        failureCount++;
        
        // Update status to failed
        await supabase
          .from('manual_metadata')
          .update({ 
            processing_status: 'failed',
            error_message: error.message 
          })
          .eq('filename', file.name);
      }
      
      // Small delay between files to avoid rate limits
      if (i < unprocessedFiles.length - 1) {
        console.log('   ⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Step 4: Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 PROCESSING COMPLETE');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log(`📚 Total processed: ${successCount + failureCount}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(e => {
        console.log(`   ${e.file}: ${e.error}`);
      });
    }
    
    // Show final status
    const { data: finalStatus } = await supabase
      .from('manual_metadata')
      .select('processing_status, count')
      .select('processing_status');
    
    console.log('\n📈 Final database status:');
    const statusCounts = {};
    finalStatus?.forEach(row => {
      statusCounts[row.processing_status] = (statusCounts[row.processing_status] || 0) + 1;
    });
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Helper functions
function categorizeManual(filename) {
  const lower = filename.toLowerCase();
  
  if (lower.includes('operator') || lower.includes('owner')) return 'operator';
  if (lower.includes('service') || lower.includes('repair')) return 'service';
  if (lower.includes('parts') || lower.includes('catalog')) return 'parts';
  if (lower.includes('workshop')) return 'workshop';
  if (lower.includes('technical') || lower.includes('specification')) return 'technical';
  if (lower.includes('maintenance')) return 'maintenance';
  if (lower.includes('electrical') || lower.includes('wiring')) return 'electrical';
  if (lower.includes('hydraulic')) return 'hydraulic';
  if (lower.includes('engine')) return 'engine';
  if (lower.includes('transmission') || lower.includes('gearbox')) return 'transmission';
  if (lower.includes('axle') || lower.includes('differential')) return 'drivetrain';
  if (lower.includes('modification') || lower.includes('mod')) return 'modification';
  if (lower.includes('crane')) return 'equipment';
  
  return 'general';
}

function extractModelCodes(filename) {
  const modelCodes = new Set();
  const patterns = [
    /U\d{3,4}[A-Z]?/g,  // U1700, U5023
    /404[.\s]?\d*/g,    // 404, 404.1
    /406/g, /411/g, /416/g, /421/g, /425/g, /435/g, /437/g,
    /UGN/g,             // UGN
    /FLU-419/g,         // SEE/FLU-419
  ];

  patterns.forEach(pattern => {
    const matches = filename.match(pattern);
    if (matches) {
      matches.forEach(match => modelCodes.add(match.trim()));
    }
  });

  return Array.from(modelCodes);
}

// Run the processing
console.log('='.repeat(60));
console.log('UNIMOG MANUAL BATCH PROCESSOR');
console.log('='.repeat(60));
console.log('This script will process all unprocessed manuals in the storage bucket');
console.log('Using service role key to bypass RLS restrictions\n');

processAllManuals().catch(console.error);