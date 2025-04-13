
import { FireIncident } from '@/hooks/use-fires-data';
import { Skeleton } from '@/components/ui/skeleton';
import SimpleMap from '@/components/SimpleMap';
import { FiresErrorAlert } from './FiresErrorAlert';

interface FiresMapViewProps {
  incidents: FireIncident[];
  isLoading: boolean;
  error: string | null;
  radius: number;
  handleRefresh: () => void;
}

export const FiresMapView = ({ incidents, isLoading, error, radius, handleRefresh }: FiresMapViewProps) => {
  // Filter incidents based on radius is handled in the parent component

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
    return <Skeleton className="h-[350px] w-full" />;
  }

  if (error) {
    return <FiresErrorAlert error={error} handleRefresh={handleRefresh} />;
  }

  // Ensure incidents is an array before trying to map over it
  const safeIncidents = Array.isArray(incidents) ? incidents : [];

  return (
    <div className="h-[350px] w-full rounded-md overflow-hidden mb-4">
      <SimpleMap 
        height="350px" 
        width="100%" 
        markers={safeIncidents.map(incident => ({
          latitude: incident.coordinates.latitude,
          longitude: incident.coordinates.longitude,
          title: incident.title,
          description: `${incident.status} - ${incident.type}`,
          color: getAlertLevelColor(incident.alert_level)
        }))}
      />
    </div>
  );
};
