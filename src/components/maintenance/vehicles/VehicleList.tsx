
import { Car, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/hooks/vehicle-maintenance';

interface VehicleListProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
}

export default function VehicleList({ 
  vehicles, 
  selectedVehicleId, 
  onSelectVehicle 
}: VehicleListProps) {
  return (
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
  );
}
