
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { Vehicle } from '@/hooks/vehicle-maintenance';

// Import our new components
import NetworkStatus from './NetworkStatus';
import VehicleErrorAlert from './VehicleErrorAlert';
import EmptyVehiclesList from './EmptyVehiclesList';
import VehicleList from './VehicleList';
import AddVehicleDialog from './AddVehicleDialog';

interface VehicleSelectorContentProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
}

export default function VehicleSelectorContent({ 
  vehicles, 
  selectedVehicleId, 
  onSelectVehicle,
  isLoading,
  error,
  onRetry
}: VehicleSelectorContentProps) {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isAutoRetrying, setIsAutoRetrying] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Check network status initially and set up listeners
  useEffect(() => {
    const checkNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };
    
    // Check immediately
    checkNetworkStatus();
    
    // Set up event listeners for online/offline events
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, []);

  // Auto-retry mechanism for network errors
  useEffect(() => {
    if (error && error.message?.includes("Failed to fetch") && retryCount < 3 && !isAutoRetrying) {
      const timer = setTimeout(() => {
        console.log(`Auto-retrying vehicle fetch (attempt ${retryCount + 1}/3)...`);
        setIsAutoRetrying(true);
        
        if (onRetry) {
          onRetry();
          setRetryCount(prev => prev + 1);
        }
        
        setIsAutoRetrying(false);
      }, 1500); // Wait 1.5 seconds before retrying
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, onRetry, isAutoRetrying]);

  const handleAddVehicleClick = () => {
    setIsAddingVehicle(true);
  };

  const handleCloseDialog = () => {
    setIsAddingVehicle(false);
    // Refresh the vehicle list after adding a new one
    if (onRetry) {
      onRetry();
      // Reset retry count when manually adding a vehicle
      setRetryCount(0);
    }
  };

  const handleManualRetry = () => {
    if (onRetry) {
      console.log("Manual retry triggered");
      setRetryCount(0); // Reset auto-retry counter on manual retry
      setNetworkStatus('checking'); // Reset network status to trigger a recheck
      onRetry();
      
      // After a short delay, recheck network status
      setTimeout(() => {
        setNetworkStatus(navigator.onLine ? 'online' : 'offline');
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">My Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const isNetworkError = error?.message?.includes("Failed to fetch") || networkStatus === 'offline';

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">My Vehicles</CardTitle>
          <div className="flex items-center gap-2">
            <NetworkStatus status={networkStatus} />
            <Button variant="ghost" size="sm" onClick={handleAddVehicleClick}>
              <PlusCircle size={16} className="mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <VehicleErrorAlert 
            error={error} 
            onRetry={handleManualRetry}
            isAutoRetrying={isAutoRetrying}
            networkStatus={networkStatus}
            isNetworkError={isNetworkError}
          />

          {vehicles.length === 0 && !error ? (
            <EmptyVehiclesList onAddVehicleClick={handleAddVehicleClick} />
          ) : (
            <VehicleList 
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={onSelectVehicle}
            />
          )}
        </CardContent>
      </Card>

      <AddVehicleDialog 
        open={isAddingVehicle} 
        onOpenChange={setIsAddingVehicle}
        onSuccess={handleCloseDialog} 
      />
    </>
  );
}
