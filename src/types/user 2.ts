
export interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  is_admin?: boolean;
  is_moderator?: boolean;
}

// Extended user profile with statistics
export interface UserProfileExtended extends UserProfile {
  stats: {
    posts_count: number;
    trips_count: number;
    tracks_count: number;
    vehicles_count: number;
    followers_count: number;
    following_count: number;
  };
  member_since: string;
}

// User search result interface
export interface UserSearchResult {
  id: string;
  display_name: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  unimog_model: string | null;
  unimog_series: string | null;
  experience_level: string | null;
  profile_completion_percentage: number;
  last_active_at: string;
  member_since: string;
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
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null;
  online: boolean;
  banned_until: string | null;
  is_admin: boolean;
  // Address and currency fields
  street_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  phone_number: string | null;
  currency: string;
  // Vehicle photo and profile picture preference
  vehicle_photo_url: string | null;
  use_vehicle_photo_as_profile: boolean;
  // Enhanced Unimog model series and specs
  unimog_series: string | null;
  unimog_specs: Record<string, any> | null;
  unimog_features: string[] | null;
  unimog_wiki_data: any | null;
  // New profile fields from database enhancement
  preferred_terrain: string[] | null;
  mechanical_skills: string[] | null;
  certifications: Record<string, any> | null;
  emergency_contact: Record<string, any> | null;
  insurance_info: Record<string, any> | null;
  privacy_settings: {
    show_location?: boolean;
    show_vehicle?: boolean;
    show_trips?: boolean;
    show_profile?: boolean;
  } | null;
  notification_preferences: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  } | null;
  last_active_at: string | null;
  account_status: 'active' | 'inactive' | 'suspended' | 'pending';
  subscription_tier: 'free' | 'premium' | 'lifetime';
  subscription_expires_at: string | null;
  profile_completion_percentage: number;
  created_at: string;
  updated_at: string;
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
