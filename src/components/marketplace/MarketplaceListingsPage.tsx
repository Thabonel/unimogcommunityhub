
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';
import { MarketplaceListingCard } from '@/components/marketplace/MarketplaceListingCard';
import { useMarketplaceListings, useSearchFilters } from '@/hooks/use-marketplace';

export function MarketplaceListingsPage() {
  const { filters, updateFilters } = useSearchFilters();
  const [searchParams] = useSearchParams();
  const { data: listings, isLoading, error } = useMarketplaceListings(filters);
  
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
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load marketplace listings. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-72"></div>
          ))}
        </div>
      ) : listings?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No listings found</h3>
          <p className="text-muted-foreground mb-6">
            No items match your current filters. Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={() => updateFilters({})}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings?.map((listing) => (
            <div key={listing.id} className="h-full">
              <MarketplaceListingCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
