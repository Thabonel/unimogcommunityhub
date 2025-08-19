import { useState, useEffect, useCallback } from 'react';
import { wisSessionService, WISSession, UserSubscription, WISBookmark } from '@/services/wis/wisSessionService';
import { useAuth } from '@/hooks/use-auth';

export function useWISEPC() {
  const [session, setSession] = useState<WISSession | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [bookmarks, setBookmarks] = useState<WISBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const { user } = useAuth();

  // Load user subscription and existing session on mount
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      resetState();
    }
  }, [user]);

  // Poll for session updates when in queue or active
  useEffect(() => {
    if (session?.status === 'pending' || session?.status === 'active') {
      const interval = setInterval(checkSessionStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [session?.status]);

  const resetState = () => {
    setSession(null);
    setSubscription(null);
    setBookmarks([]);
    setError(null);
    setQueuePosition(null);
  };

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Load subscription info
      const subData = await wisSessionService.getUserSubscription();
      setSubscription(subData);

      // Check for existing active session
      const activeSession = await wisSessionService.getActiveSession();
      setSession(activeSession);

      // Load bookmarks
      const userBookmarks = await wisSessionService.getUserBookmarks();
      setBookmarks(userBookmarks);

      setError(null);
    } catch (err) {
      console.error('Error loading WIS EPC data:', err);
      setError('Failed to load WIS EPC data');
    } finally {
      setIsLoading(false);
    }
  };

  const checkSessionStatus = async () => {
    if (!session) return;

    try {
      const updatedSession = await wisSessionService.getActiveSession();
      if (updatedSession) {
        setSession(updatedSession);
        setQueuePosition(updatedSession.queue_position);
      } else {
        // Session no longer exists, probably completed or expired
        setSession(null);
        setQueuePosition(null);
      }
    } catch (err) {
      console.error('Error checking session status:', err);
    }
  };

  const requestSession = useCallback(async () => {
    if (!user) {
      setError('You must be logged in to access WIS EPC');
      return null;
    }

    if (!subscription?.can_access) {
      setError('You have reached your monthly usage limit. Please upgrade your subscription.');
      return null;
    }

    if (session?.status === 'active' || session?.status === 'pending') {
      return session; // Already have an active session
    }

    setIsLoading(true);
    setError(null);

    try {
      const newSession = await wisSessionService.requestSession();
      if (newSession) {
        setSession(newSession);
        setQueuePosition(newSession.queue_position);
        return newSession;
      }
      return null;
    } catch (err) {
      console.error('Error requesting WIS session:', err);
      setError('Failed to start WIS EPC session');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, subscription, session]);

  const endSession = useCallback(async () => {
    if (!session) return false;

    setIsLoading(true);
    try {
      const success = await wisSessionService.endSession(session.id);
      if (success) {
        setSession(null);
        setQueuePosition(null);
        // Refresh subscription to update usage
        const updatedSub = await wisSessionService.getUserSubscription();
        setSubscription(updatedSub);
      }
      return success;
    } catch (err) {
      console.error('Error ending session:', err);
      setError('Failed to end session');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const createBookmark = useCallback(async (bookmarkData: {
    title: string;
    description?: string;
    procedure_path?: string;
    screenshot_url?: string;
    tags?: string[];
    is_public?: boolean;
  }) => {
    try {
      const bookmark = await wisSessionService.createBookmark({
        ...bookmarkData,
        tags: bookmarkData.tags || [],
        is_public: bookmarkData.is_public || false
      });
      
      if (bookmark) {
        setBookmarks(prev => [bookmark, ...prev]);
        return bookmark;
      }
      return null;
    } catch (err) {
      console.error('Error creating bookmark:', err);
      setError('Failed to create bookmark');
      return null;
    }
  }, []);

  const deleteBookmark = useCallback(async (bookmarkId: string) => {
    try {
      const success = await wisSessionService.deleteBookmark(bookmarkId);
      if (success) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      }
      return success;
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      setError('Failed to delete bookmark');
      return false;
    }
  }, []);

  const refreshSession = useCallback(async () => {
    await checkSessionStatus();
  }, [session]);

  const getUsageStats = useCallback(() => {
    if (!subscription) return null;

    const usagePercentage = subscription.monthly_minutes_limit > 0 
      ? (subscription.monthly_minutes_used / subscription.monthly_minutes_limit) * 100 
      : 0;

    const remainingMinutes = Math.max(0, subscription.monthly_minutes_limit - subscription.monthly_minutes_used);

    return {
      tier: subscription.tier,
      usedMinutes: subscription.monthly_minutes_used,
      totalMinutes: subscription.monthly_minutes_limit,
      remainingMinutes,
      usagePercentage: Math.min(100, usagePercentage),
      canAccess: subscription.can_access,
      priorityLevel: subscription.priority_level
    };
  }, [subscription]);

  const getSessionInfo = useCallback(() => {
    if (!session) return null;

    const timeRemaining = session.expires_at 
      ? Math.max(0, new Date(session.expires_at).getTime() - Date.now())
      : 0;

    const isExpiringSoon = timeRemaining < (30 * 60 * 1000); // Less than 30 minutes

    return {
      ...session,
      timeRemainingMs: timeRemaining,
      timeRemainingMinutes: Math.ceil(timeRemaining / (1000 * 60)),
      isExpiringSoon,
      isActive: session.status === 'active',
      isPending: session.status === 'pending',
      inQueue: session.status === 'pending' && (session.queue_position || 0) > 0
    };
  }, [session]);

  return {
    // State
    session: getSessionInfo(),
    subscription,
    bookmarks,
    isLoading,
    error,
    queuePosition,
    
    // Actions
    requestSession,
    endSession,
    refreshSession,
    createBookmark,
    deleteBookmark,
    
    // Computed values
    usageStats: getUsageStats(),
    isAuthenticated: !!user,
    hasActiveSession: session?.status === 'active',
    isInQueue: session?.status === 'pending' && (queuePosition || 0) > 0,
    
    // Utilities
    clearError: () => setError(null),
    reload: loadUserData
  };
}