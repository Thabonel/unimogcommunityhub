
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { CommunityImprovementDashboard } from '@/components/community/improvement/CommunityImprovementDashboard';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useEffect } from 'react';

export default function CommunityImprovement() {
  const { user } = useAuth();
  const { trackFeatureUse } = useAnalytics();
  
  useEffect(() => {
    // Track page view using analytics hook
    trackFeatureUse('view_community_improvement');
  }, [trackFeatureUse]);

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" asChild>
            <Link to="/community">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Community
            </Link>
          </Button>
        </div>
        
        <Separator className="my-6" />
        
        <CommunityImprovementDashboard />
      </div>
    </Layout>
  );
}
