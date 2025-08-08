
/**
 * User profile data structure
 */
export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  unimogModel: string | null;
  unimogSeries?: string | null;
  unimogSpecs?: Record<string, any> | null;
  unimogFeatures?: string[] | null;
  about: string;
  location: string;
  website?: string;
  joinDate: string;
  vehiclePhotoUrl?: string;
  useVehiclePhotoAsProfile?: boolean;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}
