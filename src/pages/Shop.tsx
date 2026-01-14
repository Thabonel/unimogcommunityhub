import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExternalLink, Star, Search, Package, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrencySymbol } from '@/utils/currencyUtils';
import { convertCurrency } from '@/services/exchangeRateService';
import { useUserLocationWithCurrency } from '@/hooks/use-user-location-with-currency';
import {
  getRegionalAffiliateURL,
  getRegionalAffiliateURLWithASINs,
  getAmazonRegion,
  getRegionDisplayName,
  getAmazonDomain,
  getRegionalPrice,
  extractASIN,
} from '@/services/amazonAffiliateService';

interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  short_description: string;
  category: string;
  price: number;
  currency: string;
  image_url: string;
  affiliate_provider: string;
  affiliate_url: string;
  asin: string | null;
  regional_asins: Record<string, string> | null;
  regional_prices: Record<string, { amount: number; currency: string }> | null;
  regional_urls: Record<string, string> | null;
  is_featured: boolean;
  click_count: number;
}

const CATEGORIES = [
  { value: 'all', label: 'All Products' },
  { value: 'recovery_gear', label: 'Recovery Gear' },
  { value: 'camping_expedition', label: 'Camping & Expedition' },
  { value: 'tools_maintenance', label: 'Tools & Maintenance' },
  { value: 'parts_upgrades', label: 'Parts & Upgrades' },
  { value: 'books_manuals', label: 'Books & Manuals' },
  { value: 'apparel_merchandise', label: 'Apparel & Merchandise' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'outdoor_gear', label: 'Outdoor Gear' },
];

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { location } = useUserLocationWithCurrency();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['affiliate-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_products')
        .select('*')
        .eq('is_active', true)
        .or('availability_status.is.null,availability_status.in.(available,unknown)')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AffiliateProduct[];
    },
  });

  const handleProductClick = async (product: AffiliateProduct) => {
    // Get user's country code for regional routing
    const userCountryCode = location?.countryCode || 'US';

    // Build regional affiliate URL for Amazon products
    // Uses regional_asins if configured, falls back to US ASIN
    const regionalURL = product.affiliate_provider === 'amazon'
      ? getRegionalAffiliateURLWithASINs(
          product.affiliate_url,
          userCountryCode,
          product.regional_asins,
          product.regional_urls
        )
      : product.affiliate_url;

    const amazonRegion = product.affiliate_provider === 'amazon'
      ? getAmazonRegion(userCountryCode)
      : null;

    // IMPORTANT: Open window IMMEDIATELY before any async calls
    // Browsers block window.open() if not directly triggered by user action
    // Async awaits break the user action chain and cause popup blockers
    window.open(regionalURL, '_blank', 'noopener,noreferrer');

    // Show regional routing feedback
    if (product.affiliate_provider === 'amazon' && amazonRegion) {
      toast({
        title: `Opening Amazon ${getRegionDisplayName(amazonRegion)}`,
        description: `Redirecting to ${getAmazonDomain(amazonRegion)}`,
      });
    }

    // Track the click asynchronously (fire and forget - user already redirected)
    try {
      await supabase.from('affiliate_product_clicks').insert([
        {
          product_id: product.id,
          user_agent: navigator.userAgent,
          referrer: window.location.href,
          metadata: {
            country_code: userCountryCode,
            amazon_region: amazonRegion,
            regional_url: regionalURL,
            asin: product.asin || extractASIN(product.affiliate_url),
          },
        },
      ]);

      // Increment click count
      await supabase.rpc('increment_product_clicks', { product_uuid: product.id });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.short_description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredProducts = filteredProducts.filter(p => p.is_featured);
  const regularProducts = filteredProducts.filter(p => !p.is_featured);

  return (
    <Layout>
      <div className="container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Unimog Shop</h1>
            <p className="text-muted-foreground text-lg">
              Curated gear and accessories for Unimog owners and adventurers
            </p>
            <p className="text-sm text-muted-foreground">
              Supporting links help keep this community running
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[250px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredProducts.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'No products match your search'
                    : 'No products available yet'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h2 className="text-2xl font-bold">Featured Products</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                    userCountryCode={location?.countryCode}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Products */}
          {regularProducts.length > 0 && (
            <div className="space-y-4">
              {featuredProducts.length > 0 && (
                <h2 className="text-2xl font-bold">All Products</h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={handleProductClick}
                    userCountryCode={location?.countryCode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

interface ProductCardProps {
  product: AffiliateProduct;
  onProductClick: (product: AffiliateProduct) => void;
  userCountryCode: string | undefined;
}

function ProductCard({ product, onProductClick, userCountryCode }: ProductCardProps) {
  const { user } = useAuth();
  const categoryLabel = CATEGORIES.find(c => c.value === product.category)?.label || product.category;
  const [viewerCurrency, setViewerCurrency] = useState<string>('USD');
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Get regional Amazon info for badge display
  const amazonRegion = product.affiliate_provider === 'amazon'
    ? getAmazonRegion(userCountryCode)
    : null;
  const regionalDomain = amazonRegion ? getAmazonDomain(amazonRegion) : null;

  // Get regional price if available (for Amazon products)
  const regionalPrice = amazonRegion && product.regional_prices
    ? getRegionalPrice(product.regional_prices, amazonRegion)
    : null;

  useEffect(() => {
    const fetchViewerCurrency = async () => {
      if (!user) {
        const locale = navigator.language;
        if (locale.includes('AU')) setViewerCurrency('AUD');
        else if (locale.includes('GB')) setViewerCurrency('GBP');
        else if (locale.includes('EU') || locale.includes('DE') || locale.includes('FR')) setViewerCurrency('EUR');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('currency')
          .eq('id', user.id)
          .single();

        if (!error && data?.currency) {
          setViewerCurrency(data.currency);
        }
      } catch (error) {
        console.error('Error fetching viewer currency:', error);
      }
    };

    fetchViewerCurrency();
  }, [user]);

  useEffect(() => {
    const performConversion = async () => {
      if (product.currency === viewerCurrency) {
        setConvertedPrice(product.price);
        return;
      }

      setIsConverting(true);
      try {
        const converted = await convertCurrency(product.price, product.currency, viewerCurrency);
        setConvertedPrice(converted);
      } catch (error) {
        console.error('Error converting currency:', error);
        setConvertedPrice(product.price);
      } finally {
        setIsConverting(false);
      }
    };

    performConversion();
  }, [product.price, product.currency, viewerCurrency]);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {product.image_url && (
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
            {product.is_featured && (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {categoryLabel}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {product.affiliate_provider}
            </Badge>
            {amazonRegion && regionalDomain && (
              <Badge variant="default" className="text-xs bg-amazon-orange hover:bg-amazon-orange/90">
                <Globe className="h-3 w-3 mr-1" />
                Amazon {amazonRegion}
              </Badge>
            )}
          </div>
        </div>
        {product.short_description && (
          <CardDescription className="line-clamp-2">
            {product.short_description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {product.price && (
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {regionalPrice ? (
                // Show regional price if available (no conversion needed)
                <>
                  {getCurrencySymbol(regionalPrice.currency)}
                  {regionalPrice.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  <span className="text-xs text-green-600 ml-2">
                    Regional Price
                  </span>
                </>
              ) : isConverting ? (
                <span className="text-gray-400">Loading...</span>
              ) : (
                // Fallback to converted price
                <>
                  {getCurrencySymbol(viewerCurrency)}
                  {convertedPrice?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                  {product.currency !== viewerCurrency && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({getCurrencySymbol(product.currency)}{product.price.toFixed(2)})
                    </span>
                  )}
                </>
              )}
            </div>
            {product.affiliate_provider === 'amazon' && !regionalPrice && (
              <p className="text-xs text-muted-foreground">
                Estimated from US price • See {amazonRegion} Amazon for local pricing
              </p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onProductClick(product)}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Product
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Shop;
