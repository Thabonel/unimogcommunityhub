
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

const Trips = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };

  return (
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Trip Planning
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Plan and share your Unimog adventures with the community.
            </p>
          </div>
          <Button className="bg-primary flex items-center gap-2">
            <Map size={16} />
            <span>Plan Trip</span>
          </Button>
        </div>
        
        <div className="grid place-items-center py-12">
          <div className="max-w-md text-center">
            <Map size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Trip Planning Coming Soon</h2>
            <p className="text-muted-foreground mb-4">
              We're building powerful tools to help you plan and share your Unimog adventures. 
              Check back soon for updates!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Trips;
