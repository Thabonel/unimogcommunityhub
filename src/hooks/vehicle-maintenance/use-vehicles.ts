
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { Vehicle } from "./types";

export const useVehicles = (userId?: string) => {
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

  return {
    vehicles,
    isLoading,
    error,
    addVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
