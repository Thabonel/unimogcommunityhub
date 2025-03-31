
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Map, Plus } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TripCard from '@/components/trips/TripCard';
import TripPlanner from '@/components/trips/TripPlanner';
import TripDetails from '@/components/trips/TripDetails';
import { useTripPlanning, type TripPlan } from '@/hooks/use-trip-planning';
import { useAnalytics } from '@/hooks/use-analytics';

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
      isUpcoming: true
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
      isUpcoming: false
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
    <Layout isLoggedIn={true} user={mockUser}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
              Trip Planning
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Plan and share your Unimog adventures with the community.
            </p>
          </div>
          <Button 
            className="bg-primary flex items-center gap-2"
            onClick={handleOpenPlanner}
          >
            <Map size={16} />
            <span>Plan Trip</span>
          </Button>
        </div>

        {mockTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTrips.map((trip) => (
              <div 
                key={trip.id}
                onClick={() => handleTripSelect(trip)}
                className="cursor-pointer"
              >
                <TripCard
                  id={trip.id}
                  title={trip.title}
                  description={trip.description}
                  imageUrl={trip.imageUrl}
                  location={trip.location}
                  startDate={trip.startDate}
                  endDate={trip.endDate}
                  organizerId={trip.organizerId}
                  organizerName={trip.organizerName}
                  participantCount={trip.participantCount}
                  maxParticipants={trip.maxParticipants}
                  difficulty={trip.difficulty}
                  terrainTypes={trip.terrainTypes}
                  distance={trip.distance}
                  duration={trip.duration}
                  isUpcoming={trip.isUpcoming}
                />
              </div>
            ))}
            <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 h-full border-muted hover:border-primary/50 transition-colors cursor-pointer" onClick={handleOpenPlanner}>
              <Plus size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">Create New Trip</p>
            </div>
          </div>
        ) : (
          <div className="grid place-items-center py-12">
            <div className="max-w-md text-center">
              <Map size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Plan Your First Adventure</h2>
              <p className="text-muted-foreground mb-4">
                Create a new trip to start mapping out your next Unimog expedition.
              </p>
              <Button onClick={handleOpenPlanner} className="bg-primary">
                <Plus className="mr-2" size={16} />
                Create Trip Plan
              </Button>
            </div>
          </div>
        )}

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
    </Layout>
  );
};

export default Trips;
