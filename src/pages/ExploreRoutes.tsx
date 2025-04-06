
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import EnhancedMapComponent from '@/components/EnhancedMapComponent';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Map, 
  Compass, 
  Calendar, 
  CloudRain, 
  AlertTriangle,
  Upload
} from 'lucide-react';
import { Track, EmergencyAlert, WeatherData } from '@/types/track';
import { toast } from 'sonner';

const ExploreRoutes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('map');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  
  // Mock data for demonstration
  const mockWeatherData: WeatherData[] = [
    {
      date: '2023-06-10',
      temperature: 23,
      condition: 'Sunny',
      precipitation_chance: 0,
      wind_speed: 5,
      humidity: 65,
      icon: 'sun'
    },
    {
      date: '2023-06-11',
      temperature: 21,
      condition: 'Partly Cloudy',
      precipitation_chance: 10,
      wind_speed: 7,
      humidity: 70,
      icon: 'cloud-sun'
    },
    {
      date: '2023-06-12',
      temperature: 19,
      condition: 'Rain Showers',
      precipitation_chance: 40,
      wind_speed: 10,
      humidity: 80,
      icon: 'cloud-rain'
    }
  ];
  
  // Mock emergency alerts
  const mockEmergencyAlerts: EmergencyAlert[] = [
    {
      id: 'alert-001',
      type: 'fire',
      title: 'Wildfire Warning',
      description: 'Active wildfire in the Black Forest area. Avoid travel in the affected region.',
      severity: 'high',
      location: {
        latitude: 48.2652,
        longitude: 8.1039
      },
      issued_at: '2023-06-09T10:30:00Z',
      expires_at: '2023-06-12T23:59:59Z',
      source: 'German Forest Service'
    }
  ];
  
  // Load emergency alerts on mount
  useEffect(() => {
    // In a real implementation, this would fetch from an API
    setEmergencyAlerts(mockEmergencyAlerts);
    
    // Show notification for emergency alerts
    if (mockEmergencyAlerts.length > 0) {
      mockEmergencyAlerts.forEach(alert => {
        if (alert.severity === 'high' || alert.severity === 'extreme') {
          toast.error(
            <div>
              <strong>{alert.title}</strong>
              <p>{alert.description}</p>
            </div>,
            {
              duration: 10000,
              icon: <AlertTriangle className="h-5 w-5 text-red-500" />
            }
          );
        }
      });
    }
  }, []);
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Here we would parse GPX/KML files
    // For now, just show a toast
    toast.success(`File "${file.name}" will be processed in the full implementation`, {
      description: "Track upload feature coming soon!"
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Map className="h-8 w-8 text-primary" />
                Unimog Routes Explorer
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover and plan off-road routes for your Unimog adventures
              </p>
            </div>
            
            <div className="w-full md:w-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search routes and locations..."
                  className="w-full md:w-[300px] pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map size={16} />
                <span className="hidden sm:inline">Map</span>
              </TabsTrigger>
              <TabsTrigger value="weather" className="flex items-center gap-2">
                <CloudRain size={16} />
                <span className="hidden sm:inline">Weather</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <AlertTriangle size={16} />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="mt-4">
              <Card>
                <CardContent className="p-2 md:p-6">
                  <div className="h-[70vh]">
                    <EnhancedMapComponent 
                      height="100%" 
                      tracks={tracks}
                      showLayerControls={true}
                      initialViewState={{
                        longitude: 9.1829,
                        latitude: 48.7758,
                        zoom: 6,
                        pitch: 45
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weather" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    Weather Forecast
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockWeatherData.map((day, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {new Date(day.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-3xl font-bold mt-2">{day.temperature}°C</p>
                              <p className="text-sm text-muted-foreground">{day.condition}</p>
                            </div>
                            <div className="text-right">
                              <div className="rounded-full bg-blue-100 p-3 inline-block">
                                <CloudRain className="h-8 w-8 text-blue-500" />
                              </div>
                              <p className="text-sm mt-2">
                                Precipitation: {day.precipitation_chance}%
                              </p>
                              <p className="text-sm">
                                Wind: {day.wind_speed} km/h
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Weather data is for planning purposes only. Always check current conditions before departure.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Emergency Alerts
                  </h2>
                  
                  {emergencyAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {emergencyAlerts.map(alert => (
                        <Card key={alert.id} className={`
                          border-l-4 
                          ${alert.severity === 'extreme' ? 'border-l-red-700' : ''}
                          ${alert.severity === 'high' ? 'border-l-red-500' : ''}
                          ${alert.severity === 'medium' ? 'border-l-orange-500' : ''}
                          ${alert.severity === 'low' ? 'border-l-yellow-500' : ''}
                        `}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                  {alert.type === 'fire' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                                  {alert.title}
                                </h3>
                                <p className="mt-1">{alert.description}</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Source: {alert.source}
                                </p>
                              </div>
                              <div className="mt-2 md:mt-0 md:text-right">
                                <p className="text-sm">
                                  <span className="font-medium">Issued:</span>{' '}
                                  {new Date(alert.issued_at).toLocaleString()}
                                </p>
                                {alert.expires_at && (
                                  <p className="text-sm">
                                    <span className="font-medium">Expires:</span>{' '}
                                    {new Date(alert.expires_at).toLocaleString()}
                                  </p>
                                )}
                                <div className="mt-2">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                                    ${alert.severity === 'extreme' ? 'bg-red-100 text-red-800' : ''}
                                    ${alert.severity === 'high' ? 'bg-red-50 text-red-700' : ''}
                                    ${alert.severity === 'medium' ? 'bg-orange-50 text-orange-700' : ''}
                                    ${alert.severity === 'low' ? 'bg-yellow-50 text-yellow-700' : ''}
                                  `}>
                                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Severity
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-green-50 text-green-700 p-4 rounded-md">
                        <Check className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">No active emergency alerts</p>
                        <p className="text-sm mt-1">
                          The areas you're exploring are currently clear of reported emergencies.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreRoutes;
