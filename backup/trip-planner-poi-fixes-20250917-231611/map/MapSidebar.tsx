
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { TripCardProps } from '../TripCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Track } from '@/types/track';

interface MapSidebarProps {
  isOpen: boolean;
  filteredTrips: TripCardProps[];
  activeTrip: string | null;
  onTripSelect: (trip: TripCardProps) => void;
  onCreateTrip: () => void;
  importedTracks?: Track[];
}

const MapSidebar = ({ 
  isOpen, 
  filteredTrips, 
  activeTrip, 
  onTripSelect, 
  onCreateTrip,
  importedTracks = []
}: MapSidebarProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 bottom-0 left-0 w-80 bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 z-10 shadow-lg rounded-tr-lg overflow-hidden">
      <div className="p-4">
        <Tabs defaultValue="trips">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="trips">
              Saved Trips
              <Badge variant="secondary" className="ml-2">{filteredTrips.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="tracks">
              Imported Tracks
              <Badge variant="secondary" className="ml-2">{importedTracks.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trips" className="mt-0">
            <div className="flex space-x-2 mb-4">
              <Button variant="default" size="sm" onClick={onCreateTrip} className="flex-shrink-0">
                <Plus className="h-4 w-4 mr-1" />
                New Trip
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-2">
                {filteredTrips.length > 0 ? (
                  filteredTrips.map((trip) => (
                    <div
                      key={trip.id}
                      onClick={() => onTripSelect(trip)}
                      className={`p-3 rounded-md cursor-pointer ${
                        activeTrip === trip.id 
                          ? 'bg-primary/10 border border-primary/30' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                      }`}
                    >
                      <h3 className="font-medium truncate">{trip.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{trip.location}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {trip.terrainTypes.slice(0, 2).map((terrain, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {terrain}
                          </Badge>
                        ))}
                        {trip.terrainTypes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{trip.terrainTypes.length - 2} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>{trip.distance} km</span>
                        <span>
                          {trip.isUpcoming ? (
                            <Badge variant="secondary" className="text-xs">Upcoming</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Completed</Badge>
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 px-4">
                    <p className="text-muted-foreground mb-4">No trips found</p>
                    <Button size="sm" onClick={onCreateTrip}>
                      <Plus className="h-4 w-4 mr-1" />
                      Create your first trip
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="tracks" className="mt-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              {importedTracks.length > 0 ? (
                <div className="space-y-2">
                  {importedTracks.map((track) => (
                    <div
                      key={track.id}
                      className="p-3 rounded-md border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: track.color }}
                        />
                        <h3 className="font-medium truncate">{track.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                        {track.distance_km && (
                          <div>
                            <span className="font-medium">Distance:</span> {track.distance_km} km
                          </div>
                        )}
                        {track.elevation_gain && (
                          <div>
                            <span className="font-medium">Elevation:</span> {track.elevation_gain}m
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4">
                  <p className="text-muted-foreground">No tracks imported</p>
                  <p className="text-xs mt-2 mb-4">Use the Import GPX button in the map controls</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MapSidebar;
