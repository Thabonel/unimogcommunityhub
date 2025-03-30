import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Types for analytics data
export interface UserActivity {
  event_id?: string;
  user_id?: string | null;
  event_type: ActivityEventType;
  event_data?: Record<string, any>;
  page?: string;
  timestamp?: string;
  session_id: string;
}

export type ActivityEventType = 
  | 'page_view'
  | 'post_create'
  | 'post_like' 
  | 'post_unlike'
  | 'post_comment'
  | 'post_share'
  | 'session_start'
  | 'session_end'
  | 'profile_view'
  | 'search'
  | 'link_click'
  | 'video_play'
  | 'feature_use'
  | 'feedback_submit'
  | 'survey_shown'
  | 'survey_completed'
  | 'survey_dismissed';

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
  try {
    // Get current user if logged in
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;
    
    // Get or create session ID from localStorage
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('session_id', sessionId);
      
      // Track session start
      queueActivity({
        event_type: 'session_start',
        session_id: sessionId,
        user_id: userId,
        event_data: { 
          referrer: document.referrer,
          userAgent: navigator.userAgent
        },
        page: window.location.pathname
      });
    }
    
    // Add activity to queue
    queueActivity({
      event_type: eventType,
      event_data: eventData,
      user_id: userId,
      session_id: sessionId,
      page: page || window.location.pathname,
      timestamp: new Date().toISOString()
    });
    
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
const flushActivities = async (): Promise<void> => {
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

// Track session duration
export const trackSessionEnd = async (): Promise<void> => {
  const sessionId = localStorage.getItem('session_id');
  if (sessionId) {
    const sessionStart = localStorage.getItem('session_start');
    const duration = sessionStart 
      ? Math.round((Date.now() - parseInt(sessionStart, 10)) / 1000) 
      : 0;
    
    await trackActivity('session_end', { duration });
  }
};

// Initialize session tracking
export const initSessionTracking = (): void => {
  // Store session start time
  localStorage.setItem('session_start', Date.now().toString());
  
  // Track session end events
  window.addEventListener('beforeunload', () => {
    trackSessionEnd();
    flushActivities(); // Force immediate flush
  });
  
  // Track page views
  trackActivity('page_view');
};

// Initialize session tracking when service is imported
if (typeof window !== 'undefined') {
  initSessionTracking();
}
