
import { TrackSegment, Track } from '@/types/track';

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
  const coordinates = lineString.geometry.coordinates as [number, number][] | [number, number, number][];
  const { elevation_gain = 0, type = 'unknown', distance = 0, duration = 0 } = options;
  
  // Extract elevation data if available (GeoJSON can store elevation as 3rd coordinate)
  const points = coordinates.map(coord => {
    // Handle both [lng, lat] and [lng, lat, elevation] formats
    // Check if elevation exists before accessing it
    const hasElevation = coord.length > 2;
    
    return {
      longitude: coord[0],
      latitude: coord[1],
      elevation: hasElevation ? (coord as [number, number, number])[2] : undefined
    };
  });
  
  const segment: TrackSegment = {
    coordinates: coordinates.map(coord => [coord[0], coord[1]]),
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

/**
 * Converts a GeoJSON FeatureCollection to a Track
 */
export function geoJsonToTrack(
  geoJson: GeoJSON.FeatureCollection,
  name: string = 'Imported Track'
): Track {
  const segments: TrackSegment[] = [];
  const now = new Date().toISOString();
  
  // Process each feature in the collection
  geoJson.features.forEach(feature => {
    if (feature.geometry.type === 'LineString') {
      const segment = lineStringToTrackSegment(feature as GeoJSON.Feature<GeoJSON.LineString>, {
        type: feature.properties?.type || 'unknown',
        elevation_gain: feature.properties?.elevation_gain,
        distance: feature.properties?.distance,
        duration: feature.properties?.duration
      });
      segments.push(segment);
    }
  });
  
  // Calculate total distance and elevation gain
  const distance_km = segments.reduce((total, segment) => total + segment.distance, 0);
  const elevation_gain = segments.reduce((total, segment) => total + (segment.elevation_gain || 0), 0);
  
  // Create the track object
  const track: Track = {
    id: `temp-${Date.now()}`,
    name,
    description: '',
    segments,
    distance_km,
    elevation_gain,
    source_type: 'geojson',
    created_at: now,
    is_public: false,
    visible: true,
    difficulty: 'beginner'
  };
  
  return track;
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
