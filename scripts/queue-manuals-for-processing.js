import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Create Supabase client with service role key if available
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function queueManualsForProcessing() {
  console.log('🚀 Queuing manuals for processing...\n');
  
  // Get list of manuals from storage
  const { data: files, error: listError } = await supabase.storage
    .from('manuals')
    .list('', {
      limit: 100,
      offset: 0
    });
  
  if (listError) {
    console.error('❌ Error listing files:', listError.message);
    return;
  }
  
  console.log(`📚 Found ${files.length} manuals in storage\n`);
  
  // Check which ones need processing
  let queued = 0;
  let skipped = 0;
  
  for (const file of files) {
    // Check if already in metadata
    const { data: existingMetadata } = await supabase
      .from('manual_metadata')
      .select('id, processing_status')
      .eq('filename', file.name)
      .single();
    
    if (existingMetadata?.processing_status === 'completed') {
      console.log(`✅ Already processed: ${file.name}`);
      skipped++;
      continue;
    }
    
    // Create metadata entry if it doesn't exist
    if (!existingMetadata) {
      console.log(`📝 Creating metadata for: ${file.name}`);
      
      const { error: insertError } = await supabase
        .from('manual_metadata')
        .insert({
          filename: file.name,
          title: file.name.replace(/\.pdf$/i, '').replace(/-/g, ' '),
          processing_status: 'pending',
          file_size: file.metadata?.size || 0,
          approval_status: 'approved', // Auto-approve for processing
          uploaded_by: 'c2a7f96f-09f0-4b8d-b5d3-0f8e0f8e0f8e' // System user ID
        });
      
      if (insertError) {
        console.error(`❌ Error creating metadata for ${file.name}:`, insertError.message);
        continue;
      }
    }
    
    // Add to processing queue
    console.log(`📋 Adding to queue: ${file.name}`);
    
    const { error: queueError } = await supabase
      .from('manual_processing_queue')
      .insert({
        manual_id: existingMetadata?.id || null,
        filename: file.name,
        status: 'pending'
      });
    
    if (queueError) {
      // Might already be in queue
      if (queueError.message.includes('duplicate')) {
        console.log(`⚠️  Already in queue: ${file.name}`);
      } else {
        console.error(`❌ Error queuing ${file.name}:`, queueError.message);
      }
    } else {
      queued++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Queued for processing: ${queued}`);
  console.log(`⏭️  Skipped (already processed): ${skipped}`);
  
  // Show queue status
  const { data: queueStatus, error: statusError } = await supabase
    .from('manual_processing_queue')
    .select('status, COUNT(*)')
    .group('status');
  
  if (queueStatus && !statusError) {
    console.log('\n📋 Queue Status:');
    queueStatus.forEach(status => {
      console.log(`${status.status}: ${status.count} items`);
    });
  }
  
  console.log('\n✨ Done! The system will now process these manuals automatically.');
  console.log('Check the manual_metadata table for processing progress.');
}

// Alternative: Direct processing trigger
async function triggerProcessingDirectly() {
  console.log('\n🔧 Alternative: Triggering processing directly...\n');
  
  // This would require calling the Edge Function with proper auth
  // For now, we'll use the queue method above
  console.log('ℹ️  Use the queue method above or run the Edge Function manually.');
}

// Run the queue method
queueManualsForProcessing().catch(console.error);