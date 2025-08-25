
export interface EmergencyAlert {
  id: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  } | [number, number]; // Support both object and array formats
  type?: 'fire' | 'flood' | 'storm' | 'road' | 'other';
  severity?: 'low' | 'medium' | 'high' | 'extreme';
  issued_at: string;
  expires_at: string;
  affected_area?: {
    radius_km?: number;
    polygon?: [number, number][];
  };
  source?: string;
  link?: string;
  active?: boolean;
}

export interface TrackLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'start' | 'end' | 'waypoint' | 'campsite' | 'poi' | 'fuel';
  description?: string;
}

export interface Track {
  id: string;
  name: string;
  description?: string;
  segments: {
    type: string;
    coordinates: Array<[number, number]>;
  }[];
  distance_km?: number;
  elevation_gain?: number;
  difficulty?: string;
  created_by?: string;
  created_at: string;
  is_public: boolean;
}

export interface TrafficIncident {
  id: string;
  type: 'accident' | 'congestion' | 'construction' | 'closure' | 'event' | 'other';
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  startTime: string;
  endTime?: string;
  affectedRoads?: string[];
}
