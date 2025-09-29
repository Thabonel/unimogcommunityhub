import { supabase } from '@/lib/supabase-client';
import { LocalStorageService } from '@/services/privacy/LocalStorageService';
import type { Database } from '@/types/database.types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];
type VehicleInsert = Database['public']['Tables']['vehicles']['Insert'];
type VehicleUpdate = Database['public']['Tables']['vehicles']['Update'];

type MaintenanceSchedule = Database['public']['Tables']['vehicle_maintenance_schedules']['Row'];
type MaintenanceScheduleInsert = Database['public']['Tables']['vehicle_maintenance_schedules']['Insert'];

type ServiceLog = Database['public']['Tables']['vehicle_service_logs']['Row'];
type ServiceLogInsert = Database['public']['Tables']['vehicle_service_logs']['Insert'];

type FuelLog = Database['public']['Tables']['vehicle_fuel_logs']['Row'];
type FuelLogInsert = Database['public']['Tables']['vehicle_fuel_logs']['Insert'];

export class VehicleService {
  // Check if privacy mode is enabled
  private static isPrivacyMode(userId: string): boolean {
    return LocalStorageService.isPrivacyModeEnabled(userId);
  }

  // Vehicle CRUD Operations
  static async getUserVehicles(userId: string): Promise<Vehicle[]> {
    try {
      // Check privacy mode first
      if (this.isPrivacyMode(userId)) {
        return LocalStorageService.getVehicles(userId);
      }

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error('Failed to fetch vehicles');
    }
  }

