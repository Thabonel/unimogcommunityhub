
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import AnalyticsCommunityFeed from '@/components/community/AnalyticsCommunityFeed';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/profile';
import { useUserPresence } from '@/hooks/use-user-presence';
import { useAnalytics } from '@/hooks/use-analytics';
import CommunityHeader from '@/components/community/CommunityHeader';
import CommunityLayout from '@/components/community/CommunityLayout';

const Community = () => {
  const { user: authUser } = useAuth();
  const { userData } = useProfile();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { trackFeatureUse } = useAnalytics();
  
  // Build user data from profile and auth (same pattern as Dashboard)
  const user = {
    name: userData?.name || authUser?.email?.split('@')[0] || 'User',
    avatarUrl: userData?.avatarUrl || authUser?.user_metadata?.avatar_url || '',
    unimogModel: userData?.unimogModel || '',
    vehiclePhotoUrl: userData?.vehiclePhotoUrl || '',
    useVehiclePhotoAsProfile: userData?.useVehiclePhotoAsProfile || false
  };
  
  // Use the presence hook to track user's online status
  useUserPresence();
  
  // Track page visit
  useEffect(() => {
    trackFeatureUse('page_visit', {
      page: 'community',
      has_groups: true
    });
  }, [trackFeatureUse]);

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
    <Layout isLoggedIn={!!authUser} user={user}>
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
