
import { UserProfileData } from "./types";

export interface ProfileDataState {
  userData: UserProfileData;
  setUserData: (data: UserProfileData) => void;
  isLoading: boolean;
  isMasterUser: boolean;
  fetchUserProfile: () => Promise<void>;
  error: string | null;
}

export interface ProfileDataOptions {
  maxAttempts?: number;
  timeoutMs?: number;
}
