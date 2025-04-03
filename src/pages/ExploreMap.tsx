
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import SimpleMap from '@/components/SimpleMap';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Map, List, Upload, Download, Map as MapIcon, Check, CheckSquare, Info } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Sample trip data - in a real app this would come from a database
const mockTrips = [
  {
    id: 'trip-001',
    name: 'Alpine Loop Trail',
    location: 'Colorado',
    description: 'Scenic mountain trail with challenging terrain',
    difficulty: 'advanced',
    vehicle: 'Unimog U1700L',
    season: 'Summer',
    distanceKm: 78,
    durationHours: 6,
    color: '#F97316' // Orange
  },
  {
    id: 'trip-002',
    name: 'Moab Desert Expedition',
    location: 'Utah',
    description: 'Off-road desert adventure with rocky sections',
    difficulty: 'expert',
    vehicle: 'Unimog U5000',
    season: 'Spring',
    distanceKm: 65,
    durationHours: 5,
    color: '#8B5CF6' // Purple
  },
  {
    id: 'trip-003',
    name: 'Rubicon Trail',
    location: 'California',
    description: 'Famous challenging trail with technical sections',
    difficulty: 'expert',
    vehicle: 'Unimog U500',
    season: 'Summer',
    distanceKm: 35,
    durationHours: 8,
    color: '#10B981' // Green
  },
  {
    id: 'trip-004',
    name: 'White Rim Trail',
    location: 'Utah',
    description: 'Scenic desert trail with moderate difficulty',
    difficulty: 'intermediate',
    vehicle: 'Unimog U1300L',
    season: 'Fall',
    distanceKm: 160,
    durationHours: 12,
    color: '#EF4444' // Red
  },
  {
    id: 'trip-005',
    name: 'Black Bear Pass',
    location: 'Colorado',
    description: 'High-altitude trail with steep descents',
    difficulty: 'expert',
    vehicle: 'Unimog U1700L',
    season: 'Summer',
    distanceKm: 12,
    durationHours: 3,
    color: '#3B82F6' // Blue
  }
];

// Define trip difficulty badges
const DifficultyBadge = ({ level }: { level: string }) => {
  const getColor = () => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };
  
  return <Badge className={`${getColor()} hover:${getColor()}`}>{level}</Badge>;
};

