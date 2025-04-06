
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
  source_type: 'GPX' | 'KML' | 'manual';
  segments: TrackSegment[];
  created_at: string;
  created_by?: string;
  is_public: boolean;
  color?: string;
  visible?: boolean;
  trip_id?: string;
  distance_km?: number;
  duration_minutes?: number;
  elevation_gain?: number;
  elevation_loss?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface TrackFile {
  id: string;
  name: string;
  file_path: string;
  file_type: 'GPX' | 'KML';
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
  track_id?: string;
}

export interface WeatherData {
  date: string;
  temperature: number;
  condition: string;
  precipitation_chance: number;
  wind_speed: number;
  humidity: number;
  icon: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'fire' | 'flood' | 'storm' | 'road' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  location: {
    latitude: number;
    longitude: number;
  } | null;
  affected_area?: {
    type: 'polygon' | 'circle';
    coordinates: Array<[number, number]> | null;
    radius_km?: number;
  };
  issued_at: string;
  expires_at?: string;
  source: string;
  link?: string;
}
