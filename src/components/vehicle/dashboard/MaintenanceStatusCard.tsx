
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Clock } from 'lucide-react';

export const MaintenanceStatusCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Status</CardTitle>
        <CardDescription>Current vehicle health and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-md">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Oil change due soon</p>
              <p className="text-sm">Recommended within the next 500 km</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-md">
            <Clock className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Next service inspection</p>
              <p className="text-sm">Due in 3 months or 5,000 km</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
