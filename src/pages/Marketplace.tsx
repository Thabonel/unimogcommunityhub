
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketplaceListingsPage } from '@/components/marketplace/MarketplaceListingsPage';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const Marketplace = () => {
  const { user } = useAuth();
  
  const userData = user ? {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  } : undefined;
  
  return (
    <Layout isLoggedIn={!!user} user={userData}>
      <div className="container pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200">
            Marketplace
          </h1>
          {user && (
            <Link to="/marketplace/create-listing">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </Link>
          )}
        </div>
        
        <div className="military-card p-4 rounded-lg">
          <MarketplaceListingsPage />
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;
