
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TripPlanner from '@/components/trips/TripPlanner';
import TripDetails from '@/components/trips/TripDetails';
import { useTripPlanning, type TripPlan } from '@/hooks/use-trip-planning';
import { useAnalytics } from '@/hooks/use-analytics';
import FullScreenTripMap from '@/components/trips/FullScreenTripMap';

const Trips = () => {
  // Mock user data - in a real app this would come from authentication
  const mockUser = {
    name: 'John Doe',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L'
  };

  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<TripPlan | null>(null);
  const { trackFeatureUse } = useAnalytics();

  // Mock trip data - in a real app this would come from an API
  const mockTrips = [
    {
      id: 'trip-001',
      title: 'Alpine Adventure',
      description: 'Exploring mountain trails with challenging terrain',
      imageUrl: 'https://images.unsplash.com/photo-1552083974-186346191183',
      location: 'Swiss Alps',
      startDate: 'Jun 15, 2023',
      endDate: 'Jun 25, 2023',
      organizerId: 'user-001',
      organizerName: 'Michael Berg',
      participantCount: 4,
      maxParticipants: 6,
      difficulty: 'advanced' as const,
      terrainTypes: ['Mountain', 'Forest', 'River Crossing'],
      distance: 387,
      duration: 10,
      isUpcoming: true,
      startLocation: 'Zurich, Switzerland',
      endLocation: 'Interlaken, Switzerland'
    },
    {
      id: 'trip-002',
      title: 'Desert Expedition',
      description: 'Off-grid desert adventure with challenging conditions',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      location: 'Sahara Desert',
      startDate: 'Sep 5, 2023',
      endDate: 'Sep 12, 2023',
      organizerId: 'user-002',
      organizerName: 'Sarah Johnson',
      participantCount: 3,
      maxParticipants: 5,
      difficulty: 'expert' as const,
      terrainTypes: ['Desert', 'Dunes', 'Rocky'],
      distance: 456,
      duration: 7,
      isUpcoming: false,
      startLocation: 'Marrakech, Morocco',
      endLocation: 'Merzouga, Morocco'
    }
  ];

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

  return (
    <div className="h-screen w-screen overflow-hidden">
      <FullScreenTripMap 
        trips={mockTrips}
        onTripSelect={handleTripSelect}
        onCreateTrip={handleOpenPlanner}
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
