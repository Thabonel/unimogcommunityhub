
import { Link } from 'react-router-dom';
import { Heart, MapPin, Eye } from 'lucide-react';
import { MarketplaceListing } from '@/types/marketplace';
import { useSaveListing, useSavedListings } from '@/hooks/use-marketplace';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ListingCardProps {
  listing: MarketplaceListing & { 
    timeAgo?: string; 
    viewCount?: number; 
    savedCount?: number;
  };
}

export function MarketplaceListingCard({ listing }: ListingCardProps) {
  const { user } = useAuth();
  const { data: savedListings = [] } = useSavedListings();
  const saveMutation = useSaveListing();
  
  const isSaved = savedListings.includes(listing.id);
  
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to save listings');
      return;
    }
    
    saveMutation.mutate({ 
      listingId: listing.id, 
      save: !isSaved 
    });
  };
  
  return (
    <Link to={`/marketplace/${listing.id}`}>
      <div className="group relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {listing.photos && listing.photos.length > 0 ? (
            <img
              src={listing.photos[0]}
              alt={listing.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Save Button */}
          <button
            onClick={handleSaveClick}
            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Save listing"
          >
            <Heart 
              className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-3">
          {/* Price */}
          <div className="font-bold text-lg mb-1">
            ${listing.price.toLocaleString()}
          </div>
          
          {/* Title */}
          <h3 className="text-sm font-normal text-gray-900 line-clamp-2 mb-1">
            {listing.title}
          </h3>
          
          {/* Location and Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            {listing.location && (
              <>
                <MapPin className="h-3 w-3" />
                <span>{listing.location}</span>
                <span>·</span>
              </>
            )}
            <span>{listing.timeAgo || 'Recently'}</span>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {listing.viewCount !== undefined && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{listing.viewCount} views</span>
              </div>
            )}
            {listing.savedCount !== undefined && listing.savedCount > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{listing.savedCount} saved</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
