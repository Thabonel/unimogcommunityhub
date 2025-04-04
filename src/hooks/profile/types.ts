
import { User } from "@supabase/supabase-js";

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
}

export interface ProfileHookResult {
  userData: UserProfileData;
  isLoading: boolean;
  isEditing: boolean;
  isMasterUser: boolean;
  handleEditClick: () => void;
  handleCancelEdit: () => void;
  handleProfileUpdate: (formData: any) => Promise<void>;
}
