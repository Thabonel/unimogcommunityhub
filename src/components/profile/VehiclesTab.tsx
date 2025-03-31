
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import OwnerManualSection from './OwnerManualSection';
import UnimogDataCard from './UnimogDataCard';

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
        <CardTitle>My Vehicles</CardTitle>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowVehicleDetails(!showVehicleDetails)}
              >
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
          Add Another Vehicle
        </Button>
        
        {showVehicleDetails && userData.unimogModel === 'U1700L' && (
          <div className="mt-8 space-y-4">
            <UnimogDataCard modelCode={userData.unimogModel} />
            <OwnerManualSection unimogModel={userData.unimogModel} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehiclesTab;
