
export interface TrackPoint {
  latitude: number;
  longitude: number;
  elevation?: number;
  time?: string;
}

export interface TrackSegment {
  points: TrackPoint[];
  // Adding missing properties
  coordinates?: [number, number][];
  distance?: number;
  duration?: number;
  elevation_gain?: number;
  type?: string;
}

export interface Track {
  id: string;
  name: string;
  description?: string;
  file_path?: string;
  file_type?: 'gpx' | 'kml' | 'geojson';
  color: string;
  distance_km?: number;
  elevation_gain?: number;
  created_at?: string;
  user_id?: string;
  is_public?: boolean;
  coordinates?: [number, number][];
  segments: TrackSegment[];
  // Fix difficulty to include both sets of difficulty levels
  difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  // Add missing properties
  source_type?: string;
  visible?: boolean;
}

export interface TrackComment {
  id: string;
  track_id: string;
  user_id: string;
  content: string;
  created_at: string;
  // Add missing user property
  user?: {
    display_name?: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
  username?: string;
  avatar_url?: string;
  updated_at?: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  // Update location to support both formats
  location: [number, number] | {
    latitude: number;
    longitude: number;
  };
  // Add missing properties
  type?: 'fire' | 'flood' | 'storm' | 'road' | 'other';
  severity?: 'low' | 'medium' | 'high' | 'extreme';
  issued_at: string;
  expires_at: string;
  affected_area?: {
    radius_km: number;
  };
  affected_area_radius_km?: number;
  alert_level?: 'warning' | 'alert' | 'emergency';
  source?: string;
  link?: string;
}
