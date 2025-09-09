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
        content: string;
        page_number: number;
        manual_name: string;
        title?: string;
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
            chunks.push({
              content: chunk,
              page_number: pageNum,
              manual_name: filename,
              title: `${filename} - Page ${pageNum}${pageChunks.length > 1 ? ` Part ${index + 1}` : ''}`
            });
          });
        }
      }

      console.log(`Extracted ${chunks.length} chunks from ${numPages} pages`);

      // Check if manual is already processed
      const { data: existingChunks } = await supabase
        .from('manual_chunks')
        .select('id')
        .eq('manual_name', filename)
        .limit(1);

      if (existingChunks && existingChunks.length > 0) {
        console.log(`Manual ${filename} already has chunks, updating...`);
        
        // Delete existing chunks
        await supabase
          .from('manual_chunks')
          .delete()
          .eq('manual_name', filename);
      }

      // Insert chunks into database
      const { error: insertError } = await supabase
        .from('manual_chunks')
        .insert(chunks);

      if (insertError) {
        throw new Error(`Failed to insert chunks: ${insertError.message}`);
      }

      // Update processed_manuals table
      const { error: updateError } = await supabase
        .from('processed_manuals')
        .upsert({
          filename,
          processed_at: new Date().toISOString(),
          chunk_count: chunks.length,
          page_count: numPages,
          status: 'completed'
        }, {
          onConflict: 'filename'
        });

      if (updateError) {
        console.error('Failed to update processed_manuals:', updateError);
      }

      return {
        filename,
        success: true,
        chunks: chunks.length,
        pages: numPages
      };

    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
      
      // Update status to failed
      await supabase
        .from('processed_manuals')
        .upsert({
          filename,
          processed_at: new Date().toISOString(),
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
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
      .from('processed_manuals')
      .select('*')
      .order('processed_at', { ascending: false });

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
        .filter(f => f.status === 'completed')
        .map(f => f.filename)
    );
    
    return storageFiles.filter(file => !processedFilenames.has(file.name));
  }
}