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
   * @param modelIdOrCode - Can be either a UUID (model_id) or model code (like "U1700L")
   */
  async getSystems(modelIdOrCode: string): Promise<WISSystem[]> {
    if (!modelIdOrCode) {
      throw new Error('Model ID or code is required');
    }

    try {
      let modelUuid: string;

      // Check if the input is already a UUID (36 chars with dashes) or a model code
      if (modelIdOrCode.length === 36 && modelIdOrCode.includes('-')) {
        // Assume it's already a UUID
        modelUuid = modelIdOrCode;
      } else {
        // It's a model code, look up the UUID
        const { data: modelData, error: modelError } = await supabase
          .from('wis_models')
          .select('id')
          .eq('model_code', modelIdOrCode)
          .single();

        if (modelError || !modelData) {
          console.error('Error fetching model UUID:', modelError);
          throw new Error(`Failed to find model with code: ${modelIdOrCode}`);
        }

        modelUuid = modelData.id;
      }

      const { data, error } = await supabase
        .from('wis_systems')
        .select('*')
        .eq('model_id', modelUuid)
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
   * DATA POPULATION METHODS - Phase 2.1 Implementation
   */

  /**
   * Populate additional Unimog models
   */
  async populateModels(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      const additionalModels = [
        {
          model_code: 'U1700L',
          model_name: 'Unimog U1700L',
          description: 'Mercedes-Benz Unimog U1700L - Agricultural and municipal applications with OM366LA engine',
          year_range: '1989-2013',
          active: true,
          sort_order: 2
        },
        {
          model_code: 'U2150L',
          model_name: 'Unimog U2150L',
          description: 'Mercedes-Benz Unimog U2150L - Heavy-duty applications with OM366LA engine',
          year_range: '1989-2000',
          active: true,
          sort_order: 3
        },
        {
          model_code: 'U4000',
          model_name: 'Unimog U4000',
          description: 'Mercedes-Benz Unimog U4000 - Implement carrier with OM906LA engine',
          year_range: '2000-2013',
          active: true,
          sort_order: 4
        },
        {
          model_code: 'U5000',
          model_name: 'Unimog U5000',
          description: 'Mercedes-Benz Unimog U5000 - Heavy implement carrier with OM926LA engine',
          year_range: '2000-2013',
          active: true,
          sort_order: 5
        },
        {
          model_code: 'U400',
          model_name: 'Unimog U400',
          description: 'Mercedes-Benz Unimog U400 - Municipal and forestry with OM924LA engine',
          year_range: '2000-2017',
          active: true,
          sort_order: 6
        },
        {
          model_code: 'U300',
          model_name: 'Unimog U300',
          description: 'Mercedes-Benz Unimog U300 - Light municipal applications with OM904LA engine',
          year_range: '1995-2013',
          active: true,
          sort_order: 7
        },
        {
          model_code: 'U500',
          model_name: 'Unimog U500',
          description: 'Mercedes-Benz Unimog U500 - Municipal and agricultural with OM924LA engine',
          year_range: '2000-2017',
          active: true,
          sort_order: 8
        }
      ];

      const { data, error } = await supabase
        .from('wis_models')
        .upsert(additionalModels, { onConflict: 'model_code' })
        .select();

      if (error) {
        console.error('Error populating models:', error);
        return { success: false, message: `Failed to populate models: ${error.message}` };
      }

      return {
        success: true,
        message: `Successfully populated ${data?.length || 0} models`,
        count: data?.length || 0
      };

    } catch (err) {
      console.error('WIS populateModels error:', err);
      return { success: false, message: 'Failed to populate models due to unexpected error' };
    }
  }

  /**
   * Populate systems for all models
   */
  async populateSystems(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      // Get all models first
      const { data: models } = await supabase
        .from('wis_models')
        .select('id, model_code')
        .eq('active', true);

      if (!models || models.length === 0) {
        return { success: false, message: 'No models found to populate systems' };
      }

      const systems = [];

      for (const model of models) {
        const modelSystems = [
          {
            model_id: model.id,
            system_code: `ENG_${model.model_code}`,
            system_name: 'Engine',
            description: 'Engine system components and procedures',
            icon_name: 'engine',
            sort_order: 1,
            estimated_procedures: 15
          },
          {
            model_id: model.id,
            system_code: `FUEL_${model.model_code}`,
            system_name: 'Fuel System',
            description: 'Fuel injection and delivery system',
            icon_name: 'fuel',
            sort_order: 2,
            estimated_procedures: 8
          },
          {
            model_id: model.id,
            system_code: `COOL_${model.model_code}`,
            system_name: 'Cooling System',
            description: 'Engine cooling and radiator system',
            icon_name: 'cooling',
            sort_order: 3,
            estimated_procedures: 6
          },
          {
            model_id: model.id,
            system_code: `TRANS_${model.model_code}`,
            system_name: 'Transmission',
            description: 'Transmission and drivetrain system',
            icon_name: 'transmission',
            sort_order: 4,
            estimated_procedures: 12
          },
          {
            model_id: model.id,
            system_code: `AXLE_${model.model_code}`,
            system_name: 'Axles',
            description: 'Portal axle systems front and rear',
            icon_name: 'axle',
            sort_order: 5,
            estimated_procedures: 10
          },
          {
            model_id: model.id,
            system_code: `ELEC_${model.model_code}`,
            system_name: 'Electrical',
            description: 'Electrical system and components',
            icon_name: 'electric',
            sort_order: 6,
            estimated_procedures: 20
          },
          {
            model_id: model.id,
            system_code: `HYD_${model.model_code}`,
            system_name: 'Hydraulics',
            description: 'Hydraulic system for implements',
            icon_name: 'hydraulic',
            sort_order: 7,
            estimated_procedures: 8
          },
          {
            model_id: model.id,
            system_code: `BRAKE_${model.model_code}`,
            system_name: 'Brakes',
            description: 'Brake system and components',
            icon_name: 'brakes',
            sort_order: 8,
            estimated_procedures: 7
          }
        ];

        systems.push(...modelSystems);
      }

      const { data, error } = await supabase
        .from('wis_systems')
        .upsert(systems, { ignoreDuplicates: true })
        .select();

      if (error) {
        console.error('Error populating systems:', error);
        return { success: false, message: `Failed to populate systems: ${error.message}` };
      }

      return {
        success: true,
        message: `Successfully populated ${data?.length || 0} systems across ${models.length} models`,
        count: data?.length || 0
      };

    } catch (err) {
      console.error('WIS populateSystems error:', err);
      return { success: false, message: 'Failed to populate systems due to unexpected error' };
    }
  }

  /**
   * Populate components for all systems
   */
  async populateComponents(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      // Get all systems
      const { data: systems } = await supabase
        .from('wis_systems')
        .select('id, system_code, system_name');

      if (!systems || systems.length === 0) {
        return { success: false, message: 'No systems found to populate components' };
      }

      const components = [];

      for (const system of systems) {
        let systemComponents = [];

        if (system.system_code.startsWith('ENG_')) {
          systemComponents = [
            { component_code: `${system.system_code}_BLOCK`, component_name: 'Engine Block', description: 'Engine block assembly', sort_order: 1 },
            { component_code: `${system.system_code}_HEAD`, component_name: 'Cylinder Head', description: 'Cylinder head with valves', sort_order: 2 },
            { component_code: `${system.system_code}_CRANK`, component_name: 'Crankshaft', description: 'Crankshaft and main bearings', sort_order: 3 },
            { component_code: `${system.system_code}_PISTON`, component_name: 'Pistons & Rods', description: 'Piston and connecting rod assembly', sort_order: 4 },
            { component_code: `${system.system_code}_VALVE`, component_name: 'Valve Train', description: 'Camshaft and valve mechanism', sort_order: 5 }
          ];
        } else if (system.system_code.startsWith('FUEL_')) {
          systemComponents = [
            { component_code: `${system.system_code}_PUMP`, component_name: 'Fuel Pump', description: 'Fuel supply pump', sort_order: 1 },
            { component_code: `${system.system_code}_INJ`, component_name: 'Injection System', description: 'Fuel injection components', sort_order: 2 },
            { component_code: `${system.system_code}_FILTER`, component_name: 'Fuel Filter', description: 'Primary and secondary filters', sort_order: 3 },
            { component_code: `${system.system_code}_TANK`, component_name: 'Fuel Tank', description: 'Main fuel tank assembly', sort_order: 4 }
          ];
        } else if (system.system_code.startsWith('TRANS_')) {
          systemComponents = [
            { component_code: `${system.system_code}_CASE`, component_name: 'Transmission Case', description: 'Transmission housing', sort_order: 1 },
            { component_code: `${system.system_code}_GEARS`, component_name: 'Gear Set', description: 'Transmission gear assembly', sort_order: 2 },
            { component_code: `${system.system_code}_CLUTCH`, component_name: 'Clutch', description: 'Clutch assembly', sort_order: 3 },
            { component_code: `${system.system_code}_SHIFT`, component_name: 'Shift Mechanism', description: 'Shift forks and rails', sort_order: 4 }
          ];
        } else if (system.system_code.startsWith('AXLE_')) {
          systemComponents = [
            { component_code: `${system.system_code}_DIFF`, component_name: 'Differential', description: 'Differential assembly', sort_order: 1 },
            { component_code: `${system.system_code}_PORTAL`, component_name: 'Portal Gears', description: 'Portal gear reduction', sort_order: 2 },
            { component_code: `${system.system_code}_HUB`, component_name: 'Wheel Hubs', description: 'Wheel hub assembly', sort_order: 3 },
            { component_code: `${system.system_code}_CV`, component_name: 'CV Joints', description: 'Constant velocity joints', sort_order: 4 }
          ];
        } else {
          // Generic components for other systems
          systemComponents = [
            { component_code: `${system.system_code}_MAIN`, component_name: `${system.system_name} Assembly`, description: `Main ${system.system_name.toLowerCase()} components`, sort_order: 1 },
            { component_code: `${system.system_code}_CTRL`, component_name: `${system.system_name} Control`, description: `${system.system_name} control components`, sort_order: 2 },
            { component_code: `${system.system_code}_MAINT`, component_name: `${system.system_name} Maintenance`, description: `${system.system_name} maintenance items`, sort_order: 3 }
          ];
        }

        // Add system_id to each component
        const componentsWithSystemId = systemComponents.map(comp => ({
          ...comp,
          system_id: system.id
        }));

        components.push(...componentsWithSystemId);
      }

      const { data, error } = await supabase
        .from('wis_components')
        .upsert(components, { ignoreDuplicates: true })
        .select();

      if (error) {
        console.error('Error populating components:', error);
        return { success: false, message: `Failed to populate components: ${error.message}` };
      }

      return {
        success: true,
        message: `Successfully populated ${data?.length || 0} components across ${systems.length} systems`,
        count: data?.length || 0
      };

    } catch (err) {
      console.error('WIS populateComponents error:', err);
      return { success: false, message: 'Failed to populate components due to unexpected error' };
    }
  }

  /**
   * Populate sample procedures for components
   */
  async populateProcedures(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      // Get all components
      const { data: components } = await supabase
        .from('wis_components')
        .select('id, component_code, component_name')
        .limit(20); // Start with first 20 components

      if (!components || components.length === 0) {
        return { success: false, message: 'No components found to populate procedures' };
      }

      const procedures = [];

      for (const component of components) {
        const componentProcedures = [
          {
            component_id: component.id,
            procedure_code: `${component.component_code}_INSP`,
            title: `Inspect ${component.component_name}`,
            description: `Visual inspection and basic testing of ${component.component_name.toLowerCase()}`,
            difficulty_level: 1,
            estimated_time_hours: 0.5,
            status: 'active',
            version: '1.0'
          },
          {
            component_id: component.id,
            procedure_code: `${component.component_code}_REPL`,
            title: `Replace ${component.component_name}`,
            description: `Complete replacement procedure for ${component.component_name.toLowerCase()}`,
            difficulty_level: 3,
            estimated_time_hours: 2.0,
            status: 'active',
            version: '1.0'
          }
        ];

        // Add specific procedures based on component type
        if (component.component_code.includes('_FILTER')) {
          componentProcedures.push({
            component_id: component.id,
            procedure_code: `${component.component_code}_CLEAN`,
            title: `Clean ${component.component_name}`,
            description: `Cleaning procedure for ${component.component_name.toLowerCase()}`,
            difficulty_level: 1,
            estimated_time_hours: 0.25,
            status: 'active',
            version: '1.0'
          });
        }

        procedures.push(...componentProcedures);
      }

      const { data, error } = await supabase
        .from('wis_procedures')
        .upsert(procedures, { ignoreDuplicates: true })
        .select();

      if (error) {
        console.error('Error populating procedures:', error);
        return { success: false, message: `Failed to populate procedures: ${error.message}` };
      }

      return {
        success: true,
        message: `Successfully populated ${data?.length || 0} procedures across ${components.length} components`,
        count: data?.length || 0
      };

    } catch (err) {
      console.error('WIS populateProcedures error:', err);
      return { success: false, message: 'Failed to populate procedures due to unexpected error' };
    }
  }

  /**
   * Complete data population - runs all population methods in sequence
   */
  async populateAllWISData(): Promise<{ success: boolean; message: string; details: any[] }> {
    const results = [];

    try {
      console.log('Starting comprehensive WIS data population...');

      // Step 1: Populate models
      const modelResult = await this.populateModels();
      results.push({ step: 'Models', ...modelResult });
      if (!modelResult.success) {
        return { success: false, message: 'Failed at models step', details: results };
      }

      // Step 2: Populate systems
      const systemResult = await this.populateSystems();
      results.push({ step: 'Systems', ...systemResult });
      if (!systemResult.success) {
        return { success: false, message: 'Failed at systems step', details: results };
      }

      // Step 3: Populate components
      const componentResult = await this.populateComponents();
      results.push({ step: 'Components', ...componentResult });
      if (!componentResult.success) {
        return { success: false, message: 'Failed at components step', details: results };
      }

      // Step 4: Populate procedures
      const procedureResult = await this.populateProcedures();
      results.push({ step: 'Procedures', ...procedureResult });
      if (!procedureResult.success) {
        return { success: false, message: 'Failed at procedures step', details: results };
      }

      const totalItems = results.reduce((sum, result) => sum + (result.count || 0), 0);

      return {
        success: true,
        message: `Successfully populated WIS database with ${totalItems} total items`,
        details: results
      };

    } catch (err) {
      console.error('WIS populateAllWISData error:', err);
      results.push({ step: 'Error', success: false, message: err.message });
      return { success: false, message: 'Population failed due to unexpected error', details: results };
    }
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
