
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Route, Map as MapIcon } from 'lucide-react';
import TripMap from './TripMap';
import { useAnalytics } from '@/hooks/use-analytics';
import { useTripPlanning } from '@/hooks/use-trip-planning';
import { TripPlannerProps } from './types';
import RouteForm from './RouteForm';
import TerrainForm from './TerrainForm';
import PoiForm from './PoiForm';
import { useProfileData } from '@/hooks/profile/use-profile-data';

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
  const { userData, isLoading: isProfileLoading } = useProfileData();
  const [userCoordinates, setUserCoordinates] = useState<{ latitude: number, longitude: number } | undefined>(undefined);

  // Extract user location coordinates for map centering when userData changes
  useEffect(() => {
    if (userData && userData.coordinates) {
      console.log('Setting user coordinates from profile:', userData.coordinates);
      setUserCoordinates({
        latitude: userData.coordinates.latitude,
        longitude: userData.coordinates.longitude
      });
    } else {
      console.log('No user coordinates available in profile data');
      setUserCoordinates(undefined);
    }
  }, [userData]);

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
            <RouteForm
              startLocation={startLocation}
              setStartLocation={setStartLocation}
              endLocation={endLocation}
              setEndLocation={setEndLocation}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
            />
          </TabsContent>
          
          <TabsContent value="terrain" className="space-y-4">
            <TerrainForm 
              selectedTerrainTypes={selectedTerrainTypes}
              handleTerrainChange={handleTerrainChange}
            />
          </TabsContent>
          
          <TabsContent value="poi" className="space-y-4">
            <PoiForm
              selectedPois={selectedPois}
              handlePoiChange={handlePoiChange}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <TripMap 
            startLocation={startLocation}
            endLocation={endLocation}
            userLocation={userCoordinates}
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
