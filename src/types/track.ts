
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
}
