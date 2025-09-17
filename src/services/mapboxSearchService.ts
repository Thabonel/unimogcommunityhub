import { GeocodingSuggestion } from './mapboxGeocoding';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const SEARCH_BOX_API_BASE = 'https://api.mapbox.com/search/searchbox/v1';

export interface MapboxPOI {
  id: string;
  name: string;
  full_address: string;
  coordinates: [number, number]; // [lng, lat]
  distance?: number;
  poi_category?: string[];
  poi_category_ids?: string[];
  brand?: string[];
  phone?: string;
  website?: string;
  maki?: string;
}

export interface SearchBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface POICategoryMapping {
  local: string;
  mapbox: string[];
  fallback: string;
}

export const POI_CATEGORY_MAPPINGS: Record<string, POICategoryMapping> = {
  wide_parking: {
    local: 'wide_parking',
    mapbox: ['parking', 'truck_parking', 'rest_area'],
    fallback: 'parking'
  },
  medical: {
    local: 'medical',
    mapbox: ['hospital', 'pharmacy', 'doctor', 'clinic', 'emergency'],
    fallback: 'hospital'
  },
  pet_stops: {
    local: 'pet_stops',
    mapbox: ['veterinary', 'pet_store', 'park'],
    fallback: 'park'
  },
  farmers_markets: {
    local: 'farmers_markets',
    mapbox: ['market', 'grocery_store', 'food_market'],
    fallback: 'grocery_store'
  }
};

/**
 * Get available POI categories from Mapbox
 */
export async function getAvailableCategories(): Promise<string[]> {
  try {
    const response = await fetch(
      `${SEARCH_BOX_API_BASE}/list/category?access_token=${MAPBOX_TOKEN}`
    );

    if (!response.ok) {
      console.error('Failed to fetch Mapbox categories');
      return [];
    }

    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching Mapbox categories:', error);
    return [];
  }
}

/**
 * Search for POIs by category within map bounds
 */
export async function searchPOIsByCategory(
  category: string,
  bounds: SearchBounds,
  limit: number = 50
): Promise<MapboxPOI[]> {
  if (!MAPBOX_TOKEN) {
    console.error('Mapbox token not available');
    return [];
  }

  const categoryMapping = POI_CATEGORY_MAPPINGS[category];
  if (!categoryMapping) {
    console.error(`Unknown POI category: ${category}`);
    return [];
  }

  try {
    // Use the primary category for search
    const searchCategory = categoryMapping.mapbox[0] || categoryMapping.fallback;

    // Build bounding box parameter
    const bbox = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;

    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      poi_category: searchCategory,
      bbox: bbox,
      limit: limit.toString(),
      proximity: `${(bounds.east + bounds.west) / 2},${(bounds.north + bounds.south) / 2}`
    });

    const response = await fetch(
      `${SEARCH_BOX_API_BASE}/category?${params}`
    );

    if (!response.ok) {
      console.error(`Failed to search POIs for category: ${category}`);
      return [];
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      // Try fallback category if no results
      if (searchCategory !== categoryMapping.fallback) {
        return searchPOIsByCategory(category, bounds, limit);
      }
      return [];
    }

    return data.features.map((feature: any) => ({
      id: feature.id,
      name: feature.properties?.name || 'Unnamed Location',
      full_address: feature.properties?.full_address || '',
      coordinates: feature.geometry?.coordinates || [0, 0],
      distance: feature.properties?.distance,
      poi_category: feature.properties?.poi_category || [],
      poi_category_ids: feature.properties?.poi_category_ids || [],
      brand: feature.properties?.brand || [],
      phone: feature.properties?.phone,
      website: feature.properties?.website,
      maki: feature.properties?.maki
    }));
  } catch (error) {
    console.error(`Error searching POIs for category ${category}:`, error);
    return [];
  }
}

/**
 * Convert Mapbox POIs to GeoJSON format for map display
 */
export function convertPOIsToGeoJSON(
  pois: MapboxPOI[],
  poiType: string
): any {
  return {
    type: 'FeatureCollection',
    features: pois.map(poi => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: poi.coordinates
      },
      properties: {
        id: poi.id,
        name: poi.name,
        description: poi.full_address,
        type: poiType,
        phone: poi.phone,
        website: poi.website,
        brand: poi.brand?.[0],
        maki: poi.maki,
        distance: poi.distance
      }
    }))
  };
}

/**
 * Get POIs for multiple categories within bounds
 */
export async function getPOIsInBounds(
  bounds: SearchBounds,
  categories: string[] = [],
  limit: number = 50
): Promise<Record<string, any>> {
  const results: Record<string, any> = {};

  if (categories.length === 0) {
    categories = Object.keys(POI_CATEGORY_MAPPINGS);
  }

  try {
    const promises = categories.map(async category => {
      const pois = await searchPOIsByCategory(category, bounds, limit);
      const geoJSON = convertPOIsToGeoJSON(pois, category);
      return { category, geoJSON };
    });

    const categoryResults = await Promise.all(promises);

    categoryResults.forEach(({ category, geoJSON }) => {
      results[category] = geoJSON;
    });

    return results;
  } catch (error) {
    console.error('Error getting POIs in bounds:', error);
    return {};
  }
}

/**
 * Get fallback mock data for POI category (used when API fails)
 */
export function getFallbackPOIData(category: string): any {
  const fallbackData: Record<string, any> = {
    wide_parking: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749]
          },
          properties: {
            name: 'Golden Gate Rest Area',
            description: 'Large vehicle parking available',
            type: 'wide_parking'
          }
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-121.8863, 37.3382]
          },
          properties: {
            name: 'San Jose Truck Stop',
            description: '24/7 wide vehicle parking',
            type: 'wide_parking'
          }
        }
      ]
    },
    pet_stops: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.3321, 37.5753]
          },
          properties: {
            name: 'Dog Park Rest Area',
            description: 'Off-leash area available',
            type: 'pet_stops'
          }
        }
      ]
    },
    medical: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.4304, 37.7749]
          },
          properties: {
            name: 'SF General Hospital',
            description: '24/7 Emergency Room',
            type: 'medical'
          }
        }
      ]
    },
    farmers_markets: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [-122.4194, 37.7749]
          },
          properties: {
            name: 'Ferry Building Market',
            description: 'Saturdays 8am-2pm',
            type: 'farmers_markets'
          }
        }
      ]
    }
  };

  return fallbackData[category] || { type: 'FeatureCollection', features: [] };
}