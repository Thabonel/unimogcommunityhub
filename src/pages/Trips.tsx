
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TripPlanner from '@/components/trips/TripPlanner';
import TripDetails from '@/components/trips/TripDetails';
import { useTripPlanning, type TripPlan } from '@/hooks/use-trip-planning';
import { useAnalytics } from '@/hooks/use-analytics';
import FullScreenTripMap from '@/components/trips/FullScreenTripMap';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTripsContext } from '@/contexts/TripsContext';
import { useAuth } from '@/hooks/use-auth';
import { Trip } from '@/types/trip';
import { TripCardProps } from '@/components/trips/TripCard';

const Trips = () => {
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
  const { trackFeatureUse } = useAnalytics();
  const navigate = useNavigate();
  const { trips, isLoading, loadTrips } = useTripsContext();
  const { user } = useAuth();

  // Load trips when component mounts
  useEffect(() => {
    loadTrips();
  }, []);

  const handleOpenPlanner = () => {
    setIsPlannerOpen(true);
    trackFeatureUse('trip_planner', { action: 'open' });
  };

  const handleClosePlanner = () => {
    setIsPlannerOpen(false);
  };

  const handleTripSelect = (trip: any) => {
    setSelectedTrip(trip);
    trackFeatureUse('trip_view', { trip_id: trip.id });
  };

  const handleBack = () => {
    navigate('/');
  };

  // Convert Trip objects to TripCardProps
  const tripsForMap = trips.map((trip: Trip) => ({
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
    imageUrl: trip.image_url || '/img/default-unimog-marker.png'
  }));

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white/80 backdrop-blur-sm hover:bg-white" 
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {!user && (
        <div className="absolute top-4 right-4 z-10">
          <Button 
            onClick={() => navigate('/auth')}
            variant="default"
          >
            Sign In to Save Trips
          </Button>
        </div>
      )}

      <FullScreenTripMap 
        trips={tripsForMap}
        onTripSelect={handleTripSelect}
        onCreateTrip={handleOpenPlanner}
        isLoading={isLoading}
      />

      {/* Trip Planner Dialog */}
      <Dialog open={isPlannerOpen} onOpenChange={setIsPlannerOpen}>
        <DialogContent className="sm:max-w-[600px] lg:max-w-[800px]">
          <TripPlanner onClose={handleClosePlanner} />
        </DialogContent>
      </Dialog>

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
