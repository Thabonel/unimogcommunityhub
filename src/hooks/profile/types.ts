
// You may need to extend or create this file if it doesn't exist

export interface UnimogSpecs {
  engine?: string;
  power?: string;
  transmission?: string;
  weight?: string;
  [key: string]: string | undefined;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  unimogModel: string;
  unimogSeries: string | null;
  unimogSpecs: UnimogSpecs | null;
  unimogFeatures: string[] | null;
  about: string;
  location: string;
  website: string;
  joinDate: string;
  vehiclePhotoUrl: string;
  useVehiclePhotoAsProfile: boolean;
  coordinates?: Coordinates;
}
