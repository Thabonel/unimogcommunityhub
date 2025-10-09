import { supabase } from '@/lib/supabase-client';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use CDN with explicit HTTPS for reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

interface ProcessingResult {
  success: boolean;
  manualId?: string;
  title?: string;
  pages?: number;
  chunks?: number;
  error?: string;
}

export class ClientManualProcessor {
  private static instance: ClientManualProcessor;

  static getInstance(): ClientManualProcessor {
    if (!this.instance) {
      this.instance = new ClientManualProcessor();
    }
    return this.instance;
  }

  /**
   * Process a manual directly on the client side
   */
  async processManual(filename: string): Promise<ProcessingResult> {
    try {
      console.log(`Starting client-side processing for ${filename}`);

      // Download PDF from storage
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('manuals')
        .download(filename);

      if (downloadError || !fileData) {
        throw new Error(`Failed to download ${filename}: ${downloadError?.message}`);
      }

      // Convert blob to array buffer
      const arrayBuffer = await fileData.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdfDocument = await loadingTask.promise;

      console.log(`PDF loaded: ${pdfDocument.numPages} pages`);

      // Extract text from all pages
      const pages: string[] = [];
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine text items into readable text
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (pageText.length > 50) { // Only include pages with substantial content
          pages.push(pageText);
        }
      }

      console.log(`Extracted text from ${pages.length} pages`);

      // Create manual metadata
      const title = filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      const modelCodes = this.extractModelCodes(title + ' ' + pages.slice(0, 3).join(' '));

      // Create or update manual metadata
      const { data: manualMetadata, error: metadataError } = await supabase
        .from('manual_metadata')
        .upsert({
          filename,
          title,
          model_codes: modelCodes,
          year_range: '2000-2024',
          category: 'workshop',
          page_count: pages.length,
          file_size: fileData.size,
          processing_status: 'processing',
          processing_started_at: new Date().toISOString(),
        }, {
          onConflict: 'filename'
        })
        .select()
        .single();

      if (metadataError || !manualMetadata) {
        throw new Error(`Failed to create manual metadata: ${metadataError?.message}`);
      }

      console.log(`Created manual metadata with ID: ${manualMetadata.id}`);

      // Process pages into chunks
      const chunks = await this.createChunks(pages, manualMetadata.id, title);

      console.log(`Created ${chunks.length} chunks`);

      // Update manual metadata with completion status
      await supabase
        .from('manual_metadata')
        .update({
          processing_status: 'completed',
          processing_completed_at: new Date().toISOString(),
          processed_at: new Date().toISOString(),
          chunk_count: chunks.length,
        })
        .eq('id', manualMetadata.id);

      return {
        success: true,
        manualId: manualMetadata.id,
        title: manualMetadata.title,
        pages: pages.length,
        chunks: chunks.length,
      };

    } catch (error) {
      console.error('Client-side processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create chunks from page text
   */
  private async createChunks(pages: string[], manualId: string, title: string): Promise<any[]> {
    const chunks: any[] = [];
    let chunkIndex = 0;

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const pageText = pages[pageIndex];

      // Split page into smaller chunks if it's too long
      const pageChunks = this.splitTextIntoChunks(pageText, 1500);

      for (const chunkText of pageChunks) {
        const chunk = {
          manual_id: manualId,
          manual_title: title,
          chunk_index: chunkIndex++,
          content: chunkText,
          page_number: pageIndex + 1,
          section_title: this.extractSectionTitle(chunkText),
          metadata: {
            filename: title,
            char_count: chunkText.length,
            word_count: chunkText.split(/\s+/).length,
            contentType: this.detectContentType(chunkText),
            extractionMethod: 'client-side',
            extractionQuality: 0.9,
          }
        };

        chunks.push(chunk);
      }
    }

    // Insert chunks in batches
    const batchSize = 100;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);

      const { error } = await supabase
        .from('manual_chunks')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i / batchSize}:`, error);
      }
    }

    return chunks;
  }

  /**
   * Split text into chunks of specified size
   */
  private splitTextIntoChunks(text: string, maxSize: number): string[] {
    if (text.length <= maxSize) {
      return [text];
    }

    const chunks: string[] = [];
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

  /**
   * Extract model codes from text
   */
  private extractModelCodes(text: string): string[] {
    const modelCodes = new Set<string>();

    // Common Unimog model patterns
    const patterns = [
      /U\d{3,4}[A-Z]?/g,  // U1700, U5023
      /U1700L/g,          // Specific to this manual
      /U435/g,            // Specific to this manual
      /404[.\s]?\d*/g,    // 404, 404.1
      /406/g, /411/g, /416/g, /421/g, /425/g, /435/g, /437/g,
    ];

    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => modelCodes.add(match.trim()));
      }
    });

    return Array.from(modelCodes);
  }

  /**
   * Extract section title from text
   */
  private extractSectionTitle(text: string): string | null {
    const lines = text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Check for numbered sections
      if (trimmed.match(/^\d+(\.\d+)*\s+[A-Z]/)) {
        return trimmed.substring(0, Math.min(trimmed.length, 100));
      }

      // Check for all caps headers
      if (trimmed.length > 3 && trimmed.length < 100 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
        return trimmed;
      }
    }

    return null;
  }

  /**
   * Detect content type
   */
  private detectContentType(text: string): string {
    const lower = text.toLowerCase();

    if (text.match(/^\s*\d+\.\s+/m) || lower.includes('procedure') || lower.includes('step')) {
      return 'procedure';
    }

    if (text.includes('|') || text.match(/\t{2,}/)) {
      return 'table';
    }

    if (lower.includes('specification') || lower.includes('torque') || text.match(/\d+\s*(nm|bar|psi)/i)) {
      return 'specification';
    }

    if (text.match(/^(WARNING|CAUTION|NOTE|IMPORTANT)/mi)) {
      return 'warning';
    }

    return 'text';
  }
}