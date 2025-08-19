
import { supabase } from '@/lib/supabase-client';
import { useToast } from "@/hooks/use-toast";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  is_admin: boolean;  // Changed from optional to required
}

/**
 * Fetch users from Supabase auth system
 */
export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    // Get the current user's auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Not authenticated. Please log in to access admin functions.");
    }
    
    console.log("fetchUsers called with session:", { 
      hasSession: !!session,
      userId: session.user?.id,
      email: session.user?.email
    });
    
    // Call our edge function to get users
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { operation: 'get_all_users' },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    
    console.log("Edge function response:", { data, error });
    
    if (error) {
      console.error("Edge function error:", error);
      throw new Error(`Failed to fetch users: ${error.message || 'Edge function error'}`);
    }

    if (!data || !Array.isArray(data)) {
      throw new Error("Invalid response from admin-users function");
    }
    
    // Fetch user profiles to get banned status
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, banned_until');
    
    if (profilesError) throw profilesError;
    
    // Create a map of profile data by user ID
    const profileMap = profiles?.reduce((map, profile) => {
      map[profile.id] = profile;
      return map;
    }, {}) || {};

    // Fetch admin roles
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');
    
    if (rolesError) throw rolesError;
    
    // Create a set of admin user IDs
    const adminIds = new Set(adminRoles?.map(role => role.user_id) || []);

    // Combine auth data with profile data
    return data.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      banned_until: profileMap[user.id]?.banned_until || null,
      is_admin: adminIds.has(user.id)
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Delete a user and all their associated data
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Get the current user's auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Not authenticated. Please log in to delete users.");
    }
    
    // Call our edge function to delete the user
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { 
        operation: 'delete_user',
        userId
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    
    if (error) {
      throw new Error(`Failed to delete user: ${error.message || 'Edge function error'}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};


// Export the UserData interface for use in other files
export type { UserData };
