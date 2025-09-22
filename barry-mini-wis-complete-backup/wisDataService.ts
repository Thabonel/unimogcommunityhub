// WIS Data Service - Single Source of Truth for all WIS operations
// Phase 1.1 Implementation - Clean, efficient, robust

import { supabase } from '@/lib/supabase-client';
import type {
  WISModel,
  WISSystem,
  WISComponent,
  WISProcedure,
  WISProcedureStep
} from '@/stores/wisStore';

// Additional types for hierarchical tree structure (matching AdvancedWISInterface)
export interface WISTreeNode {
  id: string;
  type: 'model' | 'system' | 'component' | 'procedure';
  code: string;
  name: string;
  description?: string;
  children?: WISTreeNode[];
  procedureCount?: number;
  estimatedTime?: number;
  icon?: string;
  difficulty?: string;
  duration?: string;
}

export interface WISMediaItem {
  id: string;
  url: string;
  title: string;
  type: 'overview' | 'tools' | 'step' | 'measurement' | 'technical';
}

/**
 * WIS Data Service - Singleton pattern for consistent data access
 * Handles all database operations with clean error handling and caching
 */
export class WISDataService {
  private static instance: WISDataService;

  public static getInstance(): WISDataService {
    if (!WISDataService.instance) {
      WISDataService.instance = new WISDataService();
    }
    return WISDataService.instance;
  }

