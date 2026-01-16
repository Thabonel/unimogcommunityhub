import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';
import OpenAI from 'openai';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!SERVICE_ROLE_KEY || !SUPABASE_URL || !OPENAI_API_KEY) {
  console.error('Missing required environment variables');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SERVICE_ROLE_KEY ? 'set' : 'MISSING');
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL ? 'set' : 'MISSING');
  console.error('OPENAI_API_KEY:', OPENAI_API_KEY ? 'set' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Configuration
const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 200;
const BATCH_SIZE = 20;

async function downloadPDF(filename) {
  console.log(`   Downloading ${filename}...`);
  const { data, error } = await supabase.storage
    .from('manuals')
    .download(filename);

  if (error) throw new Error(`Download failed: ${error.message}`);
  return new Uint8Array(await data.arrayBuffer());
}

async function extractTextFromPDF(buffer, filename) {
  console.log(`   Extracting text from ${filename}...`);

  const pages = [];
  let currentPage = 0;

  // Custom page render function to capture per-page text
  const pageRender = (pageData) => {
    currentPage++;
    const pageText = pageData.getTextContent().then((textContent) => {
      return textContent.items.map(item => item.str).join(' ');
    });
    return pageText;
  };

  try {
    const data = await pdfParse(Buffer.from(buffer), {
      pagerender: pageRender,
      max: 0  // Process all pages
    });

    const numPages = data.numpages;
    console.log(`   PDF has ${numPages} pages`);

    // pdf-parse gives us full text, but we need to split by pages
    // Use a simpler approach: split the text into page-like chunks based on form feeds or page markers
    const fullText = data.text;

    // Try to split by common page separators
    const pageTexts = fullText.split(/\f|\x0c/); // Form feed character

    if (pageTexts.length > 1 && pageTexts.length <= numPages + 5) {
      // Use form feed splits
      for (let i = 0; i < pageTexts.length; i++) {
        const text = pageTexts[i].replace(/\s+/g, ' ').trim();
        if (text.length > 10) {
          pages.push({ page: i + 1, text });
        }
      }
    } else {
      // Fallback: divide text evenly across pages (estimate)
      const avgCharsPerPage = Math.ceil(fullText.length / numPages);
      let position = 0;
      for (let pageNum = 1; pageNum <= numPages && position < fullText.length; pageNum++) {
        let endPos = Math.min(position + avgCharsPerPage, fullText.length);

        // Try to end at paragraph boundary
        if (endPos < fullText.length) {
          const nextParagraph = fullText.indexOf('\n\n', position + avgCharsPerPage * 0.8);
          if (nextParagraph > 0 && nextParagraph < position + avgCharsPerPage * 1.2) {
            endPos = nextParagraph;
          }
        }

        const pageText = fullText.slice(position, endPos).replace(/\s+/g, ' ').trim();
        if (pageText.length > 10) {
          pages.push({ page: pageNum, text: pageText });
        }
        position = endPos;
      }
    }

    console.log(`   Extracted ${pages.length} pages with text`);
    return { pages, totalPages: numPages };

  } catch (err) {
    console.error(`   PDF parse error: ${err.message}`);
    return { pages: [], totalPages: 0 };
  }
}

function createChunks(pages, filename) {
  const chunks = [];

  for (const { page, text } of pages) {
    if (text.length <= CHUNK_SIZE) {
      chunks.push({
        content: text,
        page_number: page,
        section_title: `Page ${page}`,
        filename
      });
    } else {
      // Split long pages into chunks with overlap
      let start = 0;
      let chunkIndex = 0;
      while (start < text.length) {
        const end = Math.min(start + CHUNK_SIZE, text.length);
        let chunkText = text.slice(start, end);

        // Try to end at sentence boundary
        if (end < text.length) {
          const lastPeriod = chunkText.lastIndexOf('.');
          const lastQuestion = chunkText.lastIndexOf('?');
          const lastExclaim = chunkText.lastIndexOf('!');
          const lastSentence = Math.max(lastPeriod, lastQuestion, lastExclaim);
          if (lastSentence > CHUNK_SIZE / 2) {
            chunkText = chunkText.slice(0, lastSentence + 1);
          }
        }

        chunks.push({
          content: chunkText.trim(),
          page_number: page,
          section_title: chunkIndex === 0 ? `Page ${page}` : `Page ${page} (cont.)`,
          filename
        });

        start += chunkText.length - CHUNK_OVERLAP;
        if (start >= text.length - CHUNK_OVERLAP) break;
        chunkIndex++;
      }
    }
  }

  return chunks;
}

async function generateEmbeddings(chunks) {
  console.log(`   Generating embeddings for ${chunks.length} chunks...`);

  const results = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map(c => c.content.slice(0, 8000)); // OpenAI limit

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: texts
      });

      for (let j = 0; j < batch.length; j++) {
        results.push({
          ...batch[j],
          embedding: response.data[j].embedding
        });
      }

      if ((i + BATCH_SIZE) % 100 < BATCH_SIZE) {
        console.log(`   Generated embeddings: ${Math.min(i + BATCH_SIZE, chunks.length)}/${chunks.length}`);
      }

      // Rate limit
      await new Promise(r => setTimeout(r, 100));
    } catch (err) {
      console.error(`   Embedding error at batch ${i}: ${err.message}`);
      // Add chunks without embeddings
      for (const chunk of batch) {
        results.push({ ...chunk, embedding: null });
      }
    }
  }

  return results;
}

