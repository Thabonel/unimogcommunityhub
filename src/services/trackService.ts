import { supabase } from '@/lib/supabase-client';
import { ParsedTrack } from '@/utils/gpxParser';
import { toast } from 'sonner';
import { Waypoint } from '@/types/waypoint';
import { DirectionsRoute } from './mapboxDirections';
import { generateUniqueRouteName, generateRouteDescription } from '@/utils/routeNameGenerator';

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
 * Save a planned route from waypoints
 */
export async function savePlannedRoute(
  waypoints: Waypoint[],
  route: DirectionsRoute | null,
  userId: string,
  routeProfile: 'driving' | 'walking' | 'cycling' = 'driving',
  additionalData?: {
    name?: string;
    description?: string;
    difficulty?: string;
    isPublic?: boolean;
    imageUrl?: string;
    notes?: string;
  }
) {
  console.log('🚀 savePlannedRoute called with:', {
    waypointsCount: waypoints.length,
    routeExists: !!route,
    userId,
    routeProfile,
    additionalData
  });

  try {
    if (waypoints.length < 2 && !route) {
      console.error('❌ Insufficient waypoints and no route:', waypoints.length);
      toast.error('Need at least 2 waypoints or a calculated route to save');
      return null;
    }

    console.log('✅ Route validation passed');

    // Use provided name/description or generate defaults
    const routeName = additionalData?.name || generateUniqueRouteName(
      waypoints,
      route?.distance,
      routeProfile
    );
    
    const routeDescription = additionalData?.description || generateRouteDescription(
      waypoints,
      route?.distance,
      route?.duration,
      routeProfile
    );

    console.log('📝 Generated route details:', {
      routeName,
      routeDescription: routeDescription.substring(0, 100) + '...',
      difficulty: additionalData?.difficulty || 'moderate',
      isPublic: additionalData?.isPublic ?? false
    });

    // Convert waypoints and route to track format
    const points = route?.geometry?.coordinates 
      ? route.geometry.coordinates.map((coord: [number, number], index: number) => ({
          lat: coord[1],
          lon: coord[0],
          ele: 0, // Elevation not available from Directions API
          time: new Date().toISOString()
        }))
      : waypoints.map(wp => ({
          lat: wp.coords[1],
          lon: wp.coords[0],
          ele: 0,
          time: new Date().toISOString()
        }));

    // Calculate bounds with validation
    console.log('🗂️ Calculating bounds from points:', points.length);
    
    // Validate points array
    if (!points || points.length === 0) {
      console.error('❌ No points available for bounds calculation');
      throw new Error('Cannot save route: no coordinate points available');
    }
    
    // Filter valid coordinates only
    const validPoints = points.filter(p => 
      p && 
      typeof p.lat === 'number' && !isNaN(p.lat) && 
      typeof p.lon === 'number' && !isNaN(p.lon) &&
      p.lat >= -90 && p.lat <= 90 &&
      p.lon >= -180 && p.lon <= 180
    );
    
    console.log('✅ Valid points after filtering:', validPoints.length, 'of', points.length);
    
    if (validPoints.length === 0) {
      console.error('❌ No valid coordinates found in points');
      throw new Error('Cannot save route: all coordinate points are invalid');
    }
    
    const lats = validPoints.map(p => p.lat);
    const lons = validPoints.map(p => p.lon);
    
    const bounds = {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLon: Math.min(...lons),
      maxLon: Math.max(...lons)
    };
    
    // Final bounds validation
    const isValidBounds = bounds &&
      typeof bounds.minLat === 'number' && !isNaN(bounds.minLat) &&
      typeof bounds.maxLat === 'number' && !isNaN(bounds.maxLat) &&
      typeof bounds.minLon === 'number' && !isNaN(bounds.minLon) &&
      typeof bounds.maxLon === 'number' && !isNaN(bounds.maxLon);
    
    if (!isValidBounds) {
      console.error('❌ Calculated bounds are invalid:', bounds);
      throw new Error('Cannot save route: calculated bounds are invalid');
    }
    
    console.log('🌍 Calculated valid bounds:', bounds);

    // Create segments object
    const segments = {
      points,
      bounds,
      waypoints: waypoints.map(wp => ({
        name: wp.name,
        coords: wp.coords,
        type: wp.type
      }))
    };

    // Save to database
    console.log('💾 Attempting to save to database...');
    
    const insertData = {
      name: routeName,
      segments: segments,
      distance_km: route ? route.distance / 1000 : 0,
      source_type: 'route_planner',
      created_by: userId,
      is_public: additionalData?.isPublic ?? false,
      visible: true,
      description: routeDescription,
      difficulty: additionalData?.difficulty || 'moderate',
      metadata: {
        profile: routeProfile,
        duration_seconds: route?.duration,
        waypoint_count: waypoints.length,
        created_with: 'route_planner',
        image_url: additionalData?.imageUrl,
        notes: additionalData?.notes
      }
    };
    
    console.log('📊 Insert data prepared:', {
      ...insertData,
      segments: `${segments.points.length} points, ${Object.keys(segments).length} keys`
    });

    // Save to tracks table first
    const { data: trackData, error: trackError } = await supabase
      .from('tracks')
      .insert(insertData)
      .select()
      .single();

    console.log('🔍 Tracks table response:', { data: !!trackData, error: !!trackError });

    if (trackError) {
      console.error('❌ Database error saving track:', {
        error: trackError,
        code: trackError.code,
        details: trackError.details,
        hint: trackError.hint,
        message: trackError.message
      });
      toast.error(`Failed to save route: ${trackError.message}`);
      return null;
    }

    if (!trackData) {
      console.error('❌ No track data returned from insert operation');
      toast.error('Failed to save route: No track data returned');
      return null;
    }

    console.log('✅ Track saved successfully:', {
      id: trackData.id,
      name: trackData.name,
      created_at: trackData.created_at
    });

    // Now also save to trips table for integration with trip management
    console.log('💾 Creating trip record...');

    const startCoords = validPoints[0];
    const endCoords = validPoints[validPoints.length - 1];

    const tripData = {
      name: routeName,
      description: routeDescription,
      route_data: {
        waypoints: waypoints.map(wp => ({
          name: wp.name,
          coordinates: wp.coords,
          type: wp.type
        })),
        profile: routeProfile,
        distance: route?.distance,
        duration: route?.duration,
        geometry: route?.geometry
      },
      start_coordinates: {
        latitude: startCoords.lat,
        longitude: startCoords.lon
      },
      end_coordinates: {
        latitude: endCoords.lat,
        longitude: endCoords.lon
      },
      distance_km: route ? route.distance / 1000 : 0,
      estimated_duration_hours: route ? route.duration / 3600 : 0,
      difficulty: additionalData?.difficulty || 'moderate',
      trip_type: 'route',
      visibility: additionalData?.isPublic ? 'public' : 'private',
      notes: additionalData?.notes || '',
      is_completed: false,
      terrain_types: [],
      tags: [routeProfile, 'planned_route'],
      metadata: {
        track_id: trackData.id,
        profile: routeProfile,
        waypoint_count: waypoints.length,
        created_with: 'route_planner',
        image_url: additionalData?.imageUrl
      },
      user_id: userId,
      created_by: userId,
      is_public: additionalData?.isPublic ?? false
    };

    const { data: tripRecord, error: tripError } = await supabase
      .from('trips')
      .insert(tripData)
      .select()
      .single();

    if (tripError) {
      console.warn('⚠️ Failed to create trip record (track still saved):', tripError.message);
      // Don't fail the entire operation - the track is saved
    } else if (tripRecord) {
      console.log('✅ Trip record created:', {
        id: tripRecord.id,
        name: tripRecord.name
      });

      // Update the track with the trip_id
      await supabase
        .from('tracks')
        .update({ trip_id: tripRecord.id })
        .eq('id', trackData.id);
    }

    toast.success(`Route saved: ${routeName}`);
    return {
      ...trackData,
      trip_id: tripRecord?.id,
      trip_data: tripRecord
    };
  } catch (error) {
    console.error('❌ Exception saving route:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof Error) {
      toast.error(`Failed to save route: ${error.message}`);
    } else {
      toast.error('Failed to save route: Unknown error occurred');
    }
    return null;
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