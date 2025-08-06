import { supabase } from '@/integrations/supabase/client';
import { ParsedTrack } from '@/utils/gpxParser';
import { toast } from 'sonner';

/**
 * Save an uploaded track to Supabase
 */
export async function saveTrack(parsedTrack: ParsedTrack, userId: string) {
  try {
    // Convert track points to segments format for storage
    const segments = {
      points: parsedTrack.points,
      bounds: parsedTrack.bounds
    };

    const { data, error } = await supabase
      .from('tracks')
      .insert({
        name: parsedTrack.name,
        segments: segments,
        distance_km: parsedTrack.totalDistance,
        source_type: 'gpx_upload',
        created_by: userId,
        is_public: false,
        visible: true,
        description: `Uploaded track: ${parsedTrack.name}`,
        difficulty: 'moderate' // Default, can be updated later
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving track:', error);
      toast.error('Failed to save track');
      return null;
    }

    toast.success('Track saved successfully');
    return data;
  } catch (error) {
    console.error('Error saving track:', error);
    toast.error('Failed to save track');
    return null;
  }
}

/**
 * Fetch user's tracks from Supabase
 */
export async function fetchUserTracks(userId: string) {
  try {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracks:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
}

/**
 * Fetch nearby public tracks
 */
export async function fetchNearbyTracks(lat: number, lon: number, radiusKm: number = 50) {
  try {
    // For now, fetch all public tracks
    // In production, you'd want to use PostGIS for proper geographic queries
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('is_public', true)
      .limit(20);

    if (error) {
      console.error('Error fetching nearby tracks:', error);
      return [];
    }

    // Filter by distance in the frontend for now
    // In production, use PostGIS ST_DWithin or similar
    return data || [];
  } catch (error) {
    console.error('Error fetching nearby tracks:', error);
    return [];
  }
}

/**
 * Delete a track
 */
export async function deleteTrack(trackId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('tracks')
      .delete()
      .eq('id', trackId)
      .eq('created_by', userId); // Ensure user owns the track

    if (error) {
      console.error('Error deleting track:', error);
      toast.error('Failed to delete track');
      return false;
    }

    toast.success('Track deleted');
    return true;
  } catch (error) {
    console.error('Error deleting track:', error);
    toast.error('Failed to delete track');
    return false;
  }
}

/**
 * Update track visibility
 */
export async function updateTrackVisibility(trackId: string, visible: boolean, userId: string) {
  try {
    const { error } = await supabase
      .from('tracks')
      .update({ visible })
      .eq('id', trackId)
      .eq('created_by', userId);

    if (error) {
      console.error('Error updating track visibility:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating track visibility:', error);
    return false;
  }
}

/**
 * Convert a track to a trip
 */
export async function convertTrackToTrip(trackId: string, userId: string) {
  try {
    // First get the track
    const { data: track, error: trackError } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', trackId)
      .eq('created_by', userId)
      .single();

    if (trackError || !track) {
      toast.error('Track not found');
      return null;
    }

    // Create a trip from the track
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        name: track.name,
        description: track.description || `Trip created from track: ${track.name}`,
        created_by: userId,
        is_public: false
      })
      .select()
      .single();

    if (tripError) {
      console.error('Error creating trip:', tripError);
      toast.error('Failed to create trip');
      return null;
    }

    // Update the track to link it to the trip
    await supabase
      .from('tracks')
      .update({ trip_id: trip.id })
      .eq('id', trackId);

    toast.success('Track saved as trip');
    return trip;
  } catch (error) {
    console.error('Error converting track to trip:', error);
    toast.error('Failed to save as trip');
    return null;
  }
}