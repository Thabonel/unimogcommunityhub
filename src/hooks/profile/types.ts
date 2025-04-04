
export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  unimogModel: string;
  unimogSeries: string | null;
  unimogSpecs: Record<string, any> | null;
  unimogFeatures: string[] | null;
  about: string;
  location: string;
  website: string;
  joinDate: string;
  vehiclePhotoUrl: string;
  useVehiclePhotoAsProfile: boolean;
  // Add coordinates to ensure maps work properly
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
