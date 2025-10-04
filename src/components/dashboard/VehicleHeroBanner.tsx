import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Camera, TrendingUp, Edit } from 'lucide-react';
import { useDashboardVehicle } from '@/hooks/use-dashboard-vehicle';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { EditVehicleDialog } from '@/components/community/EditVehicleDialog';
import { useQueryClient } from '@tanstack/react-query';

export const VehicleHeroBanner = () => {
  const { user } = useAuth();
  const { data: vehicle, isLoading } = useDashboardVehicle(user?.id);
  const { preferences, isLoading: preferencesLoading } = useUserPreferences(user?.id);
  const queryClient = useQueryClient();
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);

  // Shuffle and select photos for the banner
  const bannerPhotos = useMemo(() => {
    if (!vehicle?.photos || vehicle.photos.length === 0) {
      return vehicle?.thumbnail_url ? [vehicle.thumbnail_url] : [];
    }

    const allPhotos = [...vehicle.photos];

    // Shuffle photos randomly
    const shuffled = allPhotos.sort(() => Math.random() - 0.5);

    // We need 4 photos for the banner
    const needed = 4;
    const result = [];

    // If we have fewer than 4 photos, repeat them
    for (let i = 0; i < needed; i++) {
      result.push(shuffled[i % shuffled.length]);
    }

    return result;
  }, [vehicle?.photos, vehicle?.thumbnail_url]);

  const hasPhotos = bannerPhotos.length > 0;

  // Check if user wants to display vehicle on dashboard
  const showOnDashboard = preferences?.show_vehicle_on_dashboard ?? true;

  // Handle successful vehicle edit
  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-vehicle'] });
    queryClient.invalidateQueries({ queryKey: ['user-vehicles'] });
    setIsEditingVehicle(false);
  };

  // Debug logging
  console.log('VehicleHeroBanner - Data:', {
    hasVehicle: !!vehicle,
    vehicleId: vehicle?.id,
    photosCount: vehicle?.photos?.length || 0,
    bannerPhotosCount: bannerPhotos.length,
    hasPhotos,
    showOnDashboard,
    displayMode: preferences?.dashboard_display_mode,
  });

  // Don't render anything while loading
  if (isLoading || preferencesLoading) {
    return (
      <div className="w-full h-[150px] md:h-[220px] sm:h-[180px] bg-gradient-to-br from-military-green/20 to-camo-brown/20 animate-pulse rounded-lg mb-6" />
    );
  }

  // Don't render if user has chosen to keep dashboard private
  if (!showOnDashboard) {
    return null;
  }

  return (
    <div className="relative w-full h-[180px] md:h-[220px] lg:h-[150px] rounded-lg overflow-hidden mb-6 group">
      {/* Photo Grid or Placeholder */}
      {hasPhotos ? (
        <>
          {/* Photo Grid - Single row on mobile (scrollable), 4 columns on desktop */}
          <div className="absolute inset-0 flex md:grid overflow-x-auto md:overflow-visible md:grid-cols-4 gap-0 snap-x snap-mandatory md:snap-none">
            {bannerPhotos.map((photo, index) => (
              <div key={index} className="relative flex-shrink-0 w-1/3 md:w-full h-full overflow-hidden snap-start">
                <img
                  src={photo}
                  alt={`${vehicle?.name || 'Vehicle'} - Photo ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </>
      ) : (
        /* Placeholder when no photo or no vehicle */
        <div className="absolute inset-0 bg-gradient-to-br from-military-green/30 via-camo-brown/20 to-khaki-tan/30 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm">
              <Camera className="w-10 h-10 text-white/60" />
            </div>
            <p className="text-white/80 text-lg font-medium mb-2">
              {vehicle ? `Showcase Your ${vehicle.model}` : 'Showcase Your Unimog'}
            </p>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              {vehicle
                ? 'Add photos of your vehicle to personalize your dashboard'
                : 'Add your vehicle to the community showcase'}
            </p>
            {vehicle ? (
              <button
                onClick={() => setIsEditingVehicle(true)}
                className="inline-block mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md text-white text-sm font-medium transition-colors"
              >
                Add Photos to Showcase
              </button>
            ) : (
              <Link
                to="/community/members"
                className="inline-block mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-md text-white text-sm font-medium transition-colors"
              >
                Add Your Vehicle to Showcase
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Vehicle Info Overlay (only show when there are photos and vehicle) */}
      {hasPhotos && vehicle && (
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

            {/* Optional: Photo count badge - shows total vehicle photos */}
            {vehicle.photos && vehicle.photos.length > 0 && (
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

      {/* Edit Button Overlay - only show when there's a vehicle */}
      {hasPhotos && vehicle && (
        <button
          onClick={() => setIsEditingVehicle(true)}
          className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all opacity-70 hover:opacity-100 z-10"
          title="Edit vehicle"
        >
          <Edit className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Subtle animation on hover - pointer-events-none so it doesn't block button clicks */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />

      {/* Edit Vehicle Dialog */}
      {vehicle && (
        <EditVehicleDialog
          isOpen={isEditingVehicle}
          onClose={() => setIsEditingVehicle(false)}
          vehicle={vehicle}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};