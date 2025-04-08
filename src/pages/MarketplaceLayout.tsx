
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Store, Plus, FilterX } from 'lucide-react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useSearchFilters } from '@/hooks/use-marketplace';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentInfoNotice } from '@/components/marketplace/auth/PaymentInfoNotice';
import { MarketplaceNotifications } from '@/components/marketplace/notifications/MarketplaceNotification';

const MarketplaceLayout = () => {
  const { user } = useAuth();
  const { filters, resetFilters } = useSearchFilters();
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const location = useLocation();
  
  // Check if the user is navigating to the account settings page with a tab parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab === 'transactions') {
      // Redirect to the account settings page with transactions tab
      window.location.href = '/marketplace/account-settings?tab=transactions';
    }
  }, [location]);

  // Only show the header on the main marketplace page
  const isMainMarketplace = location.pathname === '/marketplace';

  return (
    <Layout isLoggedIn={true}>
      {isMainMarketplace && (
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
        </div>
      )}
      
      <Outlet />
    </Layout>
  );
};

export default MarketplaceLayout;
