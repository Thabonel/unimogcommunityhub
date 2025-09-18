
import mapboxgl from 'mapbox-gl';
import { Track } from '@/types/track';

/**
 * Add a track to the map
 */
export const addTrackToMap = (map: mapboxgl.Map, track: Track): void => {
  track.segments.forEach((segment, segIndex) => {
    const sourceId = `track-${track.id}-${segIndex}`;
    const layerId = `track-line-${track.id}-${segIndex}`;
    
    // Check if source already exists
    if (map.getSource(sourceId)) {
      map.removeLayer(layerId);
      map.removeSource(sourceId);
    }
    
    // Create GeoJSON from track segment
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: segment.points.map(point => [
          point.longitude,
          point.latitude,
          point.elevation || 0
        ])
      }
    };
    
    // Add source and layer
    map.addSource(sourceId, {
      type: 'geojson',
      data: geojson as any
    });
    
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': track.color || '#FF0000',
        'line-width': 3
      }
    });
  });
  
  // Fit map to track bounds
  fitMapToTrack(map, track);
};

/**
 * Remove a track from the map
 */
export const removeTrackFromMap = (map: mapboxgl.Map, track: Track): void => {
  track.segments.forEach((_, segIndex) => {
    const sourceId = `track-${track.id}-${segIndex}`;
    const layerId = `track-line-${track.id}-${segIndex}`;
    
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }
  });
};

/**
 * Fit the map view to include the entire track
 */
export const fitMapToTrack = (map: mapboxgl.Map, track: Track): void => {
  const bounds = new mapboxgl.LngLatBounds();
  
  track.segments.forEach(segment => {
    segment.points.forEach(point => {
      bounds.extend([point.longitude, point.latitude]);
    });
  });
  
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15
    });
  }
};
