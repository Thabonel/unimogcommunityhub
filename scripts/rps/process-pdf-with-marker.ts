#!/usr/bin/env ts-node
/**
 * RPS PDF Processing with Marker OCR
 *
 * Processes RPS PDF directly with Marker OCR (designed for PDFs, not PNGs)
 * Single API call per PDF, then parse markdown output by pages
 *
 * Usage:
 *   export REPLICATE_API_TOKEN="your_token"
 *   ts-node scripts/rps/process-pdf-with-marker.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  pdfUrl: 'https://afmsafety.com.au/wp-content/uploads/2018/03/RPS-02155-Unimog-GS-Base-Scale.pdf',
  outputDir: path.join(__dirname, 'output'),
  outputMarkdownFile: path.join(__dirname, 'output/base-scale-markdown.md'),
  outputJsonFile: path.join(__dirname, 'output/base-scale-pages.json'),
  replicateApiToken: process.env.REPLICATE_API_TOKEN || process.env.VITE_REPLICATE_API_TOKEN,
};

// Types
interface PageContent {
  pageNumber: number;
  title: string;
  content: string;
}

// Main execution
async function main() {
  console.log('🚀 Starting RPS PDF Processing with Marker OCR...\n');

  // Validate setup
  if (!CONFIG.replicateApiToken) {
    console.error('❌ ERROR: REPLICATE_API_TOKEN not found in environment');
    console.error('   Set it with: export REPLICATE_API_TOKEN="your_token"');
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  console.log(`📄 PDF URL: ${CONFIG.pdfUrl}\n`);

  // Step 1: Create prediction with public URL
  console.log('📤 Creating Marker OCR prediction with public URL...\n');

  const createResponse = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${CONFIG.replicateApiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: '4eb62a42c3e5b8695a796936e69afa2c004839aef15410f01492d59783baf752',
      input: {
        document: CONFIG.pdfUrl,
        lang: 'English',
        dpi: 400,
        enable_editor: false,
      }
    })
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Replicate API error: ${createResponse.status} - ${errorText}`);
  }

  const prediction = await createResponse.json();
  const predictionId = prediction.id;

  console.log(`✅ Prediction created: ${predictionId}`);
  console.log(`   Status: ${prediction.status}`);
  console.log(`   Estimated time: 10-15 minutes for full PDF\n`);

  // Step 2: Poll for completion
  console.log('⏳ Waiting for OCR to complete...');
  let attempts = 0;
  const maxAttempts = 180; // 15 minutes max (5 second intervals)
  let status: any;

  const startTime = Date.now();

  while (attempts < maxAttempts) {
    await sleep(5000); // Poll every 5 seconds

    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${CONFIG.replicateApiToken}`,
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to check prediction status: ${statusResponse.status}`);
    }

    status = await statusResponse.json();

    if (status.status === 'succeeded') {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`\n✅ OCR completed in ${elapsed}s`);
      break;
    }

    if (status.status === 'failed' || status.status === 'canceled') {
      throw new Error(`Prediction ${status.status}: ${status.error || 'Unknown error'}`);
    }

    attempts++;
    if (attempts % 12 === 0) { // Every minute
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      console.log(`   Still processing... (${elapsed} minutes elapsed)`);
    }
  }

  if (attempts >= maxAttempts) {
    throw new Error('Prediction timed out after 15 minutes');
  }

  // Step 3: Download markdown
  const markdownUrl = status.output.markdown;

  if (!markdownUrl || typeof markdownUrl !== 'string') {
    throw new Error(`Invalid markdown URL in output: ${JSON.stringify(status.output)}`);
  }

  console.log(`\n📥 Downloading markdown from Replicate...`);

  const markdownResponse = await fetch(markdownUrl);

  if (!markdownResponse.ok) {
    throw new Error(`Failed to download markdown: ${markdownResponse.status}`);
  }

  const markdownContent = await markdownResponse.text();

  console.log(`   Markdown length: ${markdownContent.length} chars`);
  console.log(`   Markdown size: ${(markdownContent.length / 1024).toFixed(2)} KB\n`);

  // Save raw markdown
  fs.writeFileSync(CONFIG.outputMarkdownFile, markdownContent);
  console.log(`💾 Saved markdown: ${CONFIG.outputMarkdownFile}`);

  // Step 4: Parse markdown by pages
  console.log('\n📑 Parsing markdown by pages...');
  const pages = parseMarkdownByPages(markdownContent);

  console.log(`   Found ${pages.length} pages with content`);

  // Save parsed pages as JSON
  fs.writeFileSync(CONFIG.outputJsonFile, JSON.stringify(pages, null, 2));
  console.log(`💾 Saved parsed pages: ${CONFIG.outputJsonFile}`);

  // Step 5: Show summary
  console.log('\n\n✅ PROCESSING COMPLETE!');
  console.log(`\n📊 Summary:`);
  console.log(`   Total pages parsed: ${pages.length}`);
  console.log(`   Pages with titles: ${pages.filter(p => p.title).length}`);
  console.log(`   Pages with content: ${pages.filter(p => p.content.length > 0).length}`);
  console.log(`   Average content length: ${Math.round(pages.reduce((sum, p) => sum + p.content.length, 0) / pages.length)} chars`);

  // Show first 3 page samples
  console.log(`\n📄 Sample Pages:`);
  for (let i = 0; i < Math.min(3, pages.length); i++) {
    const page = pages[i];
    console.log(`\n   Page ${page.pageNumber}:`);
    console.log(`   Title: "${page.title}"`);
    console.log(`   Content: ${page.content.substring(0, 100)}...`);
  }

  console.log(`\n💰 Cost Estimate:`);
  console.log(`   This run: ~$0.092 (single PDF processing)`);
  console.log(`\n🎯 Next steps:`);
  console.log(`   1. Review output files in scripts/rps/output/`);
  console.log(`   2. Verify page parsing is correct`);
  console.log(`   3. Process second PDF if this looks good`);
  console.log(`   4. Generate SQL updates for database\n`);
}

// Parse markdown into pages
function parseMarkdownByPages(markdown: string): PageContent[] {
  const pages: PageContent[] = [];

  // Split by page breaks (Marker typically uses \n\n---\n\n or similar)
  // We'll look for patterns like "Page X" or headings that indicate page breaks
  const lines = markdown.split('\n');

  let currentPage: PageContent = {
    pageNumber: 1,
    title: '',
    content: ''
  };

  let contentLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for page markers (various formats Marker might use)
    const pageMatch = trimmed.match(/^(?:Page|page)\s+(\d+)/i);

    if (pageMatch) {
      // Save previous page if it has content
      if (contentLines.length > 0) {
        currentPage.content = contentLines.join('\n').trim();
        if (!currentPage.title) {
          currentPage.title = extractTitleFromContent(currentPage.content);
        }
        pages.push(currentPage);
      }

      // Start new page
      currentPage = {
        pageNumber: parseInt(pageMatch[1]),
        title: '',
        content: ''
      };
      contentLines = [];
      continue;
    }

    // Check for titles (first heading on page)
    if (!currentPage.title && trimmed.startsWith('#')) {
      currentPage.title = trimmed.replace(/^#+\s*/, '').trim();
    }

    // Accumulate content
    if (trimmed.length > 0) {
      contentLines.push(line);
    }
  }

  // Save last page
  if (contentLines.length > 0) {
    currentPage.content = contentLines.join('\n').trim();
    if (!currentPage.title) {
      currentPage.title = extractTitleFromContent(currentPage.content);
    }
    pages.push(currentPage);
  }

  // If no explicit page markers found, split by estimated page length
  if (pages.length === 0 || pages.length === 1) {
    console.log('   No explicit page markers found, using content-based splitting...');
    return splitByContentLength(markdown);
  }

  return pages;
}

// Extract title from content (first heading or first substantial line)
function extractTitleFromContent(content: string): string {
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Look for headings
    if (trimmed.startsWith('#')) {
      return trimmed.replace(/^#+\s*/, '').trim();
    }

    // Look for all-caps lines
    if (trimmed.length > 10 && trimmed === trimmed.toUpperCase() && /^[A-Z\s,\-\(\)]+$/.test(trimmed)) {
      return trimmed;
    }

    // First non-empty line as fallback
    if (trimmed.length > 0) {
      return trimmed.substring(0, 100);
    }
  }

  return 'Untitled Page';
}

// Fallback: split by estimated content length
function splitByContentLength(markdown: string): PageContent[] {
  const avgCharsPerPage = 2000; // Rough estimate
  const pages: PageContent[] = [];

  const chunks = markdown.match(new RegExp(`.{1,${avgCharsPerPage}}`, 'g')) || [];

  chunks.forEach((chunk, index) => {
    pages.push({
      pageNumber: index + 1,
      title: extractTitleFromContent(chunk),
      content: chunk.trim()
    });
  });

  return pages;
}

// Sleep utility
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run main function
main().catch(error => {
  console.error('\n❌ FATAL ERROR:', error);
  process.exit(1);
});
