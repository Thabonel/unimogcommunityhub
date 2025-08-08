
import { trackActivity } from './activityTrackingService';
import { isTrackingAllowed } from './privacyService';
import { v4 as uuidv4 } from 'uuid';

// Track session end
export const trackSessionEnd = async (): Promise<void> => {
  // Check if tracking is allowed
  if (!isTrackingAllowed()) {
    return;
  }

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
  // Only initialize if tracking is allowed
  if (!isTrackingAllowed()) {
    return;
  }

  // Store session start time
  localStorage.setItem('session_start', Date.now().toString());
  
  // Generate or retrieve session ID
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('session_id', sessionId);
    
    // Track session start
    trackActivity('session_start', { 
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });
  }
  
  // Track session end events
  window.addEventListener('beforeunload', () => {
    trackSessionEnd();
    // Force immediate flush of any pending activities
    import('./activityTrackingService').then(({ flushActivities }) => {
      flushActivities();
    });
  });
  
  // Track initial page view
  trackActivity('page_view');
  
  // Listen for privacy setting changes
  window.addEventListener('privacy-settings-changed', () => {
    // If tracking becomes disabled, remove session data
    if (!isTrackingAllowed()) {
      trackSessionEnd(); // Track final session end
      // Flush remaining data
      import('./activityTrackingService').then(({ flushActivities }) => {
        flushActivities();
      });
    }
  });
};

// Get current session ID
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};
