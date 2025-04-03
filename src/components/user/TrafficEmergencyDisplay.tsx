
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useTrafficEmergencyData, TrafficIncident, EmergencyAlert } from '@/hooks/use-traffic-emergency-data';
import { AlertCircle, Clock, MapPin, RefreshCw, AlertTriangle, Construction, Car, MapPinOff, Flag } from 'lucide-react';
import { format, formatDistance } from 'date-fns';
import SimpleMap from '@/components/SimpleMap';
import { Skeleton } from '@/components/ui/skeleton';

const TrafficEmergencyDisplay = () => {
  const [radius, setRadius] = useState<number>(50);
  const { trafficIncidents, emergencyAlerts, isLoading, error, lastUpdated, refetch } = useTrafficEmergencyData(radius);
  const [activeTab, setActiveTab] = useState<string>('traffic');
  
  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };
  
  // Get severity badge color
  const getTrafficSeverityColor = (severity: TrafficIncident['severity']) => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getEmergencySeverityColor = (severity: EmergencyAlert['severity']) => {
    switch (severity) {
      case 'advisory': return 'bg-blue-500';
      case 'watch': return 'bg-yellow-500';
      case 'warning': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get incident icon
  const getIncidentIcon = (type: TrafficIncident['type']) => {
    switch (type) {
      case 'accident': return <Car className="h-5 w-5" />;
      case 'congestion': return <AlertCircle className="h-5 w-5" />;
      case 'construction': return <Construction className="h-5 w-5" />;
      case 'closure': return <MapPinOff className="h-5 w-5" />;
      case 'event': return <Flag className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };
  
  // Get emergency alert icon
  const getAlertIcon = (type: EmergencyAlert['type']) => {
    switch (type) {
      case 'weather': return <AlertTriangle className="h-5 w-5 text-blue-500" />; // Replaced LucideAlert with AlertTriangle
      case 'fire': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'flood': return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'earthquake': return <AlertTriangle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Calculate map center and markers for SimpleMap
  const getMapCenterAndMarkers = () => {
    // For demonstration, just use the first incident location or a default
    if (activeTab === 'traffic' && trafficIncidents.length > 0) {
      const incident = trafficIncidents[0];
      return {
        center: [incident.location.longitude, incident.location.latitude] as [number, number],
        // We won't pass any markers as SimpleMap already adds the user location
      };
    } else if (activeTab === 'emergency' && emergencyAlerts.length > 0) {
      const alert = emergencyAlerts[0];
      return {
        center: [alert.location.longitude, alert.location.latitude] as [number, number],
      };
    }
    
    // Default (will use user location from the SimpleMap component)
    return {};
  };

  const mapProps = getMapCenterAndMarkers();

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Traffic & Emergency Alerts</CardTitle>
            <CardDescription>Live traffic and emergency information for your area</CardDescription>
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
            max={100}
            step={5}
            className="mt-2"
          />
        </div>
        
        <div className="mt-4 h-[400px] overflow-hidden rounded-md">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <SimpleMap height="400px" {...mapProps} />
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="traffic" className="relative">
              Traffic
              {trafficIncidents.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {trafficIncidents.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="emergency" className="relative">
              Emergency
              {emergencyAlerts.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {emergencyAlerts.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="traffic" className="pt-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : trafficIncidents.length === 0 ? (
              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertTitle>No Traffic Incidents</AlertTitle>
                <AlertDescription>
                  There are currently no reported traffic incidents in your area.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {trafficIncidents.map(incident => (
                  <Card key={incident.id} className="relative">
                    <div className={`absolute top-0 left-0 w-1 h-full ${getTrafficSeverityColor(incident.severity)}`}></div>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getIncidentIcon(incident.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{incident.description}</p>
                            <Badge variant="outline" className="capitalize">
                              {incident.type}
                            </Badge>
                          </div>
                          {incident.affectedRoads && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Roads: {incident.affectedRoads.join(', ')}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Reported {formatDistance(new Date(incident.startTime), new Date(), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="emergency" className="pt-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : emergencyAlerts.length === 0 ? (
              <Alert>
                <MapPin className="h-4 w-4" />
                <AlertTitle>No Emergency Alerts</AlertTitle>
                <AlertDescription>
                  There are currently no emergency alerts in your area.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {emergencyAlerts.map(alert => (
                  <Card key={alert.id} className="relative">
                    <div className={`absolute top-0 left-0 w-1 h-full ${getEmergencySeverityColor(alert.severity)}`}></div>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{alert.title}</p>
                            <Badge variant="outline" className="capitalize">
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">
                            {alert.description}
                          </p>
                          {alert.location.radius && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Affected area: ~{alert.location.radius} km radius
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Issued {formatDistance(new Date(alert.startTime), new Date(), { addSuffix: true })}
                          </p>
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
        <div className="w-full text-xs text-muted-foreground flex justify-between items-center">
          <span className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {radius} km radius
          </span>
          {lastUpdated && (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last updated: {format(lastUpdated, 'HH:mm:ss')}
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrafficEmergencyDisplay;
