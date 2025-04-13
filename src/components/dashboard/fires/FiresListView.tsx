
import { FireIncident } from '@/hooks/use-fires-data';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistance } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { FiresErrorAlert } from './FiresErrorAlert';

interface FiresListViewProps {
  incidents: FireIncident[];
  isLoading: boolean;
  error: string | null;
  radius: number;
  handleRefresh: () => void;
}

export const FiresListView = ({ incidents, isLoading, error, radius, handleRefresh }: FiresListViewProps) => {
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return <FiresErrorAlert error={error} handleRefresh={handleRefresh} />;
  }

  if (incidents.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>No Fire Incidents Nearby</AlertTitle>
        <AlertDescription>
          There are currently no reported fire incidents within {radius} km of your location.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
      {incidents.map(incident => (
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
  );
};
