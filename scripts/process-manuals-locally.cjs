#!/usr/bin/env node

/**
 * Local Manual Processing Script
 * Processes PDF manuals directly without Edge Functions
 * Chunks text and saves to Supabase for Barry AI to use
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const OpenAI = require('openai');
const readline = require('readline');
require('dotenv').config();

// Configuration
const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;
const BATCH_SIZE = 5; // Process embeddings in batches

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Initialize clients
let supabase;
let openai;

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function initializeClients() {
  // Use environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const openaiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log('❌ Missing Supabase credentials. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env', 'red');
    process.exit(1);
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  log('✅ Supabase client initialized', 'green');

  if (openaiKey) {
    openai = new OpenAI({ apiKey: openaiKey });
    log('✅ OpenAI client initialized (embeddings enabled)', 'green');
  } else {
    log('⚠️  No OpenAI key found. Embeddings will be skipped.', 'yellow');
  }
}

async function listManuals() {
  log('\n📚 Fetching manuals from storage...', 'cyan');
  
  const { data, error } = await supabase.storage
    .from('manuals')
    .list('', {
      limit: 100,
      offset: 0
    });

  if (error) {
    log(`❌ Error listing manuals: ${error.message}`, 'red');
    return [];
  }

  const pdfFiles = data.filter(file => file.name.endsWith('.pdf'));
  log(`Found ${pdfFiles.length} PDF files`, 'blue');
  
  return pdfFiles;
}

async function downloadManual(filename) {
  log(`📥 Downloading ${filename}...`, 'cyan');
  
  const { data, error } = await supabase.storage
    .from('manuals')
    .download(filename);

  if (error) {
    log(`❌ Error downloading ${filename}: ${error.message}`, 'red');
    return null;
  }

  return data;
}

async function extractTextFromPDF(pdfBuffer) {
  try {
    const data = await pdf(pdfBuffer);
    log(`📄 Extracted ${data.numpages} pages, ${data.text.length} characters`, 'green');
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (error) {
    log(`❌ Error extracting PDF text: ${error.message}`, 'red');
    return null;
  }
}

function extractMetadata(filename, text) {
  // Extract model codes (e.g., U1700, U500, etc.)
  const modelMatches = text.match(/U\d{3,4}[L]?/g) || [];
  const uniqueModels = [...new Set(modelMatches)];

  // Extract year ranges
  const yearMatches = text.match(/\b(19|20)\d{2}\b/g) || [];
  const years = [...new Set(yearMatches)].map(y => parseInt(y)).filter(y => y >= 1950 && y <= 2030);
  const yearRange = years.length > 0 ? `${Math.min(...years)}-${Math.max(...years)}` : null;

  // Categorize based on filename and content
  let category = 'General';
  const lowerFilename = filename.toLowerCase();
  const lowerText = text.toLowerCase().substring(0, 1000);

  if (lowerFilename.includes('service') || lowerText.includes('service manual')) {
    category = 'Service Manual';
  } else if (lowerFilename.includes('parts') || lowerText.includes('parts catalog')) {
    category = 'Parts Catalog';
  } else if (lowerFilename.includes('operator') || lowerText.includes('operator manual')) {
    category = 'Operator Manual';
  } else if (lowerFilename.includes('workshop') || lowerText.includes('workshop manual')) {
    category = 'Workshop Manual';
  } else if (lowerFilename.includes('wiring') || lowerText.includes('wiring diagram')) {
    category = 'Wiring Diagram';
  }

  return {
    modelCodes: uniqueModels,
    yearRange,
    category
  };
}

async function createChunks(text, metadata) {
  log('✂️  Creating text chunks...', 'cyan');
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    separators: ['\n\n', '\n', '.', '!', '?', ';', ':', ' ', '']
  });

  const docs = await splitter.createDocuments([text]);
  log(`Created ${docs.length} chunks`, 'green');

  return docs.map((doc, index) => ({
    content: doc.pageContent,
    metadata: {
      ...metadata,
      chunkIndex: index,
      totalChunks: docs.length
    }
  }));
}

async function generateEmbeddings(chunks) {
  if (!openai) {
    log('⚠️  Skipping embeddings (no OpenAI key)', 'yellow');
    return chunks.map(chunk => ({ ...chunk, embedding: null }));
  }

  log('🧠 Generating embeddings...', 'cyan');
  const chunksWithEmbeddings = [];

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map(chunk => chunk.content);

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texts
      });

      batch.forEach((chunk, index) => {
        chunksWithEmbeddings.push({
          ...chunk,
          embedding: response.data[index].embedding
        });
      });

      log(`  Generated embeddings for chunks ${i + 1}-${Math.min(i + BATCH_SIZE, chunks.length)}`, 'green');
    } catch (error) {
      log(`  ❌ Error generating embeddings: ${error.message}`, 'red');
      // Add chunks without embeddings
      batch.forEach(chunk => {
        chunksWithEmbeddings.push({
          ...chunk,
          embedding: null
        });
      });
    }
  }

  return chunksWithEmbeddings;
}

async function saveToDatabase(filename, chunks, metadata) {
  log('💾 Saving to database...', 'cyan');

  // Check if manual already exists
  const { data: existing } = await supabase
    .from('manual_metadata')
    .select('id')
    .eq('filename', filename)
    .single();

  let manualId;

  if (existing) {
    manualId = existing.id;
    log('  Manual already exists, updating...', 'yellow');
    
    // Delete old chunks
    await supabase
      .from('manual_chunks')
      .delete()
      .eq('manual_id', manualId);
  } else {
    // Create new manual entry
    const { data: newManual, error: insertError } = await supabase
      .from('manual_metadata')
      .insert({
        filename,
        title: filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
        category: metadata.category,
        model_codes: metadata.modelCodes,
        year_range: metadata.yearRange,
        page_count: metadata.pages,
        chunk_count: chunks.length,
        file_size: metadata.fileSize,
        processing_status: 'processing',
        processed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      log(`  ❌ Error creating manual entry: ${insertError.message}`, 'red');
      return false;
    }

    manualId = newManual.id;
  }

  // Insert chunks
  const chunkRecords = chunks.map(chunk => ({
    manual_id: manualId,
    content: chunk.content,
    chunk_index: chunk.metadata.chunkIndex,
    page_number: chunk.metadata.pageNumber || 0,
    section_title: chunk.metadata.sectionTitle || null,
    chunk_type: 'text',
    embeddings: chunk.embedding,
    metadata: {
      modelCodes: chunk.metadata.modelCodes,
      yearRange: chunk.metadata.yearRange
    }
  }));

  // Insert in batches
  const INSERT_BATCH_SIZE = 50;
  for (let i = 0; i < chunkRecords.length; i += INSERT_BATCH_SIZE) {
    const batch = chunkRecords.slice(i, i + INSERT_BATCH_SIZE);
    const { error: chunkError } = await supabase
      .from('manual_chunks')
      .insert(batch);

    if (chunkError) {
      log(`  ❌ Error inserting chunks: ${chunkError.message}`, 'red');
      return false;
    }

    log(`  Saved chunks ${i + 1}-${Math.min(i + INSERT_BATCH_SIZE, chunkRecords.length)}`, 'green');
  }

  // Update manual status
  await supabase
    .from('manual_metadata')
    .update({
      processing_status: 'completed',
      processing_completed_at: new Date().toISOString()
    })
    .eq('id', manualId);

  log(`✅ Successfully processed ${filename}`, 'green');
  return true;
}

async function processManual(filename) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(`Processing: ${filename}`, 'bright');
  log('='.repeat(60), 'blue');

  // Download manual
  const pdfBlob = await downloadManual(filename);
  if (!pdfBlob) return false;

  // Convert blob to buffer
  const buffer = Buffer.from(await pdfBlob.arrayBuffer());

  // Extract text
  const pdfData = await extractTextFromPDF(buffer);
  if (!pdfData) return false;

  // Extract metadata
  const metadata = {
    ...extractMetadata(filename, pdfData.text),
    pages: pdfData.pages,
    fileSize: buffer.length
  };
  
  log(`📊 Metadata: ${metadata.category}, Models: ${metadata.modelCodes.join(', ') || 'None'}, Years: ${metadata.yearRange || 'Unknown'}`, 'blue');

  // Create chunks
  const chunks = await createChunks(pdfData.text, metadata);

  // Generate embeddings
  const chunksWithEmbeddings = await generateEmbeddings(chunks);

  // Save to database
  return await saveToDatabase(filename, chunksWithEmbeddings, metadata);
}

async function selectManuals(manuals) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    log('\n📋 Available manuals:', 'cyan');
    manuals.forEach((manual, index) => {
      log(`  ${index + 1}. ${manual.name} (${(manual.metadata?.size / 1024 / 1024).toFixed(2) || '?'} MB)`, 'blue');
    });

    rl.question('\nEnter manual numbers to process (comma-separated, or "all" for all): ', (answer) => {
      rl.close();
      
      if (answer.toLowerCase() === 'all') {
        resolve(manuals);
      } else {
        const indices = answer.split(',').map(n => parseInt(n.trim()) - 1);
        const selected = indices
          .filter(i => i >= 0 && i < manuals.length)
          .map(i => manuals[i]);
        resolve(selected);
      }
    });
  });
}

async function main() {
  log('\n🚀 Manual Processing Script', 'bright');
  log('='.repeat(60), 'blue');

  // Initialize clients
  initializeClients();

  // List available manuals
  const manuals = await listManuals();
  if (manuals.length === 0) {
    log('No manuals found in storage', 'yellow');
    return;
  }

  // Let user select manuals to process
  const selectedManuals = await selectManuals(manuals);
  
  if (selectedManuals.length === 0) {
    log('No manuals selected', 'yellow');
    return;
  }

  log(`\n🔄 Processing ${selectedManuals.length} manual(s)...`, 'bright');

  // Process each manual
  let successCount = 0;
  let failCount = 0;

  for (const manual of selectedManuals) {
    const success = await processManual(manual.name);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('📊 Processing Complete!', 'bright');
  log('='.repeat(60), 'blue');
  log(`✅ Success: ${successCount} manuals`, 'green');
  if (failCount > 0) {
    log(`❌ Failed: ${failCount} manuals`, 'red');
  }
  log('\n🤖 Barry now has access to all processed manual chunks!', 'green');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });
}

module.exports = { processManual, listManuals };