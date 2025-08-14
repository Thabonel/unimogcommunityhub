/**
 * Routing Service
 * Integrates OpenRouteService for advanced routing capabilities
 * Supports off-road routing, elevation profiles, and isochrone calculations
 */

interface RoutePoint {
  lat: number;
  lon: number;
}

interface RouteOptions {
  profile?: 'driving-car' | 'driving-hgv' | 'foot-hiking' | 'cycling-regular';
  avoid_polygons?: number[][];
  avoid_features?: string[];
  avoid_borders?: 'all' | 'controlled' | 'none';
  vehicle_type?: 'hgv' | 'agricultural' | 'delivery' | 'forestry' | 'goods';
  maximum_grade?: number;
  maximum_sloped_kerb?: number;
  surface_quality_known?: boolean;
  allow_unsuitable?: boolean;
  difficulty?: 'easy' | 'moderate' | 'difficult' | 'extreme';
}

interface RouteResponse {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'LineString';
      coordinates: number[][];
    };
    properties: {
      summary: {
        distance: number; // in meters
        duration: number; // in seconds
        ascent?: number; // in meters
        descent?: number; // in meters
      };
      segments: Array<{
        distance: number;
        duration: number;
        steps: Array<{
          distance: number;
          duration: number;
          type: number;
          instruction: string;
          name?: string;
          way_points: number[];
        }>;
      }>;
      way_points: number[];
      extras?: {
        surface?: {
          values: number[][];
          summary: Array<{
            value: number;
            distance: number;
            amount: number;
          }>;
        };
        steepness?: {
          values: number[][];
          summary: Array<{
            value: number;
            distance: number;
            amount: number;
          }>;
        };
      };
    };
  }>;
  bbox: number[];
  metadata: {
    attribution: string;
    service: string;
    timestamp: number;
    query: any;
    engine: any;
  };
}

interface ElevationProfile {
  geometry: {
    coordinates: number[][];
  };
  properties: {
    segments: Array<{
      distance: number;
      duration: number;
      ascent: number;
      descent: number;
    }>;
    summary: {
      distance: number;
      duration: number;
      ascent: number;
      descent: number;
    };
  };
}

