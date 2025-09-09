import { supabase } from '@/lib/supabase-client';

// ACTUAL database schema interfaces
export interface WISMedia {
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart';
  bucket: string;
  file_name: string;
  description: string;
  signed_url?: string;
}

// Using the actual wis_chunks structure for search results
export interface WISChunk {
  doc_id: string;
  doc_type: 'part' | 'procedure' | 'bulletin';
  ref: string;
  title: string;
  chunk_index?: number;
  content: string;
  media: WISMedia[];
  updated_at?: string;
}

// Actual database table structures (no vehicle_id - that was wrong!)
export interface WISProcedure {
  id: string;
  procedure_code: string;
  title: string;
  category?: string;
  subcategory?: string;
  description?: string;
  content?: string;
  steps?: any; // jsonb
  tools_required?: string[];
  safety_warnings?: string[];
  media?: WISMedia[]; // jsonb
  updated_at?: string;
}

export interface WISPart {
  id: string;
  part_number: string;
  part_name: string;
  category?: string;
  subcategory?: string;
  description?: string;
  notes?: string;
  media?: WISMedia[]; // jsonb
  updated_at?: string;
}

export interface WISBulletin {
  id: string;
  bulletin_number: string;
  title: string;
  category?: string;
  severity?: string;
  description?: string;
  content?: string;
  issue_date?: string;
  status?: string;
  media?: WISMedia[]; // jsonb
  updated_at?: string;
}

// Unified search result interface (using actual wis_chunks)
export interface UnifiedWISResult {
  doc_id: string;
  doc_type: 'part' | 'procedure' | 'bulletin';
  ref: string;
  title: string;
  content_summary: string;
  full_content?: string;
  category?: string;
  subcategory?: string;
  
  // Interconnected data (populated from related lookups)
  related_parts: WISPart[];
  related_procedures: WISProcedure[];
  related_bulletins: WISBulletin[];
  
  // Media integration using actual schema
  media: WISMedia[];
  
  // Progressive disclosure
  is_expanded?: boolean;
  
  // Search relevance (from chunk index)
  chunk_index?: number;
  match_type?: 'title' | 'content' | 'ref' | 'category';
}

export interface UnifiedSearchResponse {
  procedures: WISProcedure[];
  parts: WISPart[];
  bulletins: WISBulletin[];
  chunks: WISChunk[]; // Raw chunks from wis_search
  unified_results: UnifiedWISResult[];
  total_results: number;
  search_suggestions?: string[];
}

// Enterprise-grade unified search service using ACTUAL database
export class UnifiedWISSearchService {
  
  // No models table - WIS is not vehicle-specific in the actual schema
  static async getModels(): Promise<any[]> {
    // Return dummy models for now - actual WIS doesn't have vehicle filtering
    return [
      {
        id: 'all',
        model_code: 'ALL',
        model_name: 'All Unimog Models',
        description: 'Search across all available documentation'
      }
    ];
  }

  // Unified search using the ACTUAL wis_search RPC function
  static async unifiedSearch(
    query: string, 
    modelId?: string, // Ignored since actual WIS doesn't have models
    options: {
      limit?: number;
      includeRelated?: boolean;
      enableFuzzy?: boolean;
    } = {}
  ): Promise<UnifiedSearchResponse> {
    const { limit = 40, includeRelated = true, enableFuzzy = true } = options;
    
    try {
      // Apply fuzzy search if enabled (handle spelling mistakes)
      const searchQuery = enableFuzzy ? this.fuzzySearchTransform(query) : query;
      
      // Use the ACTUAL wis_search RPC function
      const { data: chunks, error: searchError } = await supabase.rpc('wis_search', {
        q: searchQuery,
        limit_rows: limit
      });
      
      if (searchError) {
        console.error('WIS search error:', searchError);
        throw new Error('Failed to search WIS database');
      }
      
      const searchChunks: WISChunk[] = chunks || [];
      
      // Get individual document types for tabbed results
      const [procedures, parts, bulletins] = await Promise.all([
        this.getProceduresBySearch(searchQuery, limit),
        this.getPartsBySearch(searchQuery, limit),
        this.getBulletinsBySearch(searchQuery, limit)
      ]);
      
      // Transform chunks to unified results with interconnected data
      const unified_results = await this.transformChunksToUnifiedResults(
        searchChunks, 
        includeRelated
      );
      
      // Generate search suggestions for "did you mean?" functionality
      const search_suggestions = searchChunks.length === 0 
        ? this.generateSearchSuggestions(query, [])
        : [];
      
      return {
        procedures,
        parts,
        bulletins,
        chunks: searchChunks,
        unified_results,
        total_results: searchChunks.length,
        search_suggestions
      };
      
    } catch (error) {
      console.error('Unified WIS search error:', error);
      throw new Error('Search failed - please try again');
    }
  }
  
