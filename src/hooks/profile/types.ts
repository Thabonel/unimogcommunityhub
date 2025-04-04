
export interface UserProfileData {
  name: string;
  email: string;
  avatarUrl: string;
  unimogModel: string;
  unimogSeries: string | null;
  unimogSpecs: Record<string, string> | null;
  unimogFeatures: string[] | null;
  about: string;
  location: string;
  website: string;
  joinDate: string;
  vehiclePhotoUrl: string;
  useVehiclePhotoAsProfile: boolean;
}
