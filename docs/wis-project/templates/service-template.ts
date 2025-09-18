// WIS Data Service Template
// File: /src/services/wis/wisDataService.ts

import { supabase } from '@/lib/supabase-client';
import type {
  WISModel,
  WISSystem,
  WISComponent,
  WISProcedure,
  WISProcedureStep
} from '@/stores/wisStore';

export class WISDataService {
  // Static instance for singleton pattern
  private static instance: WISDataService;

  public static getInstance(): WISDataService {
    if (!WISDataService.instance) {
      WISDataService.instance = new WISDataService();
    }
    return WISDataService.instance;
  }

  /**
   * Get all vehicle models
   */
  async getModels(): Promise<WISModel[]> {
    const { data, error } = await supabase
      .from('wis_models')
      .select('*')
      .eq('active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching models:', error);
      throw new Error(`Failed to fetch models: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get systems for a specific model
   */
  async getSystems(modelId: string): Promise<WISSystem[]> {
    const { data, error } = await supabase
      .from('wis_systems')
      .select('*')
      .eq('model_id', modelId)
      .order('sort_order');

    if (error) {
      console.error('Error fetching systems:', error);
      throw new Error(`Failed to fetch systems: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get components for a specific system
   */
  async getComponents(systemId: string): Promise<WISComponent[]> {
    const { data, error } = await supabase
      .from('wis_components')
      .select('*')
      .eq('system_id', systemId)
      .order('sort_order');

    if (error) {
      console.error('Error fetching components:', error);
      throw new Error(`Failed to fetch components: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get procedures for a specific component
   */
  async getProcedures(componentId: string): Promise<WISProcedure[]> {
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
      console.error('Error fetching procedures:', error);
      throw new Error(`Failed to fetch procedures: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get detailed steps for a specific procedure
   */
  async getProcedureSteps(procedureId: string): Promise<WISProcedureStep[]> {
    const { data, error } = await supabase
      .from('wis_procedure_steps')
      .select('*')
      .eq('procedure_id', procedureId)
      .order('step_number');

    if (error) {
      console.error('Error fetching procedure steps:', error);
      throw new Error(`Failed to fetch procedure steps: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Search procedures across all models
   */
  async searchProcedures(query: string, modelId?: string): Promise<WISProcedure[]> {
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
      .textSearch('search_vector', query)
      .eq('status', 'active')
      .limit(50);

    if (modelId) {
      queryBuilder = queryBuilder.eq('wis_components.wis_systems.model_id', modelId);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error searching procedures:', error);
      throw new Error(`Failed to search procedures: ${error.message}`);
    }

    return data || [];
  }
}

// Export singleton instance
export const wisDataService = WISDataService.getInstance();