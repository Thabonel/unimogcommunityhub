
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { PlusCircle, Car, Gauge, AlertCircle, RefreshCw, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { Vehicle } from '@/hooks/vehicle-maintenance';
import AddVehicleForm from './AddVehicleForm';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function VehicleSelector({ 
  vehicles, 
  selectedVehicleId, 
  onSelectVehicle,
  isLoading,
  error,
  onRetry
}: VehicleSelectorProps) {
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
          
          // Show toast for retry
          if (retryCount === 0) {
            toast({
              title: "Connection issue detected",
              description: "Automatically retrying to connect to the server...",
              variant: "default"
            });
          }
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
      
      toast({
        title: "Retrying connection",
        description: "Attempting to reconnect to the server...",
      });
      
      // After a short delay, recheck network status
      setTimeout(() => {
        setNetworkStatus(navigator.onLine ? 'online' : 'offline');
      }, 1000);
    }
  };

  // Debug logging
  console.log("VehicleSelector props:", { 
    vehicleCount: vehicles.length, 
    isLoading, 
    hasError: !!error,
    errorMessage: error?.message,
    retryCount,
    isAutoRetrying,
    networkStatus
  });

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
            {networkStatus === 'offline' && (
              <span className="text-xs flex items-center text-amber-500 mr-2">
                <WifiOff size={12} className="mr-1" />
                Offline
              </span>
            )}
            {networkStatus === 'online' && !error && (
              <span className="text-xs flex items-center text-green-500 mr-2">
                <Wifi size={12} className="mr-1" />
                Connected
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleAddVehicleClick}>
              <PlusCircle size={16} className="mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {error && (
            <Alert variant={isNetworkError ? "warning" : "destructive"} className="mb-4">
              {isNetworkError ? (
                <>
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <span>
                      Unable to connect to the server. This could be due to network issues or the server might be temporarily unavailable.
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleManualRetry}
                      className="self-end"
                      disabled={isAutoRetrying || networkStatus === 'checking'}
                    >
                      <RefreshCw size={14} className={`mr-1 ${isAutoRetrying || networkStatus === 'checking' ? 'animate-spin' : ''}`} />
                      {isAutoRetrying || networkStatus === 'checking' ? 'Checking Connection...' : 'Retry Connection'}
                    </Button>
                  </AlertDescription>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription className="flex justify-between items-center">
                    <span>
                      {error.message || "Loading Vehicles Failed"}
                    </span>
                    {onRetry && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleManualRetry}
                        className="ml-2"
                      >
                        <RefreshCw size={14} className="mr-1" />
                        Retry
                      </Button>
                    )}
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}

          {vehicles.length === 0 && !error ? (
            <div className="text-center p-4">
              <Car className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">No vehicles yet</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleAddVehicleClick}
              >
                Add your first vehicle
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id}>
                  <Button
                    variant={selectedVehicleId === vehicle.id ? "default" : "ghost"}
                    className={`w-full justify-start h-auto py-3 ${
                      selectedVehicleId === vehicle.id ? "" : "hover:bg-muted"
                    }`}
                    onClick={() => onSelectVehicle(vehicle.id)}
                  >
                    <div className="flex items-center w-full">
                      <Car className="h-5 w-5 mr-3" />
                      <div className="text-left flex-grow">
                        <p className="font-medium">{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.year} {vehicle.model}
                        </p>
                      </div>
                    </div>
                  </Button>
                  <div 
                    className={`px-4 py-2 flex items-center text-sm ${
                      selectedVehicleId === vehicle.id ? "block" : "hidden" 
                    }`}
                  >
                    <Gauge className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {vehicle.current_odometer} {vehicle.odometer_unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <Separator />
          <AddVehicleForm onSuccess={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}
