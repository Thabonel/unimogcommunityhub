
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface VehicleDetailsCardProps {
  vehicle: {
    model?: string;
    year?: string;
  };
}

export const VehicleDetailsCard = ({ vehicle }: VehicleDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
        <CardDescription>Your registered Unimog information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Model:</span>
            <span className="font-medium">Unimog {vehicle.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Year:</span>
            <span className="font-medium">{vehicle.year || '1988'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Engine:</span>
            <span className="font-medium">OM352A 5.7L diesel</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transmission:</span>
            <span className="font-medium">UG 3/40 - 8F/8R</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
