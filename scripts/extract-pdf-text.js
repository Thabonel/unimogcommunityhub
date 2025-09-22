#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('Get it from: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api');
  console.error('Then run: export SUPABASE_SERVICE_ROLE_KEY="your-key-here"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/legacy/build/pdf.worker.entry.js');

function splitIntoChunks(text, maxSize = 1500) {
  if (!text || text.length <= maxSize) {
    return text ? [text] : [];
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

async function processManual(filename, fileData) {
  try {
    console.log(`\n📄 Processing: ${filename}`);

    // Convert blob to array buffer
    const arrayBuffer = await fileData.arrayBuffer();

    // Load PDF with PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    console.log(`  📖 Pages: ${numPages}`);

    // Extract text from all pages
    const allChunks = [];
    let totalText = 0;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      process.stdout.write(`  📄 Extracting page ${pageNum}/${numPages}\r`);

      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (pageText.length > 0) {
        totalText += pageText.length;

        // Split page into smaller chunks if needed
        const pageChunks = splitIntoChunks(pageText);

        pageChunks.forEach((chunk, index) => {
          allChunks.push({
            manual_filename: filename,
            chunk_index: allChunks.length,
            page_number: pageNum,
            section_title: `Page ${pageNum}${pageChunks.length > 1 ? ` Part ${index + 1}` : ''}`,
            content: chunk,
            created_at: new Date().toISOString()
          });
        });
      }
    }

    console.log(`\n  📊 Extracted ${totalText} characters into ${allChunks.length} chunks`);

    // Get the manual_metadata record
    const { data: metadata, error: metaError } = await supabase
      .from('manual_metadata')
      .select('id')
      .eq('filename', filename)
      .single();

    if (metaError || !metadata) {
      throw new Error(`Manual metadata not found: ${metaError?.message}`);
    }

    // Delete existing placeholder chunks
    console.log(`  🗑️  Removing old chunks...`);
    const { error: deleteError } = await supabase
      .from('manual_chunks')
      .delete()
      .eq('manual_filename', filename);

    if (deleteError && deleteError.code !== 'PGRST116') {
      console.warn(`  ⚠️  Warning: ${deleteError.message}`);
    }

    // Insert new chunks with real content
    console.log(`  💾 Saving ${allChunks.length} chunks with real content...`);

    // Insert in batches to avoid timeout
    const batchSize = 50;
    for (let i = 0; i < allChunks.length; i += batchSize) {
      const batch = allChunks.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('manual_chunks')
        .insert(batch);

      if (insertError) {
        throw new Error(`Failed to insert chunks: ${insertError.message}`);
      }

      process.stdout.write(`  💾 Saved ${Math.min(i + batchSize, allChunks.length)}/${allChunks.length} chunks\r`);
    }

    // Update metadata with real counts
    console.log(`\n  📝 Updating metadata...`);
    const { error: updateError } = await supabase
      .from('manual_metadata')
      .update({
        pages: numPages,
        chunk_count: allChunks.length,
        status: 'completed',
        processing_completed_at: new Date().toISOString()
      })
      .eq('filename', filename);

    if (updateError) {
      throw new Error(`Failed to update metadata: ${updateError.message}`);
    }

    console.log(`  ✅ Success! Processed ${numPages} pages into ${allChunks.length} chunks`);
    return { success: true, chunks: allChunks.length, pages: numPages };

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);

    // Update status to failed
    await supabase
      .from('manual_metadata')
      .update({
        status: 'failed',
        processing_error: error.message
      })
      .eq('filename', filename);

    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 PDF Text Extraction Script');
  console.log('================================\n');

  try {
    // Get list of manuals to process
    console.log('📚 Getting list of manuals...');
    const { data: manuals, error: listError } = await supabase
      .from('manual_metadata')
      .select('filename, title, chunk_count')
      .order('filename');

    if (listError) {
      throw new Error(`Failed to get manuals: ${listError.message}`);
    }

    console.log(`Found ${manuals.length} manuals in database\n`);

    // Filter manuals that need real processing (those with exactly 5 chunks are placeholders)
    const needsProcessing = manuals.filter(m => m.chunk_count <= 5 || m.chunk_count === 50);

    console.log(`📋 ${needsProcessing.length} manuals need real text extraction`);
    console.log(`✅ ${manuals.length - needsProcessing.length} manuals already have real content\n`);

    if (needsProcessing.length === 0) {
      console.log('🎉 All manuals already have real content extracted!');
      return;
    }

    // Process each manual
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < needsProcessing.length; i++) {
      const manual = needsProcessing[i];
      console.log(`\n[${i + 1}/${needsProcessing.length}] Processing ${manual.title}`);
      console.log('─'.repeat(60));

      // Download PDF from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('manuals')
        .download(manual.filename);

      if (downloadError || !fileData) {
        console.error(`  ❌ Failed to download: ${downloadError?.message}`);
        failCount++;
        continue;
      }

      const result = await processManual(manual.filename, fileData);

      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }

      // Add a small delay between files to avoid overwhelming the system
      if (i < needsProcessing.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Processing Complete!');
    console.log(`✅ Success: ${successCount} manuals`);
    if (failCount > 0) {
      console.log(`❌ Failed: ${failCount} manuals`);
    }
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error);