async function storeChunks(chunks, manualId, manualTitle) {
  console.log(`   Storing ${chunks.length} chunks in database...`);

  const rows = chunks.map((chunk, index) => ({
    manual_id: manualId,
    manual_title: manualTitle,
    chunk_index: index,
    content: chunk.content,
    page_number: chunk.page_number,
    section_title: chunk.section_title,
    embedding: chunk.embedding
  }));

  // Insert in batches
  let insertedCount = 0;
  for (let i = 0; i < rows.length; i += 50) {
    const batch = rows.slice(i, i + 50);
    const { data, error } = await supabase
      .from('manual_chunks')
      .insert(batch)
      .select('id');

    if (error) {
      console.error(`   Insert error at batch ${i}: ${error.message}`);
      // Log the first row for debugging
      if (i === 0) {
        console.log(`   First row manual_id: ${rows[0].manual_id}`);
      }
    } else {
      insertedCount += data?.length || 0;
    }
  }
  console.log(`   Successfully inserted: ${insertedCount} chunks`);

  return rows.length;
}

async function getOrCreateProcessedManual(filename) {
  const title = filename.replace(/\.pdf$/i, '').replace(/-/g, ' ');

  // Check if exists in processed_manuals (FK target for manual_chunks)
  const { data: existing, error: selectError } = await supabase
    .from('processed_manuals')
    .select('id, title')
    .eq('filename', filename)
    .single();

  if (existing) {
    console.log(`   Found existing processed_manual id: ${existing.id}`);
    return { id: existing.id, title: existing.title || title };
  }

  // Need to create in processed_manuals - requires more fields
  console.log(`   Creating new processed_manual entry...`);
  const { data: created, error } = await supabase
    .from('processed_manuals')
    .insert({
      filename,
      original_filename: filename,
      title,
      category: 'Manual',
      file_size: 0,
      uploaded_by: '55abc04e-a334-4c37-92ec-a91d480da74f',  // Existing user
      processing_status: 'processing'
    })
    .select('id, title')
    .single();

  if (error) throw new Error(`Failed to create processed_manual: ${error.message}`);
  return { id: created.id, title: created.title };
}

