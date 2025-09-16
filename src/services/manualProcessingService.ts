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

      // Get current user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create or update processed_manuals record FIRST to get the manual_id
      const { data: processedManual, error: processedManualError } = await supabase
        .from('processed_manuals')
        .upsert({
          filename,
          original_filename: filename,
          title: filename.replace('.pdf', '').replace(/[-_]/g, ' '),
          category: 'Technical Manual',
          file_size: 0,
          uploaded_by: user.id,
          processing_status: 'completed',
          processing_completed_at: new Date().toISOString(),
          chunk_count: chunks.length,
          page_count: numPages
        }, {
          onConflict: 'filename'
        })
        .select('id')
        .single();

      if (processedManualError || !processedManual) {
        throw new Error(`Failed to create processed manual record: ${processedManualError?.message}`);
      }

      // Update all chunks to use the correct manual_id
      const chunksWithCorrectId = chunks.map(chunk => ({
        ...chunk,
        manual_id: processedManual.id
      }));

      // Check if chunks already exist and delete them
      const { data: existingChunks } = await supabase
        .from('manual_chunks')
        .select('id')
        .eq('manual_id', processedManual.id)
        .limit(1);

      if (existingChunks && existingChunks.length > 0) {
        console.log(`Manual ${filename} already has chunks, updating...`);
        await supabase
          .from('manual_chunks')
          .delete()
          .eq('manual_id', processedManual.id);
      }

      // Insert chunks with correct manual_id
      const { error: insertError } = await supabase
        .from('manual_chunks')
        .insert(chunksWithCorrectId);

      if (insertError) {
        throw new Error(`Failed to insert chunks: ${insertError.message}`);
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