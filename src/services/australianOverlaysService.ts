/**
 * Australian Map Overlays Service
 * Fetches real data from Australian government and NASA APIs
 * For RV travellers in Australia
 *
 * Note: Some government APIs may have CORS restrictions.
 * Falls back to sample data when APIs are unavailable.
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

// ============================================
// SAMPLE DATA - Used when APIs are unavailable
// ============================================

const SAMPLE_FIRES: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // NSW fires
    { type: 'Feature', geometry: { type: 'Point', coordinates: [150.5, -33.8] }, properties: { brightness: 340, confidence: 'high', frp: 25, satellite: 'Sample', acq_date: new Date().toISOString().split('T')[0] } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [149.8, -35.2] }, properties: { brightness: 320, confidence: 'nominal', frp: 15, satellite: 'Sample', acq_date: new Date().toISOString().split('T')[0] } },
    // Victoria
    { type: 'Feature', geometry: { type: 'Point', coordinates: [147.1, -37.5] }, properties: { brightness: 350, confidence: 'high', frp: 30, satellite: 'Sample', acq_date: new Date().toISOString().split('T')[0] } },
    // Queensland
    { type: 'Feature', geometry: { type: 'Point', coordinates: [145.7, -16.9] }, properties: { brightness: 310, confidence: 'nominal', frp: 12, satellite: 'Sample', acq_date: new Date().toISOString().split('T')[0] } },
    { type: 'Feature', geometry: { type: 'Point', coordinates: [152.9, -27.4] }, properties: { brightness: 325, confidence: 'high', frp: 20, satellite: 'Sample', acq_date: new Date().toISOString().split('T')[0] } },
    // WA
    { type: 'Feature', geometry: { type: 'Point', coordinates: [121.5, -30.8] }, properties: { brightness: 335, confidence: 'nominal', frp: 18, satellite: 'Sample', acq_date: new Date().toISOString().split('T')[0] } },
    // SA
    { type: 'Feature', geometry: { type: 'Point', coordinates: [138.6, -34.9] }, properties: { brightness: 315, confidence: 'low', frp: 10, satellite: 'Sample', acq_date: new Date().toISOString().split('T')[0] } },
    // NT
    { type: 'Feature', geometry: { type: 'Point', coordinates: [130.8, -12.4] }, properties: { brightness: 360, confidence: 'high', frp: 35, satellite: 'Sample', acq_date: new Date().toISOString().split('T')[0] } },
  ]
};

const SAMPLE_NATIONAL_PARKS: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Blue Mountains NP, NSW
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[150.2, -33.6], [150.8, -33.6], [150.8, -34.0], [150.2, -34.0], [150.2, -33.6]]] }, properties: { NAME: 'Blue Mountains National Park', TYPE: 'National Park', STATE: 'NSW', AREA_KM2: 2690 } },
    // Kakadu NP, NT
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[132.0, -12.5], [133.5, -12.5], [133.5, -14.0], [132.0, -14.0], [132.0, -12.5]]] }, properties: { NAME: 'Kakadu National Park', TYPE: 'National Park', STATE: 'NT', AREA_KM2: 19804 } },
    // Great Otway NP, VIC
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[143.5, -38.6], [144.0, -38.6], [144.0, -38.9], [143.5, -38.9], [143.5, -38.6]]] }, properties: { NAME: 'Great Otway National Park', TYPE: 'National Park', STATE: 'VIC', AREA_KM2: 1032 } },
    // Daintree NP, QLD
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[145.3, -16.2], [145.7, -16.2], [145.7, -16.6], [145.3, -16.6], [145.3, -16.2]]] }, properties: { NAME: 'Daintree National Park', TYPE: 'National Park', STATE: 'QLD', AREA_KM2: 1200 } },
    // Flinders Ranges NP, SA
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[138.4, -31.2], [138.8, -31.2], [138.8, -31.8], [138.4, -31.8], [138.4, -31.2]]] }, properties: { NAME: 'Flinders Ranges National Park', TYPE: 'National Park', STATE: 'SA', AREA_KM2: 912 } },
    // Karijini NP, WA
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[118.0, -22.3], [118.8, -22.3], [118.8, -23.0], [118.0, -23.0], [118.0, -22.3]]] }, properties: { NAME: 'Karijini National Park', TYPE: 'National Park', STATE: 'WA', AREA_KM2: 6274 } },
    // Freycinet NP, TAS
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[148.2, -42.0], [148.4, -42.0], [148.4, -42.3], [148.2, -42.3], [148.2, -42.0]]] }, properties: { NAME: 'Freycinet National Park', TYPE: 'National Park', STATE: 'TAS', AREA_KM2: 169 } },
  ]
};

const SAMPLE_STATE_FORESTS: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // Pilliga SF, NSW
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[148.8, -30.8], [149.5, -30.8], [149.5, -31.5], [148.8, -31.5], [148.8, -30.8]]] }, properties: { TENURE: 'State forest', FOREST_TYP: 'Native', STATE: 'NSW' } },
    // Wombat SF, VIC
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[144.0, -37.3], [144.4, -37.3], [144.4, -37.6], [144.0, -37.6], [144.0, -37.3]]] }, properties: { TENURE: 'State forest', FOREST_TYP: 'Native', STATE: 'VIC' } },
    // Beerburrum SF, QLD
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[152.9, -26.9], [153.1, -26.9], [153.1, -27.1], [152.9, -27.1], [152.9, -26.9]]] }, properties: { TENURE: 'State forest', FOREST_TYP: 'Plantation', STATE: 'QLD' } },
    // Mt Crawford SF, SA
    { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[138.9, -34.6], [139.1, -34.6], [139.1, -34.8], [138.9, -34.8], [138.9, -34.6]]] }, properties: { TENURE: 'State forest', FOREST_TYP: 'Plantation', STATE: 'SA' } },
  ]
};

// Sample mobile coverage - showing coverage gaps is important for grey nomads
const SAMPLE_MOBILE_COVERAGE: Record<string, GeoJSONFeatureCollection> = {
  telstra_4g: {
    type: 'FeatureCollection',
    features: [
      // Sydney metro
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[150.6, -33.6], [151.4, -33.6], [151.4, -34.2], [150.6, -34.2], [150.6, -33.6]]] }, properties: { carrier: 'Telstra 4G', signal_strength: 'Strong' } },
      // Melbourne metro
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[144.6, -37.6], [145.4, -37.6], [145.4, -38.2], [144.6, -38.2], [144.6, -37.6]]] }, properties: { carrier: 'Telstra 4G', signal_strength: 'Strong' } },
      // Brisbane metro
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[152.8, -27.2], [153.3, -27.2], [153.3, -27.7], [152.8, -27.7], [152.8, -27.2]]] }, properties: { carrier: 'Telstra 4G', signal_strength: 'Strong' } },
      // Perth metro
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[115.6, -31.7], [116.1, -31.7], [116.1, -32.2], [115.6, -32.2], [115.6, -31.7]]] }, properties: { carrier: 'Telstra 4G', signal_strength: 'Strong' } },
      // Adelaide metro
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[138.4, -34.7], [138.8, -34.7], [138.8, -35.1], [138.4, -35.1], [138.4, -34.7]]] }, properties: { carrier: 'Telstra 4G', signal_strength: 'Strong' } },
      // Regional corridors
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[149.0, -35.0], [149.5, -35.0], [149.5, -35.5], [149.0, -35.5], [149.0, -35.0]]] }, properties: { carrier: 'Telstra 4G', signal_strength: 'Moderate' } },
    ]
  },
  telstra_5g: {
    type: 'FeatureCollection',
    features: [
      // Sydney CBD
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[151.1, -33.85], [151.25, -33.85], [151.25, -33.9], [151.1, -33.9], [151.1, -33.85]]] }, properties: { carrier: 'Telstra 5G', signal_strength: 'Strong' } },
      // Melbourne CBD
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[144.9, -37.8], [145.0, -37.8], [145.0, -37.85], [144.9, -37.85], [144.9, -37.8]]] }, properties: { carrier: 'Telstra 5G', signal_strength: 'Strong' } },
    ]
  },
  optus_4g: {
    type: 'FeatureCollection',
    features: [
      // Sydney metro (slightly smaller than Telstra)
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[150.8, -33.7], [151.3, -33.7], [151.3, -34.1], [150.8, -34.1], [150.8, -33.7]]] }, properties: { carrier: 'Optus 4G', signal_strength: 'Strong' } },
      // Melbourne metro
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[144.7, -37.7], [145.3, -37.7], [145.3, -38.1], [144.7, -38.1], [144.7, -37.7]]] }, properties: { carrier: 'Optus 4G', signal_strength: 'Strong' } },
      // Brisbane metro
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[152.9, -27.3], [153.2, -27.3], [153.2, -27.6], [152.9, -27.6], [152.9, -27.3]]] }, properties: { carrier: 'Optus 4G', signal_strength: 'Strong' } },
    ]
  },
  optus_5g: {
    type: 'FeatureCollection',
    features: [
      // Sydney CBD only
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[151.15, -33.86], [151.22, -33.86], [151.22, -33.89], [151.15, -33.89], [151.15, -33.86]]] }, properties: { carrier: 'Optus 5G', signal_strength: 'Strong' } },
    ]
  },
  tpg_4g: {
    type: 'FeatureCollection',
    features: [
      // Sydney metro (smaller coverage)
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[150.9, -33.75], [151.2, -33.75], [151.2, -34.0], [150.9, -34.0], [150.9, -33.75]]] }, properties: { carrier: 'TPG/Vodafone 4G', signal_strength: 'Moderate' } },
      // Melbourne metro
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[144.8, -37.75], [145.1, -37.75], [145.1, -38.0], [144.8, -38.0], [144.8, -37.75]]] }, properties: { carrier: 'TPG/Vodafone 4G', signal_strength: 'Moderate' } },
    ]
  },
  tpg_5g: {
    type: 'FeatureCollection',
    features: [
      // Very limited - CBD only
      { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[151.18, -33.87], [151.21, -33.87], [151.21, -33.88], [151.18, -33.88], [151.18, -33.87]]] }, properties: { carrier: 'TPG/Vodafone 5G', signal_strength: 'Strong' } },
    ]
  }
};

// ============================================
// API FETCH FUNCTIONS
// ============================================

/**
 * Fetch active fires from NASA FIRMS API
 * Uses VIIRS NOAA-20 satellite data for Australia
 * Falls back to sample data if API unavailable
 */
