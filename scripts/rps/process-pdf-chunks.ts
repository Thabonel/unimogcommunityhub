#!/usr/bin/env ts-node
/**
 * RPS PDF Chunks Processing with Marker OCR
 *
 * Processes PDF chunks (100 pages each) with Marker OCR
 * Combines results into single output file
 *
 * Usage:
 *   export REPLICATE_API_TOKEN="your_token"
 *   ts-node scripts/rps/process-pdf-chunks.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  chunksDir: path.join(__dirname, 'output/pdf_chunks'),
  resultsDir: path.join(__dirname, 'output/ocr_results'),
  outputMarkdownFile: path.join(__dirname, 'output/combined-markdown.md'),
  outputJsonFile: path.join(__dirname, 'output/combined-pages.json'),
  replicateApiToken: process.env.REPLICATE_API_TOKEN || process.env.VITE_REPLICATE_API_TOKEN,
  delayBetweenChunks: 3000, // 3 seconds between chunks
};

// Types
interface PageContent {
  pageNumber: number;
  title: string;
  content: string;
  chunkNumber: number;
}

interface ChunkResult {
  chunkNumber: number;
  chunkFile: string;
  pageRange: string;
  markdown: string;
  success: boolean;
  error?: string;
  timestamp: string;
}

// Main execution
async function main() {
  console.log('🚀 Starting RPS PDF Chunks Processing...\\n');

  // Validate setup
  if (!CONFIG.replicateApiToken) {
    console.error('❌ ERROR: REPLICATE_API_TOKEN not found in environment');
    process.exit(1);
  }

  // Find all chunk files
  const chunkFiles = findChunkFiles();
  console.log(`📂 Found ${chunkFiles.length} PDF chunks to process\\n`);

  if (chunkFiles.length === 0) {
    console.error('❌ No chunk files found. Run split-and-process-pdf.sh first.');
    process.exit(1);
  }

  // Create results directory
  if (!fs.existsSync(CONFIG.resultsDir)) {
    fs.mkdirSync(CONFIG.resultsDir, { recursive: true });
  }

  // Process each chunk
  console.log(`⚙️  Processing ${chunkFiles.length} chunks...`);
  console.log(`   Estimated cost: $${(chunkFiles.length * 0.092).toFixed(2)}`);
  console.log(`   Estimated time: ${Math.round(chunkFiles.length * 95 / 60)} minutes\\n`);

  const results: ChunkResult[] = [];

  for (let i = 0; i < chunkFiles.length; i++) {
    const chunkInfo = chunkFiles[i];
    console.log(`\\n[${i + 1}/${chunkFiles.length}] Processing: ${path.basename(chunkInfo.path)}`);
    console.log(`   Pages: ${chunkInfo.pageRange}`);

    try {
      const result = await processChunkWithMarker(chunkInfo, i);
      results.push(result);

      if (result.success) {
        console.log(`   ✅ Success: ${result.markdown.length} chars extracted`);

        // Save individual chunk result
        const chunkResultFile = path.join(
          CONFIG.resultsDir,
          `chunk_${String(i).padStart(3, '0')}.md`
        );
        fs.writeFileSync(chunkResultFile, result.markdown);
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }

      // Rate limiting
      if (i < chunkFiles.length - 1) {
        console.log(`   ⏸️  Waiting ${CONFIG.delayBetweenChunks / 1000}s before next chunk...`);
        await sleep(CONFIG.delayBetweenChunks);
      }

    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}`);
      results.push({
        chunkNumber: i,
        chunkFile: chunkInfo.path,
        pageRange: chunkInfo.pageRange,
        markdown: '',
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Combine all markdown results
  console.log('\\n\\n📝 Combining markdown from all chunks...');
  const combinedMarkdown = results
    .filter(r => r.success)
    .map(r => r.markdown)
    .join('\\n\\n---\\n\\n');

  fs.writeFileSync(CONFIG.outputMarkdownFile, combinedMarkdown);
  console.log(`💾 Saved combined markdown: ${CONFIG.outputMarkdownFile}`);
  console.log(`   Total length: ${combinedMarkdown.length} chars`);

  // Parse into pages
  console.log('\\n📑 Parsing combined markdown into pages...');
  const pages = parseMarkdownByPages(combinedMarkdown);
  fs.writeFileSync(CONFIG.outputJsonFile, JSON.stringify(pages, null, 2));
  console.log(`💾 Saved parsed pages: ${CONFIG.outputJsonFile}`);
  console.log(`   Found ${pages.length} pages with content`);

  // Summary
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  console.log('\\n\\n✅ PROCESSING COMPLETE!');
  console.log(`\\n📊 Summary:`);
  console.log(`   Total chunks: ${results.length}`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Total pages: ${pages.length}`);
  console.log(`   Success rate: ${((successCount / results.length) * 100).toFixed(1)}%`);
  console.log(`\\n💰 Actual cost: $${(successCount * 0.092).toFixed(2)}`);
  console.log(`\\n🎯 Next steps:`);
  console.log(`   1. Review output files in scripts/rps/output/`);
  console.log(`   2. Generate SQL updates for database`);
  console.log(`   3. Test Barry with queries\\n`);
}

// Find all PDF chunk files
function findChunkFiles(): Array<{ path: string; chunkNumber: number; pageRange: string }> {
  if (!fs.existsSync(CONFIG.chunksDir)) {
    return [];
  }

  const files = fs.readdirSync(CONFIG.chunksDir)
    .filter(f => f.startsWith('chunk_') && f.endsWith('.pdf'))
    .sort();

  return files.map(filename => {
    const match = filename.match(/chunk_(\\d+)_pages_(.+)\\.pdf/);
    const chunkNumber = match ? parseInt(match[1]) : 0;
    const pageRange = match ? match[2] : 'unknown';

    return {
      path: path.join(CONFIG.chunksDir, filename),
      chunkNumber,
      pageRange,
    };
  }).sort((a, b) => a.chunkNumber - b.chunkNumber);
}

// Process a single PDF chunk with Marker OCR
async function processChunkWithMarker(
  chunkInfo: { path: string; chunkNumber: number; pageRange: string },
  index: number
): Promise<ChunkResult> {
  const startTime = Date.now();

  try {
    // Read PDF file and convert to base64
    const pdfBuffer = fs.readFileSync(chunkInfo.path);
    const base64Pdf = pdfBuffer.toString('base64');
    const dataUri = `data:application/pdf;base64,${base64Pdf}`;

    console.log(`   📤 Creating prediction...`);

    // Step 1: Create prediction
    const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${CONFIG.replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '4eb62a42c3e5b8695a796936e69afa2c004839aef15410f01492d59783baf752',
        input: {
          document: dataUri,
          lang: 'English',
          dpi: 400,
          parallel_factor: 2,
          enable_editor: false
        }
      })
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`API error: ${createResponse.status} - ${errorText}`);
    }

    const prediction = await createResponse.json();
    const predictionId = prediction.id;
    console.log(`   ✓ Prediction: ${predictionId}`);

    // Step 2: Poll for completion
    let attempts = 0;
    const maxAttempts = 240; // 20 minutes (100 pages should take ~10-15 min)
    let status: any;

    while (attempts < maxAttempts) {
      await sleep(5000);

      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: { 'Authorization': `Token ${CONFIG.replicateApiToken}` }
        }
      );

      if (!statusResponse.ok) {
        throw new Error(`Status check failed: ${statusResponse.status}`);
      }

      status = await statusResponse.json();

      if (status.status === 'succeeded') {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`   ✓ Completed in ${elapsed}s`);
        break;
      }

      if (status.status === 'failed' || status.status === 'canceled') {
        throw new Error(`Prediction ${status.status}: ${status.error || 'Unknown'}`);
      }

      attempts++;
      if (attempts % 12 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
        console.log(`   ⏳ Still processing... (${elapsed} minutes)`);
      }
    }

    if (attempts >= maxAttempts) {
      throw new Error('Timeout after 20 minutes');
    }

    // Step 3: Download markdown
    const markdownUrl = status.output.markdown;
    if (!markdownUrl) {
      throw new Error('No markdown URL in output');
    }

    const markdownResponse = await fetch(markdownUrl);
    if (!markdownResponse.ok) {
      throw new Error(`Markdown download failed: ${markdownResponse.status}`);
    }

    const markdownContent = await markdownResponse.text();

    return {
      chunkNumber: index,
      chunkFile: chunkInfo.path,
      pageRange: chunkInfo.pageRange,
      markdown: markdownContent,
      success: true,
      timestamp: new Date().toISOString(),
    };

  } catch (error: any) {
    return {
      chunkNumber: index,
      chunkFile: chunkInfo.path,
      pageRange: chunkInfo.pageRange,
      markdown: '',
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

// Parse markdown into pages
function parseMarkdownByPages(markdown: string): PageContent[] {
  const pages: PageContent[] = [];
  const lines = markdown.split('\\n');

  let currentPage: PageContent = {
    pageNumber: 1,
    title: '',
    content: '',
    chunkNumber: 0
  };

  let contentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for page markers
    const pageMatch = trimmed.match(/^(?:Page|page)\\s+(\\d+)/i);

    if (pageMatch) {
      // Save previous page
      if (contentLines.length > 0) {
        currentPage.content = contentLines.join('\\n').trim();
        if (!currentPage.title) {
          currentPage.title = extractTitleFromContent(currentPage.content);
        }
        pages.push(currentPage);
      }

      // Start new page
      currentPage = {
        pageNumber: parseInt(pageMatch[1]),
        title: '',
        content: '',
        chunkNumber: 0
      };
      contentLines = [];
      continue;
    }

    // Extract title from first heading
    if (!currentPage.title && trimmed.startsWith('#')) {
      currentPage.title = trimmed.replace(/^#+\\s*/, '').trim();
    }

    // Accumulate content
    if (trimmed.length > 0) {
      contentLines.push(line);
    }
  }

  // Save last page
  if (contentLines.length > 0) {
    currentPage.content = contentLines.join('\\n').trim();
    if (!currentPage.title) {
      currentPage.title = extractTitleFromContent(currentPage.content);
    }
    pages.push(currentPage);
  }

  return pages;
}

// Extract title from content
function extractTitleFromContent(content: string): string {
  const lines = content.split('\\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Look for headings
    if (trimmed.startsWith('#')) {
      return trimmed.replace(/^#+\\s*/, '').trim();
    }

    // Look for all-caps lines
    if (trimmed.length > 10 && trimmed === trimmed.toUpperCase() && /^[A-Z\\s,\\-\\(\\)]+$/.test(trimmed)) {
      return trimmed;
    }

    // First substantial line
    if (trimmed.length > 10) {
      return trimmed.substring(0, 100);
    }
  }

  return 'Untitled Page';
}

// Sleep utility
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run main function
main().catch(error => {
  console.error('\\n❌ FATAL ERROR:', error);
  process.exit(1);
});
