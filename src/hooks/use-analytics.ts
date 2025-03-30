
import { useCallback, useEffect } from 'react';
import { ActivityEventType, trackActivity } from '@/services/analytics/activityTrackingService';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();
  
  // Track page views automatically
  useEffect(() => {
    trackActivity('page_view', {
      path: location.pathname,
      query: location.search
    }, location.pathname);
  }, [location.pathname, location.search]);
  
  // Track feature usage
  const trackFeatureUse = useCallback((
    featureName: string, 
    data: Record<string, any> = {}
  ) => {
    trackActivity('feature_use', {
      feature: featureName,
      ...data
    });
  }, []);
  
  // Track content interaction
  const trackContentEngagement = useCallback((
    eventType: ActivityEventType,
    contentId: string,
    contentType: 'post' | 'comment' | 'video' | 'link',
    data: Record<string, any> = {}
  ) => {
    trackActivity(eventType, {
      content_id: contentId,
      content_type: contentType,
      ...data
    });
  }, []);
  
  return {
    trackFeatureUse,
    trackContentEngagement,
    trackEvent: trackActivity
  };
};
