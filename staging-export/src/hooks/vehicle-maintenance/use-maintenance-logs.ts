
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { MaintenanceLog } from "./types";

export const useMaintenanceLogs = () => {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

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

  return {
    getMaintenanceLogs,
    addMaintenanceLog,
    updateMaintenanceLog,
    deleteMaintenanceLog
  };
};
