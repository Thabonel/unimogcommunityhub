import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Car, Gauge } from 'lucide-react';
import { Vehicle } from '@/hooks/vehicle-maintenance';
import AddVehicleForm from './AddVehicleForm';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  isLoading: boolean;
}

export default function VehicleSelector({ 
  vehicles, 
  selectedVehicleId, 
  onSelectVehicle,
  isLoading
}: VehicleSelectorProps) {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  const handleAddVehicleClick = () => {
    setIsAddingVehicle(true);
  };

  const handleCloseDialog = () => {
    setIsAddingVehicle(false);
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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl">My Vehicles</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleAddVehicleClick}>
            <PlusCircle size={16} className="mr-1" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {vehicles.length === 0 ? (
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
