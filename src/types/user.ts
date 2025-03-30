
export interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  is_admin?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  unimog_model: string | null;
  unimog_year: string | null;
  unimog_modifications: string | null;
  experience_level: string | null;
  online: boolean;
  banned_until: string | null;
  is_admin: boolean;
}

export interface BlockedEmailData {
  id: string;
  email: string;
  reason: string | null;
  blocked_at: string;
  blocked_by: string | null;
}

export interface UserBanParams {
  userId: string;
  duration?: number;
  reason?: string;
}

export interface BlockEmailParams {
  email: string;
  reason?: string;
}

export interface AdminToggleParams {
  userId: string;
  makeAdmin: boolean;
}
