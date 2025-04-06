
import { TrackSegment } from '@/types/track';

/**
 * Converts a GeoJSON LineString to a TrackSegment
 */
export function lineStringToTrackSegment(
  lineString: GeoJSON.Feature<GeoJSON.LineString>, 
  options: {
    type?: string;
    elevation_gain?: number;
    distance?: number;
    duration?: number;
  } = {}
): TrackSegment {
  const coordinates = lineString.geometry.coordinates as [number, number][];
  const { elevation_gain = 0, type = 'unknown', distance = 0, duration = 0 } = options;
  
  // Extract elevation data if available (GeoJSON can store elevation as 3rd coordinate)
  const points = coordinates.map(coord => {
    // Handle both [lng, lat] and [lng, lat, elevation] formats
    return {
      longitude: coord[0],
      latitude: coord[1],
      elevation: coord.length > 2 ? coord[2] : undefined
    };
  });
  
  const segment: TrackSegment = {
    coordinates,
    distance,
    duration,
    elevation_gain,
    type,
    points
  };
  
  return segment;
}

/**
 * Converts a GPX track segment to a TrackSegment
 */
export function gpxSegmentToTrackSegment(
  gpxSegment: any, 
  options: {
    type?: string;
    elevation_gain?: number;
  } = {}
): TrackSegment {
  // Map GPX points to our format
  const points = gpxSegment.points.map((pt: any) => ({
    latitude: pt.lat,
    longitude: pt.lon,
    elevation: pt.ele
  }));
  
  // Extract coordinates for simplicity
  const coordinates = points.map((pt: any) => [pt.longitude, pt.latitude] as [number, number]);
  
  // Calculate distance if not provided (simplified calculation)
  let distance = 0;
  for (let i = 1; i < points.length; i++) {
    distance += calculateDistance(
      points[i-1].latitude, points[i-1].longitude,
      points[i].latitude, points[i].longitude
    );
  }
  
  // Estimate duration based on average hiking speed (3 km/h)
  const duration = (distance / 3) * 60 * 60; // in seconds
  
  // Calculate elevation gain if not provided
  let elevation_gain = options.elevation_gain || 0;
  if (!options.elevation_gain && points[0].elevation) {
    elevation_gain = calculateElevationGain(points);
  }
  
  return {
    points,
    coordinates,
    distance, // in kilometers
    duration, // in seconds
    elevation_gain, // in meters
    type: options.type || 'gpx'
  };
}

// Helper to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper to calculate elevation gain from points
function calculateElevationGain(points: {elevation?: number}[]): number {
  let gain = 0;
  for (let i = 1; i < points.length; i++) {
    const prevEle = points[i-1].elevation || 0;
    const currEle = points[i].elevation || 0;
    const diff = currEle - prevEle;
    if (diff > 0) gain += diff;
  }
  return gain;
}
