
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnimogData } from '@/hooks/use-unimog-data';
import UnimogDataCard from './UnimogDataCard';

interface VehicleDetailsSectionProps {
  unimogModel?: string;
}

export default function VehicleDetailsSection({ unimogModel }: VehicleDetailsSectionProps) {
  const { user } = useAuth();
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  
  if (!unimogModel) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Info size={18} />
            <p>Add your Unimog model details to see information here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Vehicle Information</h2>
        <div className="space-x-2">
          {unimogModel === 'U1700L' && (
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-1"
              onClick={() => setShowVehicleInfo(!showVehicleInfo)}
            >
              <FileText size={14} />
              {showVehicleInfo ? 'Hide Details' : 'Show Details'}
            </Button>
          )}
        </div>
      </div>
      
      {showVehicleInfo && (
        <div className="space-y-4">
          <UnimogDataCard modelCode={unimogModel} />

          {/* Enhanced Vehicle Status Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vehicle Status & Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Last Service</p>
                  <p className="text-base font-semibold">2 months ago</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Current Mileage</p>
                  <p className="text-base font-semibold">45,200 km</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p className="text-base font-semibold text-green-600">Active</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Next Service Due</p>
                  <p className="text-base font-semibold">In 3 weeks</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Fuel Efficiency</p>
                  <p className="text-base font-semibold">18.5 L/100km</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">Registration</p>
                  <p className="text-base font-semibold">Current</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
