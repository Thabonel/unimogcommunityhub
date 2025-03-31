
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Compass, Mountain, Route, Map as MapIcon } from 'lucide-react';
import TripMap from './TripMap';
import { useAnalytics } from '@/hooks/use-analytics';

interface TripPlannerProps {
  onClose: () => void;
}

const TripPlanner = ({ onClose }: TripPlannerProps) => {
  const [activeTab, setActiveTab] = useState('route');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('intermediate');
  const [terrainType, setTerrainType] = useState('');
  const { trackFeatureUse } = useAnalytics();

  const handlePlanTrip = () => {
    trackFeatureUse('trip_planning', {
      start: startLocation,
      end: endLocation,
      difficulty: difficultyLevel,
      terrain: terrainType
    });
    // In a full implementation, this would call an API to plan the route
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapIcon className="mr-2 h-5 w-5" />
          Unimog Route Planner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="route" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="route">Route</TabsTrigger>
            <TabsTrigger value="terrain">Terrain</TabsTrigger>
            <TabsTrigger value="poi">Points of Interest</TabsTrigger>
          </TabsList>
          
          <TabsContent value="route" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-location">Starting Point</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="start-location" 
                    placeholder="Enter starting location" 
                    value={startLocation} 
                    onChange={(e) => setStartLocation(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-location">Destination</Label>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="end-location" 
                    placeholder="Enter destination" 
                    value={endLocation} 
                    onChange={(e) => setEndLocation(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <div className="flex items-center space-x-2">
                  <Mountain className="h-4 w-4 text-muted-foreground" />
                  <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (Graded Roads)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Rough Tracks)</SelectItem>
                      <SelectItem value="advanced">Advanced (Technical Terrain)</SelectItem>
                      <SelectItem value="expert">Expert (Extreme Conditions)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="terrain" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="terrain-type">Terrain Type</Label>
                <div className="flex items-center space-x-2">
                  <Compass className="h-4 w-4 text-muted-foreground" />
                  <Select value={terrainType} onValueChange={setTerrainType}>
                    <SelectTrigger id="terrain-type">
                      <SelectValue placeholder="Select terrain type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desert">Desert</SelectItem>
                      <SelectItem value="mountain">Mountain</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="river">River Crossing</SelectItem>
                      <SelectItem value="snow">Snow/Ice</SelectItem>
                      <SelectItem value="mud">Mud/Bog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="elevation">Elevation Preference</Label>
                <div className="flex items-center space-x-2">
                  <Mountain className="h-4 w-4 text-muted-foreground" />
                  <Select>
                    <SelectTrigger id="elevation">
                      <SelectValue placeholder="Select elevation preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Elevation</SelectItem>
                      <SelectItem value="medium">Medium Elevation</SelectItem>
                      <SelectItem value="high">High Elevation</SelectItem>
                      <SelectItem value="mixed">Mixed Terrain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="poi" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Points of Interest</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="campsites" className="h-4 w-4 rounded" />
                    <Label htmlFor="campsites">Off-grid Campsites</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="fuel" className="h-4 w-4 rounded" />
                    <Label htmlFor="fuel">Fuel Stations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="repair" className="h-4 w-4 rounded" />
                    <Label htmlFor="repair">Repair Shops</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="scenic" className="h-4 w-4 rounded" />
                    <Label htmlFor="scenic">Scenic Viewpoints</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="water" className="h-4 w-4 rounded" />
                    <Label htmlFor="water">Water Crossings</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <TripMap />
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handlePlanTrip}>
            <Route className="mr-2 h-4 w-4" />
            Plan Route
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripPlanner;
