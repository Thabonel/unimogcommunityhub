
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Gauge, FileText, PlusCircle, Fuel, Info } from 'lucide-react';
import AddVehicleDialog from './AddVehicleDialog';

interface VehiclesTabProps {
  userData: {
    unimogModel: string;
    joinDate: string;
  };
}

const VehiclesTab = ({ userData }: VehiclesTabProps) => {
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  
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
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-xs font-medium text-muted-foreground">Model</p>
                    <p className="text-sm font-semibold">{userData.unimogModel}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                    <p className="text-sm font-semibold text-green-600">Active</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-xs font-medium text-muted-foreground">Last Service</p>
                    <p className="text-sm font-semibold">2 months ago</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-xs font-medium text-muted-foreground">Mileage</p>
                    <p className="text-sm font-semibold">45,200 km</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-xs font-medium text-muted-foreground">Next Service</p>
                    <p className="text-sm font-semibold">In 3 weeks</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-md">
                    <p className="text-xs font-medium text-muted-foreground">Registration</p>
                    <p className="text-sm font-semibold">Current</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Add Vehicle Button */}
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAddVehicleDialog(true)}
          >
            <PlusCircle size={16} className="mr-2" />
            Add Another Vehicle
          </Button>
        </CardContent>
      </Card>
      
      {/* Vehicle Maintenance Dashboard Card */}
      <Card>
        <CardHeader>
          <CardTitle>VEHICLE MAINTENANCE DASHBOARD</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track maintenance, access manuals, and keep your Unimog in top condition.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/full-vehicle-dashboard">
              <Button className="w-full flex gap-2 items-center bg-primary text-primary-foreground hover:bg-primary/90">
                <Gauge size={16} />
                View Full Dashboard
              </Button>
            </Link>
            <Link to="/fuel-tracking">
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <Fuel size={16} />
                Fuel Tracking
              </Button>
            </Link>
            <Link to="/service-logs">
              <Button variant="outline" className="w-full flex gap-2 items-center">
                <FileText size={16} />
                Service Logs
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Vehicle Dialog */}
      <AddVehicleDialog 
        isOpen={showAddVehicleDialog}
        onClose={() => setShowAddVehicleDialog(false)}
      />
    </div>
  );
};

export default VehiclesTab;
