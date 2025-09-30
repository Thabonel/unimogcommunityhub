import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, TrendingUp } from 'lucide-react';
import { useDashboardVehicle } from '@/hooks/use-dashboard-vehicle';
import { useAuth } from '@/contexts/AuthContext';

export const VehicleHeroBanner = () => {
  const { user } = useAuth();
  const { data: vehicle, isLoading } = useDashboardVehicle(user?.id);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get the main photo
  const mainPhoto = vehicle?.photos?.[0] || vehicle?.thumbnail_url;
  const hasPhoto = mainPhoto && !imageError;

  // Don't render anything while loading
  if (isLoading) {
    return (
      <div className="w-full h-[300px] md:h-[220px] sm:h-[180px] bg-gradient-to-br from-military-green/20 to-camo-brown/20 animate-pulse rounded-lg mb-6" />
    );
  }

  // Don't render if no vehicle
  if (!vehicle) {
    return null;
  }

  return (
    <div className="relative w-full h-[300px] md:h-[220px] sm:h-[180px] rounded-lg overflow-hidden mb-6 group">
      {/* Background Image or Placeholder */}
      {hasPhoto ? (
        <>
          {/* Loading skeleton while image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-military-green/20 to-camo-brown/20 animate-pulse" />
          )}

          {/* Actual image */}
          <img
            src={mainPhoto}
            alt={`${vehicle.name} - ${vehicle.model}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />

          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </>
      ) : (
        /* Placeholder when no photo */
        <div className="absolute inset-0 bg-gradient-to-br from-military-green/30 via-camo-brown/20 to-khaki-tan/30 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
              <Camera className="w-10 h-10 text-white/60" />
            </div>
            <p className="text-white/80 text-lg font-medium mb-2">
              Showcase Your {vehicle.model}
            </p>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Add photos of your vehicle to personalize your dashboard
            </p>
            <Link
              to="/community"
              className="inline-block mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md text-white text-sm font-medium transition-colors"
            >
              Add Photos in Community
            </Link>
          </div>
        </div>
      )}

      {/* Vehicle Info Overlay (only show when there's a photo) */}
      {hasPhoto && (
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-xl sm:text-lg font-bold text-white mb-1">
                {vehicle.name}
              </h2>
              <p className="text-white/90 text-lg md:text-base sm:text-sm font-medium">
                {vehicle.model} {vehicle.year && `• ${vehicle.year}`}
              </p>
            </div>

            {/* Optional: Photo count badge */}
            {vehicle.photos && vehicle.photos.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                <Camera className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  {vehicle.photos.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtle animation on hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
    </div>
  );
};