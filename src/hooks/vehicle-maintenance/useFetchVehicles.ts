
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { Vehicle } from "./types";

export const useFetchVehicles = (userId?: string) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
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
          showToast: false,
        });
      } else {
        handleError(err, {
          context: 'Loading vehicles',
          showToast: false,
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

  return {
    vehicles,
    isLoading,
    error,
    refetchVehicles: fetchVehicles,
    setVehicles
  };
};
