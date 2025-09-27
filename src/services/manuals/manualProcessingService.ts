import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';

export interface ProcessingStatus {
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  details?: {
    chunks?: number;
    pages?: number;
    modelCodes?: string[];
    category?: string;
  };
}

export interface ManualUploadOptions {
  file: File;
  title?: string;
  description?: string;
  modelCodes?: string[];
  yearRange?: string;
  category?: string;
  onProgress?: (status: ProcessingStatus) => void;
}

export interface ProcessedManual {
  id: string;
  filename: string;
  title: string;
  modelCodes: string[];
  yearRange: string | null;
  category: string;
  pageCount: number;
  chunkCount: number;
  fileSize: number;
  processedAt: string;
}

export class ManualProcessingService {
  private processingQueue: Map<string, ProcessingStatus> = new Map();

  /**
   * Upload and process a manual file
   */
  async uploadAndProcessManual(options: ManualUploadOptions): Promise<ProcessedManual> {
    const { file, title, description, modelCodes, yearRange, category, onProgress } = options;
    const filename = `${Date.now()}-${file.name}`;
    
    // Initialize processing status
    const updateStatus = (status: Partial<ProcessingStatus>) => {
      const current = this.processingQueue.get(filename) || {
        status: 'idle',
        progress: 0,
        message: '',
      };
      const updated = { ...current, ...status };
      this.processingQueue.set(filename, updated as ProcessingStatus);
      onProgress?.(updated as ProcessingStatus);
    };

    try {
      // Step 1: Upload file to storage
      updateStatus({
        status: 'uploading',
        progress: 10,
        message: 'Uploading manual to storage...',
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('manuals')
        .upload(filename, file, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      updateStatus({
        status: 'uploading',
        progress: 30,
        message: 'File uploaded successfully',
      });

      // Step 2: Add metadata to storage
      const metadata = {
        title: title || file.name.replace(/\.pdf$/i, ''),
        description: description || '',
        modelCodes: modelCodes || [],
        yearRange: yearRange || null,
        category: category || 'general',
        uploadedAt: new Date().toISOString(),
      };

      // Update file metadata
      await supabase.storage
        .from('manuals')
        .update(filename, file, {
          contentType: 'application/pdf',
          upsert: true,
          metadata,
        });

      updateStatus({
        status: 'processing',
        progress: 40,
        message: 'Processing manual content...',
      });

      // Step 3: Call Edge Function to process the manual
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-manual`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({
            filename,
            bucket: 'manuals',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Processing failed');
      }

      const processingResult = await response.json();

      updateStatus({
        status: 'processing',
        progress: 80,
        message: 'Finalizing processing...',
        details: {
          chunks: processingResult.chunks,
          pages: processingResult.pages,
          modelCodes: processingResult.model_codes,
          category: processingResult.category,
        },
      });

      // Step 4: Verify processing completed
      const { data: manualData, error: fetchError } = await supabase
        .from('manual_metadata')
        .select('*')
        .eq('filename', filename)
        .single();

      if (fetchError || !manualData) {
        throw new Error('Failed to verify processing completion');
      }

      updateStatus({
        status: 'completed',
        progress: 100,
        message: 'Manual processed successfully!',
        details: {
          chunks: processingResult.chunks,
          pages: processingResult.pages,
          modelCodes: processingResult.model_codes,
          category: processingResult.category,
        },
      });

      // Clean up status after a delay
      setTimeout(() => {
        this.processingQueue.delete(filename);
      }, 5000);

      return {
        id: manualData.id,
        filename: manualData.filename,
        title: manualData.title,
        modelCodes: manualData.model_codes || [],
        yearRange: manualData.year_range,
        category: manualData.category,
        pageCount: manualData.page_count,
        chunkCount: processingResult.chunks,
        fileSize: manualData.file_size,
        processedAt: manualData.processing_completed_at || manualData.created_at,
      };
    } catch (error) {
      console.error('Manual processing error:', error);
      
      updateStatus({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Processing failed',
      });

      // Clean up on error - try to delete the uploaded file
      try {
        await supabase.storage.from('manuals').remove([filename]);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      throw error;
    }
  }

  /**
   * Process an already uploaded manual
   */
  async processExistingManual(
    filename: string,
    onProgress?: (status: ProcessingStatus) => void
  ): Promise<ProcessedManual> {
    const updateStatus = (status: Partial<ProcessingStatus>) => {
      const current = this.processingQueue.get(filename) || {
        status: 'idle',
        progress: 0,
        message: '',
      };
      const updated = { ...current, ...status };
      this.processingQueue.set(filename, updated as ProcessingStatus);
      onProgress?.(updated as ProcessingStatus);
    };

    try {
      updateStatus({
        status: 'processing',
        progress: 10,
        message: 'Starting manual processing...',
      });

      // Check if already processed
      const { data: existing } = await supabase
        .from('manual_metadata')
        .select('*')
        .eq('filename', filename)
        .single();

      if (existing && existing.processed_at) {
        updateStatus({
          status: 'completed',
          progress: 100,
          message: 'Manual already processed',
        });

        const { data: chunkCount } = await supabase
          .from('manual_chunks')
          .select('id', { count: 'exact', head: true })
          .eq('manual_id', existing.id);

        return {
          id: existing.id,
          filename: existing.filename,
          title: existing.title,
          modelCodes: existing.model_codes || [],
          yearRange: existing.year_range,
          category: existing.category,
          pageCount: existing.page_count,
          chunkCount: existing.chunk_count || 0,
          fileSize: existing.file_size,
          processedAt: existing.processed_at || existing.created_at,
        };
      }

      // Call Edge Function to process
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('Authentication required');
      }

      updateStatus({
        status: 'processing',
        progress: 30,
        message: 'Processing manual content...',
      });

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-manual`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.session.access_token}`,
          },
          body: JSON.stringify({
            filename,
            bucket: 'manuals',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Processing failed');
      }

      const processingResult = await response.json();

      updateStatus({
        status: 'completed',
        progress: 100,
        message: 'Manual processed successfully!',
        details: {
          chunks: processingResult.chunks,
          pages: processingResult.pages,
          modelCodes: processingResult.model_codes,
          category: processingResult.category,
        },
      });

      return {
        id: processingResult.manual_id,
        filename,
        title: processingResult.title,
        modelCodes: processingResult.model_codes || [],
        yearRange: null,
        category: processingResult.category,
        pageCount: processingResult.pages,
        chunkCount: processingResult.chunks,
        fileSize: 0,
        processedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Processing error:', error);
      
      updateStatus({
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Processing failed',
      });

      throw error;
    }
  }

  /**
   * Get list of processed manuals
   */
  async getProcessedManuals(): Promise<ProcessedManual[]> {
    try {
      const { data, error } = await supabase
        .from('manual_metadata')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(manual => ({
        id: manual.id,
        filename: manual.filename,
        title: manual.title,
        modelCodes: manual.model_codes || [],
        yearRange: manual.year_range,
        category: manual.category,
        pageCount: manual.page_count || 0,
        chunkCount: manual.chunk_count || 0,
        fileSize: manual.file_size,
        processedAt: manual.processed_at || manual.created_at,
      }));
    } catch (error) {
      console.error('Error fetching processed manuals:', error);
      toast({
        title: 'Error fetching manuals',
        description: 'Could not load processed manuals',
        variant: 'destructive',
      });
      return [];
    }
  }

  /**
   * Delete a processed manual and its chunks
   */
  async deleteProcessedManual(manualId: string): Promise<boolean> {
    try {
      // Get manual metadata first
      const { data: manual, error: fetchError } = await supabase
        .from('manual_metadata')
        .select('filename, title')
        .eq('id', manualId)
        .single();

      if (fetchError || !manual) {
        throw new Error('Manual not found');
      }

      // Delete from ALL related tables for complete cleanup
      console.log(`🗑️ Deleting manual: ${manual.title} (${manual.filename})`);

      // 1. Delete from manual_metadata table (chunks will cascade delete)
      const { error: deleteError } = await supabase
        .from('manual_metadata')
        .delete()
        .eq('id', manualId);

      if (deleteError) throw deleteError;

      // 2. Delete from manuals table (if exists)
      const { error: manualsDeleteError } = await supabase
        .from('manuals')
        .delete()
        .eq('id', manualId);

      if (manualsDeleteError) {
        console.warn('Could not delete from manuals table:', manualsDeleteError);
      }

      // 3. Delete from processed_manuals table (by title and filename)
      const { error: processedDeleteError } = await supabase
        .from('processed_manuals')
        .delete()
        .or(`id.eq.${manualId},title.ilike.%${manual.title}%,filename.ilike.%${manual.filename}%`);

      if (processedDeleteError) {
        console.warn('Could not delete from processed_manuals table:', processedDeleteError);
      }

      // 4. Delete from storage
      const { error: storageError } = await supabase.storage
        .from('manuals')
        .remove([manual.filename]);

      if (storageError) {
        console.warn('Could not delete file from storage:', storageError);
      }

      toast({
        title: 'Manual deleted',
        description: 'The manual and its chunks have been removed',
      });

      return true;
    } catch (error) {
      console.error('Error deleting manual:', error);
      toast({
        title: 'Delete failed',
        description: error instanceof Error ? error.message : 'Could not delete manual',
        variant: 'destructive',
      });
      return false;
    }
  }

  /**
   * Clean up orphaned manual records that don't have corresponding files in storage
   */
  async cleanupOrphanedRecords(): Promise<{ cleaned: number; errors: string[] }> {
    const errors: string[] = [];
    let cleaned = 0;

    try {
      console.log('🧹 Starting cleanup of orphaned manual records...');

      // Get all storage files
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('manuals')
        .list();

      if (storageError) {
        throw new Error(`Failed to list storage files: ${storageError.message}`);
      }

      const storageFilenames = new Set(storageFiles?.map(file => file.name) || []);

      // Check manual_metadata table
      const { data: metadataRecords, error: metadataError } = await supabase
        .from('manual_metadata')
        .select('id, filename, title');

      if (!metadataError && metadataRecords) {
        for (const record of metadataRecords) {
          if (!storageFilenames.has(record.filename)) {
            console.log(`🗑️ Removing orphaned manual_metadata: ${record.title}`);
            const { error } = await supabase
              .from('manual_metadata')
              .delete()
              .eq('id', record.id);

            if (error) {
              errors.push(`Failed to delete manual_metadata ${record.id}: ${error.message}`);
            } else {
              cleaned++;
            }
          }
        }
      }

      // Check manuals table
      const { data: manualsRecords, error: manualsError } = await supabase
        .from('manuals')
        .select('id, filename, title');

      if (!manualsError && manualsRecords) {
        for (const record of manualsRecords) {
          if (record.filename && !storageFilenames.has(record.filename)) {
            console.log(`🗑️ Removing orphaned manuals record: ${record.title}`);
            const { error } = await supabase
              .from('manuals')
              .delete()
              .eq('id', record.id);

            if (error) {
              errors.push(`Failed to delete manuals ${record.id}: ${error.message}`);
            } else {
              cleaned++;
            }
          }
        }
      }

      // Check processed_manuals table
      const { data: processedRecords, error: processedError } = await supabase
        .from('processed_manuals')
        .select('id, filename, title');

      if (!processedError && processedRecords) {
        for (const record of processedRecords) {
          if (record.filename && !storageFilenames.has(record.filename)) {
            console.log(`🗑️ Removing orphaned processed_manuals record: ${record.title}`);
            const { error } = await supabase
              .from('processed_manuals')
              .delete()
              .eq('id', record.id);

            if (error) {
              errors.push(`Failed to delete processed_manuals ${record.id}: ${error.message}`);
            } else {
              cleaned++;
            }
          }
        }
      }

      console.log(`✅ Cleanup complete: ${cleaned} records cleaned, ${errors.length} errors`);

      if (cleaned > 0) {
        toast({
          title: 'Database Cleanup Complete',
          description: `Removed ${cleaned} orphaned manual records`,
        });
      }

      return { cleaned, errors };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);
      console.error('Cleanup failed:', error);

      toast({
        title: 'Cleanup Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      return { cleaned, errors };
    }
  }

  /**
   * Search manual chunks
   */
  async searchManualChunks(
    query: string,
    options?: {
      manualId?: string;
      modelCodes?: string[];
      category?: string;
      limit?: number;
    }
  ): Promise<any[]> {
    try {
      // This would typically call an edge function to create embeddings
      // and search using vector similarity
      // For now, we'll do a simple text search
      
      let queryBuilder = supabase
        .from('manual_chunks')
        .select(`
          *,
          manual_metadata!inner(title, model_codes, category)
        `)
        .textSearch('content', query);

      if (options?.manualId) {
        queryBuilder = queryBuilder.eq('manual_id', options.manualId);
      }

      if (options?.category) {
        queryBuilder = queryBuilder.eq('manual_metadata.category', options.category);
      }

      if (options?.limit) {
        queryBuilder = queryBuilder.limit(options.limit);
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  /**
   * Get processing status for a file
   */
  getProcessingStatus(filename: string): ProcessingStatus | null {
    return this.processingQueue.get(filename) || null;
  }

  /**
   * Clear processing status
   */
  clearProcessingStatus(filename: string): void {
    this.processingQueue.delete(filename);
  }
}

// Export singleton instance
export const manualProcessingService = new ManualProcessingService();