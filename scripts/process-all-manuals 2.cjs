#!/usr/bin/env node

/**
 * Simplified Manual Processing Script
 * Automatically processes all PDF manuals without interaction
 */

const { createClient } = require('@supabase/supabase-js');
const pdf = require('pdf-parse');
require('dotenv').config();

// Configuration
const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Connected to Supabase');

async function listManuals() {
  console.log('\n📚 Fetching manuals from storage...');
  
  const { data, error } = await supabase.storage
    .from('manuals')
    .list('', {
      limit: 100,
      offset: 0
    });

  if (error) {
    console.error('❌ Error listing manuals:', error.message);
    return [];
  }

  const pdfFiles = data.filter(file => file.name.endsWith('.pdf'));
  console.log(`Found ${pdfFiles.length} PDF files`);
  
  return pdfFiles;
}

async function downloadManual(filename) {
  console.log(`\n📥 Downloading ${filename}...`);
  
  const { data, error } = await supabase.storage
    .from('manuals')
    .download(filename);

  if (error) {
    console.error(`❌ Error downloading: ${error.message}`);
    return null;
  }

  console.log(`✅ Downloaded ${filename}`);
  return data;
}

async function extractText(pdfBuffer) {
  try {
    const data = await pdf(pdfBuffer);
    console.log(`📄 Extracted ${data.numpages} pages`);
    return data.text;
  } catch (error) {
    console.error('❌ Error extracting text:', error.message);
    return null;
  }
}

function createChunks(text) {
  const chunks = [];
  const words = text.split(/\s+/);
  
  for (let i = 0; i < words.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(' ');
    if (chunk.trim().length > 100) {  // Skip very small chunks
      chunks.push(chunk);
    }
  }
  
  console.log(`✂️ Created ${chunks.length} chunks`);
  return chunks;
}

async function saveToDatabase(filename, chunks) {
  console.log('💾 Saving to database...');

  // Check if manual already exists
  const { data: existing } = await supabase
    .from('manual_metadata')
    .select('id')
    .eq('filename', filename)
    .single();

  if (existing) {
    console.log('  Manual already exists, deleting old chunks...');
    await supabase
      .from('manual_chunks')
      .delete()
      .eq('manual_id', existing.id);
  }

  // Create or update manual entry (without non-existent columns)
  const { data: manual, error: manualError } = await supabase
    .from('manual_metadata')
    .upsert({
      filename,
      title: filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
      category: 'Manual',
      processing_status: 'completed',
      processed_at: new Date().toISOString()
    }, {
      onConflict: 'filename'
    })
    .select()
    .single();

  if (manualError) {
    console.error('❌ Error saving manual metadata:', manualError.message);
    return false;
  }

  // Save chunks
  const chunkRecords = chunks.map((content, index) => ({
    manual_id: manual.id,
    content,
    chunk_index: index,
    page_number: Math.floor(index / 3), // Approximate page number
    chunk_type: 'text'
  }));

  // Insert in batches of 50
  for (let i = 0; i < chunkRecords.length; i += 50) {
    const batch = chunkRecords.slice(i, i + 50);
    const { error } = await supabase
      .from('manual_chunks')
      .insert(batch);

    if (error) {
      console.error('❌ Error inserting chunks:', error.message);
      return false;
    }
    
    console.log(`  Saved chunks ${i + 1}-${Math.min(i + 50, chunkRecords.length)}`);
  }

  console.log(`✅ Successfully saved ${filename}`);
  return true;
}

async function processManual(filename) {
  console.log('\n' + '='.repeat(60));
  console.log(`Processing: ${filename}`);
  console.log('='.repeat(60));

  // Download PDF
  const pdfBlob = await downloadManual(filename);
  if (!pdfBlob) return false;

  // Convert to buffer
  const buffer = Buffer.from(await pdfBlob.arrayBuffer());

  // Extract text
  const text = await extractText(buffer);
  if (!text) return false;

  // Create chunks
  const chunks = createChunks(text);

  // Save to database
  return await saveToDatabase(filename, chunks);
}

async function main() {
  console.log('\n🚀 Processing All Manuals Automatically');
  console.log('='.repeat(60));

  // Get all manuals
  const manuals = await listManuals();
  
  if (manuals.length === 0) {
    console.log('No manuals found in storage');
    return;
  }

  console.log(`\nWill process ${manuals.length} manuals`);

  // Process each manual
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < manuals.length; i++) {
    const manual = manuals[i];
    console.log(`\n[${i + 1}/${manuals.length}] Processing ${manual.name}`);
    
    const success = await processManual(manual.name);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Processing Complete!');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${successCount} manuals`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount} manuals`);
  }
  console.log('\n🤖 Barry now has access to all processed manual chunks!');
}

// Run immediately
main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});