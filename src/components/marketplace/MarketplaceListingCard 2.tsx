
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { MarketplaceListing } from '@/types/marketplace';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { getCurrencySymbol } from '@/utils/currencyUtils';
import { convertCurrency } from '@/services/exchangeRateService';

interface ExtendedListing extends MarketplaceListing {
  timeAgo?: string;
  currency?: string; // Original currency from seller
}

interface ListingCardProps {
  listing: ExtendedListing;
}

export function MarketplaceListingCard({ listing }: ListingCardProps) {
  const { user } = useAuth();
  const [viewerCurrency, setViewerCurrency] = useState<string>('USD');
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Fetch viewer's currency preference
  useEffect(() => {
    const fetchViewerCurrency = async () => {
      if (!user) {
        // For non-logged-in users, try to detect from browser locale
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

  // Convert price when currencies are known
  useEffect(() => {
    const performConversion = async () => {
      const listingCurrency = listing.currency || 'USD';
      
      if (listingCurrency === viewerCurrency) {
        setConvertedPrice(listing.price);
        return;
      }
      
      setIsConverting(true);
      try {
        const converted = await convertCurrency(listing.price, listingCurrency, viewerCurrency);
        setConvertedPrice(converted);
      } catch (error) {
        console.error('Error converting currency:', error);
        setConvertedPrice(listing.price); // Fallback to original price
      } finally {
        setIsConverting(false);
      }
    };
    
    performConversion();
  }, [listing.price, listing.currency, viewerCurrency]);
  return (
    <Link to={`/marketplace/listing/${listing.id}`}>
      <div className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {listing.photos && listing.photos.length > 0 ? (
            <>
              <img
                src={listing.photos[0]}
                alt={listing.title}
                className="object-cover w-full h-full"
              />
              {/* Multiple photos indicator */}
              {listing.photos.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  <span>{listing.photos.length}</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-3">
          {/* Price */}
          <div className="font-semibold text-base">
            {isConverting ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              <>
                {getCurrencySymbol(viewerCurrency)}
                {convertedPrice?.toLocaleString(undefined, { 
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0 
                })}
                {/* Show original price if converted */}
                {listing.currency && listing.currency !== viewerCurrency && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({getCurrencySymbol(listing.currency)}{listing.price.toLocaleString()})
                  </span>
                )}
              </>
            )}
          </div>
          
          {/* Title */}
          <div className="text-sm text-gray-900 line-clamp-2 mt-1">
            {listing.title}
          </div>
          
          {/* Location */}
          {listing.location && (
            <div className="text-xs text-gray-500 mt-1">
              {listing.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
