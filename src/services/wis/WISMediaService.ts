import { supabase } from '@/lib/supabase-client';

export interface WISMediaItem {
  id: string;
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart' | 'video';
  bucket: string;
  file_name: string;
  description?: string;
  signed_url?: string;
  procedure_id?: string;
  part_id?: string;
  bulletin_id?: string;
  metadata?: {
    width?: number;
    height?: number;
    fileSize?: number;
    format?: string;
    thumbnail?: string;
  };
}

export interface MediaSearchOptions {
  contentType?: 'procedures' | 'parts' | 'bulletins';
  mediaType?: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart' | 'video';
  vehicleModel?: string;
  searchQuery?: string;
}

export class WISMediaService {
  /**
   * Retrieve media associated with WIS items
   */
  async getMediaForWISItems(itemIds: string[], itemType: 'procedures' | 'parts' | 'bulletins'): Promise<WISMediaItem[]> {
    try {
      // Query media based on item type
      let query;
      switch (itemType) {
        case 'procedures':
          query = supabase
            .from('wis_procedures')
            .select('id, media')
            .in('id', itemIds);
          break;
        case 'parts':
          query = supabase
            .from('wis_parts')
            .select('id, media')
            .in('id', itemIds);
          break;
        case 'bulletins':
          query = supabase
            .from('wis_bulletins')
            .select('id, media')
            .in('id', itemIds);
          break;
        default:
          return [];
      }

      const { data, error } = await query;
      if (error) throw error;

      // Extract and process media items
      const mediaItems: WISMediaItem[] = [];

      for (const item of data || []) {
        if (item.media && Array.isArray(item.media)) {
          for (const media of item.media) {
            const mediaItem: WISMediaItem = {
              id: `${item.id}_${media.file_name}`,
              type: media.type,
              bucket: media.bucket,
              file_name: media.file_name,
              description: media.description,
              [`${itemType.slice(0, -1)}_id`]: item.id,
              metadata: media.metadata
            };

            // Get signed URL for media access
            const signedUrl = await this.getSignedMediaUrl(media.bucket, media.file_name);
            if (signedUrl) {
              mediaItem.signed_url = signedUrl;
              mediaItems.push(mediaItem);
            }
          }
        }
      }

      return mediaItems;
    } catch (error) {
      console.error('Error retrieving WIS media:', error);
      return [];
    }
  }

  /**
   * Search for media across WIS content
   */
  async searchMedia(options: MediaSearchOptions): Promise<WISMediaItem[]> {
    try {
      // Search across all relevant tables for media content
      const mediaResults: WISMediaItem[] = [];

      // Search procedures if not filtered to specific type
      if (!options.contentType || options.contentType === 'procedures') {
        const procedureMedia = await this.searchProcedureMedia(options);
        mediaResults.push(...procedureMedia);
      }

      // Search parts if not filtered
      if (!options.contentType || options.contentType === 'parts') {
        const partMedia = await this.searchPartMedia(options);
        mediaResults.push(...partMedia);
      }

      // Search bulletins if not filtered
      if (!options.contentType || options.contentType === 'bulletins') {
        const bulletinMedia = await this.searchBulletinMedia(options);
        mediaResults.push(...bulletinMedia);
      }

      // Filter by media type if specified
      let filteredResults = mediaResults;
      if (options.mediaType) {
        filteredResults = mediaResults.filter(item => item.type === options.mediaType);
      }

      // Sort by relevance (schematics and diagrams first)
      filteredResults.sort((a, b) => {
        const priority = { schematic: 1, diagram: 2, photo: 3, chart: 4, table: 5, video: 6 };
        return (priority[a.type] || 7) - (priority[b.type] || 7);
      });

      return filteredResults;
    } catch (error) {
      console.error('Error searching WIS media:', error);
      return [];
    }
  }

