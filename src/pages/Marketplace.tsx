
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketplaceListingsPage } from '@/components/marketplace/MarketplaceListingsPage';

const Marketplace = () => {
  return (
    <div className="container pb-8">
      <MarketplaceListingsPage />
    </div>
  );
};

export default Marketplace;
