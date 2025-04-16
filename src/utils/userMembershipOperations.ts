
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface GrantFreeAccessParams {
  email: string;
  reason?: string;
  isPermanent?: boolean;
}

/**
 * Grant free access to a user
 */
export const grantFreeAccess = async ({
  email,
  reason = "",
  isPermanent = false
}: GrantFreeAccessParams): Promise<boolean> => {
  try {
    // First, check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userError) throw userError;
    
    if (!userData) {
      throw new Error(`User with email ${email} not found`);
    }
    
    const userId = userData.id;
    
    // Calculate expiry date (1 year from now unless permanent)
    const expiryDate = isPermanent ? null : new Date();
    if (expiryDate) {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }

    // Check if table exists first to avoid database errors
    const { count, error: checkError } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true });
    
    // If there's an error with the subscription table, simulate success in development mode
    if (checkError || count === null) {
      console.warn("Subscription table might not exist or has permission issues:", checkError);
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating free access grant");
        return true;
      }
      throw checkError || new Error("Could not verify user_subscriptions table");
    }
    
    // Add or update subscription with 'premium' level and free access flag
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        subscription_level: 'premium',
        is_active: true,
        starts_at: new Date(),
        expires_at: expiryDate,
        is_free_access: true,
        free_access_reason: reason || null
      });
    
    if (error) throw error;
    
    // Log the action for auditing purposes
    await supabase.from('audit_logs').insert({
      action: 'GRANT_FREE_ACCESS',
      user_id: userId,
      performed_by: (await supabase.auth.getUser()).data.user?.id,
      details: {
        reason,
        isPermanent,
        expiryDate: expiryDate ? expiryDate.toISOString() : 'never'
      }
    }).catch(err => console.warn("Failed to log audit event:", err));
    
    return true;
  } catch (error) {
    console.error("Error granting free access:", error);
    throw error;
  }
};

/**
 * Revoke free access from a user
 */
export const revokeFreeAccess = async (userId: string): Promise<boolean> => {
  try {
    // In development mode, simulate success
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: Simulating free access revocation");
      return true;
    }
    
    // Find the subscription record
    const { data: subscription, error: findError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_free_access', true)
      .maybeSingle();
    
    if (findError) throw findError;
    
    if (!subscription) {
      throw new Error("User does not have free access to revoke");
    }
    
    // Update the subscription to remove free access
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        is_active: false,
        expires_at: new Date()
      })
      .eq('id', subscription.id);
    
    if (error) throw error;
    
    // Log the action for auditing purposes
    await supabase.from('audit_logs').insert({
      action: 'REVOKE_FREE_ACCESS',
      user_id: userId,
      performed_by: (await supabase.auth.getUser()).data.user?.id
    }).catch(err => console.warn("Failed to log audit event:", err));
    
    return true;
  } catch (error) {
    console.error("Error revoking free access:", error);
    throw error;
  }
};

/**
 * Get a list of users with free access
 */
export const getFreeAccessUsers = async () => {
  try {
    // In development mode, return mock data
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: Using mock free access data");
      
      // Generate some mock users with free access
      return [
        {
          id: '1',
          is_free_access: true,
          free_access_reason: 'Early adopter',
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          profiles: {
            email: 'user1@example.com',
            full_name: 'John Doe',
            display_name: null
          }
        },
        {
          id: '2',
          is_free_access: true,
          free_access_reason: 'Beta tester',
          expires_at: null, // Permanent access
          profiles: {
            email: 'user2@example.com',
            full_name: null,
            display_name: 'JaneD'
          }
        },
        {
          id: '3',
          is_free_access: true,
          free_access_reason: 'Content creator',
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          profiles: {
            email: 'creator@example.com',
            full_name: 'Alex Smith',
            display_name: 'Creator Alex'
          }
        }
      ];
    }
    
    // Check if table exists first to avoid database errors
    const { count, error: checkError } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true });
    
    // If there's an error with the subscription table, return empty array
    if (checkError || count === null) {
      console.warn("Subscription table might not exist or has permission issues:", checkError);
      return [];
    }
    
    // Check if the user_subscriptions table has the is_free_access column
    const { data: columnInfo, error: columnError } = await supabase
      .rpc('check_column_exists', { 
        table_name: 'user_subscriptions', 
        column_name: 'is_free_access' 
      });
    
    // If the column doesn't exist or there was an error, return empty array
    if (columnError || !columnInfo) {
      console.warn("is_free_access column might not exist:", columnError);
      return [];
    }
    
    // If the is_free_access column exists, proceed with the query
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        profiles:user_id (
          email,
          full_name,
          avatar_url,
          display_name
        )
      `)
      .eq('is_free_access', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching free access users:", error);
    throw error;
  }
};
