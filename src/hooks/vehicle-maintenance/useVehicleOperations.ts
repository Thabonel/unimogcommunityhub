
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useToast } from "@/hooks/use-toast";
import { Vehicle } from "./types";

export const useVehicleOperations = (userId?: string, setVehicles?: (vehicles: Vehicle[]) => void) => {
  const { handleError } = useErrorHandler();
  const { toast } = useToast();

  const addVehicle = useCallback(async (vehicle: Omit<Vehicle, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
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
      
      // Update local state
      if (data && data[0] && setVehicles) {
        setVehicles(prev => [...prev, data[0] as Vehicle]);
        
        toast({
          title: 'Vehicle added',
          description: `${vehicle.name} has been added to your garage`
        });
        
        return data[0] as Vehicle;
      } else {
        throw new Error('No data returned after adding vehicle');
      }
    } catch (err) {
      handleError(err, {
        context: 'Adding vehicle',
        showToast: true,
      });
      throw err;
    }
  }, [userId, setVehicles, handleError, toast]);

  const updateVehicle = useCallback(async (id: string, updates: Partial<Vehicle>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      
      if (data && data[0] && setVehicles) {
        setVehicles(prev => 
          prev.map(vehicle => vehicle.id === id ? { ...vehicle, ...data[0] } as Vehicle : vehicle)
        );
        
        toast({
          title: 'Vehicle updated',
          description: `Vehicle information has been updated`
        });
        
        return data[0] as Vehicle;
      } else {
        throw new Error('No data returned after updating vehicle');
      }
    } catch (err) {
      handleError(err, {
        context: 'Updating vehicle',
        showToast: true,
      });
      throw err;
    }
  }, [setVehicles, handleError, toast]);

  const deleteVehicle = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      if (setVehicles) {
        setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
        
        toast({
          title: 'Vehicle removed',
          description: `Vehicle has been removed from your garage`
        });
      }
      
      return true;
    } catch (err) {
      handleError(err, {
        context: 'Removing vehicle',
        showToast: true,
      });
      throw err;
    }
  }, [setVehicles, handleError, toast]);

  return {
    addVehicle,
    updateVehicle,
    deleteVehicle
  };
};
