
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
        <UnimogDataCard modelCode={unimogModel} />
      )}
    </div>
  );
}
