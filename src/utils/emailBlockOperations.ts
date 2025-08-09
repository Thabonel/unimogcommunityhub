
import { supabase } from '@/lib/supabase-client';
import { toast } from "@/hooks/use-toast";

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
