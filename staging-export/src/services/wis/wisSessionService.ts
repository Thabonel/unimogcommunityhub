import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface WISServer {
  id: string;
  name: string;
  host_url: string;
  guacamole_url: string;
  max_concurrent_sessions: number;
  current_sessions: number;
  status: 'active' | 'maintenance' | 'offline';
}

export interface WISSession {
  id: string;
  user_id: string;
  server_id: string;
  guacamole_token?: string;
  session_url?: string;
  status: 'pending' | 'active' | 'completed' | 'expired' | 'error';
  queue_position?: number;
  started_at?: string;
  expires_at?: string;
  last_activity: string;
  metadata: Record<string, any>;
}

export interface UserSubscription {
  tier: 'free' | 'premium' | 'professional';
  monthly_minutes_used: number;
  monthly_minutes_limit: number;
  priority_level: number;
  can_access: boolean;
}

export interface WISBookmark {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  procedure_path?: string;
  screenshot_url?: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

class WISSessionService {
  /**
   * Get user's subscription details and access rights
   */
  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('get_user_subscription', {
        user_uuid: user.id
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting user subscription:', error);
      return null;
    }
  }

  /**
   * Check server availability and get the best available server
   */
  async getAvailableServer(): Promise<WISServer | null> {
    try {
      const { data, error } = await supabase.rpc('get_available_server');
      if (error) throw error;
      
      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting available server:', error);
      return null;
    }
  }

  /**
   * Request a new WIS EPC session
   */
  async requestSession(): Promise<WISSession | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check user subscription and access rights
      const subscription = await this.getUserSubscription();
      if (!subscription?.can_access) {
        toast({
          title: "Access Denied",
          description: "You've reached your monthly limit. Please upgrade your subscription.",
          variant: "destructive"
        });
        return null;
      }

      // Find available server
      const server = await this.getAvailableServer();
      if (!server) {
        toast({
          title: "No Servers Available",
          description: "All WIS EPC servers are currently busy. You'll be added to the queue.",
          variant: "destructive"
        });
      }

      // Create session record
      const sessionData = {
        user_id: user.id,
        server_id: server?.server_id || null,
        status: server ? 'pending' : 'pending',
        queue_position: server ? null : await this.getQueuePosition(),
        expires_at: new Date(Date.now() + (2 * 60 * 60 * 1000)).toISOString(), // 2 hours from now
        metadata: {
          user_tier: subscription.tier,
          priority: subscription.priority_level
        }
      };

      const { data: session, error } = await supabase
        .from('wis_sessions')
        .insert(sessionData)
        .select()
        .single();

      if (error) throw error;

      // If server is available, initiate connection
      if (server) {
        await this.initiateConnection(session.id, server.guacamole_url);
      }

      return session;
    } catch (error) {
      console.error('Error requesting WIS session:', error);
      toast({
        title: "Session Request Failed",
        description: "Unable to start WIS EPC session. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }

  /**
   * Get current queue position for user
   */
  private async getQueuePosition(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data, error } = await supabase
        .from('wis_sessions')
        .select('id')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data?.length || 0) + 1;
    } catch (error) {
      console.error('Error getting queue position:', error);
      return 0;
    }
  }

  /**
   * Initiate connection to Guacamole server
   */
  private async initiateConnection(sessionId: string, guacamoleUrl: string): Promise<void> {
    try {
      // This would typically call your backend API to set up the Guacamole connection
      // For now, we'll simulate the connection setup
      const sessionUrl = `${guacamoleUrl}/#/client/${sessionId}`;
      
      const { error } = await supabase
        .from('wis_sessions')
        .update({
          status: 'active',
          session_url: sessionUrl,
          started_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error initiating connection:', error);
      throw error;
    }
  }

  /**
   * Get user's active session
   */
  async getActiveSession(): Promise<WISSession | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('wis_sessions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['pending', 'active'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data || null;
    } catch (error) {
      console.error('Error getting active session:', error);
      return null;
    }
  }

  /**
   * End user's session
   */
  async endSession(sessionId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Calculate session duration
      const { data: session } = await supabase
        .from('wis_sessions')
        .select('started_at')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      const duration = session?.started_at 
        ? Math.ceil((Date.now() - new Date(session.started_at).getTime()) / (1000 * 60))
        : 0;

      // Update session status
      const { error } = await supabase
        .from('wis_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Log usage
      await this.logUsage('session_end', sessionId, duration);

      // Update user's monthly usage for free tier
      const subscription = await this.getUserSubscription();
      if (subscription?.tier === 'free') {
        await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: user.id,
            monthly_minutes_used: (subscription.monthly_minutes_used || 0) + duration
          });
      }

      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
  }

  /**
   * Log user activity
   */
  private async logUsage(action: string, sessionId?: string, duration?: number): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('wis_usage_logs')
        .insert({
          user_id: user.id,
          session_id: sessionId,
          action,
          duration_minutes: duration,
          details: { timestamp: new Date().toISOString() }
        });
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  }

  /**
   * Get user's bookmarks
   */
  async getUserBookmarks(): Promise<WISBookmark[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('wis_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  }

  /**
   * Create a new bookmark
   */
  async createBookmark(bookmark: Omit<WISBookmark, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<WISBookmark | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('wis_bookmarks')
        .insert({
          ...bookmark,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await this.logUsage('bookmark_created');
      
      toast({
        title: "Bookmark Created",
        description: "WIS procedure bookmarked successfully."
      });

      return data;
    } catch (error) {
      console.error('Error creating bookmark:', error);
      toast({
        title: "Bookmark Failed",
        description: "Unable to create bookmark. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }

  /**
   * Delete a bookmark
   */
  async deleteBookmark(bookmarkId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('wis_bookmarks')
        .delete()
        .eq('id', bookmarkId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Bookmark Deleted",
        description: "Bookmark removed successfully."
      });

      return true;
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      return false;
    }
  }

  /**
   * Clean up expired sessions (admin function)
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const { data, error } = await supabase.rpc('cleanup_expired_sessions');
      if (error) throw error;
      return data || 0;
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      return 0;
    }
  }
}

export const wisSessionService = new WISSessionService();