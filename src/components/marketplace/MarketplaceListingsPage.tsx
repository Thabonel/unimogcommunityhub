
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';
import { MarketplaceListingCard } from '@/components/marketplace/MarketplaceListingCard';
import { AmazonProductCard } from '@/components/marketplace/AmazonProductCard';
import { useMarketplaceListings, useSearchFilters } from '@/hooks/use-marketplace';
import { useAmazonProducts } from '@/hooks/use-amazon-products';
import { Separator } from '@/components/ui/separator';

export function MarketplaceListingsPage() {
  const { t } = useTranslation('marketplace');
  const { filters, updateFilters } = useSearchFilters();
  const [searchParams] = useSearchParams();
  const { data: listings, isLoading, error } = useMarketplaceListings(filters);
  const { data: amazonProducts = [], isLoading: isLoadingAmazon } = useAmazonProducts({
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    searchTerm: filters.searchTerm,
  });
  
  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const searchTerm = searchParams.get('q');
    
    updateFilters({
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      condition: condition as any || undefined,
      searchTerm: searchTerm || undefined,
    });
  }, []);
  
  return (
    <div className="space-y-6">
      <MarketplaceSearch />
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('errors.title')}</AlertTitle>
          <AlertDescription>
            {t('errors.failed_to_load')}
          </AlertDescription>
        </Alert>
      )}
      
      {(isLoading || isLoadingAmazon) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-72"></div>
          ))}
        </div>
      ) : (listings?.length === 0 && amazonProducts.length === 0) ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">{t('listings.no_listings_title')}</h3>
          <p className="text-muted-foreground mb-6">
            {t('listings.no_listings_description')}
          </p>
          <Button variant="outline" onClick={() => updateFilters({})}>
            {t('listings.clear_all_filters')}
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {amazonProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-[#FF9900]" />
                <h2 className="text-xl font-semibold">Amazon Products</h2>
                <span className="text-sm text-muted-foreground">({amazonProducts.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {amazonProducts.map((product) => (
                  <div key={product.id} className="h-full">
                    <AmazonProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {amazonProducts.length > 0 && listings && listings.length > 0 && (
            <Separator className="my-6" />
          )}

          {listings && listings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Community Listings</h2>
                <span className="text-sm text-muted-foreground">({listings.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <div key={listing.id} className="h-full">
                    <MarketplaceListingCard listing={listing} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
