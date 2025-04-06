
import { togpx } from 'togpx';
import { toast } from 'sonner';
import { Track } from '@/types/track';
import { trackToGeoJson } from './parsers';

/**
 * Export track to GPX file
 */
export const exportTrackToGpx = (track: Track): void => {
  try {
    // Convert track to GeoJSON
    const geoJson = trackToGeoJson(track);
    
    // Convert GeoJSON to GPX using togpx library
    const gpxData = togpx(geoJson);
    
    // Create a blob and download the file
    const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${track.name || 'track'}.gpx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported: ${track.name || 'track'}.gpx`);
  } catch (error) {
    console.error('Error exporting GPX:', error);
    toast.error('Failed to export GPX file');
  }
};
