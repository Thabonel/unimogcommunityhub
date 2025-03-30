
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
    // Fetch users from the auth.users view through Supabase's edge function
    const { data: authUsers, error: authError } = await supabase.rpc('get_all_users');
    
    if (authError) throw authError;

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
    return authUsers.map(user => ({
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
 * Block an email address from registering
 */
export const blockEmail = async (email: string, reason: string | null = null): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blocked_emails')
      .insert([
        { 
          email, 
          reason,
          blocked_by: (await supabase.auth.getUser()).data.user?.id
        }
      ]);
    
    if (error) throw error;
    
    toast({
      title: "Email blocked",
      description: `${email} has been blocked from registering`
    });
    
    return true;
  } catch (error) {
    console.error("Error blocking email:", error);
    toast({
      title: "Failed to block email",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Remove an email from the blocked list
 */
export const unblockEmail = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blocked_emails')
      .delete()
      .eq('email', email);
    
    if (error) throw error;
    
    toast({
      title: "Email unblocked",
      description: `${email} has been unblocked`
    });
    
    return true;
  } catch (error) {
    console.error("Error unblocking email:", error);
    toast({
      title: "Failed to unblock email",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Ban a user until a specified date
 */
export const banUser = async (userId: string, banDuration: number = 30): Promise<boolean> => {
  try {
    // Calculate ban end date (default: 30 days from now)
    const banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + banDuration);
    
    const { error } = await supabase
      .from('profiles')
      .update({ banned_until: banUntil.toISOString() })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast({
      title: "User banned",
      description: `User has been banned until ${banUntil.toLocaleDateString()}`
    });
    
    return true;
  } catch (error) {
    console.error("Error banning user:", error);
    toast({
      title: "Failed to ban user",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Unban a user by clearing the banned_until field
 */
export const unbanUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ banned_until: null })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast({
      title: "User unbanned",
      description: "User has been unbanned successfully"
    });
    
    return true;
  } catch (error) {
    console.error("Error unbanning user:", error);
    toast({
      title: "Failed to unban user",
      description: error.message || "An error occurred",
      variant: "destructive",
    });
    return false;
  }
};

/**
 * Delete a user and all their associated data
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // This will delete the auth.users record which cascades to profiles
    // and all related data via RLS policies and foreign keys
    const { error } = await supabase.rpc('delete_user', { user_id: userId });
    
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

/**
 * Check if an email is blocked
 */
export const isEmailBlocked = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('blocked_emails')
      .select('email')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      // PGRST116 is the "no rows returned" error, which just means the email isn't blocked
      console.error("Error checking blocked email:", error);
    }
    
    return !!data;
  } catch (error) {
    console.error("Error checking blocked email:", error);
    return false;
  }
};

/**
 * Get all blocked emails
 */
export const getBlockedEmails = async (): Promise<{email: string, reason: string | null}[]> => {
  try {
    const { data, error } = await supabase
      .from('blocked_emails')
      .select('email, reason')
      .order('blocked_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching blocked emails:", error);
    toast({
      title: "Error fetching blocked emails",
      description: error.message || "Could not load blocked emails",
      variant: "destructive",
    });
    return [];
  }
};
