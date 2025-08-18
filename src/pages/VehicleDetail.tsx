import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Heart, 
  Eye, 
  MessageCircle, 
  MapPin, 
  Calendar,
  Settings,
  Share2,
  Flag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Crown,
  TrendingUp,
  User,
  Wrench,
  Camera
} from 'lucide-react';
import { VehicleShowcaseInfo } from '@/hooks/vehicle-maintenance/types';
import { useVehicleLikes } from '@/hooks/use-vehicle-likes';
import { useVehicleViews } from '@/hooks/use-vehicle-views';
import { useVehicleShowcase } from '@/hooks/use-vehicle-showcase';
import { getCountryFlag, getCountryName, formatLocation } from '@/utils/countryUtils';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const VehicleDetail = () => {
  const { userId, vehicleId } = useParams<{ userId: string; vehicleId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState<VehicleShowcaseInfo | null>(null);
  const [relatedVehicles, setRelatedVehicles] = useState<VehicleShowcaseInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showFullscreenGallery, setShowFullscreenGallery] = useState(false);

  const { toggleLike, isLiking } = useVehicleLikes();
  const { trackView } = useVehicleViews();
  const { fetchShowcaseVehicles } = useVehicleShowcase();

  useEffect(() => {
    if (vehicleId) {
      loadVehicleDetail();
      trackView(vehicleId);
    }
  }, [vehicleId]);

  const loadVehicleDetail = async () => {
    if (!vehicleId || !userId) return;

    setIsLoading(true);
    try {
      // Fetch the specific vehicle with all details
      const vehicles = await fetchShowcaseVehicles({}, 'newest', 1000);
      const targetVehicle = vehicles.find(v => v.id === vehicleId && v.user_id === userId);
      
      if (!targetVehicle) {
        toast({
          title: 'Vehicle not found',
          description: 'This vehicle may not exist or is not public.',
          variant: 'destructive'
        });
        navigate('/community/members');
        return;
      }

      setVehicle(targetVehicle);

      // Load related vehicles (same country or model)
      const related = vehicles
        .filter(v => 
          v.id !== vehicleId && 
          (v.country_code === targetVehicle.country_code || v.model === targetVehicle.model)
        )
        .slice(0, 6);
      
      setRelatedVehicles(related);
    } catch (error) {
      console.error('Error loading vehicle detail:', error);
      toast({
        title: 'Error loading vehicle',
        description: 'Failed to load vehicle details. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!vehicleId) return;
    const newLikeStatus = await toggleLike(vehicleId);
    
    // Update local state optimistically
    if (vehicle) {
      setVehicle({
        ...vehicle,
        user_has_liked: newLikeStatus,
        total_likes: newLikeStatus ? vehicle.total_likes + 1 : vehicle.total_likes - 1
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle?.name} - ${vehicle?.model}`,
          text: `Check out this amazing ${vehicle?.model} on UnimogCommunityHub!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Vehicle URL copied to clipboard.'
      });
    }
  };

  const nextPhoto = () => {
    if (vehicle?.photos && currentPhotoIndex < vehicle.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!vehicle) {
    return (
      <Layout isLoggedIn={!!user}>
        <div className="container py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
          <p className="text-muted-foreground mb-4">This vehicle may not exist or is not public.</p>
          <Button asChild>
            <Link to="/community/members">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Showcase
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const photos = vehicle.photos || (vehicle.thumbnail_url ? [vehicle.thumbnail_url] : []);
  const hasMultiplePhotos = photos.length > 1;

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/community/members" className="hover:text-primary">
            Vehicle Showcase
          </Link>
          <span>›</span>
          <span>{getCountryName(vehicle.country_code)}</span>
          <span>›</span>
          <span className="text-foreground">{vehicle.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/community/members">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Showcase
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Gallery */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative">
                {photos.length > 0 ? (
                  <>
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={photos[currentPhotoIndex]}
                        alt={`${vehicle.name} - Photo ${currentPhotoIndex + 1}`}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setShowFullscreenGallery(true)}
                      />
                    </div>
                    
                    {/* Photo Navigation */}
                    {hasMultiplePhotos && (
                      <>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                              onClick={prevPhoto}
                              disabled={currentPhotoIndex === 0}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>Previous photo</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                              onClick={nextPhoto}
                              disabled={currentPhotoIndex === photos.length - 1}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Next photo</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        {/* Photo Counter */}
                        <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                          {currentPhotoIndex + 1} / {photos.length}
                        </Badge>
                      </>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {vehicle.country_code && (
                        <Badge className="bg-white/90 text-black">
                          {getCountryFlag(vehicle.country_code)} {vehicle.country_code}
                        </Badge>
                      )}
                      {vehicle.trending_score > 100 && (
                        <Badge className="bg-red-500 text-white animate-pulse">
                          🔥 Hot
                        </Badge>
                      )}
                      {vehicle.showcase_order && vehicle.showcase_order <= 10 && (
                        <Badge className="bg-yellow-500 text-black">
                          <Crown className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                    <Camera className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>

            {/* Photo Thumbnails */}
            {hasMultiplePhotos && (
              <div className="grid grid-cols-5 gap-2">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`aspect-square overflow-hidden rounded border-2 transition-colors ${
                      index === currentPhotoIndex ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{vehicle.name}</h1>
              <p className="text-xl text-muted-foreground">
                {vehicle.model} • {vehicle.year}
              </p>
            </div>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={vehicle.owner_avatar} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{vehicle.owner_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatLocation(vehicle.city, vehicle.region, vehicle.country_code)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant={vehicle.user_has_liked ? "default" : "outline"}
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center gap-2"
              >
                <Heart className={`w-4 h-4 ${vehicle.user_has_liked ? 'fill-current' : ''}`} />
                {vehicle.total_likes} Likes
              </Button>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Eye className="w-4 h-4" />
                <span>{vehicle.total_views} views</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{vehicle.total_comments} comments</span>
              </div>

              <div className="ml-auto flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share this vehicle</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Report this vehicle</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{vehicle.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Modifications */}
            {vehicle.modifications && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Modifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{vehicle.modifications}</p>
                </CardContent>
              </Card>
            )}

            {/* Specifications */}
            {vehicle.specs && Object.keys(vehicle.specs).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(vehicle.specs).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm font-medium capitalize">
                          {key.replace('_', ' ')}
                        </p>
                        <p className="text-sm text-muted-foreground">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Added</span>
                  <span className="text-sm">
                    {formatDistanceToNow(new Date(vehicle.created_at), { addSuffix: true })}
                  </span>
                </div>
                {vehicle.current_odometer && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Odometer</span>
                    <span className="text-sm">
                      {vehicle.current_odometer.toLocaleString()} {vehicle.odometer_unit}
                    </span>
                  </div>
                )}
                {vehicle.vin && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">VIN</span>
                    <span className="text-sm font-mono">{vehicle.vin}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Vehicles */}
        {relatedVehicles.length > 0 && (
          <div className="space-y-4">
            <Separator />
            <h2 className="text-2xl font-bold">More from {getCountryName(vehicle.country_code)}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedVehicles.map((relatedVehicle) => (
                <Link
                  key={relatedVehicle.id}
                  to={`/community/members/${relatedVehicle.user_id}/vehicle/${relatedVehicle.id}`}
                  className="group"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={relatedVehicle.photos?.[0] || relatedVehicle.thumbnail_url || '/placeholder.svg'}
                        alt={relatedVehicle.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1">{relatedVehicle.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {relatedVehicle.model} • {relatedVehicle.year}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {relatedVehicle.total_likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {relatedVehicle.total_views}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VehicleDetail;