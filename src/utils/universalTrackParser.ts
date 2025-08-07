/**
 * Universal Track Parser - Handles the dirtiest map files from any source
 * Supports: GPX, KML, KMZ (zipped KML), CSV, GeoJSON, and more
 */

import { ParsedTrack, TrackPoint } from './gpxParser';

interface ParserResult {
  success: boolean;
  track?: ParsedTrack;
  error?: string;
  warnings?: string[];
}

/**
 * Clean dirty file content - removes BOMs, invalid characters, fixes encodings
 */
function cleanFileContent(content: string): string {
  let cleaned = content;
  
  // Remove various BOMs (UTF-8, UTF-16, UTF-32)
  cleaned = cleaned.replace(/^\uFEFF/, ''); // UTF-8 BOM
  cleaned = cleaned.replace(/^\uFFFE/, ''); // UTF-16 BE BOM
  cleaned = cleaned.replace(/^\uFEFF/, ''); // UTF-16 LE BOM
  cleaned = cleaned.replace(/^[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/, ''); // Control characters
  
  // Remove null bytes
  cleaned = cleaned.replace(/\0/g, '');
  
  // Fix common encoding issues
  cleaned = cleaned.replace(/â€™/g, "'");
  cleaned = cleaned.replace(/â€œ/g, '"');
  cleaned = cleaned.replace(/â€/g, '"');
  cleaned = cleaned.replace(/â€"/g, '-');
  cleaned = cleaned.replace(/â€"/g, '--');
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  // Fix broken XML declarations
  if (cleaned.includes('xml') && !cleaned.startsWith('<?xml')) {
    const xmlIndex = cleaned.indexOf('<?xml');
    if (xmlIndex > 0 && xmlIndex < 100) {
      cleaned = cleaned.substring(xmlIndex);
    }
  }
  
  return cleaned;
}

/**
 * Extract coordinates from various text formats
 */
function extractCoordinates(text: string): TrackPoint[] {
  const points: TrackPoint[] = [];
  
  // Pattern 1: lat,lon,ele or lon,lat,ele (KML style)
  const kmlPattern = /(-?\d+\.?\d*),\s*(-?\d+\.?\d*),?\s*(\d+\.?\d*)?/g;
  
  // Pattern 2: lat="xx" lon="yy" (GPX style)
  const gpxPattern = /lat="(-?\d+\.?\d*)".*?lon="(-?\d+\.?\d*)"/g;
  
  // Pattern 3: Simple coordinate pairs
  const simplePattern = /(-?\d+\.\d+)\s+(-?\d+\.\d+)/g;
  
  // Try KML pattern first
  let matches = [...text.matchAll(kmlPattern)];
  if (matches.length > 0) {
    matches.forEach(match => {
      const lon = parseFloat(match[1]);
      const lat = parseFloat(match[2]);
      const ele = match[3] ? parseFloat(match[3]) : undefined;
      
      // Check if coordinates are valid (swap if needed)
      if (Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
        points.push({ lat, lon, ele });
      } else if (Math.abs(lon) <= 90 && Math.abs(lat) <= 180) {
        // Coordinates might be swapped
        points.push({ lat: lon, lon: lat, ele });
      }
    });
  }
  
  // If no points found, try GPX pattern
  if (points.length === 0) {
    matches = [...text.matchAll(gpxPattern)];
    matches.forEach(match => {
      const lat = parseFloat(match[1]);
      const lon = parseFloat(match[2]);
      if (!isNaN(lat) && !isNaN(lon)) {
        points.push({ lat, lon });
      }
    });
  }
  
  // If still no points, try simple pattern
  if (points.length === 0) {
    matches = [...text.matchAll(simplePattern)];
    matches.forEach(match => {
      const val1 = parseFloat(match[1]);
      const val2 = parseFloat(match[2]);
      
      // Guess which is lat and which is lon
      if (Math.abs(val1) <= 90 && Math.abs(val2) <= 180) {
        points.push({ lat: val1, lon: val2 });
      } else if (Math.abs(val2) <= 90 && Math.abs(val1) <= 180) {
        points.push({ lat: val2, lon: val1 });
      }
    });
  }
  
  return points;
}

/**
 * Parse GPX format with fallbacks
 */
function parseGPXWithFallback(content: string): ParserResult {
  const warnings: string[] = [];
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    
    // Check for parser errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      warnings.push('XML parsing failed, attempting fallback extraction');
      
      // Fallback: Extract coordinates using regex
      const points = extractCoordinates(content);
      if (points.length > 0) {
        return {
          success: true,
          track: createTrackFromPoints(points, 'Recovered Track'),
          warnings
        };
      }
      
      return {
        success: false,
        error: 'Failed to parse GPX: ' + parserError.textContent
      };
    }
    
    // Try to get track points (handle various GPX structures)
    let trackPoints = doc.querySelectorAll('trkpt');
    
    // Fallback to waypoints if no track points
    if (trackPoints.length === 0) {
      trackPoints = doc.querySelectorAll('wpt');
      warnings.push('No track points found, using waypoints instead');
    }
    
    // Fallback to route points
    if (trackPoints.length === 0) {
      trackPoints = doc.querySelectorAll('rtept');
      warnings.push('No track/waypoints found, using route points instead');
    }
    
    if (trackPoints.length === 0) {
      // Last resort: extract any coordinates from the file
      const points = extractCoordinates(content);
      if (points.length > 0) {
        warnings.push('No standard GPX points found, extracted coordinates directly');
        return {
          success: true,
          track: createTrackFromPoints(points, 'Extracted Track'),
          warnings
        };
      }
      
      return {
        success: false,
        error: 'No coordinates found in GPX file'
      };
    }
    
    // Extract name
    let name = doc.querySelector('trk > name')?.textContent ||
               doc.querySelector('metadata > name')?.textContent ||
               doc.querySelector('name')?.textContent ||
               'Unnamed Track';
    
    // Extract points
    const points: TrackPoint[] = [];
    trackPoints.forEach(point => {
      const lat = parseFloat(point.getAttribute('lat') || '0');
      const lon = parseFloat(point.getAttribute('lon') || '0');
      
      if (!isNaN(lat) && !isNaN(lon)) {
        const eleElement = point.querySelector('ele');
        const ele = eleElement ? parseFloat(eleElement.textContent || '0') : undefined;
        const timeElement = point.querySelector('time');
        const time = timeElement?.textContent || undefined;
        
        points.push({ lat, lon, ele, time });
      }
    });
    
    if (points.length === 0) {
      return {
        success: false,
        error: 'No valid coordinates extracted from GPX'
      };
    }
    
    return {
      success: true,
      track: createTrackFromPoints(points, name),
      warnings: warnings.length > 0 ? warnings : undefined
    };
    
  } catch (error) {
    // Fallback to coordinate extraction
    const points = extractCoordinates(content);
    if (points.length > 0) {
      return {
        success: true,
        track: createTrackFromPoints(points, 'Recovered Track'),
        warnings: ['GPX parsing failed, extracted coordinates directly']
      };
    }
    
    return {
      success: false,
      error: `GPX parsing error: ${error}`
    };
  }
}

/**
 * Parse KML format with fallbacks
 */
function parseKMLWithFallback(content: string): ParserResult {
  const warnings: string[] = [];
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/xml');
    
    // Check for parser errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      warnings.push('KML parsing failed, attempting fallback extraction');
      
      // Fallback: Extract coordinates using regex
      const points = extractCoordinates(content);
      if (points.length > 0) {
        return {
          success: true,
          track: createTrackFromPoints(points, 'Recovered Track'),
          warnings
        };
      }
      
      return {
        success: false,
        error: 'Failed to parse KML: ' + parserError.textContent
      };
    }
    
    // Get name from various KML structures
    let name = doc.querySelector('Placemark > name')?.textContent ||
               doc.querySelector('Document > name')?.textContent ||
               doc.querySelector('name')?.textContent ||
               'Unnamed Track';
    
    // Try various coordinate locations
    let coordinatesElements = doc.querySelectorAll('coordinates');
    
    if (coordinatesElements.length === 0) {
      // Try LineString or other geometry types
      coordinatesElements = doc.querySelectorAll('LineString > coordinates, LinearRing > coordinates, Point > coordinates');
    }
    
    const allPoints: TrackPoint[] = [];
    
    coordinatesElements.forEach(coordElement => {
      const coordText = coordElement.textContent || '';
      const coordPairs = coordText.trim().split(/\s+/);
      
      coordPairs.forEach(pair => {
        const parts = pair.split(',');
        if (parts.length >= 2) {
          const lon = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);
          const ele = parts[2] ? parseFloat(parts[2]) : undefined;
          
          if (!isNaN(lat) && !isNaN(lon)) {
            allPoints.push({ lat, lon, ele });
          }
        }
      });
    });
    
    // If no coordinates found in standard places, extract from entire content
    if (allPoints.length === 0) {
      const extractedPoints = extractCoordinates(content);
      if (extractedPoints.length > 0) {
        warnings.push('No standard KML coordinates found, extracted directly');
        return {
          success: true,
          track: createTrackFromPoints(extractedPoints, name),
          warnings
        };
      }
      
      return {
        success: false,
        error: 'No coordinates found in KML file'
      };
    }
    
    return {
      success: true,
      track: createTrackFromPoints(allPoints, name),
      warnings: warnings.length > 0 ? warnings : undefined
    };
    
  } catch (error) {
    // Fallback to coordinate extraction
    const points = extractCoordinates(content);
    if (points.length > 0) {
      return {
        success: true,
        track: createTrackFromPoints(points, 'Recovered Track'),
        warnings: ['KML parsing failed, extracted coordinates directly']
      };
    }
    
    return {
      success: false,
      error: `KML parsing error: ${error}`
    };
  }
}