  // Get procedures directly from table with search
  private static async getProceduresBySearch(query: string, limit: number): Promise<WISProcedure[]> {
    const { data, error } = await supabase
      .from('wis_procedures')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.warn('Procedure search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Get parts directly from table with search
  private static async getPartsBySearch(query: string, limit: number): Promise<WISPart[]> {
    const { data, error } = await supabase
      .from('wis_parts')
      .select('*')
      .or(`part_number.ilike.%${query}%,part_name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.warn('Part search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Get bulletins directly from table with search
  private static async getBulletinsBySearch(query: string, limit: number): Promise<WISBulletin[]> {
    const { data, error } = await supabase
      .from('wis_bulletins')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%,bulletin_number.ilike.%${query}%`)
      .limit(limit);
    
    if (error) {
      console.warn('Bulletin search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Transform search chunks to unified results with interconnected data
  private static async transformChunksToUnifiedResults(
    chunks: WISChunk[],
    includeRelated: boolean
  ): Promise<UnifiedWISResult[]> {
    const results: UnifiedWISResult[] = [];
    
    // Group chunks by document to avoid duplicates
    const docGroups = this.groupChunksByDocument(chunks);
    
    for (const [docId, docChunks] of docGroups.entries()) {
      const firstChunk = docChunks[0];
      
      // Resolve media URLs for all chunks
      const mediaWithUrls = await this.resolveMediaUrls(
        firstChunk.media || []
      );
      
      const unified: UnifiedWISResult = {
        doc_id: docId,
        doc_type: firstChunk.doc_type,
        ref: firstChunk.ref,
        title: firstChunk.title,
        content_summary: firstChunk.content.substring(0, 200) + (firstChunk.content.length > 200 ? '...' : ''),
        full_content: docChunks.map(chunk => chunk.content).join('\n\n'),
        chunk_index: firstChunk.chunk_index,
        related_parts: includeRelated ? await this.findRelatedParts(firstChunk) : [],
        related_procedures: includeRelated ? await this.findRelatedProcedures(firstChunk) : [],
        related_bulletins: includeRelated ? await this.findRelatedBulletins(firstChunk) : [],
        media: mediaWithUrls,
        match_type: this.determineMatchType(firstChunk)
      };
      
      results.push(unified);
    }
    
    // Sort by relevance (title matches first, then content matches)
    return results.sort((a, b) => {
      const scoreA = a.match_type === 'title' ? 3 : a.match_type === 'ref' ? 2 : 1;
      const scoreB = b.match_type === 'title' ? 3 : b.match_type === 'ref' ? 2 : 1;
      return scoreB - scoreA;
    });
  }
  
  // Group chunks by document ID to avoid duplicates
  private static groupChunksByDocument(chunks: WISChunk[]): Map<string, WISChunk[]> {
    const groups = new Map<string, WISChunk[]>();
    
    chunks.forEach(chunk => {
      if (!groups.has(chunk.doc_id)) {
        groups.set(chunk.doc_id, []);
      }
      groups.get(chunk.doc_id)!.push(chunk);
    });
    
    return groups;
  }
  
  // Resolve media URLs using the wis_media_url RPC function
  private static async resolveMediaUrls(media: WISMedia[]): Promise<WISMedia[]> {
    const resolvedMedia: WISMedia[] = [];
    
    for (const mediaItem of media) {
      try {
        // The wis_media_url function signature: wis_media_url(bucket, file_name, expires_in)
        const { data: signedUrl, error } = await supabase.rpc('wis_media_url', {
          bucket: mediaItem.bucket,
          file_name: mediaItem.file_name,
          expires_in: 3600 // 1 hour
        });
        
        if (error) {
          console.warn(`Failed to get signed URL for ${mediaItem.file_name}:`, error);
          resolvedMedia.push(mediaItem); // Add without signed_url
        } else {
          resolvedMedia.push({
            ...mediaItem,
            signed_url: signedUrl
          });
        }
      } catch (error) {
        console.warn(`Exception resolving media URL for ${mediaItem.file_name}:`, error);
        resolvedMedia.push(mediaItem); // Add without signed_url
      }
    }
    
    return resolvedMedia;
  }
  
  // Find related parts based on content
  private static async findRelatedParts(chunk: WISChunk): Promise<WISPart[]> {
    // Extract part numbers from content using regex
    const partNumberMatches = chunk.content.match(/[A-Z0-9]{3,}-[A-Z0-9]{3,}-[A-Z0-9]{2,}/g) || [];
    
    if (partNumberMatches.length === 0) return [];
    
    const { data, error } = await supabase
      .from('wis_parts')
      .select('*')
      .in('part_number', partNumberMatches.slice(0, 5))
      .limit(5);
    
    if (error) {
      console.warn('Related parts search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Find related procedures based on content similarity
  private static async findRelatedProcedures(chunk: WISChunk): Promise<WISProcedure[]> {
    if (chunk.doc_type === 'procedure') return []; // Don't relate to itself
    
    // Extract keywords from content for matching
    const keywords = this.extractKeywords(chunk.content);
    if (keywords.length === 0) return [];
    
    const { data, error } = await supabase
      .from('wis_procedures')
      .select('*')
      .or(keywords.map(keyword => `content.ilike.%${keyword}%`).join(','))
      .limit(3);
    
    if (error) {
      console.warn('Related procedures search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Find related bulletins based on content or category
  private static async findRelatedBulletins(chunk: WISChunk): Promise<WISBulletin[]> {
    if (chunk.doc_type === 'bulletin') return []; // Don't relate to itself
    
    const keywords = this.extractKeywords(chunk.content);
    if (keywords.length === 0) return [];
    
    const { data, error } = await supabase
      .from('wis_bulletins')
      .select('*')
      .or(keywords.map(keyword => `content.ilike.%${keyword}%`).join(','))
      .limit(3);
    
    if (error) {
      console.warn('Related bulletins search error:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Extract meaningful keywords from content
  private static extractKeywords(content: string): string[] {
    // Extract automotive-specific terms
    const automotiveTerms = content.match(
      /\b(engine|transmission|brake|oil|filter|differential|hydraulic|electrical|cooling|fuel|steering|suspension)\b/gi
    ) || [];
    
    return [...new Set(automotiveTerms.map(term => term.toLowerCase()))].slice(0, 3);
  }
  
  // Determine match type for relevance scoring
  private static determineMatchType(chunk: WISChunk): 'title' | 'content' | 'ref' | 'category' {
    // This would normally be based on which field matched in search
    // For now, prioritize based on chunk index (lower = more relevant)
    if ((chunk.chunk_index || 0) === 0) return 'title';
    return 'content';
  }
  
  // Fuzzy search transformation (handle common spelling mistakes)
  private static fuzzySearchTransform(query: string): string {
    const corrections = new Map([
      ['transmision', 'transmission'],
      ['brakes', 'brake'],
      ['oilchange', 'oil change'],
      ['engin', 'engine'],
      ['diferential', 'differential'],
      ['alternater', 'alternator'],
      ['carburator', 'carburetor'],
      ['exaust', 'exhaust'],
      ['hidraulic', 'hydraulic'],
      ['stearing', 'steering']
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
      'cooling system', 'fuel system', 'steering system', 'filter replacement'
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
  
  // Get full document by fetching all chunks for a doc_id
  static async getFullDocument(docId: string): Promise<WISChunk[]> {
    const { data, error } = await supabase
      .from('wis_chunks')
      .select('*')
      .eq('doc_id', docId)
      .order('chunk_index');
    
    if (error) {
      console.error('Error fetching full document:', error);
      throw new Error('Failed to load full document');
    }
    
    return data || [];
  }
  
  // Get individual document by ID and type - ENHANCED to fetch complete details
  static async getDocument(docId: string, docType: 'part' | 'procedure' | 'bulletin'): Promise<WISProcedure | WISPart | WISBulletin | null> {
    const tableName = `wis_${docType}s`;
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', docId)
      .single();
    
    if (error) {
      console.error(`Error fetching ${docType}:`, error);
      return null;
    }
    
    // Resolve media URLs if present
    if (data && data.media) {
      data.media = await this.resolveMediaUrls(data.media);
    }
    
    return data;
  }

  // NEW: Get full document details by combining chunks and table data
  static async getFullDocumentDetails(docId: string, docType: 'part' | 'procedure' | 'bulletin'): Promise<any> {
    try {
      // Get complete document from the actual table
      const fullDocument = await this.getDocument(docId, docType);
      
      if (!fullDocument) {
        console.warn(`Document ${docId} not found in ${docType} table`);
        return null;
      }

      // Also get all chunks for this document to get any additional content
      const chunks = await this.getFullDocument(docId);
      
      // Combine table data with chunk content for complete information
      const enhancedDocument = {
        ...fullDocument,
        // If table content is minimal, supplement with chunk content
        content: fullDocument.content || chunks.map(chunk => chunk.content).join('\n\n'),
        // Add chunk-specific data
        chunks: chunks,
        chunk_count: chunks.length
      };

      return enhancedDocument;
    } catch (error) {
      console.error('Error getting full document details:', error);
      return null;
    }
  }

  // NEW: Get document by reference number (for cross-references)
  static async getDocumentByRef(ref: string, docType: 'part' | 'procedure' | 'bulletin'): Promise<any> {
    const tableName = `wis_${docType}s`;
    let refColumn = '';
    
    switch (docType) {
      case 'part': refColumn = 'part_number'; break;
      case 'procedure': refColumn = 'procedure_code'; break;
      case 'bulletin': refColumn = 'bulletin_number'; break;
    }

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(refColumn, ref)
      .single();
    
    if (error) {
      console.warn(`Document with ref ${ref} not found:`, error);
      return null;
    }
    
    // Resolve media URLs if present
    if (data && data.media) {
      data.media = await this.resolveMediaUrls(data.media);
    }
    
    return data;
  }
}

// Export convenience functions for compatibility
export const getWISModels = () => UnifiedWISSearchService.getModels();
export const unifiedWISSearch = (query: string, modelId?: string, options?: any) => 
  UnifiedWISSearchService.unifiedSearch(query, modelId, options);
export const getFullWISDocument = (docId: string) => UnifiedWISSearchService.getFullDocument(docId);
export const getWISDocument = (docId: string, docType: 'part' | 'procedure' | 'bulletin') => 
  UnifiedWISSearchService.getDocument(docId, docType);
export const getFullWISDocumentDetails = (docId: string, docType: 'part' | 'procedure' | 'bulletin') => 
  UnifiedWISSearchService.getFullDocumentDetails(docId, docType);
export const getWISDocumentByRef = (ref: string, docType: 'part' | 'procedure' | 'bulletin') => 
  UnifiedWISSearchService.getDocumentByRef(ref, docType);