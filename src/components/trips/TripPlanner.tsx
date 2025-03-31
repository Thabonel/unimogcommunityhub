
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
import { useTripPlanning } from '@/hooks/use-trip-planning';

interface TripPlannerProps {
  onClose: () => void;
}

const TripPlanner = ({ onClose }: TripPlannerProps) => {
  const [activeTab, setActiveTab] = useState('route');
  const { 
    startLocation, 
    setStartLocation,
    endLocation, 
    setEndLocation,
    difficulty, 
    setDifficulty,
    selectedTerrainTypes, 
    setSelectedTerrainTypes,
    selectedPois,
    setSelectedPois,
    isPlanning,
    planTrip
  } = useTripPlanning();
  const { trackFeatureUse } = useAnalytics();

  const handlePlanTrip = async () => {
    const result = await planTrip();
    if (result) {
      trackFeatureUse('trip_planning', {
        start: startLocation,
        end: endLocation,
        difficulty,
        terrains: selectedTerrainTypes.join(',')
      });
    }
  };

  const handleTerrainChange = (terrain: string) => {
    if (selectedTerrainTypes.includes(terrain)) {
      setSelectedTerrainTypes(selectedTerrainTypes.filter((t) => t !== terrain));
    } else {
      setSelectedTerrainTypes([...selectedTerrainTypes, terrain]);
    }
  };

  const handlePoiChange = (poi: string) => {
    if (selectedPois.includes(poi)) {
      setSelectedPois(selectedPois.filter((p) => p !== poi));
    } else {
      setSelectedPois([...selectedPois, poi]);
    }
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
                  <Select value={difficulty} onValueChange={setDifficulty}>
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
                <Label htmlFor="terrain-type">Terrain Types</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['desert', 'mountain', 'forest', 'river', 'snow', 'mud'].map((terrain) => (
                    <div key={terrain} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`terrain-${terrain}`} 
                        className="h-4 w-4 rounded" 
                        checked={selectedTerrainTypes.includes(terrain)}
                        onChange={() => handleTerrainChange(terrain)}
                      />
                      <Label htmlFor={`terrain-${terrain}`}>
                        {terrain.charAt(0).toUpperCase() + terrain.slice(1)}
                      </Label>
                    </div>
                  ))}
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
                  {['campsites', 'fuel', 'repair', 'scenic', 'water'].map((poi) => (
                    <div key={poi} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={poi} 
                        className="h-4 w-4 rounded" 
                        checked={selectedPois.includes(poi)}
                        onChange={() => handlePoiChange(poi)}
                      />
                      <Label htmlFor={poi}>
                        {poi === 'campsites' && 'Off-grid Campsites'}
                        {poi === 'fuel' && 'Fuel Stations'}
                        {poi === 'repair' && 'Repair Shops'}
                        {poi === 'scenic' && 'Scenic Viewpoints'}
                        {poi === 'water' && 'Water Crossings'}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <TripMap 
            startLocation={startLocation}
            endLocation={endLocation}
          />
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handlePlanTrip} 
            disabled={isPlanning || !startLocation || !endLocation}
          >
            <Route className="mr-2 h-4 w-4" />
            {isPlanning ? 'Planning...' : 'Plan Route'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripPlanner;
