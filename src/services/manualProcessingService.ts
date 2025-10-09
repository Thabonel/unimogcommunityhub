import { supabase } from '@/lib/supabase-client';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use CDN for reliability
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

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
   * Process a PDF file and create chunks for Barry AI using Edge Function
   */
  async processManual(filename: string): Promise<ProcessingResult> {
    try {
      console.log(`Starting processing for ${filename}`);

      // Use the Edge Function to process the manual (bypasses schema cache issues)
      const { data, error } = await supabase.functions.invoke('process-manual', {
        body: { filename }
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error(`Processing failed: ${data?.error || 'Unknown error'}`);
      }

      console.log('✅ Manual processing completed successfully via Edge Function');
      console.log(`📊 Processing summary:
        - File: ${filename}
        - Pages: ${data.pages}
        - Chunks: ${data.chunks}
      `);

      return {
        filename,
        success: true,
        chunks: data.chunks,
        pages: data.pages
      };

    } catch (error) {
      console.error(`Error processing ${filename}:`, error);

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
        .filter(f => f.processing_status === 'completed' || f.status === 'completed')
        .map(f => f.filename)
    );

    return storageFiles.filter(file => !processedFilenames.has(file.name));
  }
}