  static async getVehicle(vehicleId: string): Promise<Vehicle | null> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw new Error('Failed to fetch vehicle details');
    }
  }

  static async createVehicle(vehicleData: VehicleInsert): Promise<Vehicle> {
    try {
      const userId = vehicleData.user_id;

      // Check privacy mode
      if (this.isPrivacyMode(userId)) {
        const newVehicle: Vehicle = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...vehicleData
        } as Vehicle;

        LocalStorageService.addVehicle(userId, newVehicle);
        return newVehicle;
      }

      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw new Error('Failed to create vehicle');
    }
  }

  static async updateVehicle(vehicleId: string, updates: VehicleUpdate): Promise<Vehicle> {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', vehicleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw new Error('Failed to update vehicle');
    }
  }

  static async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw new Error('Failed to delete vehicle');
    }
  }

  // Maintenance Operations
  static async getMaintenanceSchedules(vehicleId: string): Promise<MaintenanceSchedule[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_maintenance_schedules')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .eq('is_active', true)
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching maintenance schedules:', error);
      throw new Error('Failed to fetch maintenance schedules');
    }
  }

  static async createMaintenanceSchedule(scheduleData: MaintenanceScheduleInsert): Promise<MaintenanceSchedule> {
    try {
      const { data, error } = await supabase
        .from('vehicle_maintenance_schedules')
        .insert(scheduleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating maintenance schedule:', error);
      throw new Error('Failed to create maintenance schedule');
    }
  }

  static async getServiceHistory(vehicleId: string): Promise<ServiceLog[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_service_logs')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('service_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching service history:', error);
      throw new Error('Failed to fetch service history');
    }
  }

  static async addServiceRecord(serviceData: ServiceLogInsert): Promise<ServiceLog> {
    try {
      const { data, error } = await supabase
        .from('vehicle_service_logs')
        .insert(serviceData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding service record:', error);
      throw new Error('Failed to add service record');
    }
  }

  // Fuel Operations
  static async getFuelLogs(vehicleId: string, limit: number = 50): Promise<FuelLog[]> {
    try {
      const { data, error } = await supabase
        .from('vehicle_fuel_logs')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('fill_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching fuel logs:', error);
      throw new Error('Failed to fetch fuel logs');
    }
  }

  static async addFuelLog(fuelData: FuelLogInsert): Promise<FuelLog> {
    try {
      const { data, error } = await supabase
        .from('vehicle_fuel_logs')
        .insert(fuelData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding fuel log:', error);
      throw new Error('Failed to add fuel log');
    }
  }

  static async calculateFuelEfficiency(vehicleId: string, days: number = 30) {
    try {
      const { data: fuelLogs, error } = await supabase
        .from('vehicle_fuel_logs')
        .select('fuel_amount, mileage, fill_date')
        .eq('vehicle_id', vehicleId)
        .gte('fill_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('fill_date', { ascending: true });

      if (error) throw error;

      if (!fuelLogs || fuelLogs.length < 2) {
        return { efficiency: 0, totalFuel: 0, totalDistance: 0 };
      }

      const totalFuel = fuelLogs.reduce((sum, log) => sum + (log.fuel_amount || 0), 0);
      const totalDistance = (fuelLogs[fuelLogs.length - 1].mileage || 0) - (fuelLogs[0].mileage || 0);
      const efficiency = totalDistance > 0 ? (totalFuel / totalDistance) * 100 : 0; // L/100km

      return {
        efficiency: parseFloat(efficiency.toFixed(2)),
        totalFuel: parseFloat(totalFuel.toFixed(2)),
        totalDistance
      };
    } catch (error) {
      console.error('Error calculating fuel efficiency:', error);
      throw new Error('Failed to calculate fuel efficiency');
    }
  }

  // Vehicle Statistics
  static async getVehicleStatistics(vehicleId: string) {
    try {
      const [fuelLogs, serviceLogs, maintenanceSchedules] = await Promise.all([
        this.getFuelLogs(vehicleId, 100),
        this.getServiceHistory(vehicleId),
        this.getMaintenanceSchedules(vehicleId)
      ]);

      const fuelStats = await this.calculateFuelEfficiency(vehicleId);

      const totalFuelCost = fuelLogs.reduce((sum, log) => sum + (log.fuel_cost || 0), 0);
      const totalServiceCost = serviceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

      const lastService = serviceLogs[0];
      const upcomingMaintenance = maintenanceSchedules.filter(schedule =>
        schedule.next_due_date && new Date(schedule.next_due_date) > new Date()
      );

      return {
        fuelEfficiency: fuelStats.efficiency,
        totalFuelCost,
        totalServiceCost,
        totalOperatingCost: totalFuelCost + totalServiceCost,
        lastServiceDate: lastService?.service_date,
        upcomingMaintenanceCount: upcomingMaintenance.length,
        nextMaintenanceDue: upcomingMaintenance[0]?.next_due_date,
        totalMiles: fuelStats.totalDistance,
        totalFuelUsed: fuelStats.totalFuel
      };
    } catch (error) {
      console.error('Error calculating vehicle statistics:', error);
      throw new Error('Failed to calculate vehicle statistics');
    }
  }

  // Photo Operations
  static async uploadVehiclePhoto(
    vehicleId: string,
    file: File,
    photoType: 'exterior' | 'interior' | 'engine' | 'damage' | 'modification' = 'exterior'
  ): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicleId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicles')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save metadata
      const { error: metadataError } = await supabase
        .from('vehicle_photos')
        .insert({
          vehicle_id: vehicleId,
          file_path: fileName,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
          photo_type: photoType
        });

      if (metadataError) throw metadataError;

      // Get public URL
      const { data } = supabase.storage
        .from('vehicles')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading vehicle photo:', error);
      throw new Error('Failed to upload vehicle photo');
    }
  }

  static async getVehiclePhotos(vehicleId: string) {
    try {
      const { data, error } = await supabase
        .from('vehicle_photos')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      return data?.map(photo => ({
        ...photo,
        url: supabase.storage.from('vehicles').getPublicUrl(photo.file_path).data.publicUrl
      })) || [];
    } catch (error) {
      console.error('Error fetching vehicle photos:', error);
      throw new Error('Failed to fetch vehicle photos');
    }
  }
}

// Default export for backwards compatibility
export default VehicleService;