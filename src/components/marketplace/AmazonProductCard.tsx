import { ExternalLink, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { getCurrencySymbol } from '@/utils/currencyUtils';
import { convertCurrency } from '@/services/exchangeRateService';
import { buildAmazonAffiliateLink, AmazonProduct } from '@/utils/amazonAffiliate';
import { Badge } from '@/components/ui/badge';

interface AmazonProductCardProps {
  product: AmazonProduct;
}

export function AmazonProductCard({ product }: AmazonProductCardProps) {
  const { t } = useTranslation('marketplace');
  const { user } = useAuth();
  const [viewerCurrency, setViewerCurrency] = useState<string>('USD');
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

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

  const affiliateLink = buildAmazonAffiliateLink(product.asin);

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

        <Badge className="absolute top-2 left-2 bg-[#FF9900] hover:bg-[#FF9900]/90 text-white">
          Amazon
        </Badge>
      </div>

      <div className="p-3">
        <div className="font-semibold text-base">
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

        <div className="text-sm text-gray-900 line-clamp-2 mt-1">
          {product.title}
        </div>

        {product.description && (
          <div className="text-xs text-gray-600 line-clamp-2 mt-1">
            {product.description}
          </div>
        )}

        <a
          href={affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#FF9900] hover:bg-[#FF9900]/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <span>View on Amazon</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
