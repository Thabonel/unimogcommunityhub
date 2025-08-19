
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WifiOff } from 'lucide-react';

interface MaintenanceStatusCardProps {
  isOffline?: boolean;
}

export const MaintenanceStatusCard = ({ isOffline = false }: MaintenanceStatusCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Maintenance Status
          {isOffline && (
            <span className="inline-flex items-center text-sm text-amber-600">
              <WifiOff size={16} className="mr-1" /> Offline Mode
            </span>
          )}
        </CardTitle>
        <CardDescription>Current maintenance status and upcoming services</CardDescription>
      </CardHeader>
      <CardContent>
        {isOffline ? (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-4">
            <p className="text-amber-800 dark:text-amber-300">
              Maintenance status is not available while offline.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Service</p>
                <p className="font-medium">Due in 3,500 km</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Oil Change</p>
                <p className="font-medium">Due in 1,200 km</p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-3">
              <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">
                Preventative Maintenance Recommended
              </p>
              <p className="text-amber-800 dark:text-amber-300 text-sm">
                Your Unimog is due for air filter replacement. Schedule service soon.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