  /**
   * Get all active vehicle models
   * Cache time: 30 minutes (models rarely change)
   */
  async getModels(): Promise<WISModel[]> {
    try {
      const { data, error } = await supabase
        .from('wis_models')
        .select('*')
        .eq('active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching WIS models:', error);
        throw new Error(`Failed to fetch models: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('WIS getModels error:', err);
      throw err;
    }
  }

  /**
   * Get systems for a specific model
   * Cache time: 30 minutes (stable hierarchy)
   */
  async getSystems(modelId: string): Promise<WISSystem[]> {
    if (!modelId) {
      throw new Error('Model ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('wis_systems')
        .select('*')
        .eq('model_id', modelId)
        .order('sort_order');

      if (error) {
        console.error('Error fetching WIS systems:', error);
        throw new Error(`Failed to fetch systems: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('WIS getSystems error:', err);
      throw err;
    }
  }

  /**
   * Get components for a specific system
   * Cache time: 30 minutes (stable hierarchy)
   */
  async getComponents(systemId: string): Promise<WISComponent[]> {
    if (!systemId) {
      throw new Error('System ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('wis_components')
        .select('*')
        .eq('system_id', systemId)
        .order('sort_order');

      if (error) {
        console.error('Error fetching WIS components:', error);
        throw new Error(`Failed to fetch components: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('WIS getComponents error:', err);
      throw err;
    }
  }

  /**
   * Get procedures for a specific component with full hierarchy context
   * Cache time: 20 minutes (procedures can be updated)
   */
  async getProcedures(componentId: string): Promise<WISProcedure[]> {
    if (!componentId) {
      throw new Error('Component ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .select(`
          *,
          wis_components!inner (
            component_name,
            component_code,
            wis_systems!inner (
              system_name,
              system_code,
              wis_models!inner (
                model_name,
                model_code
              )
            )
          )
        `)
        .eq('component_id', componentId)
        .eq('status', 'active')
        .order('procedure_code');

      if (error) {
        console.error('Error fetching WIS procedures:', error);
        throw new Error(`Failed to fetch procedures: ${error.message}`);
      }

      // Transform the nested data to flat structure for easier use
      const procedures = (data || []).map(proc => ({
        ...proc,
        model_code: proc.wis_components?.wis_systems?.wis_models?.model_code,
        model_name: proc.wis_components?.wis_systems?.wis_models?.model_name,
        system_code: proc.wis_components?.wis_systems?.system_code,
        system_name: proc.wis_components?.wis_systems?.system_name,
        component_code: proc.wis_components?.component_code,
        component_name: proc.wis_components?.component_name,
      }));

      return procedures;
    } catch (err) {
      console.error('WIS getProcedures error:', err);
      throw err;
    }
  }

  /**
   * Get detailed steps for a specific procedure
   * Cache time: 60 minutes (steps are static once created)
   */
  async getProcedureSteps(procedureId: string): Promise<WISProcedureStep[]> {
    if (!procedureId) {
      throw new Error('Procedure ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('wis_procedure_steps')
        .select('*')
        .eq('procedure_id', procedureId)
        .order('step_number');

      if (error) {
        console.error('Error fetching WIS procedure steps:', error);
        throw new Error(`Failed to fetch procedure steps: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('WIS getProcedureSteps error:', err);
      throw err;
    }
  }

  /**
   * Get a single procedure by ID with full context
   * Used for direct procedure access (e.g., from Barry handoff)
   */
  async getProcedureById(procedureId: string): Promise<WISProcedure | null> {
    if (!procedureId) {
      throw new Error('Procedure ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .select(`
          *,
          wis_components!inner (
            component_name,
            component_code,
            wis_systems!inner (
              system_name,
              system_code,
              wis_models!inner (
                model_name,
                model_code
              )
            )
          )
        `)
        .eq('id', procedureId)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching WIS procedure by ID:', error);
        throw new Error(`Failed to fetch procedure: ${error.message}`);
      }

      if (!data) return null;

      // Transform nested data
      return {
        ...data,
        model_code: data.wis_components?.wis_systems?.wis_models?.model_code,
        model_name: data.wis_components?.wis_systems?.wis_models?.model_name,
        system_code: data.wis_components?.wis_systems?.system_code,
        system_name: data.wis_components?.wis_systems?.system_name,
        component_code: data.wis_components?.component_code,
        component_name: data.wis_components?.component_name,
      };
    } catch (err) {
      console.error('WIS getProcedureById error:', err);
      throw err;
    }
  }

  /**
   * Search procedures across all models with full-text search
   * Cache time: 10 minutes (search results can change)
   */
  async searchProcedures(query: string, modelId?: string, limit: number = 50): Promise<WISProcedure[]> {
    if (!query || query.length < 2) {
      throw new Error('Search query must be at least 2 characters');
    }

    try {
      let queryBuilder = supabase
        .from('wis_procedures')
        .select(`
          *,
          wis_components!inner (
            component_name,
            component_code,
            wis_systems!inner (
              system_name,
              system_code,
              wis_models!inner (
                model_name,
                model_code
              )
            )
          )
        `)
        .textSearch('search_vector', query, {
          config: 'english'
        })
        .eq('status', 'active')
        .limit(limit);

      // Filter by model if specified
      if (modelId) {
        queryBuilder = queryBuilder.eq('wis_components.wis_systems.model_id', modelId);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Error searching WIS procedures:', error);
        throw new Error(`Failed to search procedures: ${error.message}`);
      }

      // Transform nested data
      const procedures = (data || []).map(proc => ({
        ...proc,
        model_code: proc.wis_components?.wis_systems?.wis_models?.model_code,
        model_name: proc.wis_components?.wis_systems?.wis_models?.model_name,
        system_code: proc.wis_components?.wis_systems?.system_code,
        system_name: proc.wis_components?.wis_systems?.system_name,
        component_code: proc.wis_components?.component_code,
        component_name: proc.wis_components?.component_name,
      }));

      return procedures;
    } catch (err) {
      console.error('WIS searchProcedures error:', err);
      throw err;
    }
  }

  /**
   * Get parts for a specific procedure
   */
  async getProcedureParts(procedureId: string) {
    if (!procedureId) {
      throw new Error('Procedure ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('wis_procedure_parts')
        .select(`
          *,
          wis_parts!inner (
            mercedes_part_number,
            description,
            category,
            status,
            specifications,
            alternative_parts
          )
        `)
        .eq('procedure_id', procedureId);

      if (error) {
        console.error('Error fetching procedure parts:', error);
        throw new Error(`Failed to fetch procedure parts: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('WIS getProcedureParts error:', err);
      throw err;
    }
  }

  /**
   * Get tools for a specific procedure
   */
  async getProcedureTools(procedureId: string) {
    if (!procedureId) {
      throw new Error('Procedure ID is required');
    }

    try {
      const { data, error } = await supabase
        .from('wis_procedure_tools')
        .select(`
          *,
          wis_tools!inner (
            tool_name,
            tool_type,
            mercedes_tool_number,
            description,
            alternative_tools
          )
        `)
        .eq('procedure_id', procedureId);

      if (error) {
        console.error('Error fetching procedure tools:', error);
        throw new Error(`Failed to fetch procedure tools: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('WIS getProcedureTools error:', err);
      throw err;
    }
  }

  /**
   * Get hierarchical WIS tree for AdvancedWISInterface
   * Builds the complete tree structure that matches the existing UX
   */
  async getWISTree(modelCode: string = 'U435'): Promise<WISTreeNode[]> {
    try {
      // Get the model
      const { data: models } = await supabase
        .from('wis_models')
        .select('*')
        .eq('model_code', modelCode)
        .eq('active', true);

      if (!models || models.length === 0) {
        throw new Error(`Model ${modelCode} not found`);
      }

      const model = models[0];

      // Get systems for this model
      const { data: systems } = await supabase
        .from('wis_systems')
        .select('*')
        .eq('model_id', model.id)
        .order('sort_order');

      if (!systems) return [];

      const tree: WISTreeNode[] = [];

      for (const system of systems) {
        // Get components for this system
        const { data: components } = await supabase
          .from('wis_components')
          .select('*')
          .eq('system_id', system.id)
          .order('sort_order');

        const systemNode: WISTreeNode = {
          id: system.id,
          type: 'system',
          code: system.system_code,
          name: system.system_name,
          description: system.description,
          icon: system.icon_name || 'Settings',
          children: []
        };

        if (components) {
          for (const component of components) {
            // Get procedures for this component
            const { data: procedures } = await supabase
              .from('wis_procedures')
              .select('id, procedure_code, title, estimated_time_hours, difficulty_level')
              .eq('component_id', component.id)
              .eq('status', 'active')
              .order('procedure_code');

            const componentNode: WISTreeNode = {
              id: component.id,
              type: 'component',
              code: component.component_code,
              name: component.component_name,
              description: component.description,
              procedureCount: procedures?.length || 0,
              children: []
            };

            if (procedures) {
              for (const procedure of procedures) {
                const procedureNode: WISTreeNode = {
                  id: procedure.id,
                  type: 'procedure',
                  code: procedure.procedure_code,
                  name: procedure.title,
                  estimatedTime: procedure.estimated_time_hours,
                  duration: procedure.estimated_time_hours ? `${Math.round(procedure.estimated_time_hours * 60)} min` : undefined,
                  difficulty: this.getDifficultyLabel(procedure.difficulty_level)
                };

                componentNode.children!.push(procedureNode);
              }
            }

            systemNode.children!.push(componentNode);
          }
        }

        tree.push(systemNode);
      }

      return tree;

    } catch (error) {
      console.error('Error building WIS tree:', error);
      throw error;
    }
  }

  /**
   * Get procedure with rich media for AdvancedWISInterface display
   */
  async getProcedureWithMedia(procedureId: string): Promise<any> {
    try {
      // Get the procedure with full context
      const procedure = await this.getProcedureById(procedureId);
      if (!procedure) return null;

      // Get procedure steps
      const steps = await this.getProcedureSteps(procedureId);

      // Get tools and parts
      const [tools, parts] = await Promise.all([
        this.getProcedureTools(procedureId),
        this.getProcedureParts(procedureId)
      ]);

      // Get media from multiple buckets
      const media = await this.getProcedureMedia(procedureId);

      return {
        ...procedure,
        steps,
        tools,
        parts,
        media: {
          photos: media.filter(m => m.type === 'photo'),
          videos: media.filter(m => m.type === 'video'),
          diagrams: media.filter(m => m.type === 'diagram')
        }
      };

    } catch (error) {
      console.error('Error getting procedure with media:', error);
      throw error;
    }
  }

  /**
   * Get media files for a procedure from various buckets
   */
  private async getProcedureMedia(procedureId: string): Promise<WISMediaItem[]> {
    try {
      // Query media mapping table if it exists
      const { data: mediaData } = await supabase
        .from('wis_procedure_media_mapping')
        .select(`
          wis_media_catalog(*)
        `)
        .eq('procedure_id', procedureId);

      const media: WISMediaItem[] = [];

      if (mediaData) {
        for (const item of mediaData) {
          const mediaItem = item.wis_media_catalog;

          // Get signed URL for the media file
          const { data: signedUrlData } = await supabase.storage
            .from(mediaItem.bucket_name)
            .createSignedUrl(mediaItem.file_path, 3600); // 1 hour expiry

          if (signedUrlData?.signedUrl) {
            media.push({
              id: mediaItem.id,
              url: signedUrlData.signedUrl,
              title: mediaItem.title || mediaItem.file_name,
              type: mediaItem.media_type === 'photo' ? 'step' : 'technical'
            });
          }
        }
      }

      return media;

    } catch (error) {
      console.error('Error getting procedure media:', error);
      return [];
    }
  }

  /**
   * Helper to convert difficulty level to label
   */
  private getDifficultyLabel(level?: number): string {
    if (!level) return 'Easy';

    const labels: Record<number, string> = {
      1: 'Easy',
      2: 'Medium',
      3: 'Hard',
      4: 'Expert',
      5: 'Specialist'
    };

    return labels[level] || 'Medium';
  }

  /**
   * Health check - verify database connection and basic functionality
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; details?: any }> {
    try {
      const { data, error } = await supabase
        .from('wis_models')
        .select('id')
        .limit(1);

      if (error) {
        return {
          status: 'error',
          details: { message: error.message, code: error.code }
        };
      }

      return { status: 'ok', details: { modelsAvailable: data?.length > 0 } };
    } catch (err) {
      return {
        status: 'error',
        details: { message: 'Connection failed', error: err }
      };
    }
  }
}

// Export singleton instance for easy importing
export const wisDataService = WISDataService.getInstance();