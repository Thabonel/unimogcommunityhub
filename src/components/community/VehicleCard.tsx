import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Heart, 
  Eye, 
  MessageCircle, 
  MapPin, 
  Camera, 
  Wrench, 
  TrendingUp,
  Star,
  Crown
} from 'lucide-react';
import { VehicleShowcaseInfo } from '@/hooks/vehicle-maintenance/types';
import { useVehicleLikes } from '@/hooks/use-vehicle-likes';
import { useVehicleViews } from '@/hooks/use-vehicle-views';
import { getCountryFlag, getCountryName } from '@/utils/countryUtils';
import { formatDistanceToNow } from 'date-fns';

interface VehicleCardProps {
  vehicle: VehicleShowcaseInfo;
  className?: string;
}

const VehicleCard = ({ vehicle, className = '' }: VehicleCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const { toggleLike, isLiking } = useVehicleLikes();
  const { trackView } = useVehicleViews();

  // Get the main photo (first in array or thumbnail)
  const mainPhoto = vehicle.photos?.[0] || vehicle.thumbnail_url || '/placeholder.svg';
  
  // Get country flag and name
  const countryFlag = getCountryFlag(vehicle.country_code);
  const countryName = getCountryName(vehicle.country_code);
  
  // Format location display
  const locationDisplay = [vehicle.city, vehicle.region, countryName]
    .filter(Boolean)
    .join(', ');

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleLike(vehicle.id);
  };

  const handleView = () => {
    trackView(vehicle.id);
  };

  const getTrendingBadge = () => {
    if (vehicle.trending_score > 100) {
      return (
        <Badge className="absolute top-2 left-2 bg-red-500 text-white animate-pulse">
          🔥 Hot
        </Badge>
      );
    }
    if (vehicle.trending_score > 50) {
      return (
        <Badge className="absolute top-2 left-2 bg-orange-500 text-white">
          <TrendingUp className="w-3 h-3 mr-1" />
          Trending
        </Badge>
      );
    }
    return null;
  };

  const getFeaturedBadge = () => {
    if (vehicle.showcase_order && vehicle.showcase_order <= 10) {
      return (
        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
          <Crown className="w-3 h-3 mr-1" />
          Featured
        </Badge>
      );
    }
    return null;
  };

  return (
    <Link to={`/community/members/${vehicle.user_id}/vehicle/${vehicle.id}`} onClick={handleView}>
      <Card className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${className}`}>
        <div className="relative">
          {/* Main Vehicle Image */}
          <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
            {!imageError ? (
              <img
                src={mainPhoto}
                alt={`${vehicle.name} - ${vehicle.model}`}
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                  isImageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={() => setIsImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setIsImageLoading(false);
                }}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Camera className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Image Loading Placeholder */}
            {isImageLoading && (
              <div className="absolute inset-0 animate-pulse bg-muted rounded-t-lg" />
            )}
          </div>

          {/* Trending Badge */}
          {getTrendingBadge()}

          {/* Featured Badge */}
          {getFeaturedBadge()}

          {/* Photo Count Badge */}
          {vehicle.photos && vehicle.photos.length > 1 && (
            <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
              <Camera className="w-3 h-3 mr-1" />
              {vehicle.photos.length}
            </Badge>
          )}

          {/* Country Flag */}
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-white/90 text-black border">
              {countryFlag} {vehicle.country_code}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Vehicle Info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {vehicle.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {vehicle.model} • {vehicle.year}
            </p>
          </div>

          {/* Owner Info */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={vehicle.owner_avatar} />
              <AvatarFallback className="text-xs">
                {vehicle.owner_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              by {vehicle.owner_name || 'Unknown Owner'}
            </span>
          </div>

          {/* Location */}
          {locationDisplay && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{locationDisplay}</span>
            </div>
          )}

          {/* Modifications Preview */}
          {vehicle.modifications && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Wrench className="w-3 h-3" />
              <span className="line-clamp-1">
                {vehicle.modifications.length > 50 
                  ? `${vehicle.modifications.substring(0, 50)}...`
                  : vehicle.modifications
                }
              </span>
            </div>
          )}

          {/* Engagement Metrics */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-sm">
              {/* Views */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{vehicle.total_views || 0}</span>
              </div>

              {/* Comments */}
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{vehicle.total_comments || 0}</span>
              </div>
            </div>

            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 ${vehicle.user_has_liked ? 'text-red-500' : 'text-muted-foreground'}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart 
                className={`w-4 h-4 mr-1 ${vehicle.user_has_liked ? 'fill-current' : ''}`} 
              />
              <span className="text-sm">{vehicle.total_likes || 0}</span>
            </Button>
          </div>

          {/* Creation Date */}
          <div className="text-xs text-muted-foreground text-center pt-1">
            Added {formatDistanceToNow(new Date(vehicle.created_at), { addSuffix: true })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VehicleCard;