
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Store, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketplaceListingsPage } from '@/components/marketplace/MarketplaceListingsPage';

const Marketplace = () => {
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
              Marketplace
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Buy, sell, and trade Unimog parts, accessories, and vehicles with fellow enthusiasts.
            </p>
          </div>
          <Button 
            className="bg-primary flex items-center gap-2"
            asChild
          >
            <Link to="/marketplace/create">
              <Plus size={16} />
              <span>Create Listing</span>
            </Link>
          </Button>
        </div>
        
        <MarketplaceListingsPage />
      </div>
    </Layout>
  );
};

export default Marketplace;