export async function fetchActiveFires(days: number = 1): Promise<GeoJSONFeatureCollection> {
  const cacheKey = `fires_${days}`;

  // Check cache
  if (dataCache[cacheKey] && Date.now() - dataCache[cacheKey].timestamp < CACHE_DURATION) {
    console.log('[Fires] Using cached data');
    return dataCache[cacheKey].data;
  }

  // If no API key, use sample data
  if (!FIRMS_MAP_KEY) {
    console.log('[Fires] No NASA FIRMS API key - using sample data. Set VITE_NASA_FIRMS_KEY for live data.');
    return SAMPLE_FIRES;
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
    console.log('[Fires] Using sample data as fallback');
    return SAMPLE_FIRES;
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
 * Falls back to sample data if API unavailable (CORS)
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

    // Check if we got valid data
    if (!geojson.features || geojson.features.length === 0) {
      console.log('[Parks] No data from API - using sample data');
      return SAMPLE_NATIONAL_PARKS;
    }

    // Cache the result
    dataCache[cacheKey] = { data: geojson, timestamp: Date.now() };
    console.log(`[Parks] Loaded ${geojson.features?.length || 0} national parks`);

    return geojson;
  } catch (error) {
    console.error('[Parks] Error fetching parks data:', error);
    console.log('[Parks] Using sample data (API may have CORS restrictions)');
    return SAMPLE_NATIONAL_PARKS;
  }
}

