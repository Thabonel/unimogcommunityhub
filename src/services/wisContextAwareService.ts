/**
 * WIS Context-Aware Service
 *
 * Makes Barry an intelligent librarian who knows what content exists
 * before searching through thousands of items for each user question.
 *
 * Features:
 * - Context-aware media loading (no more bulk dumps)
 * - Intelligent content relationships
 * - Smart search caching
 * - Category-based filtering
 */

import { supabase } from '../lib/supabase-client';

export interface WISCatalogItem {
  id: string;
  contentType: 'part' | 'procedure' | 'bulletin' | 'chunk';
  contentId: string;
  title: string;
  category: string;
  subcategory?: string;
  description?: string;
  keywords: string[];
  mediaCount: number;
  hasPhotos: boolean;
  hasDiagrams: boolean;
  hasSchematics: boolean;
  relationshipCount: number;
  availableMediaTypes: string[];
}

export interface WISMediaItem {
  id: string;
  contentType: string;
  contentId: string;
  mediaType: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart';
  bucketName: string;
  filePath: string;
  fileName: string;
  thumbnailPath?: string;
  description?: string;
  contextTags: string[];
  categories: string[];
  viewPriority: number;
  publicUrl?: string;
}

export interface WISContentRelationship {
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationshipType: string;
  strength: number;
  notes?: string;
}

export interface ContextAwareQuery {
  query: string;
  category?: string;
  subcategory?: string;
  contentTypes?: string[];
  mediaTypes?: string[];
  hasMedia?: boolean;
  limit?: number;
}

export interface CachedSearchResult {
  items: WISCatalogItem[];
  media: WISMediaItem[];
  relationships: WISContentRelationship[];
  totalCount: number;
  queryType: 'semantic' | 'keyword' | 'category' | 'media';
  cacheHit: boolean;
}

class WISContextAwareService {
  private static instance: WISContextAwareService;
  private searchCache = new Map<string, CachedSearchResult>();

  static getInstance(): WISContextAwareService {
    if (!WISContextAwareService.instance) {
      WISContextAwareService.instance = new WISContextAwareService();
    }
    return WISContextAwareService.instance;
  }

