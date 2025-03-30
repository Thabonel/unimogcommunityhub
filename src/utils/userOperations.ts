
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { sendUserBanNotification } from "@/utils/emailUtils";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  banned_until: string | null;
  is_admin?: boolean;
}

/**
 * Fetch users from Supabase auth system
 */
export const fetchUsers = async (): Promise<UserData[]> => {
  try {
    // Get the current user's auth token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");
    
    // Call our edge function to get users instead of using RPC
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { operation: 'get_all_users' },
    });
    
    if (error) throw error;

    // If we don't have data or it's not an array, return an empty array
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Fetch user profiles to get banned status
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, banned_until');
    
    if (profilesError) throw profilesError;
    
    // Create a map of profile data by user ID
    const profileMap = profiles.reduce((map, profile) => {
      map[profile.id] = profile;
      return map;
    }, {});

    // Fetch admin roles
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');
    
    if (rolesError) throw rolesError;
    
    // Create a set of admin user IDs
    const adminIds = new Set(adminRoles.map(role => role.user_id));

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
    toast({
      title: "Error fetching users",
      description: error.message || "Could not load user data",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Delete a user and all their associated data
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Call our edge function to delete the user
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { 
        operation: 'delete_user',
        userId
      },
    });
    
    if (error) throw error;
    
    toast({
      title: "User deleted",
      description: "The user and their data have been removed"
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    toast({
      title: "Failed to delete user",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    return false;
  }
};

// Export the UserData interface for use in other files
export type { UserData };
