/**
 * PDF Page Renderer
 * Renders PDF pages to PNG images and uploads to Supabase Storage
 *
 * Requirements:
 * - npm install pdf-lib @napi-rs/canvas pdfjs-dist sharp
 * - Environment variables: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 * npx ts-node scripts/pdf-images/render-pages.ts --file "manual.pdf" --pages 1-20
 */

import { createClient } from '@supabase/supabase-js';
import * as pdfjs from 'pdfjs-dist';
import { createCanvas } from '@napi-rs/canvas';
import sharp from 'sharp';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface RenderOptions {
  filename: string;
  bucket?: string;
  startPage?: number;
  endPage?: number;
  scale?: number;
  quality?: number;
}

interface PageResult {
  pageNumber: number;
  success: boolean;
  imageUrl?: string;
  error?: string;
}

class PDFPageRenderer {
  private supabase;

  constructor() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    }
    this.supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }

  async downloadPDF(filename: string, bucket: string = 'manuals'): Promise<ArrayBuffer> {
    console.log(`Downloading ${filename} from ${bucket}...`);

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(filename);

    if (error || !data) {
      throw new Error(`Failed to download PDF: ${error?.message}`);
    }

    return await data.arrayBuffer();
  }

  async renderPage(
    pdfDoc: pdfjs.PDFDocumentProxy,
    pageNumber: number,
    scale: number = 2.0
  ): Promise<Buffer> {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    await page.render({
      canvasContext: context as unknown as CanvasRenderingContext2D,
      viewport: viewport,
    }).promise;

    const pngBuffer = canvas.toBuffer('image/png');
    return Buffer.from(pngBuffer);
  }

  async optimizeImage(buffer: Buffer, quality: number = 80): Promise<Buffer> {
    return await sharp(buffer)
      .resize(1200, null, { withoutEnlargement: true })
      .png({ quality, compressionLevel: 9 })
      .toBuffer();
  }

  async uploadImage(
    buffer: Buffer,
    filename: string,
    pageNumber: number
  ): Promise<string> {
    const manualId = filename.replace('.pdf', '').replace(/[^a-zA-Z0-9-_]/g, '_');
    const imagePath = `${manualId}/page-${String(pageNumber).padStart(4, '0')}.png`;

    const { error } = await this.supabase.storage
      .from('page-images')
      .upload(imagePath, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    return `${SUPABASE_URL}/storage/v1/object/public/page-images/${imagePath}`;
  }

  async updateManualChunk(
    filename: string,
    pageNumber: number,
    imageUrl: string
  ): Promise<void> {
    const manualTitle = filename.replace('.pdf', '').replace(/-/g, ' ');

    const { error } = await this.supabase
      .from('manual_chunks')
      .update({
        page_image_url: imageUrl,
        has_visual_elements: true
      })
      .eq('manual_title', manualTitle)
      .eq('page_number', pageNumber);

    if (error) {
      console.warn(`Failed to update manual_chunks for page ${pageNumber}:`, error.message);
    }
  }

  async render(options: RenderOptions): Promise<PageResult[]> {
    const {
      filename,
      bucket = 'manuals',
      startPage = 1,
      endPage,
      scale = 2.0,
      quality = 80
    } = options;

    console.log(`\nRendering PDF pages for: ${filename}`);
    console.log(`Scale: ${scale}, Quality: ${quality}`);

    const pdfData = await this.downloadPDF(filename, bucket);
    const pdfDoc = await pdfjs.getDocument({ data: pdfData }).promise;

    const totalPages = pdfDoc.numPages;
    const lastPage = endPage ? Math.min(endPage, totalPages) : totalPages;

    console.log(`PDF has ${totalPages} pages, rendering ${startPage} to ${lastPage}`);

    const results: PageResult[] = [];

    for (let pageNum = startPage; pageNum <= lastPage; pageNum++) {
      try {
        console.log(`  Rendering page ${pageNum}/${lastPage}...`);

        const pngBuffer = await this.renderPage(pdfDoc, pageNum, scale);
        const optimizedBuffer = await this.optimizeImage(pngBuffer, quality);
        const imageUrl = await this.uploadImage(optimizedBuffer, filename, pageNum);
        await this.updateManualChunk(filename, pageNum, imageUrl);

        results.push({
          pageNumber: pageNum,
          success: true,
          imageUrl
        });

        console.log(`    Uploaded: ${imageUrl}`);

      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`    Error on page ${pageNum}:`, errorMessage);
        results.push({
          pageNumber: pageNum,
          success: false,
          error: errorMessage
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`\nCompleted: ${successCount}/${results.length} pages rendered successfully`);

    return results;
  }
}

async function main() {
  const args = process.argv.slice(2);

  const fileArg = args.find(a => a.startsWith('--file='));
  const pagesArg = args.find(a => a.startsWith('--pages='));
  const scaleArg = args.find(a => a.startsWith('--scale='));
  const qualityArg = args.find(a => a.startsWith('--quality='));
  const bucketArg = args.find(a => a.startsWith('--bucket='));

  if (!fileArg) {
    console.log(`
Usage: npx ts-node scripts/pdf-images/render-pages.ts [options]

Options:
  --file=<filename>     PDF filename (required)
  --pages=<start-end>   Page range (e.g., 1-20, default: all)
  --scale=<number>      Render scale (default: 2.0)
  --quality=<number>    PNG quality 1-100 (default: 80)
  --bucket=<name>       Storage bucket (default: manuals)

Examples:
  npx ts-node scripts/pdf-images/render-pages.ts --file="U435-Workshop-Manual.pdf"
  npx ts-node scripts/pdf-images/render-pages.ts --file="manual.pdf" --pages=1-50 --scale=1.5
`);
    process.exit(1);
  }

  const filename = fileArg.split('=')[1];
  const bucket = bucketArg ? bucketArg.split('=')[1] : 'manuals';
  const scale = scaleArg ? parseFloat(scaleArg.split('=')[1]) : 2.0;
  const quality = qualityArg ? parseInt(qualityArg.split('=')[1]) : 80;

  let startPage = 1;
  let endPage: number | undefined;

  if (pagesArg) {
    const pagesValue = pagesArg.split('=')[1];
    if (pagesValue.includes('-')) {
      const [start, end] = pagesValue.split('-').map(Number);
      startPage = start;
      endPage = end;
    } else {
      startPage = parseInt(pagesValue);
      endPage = startPage;
    }
  }

  try {
    const renderer = new PDFPageRenderer();
    const results = await renderer.render({
      filename,
      bucket,
      startPage,
      endPage,
      scale,
      quality
    });

    console.log('\nResults Summary:');
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
