
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WifiOff } from 'lucide-react';

interface VehicleDetailsCardProps {
  vehicle: {
    name: string;
    model: string;
    year: string;
    current_odometer: number;
    odometer_unit: string;
  };
  isOffline?: boolean;
}

export const VehicleDetailsCard = ({ vehicle, isOffline = false }: VehicleDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Vehicle Details
          {isOffline && (
            <span className="inline-flex items-center text-sm text-amber-600">
              <WifiOff size={16} className="mr-1" /> Offline Mode
            </span>
          )}
        </CardTitle>
        <CardDescription>Information about your vehicle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="font-medium">{vehicle.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Model</p>
              <p className="font-medium">{vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Year</p>
              <p className="font-medium">{vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Odometer</p>
              <p className="font-medium">
                {vehicle.current_odometer.toLocaleString()} {vehicle.odometer_unit}
              </p>
            </div>
          </div>
          
          {isOffline && (
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-sm">
              <p className="text-amber-800 dark:text-amber-300">
                Using limited vehicle data while offline. Some information may not be up-to-date.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
