
import { useState } from 'react';
import Layout from '@/components/Layout';
import AnalyticsCommunityFeed from '@/components/community/AnalyticsCommunityFeed';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPresence } from '@/hooks/use-user-presence';
import { useAnalytics } from '@/hooks/use-analytics';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityLayout from '@/components/community/CommunityLayout';

const Community = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { trackFeatureUse } = useAnalytics();
  
  // Use the presence hook to track user's online status
  useUserPresence();

  const handleRefresh = () => {
    // Track refresh action
    trackFeatureUse('page_refresh', {
      page: 'community'
    });
    
    setIsRefreshing(true);
    // The feed component will handle its own refresh
    // Just need to simulate the refresh state
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-6">
        <CommunityHeader 
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
        
        <CommunityLayout>
          <AnalyticsCommunityFeed />
        </CommunityLayout>
      </div>
    </Layout>
  );
};

export default Community;
