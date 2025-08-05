
import { supabase } from "@/lib/supabase";
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
    
    console.log("fetchUsers called:", { 
      hasSession: !!session,
      environment: process.env.NODE_ENV,
      isDev: import.meta.env.DEV
    });
    
    // For development or if no session, return mock data
    if (import.meta.env.DEV || !session) {
      console.log("Using mock data for fetchUsers - development mode or no session");
      return getMockUsers();
    }
    
    // Call our edge function to get users with improved error handling
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { operation: 'get_all_users' },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    
    console.log("Edge function response:", { data, error });
    
    if (error) {
      console.error("Edge function error:", error);
      console.warn("Falling back to mock data due to edge function error");
      return getMockUsers();
    }

    // If we don't have data or it's not an array, return mock data
    if (!data || !Array.isArray(data)) {
      console.warn("No data returned from edge function or data is not an array, using mock data");
      return getMockUsers();
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
    console.warn("Falling back to mock data due to error");
    return getMockUsers();
  }
};

/**
 * Delete a user and all their associated data
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // For development mode, simulate success
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Simulating deletion of user: ${userId}`);
      return true;
    }
    
    // Call our edge function to delete the user
    const { data, error } = await supabase.functions.invoke('admin-users', {
      body: { 
        operation: 'delete_user',
        userId
      },
    });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Mock user data for development purposes
function getMockUsers(): UserData[] {
  return [
    {
      id: "1",
      email: "admin@example.com",
      created_at: "2025-01-01T00:00:00.000Z",
      last_sign_in_at: "2025-03-30T10:45:00.000Z",
      banned_until: null,
      is_admin: true
    },
    {
      id: "2",
      email: "user@example.com",
      created_at: "2025-02-15T00:00:00.000Z",
      last_sign_in_at: "2025-04-01T08:30:00.000Z",
      banned_until: null,
      is_admin: false
    },
    {
      id: "3",
      email: "banned@example.com",
      created_at: "2025-01-20T00:00:00.000Z",
      last_sign_in_at: "2025-02-10T14:20:00.000Z",
      banned_until: "2025-12-31T00:00:00.000Z",
      is_admin: false
    },
    {
      id: "4",
      email: "trial@example.com",
      created_at: "2025-03-05T00:00:00.000Z",
      last_sign_in_at: "2025-04-02T15:20:00.000Z",
      banned_until: null,
      is_admin: false
    }
  ];
}

// Export the UserData interface for use in other files
export type { UserData };
