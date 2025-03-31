
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Calendar, Mountain, Compass, MapPin, Download, Share2 } from 'lucide-react';
import { type TripPlan } from '@/hooks/use-trip-planning';
import TripMap from './TripMap';

interface TripDetailsProps {
  trip: TripPlan;
  onClose: () => void;
}

const TripDetails = ({ trip, onClose }: TripDetailsProps) => {
  const [activeTab, setActiveTab] = useState('details');
  
  // Function to determine color based on difficulty
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <Map className="mr-2 h-5 w-5" />
            {trip.title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${getDifficultyColor(trip.difficulty)}`}></div>
            <span className="text-sm font-medium">
              {trip.difficulty.charAt(0).toUpperCase() + trip.difficulty.slice(1)}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="details" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="terrain">Terrain</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" /> Start
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{trip.startLocation}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" /> End
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{trip.endLocation}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  <Compass className="h-4 w-4 mr-2" /> Distance
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{trip.distance} km</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" /> Duration
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{trip.duration} day{trip.duration !== 1 ? 's' : ''}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <TripMap 
                startLocation={trip.startLocation} 
                endLocation={trip.endLocation}
                waypoints={trip.waypoints} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="terrain" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium flex items-center">
                  <Mountain className="h-4 w-4 mr-2" /> Terrain Types
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {trip.terrainTypes.map((terrain, index) => (
                    <Badge key={index} variant="outline">
                      {typeof terrain === 'string' ? terrain.charAt(0).toUpperCase() + terrain.slice(1) : terrain}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Elevation Profile</h3>
                <div className="h-20 bg-muted rounded-md mt-2 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Elevation data visualization</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="weather" className="pt-4">
            <div className="text-center p-4">
              <p className="text-sm text-muted-foreground">
                Weather data will be available when connected to a weather API
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Close</Button>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button>View on Map</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TripDetails;
