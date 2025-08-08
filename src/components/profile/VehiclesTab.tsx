
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gauge, FileText, PlusCircle, Wrench, Fuel, Info } from 'lucide-react';

interface VehiclesTabProps {
  userData: {
    unimogModel: string;
    joinDate: string;
  };
}

const VehiclesTab = ({ userData }: VehiclesTabProps) => {
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  
  return (
    <div className="space-y-6">
      {/* Main Vehicle Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Vehicle Info */}
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">Unimog {userData.unimogModel}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Added on {new Date(userData.joinDate).toLocaleDateString()}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="flex gap-1.5 items-center"
                onClick={() => setShowVehicleDetails(!showVehicleDetails)}
              >
                <Info size={16} />
                {showVehicleDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>
            
            {/* Show vehicle details inline when toggled */}
            {showVehicleDetails && (
              <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                <p><span className="font-medium">Model:</span> {userData.unimogModel}</p>
                <p><span className="font-medium">Type:</span> All-Terrain Vehicle</p>
                <p><span className="font-medium">Status:</span> Active</p>
              </div>
            )}
          </div>
          
          {/* Add Vehicle Button */}
          <Button variant="outline" className="w-full">
            <PlusCircle size={16} className="mr-2" />
            Add Another Vehicle
          </Button>
        </CardContent>
      </Card>
      
      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/vehicle-dashboard">
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <Wrench size={16} />
                Maintenance
              </Button>
            </Link>
            <Link to="/vehicle-dashboard?tab=fuel">
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <Fuel size={16} />
                Fuel Tracking
              </Button>
            </Link>
            <Link to="/vehicle-dashboard?tab=logs">
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <FileText size={16} />
                Service Logs
              </Button>
            </Link>
            <Link to="/unimog-u1700l">
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <Info size={16} />
                Model Info
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehiclesTab;
