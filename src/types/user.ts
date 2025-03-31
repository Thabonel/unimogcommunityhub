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
  // Added address and currency fields
  street_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone_number: string | null;
  currency: string;
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
