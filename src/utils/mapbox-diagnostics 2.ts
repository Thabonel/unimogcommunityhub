/**
 * Comprehensive Mapbox Directions API Diagnostics & Recovery
 * Bulletproof routing with detailed error analysis and recovery strategies
 */

import { toast } from 'sonner';

export interface DiagnosticResult {
  success: boolean;
  message: string;
  details?: any;
  suggestedFix?: string;
}

export interface WaypointValidationResult {
  isValid: boolean;
  issues: string[];
  fixedCoordinates?: [number, number];
}

/**
 * Comprehensive API token validation
 */
export async function validateMapboxToken(): Promise<DiagnosticResult> {
  const token = localStorage.getItem('mapbox-token') || 
                import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (!token) {
    return {
      success: false,
      message: 'No Mapbox token found',
      suggestedFix: 'Set VITE_MAPBOX_ACCESS_TOKEN or add token to localStorage'
    };
  }
  
  if (!token.startsWith('pk.')) {
    return {
      success: false,
      message: 'Invalid token format',
      details: `Token starts with: ${token.substring(0, 10)}...`,
      suggestedFix: 'Mapbox tokens must start with "pk."'
    };
  }
  
  // Test token with a simple geocoding call
  try {
    const testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/0,0.json?access_token=${token}&limit=1`;
    const response = await fetch(testUrl);
    
    if (response.status === 401) {
      return {
        success: false,
        message: 'Token authentication failed',
        details: await response.text(),
        suggestedFix: 'Token may be expired or invalid'
      };
    }
    
    if (response.ok) {
      return {
        success: true,
        message: 'Token validated successfully'
      };
    }
    
    return {
      success: false,
      message: `Token test failed with status ${response.status}`,
      details: await response.text()
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Network error during token validation',
      details: error instanceof Error ? error.message : String(error),
      suggestedFix: 'Check internet connection and CORS settings'
    };
  }
}

/**
 * Validate waypoint coordinates for routing feasibility
 */
export function validateWaypointCoordinates(coords: [number, number]): WaypointValidationResult {
  const [lng, lat] = coords;
  const issues: string[] = [];
  
  // Basic bounds checking
  if (lng < -180 || lng > 180) {
    issues.push(`Longitude ${lng} out of valid range [-180, 180]`);
  }
  
  if (lat < -90 || lat > 90) {
    issues.push(`Latitude ${lat} out of valid range [-90, 90]`);
  }
  
  // Check for obviously invalid coordinates
  if (lng === 0 && lat === 0) {
    issues.push('Coordinates appear to be null island (0,0)');
  }
  
  // Check for common coordinate swap (lat, lng instead of lng, lat)
  if (Math.abs(lat) > Math.abs(lng) && Math.abs(lat) > 50) {
    issues.push('Possible coordinate swap - latitude appears too large');
  }
  
  // Check for excessive precision (routing doesn't need more than 6 decimal places)
  const lngStr = lng.toString();
  const latStr = lat.toString();
  const lngDecimals = lngStr.includes('.') ? lngStr.split('.')[1].length : 0;
  const latDecimals = latStr.includes('.') ? latStr.split('.')[1].length : 0;
  
  let fixedCoords: [number, number] | undefined;
  
  if (lngDecimals > 6 || latDecimals > 6) {
    fixedCoords = [
      Math.round(lng * 1000000) / 1000000,
      Math.round(lat * 1000000) / 1000000
    ];
    issues.push('Excessive coordinate precision, rounded to 6 decimal places');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    fixedCoordinates: fixedCoords
  };
}

/**
 * Test Mapbox Directions API with a known-good route
 */
export async function testDirectionsAPI(): Promise<DiagnosticResult> {
  console.log('🧪 Testing Mapbox Directions API...');
  
  const tokenResult = await validateMapboxToken();
  if (!tokenResult.success) {
    return tokenResult;
  }
  
  const token = localStorage.getItem('mapbox-token') || 
                import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  // Test with a simple, reliable route (Sydney CBD to Airport)
  const testCoords = '151.2093,-33.8688;151.1547,-33.9399';
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${testCoords}?` +
             `access_token=${token}&geometries=geojson&steps=true&overview=full`;
  
  try {
    console.log('📡 Testing API call:', url.substring(0, 100) + '...');
    
    const response = await fetch(url);
    console.log('📊 API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      let suggestedFix = 'Check API documentation';
      
      if (response.status === 422) {
        suggestedFix = 'Invalid request parameters - check coordinate format';
      } else if (response.status === 429) {
        suggestedFix = 'Rate limit exceeded - implement request throttling';
      }
      
      return {
        success: false,
        message: `API request failed with status ${response.status}`,
        details: errorText,
        suggestedFix
      };
    }
    
    const data = await response.json();
    console.log('✅ API Response code:', data.code);
    
    if (data.code !== 'Ok') {
      return {
        success: false,
        message: `API returned non-OK code: ${data.code}`,
        details: data,
        suggestedFix: 'Check coordinate validity and routing profile'
      };
    }
    
    if (!data.routes || data.routes.length === 0) {
      return {
        success: false,
        message: 'API returned no routes',
        details: data,
        suggestedFix: 'Route may not be possible - try different coordinates'
      };
    }
    
    const route = data.routes[0];
    return {
      success: true,
      message: 'Directions API working correctly',
      details: {
        distance: `${(route.distance / 1000).toFixed(1)} km`,
        duration: `${Math.round(route.duration / 60)} minutes`,
        coordinates: route.geometry.coordinates.length
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Network error during API test',
      details: error instanceof Error ? error.message : String(error),
      suggestedFix: 'Check internet connection and CORS configuration'
    };
  }
}

/**
 * Comprehensive waypoint routing diagnostics
 */
export async function diagnoseWaypointRouting(waypoints: Array<{lng: number, lat: number}>): Promise<DiagnosticResult> {
  console.log('🔬 Diagnosing waypoint routing for', waypoints.length, 'waypoints');
  
  if (waypoints.length < 2) {
    return {
      success: false,
      message: 'Need at least 2 waypoints for routing',
      suggestedFix: 'Add more waypoints'
    };
  }
  
  // Validate all coordinates
  const coordinateIssues: string[] = [];
  const validatedWaypoints: Array<{lng: number, lat: number}> = [];
  
  waypoints.forEach((wp, index) => {
    const validation = validateWaypointCoordinates([wp.lng, wp.lat]);
    if (!validation.isValid) {
      coordinateIssues.push(`Waypoint ${index + 1}: ${validation.issues.join(', ')}`);
    }
    
    const coords = validation.fixedCoordinates || [wp.lng, wp.lat];
    validatedWaypoints.push({ lng: coords[0], lat: coords[1] });
  });
  
  if (coordinateIssues.length > 0) {
    console.warn('⚠️ Coordinate validation issues:', coordinateIssues);
  }
  
  // Test the actual routing
  const token = localStorage.getItem('mapbox-token') || 
                import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  const coordinates = validatedWaypoints
    .map(wp => `${wp.lng},${wp.lat}`)
    .join(';');
    
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?` +
             `access_token=${token}&geometries=geojson&steps=true&overview=full`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Routing failed with status ${response.status}`,
        details: {
          error: errorText,
          coordinateIssues,
          waypoints: validatedWaypoints
        },
        suggestedFix: 'Try road snapping or reduce waypoint count'
      };
    }
    
    const data = await response.json();
    
    if (data.code === 'NoRoute') {
      return {
        success: false,
        message: 'No route found between waypoints',
        details: { waypoints: validatedWaypoints },
        suggestedFix: 'Waypoints may be too far apart or on different road networks'
      };
    }
    
    if (data.code === 'NoSegment') {
      return {
        success: false,
        message: 'One or more waypoints not on road network',
        details: { waypoints: validatedWaypoints },
        suggestedFix: 'Use road snapping to move waypoints to nearest road'
      };
    }
    
    if (data.code !== 'Ok') {
      return {
        success: false,
        message: `Routing returned code: ${data.code}`,
        details: data,
        suggestedFix: 'Check API documentation for error code meaning'
      };
    }
    
    if (!data.routes || data.routes.length === 0) {
      return {
        success: false,
        message: 'API returned OK but no routes',
        details: data,
        suggestedFix: 'Unexpected API response - check coordinates'
      };
    }
    
    const route = data.routes[0];
    return {
      success: true,
      message: `Route calculated successfully for ${waypoints.length} waypoints`,
      details: {
        distance: `${(route.distance / 1000).toFixed(1)} km`,
        duration: `${Math.round(route.duration / 60)} minutes`,
        coordinates: route.geometry.coordinates.length,
        coordinateIssues: coordinateIssues.length > 0 ? coordinateIssues : undefined
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Network error during routing test',
      details: { 
        error: error instanceof Error ? error.message : String(error),
        waypoints: validatedWaypoints
      },
      suggestedFix: 'Check network connection'
    };
  }
}

