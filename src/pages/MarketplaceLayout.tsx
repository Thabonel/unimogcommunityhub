
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Store, Plus, FilterX } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MarketplaceListingsPage } from '@/components/marketplace/MarketplaceListingsPage';
import { useSearchFilters } from '@/hooks/use-marketplace';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentInfoNotice } from '@/components/marketplace/auth/PaymentInfoNotice';
import { MarketplaceNotifications } from '@/components/marketplace/notifications/MarketplaceNotification';

const MarketplaceLayout = () => {
  const { user } = useAuth();
  const { filters, resetFilters } = useSearchFilters();
  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <Layout isLoggedIn={true}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Marketplace
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Buy, sell, and trade Unimog parts, accessories, and vehicles with fellow enthusiasts.
            </p>
          </div>
          <div className="flex gap-3">
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={resetFilters} 
                className="flex items-center gap-2"
              >
                <FilterX size={16} />
                <span>Clear filters</span>
              </Button>
            )}
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
        </div>
        
        {user && (
          <>
            <MarketplaceNotifications />
            <PaymentInfoNotice />
          </>
        )}
        
        <MarketplaceListingsPage />
      </div>
    </Layout>
  );
};

export default MarketplaceLayout;
