import { supabase } from '@/lib/supabase-client';

// WIS Service for managing Workshop Information System data
export class WISService {
  // Upload a manual file to Supabase storage
  static async uploadManual(file: File, category: 'manuals' | 'parts' | 'bulletins' | 'wiring') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('wis-manuals')
        .upload(fileName, file);

      if (error) throw error;
      
      return { success: true, path: data.path };
    } catch (error) {
      console.error('Error uploading manual:', error);
      return { success: false, error };
    }
  }

  // Get signed URL for viewing a manual
  static async getManualUrl(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from('wis-manuals')
        .createSignedUrl(path, 3600); // 1 hour expiry

      if (error) throw error;
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting manual URL:', error);
      return null;
    }
  }

  // Fetch all vehicles
  static async getVehicles() {
    try {
      const { data, error } = await supabase
        .from('wis_models')
        .select('*')
        .order('model_name');

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
  }

  // Fetch procedures for a vehicle
  static async getProcedures(vehicleId?: string) {
    try {
      let query = supabase
        .from('wis_procedures')
        .select(`
          *,
          vehicle:wis_models(model_name, model_code)
        `)
        .order('category');

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching procedures:', error);
      return [];
    }
  }

  // Fetch parts for a vehicle
  static async getParts(vehicleId?: string) {
    try {
      let query = supabase
        .from('wis_parts')
        .select(`
          *,
          vehicle:wis_models(model_name, model_code)
        `)
        .order('part_number');

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching parts:', error);
      return [];
    }
  }

  // Fetch bulletins
  static async getBulletins(vehicleModel?: string) {
    try {
      const { data, error } = await supabase
        .from('wis_bulletins')
        .select('*')
        .eq('is_active', true)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      
      // Filter by vehicle model if provided
      if (vehicleModel && data) {
        return data.filter(bulletin => 
          bulletin.affected_models.some((model: string) => 
            model.toLowerCase().includes(vehicleModel.toLowerCase())
          )
        );
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching bulletins:', error);
      return [];
    }
  }

  // Search WIS content
  static async searchContent(searchTerm: string, contentType = 'all', vehicleModel?: string) {
    try {
      const { data, error } = await supabase.rpc('search_wis_content', {
        search_term: searchTerm,
        content_type: contentType,
        vehicle_model: vehicleModel
      });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error searching WIS content:', error);
      return [];
    }
  }

  // Log user access to a document
  static async logAccess(documentType: string, documentId: string, documentTitle?: string) {
    try {
      const { data, error } = await supabase.rpc('log_wis_access', {
        p_document_type: documentType,
        p_document_id: documentId,
        p_document_title: documentTitle,
        p_access_method: 'web'
      });

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error logging access:', error);
      return null;
    }
  }

  // Create a new procedure
  static async createProcedure(procedure: any) {
    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .insert(procedure)
        .select()
        .single();

      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating procedure:', error);
      return { success: false, error };
    }
  }

  // Create a new part
  static async createPart(part: any) {
    try {
      const { data, error } = await supabase
        .from('wis_parts')
        .insert(part)
        .select()
        .single();

      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating part:', error);
      return { success: false, error };
    }
  }

  // Create a new bulletin
  static async createBulletin(bulletin: any) {
    try {
      const { data, error } = await supabase
        .from('wis_bulletins')
        .insert(bulletin)
        .select()
        .single();

      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating bulletin:', error);
      return { success: false, error };
    }
  }

  // Get user's access history
  static async getUserAccessHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('wis_user_access')
        .select('*')
        .eq('user_id', userId)
        .order('accessed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching access history:', error);
      return [];
    }
  }

  // Upload sample files from external drive
  static async uploadSampleFile(filePath: string, category: string) {
    try {
      // This is a placeholder for uploading from the external drive
      // In production, this would read the file and upload it
      console.log(`Would upload ${filePath} to ${category}`);
      
      // For now, we'll create a mock response
      return {
        success: true,
        message: `Sample file ${filePath} ready for upload to ${category}`
      };
    } catch (error) {
      console.error('Error with sample file:', error);
      return { success: false, error };
    }
  }
}