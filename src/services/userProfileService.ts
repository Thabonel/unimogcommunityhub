
import { supabase } from '@/lib/supabase-client';
import { UserProfile } from '@/types/user';
import { User } from '@/types/message';
import { withSupabaseRetry } from '@/utils/database-retry';

// Fetch a single user profile by ID with retry logic
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  // Try user_details view first, fallback to profiles table
  let { data, error } = await withSupabaseRetry(() => 
    supabase
      .from('user_details')
      .select('*')
      .eq('id', userId)
      .single()
  );
  
  // Fallback to profiles table if view doesn't exist
  if (error && (error.code === '42P01' || error.message.includes('relation "user_details" does not exist'))) {
    console.warn('user_details view not found, falling back to profiles table');
    
    ({ data, error } = await withSupabaseRetry(() => 
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
    ));
  }
    
  if (error) {
    console.error('Error fetching user profile:', error);
    // Return partial profile instead of null - let the caller add more details
    return {
      id: userId,
      email: '', // Will be filled by caller if available
      display_name: null,
      full_name: null,
      avatar_url: null,
      bio: null,
      location: null,
      unimog_model: null,
      unimog_year: null,
      unimog_modifications: null,
      experience_level: 'beginner',
      online: false,
      banned_until: null,
      is_admin: false,
      street_address: null,
      city: null,
      state: null,
      postal_code: null,
      country: null,
      phone_number: null,
      currency: 'USD',
      vehicle_photo_url: null,
      use_vehicle_photo_as_profile: false,
      unimog_series: null,
      unimog_specs: null,
      unimog_features: null,
      unimog_wiki_data: null,
      preferred_terrain: [],
      mechanical_skills: [],
      certifications: {},
      emergency_contact: {},
      insurance_info: {},
      privacy_settings: {
        show_location: true,
        show_vehicle: true,
        show_trips: true,
        show_profile: true
      },
      notification_preferences: {
        email: true,
        push: true,
        sms: false
      },
      last_active_at: new Date().toISOString(),
      account_status: 'active',
      subscription_tier: 'free',
      subscription_expires_at: null,
      profile_completion_percentage: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as UserProfile;
  }
  
  // Ensure the returned data conforms to UserProfile interface
  // Add default values for potentially missing fields
  const profile = data as UserProfile;
  
  // Extract email username for fallback
  const emailUsername = profile.email?.split('@')[0] || 'user';
  
  return {
    ...profile,
    // Add fallbacks for display_name and full_name
    display_name: profile.display_name || profile.full_name || emailUsername,
    full_name: profile.full_name || profile.display_name || emailUsername,
    experience_level: profile.experience_level || 'beginner',
    preferred_terrain: profile.preferred_terrain || [],
    mechanical_skills: profile.mechanical_skills || [],
    certifications: profile.certifications || {},
    emergency_contact: profile.emergency_contact || {},
    insurance_info: profile.insurance_info || {},
    privacy_settings: profile.privacy_settings || {
      show_location: true,
      show_vehicle: true,
      show_trips: true,
      show_profile: true
    },
    notification_preferences: profile.notification_preferences || {
      email: true,
      push: true,
      sms: false
    },
    account_status: profile.account_status || 'active',
    subscription_tier: profile.subscription_tier || 'free',
    profile_completion_percentage: profile.profile_completion_percentage || 0,
    last_active_at: profile.last_active_at || new Date().toISOString(),
    created_at: profile.created_at || new Date().toISOString(),
    updated_at: profile.updated_at || new Date().toISOString()
  };
};

// Map UserProfile to the User type used in messages
export const mapProfileToUser = (profile: UserProfile | null): User => {
  if (!profile) {
    return {
      id: 'unknown',
      name: 'Unknown User',
      avatar: null,
      online: false
    };
  }
  
  return {
    id: profile.id,
    name: profile.display_name || profile.full_name || profile.email.split('@')[0],
    avatar: profile.avatar_url,
    online: profile.online || false,
    unimogModel: profile.unimog_model,
    location: profile.location,
    bio: profile.bio
  };
};

// Update a user's online status with retry logic
export const updateUserOnlineStatus = async (online: boolean): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    
    const { error } = await withSupabaseRetry(() =>
      supabase
        .from('profiles')
        .update({ online })
        .eq('id', user.id)
    );
      
    if (error) {
      console.error('Error updating online status:', error);
    }
  } catch (error) {
    console.error('Error updating online status:', error);
  }
};

// Get multiple user profiles by IDs with retry logic
export const getUserProfiles = async (userIds: string[]): Promise<UserProfile[]> => {
  if (!userIds.length) return [];
  
  const { data, error } = await withSupabaseRetry(() =>
    supabase
      .from('user_details')
      .select('*')
      .in('id', userIds)
  );
    
  if (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
  
  // Ensure the returned data conforms to UserProfile[] interface
  return data as UserProfile[];
};
