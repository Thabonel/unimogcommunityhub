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
      // PILOT DATA: Only 1 model for testing
      const additionalModels = [
        {
          model_code: 'U400_PILOT',
          model_name: 'Unimog U400 (Pilot)',
          description: 'Mercedes-Benz Unimog U400 - Pilot test data',
          year_range: '2000-2017',
          active: true,
          sort_order: 1
        }
      ];

      // Get existing models to avoid duplicates
      const { data: existingModels } = await supabase
        .from('wis_models')
        .select('model_code');

      const existingCodes = new Set(
        existingModels?.map(m => m.model_code) || []
      );

      // Only insert new models that don't already exist
      const newModels = additionalModels.filter(
        m => !existingCodes.has(m.model_code)
      );

      if (newModels.length === 0) {
        return {
          success: true,
          message: 'All models already exist - no new models to add',
          count: 0
        };
      }

      const { data, error } = await supabase
        .from('wis_models')
        .insert(newModels)
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

      // Get existing systems to avoid duplicates
      const { data: existingSystems } = await supabase
        .from('wis_systems')
        .select('model_id, system_code');

      const existingKeys = new Set(
        existingSystems?.map(s => `${s.model_id}|${s.system_code}`) || []
      );

      for (const model of models) {
        // PILOT DATA: Only 2 systems for testing
        const modelSystems = [
          {
            model_id: model.id,
            system_code: `ENG_${model.model_code}`,
            system_name: 'Engine',
            description: 'Engine system components and procedures (PILOT)',
            icon_name: 'engine',
            sort_order: 1,
            estimated_procedures: 2
          },
          {
            model_id: model.id,
            system_code: `TRANS_${model.model_code}`,
            system_name: 'Transmission',
            description: 'Transmission and drivetrain system (PILOT)',
            icon_name: 'transmission',
            sort_order: 2,
            estimated_procedures: 2
          }
        ];

        // Only add systems that don't already exist
        const newSystems = modelSystems.filter(
          s => !existingKeys.has(`${s.model_id}|${s.system_code}`)
        );

        systems.push(...newSystems);
      }

      if (systems.length === 0) {
        return {
          success: true,
          message: 'All systems already exist - no new systems to add',
          count: 0
        };
      }

      const { data, error } = await supabase
        .from('wis_systems')
        .insert(systems)
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

      // Get existing components to avoid duplicates
      const { data: existingComponents } = await supabase
        .from('wis_components')
        .select('system_id, component_code');

      const existingKeys = new Set(
        existingComponents?.map(c => `${c.system_id}|${c.component_code}`) || []
      );

      const components = [];

      for (const system of systems) {
        // PILOT DATA: Only 2 components per system for testing
        let systemComponents = [];

        if (system.system_code.startsWith('ENG_')) {
          systemComponents = [
            { component_code: `${system.system_code}_BLOCK`, component_name: 'Engine Block', description: 'Engine block assembly (PILOT)', sort_order: 1 },
            { component_code: `${system.system_code}_HEAD`, component_name: 'Cylinder Head', description: 'Cylinder head with valves (PILOT)', sort_order: 2 }
          ];
        } else if (system.system_code.startsWith('TRANS_')) {
          systemComponents = [
            { component_code: `${system.system_code}_CASE`, component_name: 'Transmission Case', description: 'Transmission housing (PILOT)', sort_order: 1 },
            { component_code: `${system.system_code}_GEARS`, component_name: 'Gear Set', description: 'Transmission gear assembly (PILOT)', sort_order: 2 }
          ];
        } else {
          // Generic components for other systems
          systemComponents = [
            { component_code: `${system.system_code}_MAIN`, component_name: `${system.system_name} Assembly`, description: `Main ${system.system_name.toLowerCase()} components (PILOT)`, sort_order: 1 },
            { component_code: `${system.system_code}_CTRL`, component_name: `${system.system_name} Control`, description: `${system.system_name} control components (PILOT)`, sort_order: 2 }
          ];
        }

        // Add system_id to each component
        const componentsWithSystemId = systemComponents.map(comp => ({
          ...comp,
          system_id: system.id
        }));

        // Only add components that don't already exist
        const newComponents = componentsWithSystemId.filter(
          c => !existingKeys.has(`${c.system_id}|${c.component_code}`)
        );

        components.push(...newComponents);
      }

      if (components.length === 0) {
        return {
          success: true,
          message: 'All components already exist - no new components to add',
          count: 0
        };
      }

      const { data, error} = await supabase
        .from('wis_components')
        .insert(components)
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
   * ETL: Parse HTML procedure files from storage and populate database
   * Scans wis-docs/model/*/procedures/*.html files and extracts structured data
   */
  async populateProcedures(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      // List all procedure HTML files in storage bucket
      const { data: files, error: listError } = await supabase.storage
        .from('wis-docs')
        .list('model', {
          search: 'procedures',
        });

      if (listError) {
        console.error('Error listing procedure files:', listError);
        return { success: false, message: `Failed to list files: ${listError.message}` };
      }

      // Recursively scan for procedure files in model/*/procedures/
      const procedureFiles: string[] = [];

      // List all models
      const { data: modelDirs } = await supabase.storage
        .from('wis-docs')
        .list('model');

      if (modelDirs) {
        for (const modelDir of modelDirs) {
          if (modelDir.name) {
            // List procedures in each model directory
            const { data: procFiles } = await supabase.storage
              .from('wis-docs')
              .list(`model/${modelDir.name}/procedures`);

            if (procFiles) {
              for (const file of procFiles) {
                if (file.name.endsWith('.html')) {
                  procedureFiles.push(`model/${modelDir.name}/procedures/${file.name}`);
                }
              }
            }
          }
        }
      }

      if (procedureFiles.length === 0) {
        return {
          success: true,
          message: 'No procedure HTML files found in storage bucket',
          count: 0
        };
      }

      // Get existing procedures to avoid duplicates
      const { data: existingProcedures } = await supabase
        .from('wis_procedures')
        .select('source_path');

      const existingPaths = new Set(
        existingProcedures?.map(p => p.source_path) || []
      );

      const procedures = [];

      // Process each HTML file
      for (const filePath of procedureFiles) {
        // Skip if already processed
        if (existingPaths.has(filePath)) {
          console.log(`Skipping already processed file: ${filePath}`);
          continue;
        }

        // Download and parse HTML file
        const { data: fileBlob, error: downloadError } = await supabase.storage
          .from('wis-docs')
          .download(filePath);

        if (downloadError || !fileBlob) {
          console.error(`Error downloading ${filePath}:`, downloadError);
          continue;
        }

        const htmlContent = await fileBlob.text();
        const parsedData = await this.parseHTMLProcedure(htmlContent, filePath);

        if (parsedData) {
          procedures.push(parsedData);
        }
      }

      if (procedures.length === 0) {
        return {
          success: true,
          message: 'All procedures already exist - no new procedures to add',
          count: 0
        };
      }

      // Insert procedures into database
      const { data, error } = await supabase
        .from('wis_procedures')
        .insert(procedures)
        .select();

      if (error) {
        console.error('Error inserting procedures:', error);
        return { success: false, message: `Failed to insert procedures: ${error.message}` };
      }

      return {
        success: true,
        message: `Successfully populated ${data?.length || 0} procedures from HTML files`,
        count: data?.length || 0
      };

    } catch (err) {
      console.error('WIS populateProcedures error:', err);
      return { success: false, message: `Failed to populate procedures: ${err.message}` };
    }
  }

  /**
   * Parse HTML procedure file and extract structured data
   * Also resolves or creates necessary model, system, and component hierarchy
   */
  private async parseHTMLProcedure(html: string, sourcePath: string): Promise<any | null> {
    try {
      // Use DOMParser to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract title (h1)
      const titleElement = doc.querySelector('h1');
      const title = titleElement?.textContent?.trim() || 'Untitled Procedure';

      // Extract model code from path: model/U435/procedures/file.html
      const pathParts = sourcePath.split('/');
      const modelCode = pathParts[1]; // U435
      const filename = pathParts[pathParts.length - 1].replace('.html', '');
      const procedureCode = `PROC_${modelCode}_${filename.toUpperCase().replace(/-/g, '_')}`;

      // Extract description (first paragraph or div with class description)
      let description = '';
      const descElement = doc.querySelector('.description, p');
      if (descElement) {
        description = descElement.textContent?.trim() || '';
      }

      // Extract time required (look for "Time Required" heading)
      let estimatedTimeHours = 1.0; // default
      const timeHeading = Array.from(doc.querySelectorAll('h2, h3')).find(h =>
        h.textContent?.toLowerCase().includes('time required')
      );
      if (timeHeading) {
        const timeText = timeHeading.nextElementSibling?.textContent || '';
        const minutesMatch = timeText.match(/(\d+)\s*minutes?/i);
        if (minutesMatch) {
          estimatedTimeHours = parseInt(minutesMatch[1]) / 60;
        }
      }

      // Extract difficulty (look for warnings or complexity indicators)
      let difficultyLevel = 2; // default medium
      const warningElements = doc.querySelectorAll('.warning, .caution');
      if (warningElements.length > 2) {
        difficultyLevel = 3; // hard if multiple warnings
      }

      // Extract overview (combine all content before first h2)
      const firstH2 = doc.querySelector('h2');
      let overview = '';
      if (firstH2 && titleElement) {
        let currentNode = titleElement.nextSibling;
        while (currentNode && currentNode !== firstH2) {
          if (currentNode.nodeType === Node.TEXT_NODE || currentNode.nodeType === Node.ELEMENT_NODE) {
            overview += currentNode.textContent || '';
          }
          currentNode = currentNode.nextSibling;
        }
      }
      overview = overview.trim() || description;

      // Resolve or create model/system/component hierarchy
      const componentId = await this.resolveComponentForProcedure(modelCode, filename, title);

      if (!componentId) {
        console.error(`Failed to resolve component for procedure: ${sourcePath}`);
        return null;
      }

      // Generate fingerprint for idempotent inserts
      const sourceFingerprint = `wis-${modelCode}-${filename}`;

      return {
        component_id: componentId,
        procedure_code: procedureCode,
        title: title,
        description: description,
        overview: overview,
        difficulty_level: difficultyLevel,
        estimated_time_hours: estimatedTimeHours,
        status: 'active',
        version: '1.0',
        source_path: sourcePath,
        source_fingerprint: sourceFingerprint,
      };

    } catch (err) {
      console.error('Error parsing HTML procedure:', err);
      return null;
    }
  }

  /**
   * Resolve or create component hierarchy for a procedure
   * Creates model -> system -> component chain if needed
   */
  private async resolveComponentForProcedure(
    modelCode: string,
    filename: string,
    title: string
  ): Promise<string | null> {
    try {
      // Step 1: Ensure model exists
      let { data: model } = await supabase
        .from('wis_models')
        .select('id')
        .eq('model_code', modelCode)
        .single();

      if (!model) {
        // Create model if it doesn't exist
        const { data: newModel, error: modelError } = await supabase
          .from('wis_models')
          .insert({
            model_code: modelCode,
            model_name: `Unimog ${modelCode}`,
            description: `Unimog ${modelCode} series (auto-created from WIS docs)`,
            active: true,
            sort_order: 100
          })
          .select()
          .single();

        if (modelError || !newModel) {
          console.error('Error creating model:', modelError);
          return null;
        }
        model = newModel;
      }

      // Step 2: Infer system from filename/title (e.g., "oil_change" -> "Engine")
      const systemName = this.inferSystemFromProcedure(filename, title);
      const systemCode = `${systemName.toUpperCase().replace(/\s+/g, '_')}_${modelCode}`;

      let { data: system } = await supabase
        .from('wis_systems')
        .select('id')
        .eq('model_id', model.id)
        .eq('system_code', systemCode)
        .single();

      if (!system) {
        // Create system if it doesn't exist
        const { data: newSystem, error: systemError } = await supabase
          .from('wis_systems')
          .insert({
            model_id: model.id,
            system_code: systemCode,
            system_name: systemName,
            description: `${systemName} system for ${modelCode}`,
            sort_order: 100
          })
          .select()
          .single();

        if (systemError || !newSystem) {
          console.error('Error creating system:', systemError);
          return null;
        }
        system = newSystem;
      }

      // Step 3: Create or find component (use generic "General" component for now)
      const componentName = `${systemName} - General`;
      const componentCode = `${systemCode}_GENERAL`;

      let { data: component } = await supabase
        .from('wis_components')
        .select('id')
        .eq('system_id', system.id)
        .eq('component_code', componentCode)
        .single();

      if (!component) {
        // Create component if it doesn't exist
        const { data: newComponent, error: componentError } = await supabase
          .from('wis_components')
          .insert({
            system_id: system.id,
            component_code: componentCode,
            component_name: componentName,
            description: `General procedures for ${systemName}`,
            sort_order: 100
          })
          .select()
          .single();

        if (componentError || !newComponent) {
          console.error('Error creating component:', componentError);
          return null;
        }
        component = newComponent;
      }

      return component.id;

    } catch (err) {
      console.error('Error resolving component:', err);
      return null;
    }
  }

  /**
   * Infer system category from procedure filename/title
   */
  private inferSystemFromProcedure(filename: string, title: string): string {
    const text = (filename + ' ' + title).toLowerCase();

    if (text.includes('engine') || text.includes('oil') || text.includes('motor')) {
      return 'Engine';
    } else if (text.includes('transmission') || text.includes('gearbox') || text.includes('clutch')) {
      return 'Transmission';
    } else if (text.includes('brake') || text.includes('braking')) {
      return 'Brakes';
    } else if (text.includes('axle') || text.includes('portal') || text.includes('differential')) {
      return 'Axles';
    } else if (text.includes('electrical') || text.includes('battery') || text.includes('wiring')) {
      return 'Electrical';
    } else if (text.includes('hydraulic') || text.includes('fluid')) {
      return 'Hydraulics';
    } else if (text.includes('cooling') || text.includes('radiator')) {
      return 'Cooling';
    } else if (text.includes('fuel') || text.includes('tank')) {
      return 'Fuel System';
    } else {
      return 'General';
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
