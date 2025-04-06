
import { supabase } from '@/lib/supabase';
import { Trip, Coordinates } from '@/types/trip';
import { toast } from 'sonner';

// Fetch all trips for the current user
export async function fetchTrips(): Promise<Trip[]> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    // Convert database trips to Trip interface
    return data.map(trip => ({
      id: trip.id,
      title: trip.name,
      description: trip.description || '',
      image_url: trip.image_url,
      start_date: trip.start_date,
      end_date: trip.end_date,
      created_by: trip.created_by,
      is_public: trip.is_public,
      // Add other fields with default values
      start_location: null,
      end_location: null,
      difficulty: 'beginner',
      distance: 0,
      duration: 0,
      terrain_types: [],
    }));
  } catch (error) {
    console.error('Error fetching trips:', error);
    throw error;
  }
}

// Fetch a single trip by ID
export async function fetchTripById(tripId: string): Promise<Trip | null> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Convert to Trip interface
    return {
      id: data.id,
      title: data.name,
      description: data.description || '',
      image_url: data.image_url,
      start_date: data.start_date,
      end_date: data.end_date,
      created_by: data.created_by,
      is_public: data.is_public,
      // Add other fields with default values
      start_location: null,
      end_location: null,
      difficulty: 'beginner',
      distance: 0,
      duration: 0,
      terrain_types: [],
    };
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
}

// Create a new trip
export async function createTrip(tripData: Partial<Trip>): Promise<Trip | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('You must be logged in to create a trip');
      return null;
    }
    
    const { data, error } = await supabase
      .from('trips')
      .insert({
        name: tripData.title,
        description: tripData.description,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        created_by: user.id,
        is_public: tripData.is_public || false,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Convert to Trip interface
    return {
      id: data.id,
      title: data.name,
      description: data.description || '',
      image_url: data.image_url,
      start_date: data.start_date,
      end_date: data.end_date,
      created_by: data.created_by,
      is_public: data.is_public,
      // Add other fields with default values
      start_location: null,
      end_location: null,
      difficulty: 'beginner',
      distance: 0,
      duration: 0,
      terrain_types: [],
    };
  } catch (error) {
    console.error('Error creating trip:', error);
    return null;
  }
}

// Update an existing trip
export async function updateTrip(tripId: string, tripData: Partial<Trip>): Promise<Trip | null> {
  try {
    const { data, error } = await supabase
      .from('trips')
      .update({
        name: tripData.title,
        description: tripData.description,
        start_date: tripData.start_date,
        end_date: tripData.end_date,
        is_public: tripData.is_public,
      })
      .eq('id', tripId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Convert to Trip interface
    return {
      id: data.id,
      title: data.name,
      description: data.description || '',
      image_url: data.image_url,
      start_date: data.start_date,
      end_date: data.end_date,
      created_by: data.created_by,
      is_public: data.is_public,
      // Add other fields with default values
      start_location: null,
      end_location: null,
      difficulty: 'beginner',
      distance: 0,
      duration: 0,
      terrain_types: [],
    };
  } catch (error) {
    console.error('Error updating trip:', error);
    return null;
  }
}

// Delete a trip
export async function deleteTrip(tripId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return false;
  }
}
