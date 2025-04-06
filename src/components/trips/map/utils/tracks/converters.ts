
import { v4 as uuidv4 } from 'uuid';
import { Feature, FeatureCollection } from 'geojson';
import { Track, TrackSegment } from '@/types/track';

/**
 * Converts GeoJSON data to a Track object
 */
export function geoJsonToTrack(geoJson: FeatureCollection, name: string = ''): Track {
  // Default track properties
  const track: Track = {
    id: uuidv4(), // Generate a UUID for the track
    name: name || 'Imported Track',
    segments: [],
    source_type: 'gpx_import',
    created_at: new Date().toISOString(),
    is_public: false,
    visible: true
  };

  let totalDistance = 0;
  let totalElevationGain = 0;

  // Process each feature in the GeoJSON
  geoJson.features.forEach((feature: Feature) => {
    if (feature.geometry.type === 'LineString') {
      const coordinates = feature.geometry.coordinates as [number, number][];
      
      // Calculate distance and elevation gain for this segment
      const segmentDistance = calculateTrackDistance(coordinates);
      const segmentElevationGain = calculateElevationGain(coordinates);
      
      // Create a track segment
      const segment: TrackSegment = {
        distance: segmentDistance,
        duration: estimateDuration(segmentDistance),
        coordinates: coordinates,
        elevation_gain: segmentElevationGain,
        type: 'trail' // Default type
      };
      
      // Add segment to the track
      track.segments.push(segment);
      
      // Update totals
      totalDistance += segmentDistance;
      totalElevationGain += segmentElevationGain;
    }
  });
  
  // Set the calculated totals on the track
  track.distance_km = totalDistance;
  track.elevation_gain = totalElevationGain;
  
  return track;
}

/**
 * Calculate the total distance of a track segment in kilometers
 */
function calculateTrackDistance(coordinates: [number, number][]): number {
  if (coordinates.length < 2) return 0;
  
  let totalDistance = 0;
  
  for (let i = 1; i < coordinates.length; i++) {
    const [lon1, lat1] = coordinates[i - 1];
    const [lon2, lat2] = coordinates[i];
    
    // Simple Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    totalDistance += distance;
  }
  
  return Math.round(totalDistance * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate the total elevation gain in meters
 */
function calculateElevationGain(coordinates: [number, number][]): number {
  if (coordinates.length < 2) return 0;
  
  let totalGain = 0;
  
  // In a real implementation, we'd use the elevation data from the coordinates
  // For this example, we'll return an estimated value based on distance
  // Assuming an average 2% grade for demonstration purposes
  const distance = calculateTrackDistance(coordinates);
  totalGain = distance * 1000 * 0.02; // Convert km to m and apply 2% grade
  
  return Math.round(totalGain);
}

/**
 * Estimate duration based on distance
 * Assumes an average speed of 5 km/h for hiking
 */
function estimateDuration(distanceKm: number): number {
  const averageSpeedKmh = 5;
  return Math.round(distanceKm / averageSpeedKmh * 60); // Duration in minutes
}
