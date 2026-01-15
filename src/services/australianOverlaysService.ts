/**
 * Australian Map Overlays Service
 * Fetches real data from Australian government and NASA APIs
 * For RV travellers in Australia
 */

// NASA FIRMS API key - get from https://firms.modaps.eosdis.nasa.gov/api/map_key/
const FIRMS_MAP_KEY = import.meta.env.VITE_NASA_FIRMS_KEY || '';

// Australia bounding box
const AUSTRALIA_BBOX = {
  west: 110,
  south: -45,
  east: 155,
  north: -10
};

// Cache for expensive API calls
const dataCache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

interface FireFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    brightness: number;
    confidence: string;
    frp: number;
    daynight: string;
    satellite: string;
    acq_date: string;
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: any[];
}

/**
 * Fetch active fires from NASA FIRMS API
 * Uses VIIRS NOAA-20 satellite data for Australia
 */
export async function fetchActiveFires(days: number = 1): Promise<GeoJSONFeatureCollection> {
  const cacheKey = `fires_${days}`;

  // Check cache
  if (dataCache[cacheKey] && Date.now() - dataCache[cacheKey].timestamp < CACHE_DURATION) {
    console.log('[Fires] Using cached data');
    return dataCache[cacheKey].data;
  }

  // If no API key, return empty collection with warning
  if (!FIRMS_MAP_KEY) {
    console.warn('[Fires] No NASA FIRMS API key configured. Set VITE_NASA_FIRMS_KEY in environment.');
    return { type: 'FeatureCollection', features: [] };
  }

  try {
    const { west, south, east, north } = AUSTRALIA_BBOX;
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${FIRMS_MAP_KEY}/VIIRS_NOAA20_NRT/${west},${south},${east},${north}/${days}`;

    console.log('[Fires] Fetching from NASA FIRMS...');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`FIRMS API error: ${response.status}`);
    }

    const csvText = await response.text();
    const features = parseFiresCSV(csvText);

    const geojson: GeoJSONFeatureCollection = {
      type: 'FeatureCollection',
      features
    };

    // Cache the result
    dataCache[cacheKey] = { data: geojson, timestamp: Date.now() };
    console.log(`[Fires] Loaded ${features.length} active fire points`);

    return geojson;
  } catch (error) {
    console.error('[Fires] Error fetching fire data:', error);
    return { type: 'FeatureCollection', features: [] };
  }
}

/**
 * Parse NASA FIRMS CSV response to GeoJSON
 */
function parseFiresCSV(csvText: string): FireFeature[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const latIdx = headers.indexOf('latitude');
  const lonIdx = headers.indexOf('longitude');
  const brightIdx = headers.indexOf('bright_ti4');
  const confIdx = headers.indexOf('confidence');
  const frpIdx = headers.indexOf('frp');
  const dayNightIdx = headers.indexOf('daynight');
  const satIdx = headers.indexOf('satellite');
  const dateIdx = headers.indexOf('acq_date');

  const features: FireFeature[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const lat = parseFloat(values[latIdx]);
    const lon = parseFloat(values[lonIdx]);

    if (isNaN(lat) || isNaN(lon)) continue;

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat]
      },
      properties: {
        brightness: parseFloat(values[brightIdx]) || 300,
        confidence: values[confIdx] || 'nominal',
        frp: parseFloat(values[frpIdx]) || 0,
        daynight: values[dayNightIdx] || 'D',
        satellite: values[satIdx] || 'NOAA-20',
        acq_date: values[dateIdx] || new Date().toISOString().split('T')[0]
      }
    });
  }

  return features;
}

/**
 * Fetch National Parks and Protected Areas from CAPAD (Australian Government)
 * Uses ArcGIS REST API
 */
export async function fetchNationalParks(bounds?: { west: number; south: number; east: number; north: number }): Promise<GeoJSONFeatureCollection> {
  const cacheKey = 'national_parks';

  // Check cache (parks don't change often)
  if (dataCache[cacheKey] && Date.now() - dataCache[cacheKey].timestamp < 24 * 60 * 60 * 1000) {
    console.log('[Parks] Using cached data');
    return dataCache[cacheKey].data;
  }

  try {
    // CAPAD ArcGIS REST API - query for National Parks
    const bbox = bounds || AUSTRALIA_BBOX;
    const geometry = `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`;

    const params = new URLSearchParams({
      where: "TYPE = 'National Park' OR TYPE = 'Conservation Park' OR TYPE_ABBR = 'NP' OR TYPE_ABBR = 'CP'",
      geometry: geometry,
      geometryType: 'esriGeometryEnvelope',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'NAME,TYPE,STATE,AREA_KM2',
      returnGeometry: 'true',
      f: 'geojson',
      outSR: '4326'
    });

    const url = `https://gis.environment.gov.au/gispubmap/rest/services/ogc_services/CAPAD/MapServer/0/query?${params}`;

    console.log('[Parks] Fetching from CAPAD...');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CAPAD API error: ${response.status}`);
    }

    const geojson = await response.json();

    // Cache the result
    dataCache[cacheKey] = { data: geojson, timestamp: Date.now() };
    console.log(`[Parks] Loaded ${geojson.features?.length || 0} national parks`);

    return geojson;
  } catch (error) {
    console.error('[Parks] Error fetching parks data:', error);
    return { type: 'FeatureCollection', features: [] };
  }
}

/**
 * Fetch State Forests from ABARES Forests of Australia dataset
 */
export async function fetchStateForests(bounds?: { west: number; south: number; east: number; north: number }): Promise<GeoJSONFeatureCollection> {
  const cacheKey = 'state_forests';

  // Check cache
  if (dataCache[cacheKey] && Date.now() - dataCache[cacheKey].timestamp < 24 * 60 * 60 * 1000) {
    console.log('[Forests] Using cached data');
    return dataCache[cacheKey].data;
  }

  try {
    const bbox = bounds || AUSTRALIA_BBOX;
    const geometry = `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`;

    // ABARES Forests of Australia MapServer
    const params = new URLSearchParams({
      where: "TENURE IN ('State forest', 'Multiple-use public forest', 'Timber reserve')",
      geometry: geometry,
      geometryType: 'esriGeometryEnvelope',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: 'TENURE,FOREST_TYP,STATE',
      returnGeometry: 'true',
      f: 'geojson',
      outSR: '4326'
    });

    const url = `https://asris.csiro.au/arcgis/rest/services/abares/forests_of_australia_2018/MapServer/0/query?${params}`;

    console.log('[Forests] Fetching from ABARES...');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`ABARES API error: ${response.status}`);
    }

    const geojson = await response.json();

    // Cache the result
    dataCache[cacheKey] = { data: geojson, timestamp: Date.now() };
    console.log(`[Forests] Loaded ${geojson.features?.length || 0} state forests`);

    return geojson;
  } catch (error) {
    console.error('[Forests] Error fetching forests data:', error);
    return { type: 'FeatureCollection', features: [] };
  }
}