/**
 * Fetch State Forests from ABARES Forests of Australia dataset
 * Falls back to sample data if API unavailable (CORS)
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

    // Check if we got valid data
    if (!geojson.features || geojson.features.length === 0) {
      console.log('[Forests] No data from API - using sample data');
      return SAMPLE_STATE_FORESTS;
    }

    // Cache the result
    dataCache[cacheKey] = { data: geojson, timestamp: Date.now() };
    console.log(`[Forests] Loaded ${geojson.features?.length || 0} state forests`);

    return geojson;
  } catch (error) {
    console.error('[Forests] Error fetching forests data:', error);
    console.log('[Forests] Using sample data (API may have CORS restrictions)');
    return SAMPLE_STATE_FORESTS;
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
 * Falls back to sample data if API unavailable (CORS)
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

    // Check if we got valid data
    if (!geojson.features || geojson.features.length === 0) {
      console.log(`[Coverage] No data from API for ${carrier} - using sample data`);
      return addCarrierInfo(SAMPLE_MOBILE_COVERAGE[carrier] || { type: 'FeatureCollection', features: [] }, carrier);
    }

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
    console.log(`[Coverage] Using sample data for ${carrier} (API may have CORS restrictions)`);
    return addCarrierInfo(SAMPLE_MOBILE_COVERAGE[carrier] || { type: 'FeatureCollection', features: [] }, carrier);
  }
}

/**
 * Add carrier info to sample data features
 */
function addCarrierInfo(data: GeoJSONFeatureCollection, carrier: CarrierKey): GeoJSONFeatureCollection {
  return {
    ...data,
    features: data.features.map(f => ({
      ...f,
      properties: {
        ...f.properties,
        carrier: MOBILE_CARRIERS[carrier].name,
        carrierKey: carrier,
        color: MOBILE_CARRIERS[carrier].color
      }
    }))
  };
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