/**
 * Run comprehensive diagnostics and display results
 */
export async function runCompleteDiagnostics(waypoints?: Array<{lng: number, lat: number}>): Promise<void> {
  console.log('🚀 Running complete Mapbox diagnostics...');
  
  // Token validation
  const tokenResult = await validateMapboxToken();
  console.log('🔑 Token validation:', tokenResult);
  
  if (tokenResult.success) {
    toast.success('✅ Mapbox token valid');
  } else {
    toast.error(`❌ Token issue: ${tokenResult.message}`);
    console.error('Token validation failed:', tokenResult);
    return;
  }
  
  // API functionality test
  const apiResult = await testDirectionsAPI();
  console.log('📡 API test:', apiResult);
  
  if (apiResult.success) {
    toast.success('✅ Mapbox Directions API working');
    console.log('📊 API test details:', apiResult.details);
  } else {
    toast.error(`❌ API issue: ${apiResult.message}`);
    console.error('API test failed:', apiResult);
  }
  
  // Waypoint-specific diagnostics
  if (waypoints && waypoints.length > 0) {
    const waypointResult = await diagnoseWaypointRouting(waypoints);
    console.log('🎯 Waypoint routing test:', waypointResult);
    
    if (waypointResult.success) {
      toast.success(`✅ Routing working for ${waypoints.length} waypoints`);
      console.log('🗺️ Route details:', waypointResult.details);
    } else {
      toast.error(`❌ Routing issue: ${waypointResult.message}`);
      console.error('Waypoint routing failed:', waypointResult);
      
      if (waypointResult.suggestedFix) {
        toast.info(`💡 Suggested fix: ${waypointResult.suggestedFix}`);
      }
    }
  }
  
  console.log('✅ Diagnostics complete');
}