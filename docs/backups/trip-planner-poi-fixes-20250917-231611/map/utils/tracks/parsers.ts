
import * as toGeoJSON from '@tmcw/togeojson';
import { togpx } from 'togpx';
import { toast } from 'sonner';

/**
 * Parse a GPX file and convert it to GeoJSON
 */
export const parseGpxFile = (gpxData: string): GeoJSON.FeatureCollection | null => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxData, 'text/xml');
    
    // Check if parsing was successful
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid GPX file format');
    }
    
    // Convert to GeoJSON using togeojson library
    const geoJson = toGeoJSON.gpx(xmlDoc);
    return geoJson;
  } catch (error) {
    console.error('Error parsing GPX file:', error);
    toast.error('Failed to parse GPX file. Please ensure it\'s a valid GPX format.');
    return null;
  }
};

/**
 * Convert Track to GeoJSON format
 */
export const trackToGeoJson = (track: Track): GeoJSON.FeatureCollection => {
  const features: GeoJSON.Feature[] = track.segments.map(segment => {
    const coordinates = segment.points.map(point => [
      point.longitude,
      point.latitude,
      point.elevation || 0
    ]);
    
    return {
      type: 'Feature',
      properties: {
        name: track.name,
        description: track.description || '',
        color: track.color || '#FF0000'
      },
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    };
  });
  
  return {
    type: 'FeatureCollection',
    features
  };
};

// Import Track type
import { Track } from '@/types/track';
