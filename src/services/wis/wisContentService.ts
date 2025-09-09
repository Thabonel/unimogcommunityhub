import { supabase } from '@/lib/supabase-client';

// Updated interfaces to match your schema
export interface WISProcedure {
  id: string;
  procedure_code: string;
  title: string;
  category: string;
  description: string;
  content: string;
  steps: Array<{
    step: number;
    description: string;
    timeMinutes?: number;
  }>;
  tools_required: string[];
  safety_warnings: string[];
  media: WISMediaItem[];
}

export interface WISPart {
  id: string;
  part_number: string;
  part_name: string;
  category: string;
  subcategory?: string;
  description: string;
  notes?: string;
  media: WISMediaItem[];
}

export interface WISBulletin {
  id: string;
  bulletin_number: string;
  title: string;
  category: string;
  severity: string;
  description: string;
  content: string;
  issue_date: string;
  status: string;
  media: WISMediaItem[];
}

export interface WISMediaItem {
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart';
  bucket: string;
  file_name: string;
  description: string;
}

export interface WISSearchResult {
  id: string; // doc_id
  doc_type: 'part' | 'proc' | 'bull';
  ref: string; // part_number/procedure_code/bulletin_number
  title: string;
  content: string; // chunk content
  media: WISMediaItem[];
  relevance?: number;
}

export interface WISModel {
  id: string;
  model_code: string;
  model_name: string;
  year_from: number;
  year_to: number | null;
}

class WISContentService {
  /**
   * Search WIS content using the unified wis_search RPC
   */
  async search(query: string, filters?: {
    model?: string;
    system?: string;
  }): Promise<WISSearchResult[]> {
    try {
      console.log(`🔍 Searching WIS with query: "${query}"`);
      
      // Use the wis_search RPC that searches wis_chunks
      const { data: hits, error } = await supabase.rpc('wis_search', {
        q: query || '', // Search term
        limit_rows: 20  // Return up to 20 results
      });
      
      if (error) {
        console.error('❌ WIS search error:', error);
        return [];
      }
      
      if (!hits || hits.length === 0) {
        console.log('📭 No WIS results found');
        return [];
      }
      
      console.log(`✅ Found ${hits.length} WIS results`);
      
      // Transform the results to match the expected interface
      const results: WISSearchResult[] = hits.map((hit: any) => ({
        id: hit.doc_id,
        doc_type: hit.doc_type,
        ref: hit.ref,
        title: hit.title,
        content: hit.content, // Chunk content (~300 tokens)
        media: hit.media || [], // Media array from chunk
        relevance: 1 // wis_search doesn't return relevance scores yet
      }));
      
      return results;
    } catch (error) {
      console.error('💥 WIS search failed:', error);
      return [];
    }
  }

  /**
   * Generate signed URL for WIS media using wis_media_url RPC
   */
  async getMediaUrl(bucket: string, fileName: string, expiresIn: number = 3600): Promise<string | null> {
    try {
      const { data: signedUrl, error } = await supabase.rpc('wis_media_url', {
        bucket,
        file_name: fileName,
        expires_in: expiresIn
      });
      
      if (error) {
        console.error('❌ Error generating media URL:', error);
        return null;
      }
      
      console.log(`🔗 Generated signed URL for ${bucket}/${fileName}`);
      return signedUrl;
    } catch (error) {
      console.error('💥 Failed to generate media URL:', error);
      return null;
    }
  }

