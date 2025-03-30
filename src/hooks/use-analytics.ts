
import { useCallback, useEffect } from 'react';
import { trackActivity } from '@/services/analytics/activityTrackingService';
import { ActivityEventType } from '@/services/analytics/types/analyticsTypes';
import { useLocation } from 'react-router-dom';
import { isTrackingAllowed, isActivityTrackingAllowed } from '@/services/analytics/privacyService';

export const useAnalytics = () => {
  const location = useLocation();
  
  // Track page views automatically
  useEffect(() => {
    if (isTrackingAllowed()) {
      trackActivity('page_view', {
        path: location.pathname,
        query: location.search
      }, location.pathname);
    }
  }, [location.pathname, location.search]);
  
  // Track feature usage
  const trackFeatureUse = useCallback((
    featureName: string, 
    data: Record<string, any> = {}
  ) => {
    if (isActivityTrackingAllowed()) {
      trackActivity('feature_use', {
        feature: featureName,
        ...data
      });
    }
  }, []);
  
  // Track content interaction
  const trackContentEngagement = useCallback((
    eventType: ActivityEventType,
    contentId: string,
    contentType: 'post' | 'comment' | 'video' | 'link' | 'image',
    data: Record<string, any> = {}
  ) => {
    if (isTrackingAllowed()) {
      trackActivity(eventType, {
        content_id: contentId,
        content_type: contentType,
        ...data
      });
    }
  }, []);
  
  return {
    trackFeatureUse,
    trackContentEngagement,
    trackEvent: trackActivity,
    isTrackingAllowed,
    isActivityTrackingAllowed
  };
};
