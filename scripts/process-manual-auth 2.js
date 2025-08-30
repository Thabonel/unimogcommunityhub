import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to prompt for input
const prompt = (question) => new Promise((resolve) => rl.question(question, resolve));

// Admin login function
async function loginAsAdmin() {
  console.log('\n🔐 Admin Authentication Required\n');
  
  const email = await prompt('Email: ');
  const password = await prompt('Password: ');
  
  console.log('\n🔄 Logging in...');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
  
  console.log('✅ Logged in as:', email);
  return true;
}

// List manuals to process
async function listManuals() {
  console.log('\n📚 Fetching manual list...');
  
  const { data: files, error } = await supabase.storage
    .from('manuals')
    .list('', {
      limit: 100,
      offset: 0
    });
  
  if (error) {
    console.error('❌ Error listing files:', error.message);
    return [];
  }
  
  // Check processing status for each file
  const filesWithStatus = await Promise.all(
    files.map(async (file) => {
      const { data: metadata } = await supabase
        .from('manual_metadata')
        .select('processing_status, chunk_count')
        .eq('filename', file.name)
        .single();
      
      return {
        ...file,
        status: metadata?.processing_status || 'unprocessed',
        chunks: metadata?.chunk_count || 0
      };
    })
  );
  
  return filesWithStatus;
}

// Process a single manual
async function processManual(filename) {
  console.log(`\n🔄 Processing: ${filename}`);
  
  try {
    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('process-manual', {
      body: {
        filename: filename,
        bucket: 'manuals'
      }
    });
    
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return false;
    }
    
    console.log(`✅ Successfully queued for processing`);
    return true;
    
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    return false;
  }
}

// Monitor processing status
async function monitorProcessing(filename, maxWaitTime = 300000) { // 5 minutes max
  console.log(`\n👀 Monitoring processing status...`);
  
  const startTime = Date.now();
  let lastStatus = '';
  
  while (Date.now() - startTime < maxWaitTime) {
    const { data: metadata } = await supabase
      .from('manual_metadata')
      .select('processing_status, chunk_count, error_message')
      .eq('filename', filename)
      .single();
    
    if (metadata) {
      if (metadata.processing_status !== lastStatus) {
        lastStatus = metadata.processing_status;
        console.log(`📊 Status: ${metadata.processing_status}`);
        
        if (metadata.chunk_count) {
          console.log(`📄 Chunks created: ${metadata.chunk_count}`);
        }
        
        if (metadata.error_message) {
          console.log(`⚠️ Error: ${metadata.error_message}`);
        }
      }
      
      if (metadata.processing_status === 'completed' || metadata.processing_status === 'failed') {
        return metadata.processing_status;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
  }
  
  console.log('⏱️ Monitoring timeout reached');
  return 'timeout';
}

// Main interactive process
async function main() {
  console.log('🚀 Manual Processing Tool\n');
  
  // Login first
  const isLoggedIn = await loginAsAdmin();
  if (!isLoggedIn) {
    rl.close();
    return;
  }
  
  // Get manual list
  const manuals = await listManuals();
  
  if (manuals.length === 0) {
    console.log('❌ No manuals found');
    rl.close();
    return;
  }
  
  // Display manuals
  console.log('\n📚 Available Manuals:\n');
  manuals.forEach((manual, index) => {
    const status = manual.status === 'completed' ? '✅' : 
                   manual.status === 'processing' ? '🔄' : 
                   manual.status === 'failed' ? '❌' : '⚪';
    console.log(`${index + 1}. ${status} ${manual.name} (${manual.chunks} chunks)`);
  });
  
  // Ask which to process
  const choice = await prompt('\nEnter number to process (0 for all unprocessed, q to quit): ');
  
  if (choice.toLowerCase() === 'q') {
    console.log('👋 Goodbye!');
    rl.close();
    return;
  }
  
  let toProcess = [];
  
  if (choice === '0') {
    // Process all unprocessed
    toProcess = manuals.filter(m => m.status !== 'completed');
  } else {
    const index = parseInt(choice) - 1;
    if (index >= 0 && index < manuals.length) {
      toProcess = [manuals[index]];
    } else {
      console.log('❌ Invalid selection');
      rl.close();
      return;
    }
  }
  
  // Process selected manuals
  console.log(`\n🎯 Will process ${toProcess.length} manual(s)`);
  
  for (const manual of toProcess) {
    const success = await processManual(manual.name);
    
    if (success) {
      // Monitor the processing
      const monitor = await prompt('Monitor processing? (y/n): ');
      if (monitor.toLowerCase() === 'y') {
        const finalStatus = await monitorProcessing(manual.name);
        console.log(`\n✨ Final status: ${finalStatus}`);
      }
    }
    
    if (toProcess.length > 1) {
      console.log('\n⏳ Waiting 10 seconds before next manual...\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  console.log('\n✨ Processing complete!');
  
  // Show final summary
  const { data: summary } = await supabase
    .from('manual_metadata')
    .select('processing_status')
    .in('filename', toProcess.map(m => m.name));
  
  if (summary) {
    const completed = summary.filter(s => s.processing_status === 'completed').length;
    const failed = summary.filter(s => s.processing_status === 'failed').length;
    const processing = summary.filter(s => s.processing_status === 'processing').length;
    
    console.log('\n📊 Summary:');
    console.log(`✅ Completed: ${completed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`🔄 Still processing: ${processing}`);
  }
  
  rl.close();
}

// Handle cleanup
rl.on('close', () => {
  process.exit(0);
});

// Run the tool
main().catch(console.error);