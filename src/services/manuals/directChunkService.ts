import { supabase } from '@/lib/supabase-client';
import { U1700L_U435_MANUAL_CHUNKS } from '@/data/u1700l-u435-manual-chunks';

export class DirectChunkService {
  /**
   * Insert U1700L-U435 manual chunks directly into database
   */
  static async insertU1700LChunks(): Promise<{ success: boolean; message: string; chunksInserted: number }> {
    try {
      console.log('Starting direct chunk insertion for U1700L-U435 manual...');

      // First, create or get manual metadata
      const manualId = await this.ensureManualMetadata();

      // Prepare chunks for insertion
      const chunks = U1700L_U435_MANUAL_CHUNKS.map((chunk, index) => ({
        manual_id: manualId,
        manual_title: 'U1700L U435 Workshop Manual Volume 1',
        chunk_index: index,
        content: chunk.content,
        page_number: chunk.page_number,
        section_title: chunk.section_title,
        content_type: chunk.content_type,
        metadata: {
          ...chunk.metadata,
          filename: 'U1700L-U435-Workshop-Manual-Volume-1.pdf',
          char_count: chunk.content.length,
          word_count: chunk.content.split(/\s+/).length,
          extractionMethod: 'direct_insertion',
          extractionQuality: 1.0
        }
      }));

      // Insert chunks in batches
      const batchSize = 10;
      let insertedCount = 0;

      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);

        const { error, data } = await supabase
          .from('manual_chunks')
          .upsert(batch, {
            onConflict: 'manual_id,chunk_index'
          });

        if (error) {
          console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
          throw error;
        } else {
          insertedCount += batch.length;
          console.log(`Inserted batch ${i / batchSize + 1}, total chunks: ${insertedCount}`);
        }
      }

      // Update manual metadata with completion status
      await supabase
        .from('manual_metadata')
        .update({
          processed_at: new Date().toISOString(),
          approval_status: 'approved'
        })
        .eq('id', manualId);

      return {
        success: true,
        message: `Successfully inserted ${insertedCount} chunks for U1700L-U435 manual`,
        chunksInserted: insertedCount
      };

    } catch (error) {
      console.error('Error inserting chunks:', error);
      return {
        success: false,
        message: `Failed to insert chunks: ${error instanceof Error ? error.message : 'Unknown error'}`,
        chunksInserted: 0
      };
    }
  }

  /**
   * Ensure manual metadata exists, create if necessary
   */
  private static async ensureManualMetadata(): Promise<string> {
    const filename = 'U1700L-U435-Workshop-Manual-Volume-1.pdf';

    // Check if manual metadata already exists
    const { data: existing, error: fetchError } = await supabase
      .from('manual_metadata')
      .select('id')
      .eq('filename', filename)
      .single();

    if (existing && !fetchError) {
      console.log('Using existing manual metadata:', existing.id);
      return existing.id;
    }

    // Create new manual metadata
    const { data: created, error: createError } = await supabase
      .from('manual_metadata')
      .insert({
        filename,
        title: 'U1700L U435 Workshop Manual Volume 1',
        model_codes: ['U1700L', 'U435'],
        year_range: '2000-2024',
        category: 'workshop',
        page_count: 150,
        file_size: 150186524,
        processed_at: new Date().toISOString(),
        approval_status: 'approved'
      })
      .select('id')
      .single();

    if (createError || !created) {
      throw new Error(`Failed to create manual metadata: ${createError?.message}`);
    }

    console.log('Created new manual metadata:', created.id);
    return created.id;
  }

  /**
   * Check if chunks already exist for this manual
   */
  static async checkExistingChunks(): Promise<number> {
    const { data, error } = await supabase
      .from('manual_chunks')
      .select('id')
      .eq('manual_title', 'U1700L U435 Workshop Manual Volume 1');

    if (error) {
      console.error('Error checking existing chunks:', error);
      return 0;
    }

    return data?.length || 0;
  }

  /**
   * Remove existing chunks for this manual (cleanup)
   */
  static async removeExistingChunks(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('manual_chunks')
        .delete()
        .eq('manual_title', 'U1700L U435 Workshop Manual Volume 1');

      if (error) {
        console.error('Error removing existing chunks:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removeExistingChunks:', error);
      return false;
    }
  }
}