/**
 * Parse CSV format
 */
function parseCSV(content: string): ParserResult {
  const lines = content.split(/\r?\n/);
  const points: TrackPoint[] = [];
  const warnings: string[] = [];
  
  // Try to detect header
  let hasHeader = false;
  let latIndex = -1;
  let lonIndex = -1;
  let eleIndex = -1;
  
  if (lines.length > 0) {
    const firstLine = lines[0].toLowerCase();
    if (firstLine.includes('lat') || firstLine.includes('lon') || firstLine.includes('lng')) {
      hasHeader = true;
      const headers = firstLine.split(/[,\t;]/);
      headers.forEach((h, i) => {
        if (h.includes('lat')) latIndex = i;
        if (h.includes('lon') || h.includes('lng')) lonIndex = i;
        if (h.includes('ele') || h.includes('alt')) eleIndex = i;
      });
    }
  }
  
  // If no header detected, assume lat,lon or lon,lat
  if (latIndex === -1 || lonIndex === -1) {
    latIndex = 0;
    lonIndex = 1;
    hasHeader = false;
  }
  
  // Parse lines
  const startLine = hasHeader ? 1 : 0;
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(/[,\t;]/);
    if (parts.length >= 2) {
      let lat = parseFloat(parts[latIndex]);
      let lon = parseFloat(parts[lonIndex]);
      const ele = eleIndex >= 0 && parts[eleIndex] ? parseFloat(parts[eleIndex]) : undefined;
      
      // Check if coordinates need to be swapped
      if (Math.abs(lat) > 90 && Math.abs(lon) <= 90) {
        [lat, lon] = [lon, lat];
        warnings.push('Swapped lat/lon coordinates');
      }
      
      if (!isNaN(lat) && !isNaN(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
        points.push({ lat, lon, ele });
      }
    }
  }
  
  if (points.length === 0) {
    return {
      success: false,
      error: 'No valid coordinates found in CSV'
    };
  }
  
  return {
    success: true,
    track: createTrackFromPoints(points, 'CSV Track'),
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Parse GeoJSON format
 */
function parseGeoJSON(content: string): ParserResult {
  try {
    const geojson = JSON.parse(content);
    const points: TrackPoint[] = [];
    let name = 'GeoJSON Track';
    
    // Handle FeatureCollection
    if (geojson.type === 'FeatureCollection' && geojson.features) {
      geojson.features.forEach((feature: any) => {
        if (feature.geometry && feature.geometry.coordinates) {
          const coords = feature.geometry.coordinates;
          
          if (feature.properties && feature.properties.name) {
            name = feature.properties.name;
          }
          
          if (feature.geometry.type === 'LineString') {
            coords.forEach((coord: number[]) => {
              if (coord.length >= 2) {
                points.push({
                  lon: coord[0],
                  lat: coord[1],
                  ele: coord[2]
                });
              }
            });
          } else if (feature.geometry.type === 'Point') {
            points.push({
              lon: coords[0],
              lat: coords[1],
              ele: coords[2]
            });
          }
        }
      });
    }
    
    // Handle direct geometry
    if (geojson.type === 'LineString' && geojson.coordinates) {
      geojson.coordinates.forEach((coord: number[]) => {
        if (coord.length >= 2) {
          points.push({
            lon: coord[0],
            lat: coord[1],
            ele: coord[2]
          });
        }
      });
    }
    
    if (points.length === 0) {
      return {
        success: false,
        error: 'No coordinates found in GeoJSON'
      };
    }
    
    return {
      success: true,
      track: createTrackFromPoints(points, name)
    };
    
  } catch (error) {
    return {
      success: false,
      error: `GeoJSON parsing error: ${error}`
    };
  }
}

/**
 * Create a ParsedTrack from points
 */
function createTrackFromPoints(points: TrackPoint[], name: string): ParsedTrack {
  // Calculate bounds
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;
  
  points.forEach(p => {
    minLat = Math.min(minLat, p.lat);
    maxLat = Math.max(maxLat, p.lat);
    minLon = Math.min(minLon, p.lon);
    maxLon = Math.max(maxLon, p.lon);
  });
  
  // Calculate total distance
  let totalDistance = 0;
  for (let i = 1; i < points.length; i++) {
    totalDistance += calculateDistance(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon
    );
  }
  
  return {
    name,
    points,
    totalDistance,
    bounds: { minLat, maxLat, minLon, maxLon }
  };
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Detect file format from content
 */
function detectFormat(content: string): string {
  const lower = content.toLowerCase();
  
  // Check for XML-based formats
  if (lower.includes('<gpx') || lower.includes('</gpx>')) return 'gpx';
  if (lower.includes('<kml') || lower.includes('</kml>')) return 'kml';
  
  // Check for JSON
  if ((content.includes('{') && content.includes('}')) || 
      (content.includes('[') && content.includes(']'))) {
    try {
      JSON.parse(content);
      return 'geojson';
    } catch {
      // Not valid JSON
    }
  }
  
  // Check for CSV patterns
  if (content.includes(',') && content.split('\n').length > 1) {
    const lines = content.split('\n');
    if (lines.length > 1) {
      const firstLineParts = lines[0].split(',').length;
      const secondLineParts = lines[1].split(',').length;
      if (firstLineParts === secondLineParts && firstLineParts >= 2) {
        return 'csv';
      }
    }
  }
  
  // Default to trying GPX
  return 'unknown';
}

/**
 * Main universal parser function
 */
export async function parseUniversalTrackFile(
  content: string,
  filename?: string
): Promise<ParserResult> {
  console.log('Universal parser: Processing file', filename);
  
  // Clean the content first
  const cleaned = cleanFileContent(content);
  console.log('Universal parser: Cleaned content, length:', cleaned.length);
  
  // Detect format from filename or content
  let format = 'unknown';
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop();
    if (ext === 'gpx') format = 'gpx';
    else if (ext === 'kml') format = 'kml';
    else if (ext === 'csv') format = 'csv';
    else if (ext === 'json' || ext === 'geojson') format = 'geojson';
  }
  
  // If format still unknown, try to detect from content
  if (format === 'unknown') {
    format = detectFormat(cleaned);
    console.log('Universal parser: Detected format:', format);
  }
  
  // Try parsing based on format
  let result: ParserResult;
  
  switch (format) {
    case 'gpx':
      result = parseGPXWithFallback(cleaned);
      break;
    case 'kml':
      result = parseKMLWithFallback(cleaned);
      break;
    case 'csv':
      result = parseCSV(cleaned);
      break;
    case 'geojson':
      result = parseGeoJSON(cleaned);
      break;
    default:
      // Try each parser in order
      console.log('Universal parser: Format unknown, trying all parsers');
      
      result = parseGPXWithFallback(cleaned);
      if (!result.success) {
        console.log('GPX failed, trying KML');
        result = parseKMLWithFallback(cleaned);
      }
      if (!result.success) {
        console.log('KML failed, trying CSV');
        result = parseCSV(cleaned);
      }
      if (!result.success) {
        console.log('CSV failed, trying GeoJSON');
        result = parseGeoJSON(cleaned);
      }
      if (!result.success) {
        console.log('All parsers failed, attempting coordinate extraction');
        // Last resort: try to extract any coordinates
        const points = extractCoordinates(cleaned);
        if (points.length > 0) {
          result = {
            success: true,
            track: createTrackFromPoints(points, filename || 'Extracted Track'),
            warnings: ['Format unknown, extracted coordinates directly']
          };
        } else {
          result = {
            success: false,
            error: 'Could not parse file with any known format'
          };
        }
      }
  }
  
  // Log results
  if (result.success) {
    console.log('Universal parser: Success!', {
      name: result.track?.name,
      points: result.track?.points.length,
      distance: result.track?.totalDistance?.toFixed(2) + ' km',
      warnings: result.warnings
    });
  } else {
    console.error('Universal parser: Failed', result.error);
  }
  
  return result;
}

/**
 * Export for backward compatibility
 */
export function parseGPX(content: string): ParsedTrack | null {
  const result = parseGPXWithFallback(cleanFileContent(content));
  return result.success ? result.track! : null;
}

export function parseKML(content: string): ParsedTrack | null {
  const result = parseKMLWithFallback(cleanFileContent(content));
  return result.success ? result.track! : null;
}