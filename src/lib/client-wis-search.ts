import itemsjs from 'itemsjs';
import { supabase } from '@/lib/supabase-client';

// Types for WIS data (matching existing structure)
export interface WISMedia {
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart';
  bucket: string;
  file_name: string;
  description: string;
}

export interface WISItem {
  id: string;
  title: string;
  content: string;
  doc_type: 'procedure' | 'part' | 'bulletin';
  category?: string;
  subcategory?: string;
  description?: string;
  part_number?: string;
  bulletin_number?: string;
  procedure_code?: string;
  difficulty_level?: number;
  media: WISMedia[];
  searchable_text: string; // Combined searchable content
}

export interface ClientSearchFilters {
  doc_type?: string[];
  category?: string[];
  difficulty?: string[];
  media_type?: string[];
}

export interface ClientSearchResponse {
  items: WISItem[];
  aggregations: {
    doc_type: { key: string; doc_count: number }[];
    category: { key: string; doc_count: number }[];
    difficulty: { key: string; doc_count: number }[];
    media_type: { key: string; doc_count: number }[];
  };
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
}

class ClientWISSearch {
  private searchEngine: any = null;
  private rawData: WISItem[] = [];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🔍 Initializing client-side WIS search...');
    
    try {
      // Fetch data from all WIS tables
      const [chunksData, proceduresData, partsData, bulletinsData] = await Promise.all([
        this.fetchChunks(),
        this.fetchProcedures(),
        this.fetchParts(),
        this.fetchBulletins()
      ]);

      // Transform and combine all data
      this.rawData = [
        ...chunksData,
        ...proceduresData,
        ...partsData,
        ...bulletinsData
      ];

      console.log(`📊 Loaded ${this.rawData.length} WIS items for search`);

      // Initialize ItemsJS with aggregations (filters)
      this.searchEngine = itemsjs(this.rawData, {
        aggregations: {
          doc_type: {
            title: 'Document Types',
            size: 10,
            conjunction: false // OR logic for document types
          },
          category: {
            title: 'System Categories',
            size: 20,
            conjunction: false // OR logic for categories
          },
          difficulty: {
            title: 'Difficulty Level',
            size: 5,
            conjunction: false // OR logic for difficulty
          },
          media_type: {
            title: 'Media Content',
            size: 10,
            conjunction: false // OR logic for media types
          }
        },
        searchableFields: ['title', 'searchable_text', 'part_number', 'bulletin_number', 'procedure_code'],
        sortings: {
          relevance: {
            field: 'title',
            order: 'asc'
          }
        }
      });

      this.isInitialized = true;
      console.log('✅ Client-side WIS search initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize WIS search:', error);
      throw error;
    }
  }

  private async fetchChunks(): Promise<WISItem[]> {
    const { data, error } = await supabase
      .from('wis_chunks')
      .select('*')
      .limit(1000);

    if (error) throw error;

    return (data || []).map(chunk => ({
      id: chunk.id.toString(),
      title: chunk.title,
      content: chunk.content,
      doc_type: chunk.doc_type as 'procedure' | 'part' | 'bulletin',
      media: chunk.media || [],
      searchable_text: `${chunk.title} ${chunk.content} ${chunk.ref || ''}`.toLowerCase(),
    }));
  }

  private async fetchProcedures(): Promise<WISItem[]> {
    const { data, error } = await supabase
      .from('wis_procedures')
      .select('*')
      .limit(1000);

    if (error) throw error;

    return (data || []).map(proc => ({
      id: proc.id,
      title: proc.title,
      content: proc.content,
      doc_type: 'procedure' as const,
      category: proc.category,
      subcategory: proc.subcategory,
      description: proc.description,
      procedure_code: proc.procedure_code,
      difficulty_level: proc.difficulty_level,
      media: proc.media || [],
      searchable_text: `${proc.title} ${proc.content} ${proc.description || ''} ${proc.procedure_code} ${proc.category || ''} ${proc.subcategory || ''}`.toLowerCase(),
    }));
  }

  private async fetchParts(): Promise<WISItem[]> {
    const { data, error } = await supabase
      .from('wis_parts')
      .select('*')
      .limit(1000);

    if (error) throw error;

    return (data || []).map(part => ({
      id: part.id,
      title: `${part.part_number} - ${part.part_name}`,
      content: part.description,
      doc_type: 'part' as const,
      category: part.category,
      subcategory: part.subcategory,
      description: part.description,
      part_number: part.part_number,
      media: part.media || [],
      searchable_text: `${part.part_name} ${part.part_number} ${part.description} ${part.category || ''} ${part.subcategory || ''}`.toLowerCase(),
    }));
  }

  private async fetchBulletins(): Promise<WISItem[]> {
    const { data, error } = await supabase
      .from('wis_bulletins')
      .select('*')
      .limit(1000);

    if (error) throw error;

    return (data || []).map(bulletin => ({
      id: bulletin.id,
      title: `${bulletin.bulletin_number} - ${bulletin.title}`,
      content: bulletin.content,
      doc_type: 'bulletin' as const,
      category: bulletin.category,
      description: bulletin.description,
      bulletin_number: bulletin.bulletin_number,
      media: bulletin.media || [],
      searchable_text: `${bulletin.title} ${bulletin.content} ${bulletin.description || ''} ${bulletin.bulletin_number} ${bulletin.category || ''}`.toLowerCase(),
    }));
  }

  async search(query: string = '', filters: ClientSearchFilters = {}, page: number = 1, perPage: number = 40): Promise<ClientSearchResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const searchOptions: any = {
      per_page: perPage,
      page: page,
      query: query.trim(),
      filters: {}
    };

    // Apply filters
    if (filters.doc_type?.length) {
      searchOptions.filters.doc_type = filters.doc_type;
    }
    if (filters.category?.length) {
      searchOptions.filters.category = filters.category;
    }
    if (filters.difficulty?.length) {
      searchOptions.filters.difficulty = filters.difficulty;
    }

    console.log('🔍 Client search with options:', searchOptions);

    const result = this.searchEngine.search(searchOptions);

    return {
      items: result.data.items || [],
      aggregations: {
        doc_type: result.data.aggregations?.doc_type?.buckets || [],
        category: result.data.aggregations?.category?.buckets || [],
        difficulty: result.data.aggregations?.difficulty?.buckets || [],
        media_type: result.data.aggregations?.media_type?.buckets || []
      },
      pagination: {
        page: result.pagination.page,
        per_page: result.pagination.per_page,
        total: result.pagination.total
      }
    };
  }

  // Quick search for testing
  async quickSearch(query: string): Promise<WISItem[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const result = await this.search(query, {}, 1, 20);
    return result.items;
  }

  // Get all available filter options
  getFilterOptions() {
    if (!this.isInitialized) return null;
    
    const result = this.searchEngine.search({ per_page: 0 });
    return result.data.aggregations;
  }
}

// Export singleton instance
export const clientWISSearch = new ClientWISSearch();
export default clientWISSearch;