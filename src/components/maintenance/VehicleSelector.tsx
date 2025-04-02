
import { Vehicle } from '@/hooks/vehicle-maintenance';
import VehicleSelectorContent from './vehicles/VehicleSelectorContent';

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  isLoading: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export default function VehicleSelector(props: VehicleSelectorProps) {
  // This is just a wrapper component that forwards props to the VehicleSelectorContent
  return <VehicleSelectorContent {...props} error={props.error || null} />;
}
