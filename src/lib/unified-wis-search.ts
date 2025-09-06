import { supabase } from '@/lib/supabase-client';

// Enhanced interfaces based on actual database schema and enterprise patterns
export interface WISMedia {
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart';
  bucket: string;
  file_name: string;
  description: string;
  signed_url?: string;
}

export interface WISModel {
  id: string;
  model_code: string;
  model_name: string;
  year_from?: number;
  year_to?: number;
  engine_code?: string;
  description?: string;
}

export interface WISProcedure {
  id: string;
  vehicle_id: string;
  procedure_code: string;
  title: string;
  category?: string;
  subcategory?: string;
  description?: string;
  content?: string;
  difficulty_level?: number;
  estimated_time_minutes?: number;
  tools_required?: string[];
  updated_at?: string;
  vehicle?: WISModel;
  media?: WISMedia[];
  related_parts?: WISPart[];
}

export interface WISPart {
  id: string;
  vehicle_id: string;
  part_number: string;
  part_name: string;
  category?: string;
  subcategory?: string;
  description?: string;
  price_estimate?: number;
  availability_status?: string;
  superseded_by?: string;
  notes?: string;
  updated_at?: string;
  vehicle?: WISModel;
  media?: WISMedia[];
  related_procedures?: WISProcedure[];
}

export interface WISBulletin {
  id: string;
  vehicle_id: string;
  bulletin_number: string;
  title: string;
  category?: string;
  severity?: string;
  description?: string;
  content?: string;
  date_issued?: string;
  date_updated?: string;
  status?: string;
  updated_at?: string;
  vehicle?: WISModel;
  media?: WISMedia[];
  affected_parts?: WISPart[];
}

// Unified search result interface (Mitchell1 ProDemand pattern)
export interface UnifiedWISResult {
  doc_id: string;
  doc_type: 'part' | 'procedure' | 'bulletin';
  title: string;
  content_summary: string;
  full_content?: string;
  category?: string;
  subcategory?: string;
  reference_number: string; // part_number, procedure_code, or bulletin_number
  
  // Interconnected data (enterprise pattern)
  related_parts: WISPart[];
  related_procedures: WISProcedure[];
  related_bulletins: WISBulletin[];
  
  // Media integration
  media: WISMedia[];
  
  // Progressive disclosure
  is_expanded?: boolean;
  
  // Search relevance
  search_score?: number;
  match_type?: 'title' | 'content' | 'part_number' | 'category';
}

export interface UnifiedSearchResponse {
  procedures: WISProcedure[];
  parts: WISPart[];
  bulletins: WISBulletin[];
  unified_results: UnifiedWISResult[];
  total_results: number;
  search_suggestions?: string[];
}

// Enterprise-grade unified search service
export class UnifiedWISSearchService {
  
  // Get all vehicle models (for model selector)
  static async getModels(): Promise<WISModel[]> {
    const { data, error } = await supabase
      .from('wis_models')
      .select('*')
      .order('model_name');
    
    if (error) {
      console.error('Error fetching WIS models:', error);
      throw new Error('Failed to load vehicle models');
    }
    
    return data || [];
  }

  // Unified search across all WIS data (Mitchell1 1Search™ Plus pattern)
  static async unifiedSearch(
    query: string, 
    modelId?: string,
    options: {
      limit?: number;
      includeRelated?: boolean;
      enableFuzzy?: boolean;
    } = {}
  ): Promise<UnifiedSearchResponse> {
    const { limit = 50, includeRelated = true, enableFuzzy = true } = options;
    
    try {
      // Apply fuzzy search if enabled (handle spelling mistakes)
      const searchQuery = enableFuzzy ? this.fuzzySearchTransform(query) : query;
      
      // Build WHERE clause for model filtering
      const modelFilter = modelId ? `AND vehicle_id = '${modelId}'` : '';
      
      // Execute unified search across all content types
      const [procedures, parts, bulletins] = await Promise.all([
        this.searchProcedures(searchQuery, modelFilter, limit),
        this.searchParts(searchQuery, modelFilter, limit),
        this.searchBulletins(searchQuery, modelFilter, limit)
      ]);
      
      // Transform to unified results with interconnected data
      const unified_results = await this.transformToUnifiedResults(
        procedures, 
        parts, 
        bulletins, 
        includeRelated
      );
      
      // Generate search suggestions for "did you mean?" functionality
      const search_suggestions = this.generateSearchSuggestions(query, unified_results);
      
      return {
        procedures: procedures.slice(0, limit),
        parts: parts.slice(0, limit),
        bulletins: bulletins.slice(0, limit),
        unified_results: unified_results.slice(0, limit),
        total_results: procedures.length + parts.length + bulletins.length,
        search_suggestions
      };
      
    } catch (error) {
      console.error('Unified WIS search error:', error);
      throw new Error('Search failed - please try again');
    }
  }
  
