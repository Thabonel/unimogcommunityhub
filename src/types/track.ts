
export interface TrackPoint {
  latitude: number;
  longitude: number;
  elevation?: number;
  time?: string;
}

export interface TrackSegment {
  points: TrackPoint[];
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
  difficulty?: 'easy' | 'moderate' | 'hard' | 'extreme';
}

export interface TrackComment {
  id: string;
  track_id: string;
  user_id: string;
  content: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  location: [number, number];
  alert_level: 'warning' | 'alert' | 'emergency';
  created_at: string;
  expires_at: string;
  affected_area_radius_km: number;
}