const ExploreMap = () => {
  const [selectedTab, setSelectedTab] = useState('explore');
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [highlightedTrip, setHighlightedTrip] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Toggle trip selection
  const handleTripToggle = (tripId: string) => {
    if (selectedTrips.includes(tripId)) {
      setSelectedTrips(selectedTrips.filter(id => id !== tripId));
    } else {
      setSelectedTrips([...selectedTrips, tripId]);
    }
  };
  
  // Handle trip highlight
  const handleTripHighlight = (tripId: string) => {
    setHighlightedTrip(tripId === highlightedTrip ? null : tripId);
  };
  
  // Mock export function
  const handleExport = (format: string) => {
    if (selectedTrips.length === 0) {
      alert('Please select at least one trip to export');
      return;
    }
    
    // In a real app, this would call an API to generate the file
    alert(`Exporting ${selectedTrips.length} trips in ${format} format`);
  };
  
  // Mock upload function
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          alert(`File "${file.name}" uploaded successfully!`);
        }, 500);
      }
    }, 300);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <MapIcon className="h-8 w-8 text-primary" />
                Unimog Route Explorer
              </h1>
              <p className="text-muted-foreground mt-1">
                Discover and share off-road adventures with the Unimog community
              </p>
            </div>
            
            <Tabs 
              value={selectedTab} 
              onValueChange={setSelectedTab}
              className="w-full md:w-auto mt-4 md:mt-0"
            >
              <TabsList className="grid w-full md:w-auto grid-cols-3 h-9">
                <TabsTrigger value="explore" className="text-xs md:text-sm px-2 md:px-4">
                  <Map className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Explore</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-xs md:text-sm px-2 md:px-4">
                  <Upload className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Upload</span>
                </TabsTrigger>
                <TabsTrigger value="export" className="text-xs md:text-sm px-2 md:px-4">
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">Export</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="md:col-span-1 self-start">
              <Tabs value={selectedTab}>
                <TabsContent value="explore" className="m-0">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center">
                      <List className="h-5 w-5 mr-2" />
                      Available Routes
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Select routes to display on the map
                    </p>
                  </div>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-1 p-4">
                      {mockTrips.map((trip) => (
                        <div 
                          key={trip.id}
                          className={`flex items-start space-x-2 p-2 rounded-md transition-colors ${
                            highlightedTrip === trip.id ? 'bg-accent' : 'hover:bg-accent/50'
                          }`}
                          onClick={() => handleTripHighlight(trip.id)}
                        >
                          <Checkbox 
                            id={trip.id}
                            checked={selectedTrips.includes(trip.id)}
                            onCheckedChange={() => handleTripToggle(trip.id)}
                            className="mt-1"
                            style={{ 
                              accentColor: trip.color,
                              borderColor: trip.color 
                            }}
                          />
                          <div>
                            <label 
                              htmlFor={trip.id} 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {trip.name}
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {trip.location} • {trip.distanceKm}km
                            </p>
                            <div className="mt-1">
                              <DifficultyBadge level={trip.difficulty} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="upload" className="m-0">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Route
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Share your adventures with the community
                    </p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <label htmlFor="file" className="text-sm font-medium">
                          Route File
                        </label>
                        <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm mb-1">Drag and drop your file here</p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Supports KML, SHP, GeoJSON, GPX
                          </p>
                          <input
                            id="file"
                            type="file"
                            className="hidden"
                            accept=".kml,.shp,.json,.geojson,.gpx"
                            onChange={handleFileUpload}
                          />
                          <Button size="sm" onClick={() => document.getElementById('file')?.click()}>
                            Browse Files
                          </Button>
                        </div>
                      </div>
                      
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Route Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="e.g. Alpine Loop Trail"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="description" className="text-sm font-medium">
                          Description
                        </label>
                        <textarea
                          id="description"
                          className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe the route and experience"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <label htmlFor="difficulty" className="text-sm font-medium">
                            Difficulty
                          </label>
                          <select
                            id="difficulty"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                        
                        <div className="grid gap-2">
                          <label htmlFor="season" className="text-sm font-medium">
                            Best Season
                          </label>
                          <select
                            id="season"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="spring">Spring</option>
                            <option value="summer">Summer</option>
                            <option value="fall">Fall</option>
                            <option value="winter">Winter</option>
                            <option value="all">All Year</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <label htmlFor="vehicle" className="text-sm font-medium">
                          Vehicle Used
                        </label>
                        <input
                          id="vehicle"
                          type="text"
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="e.g. Unimog U1700L"
                        />
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Submit Route
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="export" className="m-0">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold flex items-center">
                      <Download className="h-5 w-5 mr-2" />
                      Export Routes
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Download selected routes
                    </p>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center p-3 bg-muted rounded-md">
                      <CheckSquare className="h-5 w-5 mr-2 text-primary" />
                      <span className="text-sm font-medium">
                        {selectedTrips.length} routes selected
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Export Format</p>
                      <div className="grid grid-cols-2 gap-2">
                        {['KML', 'SHP', 'GeoJSON', 'GPX'].map((format) => (
                          <Button
                            key={format}
                            variant="outline"
                            className="text-sm"
                            onClick={() => handleExport(format)}
                            disabled={selectedTrips.length === 0}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {format}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {selectedTrips.length === 0 && (
                      <div className="flex items-center rounded-md bg-muted p-3 text-sm">
                        <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Select routes from the Explore tab to enable export
                        </span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
            
            <div className="md:col-span-3 h-[600px]">
              <SimpleMap height="600px" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExploreMap;
