#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Please set it in your .env file or export it:');
  console.log('export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Configure PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(__dirname, '../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');

async function processManual(filename) {
  try {
    console.log(`\n📄 Processing: ${filename}`);

    // Download the PDF from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('manuals')
      .download(filename);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download: ${downloadError?.message || 'Unknown error'}`);
    }

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();

    // Load PDF with PDF.js
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;

    console.log(`  📖 Pages: ${numPages}`);

    // Extract text from all pages
    const chunks = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (pageText.length > 0) {
        // Split page into smaller chunks if it's too long
        const maxChunkSize = 1500;
        const pageChunks = splitIntoChunks(pageText, maxChunkSize);

        pageChunks.forEach((chunk, index) => {
          const chunkIndex = (pageNum - 1) * 10 + index; // Assuming max 10 chunks per page
          chunks.push({
            manual_filename: filename,
            chunk_index: chunkIndex,
            page_number: pageNum,
            section_title: `Page ${pageNum}${pageChunks.length > 1 ? ` Part ${index + 1}` : ''}`,
            content: chunk,
            created_at: new Date().toISOString()
          });
        });
      }
    }

    console.log(`  📊 Chunks created: ${chunks.length}`);

    // Create or update manual_metadata record
    const { data: manualRecord, error: metadataError } = await supabase
      .from('manual_metadata')
      .upsert({
        filename,
        title: filename.replace('.pdf', '').replace(/[-_]/g, ' '),
        description: `Technical manual for ${filename.replace('.pdf', '').replace(/[-_]/g, ' ')}`,
        file_size: arrayBuffer.byteLength,
        pages: numPages,
        chunk_count: chunks.length,
        processing_started_at: new Date().toISOString(),
        processing_completed_at: new Date().toISOString(),
        status: 'completed'
      }, {
        onConflict: 'filename'
      })
      .select()
      .single();

    if (metadataError) {
      throw new Error(`Metadata error: ${metadataError.message}`);
    }

    // Save chunks to manual_chunks table
    if (chunks.length > 0) {
      // Delete existing chunks for this manual
      await supabase
        .from('manual_chunks')
        .delete()
        .eq('manual_filename', filename);

      // Insert new chunks in batches of 100
      for (let i = 0; i < chunks.length; i += 100) {
        const batch = chunks.slice(i, i + 100);
        const { error: chunksError } = await supabase
          .from('manual_chunks')
          .insert(batch);

        if (chunksError) {
          throw new Error(`Chunks error: ${chunksError.message}`);
        }
      }
    }

    console.log(`  ✅ Success! Manual processed with ${chunks.length} chunks`);
    return { success: true, chunks: chunks.length, pages: numPages };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);

    // Update status to failed
    await supabase
      .from('manual_metadata')
      .upsert({
        filename,
        title: filename.replace('.pdf', '').replace(/[-_]/g, ' '),
        status: 'failed',
        processing_error: error.message
      }, {
        onConflict: 'filename'
      });

    return { success: false, error: error.message };
  }
}

function splitIntoChunks(text, maxSize) {
  if (text.length <= maxSize) {
    return [text];
  }

  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxSize) {
      currentChunk += sentence + ' ';
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence + ' ';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function main() {
  console.log('🚀 Manual Processing Script');
  console.log('============================\n');

  try {
    // Get list of files in storage
    const { data: files, error: listError } = await supabase.storage
      .from('manuals')
      .list();

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`);
    }

    const pdfFiles = files.filter(file =>
      file.name.toLowerCase().endsWith('.pdf') && !file.name.startsWith('.')
    );

    console.log(`📚 Found ${pdfFiles.length} PDF files in storage\n`);

    // Get already processed files
    const { data: processed } = await supabase
      .from('manual_metadata')
      .select('filename')
      .eq('status', 'completed');

    const processedFiles = new Set((processed || []).map(p => p.filename));

    const unprocessedFiles = pdfFiles.filter(file => !processedFiles.has(file.name));

    console.log(`✅ ${processedFiles.size} already processed`);
    console.log(`⏳ ${unprocessedFiles.length} need processing\n`);

    if (unprocessedFiles.length === 0) {
      console.log('🎉 All manuals are already processed!');
      return;
    }

    // Process each unprocessed file
    let successCount = 0;
    let failCount = 0;

    for (const file of unprocessedFiles) {
      const result = await processManual(file.name);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('\n============================');
    console.log('📊 Processing Complete!');
    console.log(`✅ Success: ${successCount} files`);
    console.log(`❌ Failed: ${failCount} files`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);