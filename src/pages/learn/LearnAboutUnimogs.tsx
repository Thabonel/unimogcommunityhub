
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import UnimogInfo from '@/components/unimog/UnimogInfo';
import { Button } from '@/components/ui/button';
import { ChevronRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscriptionGuard from '@/components/SubscriptionGuard';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { RandomUnimogFact } from '@/components/unimog/RandomUnimogFact';

const LearnAboutUnimogs = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Set page title for SEO
    document.title = 'Learn About Unimogs | Unimog Community Hub';
  }, []);

  return (
    <Layout isLoggedIn={!!user} user={user ? {
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatarUrl: user.user_metadata?.avatar_url,
      vehiclePhotoUrl: user.user_metadata?.vehicle_photo_url,
      useVehiclePhotoAsProfile: user.user_metadata?.use_vehicle_photo_as_profile
    } : undefined}>
      <SubscriptionGuard>
        <QueryClientProvider client={queryClient}>
          <div className="container py-8 md:py-12">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Learn About Unimogs</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-2">
                Discover the history, capabilities, and engineering behind Mercedes-Benz's legendary off-road vehicle.
              </p>
              <div className="flex justify-center mt-4">
                <RandomUnimogFact showAsButton />
              </div>
            </div>
            
            <UnimogInfo />
            
            <div className="mt-12 text-center">
              <h2 className="text-2xl font-bold mb-6">Want to share your own Unimog experience?</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/community">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Join the Community
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <Link to="/knowledge">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Browse Knowledge Base
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </QueryClientProvider>
      </SubscriptionGuard>
    </Layout>
  );
};

export default LearnAboutUnimogs;
