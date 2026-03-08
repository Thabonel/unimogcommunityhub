
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Package } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';
import { MarketplaceListingCard } from '@/components/marketplace/MarketplaceListingCard';
import { AmazonProductCard } from '@/components/marketplace/AmazonProductCard';
import { useMarketplaceListings, useSearchFilters } from '@/hooks/use-marketplace';
import { useAmazonProducts } from '@/hooks/use-amazon-products';
import { useBarry } from '@/contexts/BarryContext';
import { Separator } from '@/components/ui/separator';
import { SITE_IMAGES } from '@/config/images';

export function MarketplaceListingsPage() {
  const { t } = useTranslation('marketplace');
  const { filters, updateFilters } = useSearchFilters();
  const [searchParams] = useSearchParams();
  const { openBarry } = useBarry();
  const { data: listings, isLoading, error } = useMarketplaceListings(filters);
  const { data: amazonProducts = [], isLoading: isLoadingAmazon } = useAmazonProducts({
    category: filters.category,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    searchTerm: filters.searchTerm,
  });

  // Ask Barry with marketplace context
  const handleAskBarry = (question: string) => {
    const currentFilters = [];
    if (filters.category) currentFilters.push(`Category: ${filters.category}`);
    if (filters.searchTerm) currentFilters.push(`Searching for: ${filters.searchTerm}`);
    if (filters.minPrice || filters.maxPrice) {
      const priceRange = `$${filters.minPrice || 0} - $${filters.maxPrice || '∞'}`;
      currentFilters.push(`Price range: ${priceRange}`);
    }

    const contextualQuestion = `${question}

Current marketplace search context:
${currentFilters.length > 0 ? currentFilters.join('\n') : 'Browsing all parts and vehicles'}`;

    openBarry(contextualQuestion);
  };
  
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

      {/* Ask Barry Contextual Prompt */}
      <Card className="bg-gradient-to-r from-military-green/5 to-khaki-tan/5 border-military-green/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <picture>
                <source srcSet={SITE_IMAGES.barryAvatar} type="image/webp" />
                <img
                  src={SITE_IMAGES.barryAvatarFallback}
                  alt="Barry the AI Mechanic"
                  className="w-8 h-8 rounded-full border border-military-green"
                />
              </picture>
            </div>
            <div>
              <h3 className="text-sm font-medium text-military-green">Ask Barry about parts</h3>
              <p className="text-xs text-muted-foreground">Get expert advice from our AI mechanic</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-military-green text-military-green hover:bg-military-green hover:text-white"
              onClick={() => handleAskBarry("What parts do I need for basic maintenance on my Unimog?")}
            >
              Basic maintenance parts
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-military-green text-military-green hover:bg-military-green hover:text-white"
              onClick={() => handleAskBarry("How do I identify if a part will fit my specific Unimog model?")}
            >
              Part compatibility
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-military-green text-military-green hover:bg-military-green hover:text-white"
              onClick={() => handleAskBarry("What should I look for when buying used Unimog parts?")}
            >
              Buying used parts
            </Button>
          </div>
        </CardContent>
      </Card>

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 animate-pulse">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-48 sm:h-72"></div>
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
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
