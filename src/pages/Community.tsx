
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';

const Community = () => {
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
              Community
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Connect with other Unimog enthusiasts from around the world.
            </p>
          </div>
          <Button className="bg-primary flex items-center gap-2">
            <UserCircle size={16} />
            <span>Find Members</span>
          </Button>
        </div>
        
        <div className="grid place-items-center py-12">
          <div className="max-w-md text-center">
            <UserCircle size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Community Coming Soon</h2>
            <p className="text-muted-foreground mb-4">
              We're building a vibrant community platform for Unimog enthusiasts.
              Check back soon to connect with fellow owners and fans!
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Community;