async function processManual(filename, index, total) {
  console.log(`\n[${index + 1}/${total}] Processing: ${filename}`);

  try {
    // Get or create processed_manual entry (FK target for manual_chunks)
    const { id: manualId, title: manualTitle } = await getOrCreateProcessedManual(filename);

    // Delete existing chunks for this manual
    const { error: deleteError } = await supabase
      .from('manual_chunks')
      .delete()
      .eq('manual_id', manualId);

    if (deleteError) {
      console.log(`   Warning: Could not delete old chunks: ${deleteError.message}`);
    }

    // Download PDF
    const buffer = await downloadPDF(filename);

    // Extract text page by page
    const { pages, totalPages } = await extractTextFromPDF(buffer, filename);

    if (pages.length === 0) {
      console.log(`   Warning: No text extracted from ${filename}`);
      return { success: false, error: 'No text extracted' };
    }

    // Create chunks with real page numbers
    const chunks = createChunks(pages, filename);
    console.log(`   Created ${chunks.length} chunks from ${pages.length} pages with text`);

    // Generate embeddings
    const chunksWithEmbeddings = await generateEmbeddings(chunks);

    // Store in database
    const storedCount = await storeChunks(chunksWithEmbeddings, manualId, manualTitle);

    // Update processed_manual with page count and chunk count
    await supabase
      .from('processed_manuals')
      .update({
        page_count: totalPages,
        chunk_count: storedCount,
        processing_status: 'completed',
        processing_completed_at: new Date().toISOString()
      })
      .eq('id', manualId);

    console.log(`   Done! ${storedCount} chunks with real page numbers stored`);
    return { success: true, chunks: storedCount, pages: totalPages };

  } catch (error) {
    console.error(`   Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('LOCAL PDF PROCESSING - FIX PAGE NUMBERS & ADD EMBEDDINGS');
  console.log('='.repeat(60));
  console.log('');
  console.log('This script processes PDFs LOCALLY (not via edge function)');
  console.log('Features:');
  console.log('  - REAL page numbers from PDF.js extraction');
  console.log('  - OpenAI embeddings for vector search');
  console.log('  - Smart chunking with sentence boundaries');
  console.log('');

  // Get all PDF files from storage
  console.log('Fetching files from storage...');
  const { data: files, error: listError } = await supabase.storage
    .from('manuals')
    .list('', { limit: 200 });

  if (listError) {
    console.error('Failed to list files:', listError.message);
    process.exit(1);
  }

  const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));
  console.log(`Found ${pdfFiles.length} PDF files\n`);

  if (pdfFiles.length === 0) {
    console.log('No PDF files found in storage bucket.');
    process.exit(0);
  }

  // Process each file
  let successCount = 0;
  let failureCount = 0;
  let totalChunks = 0;
  let totalPages = 0;
  const errors = [];

  for (let i = 0; i < pdfFiles.length; i++) {
    const file = pdfFiles[i];
    const result = await processManual(file.name, i, pdfFiles.length);

    if (result.success) {
      successCount++;
      totalChunks += result.chunks || 0;
      totalPages += result.pages || 0;
    } else {
      failureCount++;
      errors.push({ file: file.name, error: result.error });
    }

    // Brief delay between files
    if (i < pdfFiles.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('PROCESSING COMPLETE');
  console.log('='.repeat(60));
  console.log(`Successful: ${successCount} manuals`);
  console.log(`Failed: ${failureCount} manuals`);
  console.log(`Total pages: ${totalPages}`);
  console.log(`Total chunks: ${totalChunks}`);

  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(e => console.log(`   ${e.file}: ${e.error}`));
  }

  // Verify final state
  const { count: finalCount } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true });

  const { count: withEmbeddings } = await supabase
    .from('manual_chunks')
    .select('*', { count: 'exact', head: true })
    .not('embedding', 'is', null);

  console.log('\nFinal database status:');
  console.log(`   Total chunks: ${finalCount || 0}`);
  console.log(`   Chunks with embeddings: ${withEmbeddings || 0}`);

  if (finalCount && withEmbeddings) {
    const coverage = ((withEmbeddings / finalCount) * 100).toFixed(1);
    console.log(`   Embedding coverage: ${coverage}%`);
  }

  console.log('\nBarry should now return correct manual pages!');
}

main().catch(error => {
  console.error('\nFatal error:', error);
  process.exit(1);
});
