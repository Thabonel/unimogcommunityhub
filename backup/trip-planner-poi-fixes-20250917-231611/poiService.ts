import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

export interface POI {
  id: string;
  name: string;
  description?: string;
  type: POIType;
  coordinates: [number, number]; // [lng, lat]
  created_by: string;
  created_at: string;
  is_verified?: boolean;
  rating?: number;
  images?: string[];
  metadata?: Record<string, any>;
}

export type POIType = 
  | 'camping'
  | 'water'
  | 'fuel'
  | 'mechanic'
  | 'viewpoint'
  | 'hazard'
  | 'river_crossing'
  | 'gate'
  | 'accommodation'
  | 'food'
  | 'track_start'
  | 'track_end'
  | 'emergency'
  | 'other';

export const POI_ICONS: Record<POIType, { icon: string; color: string; label: string }> = {
  camping: { icon: '⛺', color: '#10b981', label: 'Camping' },
  water: { icon: '💧', color: '#3b82f6', label: 'Water Source' },
  fuel: { icon: '⛽', color: '#f59e0b', label: 'Fuel Station' },
  mechanic: { icon: '🔧', color: '#6b7280', label: 'Mechanic/Repair' },
  viewpoint: { icon: '👁️', color: '#8b5cf6', label: 'Viewpoint' },
  hazard: { icon: '⚠️', color: '#ef4444', label: 'Hazard/Warning' },
  river_crossing: { icon: '🌊', color: '#06b6d4', label: 'River Crossing' },
  gate: { icon: '🚪', color: '#a78bfa', label: 'Gate/Barrier' },
  accommodation: { icon: '🏠', color: '#ec4899', label: 'Accommodation' },
  food: { icon: '🍽️', color: '#84cc16', label: 'Food/Restaurant' },
  track_start: { icon: '🏁', color: '#22c55e', label: 'Track Start' },
  track_end: { icon: '🏁', color: '#dc2626', label: 'Track End' },
  emergency: { icon: '🚨', color: '#dc2626', label: 'Emergency' },
  other: { icon: '📍', color: '#64748b', label: 'Other' }
};

// Prevent duplicate POI creation with a simple in-memory cache
const pendingPOIs = new Map<string, Promise<POI | null>>();

/**
 * Generate a unique key for POI to prevent race conditions
 */
function generatePOIKey(coordinates: [number, number], userId: string, name: string): string {
  // Round coordinates to prevent floating point precision issues
  const roundedLng = Math.round(coordinates[0] * 1000000) / 1000000;
  const roundedLat = Math.round(coordinates[1] * 1000000) / 1000000;
  return `${userId}_${roundedLng}_${roundedLat}_${name.toLowerCase().replace(/\s+/g, '_')}`;
}

/**
 * Save a new POI with race condition protection
 */
export async function savePOI(
  coordinates: [number, number],
  type: POIType,
  name: string,
  description?: string,
  userId?: string
): Promise<POI | null> {
  try {
    // Get current user if not provided
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add POIs');
        return null;
      }
      userId = user.id;
    }

    // Generate unique key to prevent duplicate requests
    const poiKey = generatePOIKey(coordinates, userId, name);

    // Check if POI creation is already in progress
    if (pendingPOIs.has(poiKey)) {
      console.log('POI creation already in progress, waiting for existing request...');
      return await pendingPOIs.get(poiKey)!;
    }

    // Create the POI creation promise
    const createPOIPromise = (async (): Promise<POI | null> => {
      try {
        // Check for nearby duplicate POIs first (within 50 meters)
        const { data: nearbyPOIs, error: queryError } = await supabase
          .from('pois')
          .select('id, name, longitude, latitude')
          .gte('longitude', coordinates[0] - 0.0005) // ~50m at equator
          .lte('longitude', coordinates[0] + 0.0005)
          .gte('latitude', coordinates[1] - 0.0005)
          .lte('latitude', coordinates[1] + 0.0005)
          .eq('created_by', userId);

        if (queryError) {
          console.error('Error checking for duplicate POIs:', queryError);
          // Continue with creation even if check fails
        } else if (nearbyPOIs && nearbyPOIs.length > 0) {
          const existingPOI = nearbyPOIs.find(poi =>
            poi.name.toLowerCase() === name.toLowerCase()
          );
          if (existingPOI) {
            toast.error(`A POI named "${name}" already exists nearby`);
            return null;
          }
        }

        const { data, error } = await supabase
          .from('pois')
          .insert({
            name,
            description,
            type,
            longitude: coordinates[0],
            latitude: coordinates[1],
            created_by: userId,
            is_verified: false,
            metadata: {
              added_via: 'map_click'
            }
          })
          .select()
          .single();

        if (error) {
          console.error('Error saving POI:', error);
          toast.error('Failed to save point of interest');
          return null;
        }

        toast.success(`POI "${name}" added successfully`);
        return {
          ...data,
          coordinates: [data.longitude, data.latitude]
        } as POI;
      } finally {
        // Always clean up the pending request
        pendingPOIs.delete(poiKey);
      }
    })();

    // Store the promise to prevent concurrent requests
    pendingPOIs.set(poiKey, createPOIPromise);

    return await createPOIPromise;
  } catch (error) {
    console.error('Error saving POI:', error);
    toast.error('Failed to save point of interest');
    return null;
  }
}

/**
 * Get all POIs within bounds
 */
export async function getPOIsInBounds(
  bounds: { north: number; south: number; east: number; west: number }
): Promise<POI[]> {
  try {
    // Get POIs within bounds using simple lat/lng filtering
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .gte('longitude', bounds.west)
      .lte('longitude', bounds.east)
      .gte('latitude', bounds.south)
      .lte('latitude', bounds.north)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching POIs:', error);
      return [];
    }

    return data?.map(poi => ({
      ...poi,
      coordinates: [poi.longitude, poi.latitude] as [number, number]
    })) || [];
  } catch (error) {
    console.error('Error fetching POIs:', error);
    return [];
  }
}

/**
 * Update POI rating
 */
export async function updatePOIRating(
  poiId: string,
  rating: number
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pois')
      .update({ rating })
      .eq('id', poiId);

    if (error) {
      console.error('Error updating POI rating:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating POI rating:', error);
    return false;
  }
}

/**
 * Delete a POI
 */
export async function deletePOI(poiId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pois')
      .delete()
      .eq('id', poiId);

    if (error) {
      console.error('Error deleting POI:', error);
      toast.error('Failed to delete point of interest');
      return false;
    }

    toast.success('Point of interest deleted');
    return true;
  } catch (error) {
    console.error('Error deleting POI:', error);
    toast.error('Failed to delete point of interest');
    return false;
  }
}

/**
 * Get POIs created by a specific user
 */
export async function getUserPOIs(userId: string): Promise<POI[]> {
  try {
    const { data, error } = await supabase
      .from('pois')
      .select('*')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user POIs:', error);
      return [];
    }

    return data?.map(poi => ({
      ...poi,
      coordinates: [poi.longitude, poi.latitude] as [number, number]
    })) || [];
  } catch (error) {
    console.error('Error fetching user POIs:', error);
    return [];
  }
}