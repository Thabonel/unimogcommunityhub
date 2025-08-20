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
    
    // Return default (US) if geolocation fails
    return {
      country: 'United States',
      countryCode: 'US'
    };
  }
}

/**
 * Get country from browser locale as fallback
 */
export function getCountryFromBrowserLocale(): GeolocationResult {
  try {
    // Try multiple sources to detect country
    const sources = [
      navigator.language,
      ...navigator.languages,
      'en-US' // Final fallback
    ];
    
    console.log('🌐 Available locales:', sources);
    
    for (const locale of sources) {
      const parts = locale.split('-');
      if (parts.length > 1) {
        const countryCode = parts[1].toUpperCase();
        
        // Skip if it's a script code (like 'Hans' in zh-Hans-CN)
        if (countryCode.length === 2) {
          console.log('🌐 Detected country from locale', { locale, countryCode });
          
          // Map common country codes to names
          const countryNames: Record<string, string> = {
            'US': 'United States',
            'AU': 'Australia', 
            'GB': 'United Kingdom',
            'CA': 'Canada',
            'DE': 'Germany',
            'FR': 'France',
            'NZ': 'New Zealand',
            'JP': 'Japan',
            'IN': 'India',
            'BR': 'Brazil',
            'ZA': 'South Africa',
            'NL': 'Netherlands',
            'IT': 'Italy',
            'ES': 'Spain',
          };
          
          return {
            country: countryNames[countryCode] || countryCode,
            countryCode: countryCode
          };
        }
      }
    }
    
    // Try timezone as another fallback
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('🌐 Detected timezone:', timezone);
    
    // Map some common timezones to countries
    if (timezone.includes('Australia')) {
      return { country: 'Australia', countryCode: 'AU' };
    } else if (timezone.includes('America/New_York') || timezone.includes('America/Los_Angeles')) {
      return { country: 'United States', countryCode: 'US' };
    } else if (timezone.includes('Europe/London')) {
      return { country: 'United Kingdom', countryCode: 'GB' };
    }
    
  } catch (error) {
    console.error('Error getting country from browser locale:', error);
  }

  // Ultimate fallback - force USD since most users are likely not in Australia
  console.log('🌐 Using ultimate fallback (US)');
  return {
    country: 'United States',
    countryCode: 'US'
  };
}

/**
 * Clear geolocation cache (useful for testing)
 */
export function clearGeolocationCache(): void {
  localStorage.removeItem(GEO_CACHE_KEY);
  console.log('🗑️ Geolocation cache cleared');
}