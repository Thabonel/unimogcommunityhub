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

// List of manuals to process (in order)
const MANUALS_TO_PROCESS = [
  // Start with smaller files first
  'G607-01 Modification-Brushguard.pdf',
  'G607-04 Modification - Hydraulic Jack Storage Provision.pdf',
  'G617-15 Modification Coolant System.pdf',
  'G617-18 Modification 12V and 24V Batteries.pdf',
  'G619-10 Miscellaneous Instruction.pdf',
  // Then process medium-sized files
  'G603-36 Chassis Light Repair.pdf',
  'G604-19 Body 1250L Medium and Heavy Repair.pdf',
  'G609-02 Servicing Instructions.pdf',
  'G609-10 Main Drive.pdf',
  'G629-02 Servicing Crane.pdf',
  // Finally, process larger files
  'G600-02 Data Summary.pdf',
  'G650-01 RAAF Data Summary.pdf',
  'RPS-02202 Rev 3.pdf',
  'UHB-Unimog-Cargo.pdf'
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processManual(filename) {
  console.log(`\n🔄 Processing: ${filename}`);
  
  try {
    // First, check if already processed
    const { data: existingMetadata } = await supabase
      .from('manual_metadata')
      .select('id, processing_status')
      .eq('filename', filename)
      .single();
    
    if (existingMetadata?.processing_status === 'completed') {
      console.log(`✅ Already processed: ${filename}`);
      return true;
    }
    
    // Get the file URL
    const { data: { publicUrl } } = supabase.storage
      .from('manuals')
      .getPublicUrl(filename);
    
    console.log(`📎 File URL: ${publicUrl}`);
    
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
    console.log(`📊 Response:`, data);
    
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

async function processAllManuals() {
  console.log('🚀 Starting sequential manual processing...');
  console.log(`📚 Will process ${MANUALS_TO_PROCESS.length} manuals`);
  
  let successCount = 0;
  let failureCount = 0;
  
  for (const filename of MANUALS_TO_PROCESS) {
    const success = await processManual(filename);
    
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Wait between processing to avoid overwhelming the system
    console.log('\n⏳ Waiting 10 seconds before next manual...\n');
    await delay(10000);
  }
  
  console.log('\n✨ Processing complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  
  // Show final status
  const { data: allMetadata } = await supabase
    .from('manual_metadata')
    .select('filename, processing_status, chunk_count')
    .order('created_at', { ascending: false });
  
  console.log('\n📊 Final Status:');
  allMetadata?.forEach(m => {
    console.log(`- ${m.filename}: ${m.processing_status} (${m.chunk_count || 0} chunks)`);
  });
}

// Add authentication check
async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    console.error('❌ Not authenticated. Please log in first.');
    return false;
  }
  
  console.log(`✅ Authenticated as: ${user.email}`);
  return true;
}

// Main execution
async function main() {
  // Check if we're authenticated
  const isAuth = await checkAuth();
  if (!isAuth) {
    process.exit(1);
  }
  
  // Start processing
  await processAllManuals();
}

main().catch(console.error);