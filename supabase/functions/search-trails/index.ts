import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface SearchTrailsRequest {
  searchQuery: string;
  region?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  limit?: number;
}

interface GeoJSONFeature {
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

function haversineDistance(coord1: number[], coord2: number[]): number {
  const R = 6371000;
  const lat1 = coord1[1] * Math.PI / 180;
  const lat2 = coord2[1] * Math.PI / 180;
  const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const deltaLon = (coord2[0] - coord1[0]) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function calculateDistance(coords: number[][]): number {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineDistance(coords[i - 1], coords[i]);
  }
  return total;
}

function calculateBounds(coords: number[][]) {
  const lons = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lons),
    west: Math.min(...lons)
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { searchQuery, region, limit = 10 }: SearchTrailsRequest = await req.json();

    if (!searchQuery || searchQuery.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (searchQuery.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Search query too long (max 200 characters)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const defaultRegion = {
      south: -45,
      west: 110,
      north: -10,
      east: 155
    };

    const searchRegion = region || defaultRegion;

    if (
      typeof searchRegion.north !== 'number' ||
      typeof searchRegion.south !== 'number' ||
      typeof searchRegion.east !== 'number' ||
      typeof searchRegion.west !== 'number'
    ) {
      return new Response(
        JSON.stringify({ error: 'Invalid region coordinates' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (
      searchRegion.north < -90 || searchRegion.north > 90 ||
      searchRegion.south < -90 || searchRegion.south > 90 ||
      searchRegion.east < -180 || searchRegion.east > 180 ||
      searchRegion.west < -180 || searchRegion.west > 180
    ) {
      return new Response(
        JSON.stringify({ error: 'Coordinates out of valid range' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (searchRegion.north <= searchRegion.south || searchRegion.east <= searchRegion.west) {
      return new Response(
        JSON.stringify({ error: 'Invalid region bounds' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (limit < 1 || limit > 50) {
      return new Response(
        JSON.stringify({ error: 'Limit must be between 1 and 50' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedQuery = searchQuery.replace(/[^\w\s-]/g, '');

    const overpassQuery = `
      [out:json][timeout:25];
      (
        way["highway"~"track|path"]["name"~"${sanitizedQuery.replace(/"/g, '\\"')}",i]
          (${searchRegion.south},${searchRegion.west},${searchRegion.north},${searchRegion.east});
      );
      out geom;
    `;

    console.log('Querying Overpass API with:', { searchQuery, searchRegion });

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }

    const osmData = await response.json();

    if (!osmData.elements || osmData.elements.length === 0) {
      return new Response(
        JSON.stringify({ trails: [], message: 'No trails found matching your search' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trails: GeoJSONFeature[] = osmData.elements
      .slice(0, limit)
      .map((element: any) => {
        if (!element.geometry || element.geometry.length === 0) {
          return null;
        }

        const coordinates = element.geometry.map((node: any) => [node.lon, node.lat]);
        const distance = calculateDistance(coordinates);
        const bounds = calculateBounds(coordinates);

        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates
          },
          properties: {
            name: element.tags?.name || 'Unnamed Trail',
            description: element.tags?.description || element.tags?.note,
            surface: element.tags?.surface,
            difficulty: element.tags?.difficulty || element.tags?.mtb_scale,
            osm_id: element.id,
            distance_meters: Math.round(distance),
            bounds
          }
        };
      })
      .filter((trail: any) => trail !== null);

    console.log(`Found ${trails.length} trails`);

    return new Response(
      JSON.stringify({ trails }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in search-trails function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
