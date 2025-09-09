import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const GEOCODING_API_BASE = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

export interface GeocodingSuggestion {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  text: string;
  place_type: string[];
  relevance: number;
}

export interface GeocodingOptions {
  country?: string; // ISO 3166-1 alpha-2 country code
  proximity?: [number, number]; // [lng, lat] for proximity bias
  types?: string[]; // Filter by feature types
  limit?: number; // Number of results
  bbox?: [number, number, number, number]; // Bounding box
}

/**
 * Get country code from coordinates using reverse geocoding
 */
export async function getCountryFromCoordinates(lng: number, lat: number): Promise<string | null> {
  try {
    const response = await fetch(
      `${GEOCODING_API_BASE}/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&types=country&limit=1`
    );
    
    if (!response.ok) {
      console.error('Failed to get country from coordinates');
      return null;
    }
    
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      // Extract country code from properties
      const country = data.features[0];
      if (country.properties?.short_code) {
        return country.properties.short_code.toUpperCase();
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting country from coordinates:', error);
    return null;
  }
}

/**
 * Search for places with autocomplete
 */
export async function searchPlaces(
  query: string,
  options: GeocodingOptions = {}
): Promise<GeocodingSuggestion[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    // Build query parameters
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      autocomplete: 'true',
      limit: (options.limit || 5).toString(),
    });

    // Add country filter if provided
    if (options.country) {
      params.append('country', options.country);
    }

    // Add proximity bias if provided
    if (options.proximity) {
      params.append('proximity', `${options.proximity[0]},${options.proximity[1]}`);
    }

    // Add types filter (e.g., 'place', 'locality', 'postcode', 'address')
    if (options.types && options.types.length > 0) {
      params.append('types', options.types.join(','));
    }

    // Add bounding box if provided
    if (options.bbox) {
      params.append('bbox', options.bbox.join(','));
    }

    const response = await fetch(
      `${GEOCODING_API_BASE}/${encodeURIComponent(query)}.json?${params}`
    );

    if (!response.ok) {
      console.error('Geocoding request failed');
      return [];
    }

    const data = await response.json();
    
    return data.features.map((feature: any) => ({
      id: feature.id,
      place_name: feature.place_name,
      center: feature.center,
      text: feature.text,
      place_type: feature.place_type,
      relevance: feature.relevance,
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    return [];
  }
}

/**
 * Get coordinates from a place name
 */
export async function geocodePlace(placeName: string): Promise<[number, number] | null> {
  const suggestions = await searchPlaces(placeName, { limit: 1 });
  if (suggestions.length > 0) {
    return suggestions[0].center;
  }
  return null;
}

/**
 * Main geocoding function used by the map search
 */
export async function geocodeLocation(query: string): Promise<GeocodingSuggestion[]> {
  return searchPlaces(query, {
    limit: 5,
    types: ['place', 'locality', 'address', 'poi'] // Include various location types
  });
}