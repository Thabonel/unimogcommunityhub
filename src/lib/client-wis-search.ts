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

      // Initialize ItemsJS with enhanced search configuration
      this.searchEngine = itemsjs(this.rawData, {
        aggregations: {
          doc_type: {
            title: 'Document Types',
            size: 10,
            conjunction: false
          },
          category: {
            title: 'System Categories',
            size: 20,
            conjunction: false
          },
          difficulty: {
            title: 'Difficulty Level',
            size: 5,
            conjunction: false
          },
          media_type: {
            title: 'Media Content',
            size: 10,
            conjunction: false
          }
        },
        searchableFields: {
          title: {
            weight: 10 // Title matches are 10x more important
          },
          searchable_text: {
            weight: 1 // Content matches have normal weight
          },
          procedure_code: {
            weight: 8 // Procedure codes are highly relevant
          },
          part_number: {
            weight: 8
          },
          bulletin_number: {
            weight: 8
          }
        },
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

  // Preprocess search terms for better matches
  private preprocessQuery(query: string): string {
    const synonyms = {
      'radiator': 'cooling system radiator',
      'replace radiator': 'replace cooling system radiator',
      'install radiator': 'replace cooling system radiator',
      'remove radiator': 'replace cooling system radiator',
      'thermostat': 'cooling system thermostat',
      'water pump': 'cooling system water pump',
      'coolant': 'cooling system coolant'
    };

    let processedQuery = query.toLowerCase().trim();
    
    // Apply synonyms
    for (const [term, replacement] of Object.entries(synonyms)) {
      if (processedQuery.includes(term)) {
        processedQuery = processedQuery.replace(new RegExp(term, 'g'), replacement);
      }
    }

    return processedQuery;
  }

  // Enhanced search with better relevance scoring
  async search(query: string = '', filters: ClientSearchFilters = {}, page: number = 1, perPage: number = 40): Promise<ClientSearchResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Preprocess the query for better matching
    const processedQuery = this.preprocessQuery(query);

    const searchOptions: any = {
      per_page: perPage,
      page: page,
      query: processedQuery,
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

    console.log('🔍 Client search with processed query:', { original: query, processed: processedQuery });

    const result = this.searchEngine.search(searchOptions);

    // Post-process results to boost procedures over chunks
    const rankedItems = this.rankSearchResults(result.data.items || [], query);

    return {
      items: rankedItems,
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

  // Custom ranking to prioritize procedures and exact matches
  private rankSearchResults(items: WISItem[], originalQuery: string): WISItem[] {
    const query = originalQuery.toLowerCase().trim();
    
    return items.map(item => {
      let score = 0;
      const title = item.title.toLowerCase();
      const content = (item.content || '').toLowerCase();
      
      // Exact title match gets highest score
      if (title === query) score += 1000;
      else if (title.includes(query)) score += 500;
      
      // Procedure type boost
      if (item.doc_type === 'procedure') score += 200;
      
      // Action words in query boost repair/replace procedures
      if (query.includes('replace') || query.includes('install') || query.includes('remove')) {
        if (title.includes('replace') || title.includes('install') || title.includes('remove')) {
          score += 300;
        }
        // Penalize service/maintenance for replacement queries
        if (title.includes('service') || title.includes('maintenance') || title.includes('filter')) {
          score -= 100;
        }
      }
      
      // Boost radiator/cooling system matches
      if (query.includes('radiator') && title.includes('radiator')) score += 100;
      if (query.includes('cooling') && title.includes('cooling')) score += 100;
      
      return { ...item, customScore: score };
    })
    .sort((a, b) => (b as any).customScore - (a as any).customScore)
    .map(item => {
      const { customScore, ...cleanItem } = item as any;
      return cleanItem;
    });
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