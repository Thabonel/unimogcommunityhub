
import { supabase } from '@/lib/supabase-client';
import { toast } from "@/hooks/use-toast";
import { sendUserBanNotification } from "@/utils/emailUtils";

/**
 * Ban a user until a specified date
 */
export const banUser = async (userId: string, banDuration: number = 30, reason?: string): Promise<boolean> => {
  try {
    // Calculate ban end date (default: 30 days from now)
    const banUntil = new Date();
    banUntil.setDate(banUntil.getDate() + banDuration);
    
    // Get the user's email before banning
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError) {
      console.error("Error getting user details:", userError);
      throw userError;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ banned_until: banUntil.toISOString() })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast({
      title: "User banned",
      description: `User has been banned until ${banUntil.toLocaleDateString()}`
    });
    
    // Get admin email to send notification
    const { data: currentUser } = await supabase.auth.getUser();
    const adminEmail = currentUser?.user?.email;
    
    // Only send email if we have both admin and banned user emails
    if (adminEmail && userData?.user?.email) {
      await sendUserBanNotification(
        adminEmail,
        userData.user.email,
        banDuration,
        reason
      );
    }
    
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
