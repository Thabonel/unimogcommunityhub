/**
 * Simple GPX parser for extracting track coordinates
 */

export interface TrackPoint {
  lat: number;
  lon: number;
  ele?: number;
  time?: string;
}

export interface ParsedTrack {
  name: string;
  points: TrackPoint[];
  totalDistance: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

/**
 * Parse GPX string and extract track data
 */
export function parseGPX(gpxString: string): ParsedTrack | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpxString, 'text/xml');
    
    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.error('GPX parsing error:', parserError.textContent);
      return null;
    }
    
    // Get track name
    const nameElement = doc.querySelector('trk > name');
    const name = nameElement?.textContent || 'Unnamed Track';
    
    // Get all track points
    const trackPoints = doc.querySelectorAll('trkpt');
    if (trackPoints.length === 0) {
      console.error('No track points found in GPX');
      return null;
    }
    
    const points: TrackPoint[] = [];
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;
    
    trackPoints.forEach(point => {
      const lat = parseFloat(point.getAttribute('lat') || '0');
      const lon = parseFloat(point.getAttribute('lon') || '0');
      
      if (lat && lon) {
        // Update bounds
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        
        // Get optional elevation
        const eleElement = point.querySelector('ele');
        const ele = eleElement ? parseFloat(eleElement.textContent || '0') : undefined;
        
        // Get optional time
        const timeElement = point.querySelector('time');
        const time = timeElement?.textContent || undefined;
        
        points.push({ lat, lon, ele, time });
      }
    });
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      totalDistance += calculateDistance(
        points[i - 1].lat,
        points[i - 1].lon,
        points[i].lat,
        points[i].lon
      );
    }
    
    return {
      name,
      points,
      totalDistance,
      bounds: { minLat, maxLat, minLon, maxLon }
    };
  } catch (error) {
    console.error('Error parsing GPX:', error);
    return null;
  }
}

/**
 * Parse KML string and extract track data
 */
export function parseKML(kmlString: string): ParsedTrack | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(kmlString, 'text/xml');
    
    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.error('KML parsing error:', parserError.textContent);
      return null;
    }
    
    // Get placemark name
    const nameElement = doc.querySelector('Placemark > name');
    const name = nameElement?.textContent || 'Unnamed Track';
    
    // Get coordinates
    const coordinatesElement = doc.querySelector('coordinates');
    if (!coordinatesElement) {
      console.error('No coordinates found in KML');
      return null;
    }
    
    const coordinatesText = coordinatesElement.textContent || '';
    const coordinatePairs = coordinatesText.trim().split(/\s+/);
    
    const points: TrackPoint[] = [];
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;
    
    coordinatePairs.forEach(pair => {
      const [lonStr, latStr, eleStr] = pair.split(',');
      const lat = parseFloat(latStr);
      const lon = parseFloat(lonStr);
      
      if (!isNaN(lat) && !isNaN(lon)) {
        // Update bounds
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        
        const ele = eleStr ? parseFloat(eleStr) : undefined;
        points.push({ lat, lon, ele });
      }
    });
    
    if (points.length === 0) {
      console.error('No valid coordinates found in KML');
      return null;
    }
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      totalDistance += calculateDistance(
        points[i - 1].lat,
        points[i - 1].lon,
        points[i].lat,
        points[i].lon
      );
    }
    
    return {
      name,
      points,
      totalDistance,
      bounds: { minLat, maxLat, minLon, maxLon }
    };
  } catch (error) {
    console.error('Error parsing KML:', error);
    return null;
  }
}

/**
 * Convert parsed track to GeoJSON for Mapbox
 */
export function trackToGeoJSON(track: ParsedTrack): GeoJSON.Feature {
  return {
    type: 'Feature',
    properties: {
      name: track.name,
      distance: track.totalDistance
    },
    geometry: {
      type: 'LineString',
      coordinates: track.points.map(p => [p.lon, p.lat, p.ele || 0])
    }
  };
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}