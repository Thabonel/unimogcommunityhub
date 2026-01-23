import { ExternalLink, ShoppingCart, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { getCurrencySymbol } from '@/utils/currencyUtils';
import { convertCurrency } from '@/services/exchangeRateService';
import { AmazonProduct } from '@/utils/amazonAffiliate';
import { buildAmazonURL, getAmazonRegion } from '@/services/amazonAffiliateService';
import { Badge } from '@/components/ui/badge';

interface AmazonProductCardProps {
  product: AmazonProduct;
}

export function AmazonProductCard({ product }: AmazonProductCardProps) {
  const { t } = useTranslation('marketplace');
  const { user } = useAuth();
  const [viewerCurrency, setViewerCurrency] = useState<string>('USD');
  const [userCountryCode, setUserCountryCode] = useState<string>('US');
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    const fetchViewerPreferences = async () => {
      if (!user) {
        const locale = navigator.language;
        if (locale.includes('AU')) {
          setViewerCurrency('AUD');
          setUserCountryCode('AU');
        } else if (locale.includes('GB')) {
          setViewerCurrency('GBP');
          setUserCountryCode('GB');
        } else if (locale.includes('DE')) {
          setViewerCurrency('EUR');
          setUserCountryCode('DE');
        } else if (locale.includes('FR')) {
          setViewerCurrency('EUR');
          setUserCountryCode('FR');
        } else if (locale.includes('IT')) {
          setViewerCurrency('EUR');
          setUserCountryCode('IT');
        } else if (locale.includes('ES')) {
          setViewerCurrency('EUR');
          setUserCountryCode('ES');
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('currency, country')
          .eq('id', user.id)
          .single();

        if (!error && data) {
          if (data.currency) setViewerCurrency(data.currency);
          if (data.country) setUserCountryCode(data.country);
        }
      } catch (error) {
        console.error('Error fetching viewer preferences:', error);
      }
    };

    fetchViewerPreferences();
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

  const amazonRegion = getAmazonRegion(userCountryCode);
  const affiliateLink = buildAmazonURL(product.asin, amazonRegion);

  const isPriceRecentlyChanged = () => {
    if (!product.last_price_check) return false;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(product.last_price_check) > sevenDaysAgo;
  };

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
        )}

        <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-[#FF9900] hover:bg-[#FF9900]/90 text-white text-[10px] sm:text-xs px-1.5 sm:px-2">
          Amazon
        </Badge>

        {product.availability_status === 'available' && (
          <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-green-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 hidden sm:inline-flex">
            In Stock
          </Badge>
        )}

        {product.availability_status === 'out_of_stock' && (
          <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-orange-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 hidden sm:inline-flex">
            Limited
          </Badge>
        )}

        {isPriceRecentlyChanged() && (
          <Badge className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-blue-500 text-white flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2">
            <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3" />
            <span className="hidden sm:inline">Price Drop</span>
            <span className="sm:hidden">Sale</span>
          </Badge>
        )}
      </div>

      <div className="p-1.5 sm:p-3">
        <div className="font-semibold text-xs sm:text-base">
          {isConverting ? (
            <span className="text-gray-400">{t('listing_card.loading_price')}</span>
          ) : (
            <>
              {getCurrencySymbol(viewerCurrency)}
              {convertedPrice?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              {product.currency !== viewerCurrency && (
                <span className="text-xs text-gray-500 ml-1">
                  ({getCurrencySymbol(product.currency)}{product.price.toLocaleString()})
                </span>
              )}
            </>
          )}
        </div>

        <div className="text-xs sm:text-sm text-gray-900 line-clamp-2 mt-0.5 sm:mt-1">
          {product.title}
        </div>

        {product.description && (
          <div className="text-[10px] sm:text-xs text-gray-600 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 hidden sm:block">
            {product.description}
          </div>
        )}

        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 sm:mt-3 w-full inline-flex items-center justify-center gap-1 sm:gap-2 bg-[#FF9900] hover:bg-[#FF9900]/90 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="hidden sm:inline">View on Amazon</span>
          <span className="sm:hidden">Amazon</span>
          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
        </a>
      </div>
    </div>
  );
}
