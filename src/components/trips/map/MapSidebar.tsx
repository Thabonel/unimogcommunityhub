
import { List, Compass, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TripCardProps } from '../TripCard';
import TripListItem from '../TripListItem';

interface MapSidebarProps {
  isOpen: boolean;
  filteredTrips: TripCardProps[];
  activeTrip: string | null;
  onTripSelect: (trip: TripCardProps) => void;
  onCreateTrip: () => void;
}

const MapSidebar = ({
  isOpen,
  filteredTrips,
  activeTrip,
  onTripSelect,
  onCreateTrip
}: MapSidebarProps) => {
  return (
    <div className={cn(
      "absolute top-24 left-0 bottom-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10 transition-all duration-300 shadow-md",
      isOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full"
    )}>
      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <List size={18} className="text-primary mr-2" />
            <h2 className="font-semibold">Your Trips</h2>
          </div>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              {filteredTrips.length} trips
            </Badge>
          </div>
        </div>
        
        {filteredTrips.length > 0 ? (
          <div className="space-y-3">
            {filteredTrips.map((trip) => (
              <TripListItem
                key={trip.id}
                trip={trip}
                isActive={activeTrip === trip.id}
                onSelect={() => onTripSelect(trip)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Compass size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No trips found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search</p>
          </div>
        )}
        
        {/* Create new trip card */}
        <Card 
          className="mt-4 border-dashed hover:border-primary/50 cursor-pointer transition-colors" 
          onClick={onCreateTrip}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Plus size={24} className="text-primary mb-2" />
            <p className="text-sm font-medium">Plan New Trip</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapSidebar;
