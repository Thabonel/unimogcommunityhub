
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