  /**
   * Get media specifically for schematics and technical drawings
   */
  async getSchematicsAndDrawings(vehicleModel?: string, systemType?: string): Promise<WISMediaItem[]> {
    const searchOptions: MediaSearchOptions = {
      mediaType: 'schematic',
      vehicleModel,
      searchQuery: systemType
    };

    // Get schematics first
    const schematics = await this.searchMedia(searchOptions);

    // Also get diagrams which often include technical drawings
    const diagrams = await this.searchMedia({
      ...searchOptions,
      mediaType: 'diagram'
    });

    return [...schematics, ...diagrams];
  }

  /**
   * Search procedure media
   */
  private async searchProcedureMedia(options: MediaSearchOptions): Promise<WISMediaItem[]> {
    let query = supabase.from('wis_procedures').select('id, title, procedure_code, media');

    if (options.searchQuery) {
      query = query.or(`title.ilike.%${options.searchQuery}%, description.ilike.%${options.searchQuery}%`);
    }

    const { data, error } = await query.limit(20);
    if (error) return [];

    return this.extractMediaFromItems(data || [], 'procedures');
  }

  /**
   * Search part media
   */
  private async searchPartMedia(options: MediaSearchOptions): Promise<WISMediaItem[]> {
    let query = supabase.from('wis_parts').select('id, part_name, part_number, media');

    if (options.searchQuery) {
      query = query.or(`part_name.ilike.%${options.searchQuery}%, description.ilike.%${options.searchQuery}%`);
    }

    const { data, error } = await query.limit(20);
    if (error) return [];

    return this.extractMediaFromItems(data || [], 'parts');
  }

  /**
   * Search bulletin media
   */
  private async searchBulletinMedia(options: MediaSearchOptions): Promise<WISMediaItem[]> {
    let query = supabase.from('wis_bulletins').select('id, title, bulletin_number, media');

    if (options.searchQuery) {
      query = query.or(`title.ilike.%${options.searchQuery}%, description.ilike.%${options.searchQuery}%`);
    }

    const { data, error } = await query.limit(20);
    if (error) return [];

    return this.extractMediaFromItems(data || [], 'bulletins');
  }

  /**
   * Extract media items from database results
   */
  private async extractMediaFromItems(items: any[], type: 'procedures' | 'parts' | 'bulletins'): Promise<WISMediaItem[]> {
    const mediaItems: WISMediaItem[] = [];

    for (const item of items) {
      if (item.media && Array.isArray(item.media)) {
        for (const media of item.media) {
          const signedUrl = await this.getSignedMediaUrl(media.bucket, media.file_name);
          if (signedUrl) {
            mediaItems.push({
              id: `${item.id}_${media.file_name}`,
              type: media.type,
              bucket: media.bucket,
              file_name: media.file_name,
              description: media.description,
              signed_url: signedUrl,
              [`${type.slice(0, -1)}_id`]: item.id,
              metadata: media.metadata
            });
          }
        }
      }
    }

    return mediaItems;
  }

  /**
   * Get signed URL for media file
   */
  private async getSignedMediaUrl(bucket: string, fileName: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(fileName, 3600); // 1 hour expiry

      if (error) {
        console.warn(`Failed to get signed URL for ${bucket}/${fileName}:`, error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
  }

  /**
   * Get thumbnail URL for media item
   */
  async getThumbnailUrl(mediaItem: WISMediaItem): Promise<string | null> {
    if (mediaItem.metadata?.thumbnail) {
      return this.getSignedMediaUrl(mediaItem.bucket, mediaItem.metadata.thumbnail);
    }

    // For images, create a thumbnail URL pattern
    if (mediaItem.type === 'photo' || mediaItem.type === 'diagram' || mediaItem.type === 'schematic') {
      const thumbnailName = mediaItem.file_name.replace(/\.([^.]+)$/, '_thumb.$1');
      return this.getSignedMediaUrl(mediaItem.bucket, thumbnailName);
    }

    return null;
  }

  /**
   * Check if media item is available
   */
  async isMediaAvailable(bucket: string, fileName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', {
          search: fileName
        });

      return !error && data && data.length > 0;
    } catch (error) {
      return false;
    }
  }
}