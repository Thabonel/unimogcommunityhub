/**
 * GPX Processing Utilities
 * Handles GPX file parsing, processing, and conversion
 */

import { toGeoJSON } from '@tmcw/togeojson';
import * as gpxParser from 'gpxparser';

export interface GPXTrack {
  id: string;
  name: string;
  description?: string;
  distance: number; // in meters
  elevation: {
    min: number;
    max: number;
    gain: number;
    loss: number;
  };
  duration?: number; // in seconds
  waypoints: GPXWaypoint[];
  trackPoints: GPXTrackPoint[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  metadata: {
    creator?: string;
    version?: string;
    time?: string;
    keywords?: string[];
  };
}

export interface GPXWaypoint {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lon: number;
  elevation?: number;
  type?: string;
  symbol?: string;
}

export interface GPXTrackPoint {
  lat: number;
  lon: number;
  elevation?: number;
  time?: string;
  heartRate?: number;
  cadence?: number;
  speed?: number;
  distance?: number; // cumulative distance from start
}

export interface GPXParseResult {
  tracks: GPXTrack[];
  waypoints: GPXWaypoint[];
  routes: any[]; // For future route support
  metadata: {
    name?: string;
    description?: string;
    creator?: string;
    version?: string;
    time?: string;
  };
}

/**
 * Parse GPX file from File object
 */
export async function parseGPXFile(file: File): Promise<GPXParseResult> {
  const text = await file.text();
  return parseGPXString(text);
}

/**
 * Parse GPX from string content
 */
export function parseGPXString(gpxContent: string): GPXParseResult {
  try {
    // Parse using gpxparser library
    const gpx = new gpxParser.default();
    gpx.parse(gpxContent);

    const result: GPXParseResult = {
      tracks: [],
      waypoints: [],
      routes: [],
      metadata: {
        name: gpx.metadata?.name,
        description: gpx.metadata?.desc,
        creator: gpx.metadata?.creator,
        version: gpx.metadata?.version,
        time: gpx.metadata?.time,
      }
    };

    // Process tracks
    if (gpx.tracks && gpx.tracks.length > 0) {
      gpx.tracks.forEach((track: any, index: number) => {
        const processedTrack = processTrack(track, index);
        if (processedTrack) {
          result.tracks.push(processedTrack);
        }
      });
    }

    // Process waypoints
    if (gpx.waypoints && gpx.waypoints.length > 0) {
      gpx.waypoints.forEach((waypoint: any, index: number) => {
        const processedWaypoint = processWaypoint(waypoint, index);
        if (processedWaypoint) {
          result.waypoints.push(processedWaypoint);
        }
      });
    }

    return result;
  } catch (error) {
    console.error('Error parsing GPX:', error);
    throw new Error(`Failed to parse GPX file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Process a single track from the GPX data
 */
function processTrack(track: any, index: number): GPXTrack | null {
  if (!track.points || track.points.length === 0) {
    return null;
  }

  const trackPoints: GPXTrackPoint[] = track.points.map((point: any) => ({
    lat: point.lat,
    lon: point.lon,
    elevation: point.ele,
    time: point.time,
    heartRate: point.hr,
    cadence: point.cad,
    speed: point.speed,
  }));

  // Calculate cumulative distances
  let cumulativeDistance = 0;
  for (let i = 0; i < trackPoints.length; i++) {
    trackPoints[i].distance = cumulativeDistance;
    if (i > 0) {
      const distance = calculateDistance(
        trackPoints[i - 1].lat,
        trackPoints[i - 1].lon,
        trackPoints[i].lat,
        trackPoints[i].lon
      );
      cumulativeDistance += distance;
    }
  }

  // Calculate elevation data
  const elevations = trackPoints
    .map(p => p.elevation)
    .filter(e => e !== undefined) as number[];
  
  const elevation = {
    min: elevations.length > 0 ? Math.min(...elevations) : 0,
    max: elevations.length > 0 ? Math.max(...elevations) : 0,
    gain: 0,
    loss: 0,
  };

  // Calculate elevation gain/loss
  for (let i = 1; i < elevations.length; i++) {
    const diff = elevations[i] - elevations[i - 1];
    if (diff > 0) {
      elevation.gain += diff;
    } else {
      elevation.loss += Math.abs(diff);
    }
  }

  // Calculate bounds
  const lats = trackPoints.map(p => p.lat);
  const lons = trackPoints.map(p => p.lon);
  const bounds = {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lons),
    west: Math.min(...lons),
  };

  // Calculate duration if time data is available
  let duration: number | undefined;
  const timePoints = trackPoints.filter(p => p.time).map(p => new Date(p.time!));
  if (timePoints.length > 1) {
    duration = (timePoints[timePoints.length - 1].getTime() - timePoints[0].getTime()) / 1000;
  }

  return {
    id: `track_${index}`,
    name: track.name || `Track ${index + 1}`,
    description: track.desc,
    distance: cumulativeDistance,
    elevation,
    duration,
    waypoints: [], // Waypoints are processed separately
    trackPoints,
    bounds,
    metadata: {
      creator: track.creator,
      time: track.time,
    },
  };
}

/**
 * Process a single waypoint from the GPX data
 */
function processWaypoint(waypoint: any, index: number): GPXWaypoint | null {
  if (!waypoint.lat || !waypoint.lon) {
    return null;
  }

  return {
    id: `waypoint_${index}`,
    name: waypoint.name || `Waypoint ${index + 1}`,
    description: waypoint.desc,
    lat: waypoint.lat,
    lon: waypoint.lon,
    elevation: waypoint.ele,
    type: waypoint.type,
    symbol: waypoint.sym,
  };
}

/**
 * Calculate distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert GPX track to GeoJSON format
 */
export function trackToGeoJSON(track: GPXTrack) {
  const coordinates = track.trackPoints.map(point => [
    point.lon,
    point.lat,
    point.elevation || 0
  ]);

  return {
    type: 'Feature',
    properties: {
      name: track.name,
      description: track.description,
      distance: track.distance,
      elevation: track.elevation,
      duration: track.duration,
    },
    geometry: {
      type: 'LineString',
      coordinates,
    },
  };
}

/**
 * Convert waypoints to GeoJSON format
 */
export function waypointsToGeoJSON(waypoints: GPXWaypoint[]) {
  return {
    type: 'FeatureCollection',
    features: waypoints.map(waypoint => ({
      type: 'Feature',
      properties: {
        name: waypoint.name,
        description: waypoint.description,
        type: waypoint.type,
        symbol: waypoint.symbol,
      },
      geometry: {
        type: 'Point',
        coordinates: [waypoint.lon, waypoint.lat, waypoint.elevation || 0],
      },
    })),
  };
}

/**
 * Generate GPX string from track data
 */
export function generateGPX(track: GPXTrack, metadata?: any): string {
  const creator = metadata?.creator || 'UnimogCommunityHub';
  const version = metadata?.version || '1.1';
  const time = new Date().toISOString();

  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="${version}" creator="${creator}"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(track.name)}</name>
    <desc>${escapeXml(track.description || '')}</desc>
    <time>${time}</time>
  </metadata>
`;

  // Add waypoints
  track.waypoints.forEach(waypoint => {
    gpx += `  <wpt lat="${waypoint.lat}" lon="${waypoint.lon}">
    <name>${escapeXml(waypoint.name)}</name>
    ${waypoint.description ? `<desc>${escapeXml(waypoint.description)}</desc>` : ''}
    ${waypoint.elevation ? `<ele>${waypoint.elevation}</ele>` : ''}
    ${waypoint.type ? `<type>${escapeXml(waypoint.type)}</type>` : ''}
    ${waypoint.symbol ? `<sym>${escapeXml(waypoint.symbol)}</sym>` : ''}
  </wpt>
`;
  });

  // Add track
  gpx += `  <trk>
    <name>${escapeXml(track.name)}</name>
    ${track.description ? `<desc>${escapeXml(track.description)}</desc>` : ''}
    <trkseg>
`;

  track.trackPoints.forEach(point => {
    gpx += `      <trkpt lat="${point.lat}" lon="${point.lon}">
`;
    if (point.elevation) {
      gpx += `        <ele>${point.elevation}</ele>
`;
    }
    if (point.time) {
      gpx += `        <time>${point.time}</time>
`;
    }
    gpx += `      </trkpt>
`;
  });

  gpx += `    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validate GPX file
 */
export function validateGPXFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Basic XML validation
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'application/xml');
        
        // Check for parsing errors
        const errorNode = doc.querySelector('parsererror');
        if (errorNode) {
          resolve(false);
          return;
        }

        // Check for GPX root element
        const gpxElement = doc.querySelector('gpx');
        if (!gpxElement) {
          resolve(false);
          return;
        }

        resolve(true);
      } catch (error) {
        resolve(false);
      }
    };
    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

/**
 * Format elevation for display
 */
export function formatElevation(meters: number): string {
  return `${Math.round(meters)} m`;
}