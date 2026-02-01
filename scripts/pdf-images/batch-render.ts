/**
 * Batch PDF Page Renderer
 * Processes all PDFs in a Supabase storage bucket
 *
 * Usage:
 * npx ts-node scripts/pdf-images/batch-render.ts --bucket=manuals --max=10
 */

import { createClient } from '@supabase/supabase-js';
import * as pdfjs from 'pdfjs-dist';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface ManualInfo {
  filename: string;
  size: number;
  processed: boolean;
}

async function getManualsList(supabase: ReturnType<typeof createClient>, bucket: string): Promise<ManualInfo[]> {
  const { data: files, error } = await supabase.storage
    .from(bucket)
    .list('', { limit: 1000 });

  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }

  const pdfFiles = files
    .filter(f => f.name.toLowerCase().endsWith('.pdf'))
    .map(f => ({
      filename: f.name,
      size: f.metadata?.size || 0,
      processed: false
    }));

  for (const file of pdfFiles) {
    const { data } = await supabase.storage
      .from('page-images')
      .list(file.filename.replace('.pdf', '').replace(/[^a-zA-Z0-9-_]/g, '_'), { limit: 1 });

    file.processed = data && data.length > 0;
  }

  return pdfFiles;
}

async function renderPage(
  pdfDoc: pdfjs.PDFDocumentProxy,
  pageNumber: number,
  scale: number = 1.5
): Promise<Buffer> {
  const page = await pdfDoc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  await page.render({
    canvasContext: context as unknown as CanvasRenderingContext2D,
    viewport: viewport,
  }).promise;

  return Buffer.from(canvas.toBuffer('image/png'));
}

async function processManual(
  supabase: ReturnType<typeof createClient>,
  filename: string,
  bucket: string = 'manuals'
): Promise<{ success: number; failed: number }> {
  console.log(`\nProcessing: ${filename}`);

  const { data, error } = await supabase.storage.from(bucket).download(filename);
  if (error || !data) {
    console.error(`  Failed to download: ${error?.message}`);
    return { success: 0, failed: 1 };
  }

  const pdfData = await data.arrayBuffer();
  const pdfDoc = await pdfjs.getDocument({ data: pdfData }).promise;
  const totalPages = pdfDoc.numPages;

  console.log(`  Total pages: ${totalPages}`);

  const manualId = filename.replace('.pdf', '').replace(/[^a-zA-Z0-9-_]/g, '_');
  const manualTitle = filename.replace('.pdf', '').replace(/-/g, ' ');
  let successCount = 0;
  let failedCount = 0;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    try {
      const pngBuffer = await renderPage(pdfDoc, pageNum);

      const optimizedBuffer = await sharp(pngBuffer)
        .resize(1200, null, { withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 9 })
        .toBuffer();

      const imagePath = `${manualId}/page-${String(pageNum).padStart(4, '0')}.png`;

      const { error: uploadError } = await supabase.storage
        .from('page-images')
        .upload(imagePath, optimizedBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error(`  Page ${pageNum} upload failed:`, uploadError.message);
        failedCount++;
        continue;
      }

      const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/page-images/${imagePath}`;

      await supabase
        .from('manual_chunks')
        .update({
          page_image_url: imageUrl,
          has_visual_elements: true
        })
        .eq('manual_title', manualTitle)
        .eq('page_number', pageNum);

      successCount++;

      if (pageNum % 10 === 0) {
        console.log(`  Progress: ${pageNum}/${totalPages} pages`);
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`  Page ${pageNum} failed:`, errorMessage);
      failedCount++;
    }
  }

  console.log(`  Completed: ${successCount} success, ${failedCount} failed`);
  return { success: successCount, failed: failedCount };
}

async function main() {
  const args = process.argv.slice(2);
  const bucketArg = args.find(a => a.startsWith('--bucket='));
  const maxArg = args.find(a => a.startsWith('--max='));
  const skipProcessedArg = args.includes('--skip-processed');

  const bucket = bucketArg ? bucketArg.split('=')[1] : 'manuals';
  const maxManuals = maxArg ? parseInt(maxArg.split('=')[1]) : Infinity;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  console.log('Batch PDF Page Renderer');
  console.log(`Bucket: ${bucket}`);
  console.log(`Max manuals: ${maxManuals === Infinity ? 'all' : maxManuals}`);
  console.log(`Skip processed: ${skipProcessedArg}`);

  const manuals = await getManualsList(supabase, bucket);
  console.log(`\nFound ${manuals.length} PDFs in bucket`);

  let toProcess = manuals;
  if (skipProcessedArg) {
    toProcess = manuals.filter(m => !m.processed);
    console.log(`${toProcess.length} unprocessed PDFs`);
  }

  toProcess = toProcess.slice(0, maxManuals);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const manual of toProcess) {
    const result = await processManual(supabase, manual.filename, bucket);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  console.log('\n=== Batch Complete ===');
  console.log(`Manuals processed: ${toProcess.length}`);
  console.log(`Total pages: ${totalSuccess + totalFailed}`);
  console.log(`Success: ${totalSuccess}`);
  console.log(`Failed: ${totalFailed}`);
}

main().catch(console.error);
