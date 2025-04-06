
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  start_location?: Coordinates;
  end_location?: Coordinates;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  distance?: number;
  duration?: number;
  terrain_types?: string[];
  created_by?: string;
  is_public?: boolean;
}

export interface TrackSegment {
  distance: number;
  duration: number;
  coordinates: [number, number][];
  elevation_gain?: number;
  type: string;
  points: {
    latitude: number;
    longitude: number;
    elevation?: number;
  }[];
}

export interface EmergencyAlert {
  id: string;
  type: 'fire' | 'flood' | 'storm' | 'road' | 'other';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  title: string;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  affected_area?: {
    radius_km: number;
  };
  issued_at: string;
  expires_at?: string;
  source: string;
  link?: string;
}

export interface TrackComment {
  id: string;
  track_id: string;
  user_id: string;
  user?: {
    display_name?: string;
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  name: string;
  description?: string;
  segments: TrackSegment[];
  color?: string;
  distance_km?: number;
  elevation_gain?: number;
  source_type: string;
  created_at: string;
  created_by?: string;
  is_public: boolean;
  visible: boolean;
  trip_id?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}
