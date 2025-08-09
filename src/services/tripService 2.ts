
import { supabase } from '@/lib/supabase-client';
import { Trip, Coordinates } from '@/types/trip';
import { toast } from 'sonner';

// Fetch all trips for the current user
export async function fetchTrips(): Promise<Trip[]> {
  try {
    console.log('Fetching trips from Supabase');
    
    // Get the current user first
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user found when fetching trips');
      return [];
    }
    
    // Fetch trips for the current user
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error when fetching trips:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} trips for user ${user.id}`);
    
    // Convert database trips to Trip interface
    return (data || []).map(trip => ({
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
  } catch (error: any) {
    console.error('Error fetching trips:', error);
    toast.error('Failed to load trips: ' + (error.message || 'Unknown error'));
    return [];
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
      console.error('Error fetching trip by ID:', error);
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
  } catch (error: any) {
    console.error('Error fetching trip:', error);
    toast.error('Failed to load trip: ' + (error.message || 'Unknown error'));
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
      console.error('Error creating trip:', error);
      throw error;
    }
    
    toast.success('Trip created successfully');
    
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
  } catch (error: any) {
    console.error('Error creating trip:', error);
    toast.error('Failed to create trip: ' + (error.message || 'Unknown error'));
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
      console.error('Error updating trip:', error);
      throw error;
    }
    
    toast.success('Trip updated successfully');
    
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
  } catch (error: any) {
    console.error('Error updating trip:', error);
    toast.error('Failed to update trip: ' + (error.message || 'Unknown error'));
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
      console.error('Error deleting trip:', error);
      throw error;
    }
    
    toast.success('Trip deleted successfully');
    return true;
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    toast.error('Failed to delete trip: ' + (error.message || 'Unknown error'));
    return false;
  }
}
