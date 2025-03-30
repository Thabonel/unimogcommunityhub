
import { supabase } from "@/integrations/supabase/client";

export enum LogAction {
  USER_CREATED = "user_created",
  USER_DELETED = "user_deleted",
  USER_BANNED = "user_banned",
  USER_UNBANNED = "user_unbanned",
  ADMIN_ROLE_ADDED = "admin_role_added",
  ADMIN_ROLE_REMOVED = "admin_role_removed",
  EMAIL_BLOCKED = "email_blocked",
  EMAIL_UNBLOCKED = "email_unblocked",
  ARTICLE_CREATED = "article_created",
  ARTICLE_UPDATED = "article_updated",
  ARTICLE_DELETED = "article_deleted",
}

export interface AuditLog {
  action: LogAction;
  performed_by?: string;  // Make this optional as we'll set it in the implementation
  target_id?: string;
  details?: Record<string, any>;
}

export function useAuditLogger() {
  // Log admin actions to console (would typically save to database)
  const logAction = async (logData: AuditLog): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        console.error("Cannot log action: No authenticated user");
        return false;
      }
      
      console.log(`[AUDIT] ${logData.action}`, {
        ...logData,
        performed_by: userId,
        timestamp: new Date().toISOString(),
      });
      
      // In a production environment, we would save this to a database table
      // For now, we'll just log it to the console
      return true;
    } catch (error) {
      console.error("Error logging action:", error);
      return false;
    }
  };
  
  return { logAction };
}
