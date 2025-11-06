/**
 * Geolocation Service
 * Converts coordinates to country information
 */

interface GeolocationResult {
  country: string;
  countryCode: string;
  city?: string;
  region?: string;
}

interface CachedGeoData {
  data: GeolocationResult;
  timestamp: number;
  coordinates: string; // lat,lng for cache key
}

const GEO_CACHE_KEY = 'geo_location_data';
const GEO_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Generate a cache key for coordinates (rounded to ~1km precision)
 */
function getCoordinateKey(lat: number, lng: number): string {
  const roundedLat = Math.round(lat * 100) / 100; // ~1km precision
  const roundedLng = Math.round(lng * 100) / 100;
  return `${roundedLat},${roundedLng}`;
}

/**
 * Get cached geolocation data if available and valid
 */
function getCachedGeoData(lat: number, lng: number): GeolocationResult | null {
  try {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (!cached) return null;

    const data: CachedGeoData = JSON.parse(cached);
    const now = Date.now();
    const coordKey = getCoordinateKey(lat, lng);
    
    // Check if cache is valid and for the same location
    if (
      now - data.timestamp < GEO_CACHE_DURATION && 
      data.coordinates === coordKey
    ) {
      console.log('🗺️ Using cached geolocation data', {
        country: data.data.country,
        age: Math.round((now - data.timestamp) / (1000 * 60 * 60 * 24)) + 'd'
      });
      return data.data;
    } else {
      console.log('🕐 Geolocation cache expired or different location');
      localStorage.removeItem(GEO_CACHE_KEY);
      return null;
    }
  } catch (error) {
    console.error('Error reading cached geolocation data:', error);
    return null;
  }
}

/**
 * Cache geolocation data
 */
function cacheGeoData(lat: number, lng: number, result: GeolocationResult): void {
  try {
    const cacheData: CachedGeoData = {
      data: result,
      timestamp: Date.now(),
      coordinates: getCoordinateKey(lat, lng)
    };
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Cached geolocation data for 7 days', { country: result.country });
  } catch (error) {
    console.error('Error caching geolocation data:', error);
  }
}

/**
 * Get country information from coordinates using reverse geocoding
 */
export async function getCountryFromCoordinates(
  latitude: number, 
  longitude: number
): Promise<GeolocationResult | null> {
  // Check cache first
  const cached = getCachedGeoData(latitude, longitude);
  if (cached) {
    return cached;
  }

  try {
    console.log('🌍 Reverse geocoding coordinates...', { latitude, longitude });

    // Using a free reverse geocoding service
    // Alternative: Nominatim (OpenStreetMap), BigDataCloud, etc.
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    const result: GeolocationResult = {
      country: data.countryName || 'Unknown',
      countryCode: data.countryCode || 'US', // Default to US
      city: data.city || data.locality,
      region: data.principalSubdivision
    };

    console.log('✅ Country detected from coordinates', result);
    
    // Cache the result
    cacheGeoData(latitude, longitude, result);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to get country from coordinates:', error);
    
    // Return default (Australia) if geolocation fails for Unimog Community Hub
    console.log('⚠️ Geolocation failed, using Australia as default');
    return {
      country: 'Australia',
      countryCode: 'AU'
    };
  }
}

/**
 * Get country from browser locale as fallback
 * For Unimog Community Hub, we prioritize Australia as the default
 */
export function getCountryFromBrowserLocale(): GeolocationResult {
  try {
    // Try timezone FIRST - most reliable indicator
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('🌐 Detected timezone:', timezone);

    // Map some common timezones to countries
    if (timezone.includes('Australia') ||
        timezone.includes('Adelaide') ||
        timezone.includes('Brisbane') ||
        timezone.includes('Darwin') ||
        timezone.includes('Hobart') ||
        timezone.includes('Melbourne') ||
        timezone.includes('Perth') ||
        timezone.includes('Sydney')) {
      console.log('🌐 Detected Australia from timezone');
      return { country: 'Australia', countryCode: 'AU' };
    }

    // Check browser locale ONLY if explicitly set to AU
    const sources = [
      navigator.language,
      ...navigator.languages
    ];

    console.log('🌐 Available locales:', sources);

    for (const locale of sources) {
      const parts = locale.split('-');
      if (parts.length > 1) {
        const countryCode = parts[1].toUpperCase();

        // ONLY use locale if it's explicitly AU
        if (countryCode === 'AU') {
          console.log('🌐 Detected Australia from locale', { locale });
          return {
            country: 'Australia',
            countryCode: 'AU'
          };
        }
      }
    }

  } catch (error) {
    console.error('Error getting country from browser locale:', error);
  }

  // Default to Australia for Unimog Community Hub (Australian-focused platform)
  console.log('🌐 Using Australia default (Unimog Community Hub)');
  return {
    country: 'Australia',
    countryCode: 'AU'
  };
}

/**
 * Clear geolocation cache (useful for testing)
 */
export function clearGeolocationCache(): void {
  localStorage.removeItem(GEO_CACHE_KEY);
  console.log('🗑️ Geolocation cache cleared');
}