
import { v4 as uuidv4 } from 'uuid';
import { Track, TrackSegment } from '@/types/track';
import { calculateTrackDistance, calculateElevationGain } from './calculations';

/**
 * Convert GeoJSON to our Track format
 */
export const geoJsonToTrack = (geoJson: GeoJSON.FeatureCollection, fileName: string): Track => {
  const track: Track = {
    id: uuidv4(),
    name: fileName.replace(/\.[^/.]+$/, ''), // Remove file extension
    description: '',
    source_type: 'GPX',
    segments: [],
    created_at: new Date().toISOString(),
    is_public: false,
    color: '#' + Math.floor(Math.random()*16777215).toString(16), // Generate random color
    visible: true
  };

  // Process the features to extract track segments
  geoJson.features.forEach(feature => {
    if (feature.geometry.type === 'LineString') {
      const lineString = feature.geometry as GeoJSON.LineString;
      
      const segment: TrackSegment = {
        points: lineString.coordinates.map(coord => ({
          longitude: coord[0],
          latitude: coord[1],
          elevation: coord[2] || undefined
        }))
      };
      
      track.segments.push(segment);
    }
  });

  // Calculate track metrics if possible
  track.distance_km = calculateTrackDistance(track);
  track.elevation_gain = calculateElevationGain(track);
  
  return track;
};
