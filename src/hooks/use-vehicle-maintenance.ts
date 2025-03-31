
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";

export type MaintenanceType = 
  | "oil_change" 
  | "tire_rotation" 
  | "brake_service"
  | "inspection" 
  | "repair" 
  | "modification"
  | "fluid_change"
  | "filter_replacement"
  | "other";

export interface Vehicle {
  id: string;
  user_id: string;
  name: string;
  model: string;
  year: string;
  vin?: string;
  license_plate?: string;
  current_odometer: number;
  odometer_unit: "km" | "mi";
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
}

export interface MaintenanceLog {
  id: string;
  vehicle_id: string;
  maintenance_type: MaintenanceType;
  date: string;
  odometer: number;
  cost?: number;
  currency: string;
  notes?: string;
  completed_by?: string;
  location?: string;
  parts_replaced?: string[];
  created_at: string;
  updated_at: string;
}

export interface MaintenanceAlert {
  id: string;
  vehicle_id: string;
  maintenance_type: MaintenanceType;
  due_date?: string;
  due_odometer?: number;
  is_overdue: boolean;
  description: string;
}

export interface MaintenanceNotificationSettings {
  id: string;
  vehicle_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: 'daily' | 'weekly' | 'monthly';
  phone_number?: string;
}

export const useVehicleMaintenance = (userId?: string) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setVehicles(data as Vehicle[]);
      } catch (err) {
        handleError(err, {
          context: 'Loading vehicles',
          showToast: true,
        });
        setError(err instanceof Error ? err : new Error('Failed to load vehicles'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [userId, handleError]);

  const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!userId) throw new Error('User not authenticated');
      
      const { data, error: addError } = await supabase
        .from('vehicles')
        .insert([
          { 
            ...vehicle,
            user_id: userId,
          }
        ])
        .select();

      if (addError) throw addError;
      
      setVehicles(prev => [...prev, data[0] as Vehicle]);
      
      toast({
        title: 'Vehicle added',
        description: `${vehicle.name} has been added to your garage`
      });
      
      return data[0] as Vehicle;
    } catch (err) {
      handleError(err, {
        context: 'Adding vehicle',
        showToast: true,
      });
      throw err;
    }
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      
      setVehicles(prev => 
        prev.map(vehicle => vehicle.id === id ? { ...vehicle, ...data[0] } as Vehicle : vehicle)
      );
      
      toast({
        title: 'Vehicle updated',
        description: `Vehicle information has been updated`
      });
      
      return data[0] as Vehicle;
    } catch (err) {
      handleError(err, {
        context: 'Updating vehicle',
        showToast: true,
      });
      throw err;
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
      
      toast({
        title: 'Vehicle removed',
        description: `Vehicle has been removed from your garage`
      });
      
      return true;
    } catch (err) {
      handleError(err, {
        context: 'Removing vehicle',
        showToast: true,
      });
      throw err;
    }
  };

  const getMaintenanceLogs = async (vehicleId: string) => {
    try {
      const { data, error: logsError } = await supabase
        .from('maintenance_logs')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .order('date', { ascending: false });

      if (logsError) throw logsError;
      
      return data as MaintenanceLog[];
    } catch (err) {
      handleError(err, {
        context: 'Loading maintenance logs',
        showToast: true,
      });
      throw err;
    }
  };

  const addMaintenanceLog = async (log: Omit<MaintenanceLog, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: addLogError } = await supabase
        .from('maintenance_logs')
        .insert([log])
        .select();

      if (addLogError) throw addLogError;
      
      toast({
        title: 'Maintenance log added',
        description: `A new maintenance record has been saved`
      });
      
      return data[0] as MaintenanceLog;
    } catch (err) {
      handleError(err, {
        context: 'Adding maintenance log',
        showToast: true,
      });
      throw err;
    }
  };

  const updateMaintenanceLog = async (id: string, updates: Partial<MaintenanceLog>) => {
    try {
      const { data, error: updateLogError } = await supabase
        .from('maintenance_logs')
        .update(updates)
        .eq('id', id)
        .select();

      if (updateLogError) throw updateLogError;
      
      toast({
        title: 'Maintenance log updated',
        description: `The maintenance record has been updated`
      });
      
      return data[0] as MaintenanceLog;
    } catch (err) {
      handleError(err, {
        context: 'Updating maintenance log',
        showToast: true,
      });
      throw err;
    }
  };

  const deleteMaintenanceLog = async (id: string) => {
    try {
      const { error: deleteLogError } = await supabase
        .from('maintenance_logs')
        .delete()
        .eq('id', id);

      if (deleteLogError) throw deleteLogError;
      
      toast({
        title: 'Maintenance log deleted',
        description: `The maintenance record has been deleted`
      });
      
      return true;
    } catch (err) {
      handleError(err, {
        context: 'Deleting maintenance log',
        showToast: true,
      });
      throw err;
    }
  };

  const getMaintenanceSettings = async (vehicleId: string) => {
    try {
      const { data, error: settingsError } = await supabase
        .from('maintenance_notification_settings')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      return data as MaintenanceNotificationSettings;
    } catch (err) {
      handleError(err, {
        context: 'Loading maintenance settings',
        showToast: true,
      });
      throw err;
    }
  };

  const saveMaintenanceSettings = async (settings: MaintenanceNotificationSettings) => {
    try {
      let response;
      
      if (settings.id) {
        // Update existing settings
        response = await supabase
          .from('maintenance_notification_settings')
          .update({
            email_notifications: settings.email_notifications,
            sms_notifications: settings.sms_notifications,
            notification_frequency: settings.notification_frequency,
            phone_number: settings.phone_number
          })
          .eq('id', settings.id)
          .select();
      } else {
        // Create new settings
        response = await supabase
          .from('maintenance_notification_settings')
          .insert([{
            vehicle_id: settings.vehicle_id,
            email_notifications: settings.email_notifications,
            sms_notifications: settings.sms_notifications,
            notification_frequency: settings.notification_frequency,
            phone_number: settings.phone_number
          }])
          .select();
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: 'Settings saved',
        description: 'Your maintenance notification settings have been saved'
      });
      
      return response.data[0] as MaintenanceNotificationSettings;
    } catch (err) {
      handleError(err, {
        context: 'Saving maintenance settings',
        showToast: true,
      });
      throw err;
    }
  };

  return {
    vehicles,
    isLoading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getMaintenanceLogs,
    addMaintenanceLog,
    updateMaintenanceLog,
    deleteMaintenanceLog,
    getMaintenanceSettings,
    saveMaintenanceSettings
  };
};
