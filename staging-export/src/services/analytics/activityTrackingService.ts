
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { 
  isTrackingAllowed, 
  isActivityTrackingAllowed,
  anonymizeUserData 
} from './privacyService';
import { UserActivity, ActivityEventType } from './types/analyticsTypes';
import { getSessionId } from './sessionTrackingService';
import { initSessionTracking } from './sessionTrackingService';

// Re-export the types for backward compatibility
export type { UserActivity, ActivityEventType } from './types/analyticsTypes';

// In-memory cache to reduce DB writes
const activityQueue: UserActivity[] = [];
let flushTimeout: NodeJS.Timeout | null = null;
const FLUSH_INTERVAL = 10000; // 10 seconds

// Track user activity
export const trackActivity = async (
  eventType: ActivityEventType,
  eventData: Record<string, any> = {},
  page?: string
): Promise<void> => {
  // Check if tracking is allowed based on user privacy settings
  if (!isTrackingAllowed()) {
    return;
  }
  
  // For specific activity tracking, check the more specific permission
  if (eventType === 'feature_use' && !isActivityTrackingAllowed()) {
    return;
  }

  try {
    // Get current user if logged in
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;
    
    // Get session ID
    const sessionId = getSessionId();
    
    // Add activity to queue with anonymized data if needed
    const activityData: UserActivity = {
      event_type: eventType,
      event_data: eventData,
      user_id: userId,
      session_id: sessionId,
      page: page || window.location.pathname,
      timestamp: new Date().toISOString()
    };
    
    // Anonymize data according to user preferences
    const processedActivity = anonymizeUserData(activityData) as UserActivity;
    queueActivity(processedActivity);
    
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};

// Add activity to queue and schedule flush if not already scheduled
const queueActivity = (activity: UserActivity): void => {
  activityQueue.push(activity);
  
  if (!flushTimeout) {
    flushTimeout = setTimeout(flushActivities, FLUSH_INTERVAL);
  }
};

// Send queued activities to the database
export const flushActivities = async (): Promise<void> => {
  if (activityQueue.length === 0) {
    flushTimeout = null;
    return;
  }
  
  const activitiesToSend = [...activityQueue];
  activityQueue.length = 0;
  
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert(activitiesToSend);
    
    if (error) {
      console.error('Error saving activities:', error);
      // Put activities back in queue if save failed
      activityQueue.push(...activitiesToSend);
    }
  } catch (error) {
    console.error('Error in flushActivities:', error);
    activityQueue.push(...activitiesToSend);
  } finally {
    flushTimeout = null;
    
    // If there are still items in the queue, schedule another flush
    if (activityQueue.length > 0) {
      flushTimeout = setTimeout(flushActivities, FLUSH_INTERVAL);
    }
  }
};

// Only initialize tracking if allowed by privacy settings
if (typeof window !== 'undefined' && isTrackingAllowed()) {
  initSessionTracking();
}

// Export everything from experiment service for backward compatibility
export * from './experimentService';
