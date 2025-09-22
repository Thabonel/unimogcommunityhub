import { supabase } from '@/lib/supabase-client';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface ProcessingResult {
  filename: string;
  success: boolean;
  chunks?: number;
  pages?: number;
  error?: string;
}

export class ManualProcessingService {
  private static instance: ManualProcessingService;

  static getInstance(): ManualProcessingService {
    if (!this.instance) {
      this.instance = new ManualProcessingService();
    }
    return this.instance;
  }

  /**
   * Process a PDF file and create chunks for Barry AI
   */
  async processManual(filename: string): Promise<ProcessingResult> {
    try {
      console.log(`Starting processing for ${filename}`);
      
      // Download the PDF from storage
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('manuals')
        .download(filename);

      if (downloadError || !fileData) {
        throw new Error(`Failed to download file: ${downloadError?.message || 'Unknown error'}`);
      }

      // Convert blob to array buffer
      const arrayBuffer = await fileData.arrayBuffer();
      
      // Load PDF with PDF.js
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      console.log(`PDF loaded: ${numPages} pages`);

      // Extract text from all pages
      const chunks: Array<{
        manual_id: string;
        manual_title: string;
        chunk_index: number;
        page_number: number;
        section_title: string;
        content: string;
      }> = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Combine text items into page text
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (pageText.length > 0) {
          // Split page into smaller chunks if it's too long
          const maxChunkSize = 1500;
          const pageChunks = this.splitIntoChunks(pageText, maxChunkSize);

          pageChunks.forEach((chunk, index) => {
            const chunkIndex = (pageNum - 1) * pageChunks.length + index;
            chunks.push({
              manual_id: '', // Will be set later with the actual processed_manuals.id
              manual_title: filename,
              chunk_index: chunkIndex,
              page_number: pageNum,
              section_title: `${filename} - Page ${pageNum}${pageChunks.length > 1 ? ` Part ${index + 1}` : ''}`,
              content: chunk
            });
          });
        }
      }

      console.log(`Extracted ${chunks.length} chunks from ${numPages} pages`);

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

      if (metadataError || !manualRecord) {
        throw new Error(`Failed to create manual metadata: ${metadataError?.message}`);
      }

      console.log(`📋 Created manual metadata record with ID: ${manualRecord.id}`);

      // Save chunks to manual_chunks table
      const chunksWithManualId = chunks.map(chunk => ({
        ...chunk,
        manual_id: manualRecord.id
      }));

      const { error: chunksError } = await supabase
        .from('manual_chunks')
        .upsert(chunksWithManualId, {
          onConflict: 'manual_id,chunk_index'
        });

      if (chunksError) {
        throw new Error(`Failed to save chunks: ${chunksError.message}`);
      }

      console.log('✅ Manual processing completed successfully');
      console.log(`📊 Processing summary:
        - File: ${filename}
        - Pages: ${numPages}
        - Chunks: ${chunks.length} (saved to database)
        - Manual ID: ${manualRecord.id}
        - Average chunk size: ${Math.round(chunks.reduce((sum, c) => sum + c.content.length, 0) / chunks.length)} chars
      `);

      return {
        filename,
        success: true,
        chunks: chunks.length,
        pages: numPages
      };

    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
      
      // Update status to failed in manual_metadata
      await supabase
        .from('manual_metadata')
        .upsert({
          filename,
          title: filename.replace('.pdf', '').replace(/[-_]/g, ' '),
          description: `Technical manual for ${filename.replace('.pdf', '').replace(/[-_]/g, ' ')}`,
          file_size: 0,
          status: 'failed',
          processing_started_at: new Date().toISOString(),
          processing_error: error instanceof Error ? error.message : 'Unknown error'
        }, {
          onConflict: 'filename'
        });

      return {
        filename,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Split text into chunks of maximum size
   */
  private splitIntoChunks(text: string, maxSize: number): string[] {
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
   * Get list of all manuals in storage
   */
  async getStorageManuals() {
    const { data, error } = await supabase
      .storage
      .from('manuals')
      .list('', {
        limit: 100,
        offset: 0
      });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * Get list of processed manuals
   */
  async getProcessedManuals() {
    const { data, error } = await supabase
      .from('manual_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  /**
   * Check which manuals need processing
   */
  async getUnprocessedManuals() {
    const storageFiles = await this.getStorageManuals();
    const processedFiles = await this.getProcessedManuals();

    const processedFilenames = new Set(
      processedFiles
        .filter(f => f.status === 'processed' || f.processed_at)
        .map(f => f.filename)
    );

    return storageFiles.filter(file => !processedFilenames.has(file.name));
  }
}