  /**
   * Get full procedure details by procedure_code
   */
  async getProcedure(procedureCode: string): Promise<WISProcedure | null> {
    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .select('*')
        .eq('procedure_code', procedureCode)
        .single();
      
      if (error || !data) {
        console.error('❌ Error fetching procedure:', error);
        return null;
      }
      
      return {
        id: data.id,
        procedure_code: data.procedure_code,
        title: data.title,
        category: data.category,
        description: data.description,
        content: data.content,
        steps: data.steps || [],
        tools_required: data.tools_required || [],
        safety_warnings: data.safety_warnings || [],
        media: data.media || []
      };
    } catch (error) {
      console.error('💥 Failed to fetch procedure:', error);
      return null;
    }
  }

  /**
   * Get full part details by part_number
   */
  async getPart(partNumber: string): Promise<WISPart | null> {
    try {
      const { data, error } = await supabase
        .from('wis_parts')
        .select('*')
        .eq('part_number', partNumber)
        .single();
      
      if (error || !data) {
        console.error('❌ Error fetching part:', error);
        return null;
      }
      
      return {
        id: data.id,
        part_number: data.part_number,
        part_name: data.part_name,
        category: data.category,
        subcategory: data.subcategory,
        description: data.description,
        notes: data.notes,
        media: data.media || []
      };
    } catch (error) {
      console.error('💥 Failed to fetch part:', error);
      return null;
    }
  }

  /**
   * Get full bulletin details by bulletin_number
   */
  async getBulletin(bulletinNumber: string): Promise<WISBulletin | null> {
    try {
      const { data, error } = await supabase
        .from('wis_bulletins')
        .select('*')
        .eq('bulletin_number', bulletinNumber)
        .single();
      
      if (error || !data) {
        console.error('❌ Error fetching bulletin:', error);
        return null;
      }
      
      return {
        id: data.id,
        bulletin_number: data.bulletin_number,
        title: data.title,
        category: data.category,
        severity: data.severity,
        description: data.description,
        content: data.content,
        issue_date: data.issue_date,
        status: data.status,
        media: data.media || []
      };
    } catch (error) {
      console.error('💥 Failed to fetch bulletin:', error);
      return null;
    }
  }

  /**
   * Get all chunks for a document (grouped by doc_id)
   */
  async getDocumentChunks(docId: string): Promise<WISSearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('wis_chunks')
        .select('doc_id, doc_type, ref, title, content, media, chunk_index')
        .eq('doc_id', docId)
        .order('chunk_index');
      
      if (error || !data) {
        console.error('❌ Error fetching document chunks:', error);
        return [];
      }
      
      return data.map((chunk: any) => ({
        id: chunk.doc_id,
        doc_type: chunk.doc_type,
        ref: chunk.ref,
        title: chunk.title,
        content: chunk.content,
        media: chunk.media || []
      }));
    } catch (error) {
      console.error('💥 Failed to fetch document chunks:', error);
      return [];
    }
  }

  /**
   * Get available models (placeholder - you can add wis_models table later)
   */
  async getModels(): Promise<WISModel[]> {
    // For now, return the common models for the 435 series
    // You can add a wis_models table later following the same pattern
    return [
      {
        id: '1',
        model_code: 'U1700L',
        model_name: 'Unimog U1700L (435 Series) 🇦🇺',
        year_from: 1970,
        year_to: 1985
      },
      {
        id: '2', 
        model_code: 'U1300L',
        model_name: 'Unimog U1300L (435 Series)',
        year_from: 1970,
        year_to: 1985
      }
    ];
  }

  /**
   * Get systems for a model (placeholder)
   */
  async getSystemsForModel(model: string): Promise<string[]> {
    // Common Unimog systems - can be expanded based on your data
    return [
      'Engine',
      'Transmission',
      'Hydraulics', 
      'Brakes',
      'Electrical',
      'Cooling',
      'Fuel System',
      'Portal Axles',
      'PTO (Power Take-Off)'
    ];
  }

  /**
   * Check if running in demo mode
   */
  async isDemoMode(): Promise<boolean> {
    // Since you have real data now, this should return false
    return false;
  }

  /**
   * Get parts for procedure (legacy method for compatibility)
   */
  async getPartsForProcedure(partsRequired: string[]): Promise<WISPart[]> {
    if (!partsRequired || partsRequired.length === 0) {
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('wis_parts')
        .select('*')
        .in('part_number', partsRequired);
      
      if (error || !data) {
        console.error('❌ Error fetching parts for procedure:', error);
        return [];
      }
      
      return data.map((part: any) => ({
        id: part.id,
        part_number: part.part_number,
        part_name: part.part_name,
        category: part.category,
        subcategory: part.subcategory,
        description: part.description,
        notes: part.notes,
        media: part.media || []
      }));
    } catch (error) {
      console.error('💥 Failed to fetch parts for procedure:', error);
      return [];
    }
  }
}

// Export singleton instance
const wisContentService = new WISContentService();
export { wisContentService };