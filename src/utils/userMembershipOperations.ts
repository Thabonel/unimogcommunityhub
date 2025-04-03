
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
    });
    
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
    });
    
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
