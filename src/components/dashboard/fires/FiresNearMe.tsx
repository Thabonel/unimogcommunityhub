
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Flame, RefreshCw, Clock, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';
import { useFiresData } from '@/hooks/use-fires-data';
import FiresMapV2 from '@/components/maps/FiresMapV2';
import { FiresListView } from './FiresListView';
import { FiresRadiusSelector } from './FiresRadiusSelector';
import { FiresErrorAlert } from './FiresErrorAlert';

export const FiresNearMe = () => {
  const [radius, setRadius] = useState<number>(50);
  const [location, setLocation] = useState<string>('nsw-australia');
  const { incidents, isLoading, error, lastUpdated, refetch } = useFiresData();
  const [activeTab, setActiveTab] = useState<string>('map');
  
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
              Real-time fire incidents data from selected region
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
        <FiresRadiusSelector 
          radius={radius} 
          setRadius={setRadius}
          location={location}
          setLocation={setLocation} 
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="m-0">
            {error ? (
              <FiresErrorAlert error={error} onRetry={handleRefresh} />
            ) : (
              <FiresMapV2 
                incidents={incidents}
                radius={radius}
                location={location}
              />
            )}
          </TabsContent>
          
          <TabsContent value="list" className="m-0 space-y-4">
            <FiresListView 
              incidents={incidents}
              isLoading={isLoading} 
              error={error}
              radius={radius}
              handleRefresh={handleRefresh}
              location={location}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="w-full flex flex-col xs:flex-row justify-between gap-1 items-start xs:items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <ShieldAlert className="h-3 w-3 mr-1 text-red-500" />
            <span>© Fire Data Provider for {location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
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
