#!/usr/bin/env node

/**
 * Simplified Manual Processing Script - Works with existing columns only
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

  // First ensure the manual exists in processed_manuals table
  const { data: existing, error: fetchError } = await supabase
    .from('processed_manuals')
    .select('id')
    .eq('filename', filename)
    .single();

  let manualId;

  if (existing && existing.id) {
    console.log(`  Manual already exists in processed_manuals with ID: ${existing.id}`);
    manualId = existing.id;
    
    // Delete old chunks
    const { error: deleteError } = await supabase
      .from('manual_chunks')
      .delete()
      .eq('manual_id', manualId);
    
    if (deleteError) {
      console.log(`  Warning: Could not delete old chunks: ${deleteError.message}`);
    }
  } else {
    // Create new entry in processed_manuals with required fields
    const { data: manual, error: manualError } = await supabase
      .from('processed_manuals')
      .insert({
        filename,
        original_filename: filename,
        title: filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
        category: 'Manual',
        file_size: 0, // We don't have the size readily available
        uploaded_by: '55abc04e-a334-4c37-92ec-a91d480da74f', // Use existing user ID
        chunk_count: chunks.length,
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (manualError) {
      console.error('❌ Error creating processed manual:', manualError.message);
      return false;
    }
    
    manualId = manual.id;
    console.log(`  Created new processed manual with ID: ${manualId}`);
  }

  // Save chunks
  const manualTitle = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
  const chunkRecords = chunks.map((content, index) => ({
    manual_id: manualId,
    manual_title: manualTitle,
    content,
    chunk_index: index,
    page_number: Math.floor(index / 3) // Approximate page number
  }));

  // Insert in batches of 50
  let totalSaved = 0;
  for (let i = 0; i < chunkRecords.length; i += 50) {
    const batch = chunkRecords.slice(i, i + 50);
    const { error } = await supabase
      .from('manual_chunks')
      .insert(batch);

    if (error) {
      console.error('❌ Error inserting chunks:', error.message);
      return false;
    }
    
    totalSaved += batch.length;
    console.log(`  Saved chunks ${i + 1}-${Math.min(i + 50, chunkRecords.length)}`);
  }

  console.log(`✅ Successfully saved ${filename} with ${totalSaved} chunks`);
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
  console.log('\n🚀 Processing All Manuals (Simple Version)');
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
  
  // Check total chunks created
  const { count } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📚 Total chunks in database: ${count || 0}`);
  console.log('🤖 Barry now has access to all processed manual chunks!');
}

// Run immediately
main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});