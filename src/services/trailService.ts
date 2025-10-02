import { supabase } from '@/lib/supabase-client';

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };
  properties: {
    name: string;
    description?: string;
    surface?: string;
    difficulty?: string;
    osm_id: number;
    distance_meters: number;
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
}

export interface TrailLibraryItem {
  id: string;
  user_id: string;
  trail_name: string;
  trail_description: string | null;
  trail_source: 'osm' | 'user_upload' | 'community' | 'government';
  osm_way_id: number | null;
  geojson_data: GeoJSONFeature;
  distance_meters: number | null;
  elevation_gain_meters: number | null;
  elevation_loss_meters: number | null;
  min_elevation_meters: number | null;
  max_elevation_meters: number | null;
  difficulty_level: 'easy' | 'moderate' | 'difficult' | 'extreme' | null;
  terrain_types: string[] | null;
  bounds: any;
  is_favorite: boolean;
  times_driven: number;
  last_driven_at: string | null;
  user_rating: number | null;
  user_notes: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export async function searchTrails(
  searchQuery: string,
  region?: { north: number; south: number; east: number; west: number }
): Promise<{ trails: GeoJSONFeature[]; error?: string }> {
  try {
    const { data, error } = await supabase.functions.invoke('search-trails', {
      body: {
        searchQuery,
        region,
        limit: 20
      }
    });

    if (error) {
      console.error('Error searching trails:', error);
      return { trails: [], error: error.message };
    }

    return { trails: data.trails || [] };
  } catch (error) {
    console.error('Error in searchTrails:', error);
    return { trails: [], error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

function sanitizeText(text: string): string {
  return text
    .replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#x27;',
        '"': '&quot;',
        '&': '&amp;'
      };
      return entities[char] || char;
    });
}

export async function saveTrailToLibrary(
  trail: GeoJSONFeature
): Promise<{ data: TrailLibraryItem | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const sanitizedTrail = {
      ...trail,
      properties: {
        ...trail.properties,
        name: sanitizeText(trail.properties.name),
        description: trail.properties.description ? sanitizeText(trail.properties.description) : undefined
      }
    };

    const { data, error } = await supabase
      .from('user_trail_library')
      .insert({
        user_id: user.id,
        trail_name: sanitizedTrail.properties.name,
        trail_description: sanitizedTrail.properties.description,
        geojson_data: sanitizedTrail,
        distance_meters: trail.properties.distance_meters,
        bounds: trail.properties.bounds,
        osm_way_id: trail.properties.osm_id,
        trail_source: 'osm',
        difficulty_level: trail.properties.difficulty as any
      })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error saving trail:', error);
    return { data: null, error };
  }
}

export async function getUserTrails(): Promise<{ trails: TrailLibraryItem[]; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { trails: [], error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('user_trail_library')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { trails: data || [], error };
  } catch (error) {
    console.error('Error fetching user trails:', error);
    return { trails: [], error };
  }
}

export async function deleteTrail(trailId: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('user_trail_library')
      .delete()
      .eq('id', trailId);

    return { error };
  } catch (error) {
    console.error('Error deleting trail:', error);
    return { error };
  }
}

export async function updateTrailFavorite(
  trailId: string,
  isFavorite: boolean
): Promise<{ error: any }> {
  try {
    const { error } = await supabase
      .from('user_trail_library')
      .update({ is_favorite: isFavorite })
      .eq('id', trailId);

    return { error };
  } catch (error) {
    console.error('Error updating trail favorite:', error);
    return { error };
  }
}

export function convertGeoJSONToGPX(geojson: GeoJSONFeature, name?: string): string {
  const trailName = name || geojson.properties.name || 'Trail';
  const coordinates = geojson.geometry.coordinates;

  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="UnimogCommunityHub"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(trailName)}</name>
    ${geojson.properties.description ? `<desc>${escapeXml(geojson.properties.description)}</desc>` : ''}
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${escapeXml(trailName)}</name>
    ${geojson.properties.description ? `<desc>${escapeXml(geojson.properties.description)}</desc>` : ''}
    <trkseg>
`;

  coordinates.forEach(coord => {
    const [lon, lat, ele] = coord;
    gpx += `      <trkpt lat="${lat}" lon="${lon}">
`;
    if (ele !== undefined) {
      gpx += `        <ele>${ele}</ele>
`;
    }
    gpx += `      </trkpt>
`;
  });

  gpx += `    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function downloadGPXFile(gpxContent: string, filename: string) {
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.gpx') ? filename : `${filename}.gpx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export async function exportTrailAsGPX(trailId: string): Promise<void> {
  try {
    const { data: trail, error } = await supabase
      .from('user_trail_library')
      .select('geojson_data, trail_name')
      .eq('id', trailId)
      .single();

    if (error || !trail) {
      throw new Error('Trail not found');
    }

    const gpxString = convertGeoJSONToGPX(trail.geojson_data, trail.trail_name);
    downloadGPXFile(gpxString, trail.trail_name);
  } catch (error) {
    console.error('Error exporting trail as GPX:', error);
    throw error;
  }
}
