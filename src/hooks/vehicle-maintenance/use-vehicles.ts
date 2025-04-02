
import { useState, useEffect, useCallback } from "react";
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

  const fetchVehicles = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      
      console.log("Fetching vehicles for user:", userId);
      
      // First try to get vehicles from the vehicles table
      const { data: vehiclesData, error: fetchError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error("Error fetching from vehicles table:", fetchError);
        throw fetchError;
      }
      
      // If no vehicles in the vehicles table, check the profile for vehicle info
      if (!vehiclesData || vehiclesData.length === 0) {
        console.log("No vehicles found in vehicles table, checking profile");
        
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('unimog_model, unimog_year')
            .eq('id', userId)
            .maybeSingle(); // Use maybeSingle instead of single
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            throw profileError;
          }
          
          // If profile has vehicle data, create a virtual vehicle entry
          if (profileData && profileData.unimog_model) {
            console.log("Found vehicle in profile:", profileData);
            const profileVehicle: Vehicle = {
              id: `profile-${userId}`,
              user_id: userId,
              name: `My ${profileData.unimog_model}`,
              model: profileData.unimog_model,
              year: profileData.unimog_year || "Unknown", // Default year if not specified
              current_odometer: 0,
              odometer_unit: "km",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            setVehicles([profileVehicle]);
            console.log("Created virtual vehicle from profile:", profileVehicle);
          } else {
            console.log("No vehicle data found in profile either");
            setVehicles([]);
          }
        } catch (profileErr) {
          console.error("Error processing profile data:", profileErr);
          // Don't throw here, just log and continue with empty vehicles
          setVehicles([]);
        }
      } else {
        console.log("Found vehicles in vehicles table:", vehiclesData.length);
        setVehicles(vehiclesData as Vehicle[]);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error loading vehicles:", err);
      
      // Special handling for network-related errors
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        const networkError = new Error('Network connection issue. Please check your internet connection.');
        setError(networkError);
        
        handleError(err, {
          context: 'Loading vehicles',
          showToast: false, // Don't show toast here, we'll handle display in the UI
        });
      } else {
        // Handle other errors
        handleError(err, {
          context: 'Loading vehicles',
          showToast: false, // Don't show toast here, we'll handle display in the UI
        });
        setError(err instanceof Error ? err : new Error('Failed to load vehicles'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, handleError]);

  useEffect(() => {
    // Only fetch when userId is available
    if (userId) {
      fetchVehicles();
    } else {
      setIsLoading(false);
      setVehicles([]);
    }
  }, [fetchVehicles, userId]);

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
      
      // Update local state
      if (data && data[0]) {
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
  };

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      
      if (data && data[0]) {
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
    refetchVehicles: fetchVehicles, // Add refetchVehicles function to allow manual refetching
  };
};
