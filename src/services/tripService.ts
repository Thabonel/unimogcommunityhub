
import { supabase } from "@/integrations/supabase/client";
import { Trip } from "@/types/trip";
import { toast } from "sonner";

export async function fetchTrips() {
  try {
    // Make sure the trips table is defined in Supabase
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trips:", error);
      toast.error("Failed to load trips");
      return [];
    }

    return data as Trip[];
  } catch (err) {
    console.error("Error in fetchTrips:", err);
    toast.error("Something went wrong while loading trips");
    return [];
  }
}

export async function fetchTripById(tripId: string) {
  try {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();

    if (error) {
      console.error("Error fetching trip:", error);
      toast.error("Failed to load trip details");
      return null;
    }

    return data as Trip;
  } catch (err) {
    console.error("Error in fetchTripById:", err);
    toast.error("Something went wrong while loading trip details");
    return null;
  }
}

export async function createTrip(tripData: Partial<Trip>) {
  try {
    const userResponse = await supabase.auth.getUser();
    
    if (!userResponse.data.user) {
      toast.error("You must be logged in to create a trip");
      return null;
    }

    const { data, error } = await supabase
      .from("trips")
      .insert([{ ...tripData, created_by: userResponse.data.user.id }])
      .select()
      .single();

    if (error) {
      console.error("Error creating trip:", error);
      toast.error("Failed to create trip");
      return null;
    }

    toast.success("Trip created successfully");
    return data as Trip;
  } catch (err) {
    console.error("Error in createTrip:", err);
    toast.error("Something went wrong while creating the trip");
    return null;
  }
}

export async function updateTrip(tripId: string, tripData: Partial<Trip>) {
  try {
    const { data, error } = await supabase
      .from("trips")
      .update(tripData)
      .eq("id", tripId)
      .select()
      .single();

    if (error) {
      console.error("Error updating trip:", error);
      toast.error("Failed to update trip");
      return null;
    }

    toast.success("Trip updated successfully");
    return data as Trip;
  } catch (err) {
    console.error("Error in updateTrip:", err);
    toast.error("Something went wrong while updating the trip");
    return null;
  }
}

export async function deleteTrip(tripId: string) {
  try {
    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId);

    if (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip");
      return false;
    }

    toast.success("Trip deleted successfully");
    return true;
  } catch (err) {
    console.error("Error in deleteTrip:", err);
    toast.error("Something went wrong while deleting the trip");
    return false;
  }
}

export async function saveTripCoordinates(
  tripId: string, 
  coordinatesData: { 
    coordinates: any[], 
    sequenceNumber: number 
  }
) {
  try {
    const { error } = await supabase
      .from("trip_coordinates")
      .insert([{ 
        trip_id: tripId, 
        coordinates: coordinatesData.coordinates,
        sequence_number: coordinatesData.sequenceNumber
      }]);

    if (error) {
      console.error("Error saving trip coordinates:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in saveTripCoordinates:", err);
    return false;
  }
}

export async function fetchTripCoordinates(tripId: string) {
  try {
    const { data, error } = await supabase
      .from("trip_coordinates")
      .select("*")
      .eq("trip_id", tripId)
      .order("sequence_number", { ascending: true });

    if (error) {
      console.error("Error fetching trip coordinates:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error in fetchTripCoordinates:", err);
    return [];
  }
}

export async function saveTripComment(tripId: string, content: string) {
  try {
    const userResponse = await supabase.auth.getUser();
    
    if (!userResponse.data.user) {
      toast.error("You must be logged in to comment");
      return null;
    }

    const { data, error } = await supabase
      .from("trip_comments")
      .insert([{ 
        trip_id: tripId, 
        user_id: userResponse.data.user.id,
        content 
      }])
      .select()
      .single();

    if (error) {
      console.error("Error saving comment:", error);
      toast.error("Failed to save comment");
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error in saveTripComment:", err);
    toast.error("Something went wrong while saving the comment");
    return null;
  }
}

export async function fetchTripComments(tripId: string) {
  try {
    const { data, error } = await supabase
      .from("trip_comments")
      .select(`
        *,
        profiles:user_id (
          display_name,
          full_name,
          avatar_url
        )
      `)
      .eq("trip_id", tripId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return [];
    }

    // Transform the data to match the expected format
    return data.map((comment: any) => ({
      ...comment,
      user: comment.profiles
    }));
  } catch (err) {
    console.error("Error in fetchTripComments:", err);
    return [];
  }
}

export async function saveTripEmergencyAlert(
  tripId: string, 
  alertData: {
    alert_type: string;
    severity: string;
    title: string;
    description?: string;
    coordinates?: any;
    issued_at: string;
    expires_at?: string;
    source?: string;
  }
) {
  try {
    const { error } = await supabase
      .from("trip_emergency_alerts")
      .insert([{ 
        trip_id: tripId,
        ...alertData
      }]);

    if (error) {
      console.error("Error saving emergency alert:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in saveTripEmergencyAlert:", err);
    return false;
  }
}

export async function fetchTripEmergencyAlerts(tripId: string) {
  try {
    const { data, error } = await supabase
      .from("trip_emergency_alerts")
      .select("*")
      .eq("trip_id", tripId)
      .order("issued_at", { ascending: false });

    if (error) {
      console.error("Error fetching emergency alerts:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error in fetchTripEmergencyAlerts:", err);
    return [];
  }
}

export async function saveTripWeatherData(
  tripId: string,
  weatherData: any,
  forecastDate: string
) {
  try {
    const { error } = await supabase
      .from("trip_weather_data")
      .insert([{
        trip_id: tripId,
        weather_data: weatherData,
        forecast_date: forecastDate
      }]);

    if (error) {
      console.error("Error saving weather data:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Error in saveTripWeatherData:", err);
    return false;
  }
}

export async function fetchTripWeatherData(tripId: string) {
  try {
    const { data, error } = await supabase
      .from("trip_weather_data")
      .select("*")
      .eq("trip_id", tripId)
      .order("forecast_date", { ascending: true });

    if (error) {
      console.error("Error fetching weather data:", error);
      return [];
    }

    return data;
  } catch (err) {
    console.error("Error in fetchTripWeatherData:", err);
    return [];
  }
}
