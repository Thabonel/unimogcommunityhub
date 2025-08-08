
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TripDetails from '@/components/trips/TripDetails';
import { useTripPlanning, type TripPlan } from '@/hooks/use-trip-planning';
import { useAnalytics } from '@/hooks/use-analytics';
import FullScreenTripMapWithWaypoints from '@/components/trips/FullScreenTripMapWithWaypoints';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Trip } from '@/types/trip';
import { TripCardProps } from '@/components/trips/TripCard';
import { TripsProvider, useTripsContext } from '@/contexts/TripsContext';

const Trips = () => {
  const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
  const { trackFeatureUse } = useAnalytics();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOpenPlanner = () => {
    // Trip planning now handled directly in the map component
    trackFeatureUse('trip_planner', { action: 'open' });
  };

  const handleTripSelect = (trip: any) => {
    setSelectedTrip(trip);
    trackFeatureUse('trip_view', { trip_id: trip.id });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <TripsProvider>
      <TripsContent 
        selectedTrip={selectedTrip}
        setSelectedTrip={setSelectedTrip}
        handleBack={handleBack}
        handleOpenPlanner={handleOpenPlanner}
        handleTripSelect={handleTripSelect}
      />
    </TripsProvider>
  );
};

// Separate component that uses the TripsContext
const TripsContent = ({ 
  selectedTrip, 
  setSelectedTrip,
  handleBack,
  handleOpenPlanner,
  handleTripSelect
}: {
  selectedTrip: TripPlan | null;
  setSelectedTrip: (trip: TripPlan | null) => void;
  handleBack: () => void;
  handleOpenPlanner: () => void;
  handleTripSelect: (trip: any) => void;
}) => {
  const { trips, isLoading, loadTrips } = useTripsContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  console.log('TripsContent rendering with:', { trips, isLoading, user });

  // Trips are already loaded by the context provider, no need to load them again

  // Convert Trip objects to TripCardProps
  const tripsForMap: TripCardProps[] = trips && trips.length > 0 
    ? trips.map((trip: Trip) => ({
        id: trip.id,
        title: trip.title,
        description: trip.description || '',
        location: trip.start_location ? `${trip.start_location.latitude}, ${trip.start_location.longitude}` : 'Unknown location',
        startDate: trip.start_date || new Date().toISOString(),
        endDate: trip.end_date || new Date().toISOString(),
        distance: trip.distance || 0,
        difficulty: trip.difficulty || 'beginner',
        terrainTypes: trip.terrain_types || [],
        organizerId: trip.created_by || '',
        organizerName: 'Trip Organizer',
        imageUrl: trip.image_url || '/img/default-unimog-marker.png',
        isUpcoming: true,
        participantCount: 1,
        // Optional properties
        duration: trip.duration,
        startLocation: trip.start_location ? `${trip.start_location.latitude}, ${trip.start_location.longitude}` : undefined,
        endLocation: trip.end_location ? `${trip.end_location.latitude}, ${trip.end_location.longitude}` : undefined
      }))
    : [];

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Back button moved to center top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <Button 
          variant="default" 
          size="sm" 
          className="bg-white text-black shadow-md hover:bg-gray-100" 
          onClick={handleBack}
          type="button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {!user && (
        <div className="absolute top-4 right-20 z-40">
          <Button 
            onClick={() => navigate('/auth')}
            variant="default"
            size="sm"
            className="bg-white/80 backdrop-blur-sm hover:bg-white text-black border border-gray-200"
            type="button"
          >
            Sign In to Save Trips
          </Button>
        </div>
      )}

      <FullScreenTripMapWithWaypoints 
        trips={tripsForMap}
        onTripSelect={handleTripSelect}
        onCreateTrip={handleOpenPlanner}
        isLoading={isLoading}
      />

      {/* Trip planning now integrated directly into the map */}

      {/* Trip Details Dialog */}
      {selectedTrip && (
        <Dialog open={!!selectedTrip} onOpenChange={(open) => !open && setSelectedTrip(null)}>
          <DialogContent className="sm:max-w-[600px] lg:max-w-[800px]">
            <TripDetails 
              trip={selectedTrip as TripPlan} 
              onClose={() => setSelectedTrip(null)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Trips;
