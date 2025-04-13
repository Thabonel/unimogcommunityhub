
import { useState, useEffect } from 'react';
import { useFiresData, FireIncident } from '@/hooks/use-fires-data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { format, formatDistance } from 'date-fns';
import SimpleMap from '@/components/SimpleMap';
import { Clock, MapPin, RefreshCw, AlertTriangle, Flame, ShieldAlert, Info } from 'lucide-react';
import { useUserLocation } from '@/hooks/use-user-location';
import { Slider } from '@/components/ui/slider';

export const FiresNearMe = () => {
  const [radius, setRadius] = useState<number>(50);
  const { incidents, isLoading, error, lastUpdated, refetch } = useFiresData();
  const { location } = useUserLocation();
  const [nearbyIncidents, setNearbyIncidents] = useState<FireIncident[]>([]);
  const [activeTab, setActiveTab] = useState<string>('map');
  
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };
  
  // Filter incidents based on the user's location and radius
  useEffect(() => {
    if (!location || !incidents.length) {
      setNearbyIncidents(incidents);
      return;
    }
    
    const filtered = incidents.filter(incident => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        incident.coordinates.latitude,
        incident.coordinates.longitude
      );
      
      return distance <= radius;
    });
    
    // Sort by distance from the user
    filtered.sort((a, b) => {
      const distanceA = calculateDistance(
        location.latitude,
        location.longitude,
        a.coordinates.latitude,
        a.coordinates.longitude
      );
      
      const distanceB = calculateDistance(
        location.latitude,
        location.longitude,
        b.coordinates.latitude,
        b.coordinates.longitude
      );
      
      return distanceA - distanceB;
    });
    
    setNearbyIncidents(filtered);
  }, [incidents, location, radius]);
  
  // Get alert level badge color
  const getAlertLevelColor = (alertLevel?: string): string => {
    if (!alertLevel) return 'bg-gray-500';
    
    const level = alertLevel.toLowerCase();
    
    if (level.includes('emergency')) return 'bg-red-500';
    if (level.includes('watch and act')) return 'bg-orange-500';
    if (level.includes('advice')) return 'bg-yellow-500';
    if (level.includes('not applicable')) return 'bg-blue-500';
    
    return 'bg-gray-500';
  };
  
  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="flex items-center gap-1">
              <Flame className="h-5 w-5 text-red-500" /> 
              Fires Near Me
            </CardTitle>
            <CardDescription>
              Real-time fire incidents data from NSW Rural Fire Service
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Search Radius: {radius} km</span>
          </div>
          <Slider
            value={[radius]}
            onValueChange={(values) => setRadius(values[0])}
            min={5}
            max={300}
            step={5}
            className="mt-2"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="m-0">
            <div className="h-[350px] w-full rounded-md overflow-hidden mb-4">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <SimpleMap 
                  height="350px" 
                  width="100%" 
                  markers={nearbyIncidents.map(incident => ({
                    latitude: incident.coordinates.latitude,
                    longitude: incident.coordinates.longitude,
                    title: incident.title,
                    description: `${incident.status} - ${incident.type}`,
                    color: getAlertLevelColor(incident.alert_level)
                  }))}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="m-0 space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : nearbyIncidents.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Fire Incidents Nearby</AlertTitle>
                <AlertDescription>
                  There are currently no reported fire incidents within {radius} km of your location.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
                {nearbyIncidents.map(incident => (
                  <Card key={incident.id} className="relative">
                    <div className={`absolute top-0 left-0 w-1 h-full ${getAlertLevelColor(incident.alert_level)}`}></div>
                    <CardContent className="p-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{incident.title}</h3>
                          <Badge variant="outline" className="capitalize">
                            {incident.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm">
                          <span className="flex items-start gap-1">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>{incident.location}</span>
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {incident.type && (
                            <span className="bg-muted px-2 py-1 rounded-sm">
                              {incident.type}
                            </span>
                          )}
                          
                          {incident.alert_level && (
                            <span className={`${getAlertLevelColor(incident.alert_level)} text-white px-2 py-1 rounded-sm`}>
                              {incident.alert_level}
                            </span>
                          )}
                          
                          {incident.size && (
                            <span className="bg-muted px-2 py-1 rounded-sm">
                              Size: {incident.size}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Updated {formatDistance(new Date(incident.updated), new Date(), { addSuffix: true })}
                          </span>
                          
                          {incident.uri && (
                            <a 
                              href={incident.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              More info
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full flex flex-col xs:flex-row justify-between gap-1 items-start xs:items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <ShieldAlert className="h-3 w-3 mr-1 text-red-500" />
            <span>© State of NSW (NSW Rural Fire Service)</span>
          </div>
          {lastUpdated && (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {format(lastUpdated, 'HH:mm')}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default FiresNearMe;
