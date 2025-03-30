
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/user';
import { User } from '@/types/message';

// Fetch a single user profile by ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('user_details')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
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

// Update a user's online status
export const updateUserOnlineStatus = async (online: boolean): Promise<void> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ online })
      .eq('id', supabase.auth.getUser().then(res => res.data.user?.id || ''));
      
    if (error) {
      console.error('Error updating online status:', error);
    }
  } catch (error) {
    console.error('Error updating online status:', error);
  }
};

// Get multiple user profiles by IDs
export const getUserProfiles = async (userIds: string[]): Promise<UserProfile[]> => {
  if (!userIds.length) return [];
  
  const { data, error } = await supabase
    .from('user_details')
    .select('*')
    .in('id', userIds);
    
  if (error) {
    console.error('Error fetching user profiles:', error);
    return [];
  }
  
  return data || [];
};