  /**
   * Barry's intelligent catalog search - knows what exists before searching
   */
  async searchCatalog(query: ContextAwareQuery): Promise<CachedSearchResult> {
    const cacheKey = this.generateCacheKey(query);

    // Check cache first (Barry remembers previous searches)
    const cached = await this.getCachedResult(cacheKey);
    if (cached) {
      return { ...cached, cacheHit: true };
    }

    let sqlQuery = `
      SELECT * FROM barry_content_catalog
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    // Apply context filters
    if (query.category) {
      sqlQuery += ` AND category ILIKE $${paramIndex}`;
      params.push(`%${query.category}%`);
      paramIndex++;
    }

    if (query.subcategory) {
      sqlQuery += ` AND subcategory ILIKE $${paramIndex}`;
      params.push(`%${query.subcategory}%`);
      paramIndex++;
    }

    if (query.contentTypes && query.contentTypes.length > 0) {
      sqlQuery += ` AND content_type = ANY($${paramIndex})`;
      params.push(query.contentTypes);
      paramIndex++;
    }

    if (query.hasMedia) {
      sqlQuery += ` AND media_count > 0`;
    }

    // Text search with ranking
    if (query.query) {
      sqlQuery += ` AND (
        title ILIKE $${paramIndex} OR
        description ILIKE $${paramIndex} OR
        $${paramIndex + 1} = ANY(keywords)
      )`;
      params.push(`%${query.query}%`, query.query);
      paramIndex += 2;
    }

    sqlQuery += ` ORDER BY
      CASE WHEN media_count > 0 THEN 1 ELSE 2 END,
      relationship_count DESC,
      title
      LIMIT $${paramIndex}`;
    params.push(query.limit || 50);

    const { data: catalogItems, error } = await supabase.rpc('execute_raw_sql', {
      query: sqlQuery,
      params
    });

    if (error) {
      console.error('Barry catalog search error:', error);
      throw error;
    }

    const items: WISCatalogItem[] = catalogItems || [];

    // Get related media for the found items
    const media = await this.getContextualMedia(items, query.mediaTypes);

    // Get relationships for better context
    const relationships = await this.getContentRelationships(items.slice(0, 10));

    const result: CachedSearchResult = {
      items,
      media,
      relationships,
      totalCount: items.length,
      queryType: this.determineQueryType(query),
      cacheHit: false
    };

    // Cache the result for Barry's memory
    await this.cacheResult(cacheKey, result);

    return result;
  }

  /**
   * Get contextual media - only load what's relevant to the search
   */
  async getContextualMedia(
    catalogItems: WISCatalogItem[],
    mediaTypes?: string[]
  ): Promise<WISMediaItem[]> {
    if (catalogItems.length === 0) return [];

    const contentKeys = catalogItems.map(item => ({
      content_type: item.contentType,
      content_id: item.contentId
    }));

    let query = `
      SELECT
        mi.*,
        -- Generate public URL for media files
        CASE
          WHEN mi.bucket_name IS NOT NULL AND mi.file_path IS NOT NULL
          THEN mi.bucket_name || '/' || mi.file_path
          ELSE NULL
        END as public_url
      FROM wis_media_index mi
      WHERE (mi.content_type, mi.content_id) IN (
        ${contentKeys.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
      )
    `;

    const params: any[] = [];
    contentKeys.forEach(key => {
      params.push(key.content_type, key.content_id);
    });

    if (mediaTypes && mediaTypes.length > 0) {
      query += ` AND mi.media_type = ANY($${params.length + 1})`;
      params.push(mediaTypes);
    }

    query += ` ORDER BY mi.view_priority DESC, mi.created_at DESC`;

    const { data, error } = await supabase.rpc('execute_raw_sql', {
      query,
      params
    });

    if (error) {
      console.error('Contextual media fetch error:', error);
      return [];
    }

    // Get signed URLs for media files
    const mediaItems: WISMediaItem[] = await Promise.all(
      (data || []).map(async (item: any) => {
        let publicUrl = undefined;

        if (item.bucket_name && item.file_path) {
          const { data: urlData } = await supabase.storage
            .from(item.bucket_name)
            .getPublicUrl(item.file_path);

          publicUrl = urlData?.publicUrl;
        }

        return {
          id: item.id,
          contentType: item.content_type,
          contentId: item.content_id,
          mediaType: item.media_type,
          bucketName: item.bucket_name,
          filePath: item.file_path,
          fileName: item.file_name,
          thumbnailPath: item.thumbnail_path,
          description: item.description,
          contextTags: item.context_tags || [],
          categories: item.categories || [],
          viewPriority: item.view_priority || 0,
          publicUrl
        };
      })
    );

    return mediaItems;
  }

  /**
   * Get content relationships for intelligent recommendations
   */
  async getContentRelationships(
    catalogItems: WISCatalogItem[]
  ): Promise<WISContentRelationship[]> {
    if (catalogItems.length === 0) return [];

    const contentKeys = catalogItems.map(item => ({
      content_type: item.contentType,
      content_id: item.contentId
    }));

    const query = `
      SELECT *
      FROM wis_content_relationships
      WHERE (source_type, source_id) IN (
        ${contentKeys.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
      )
      OR (target_type, target_id) IN (
        ${contentKeys.map((_, i) => `($${i * 2 + 1 + contentKeys.length * 2}, $${i * 2 + 2 + contentKeys.length * 2})`).join(', ')}
      )
      ORDER BY strength DESC
      LIMIT 100
    `;

    const params: any[] = [];
    contentKeys.forEach(key => {
      params.push(key.content_type, key.content_id);
    });
    contentKeys.forEach(key => {
      params.push(key.content_type, key.content_id);
    });

    const { data, error } = await supabase.rpc('execute_raw_sql', {
      query,
      params
    });

    if (error) {
      console.error('Content relationships fetch error:', error);
      return [];
    }

    return (data || []).map((rel: any) => ({
      sourceType: rel.source_type,
      sourceId: rel.source_id,
      targetType: rel.target_type,
      targetId: rel.target_id,
      relationshipType: rel.relationship_type,
      strength: rel.strength || 0,
      notes: rel.notes
    }));
  }

  /**
   * Barry's category browser - organized access to content
   */
  async getCategoryBrowser(): Promise<{
    categories: Array<{
      name: string;
      count: number;
      subcategories: Array<{
        name: string;
        count: number;
        hasMedia: boolean;
      }>;
    }>;
  }> {
    const { data, error } = await supabase.rpc('execute_raw_sql', {
      query: `
        SELECT
          category,
          subcategory,
          COUNT(*) as count,
          SUM(media_count) > 0 as has_media
        FROM wis_master_index
        GROUP BY category, subcategory
        ORDER BY category, subcategory
      `,
      params: []
    });

    if (error) {
      console.error('Category browser error:', error);
      throw error;
    }

    const categoryMap = new Map<string, {
      name: string;
      count: number;
      subcategories: Array<{
        name: string;
        count: number;
        hasMedia: boolean;
      }>;
    }>();

    (data || []).forEach((row: any) => {
      const categoryName = row.category || 'Uncategorized';

      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          count: 0,
          subcategories: []
        });
      }

      const category = categoryMap.get(categoryName)!;
      category.count += row.count;

      if (row.subcategory) {
        category.subcategories.push({
          name: row.subcategory,
          count: row.count,
          hasMedia: row.has_media || false
        });
      }
    });

    return {
      categories: Array.from(categoryMap.values())
    };
  }

  /**
   * Cache management for Barry's memory
   */
  private async getCachedResult(cacheKey: string): Promise<CachedSearchResult | null> {
    const { data, error } = await supabase
      .from('wis_search_cache')
      .select('*')
      .eq('query_hash', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) return null;

    // Update cache hit count
    await supabase
      .from('wis_search_cache')
      .update({
        cache_hit_count: data.cache_hit_count + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', data.id);

    return data.results as CachedSearchResult;
  }

  private async cacheResult(cacheKey: string, result: CachedSearchResult): Promise<void> {
    await supabase
      .from('wis_search_cache')
      .upsert({
        query_hash: cacheKey,
        query_text: JSON.stringify(result),
        query_type: result.queryType,
        results: result,
        result_count: result.totalCount,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      });
  }

  private generateCacheKey(query: ContextAwareQuery): string {
    const keyString = JSON.stringify({
      ...query,
      // Normalize limit for better caching
      limit: Math.min(query.limit || 50, 100)
    });

    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      const char = keyString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private determineQueryType(query: ContextAwareQuery): 'semantic' | 'keyword' | 'category' | 'media' {
    if (query.mediaTypes && query.mediaTypes.length > 0) return 'media';
    if (query.category || query.subcategory) return 'category';
    if (query.query && query.query.includes(' ')) return 'semantic';
    return 'keyword';
  }

  /**
   * Barry's smart recommendations based on user context
   */
  async getSmartRecommendations(
    currentItem: { contentType: string; contentId: string },
    limit: number = 5
  ): Promise<WISCatalogItem[]> {
    const { data, error } = await supabase.rpc('execute_raw_sql', {
      query: `
        WITH related_items AS (
          -- Direct relationships
          SELECT target_type as content_type, target_id as content_id, strength * 2 as score
          FROM wis_content_relationships
          WHERE source_type = $1 AND source_id = $2

          UNION ALL

          SELECT source_type as content_type, source_id as content_id, strength * 2 as score
          FROM wis_content_relationships
          WHERE target_type = $1 AND target_id = $2

          UNION ALL

          -- Same category items
          SELECT mi.content_type, mi.content_id, 0.5 as score
          FROM wis_master_index mi
          JOIN wis_master_index current ON mi.category = current.category
          WHERE current.content_type = $1 AND current.content_id = $2
            AND mi.content_type != $1 OR mi.content_id != $2
        )
        SELECT DISTINCT
          bcc.*,
          ri.score
        FROM related_items ri
        JOIN barry_content_catalog bcc ON bcc.content_type = ri.content_type
          AND bcc.content_id = ri.content_id
        ORDER BY ri.score DESC, bcc.media_count DESC
        LIMIT $3
      `,
      params: [currentItem.contentType, currentItem.contentId, limit]
    });

    if (error) {
      console.error('Smart recommendations error:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      contentType: item.content_type,
      contentId: item.content_id,
      title: item.title,
      category: item.category,
      subcategory: item.subcategory,
      description: item.description,
      keywords: item.keywords || [],
      mediaCount: item.media_count || 0,
      hasPhotos: item.has_photos || false,
      hasDiagrams: item.has_diagrams || false,
      hasSchematics: item.has_schematics || false,
      relationshipCount: item.relationship_count || 0,
      availableMediaTypes: item.available_media_types || []
    }));
  }
}

export default WISContextAwareService;