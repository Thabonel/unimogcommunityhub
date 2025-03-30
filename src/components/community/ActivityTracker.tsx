
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

interface ActivityTrackerProps {
  componentName: string;
  data?: Record<string, any>;
  children: React.ReactNode;
}

// Component that wraps other components to track their usage
const ActivityTracker: React.FC<ActivityTrackerProps> = ({ 
  componentName,
  data = {},
  children 
}) => {
  const { trackFeatureUse } = useAnalytics();
  
  useEffect(() => {
    // Track component mount as feature usage
    trackFeatureUse(componentName, {
      action: 'viewed',
      ...data
    });
    
    return () => {
      // Track component unmount duration
      trackFeatureUse(componentName, {
        action: 'closed',
        ...data
      });
    };
  }, [componentName, trackFeatureUse]);
  
  return <>{children}</>;
};

export default ActivityTracker;
