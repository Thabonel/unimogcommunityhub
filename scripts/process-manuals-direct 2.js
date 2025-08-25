import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';
import { readFile } from 'fs/promises';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

// Create Supabase client with service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const openaiKey = process.env.VITE_OPENAI_API_KEY;

if (!openaiKey) {
  console.error('❌ VITE_OPENAI_API_KEY not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple text splitter function
function splitTextIntoChunks(text, chunkSize = 1500, overlap = 200) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    const end = start + chunkSize;
    const chunk = text.slice(start, end);
    chunks.push(chunk);
    start = end - overlap;
  }
  
  return chunks;
}

// Extract model codes from text
function extractModelCodes(text) {
  const modelCodes = new Set();
  const patterns = [
    /U\d{3,4}[A-Z]?/g,  // U1700, U5023
    /404[.\s]?\d*/g,    // 404, 404.1
    /406/g, /411/g, /416/g, /421/g, /425/g, /435/g, /437/g,
    /UGN/g,             // UGN
    /FLU-419/g,         // SEE/FLU-419
  ];

  patterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => modelCodes.add(match.trim()));
    }
  });

  return Array.from(modelCodes);
}

// Categorize manual based on content
function categorizeManual(filename, content) {
  const lower = (filename + ' ' + content).toLowerCase();
  
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
  
  return 'general';
}

// Generate embeddings using OpenAI
async function generateEmbedding(text) {
  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

// Main processing function
async function processManual(filename) {
  console.log(`\n🔄 Processing: ${filename}`);
  
  try {
    // First check if the manual_metadata table has the processing_status column
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_columns', { table_name: 'manual_metadata' });
    
    const hasProcessingStatus = tableInfo?.some(col => col.column_name === 'processing_status');
    
    // Check if already processed
    if (hasProcessingStatus) {
      const { data: existingMetadata } = await supabase
        .from('manual_metadata')
        .select('id, processing_status, chunk_count')
        .eq('filename', filename)
        .single();
      
      if (existingMetadata?.processing_status === 'completed') {
        console.log(`✅ Already processed: ${filename} (${existingMetadata.chunk_count} chunks)`);
        return true;
      }
    }
    
    // Download the manual from storage
    console.log('📥 Downloading manual...');
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('manuals')
      .download(filename);
    
    if (downloadError || !fileData) {
      console.error(`❌ Failed to download ${filename}:`, downloadError?.message);
      return false;
    }
    
    // For now, we'll use a simple text extraction approach
    // In production, you'd use a proper PDF library
    console.log('📄 Extracting text (simplified)...');
    const buffer = await fileData.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf-8', 0, 10000); // Simple extraction for demo
    
    // Extract metadata
    const title = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
    const modelCodes = extractModelCodes(filename + ' ' + text);
    const category = categorizeManual(filename, text);
    
    // Create or update manual metadata
    const metadataPayload = {
      filename,
      title,
      model_codes: modelCodes,
      category,
      file_size: buffer.byteLength,
      uploaded_by: 'c2a7f96f-09f0-4b8d-b5d3-0f8e0f8e0f8e', // System user ID
      processed_at: new Date().toISOString()
    };
    
    if (hasProcessingStatus) {
      metadataPayload.processing_status = 'processing';
    }
    
    const { data: manualMetadata, error: metadataError } = await supabase
      .from('manual_metadata')
      .upsert(metadataPayload, { onConflict: 'filename' })
      .select()
      .single();
    
    if (metadataError || !manualMetadata) {
      console.error(`❌ Failed to create metadata for ${filename}:`, metadataError?.message);
      return false;
    }
    
    console.log(`📝 Created metadata with ID: ${manualMetadata.id}`);
    
    // Split text into chunks
    const chunks = splitTextIntoChunks(text);
    console.log(`📊 Created ${chunks.length} chunks`);
    
    // Process chunks with embeddings
    const chunkRecords = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      if (!chunkText.trim()) continue;
      
      // Generate embedding
      const embedding = await generateEmbedding(chunkText);
      if (!embedding) {
        console.warn(`⚠️ Failed to generate embedding for chunk ${i}`);
        continue;
      }
      
      chunkRecords.push({
        manual_id: manualMetadata.id,
        chunk_index: i,
        content: chunkText,
        content_type: 'text',
        page_number: Math.floor(i / 3) + 1, // Approximate page numbers
        embedding: `[${embedding.join(',')}]`,
        metadata: {
          filename,
          char_count: chunkText.length,
          word_count: chunkText.split(/\s+/).length
        }
      });
      
      // Insert in batches
      if (chunkRecords.length >= 10) {
        const { error: chunkError } = await supabase
          .from('manual_chunks')
          .insert(chunkRecords);
        
        if (chunkError) {
          console.error(`❌ Error inserting chunks:`, chunkError.message);
        }
        chunkRecords.length = 0;
      }
    }
    
    // Insert remaining chunks
    if (chunkRecords.length > 0) {
      const { error: chunkError } = await supabase
        .from('manual_chunks')
        .insert(chunkRecords);
      
      if (chunkError) {
        console.error(`❌ Error inserting final chunks:`, chunkError.message);
      }
    }
    
    // Update metadata as completed
    if (hasProcessingStatus) {
      await supabase
        .from('manual_metadata')
        .update({
          processing_status: 'completed',
          chunk_count: chunks.length
        })
        .eq('id', manualMetadata.id);
    }
    
    console.log(`✅ Successfully processed: ${filename}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting direct manual processing...\n');
  
  // First, let's check if we need to add the processing_status column
  console.log('🔍 Checking database schema...');
  
  // Create a simple RPC function to check columns if it doesn't exist
  await supabase.rpc('execute_sql', {
    query: `
      CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
      RETURNS TABLE(column_name text, data_type text) AS $$
      BEGIN
        RETURN QUERY
        SELECT c.column_name::text, c.data_type::text
        FROM information_schema.columns c
        WHERE c.table_schema = 'public'
        AND c.table_name = get_table_columns.table_name;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
  }).catch(() => {
    // Function might already exist
  });
  
  // Get list of manuals
  console.log('📚 Fetching manual list...');
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
  
  console.log(`📚 Found ${files.length} manuals\n`);
  
  // Process one manual as a test
  if (files.length > 0) {
    const testFile = files[0].name;
    console.log(`🧪 Testing with first manual: ${testFile}`);
    
    const success = await processManual(testFile);
    
    if (success) {
      console.log('\n✅ Test successful! Ready to process all manuals.');
      console.log('To process all manuals, uncomment the batch processing code.');
    }
  }
  
  // Uncomment to process all manuals
  /*
  let successCount = 0;
  let failureCount = 0;
  
  for (const file of files) {
    const success = await processManual(file.name);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Add delay between files
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n✨ Processing complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  */
}

main().catch(console.error);