/**
 * Mobile carrier IDs from ACCC Mobile Coverage MapServer
 */
export const MOBILE_CARRIERS = {
  telstra_4g: { id: 0, name: 'Telstra 4G', color: '#0066CC' },
  telstra_5g: { id: 1, name: 'Telstra 5G', color: '#0099FF' },
  optus_4g: { id: 2, name: 'Optus 4G', color: '#00AA00' },
  optus_5g: { id: 3, name: 'Optus 5G', color: '#00DD00' },
  tpg_4g: { id: 4, name: 'TPG/Vodafone 4G', color: '#CC0000' },
  tpg_5g: { id: 5, name: 'TPG/Vodafone 5G', color: '#FF3333' }
} as const;

export type CarrierKey = keyof typeof MOBILE_CARRIERS;

/**
 * Fetch mobile phone coverage from ACCC
 * Returns coverage for specified carrier
 */
export async function fetchMobileCoverage(
  carrier: CarrierKey,
  bounds?: { west: number; south: number; east: number; north: number }
): Promise<GeoJSONFeatureCollection> {
  const cacheKey = `coverage_${carrier}`;

  // Check cache
  if (dataCache[cacheKey] && Date.now() - dataCache[cacheKey].timestamp < CACHE_DURATION) {
    console.log(`[Coverage] Using cached data for ${carrier}`);
    return dataCache[cacheKey].data;
  }

  try {
    const bbox = bounds || AUSTRALIA_BBOX;
    const geometry = `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`;
    const layerId = MOBILE_CARRIERS[carrier].id;

    const params = new URLSearchParams({
      where: '1=1',
      geometry: geometry,
      geometryType: 'esriGeometryEnvelope',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: '*',
      returnGeometry: 'true',
      f: 'geojson',
      outSR: '4326'
    });

    const url = `https://spatial.infrastructure.gov.au/server/rest/services/Communications/Mobile_Phone_Coverage/MapServer/${layerId}/query?${params}`;

    console.log(`[Coverage] Fetching ${carrier} coverage...`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`ACCC API error: ${response.status}`);
    }

    const geojson = await response.json();

    // Add carrier info to properties
    if (geojson.features) {
      geojson.features = geojson.features.map((f: any) => ({
        ...f,
        properties: {
          ...f.properties,
          carrier: MOBILE_CARRIERS[carrier].name,
          carrierKey: carrier,
          color: MOBILE_CARRIERS[carrier].color
        }
      }));
    }

    // Cache the result
    dataCache[cacheKey] = { data: geojson, timestamp: Date.now() };
    console.log(`[Coverage] Loaded ${geojson.features?.length || 0} coverage areas for ${carrier}`);

    return geojson;
  } catch (error) {
    console.error(`[Coverage] Error fetching ${carrier} coverage:`, error);
    return { type: 'FeatureCollection', features: [] };
  }
}

/**
 * Fetch all mobile coverage (all carriers combined)
 */
export async function fetchAllMobileCoverage(
  bounds?: { west: number; south: number; east: number; north: number }
): Promise<Record<CarrierKey, GeoJSONFeatureCollection>> {
  const results: Record<string, GeoJSONFeatureCollection> = {};

  // Fetch all carriers in parallel
  const carriers = Object.keys(MOBILE_CARRIERS) as CarrierKey[];
  const promises = carriers.map(async (carrier) => {
    const data = await fetchMobileCoverage(carrier, bounds);
    results[carrier] = data;
  });

  await Promise.all(promises);
  return results as Record<CarrierKey, GeoJSONFeatureCollection>;
}

/**
 * Clear the data cache
 */
export function clearOverlayCache(): void {
  Object.keys(dataCache).forEach(key => delete dataCache[key]);
  console.log('[Overlays] Cache cleared');
}

/**
 * Get cache status
 */
export function getCacheStatus(): Record<string, { age: number; size: number }> {
  const status: Record<string, { age: number; size: number }> = {};

  Object.entries(dataCache).forEach(([key, value]) => {
    status[key] = {
      age: Math.round((Date.now() - value.timestamp) / 1000 / 60), // minutes
      size: JSON.stringify(value.data).length
    };
  });

  return status;
}