class RoutingService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openrouteservice.org';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenRouteService API key not found. Routing features will be limited.');
    }
  }

  /**
   * Calculate route between multiple points
   */
  async calculateRoute(
    points: RoutePoint[],
    options: RouteOptions = {}
  ): Promise<RouteResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouteService API key is required for routing');
    }

    if (points.length < 2) {
      throw new Error('At least 2 points are required for routing');
    }

    try {
      const coordinates = points.map(point => [point.lon, point.lat]);
      
      const requestBody = {
        coordinates,
        format: 'geojson',
        profile: options.profile || 'driving-car',
        elevation: true,
        extra_info: ['surface', 'steepness', 'suitability'],
        instructions: true,
        instructions_format: 'text',
        language: 'en',
        geometry_simplify: false,
        continue_straight: false,
        ...options
      };

      const response = await fetch(`${this.baseUrl}/v2/directions/${requestBody.profile}/geojson`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Routing failed: ${error.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating route:', error);
      throw error;
    }
  }

  /**
   * Calculate off-road route optimized for Unimog vehicles
   */
  async calculateOffRoadRoute(
    points: RoutePoint[],
    difficulty: 'easy' | 'moderate' | 'difficult' | 'extreme' = 'moderate'
  ): Promise<RouteResponse> {
    const options: RouteOptions = {
      profile: 'driving-hgv', // Heavy goods vehicle profile for larger vehicles
      vehicle_type: 'agricultural', // Agricultural vehicle type
      maximum_grade: difficulty === 'easy' ? 15 : difficulty === 'moderate' ? 25 : difficulty === 'difficult' ? 35 : 50,
      allow_unsuitable: difficulty !== 'easy',
      surface_quality_known: false,
      avoid_features: difficulty === 'easy' ? ['ferries', 'fords'] : [],
      difficulty
    };

    return this.calculateRoute(points, options);
  }

  /**
   * Get elevation profile for a route
   */
  async getElevationProfile(
    points: RoutePoint[],
    format: 'geojson' | 'polyline' = 'geojson'
  ): Promise<ElevationProfile> {
    if (!this.apiKey) {
      throw new Error('OpenRouteService API key is required for elevation profiles');
    }

    try {
      const coordinates = points.map(point => [point.lon, point.lat]);
      
      const response = await fetch(`${this.baseUrl}/elevation/${format}`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format_in: format,
          format_out: 'geojson',
          geometry: {
            coordinates,
            type: 'LineString'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Elevation profile failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting elevation profile:', error);
      throw error;
    }
  }

  /**
   * Calculate isochrone (reachable area within time/distance)
   */
  async calculateIsochrone(
    center: RoutePoint,
    ranges: number[], // in seconds or meters
    rangeType: 'time' | 'distance' = 'time',
    profile: string = 'driving-car'
  ): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenRouteService API key is required for isochrones');
    }

    try {
      const response = await fetch(`${this.baseUrl}/v2/isochrones/${profile}`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locations: [[center.lon, center.lat]],
          range: ranges,
          range_type: rangeType,
          format: 'geojson'
        })
      });

      if (!response.ok) {
        throw new Error(`Isochrone calculation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating isochrone:', error);
      throw error;
    }
  }

  /**
   * Optimize waypoint order for efficient routing
   */
  async optimizeWaypoints(
    start: RoutePoint,
    waypoints: RoutePoint[],
    end?: RoutePoint,
    profile: string = 'driving-car'
  ): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenRouteService API key is required for optimization');
    }

    try {
      const jobs = waypoints.map((point, index) => ({
        id: index,
        location: [point.lon, point.lat]
      }));

      const vehicles = [{
        id: 0,
        start: [start.lon, start.lat],
        end: end ? [end.lon, end.lat] : [start.lon, start.lat],
        profile
      }];

      const response = await fetch(`${this.baseUrl}/optimization`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobs,
          vehicles,
          options: {
            g: true // Include geometry
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Route optimization failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error optimizing waypoints:', error);
      throw error;
    }
  }

  /**
   * Get matrix of distances/durations between multiple points
   */
  async getMatrix(
    points: RoutePoint[],
    profile: string = 'driving-car',
    metrics: ('distance' | 'duration')[] = ['distance', 'duration']
  ): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenRouteService API key is required for matrix calculations');
    }

    try {
      const locations = points.map(point => [point.lon, point.lat]);

      const response = await fetch(`${this.baseUrl}/v2/matrix/${profile}`, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locations,
          metrics,
          resolve_locations: true
        })
      });

      if (!response.ok) {
        throw new Error(`Matrix calculation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calculating matrix:', error);
      throw error;
    }
  }

  /**
   * Geocode address to coordinates
   */
  async geocode(
    query: string,
    bounds?: {
      minLat: number;
      minLon: number;
      maxLat: number;
      maxLon: number;
    }
  ): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenRouteService API key is required for geocoding');
    }

    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        text: query,
        format: 'geojson',
        size: '10'
      });

      if (bounds) {
        params.append('boundary.rect.min_lon', bounds.minLon.toString());
        params.append('boundary.rect.min_lat', bounds.minLat.toString());
        params.append('boundary.rect.max_lon', bounds.maxLon.toString());
        params.append('boundary.rect.max_lat', bounds.maxLat.toString());
      }

      const response = await fetch(`${this.baseUrl}/geocode/search?${params}`);

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error geocoding:', error);
      throw error;
    }
  }

  /**
   * Reverse geocode coordinates to address
   */
  async reverseGeocode(lat: number, lon: number): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenRouteService API key is required for reverse geocoding');
    }

    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        'point.lat': lat.toString(),
        'point.lon': lon.toString(),
        format: 'geojson',
        size: '1'
      });

      const response = await fetch(`${this.baseUrl}/geocode/reverse?${params}`);

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  }

  /**
   * Check if API key is available
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Get API usage statistics
   */
  async getUsageStats(): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenRouteService API key is required for usage stats');
    }

    try {
      const response = await fetch(`${this.baseUrl}/quota`, {
        headers: {
          'Authorization': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Usage stats failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw error;
    }
  }

  /**
   * Format route instructions for display
   */
  formatRouteInstructions(route: RouteResponse): Array<{
    instruction: string;
    distance: number;
    duration: number;
    type: string;
  }> {
    const feature = route.features[0];
    if (!feature || !feature.properties.segments) {
      return [];
    }

    const instructions: Array<{
      instruction: string;
      distance: number;
      duration: number;
      type: string;
    }> = [];

    feature.properties.segments.forEach(segment => {
      segment.steps.forEach(step => {
        instructions.push({
          instruction: step.instruction,
          distance: step.distance,
          duration: step.duration,
          type: this.getInstructionType(step.type)
        });
      });
    });

    return instructions;
  }

  /**
   * Get instruction type description
   */
  private getInstructionType(type: number): string {
    const types: { [key: number]: string } = {
      0: 'left',
      1: 'right',
      2: 'sharp-left',
      3: 'sharp-right',
      4: 'slight-left',
      5: 'slight-right',
      6: 'straight',
      7: 'enter-roundabout',
      8: 'exit-roundabout',
      9: 'u-turn',
      10: 'goal',
      11: 'depart',
      12: 'keep-left',
      13: 'keep-right'
    };

    return types[type] || 'continue';
  }

  /**
   * Calculate route difficulty based on terrain and elevation
   */
  calculateRouteDifficulty(route: RouteResponse): {
    difficulty: 'easy' | 'moderate' | 'difficult' | 'extreme';
    factors: {
      elevation: number;
      surface: number;
      steepness: number;
      overall: number;
    };
  } {
    const feature = route.features[0];
    if (!feature) {
      return {
        difficulty: 'easy',
        factors: { elevation: 0, surface: 0, steepness: 0, overall: 0 }
      };
    }

    const { summary, extras } = feature.properties;
    
    // Calculate elevation difficulty (0-100)
    const elevationGain = summary.ascent || 0;
    const distance = summary.distance || 1;
    const elevationFactor = Math.min(100, (elevationGain / distance) * 10000);

    // Calculate surface difficulty (0-100)
    let surfaceFactor = 0;
    if (extras?.surface) {
      const poorSurfaces = extras.surface.summary.filter(s => s.value > 2);
      surfaceFactor = poorSurfaces.reduce((sum, s) => sum + s.amount, 0);
    }

    // Calculate steepness difficulty (0-100)
    let steepnessFactor = 0;
    if (extras?.steepness) {
      const steepSections = extras.steepness.summary.filter(s => s.value > 6);
      steepnessFactor = steepSections.reduce((sum, s) => sum + s.amount * s.value, 0) / 10;
    }

    // Overall difficulty score
    const overall = (elevationFactor + surfaceFactor + steepnessFactor) / 3;

    let difficulty: 'easy' | 'moderate' | 'difficult' | 'extreme';
    if (overall < 25) difficulty = 'easy';
    else if (overall < 50) difficulty = 'moderate';
    else if (overall < 75) difficulty = 'difficult';
    else difficulty = 'extreme';

    return {
      difficulty,
      factors: {
        elevation: elevationFactor,
        surface: surfaceFactor,
        steepness: steepnessFactor,
        overall
      }
    };
  }
}

export const routingService = new RoutingService();
export default routingService;