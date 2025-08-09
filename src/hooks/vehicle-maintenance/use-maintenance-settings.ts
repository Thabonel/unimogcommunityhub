
import { supabase } from '@/lib/supabase-client';
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { MaintenanceNotificationSettings } from "./types";

export const useMaintenanceSettings = () => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

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
    getMaintenanceSettings,
    saveMaintenanceSettings
  };
};
