
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/message';
import { mapProfileToUser } from './userProfileService';
import { toast } from '@/hooks/use-toast';

// Function to get all users for new message creation
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get all users except the current user
    const { data: userProfiles, error } = await supabase
      .from('user_details')
      .select('*')
      .neq('id', user.id);

    if (error) {
      throw error;
    }

    // Map to User type
    return userProfiles.map(profile => mapProfileToUser(profile));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
