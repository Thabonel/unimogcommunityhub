import React from 'react';
import { Loader2, Car } from 'lucide-react';

export const VehicleLoadingState: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      <span className="text-muted-foreground">Loading vehicle data...</span>
    </div>
  );
};

export const NoVehiclesState: React.FC<{ onAddVehicle?: () => void }> = ({ onAddVehicle }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 text-center">
      <Car className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No Vehicles Found</h3>
        <p className="text-muted-foreground">
          You need to add a vehicle before logging fuel consumption.
        </p>
      </div>
      {onAddVehicle && (
        <button
          onClick={onAddVehicle}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Add your first vehicle
        </button>
      )}
    </div>
  );
};