  // Search procedures with full-text search
  private static async searchProcedures(
    query: string, 
    modelFilter: string, 
    limit: number
  ): Promise<WISProcedure[]> {
    const { data, error } = await supabase.rpc('search_wis_procedures', {
      search_query: query,
      model_filter: modelFilter,
      search_limit: limit
    });
    
    if (error) {
      console.warn('Procedure search fallback:', error);
      // Fallback to basic search if RPC function doesn't exist
      return this.fallbackSearchProcedures(query, modelFilter, limit);
    }
    
    return data || [];
  }
  
  // Fallback search for procedures (basic ILIKE search)
  private static async fallbackSearchProcedures(
    query: string,
    modelFilter: string,
    limit: number
  ): Promise<WISProcedure[]> {
    let baseQuery = supabase
      .from('wis_procedures')
      .select(`
        *,
        vehicle:wis_models(*)
      `);
    
    if (modelFilter) {
      const modelId = modelFilter.replace("AND vehicle_id = '", '').replace("'", '');
      baseQuery = baseQuery.eq('vehicle_id', modelId);
    }
    
    const { data, error } = await baseQuery
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Fallback procedure search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Search parts with part number and description matching
  private static async searchParts(
    query: string,
    modelFilter: string,
    limit: number
  ): Promise<WISPart[]> {
    let baseQuery = supabase
      .from('wis_parts')
      .select(`
        *,
        vehicle:wis_models(*)
      `);
    
    if (modelFilter) {
      const modelId = modelFilter.replace("AND vehicle_id = '", '').replace("'", '');
      baseQuery = baseQuery.eq('vehicle_id', modelId);
    }
    
    const { data, error } = await baseQuery
      .or(`part_number.ilike.%${query}%,part_name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Part search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Search bulletins with title and content matching
  private static async searchBulletins(
    query: string,
    modelFilter: string,
    limit: number
  ): Promise<WISBulletin[]> {
    let baseQuery = supabase
      .from('wis_bulletins')
      .select(`
        *,
        vehicle:wis_models(*)
      `);
    
    if (modelFilter) {
      const modelId = modelFilter.replace("AND vehicle_id = '", '').replace("'", '');
      baseQuery = baseQuery.eq('vehicle_id', modelId);
    }
    
    const { data, error } = await baseQuery
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.error('Bulletin search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Transform search results to unified format with interconnected data
  private static async transformToUnifiedResults(
    procedures: WISProcedure[],
    parts: WISPart[],
    bulletins: WISBulletin[],
    includeRelated: boolean
  ): Promise<UnifiedWISResult[]> {
    const results: UnifiedWISResult[] = [];
    
    // Transform procedures
    for (const proc of procedures) {
      const unified: UnifiedWISResult = {
        doc_id: proc.id,
        doc_type: 'procedure',
        title: proc.title,
        content_summary: proc.description || proc.content?.substring(0, 200) + '...' || '',
        full_content: proc.content,
        category: proc.category,
        subcategory: proc.subcategory,
        reference_number: proc.procedure_code,
        related_parts: includeRelated ? await this.findRelatedParts(proc) : [],
        related_procedures: [],
        related_bulletins: includeRelated ? await this.findRelatedBulletins(proc.vehicle_id) : [],
        media: [], // TODO: Implement media loading
        match_type: 'title'
      };
      results.push(unified);
    }
    
    // Transform parts
    for (const part of parts) {
      const unified: UnifiedWISResult = {
        doc_id: part.id,
        doc_type: 'part',
        title: part.part_name,
        content_summary: part.description || `Part number: ${part.part_number}`,
        full_content: part.notes,
        category: part.category,
        subcategory: part.subcategory,
        reference_number: part.part_number,
        related_parts: [],
        related_procedures: includeRelated ? await this.findRelatedProcedures(part) : [],
        related_bulletins: includeRelated ? await this.findRelatedBulletins(part.vehicle_id) : [],
        media: [], // TODO: Implement media loading
        match_type: 'part_number'
      };
      results.push(unified);
    }
    
    // Transform bulletins
    for (const bulletin of bulletins) {
      const unified: UnifiedWISResult = {
        doc_id: bulletin.id,
        doc_type: 'bulletin',
        title: bulletin.title,
        content_summary: bulletin.description || bulletin.content?.substring(0, 200) + '...' || '',
        full_content: bulletin.content,
        category: bulletin.category,
        reference_number: bulletin.bulletin_number,
        related_parts: includeRelated ? await this.findAffectedParts(bulletin) : [],
        related_procedures: includeRelated ? await this.findRelatedProcedures(bulletin) : [],
        related_bulletins: [],
        media: [], // TODO: Implement media loading
        match_type: 'title'
      };
      results.push(unified);
    }
    
    // Sort by relevance (title matches first, then content matches)
    return results.sort((a, b) => {
      const scoreA = a.match_type === 'title' ? 3 : a.match_type === 'part_number' ? 2 : 1;
      const scoreB = b.match_type === 'title' ? 3 : b.match_type === 'part_number' ? 2 : 1;
      return scoreB - scoreA;
    });
  }
  
  // Find related parts for a procedure (enterprise interconnected pattern)
  private static async findRelatedParts(procedure: WISProcedure): Promise<WISPart[]> {
    if (!procedure.content) return [];
    
    // Extract part numbers from procedure content using regex
    const partNumberMatches = procedure.content.match(/Part #[\w-]+/gi) || [];
    const partNumbers = partNumberMatches.map(match => match.replace('Part #', '').trim());
    
    if (partNumbers.length === 0) return [];
    
    const { data, error } = await supabase
      .from('wis_parts')
      .select('*')
      .in('part_number', partNumbers)
      .limit(5);
    
    if (error) {
      console.warn('Related parts search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Find related procedures for a part
  private static async findRelatedProcedures(part: WISPart | WISBulletin): Promise<WISProcedure[]> {
    const partNumber = 'part_number' in part ? part.part_number : '';
    if (!partNumber) return [];
    
    const { data, error } = await supabase
      .from('wis_procedures')
      .select('*')
      .ilike('content', `%${partNumber}%`)
      .limit(3);
    
    if (error) {
      console.warn('Related procedures search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Find related bulletins for a vehicle
  private static async findRelatedBulletins(vehicleId: string): Promise<WISBulletin[]> {
    const { data, error } = await supabase
      .from('wis_bulletins')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .limit(3);
    
    if (error) {
      console.warn('Related bulletins search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Find parts affected by a bulletin
  private static async findAffectedParts(bulletin: WISBulletin): Promise<WISPart[]> {
    if (!bulletin.content) return [];
    
    // Extract part numbers from bulletin content
    const partNumberMatches = bulletin.content.match(/Part #[\w-]+/gi) || [];
    const partNumbers = partNumberMatches.map(match => match.replace('Part #', '').trim());
    
    if (partNumbers.length === 0) return [];
    
    const { data, error } = await supabase
      .from('wis_parts')
      .select('*')
      .in('part_number', partNumbers)
      .limit(5);
    
    if (error) {
      console.warn('Affected parts search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Fuzzy search transformation (handle common spelling mistakes)
  private static fuzzySearchTransform(query: string): string {
    // Common automotive terminology corrections
    const corrections = new Map([
      ['transmision', 'transmission'],
      ['brakes', 'brake'],
      ['oilchange', 'oil change'],
      ['engin', 'engine'],
      ['diferential', 'differential'],
      ['alternater', 'alternator'],
      ['carburator', 'carburetor'],
      ['exaust', 'exhaust']
    ]);
    
    let corrected = query.toLowerCase();
    corrections.forEach((correct, incorrect) => {
      corrected = corrected.replace(new RegExp(incorrect, 'gi'), correct);
    });
    
    return corrected;
  }
  
  // Generate search suggestions for "did you mean?" functionality
  private static generateSearchSuggestions(query: string, results: UnifiedWISResult[]): string[] {
    if (results.length > 0) return []; // No suggestions needed if we have results
    
    // Common search suggestions based on WIS data
    const commonTerms = [
      'oil change', 'transmission service', 'brake adjustment', 'engine repair',
      'differential service', 'hydraulic system', 'electrical system',
      'cooling system', 'fuel system', 'steering system'
    ];
    
    // Find similar terms using simple string similarity
    return commonTerms
      .filter(term => this.calculateSimilarity(query.toLowerCase(), term) > 0.6)
      .slice(0, 3);
  }
  
  // Simple string similarity calculation
  private static calculateSimilarity(a: string, b: string): number {
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }
  
  // Levenshtein distance calculation for fuzzy matching
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

// Export convenience functions for compatibility
export const getWISModels = () => UnifiedWISSearchService.getModels();
export const unifiedWISSearch = (query: string, modelId?: string, options?: any) => 
  UnifiedWISSearchService.unifiedSearch(query, modelId, options);