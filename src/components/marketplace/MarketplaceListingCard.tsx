
import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { MarketplaceListing } from '@/types/marketplace';

interface ListingCardProps {
  listing: MarketplaceListing & { 
    timeAgo?: string; 
  };
}

export function MarketplaceListingCard({ listing }: ListingCardProps) {
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
            ${listing.price.toLocaleString()}
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
