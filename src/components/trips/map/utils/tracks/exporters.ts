
import togpx from 'togpx';
import { Track } from '@/types/track';
import { saveTrack } from '@/services/trackCommentService';

/**
 * Export a track as a GPX file for download
 */
export function exportTrackToGpx(track: Track): void {
  try {
    // Convert the track to GeoJSON format
    const geoJson = trackToGeoJson(track);
    
    // Convert GeoJSON to GPX format
    const gpxData = togpx(geoJson);
    
    // Create a blob from the GPX data
    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    
    // Create a download URL
    const url = URL.createObjectURL(blob);
    
    // Create a link element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.name || 'track'}.gpx`;
    
    // Add to DOM, trigger download, and clean up
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting track to GPX:', error);
  }
}

/**
 * Save track to the database
 */
export async function saveTrackToDatabase(track: Track): Promise<string | null> {
  return await saveTrack(track);
}

/**
 * Convert a track to GeoJSON format
 */
function trackToGeoJson(track: Track) {
  // Create GeoJSON FeatureCollection
  const featureCollection = {
    type: 'FeatureCollection',
    features: [] as any[]
  };
  
  // Process each segment in the track
  track.segments.forEach((segment, index) => {
    // Create a LineString feature for this segment
    const feature = {
      type: 'Feature',
      properties: {
        name: `${track.name} - Segment ${index + 1}`,
        type: segment.type || 'unknown',
        distance: segment.distance || 0,
        duration: segment.duration || 0,
        elevation_gain: segment.elevation_gain || 0
      },
      geometry: {
        type: 'LineString',
        coordinates: segment.coordinates || []
      }
    };
    
    featureCollection.features.push(feature);
  });
  
  return featureCollection;
}
