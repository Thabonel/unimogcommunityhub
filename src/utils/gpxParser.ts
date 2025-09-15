/**
 * GPX/KML parser using toGeoJSON library for extracting track coordinates
 */

import { kml, gpx } from '@tmcw/togeojson';

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
 * Parse GPX/KML string and extract track data using toGeoJSON library
 */
export function parseGPX(fileString: string, fileName?: string): ParsedTrack | null {
  try {
    // Clean and validate input
    const cleanString = fileString.trim();
    if (!cleanString) {
      console.error('Empty file content');
      return null;
    }

    // Check if it starts with XML declaration or tag
    if (!cleanString.startsWith('<?xml') && !cleanString.startsWith('<')) {
      console.error('File does not appear to be XML format');
      return null;
    }

    // Parse XML document
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanString, 'text/xml');

    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      console.error('XML parsing error:', parserError.textContent);
      return null;
    }

    // Determine file type and use appropriate toGeoJSON converter
    let geoJson: any;
    const isKML = fileName?.toLowerCase().endsWith('.kml') ||
                  doc.documentElement.tagName.toLowerCase() === 'kml' ||
                  doc.querySelector('kml') !== null;

    if (isKML) {
      console.log('Parsing as KML file...');
      geoJson = kml(doc);
    } else {
      console.log('Parsing as GPX file...');
      geoJson = gpx(doc);
    }

    if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
      console.error('No features found in parsed GeoJSON');
      return null;
    }

    // Extract track data from GeoJSON
    return extractTrackFromGeoJSON(geoJson);

  } catch (error) {
    console.error('Error parsing GPX/KML:', error);
    return null;
  }
}

/**
 * Extract track data from GeoJSON features
 */
function extractTrackFromGeoJSON(geoJson: any): ParsedTrack | null {
  try {
    // Find the first LineString feature (track/route)
    let trackFeature = geoJson.features.find((feature: any) =>
      feature.geometry && feature.geometry.type === 'LineString'
    );

    // If no LineString found, try MultiLineString
    if (!trackFeature) {
      trackFeature = geoJson.features.find((feature: any) =>
        feature.geometry && feature.geometry.type === 'MultiLineString'
      );
    }

    if (!trackFeature) {
      console.error('No LineString or MultiLineString feature found');
      return null;
    }

    const coordinates = trackFeature.geometry.type === 'MultiLineString'
      ? trackFeature.geometry.coordinates[0] // Take first line from MultiLineString
      : trackFeature.geometry.coordinates;

    if (!coordinates || coordinates.length === 0) {
      console.error('No coordinates found in track feature');
      return null;
    }

    // Extract name from feature properties
    const name = trackFeature.properties?.name ||
                 trackFeature.properties?.title ||
                 geoJson.features[0]?.properties?.name ||
                 'Unnamed Track';

    // Convert coordinates to TrackPoint array
    const points: TrackPoint[] = [];
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    coordinates.forEach((coord: number[]) => {
      const [lon, lat, ele] = coord;

      if (typeof lat === 'number' && typeof lon === 'number') {
        // Update bounds
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);

        points.push({
          lat,
          lon,
          ele: typeof ele === 'number' ? ele : undefined
        });
      }
    });

    if (points.length === 0) {
      console.error('No valid points extracted from coordinates');
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
    console.error('Error extracting track from GeoJSON:', error);
    return null;
  }
}

/**
 * Parse KML string and extract track data (deprecated - use parseGPX)
 */
export function parseKML(kmlString: string): ParsedTrack | null {
  console.warn('parseKML is deprecated, use parseGPX instead');
  return parseGPX(kmlString, 'file.kml');
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