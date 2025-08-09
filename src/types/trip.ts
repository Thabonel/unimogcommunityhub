
export interface Coordinates {
  lat: number;
  lng: number;
}

// Legacy coordinate interface for backwards compatibility
export interface LegacyCoordinates {
  latitude: number;
  longitude: number;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  start_coordinates?: Coordinates;
  end_coordinates?: Coordinates;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  distance_km?: number;
  estimated_duration_hours?: number;
  terrain_types?: string[];
  visibility: 'public' | 'private' | 'friends';
  trip_type: 'route' | 'expedition' | 'maintenance' | 'event';
  vehicle_requirements?: Record<string, any>;
  weather_conditions?: Record<string, any>;
  notes?: string;
  is_completed: boolean;
  completion_date?: string;
  rating?: number; // 1-5 stars
  tags?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Trip with waypoints included
export interface TripWithWaypoints extends Trip {
  waypoints: TripWaypoint[];
}

// Database waypoint type
export interface TripWaypoint {
  id: string;
  trip_id: string;
  track_id?: string;
  user_id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  waypoint_type: 'waypoint' | 'start' | 'end' | 'rest' | 'fuel' | 'repair' | 'scenic' | 'danger' | 'checkpoint';
  order_index: number;
  elevation_m?: number;
  estimated_arrival_time?: string;
  actual_arrival_time?: string;
  duration_minutes?: number;
  notes?: string;
  images?: string[];
  poi_id?: string;
  metadata?: Record<string, any>;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

// Waypoint with calculated distances
export interface TripWaypointWithDistance extends TripWaypoint {
  distance_from_previous_km: number;
  cumulative_distance_km: number;
}
