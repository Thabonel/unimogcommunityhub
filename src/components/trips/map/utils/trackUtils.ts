
import * as toGeoJSON from '@tmcw/togeojson';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import { Track, TrackSegment, TrackPoint } from '@/types/track';

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

/**
 * Calculate the total distance of a track in kilometers
 */
const calculateTrackDistance = (track: Track): number => {
  let totalDistance = 0;
  
  track.segments.forEach(segment => {
    const points = segment.points;
    for (let i = 1; i < points.length; i++) {
      totalDistance += calculateDistance(
        points[i-1].latitude, points[i-1].longitude,
        points[i].latitude, points[i].longitude
      );
    }
  });
  
  return parseFloat(totalDistance.toFixed(2));
};

/**
 * Calculate distance between two coordinates using the Haversine formula
 */
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

/**
 * Calculate the total elevation gain in meters
 */
const calculateElevationGain = (track: Track): number | undefined => {
  let totalGain = 0;
  
  track.segments.forEach(segment => {
    const points = segment.points;
    for (let i = 1; i < points.length; i++) {
      const prevElevation = points[i-1].elevation;
      const currElevation = points[i].elevation;
      
      if (prevElevation !== undefined && currElevation !== undefined) {
        const diff = currElevation - prevElevation;
        if (diff > 0) totalGain += diff;
      }
    }
  });
  
  return totalGain > 0 ? Math.round(totalGain) : undefined;
};

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
