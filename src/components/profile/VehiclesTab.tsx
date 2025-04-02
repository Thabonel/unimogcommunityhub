
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import OwnerManualSection from './OwnerManualSection';
import UnimogDataCard from './UnimogDataCard';
import { Gauge, FileText, PlusCircle, Wrench } from 'lucide-react';

interface VehiclesTabProps {
  userData: {
    unimogModel: string;
    joinDate: string;
  };
}

const VehiclesTab = ({ userData }: VehiclesTabProps) => {
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          My Vehicles
          <Link to="/vehicle-dashboard">
            <Button size="sm" className="flex gap-1.5 items-center">
              <Wrench size={16} />
              Maintenance Dashboard
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Unimog {userData.unimogModel}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Added on {new Date(userData.joinDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Link to="/vehicle-dashboard">
                <Button variant="outline" size="sm" className="flex gap-1.5 items-center">
                  <Gauge size={16} />
                  Maintenance
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                className="flex gap-1.5 items-center"
                onClick={() => setShowVehicleDetails(!showVehicleDetails)}
              >
                <FileText size={16} />
                {showVehicleDetails ? 'Hide Details' : 'View Details'}
              </Button>
              <Link to="/unimog-u1700l">
                <Button variant="outline" size="sm">
                  Full Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <Button>
          <PlusCircle size={16} className="mr-2" />
          Add Another Vehicle
        </Button>
        
        {showVehicleDetails && userData.unimogModel === 'U1700L' && (
          <div className="mt-8 space-y-4" data-showing-manual="true">
            <UnimogDataCard modelCode={userData.unimogModel} />
            <OwnerManualSection unimogModel={userData.unimogModel} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehiclesTab;
