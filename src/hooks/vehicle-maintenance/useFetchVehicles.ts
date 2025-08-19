
import { useState, useEffect, useCallback } from "react";
import { supabase } from '@/lib/supabase-client';
import { Vehicle } from "./types";

export const useFetchVehicles = (userId?: string) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicles = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      
      console.log("Fetching vehicles for user:", userId);
      
      // Use a more resilient fetch approach with retries
      const fetchWithRetry = async (retries = 3, delay = 1000) => {
        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            // First try to get vehicles from the vehicles table
            const { data: vehiclesData, error: fetchError } = await supabase
              .from('vehicles')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false });

            if (fetchError) {
              if (attempt < retries - 1) {
                console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
              }
              throw fetchError;
            }
            
            return vehiclesData;
          } catch (err) {
            if (attempt < retries - 1) {
              console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
            } else {
              throw err;
            }
          }
        }
      };
      
      try {
        // Try to fetch vehicles with retry
        const vehiclesData = await fetchWithRetry();
        
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
            // Handle offline/network errors gracefully for profile fetch
            if (profileErr instanceof Error && profileErr.message.includes('Failed to fetch')) {
              // Create a fallback vehicle if we're offline
              const fallbackVehicle: Vehicle = {
                id: `fallback-${userId}`,
                user_id: userId,
                name: `My Unimog`,
                model: "U1700L", // Fallback to a default model
                year: "Unknown",
                current_odometer: 0,
                odometer_unit: "km",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setVehicles([fallbackVehicle]);
              console.log("Network error, created fallback vehicle:", fallbackVehicle);
            } else {
              console.error("Error processing profile data:", profileErr);
              setVehicles([]);
            }
          }
        } else {
          console.log("Found vehicles in vehicles table:", vehiclesData.length);
          console.log("Vehicle data:", vehiclesData);
          setVehicles(vehiclesData as Vehicle[]);
        }
        
        setError(null);
      } catch (err) {
        // Special handling for network errors with fallback
        if (err instanceof Error && err.message.includes('Failed to fetch')) {
          console.log("Network error detected, creating fallback vehicle");
          const fallbackVehicle: Vehicle = {
            id: `fallback-${userId}`,
            user_id: userId,
            name: `My Unimog`,
            model: "U1700L", // Fallback to a default model
            year: "Unknown",
            current_odometer: 0,
            odometer_unit: "km",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setVehicles([fallbackVehicle]);
          
          // Don't set error for network issues since we have fallback
          // This prevents the error UI from showing
          setError(null);
          
          // Silent console log instead of toast
          console.log("Using fallback vehicle data while offline");
        } else {
          // Don't show error toast for network issues
          console.error('Error loading vehicles:', err);
          setError(null); // Don't set error to prevent UI error display
          
          // Create fallback vehicle even for other errors
          const fallbackVehicle: Vehicle = {
            id: `fallback-${userId}`,
            user_id: userId,
            name: `My Unimog`,
            model: "U1700L",
            year: "Unknown",
            current_odometer: 0,
            odometer_unit: "km",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setVehicles([fallbackVehicle]);
        }
      }
    } catch (err) {
      console.error("Outer error loading vehicles:", err);
      
      setError(err instanceof Error ? err : new Error('Failed to load vehicles'));
      
      // Try to provide fallback data even on unexpected errors
      if (vehicles.length === 0) {
        const fallbackVehicle: Vehicle = {
          id: `error-fallback-${userId}`,
          user_id: userId,
          name: `My Unimog`,
          model: "U1700L", // Fallback to a default model
          year: "Unknown",
          current_odometer: 0,
          odometer_unit: "km",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setVehicles([fallbackVehicle]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Only fetch when userId is available
    if (userId) {
      fetchVehicles();
    } else {
      setIsLoading(false);
      setVehicles([]);
    }
  }, [userId]); // Remove fetchVehicles from dependencies to prevent infinite loop

  return {
    vehicles,
    isLoading,
    error,
    refetchVehicles: fetchVehicles,
    setVehicles
  };
};
