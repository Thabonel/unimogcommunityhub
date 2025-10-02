
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Route, Map as MapIcon, Navigation, MapPin, Search } from 'lucide-react';
import TripMap from './TripMap';
import { useAnalytics } from '@/hooks/use-analytics';
import { useTripPlanning } from '@/hooks/use-trip-planning';
import { TripPlannerProps } from './types';
import RouteForm from './RouteForm';
import TerrainForm from './TerrainForm';
import PoiForm from './PoiForm';
import { TrailSearchInput } from './TrailSearchInput';
import { TrailSearchResults } from './TrailSearchResults';
import { TrailMapDisplay } from './TrailMapDisplay';
import { GeoJSONFeature } from '@/services/trailService';
import { useProfileData } from '@/hooks/profile/use-profile-data';
import { toast } from 'sonner';

const TripPlanner = ({ onClose }: TripPlannerProps) => {
  const [activeTab, setActiveTab] = useState('route');
  const [isAddingWaypoints, setIsAddingWaypoints] = useState(false);
  const [searchedTrails, setSearchedTrails] = useState<GeoJSONFeature[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<GeoJSONFeature | null>(null);
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
  
  // Memoize user coordinates to prevent unnecessary re-renders
  const userCoordinates = useMemo(() => {
    if (userData?.coordinates) {
      console.log('Computing user coordinates from profile:', userData.coordinates);
      return {
        latitude: userData.coordinates.latitude,
        longitude: userData.coordinates.longitude
      };
    }
    return undefined;
  }, [userData?.coordinates?.latitude, userData?.coordinates?.longitude]);

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

  const toggleWaypointMode = () => {
    setIsAddingWaypoints(!isAddingWaypoints);
    if (!isAddingWaypoints) {
      toast.info('Click on the map to add waypoints A-2-3-B');
    } else {
      toast.info('Waypoint adding mode disabled');
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="route">Route</TabsTrigger>
            <TabsTrigger value="trails">
              <Search className="h-4 w-4 mr-1" />
              Trails
            </TabsTrigger>
            <TabsTrigger value="terrain">Terrain</TabsTrigger>
            <TabsTrigger value="poi">POIs</TabsTrigger>
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

          <TabsContent value="trails" className="space-y-4">
            <TrailSearchInput
              onSearchResults={setSearchedTrails}
              onSearchStart={() => setSelectedTrail(null)}
            />
            {searchedTrails.length > 0 && (
              <TrailSearchResults
                trails={searchedTrails}
                onTrailSelect={setSelectedTrail}
                selectedTrail={selectedTrail}
              />
            )}
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
          {selectedTrail ? (
            <TrailMapDisplay trail={selectedTrail} />
          ) : (
            <TripMap
              startLocation={startLocation}
              endLocation={endLocation}
              userLocation={userCoordinates}
              enableWaypoints={true}
              isAddingWaypoints={isAddingWaypoints}
              onWaypointToggle={setIsAddingWaypoints}
            />
          )}
        </div>

        {/* Waypoint Controls */}
        <div className="mt-4 flex justify-center">
          <Button 
            variant={isAddingWaypoints ? "default" : "outline"}
            onClick={toggleWaypointMode}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {isAddingWaypoints ? 'Stop Adding Waypoints' : 'Add Waypoints A-B'}
          </Button>
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
