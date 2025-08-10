
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketplaceListingsPage } from '@/components/marketplace/MarketplaceListingsPage';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

const Marketplace = () => {
  const { user } = useAuth();
  
  return (
    <Layout isLoggedIn={!!user}>
      <div className="container pb-8 military-card p-4 rounded-lg">
        <MarketplaceListingsPage />
      </div>
    </Layout>
  );
};

export default Marketplace;
