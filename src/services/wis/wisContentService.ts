import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface WISProcedure {
  id: string;
  procedure_code: string;
  title: string;
  model: string;
  system: string;
  subsystem?: string;
  content: string;
  steps: Array<{
    step: number;
    description: string;
    timeMinutes: number;
  }>;
  tools_required: string[];
  parts_required: string[];
  safety_warnings: string[];
  time_estimate: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  view_count: number;
}

export interface WISPart {
  id: string;
  part_number: string;
  description: string;
  category: string;
  models: string[];
  superseded_by?: string;
  price: number;
  availability: string;
  specifications: Record<string, any>;
  view_count: number;
}

export interface WISModel {
  id: string;
  model_code: string;
  model_name: string;
  year_from: number;
  year_to: number;
  engine_options?: any;
  specifications?: any;
}

export interface WISBulletin {
  id: string;
  bulletin_number: string;
  title: string;
  models_affected: string[];
  issue_date: string;
  category: string;
  content: string;
  priority: 'info' | 'recommended' | 'mandatory' | 'safety';
}

export interface WISSearchResult {
  id: string;
  title: string;
  content_type: 'procedure' | 'part' | 'bulletin';
  model?: string;
  system?: string;
  relevance: number;
}

class WISContentService {
  /**
   * Search WIS content
   */
  async search(query: string, filters?: {
    model?: string;
    system?: string;
  }): Promise<WISSearchResult[]> {
    try {
      const { data, error } = await supabase.rpc('search_wis_content', {
        search_query: query,
        filter_model: filters?.model || null,
        filter_system: filters?.system || null
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching WIS content:', error);
      toast({
        title: "Search Error",
        description: "Unable to search WIS content. Please try again.",
        variant: "destructive"
      });
      return [];
    }
  }

  /**
   * Get all models
   */
  async getModels(): Promise<WISModel[]> {
    try {
      const { data, error } = await supabase
        .from('wis_models')
        .select('*')
        .order('model_code');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  /**
   * Get procedures by model
   */
  async getProceduresByModel(model: string): Promise<WISProcedure[]> {
    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .select('*')
        .eq('model', model)
        .order('system', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching procedures:', error);
      return [];
    }
  }

  /**
   * Get single procedure
   */
  async getProcedure(id: string): Promise<WISProcedure | null> {
    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Increment view count
      if (data) {
        await supabase
          .from('wis_procedures')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', id);
      }

      return data;
    } catch (error) {
      console.error('Error fetching procedure:', error);
      return null;
    }
  }

  /**
   * Get parts for procedure
   */
  async getPartsForProcedure(partNumbers: string[]): Promise<WISPart[]> {
    if (!partNumbers || partNumbers.length === 0) return [];

    try {
      const { data, error } = await supabase
        .from('wis_parts')
        .select('*')
        .in('part_number', partNumbers);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching parts:', error);
      return [];
    }
  }

  /**
   * Get part by number
   */
  async getPart(partNumber: string): Promise<WISPart | null> {
    try {
      const { data, error } = await supabase
        .from('wis_parts')
        .select('*')
        .eq('part_number', partNumber)
        .single();

      if (error) throw error;

      // Increment view count
      if (data) {
        await supabase
          .from('wis_parts')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('part_number', partNumber);
      }

      return data;
    } catch (error) {
      console.error('Error fetching part:', error);
      return null;
    }
  }

  /**
   * Get bulletins for model
   */
  async getBulletinsForModel(model: string): Promise<WISBulletin[]> {
    try {
      const { data, error } = await supabase
        .from('wis_bulletins')
        .select('*')
        .contains('models_affected', [model])
        .order('issue_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bulletins:', error);
      return [];
    }
  }

  /**
   * Get popular procedures
   */
  async getPopularProcedures(limit = 10): Promise<WISProcedure[]> {
    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .select('*')
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching popular procedures:', error);
      return [];
    }
  }

  /**
   * Get systems for a model
   */
  async getSystemsForModel(model: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .select('system')
        .eq('model', model);

      if (error) throw error;
      
      // Get unique systems
      const systems = [...new Set(data?.map(item => item.system) || [])];
      return systems.sort();
    } catch (error) {
      console.error('Error fetching systems:', error);
      return [];
    }
  }

  /**
   * Get wiring diagram
   */
  async getWiringDiagram(model: string, system: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('wis_wiring')
        .select('*')
        .eq('model', model)
        .eq('system', system)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching wiring diagram:', error);
      return null;
    }
  }

  /**
   * Check if using demo data
   */
  async isDemoMode(): Promise<boolean> {
    try {
      const { count } = await supabase
        .from('wis_procedures')
        .select('*', { count: 'exact', head: true });
      
      // If we have less than 10 procedures, we're in demo mode
      return (count || 0) < 10;
    } catch (error) {
      return true;
    }
  }

  /**
   * Request PDF generation (requires VPS)
   */
  async requestPDF(procedureId: string, vpsUrl?: string): Promise<Blob | null> {
    if (!vpsUrl) {
      toast({
        title: "PDF Generation Unavailable",
        description: "PDF generation requires a processing server to be configured.",
        variant: "destructive"
      });
      return null;
    }

    try {
      const response = await fetch(`${vpsUrl}/api/wis/procedure/${procedureId}/pdf`);
      if (!response.ok) throw new Error('PDF generation failed');
      
      return await response.blob();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Unable to generate PDF. Please try again later.",
        variant: "destructive"
      });
      return null;
    }
  }
}

export const wisContentService = new WISContentService();