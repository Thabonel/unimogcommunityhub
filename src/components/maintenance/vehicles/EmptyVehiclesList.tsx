
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyVehiclesListProps {
  onAddVehicleClick: () => void;
}

export default function EmptyVehiclesList({ onAddVehicleClick }: EmptyVehiclesListProps) {
  return (
    <div className="text-center p-4">
      <Car className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
      <p className="text-muted-foreground">No vehicles yet</p>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2"
        onClick={onAddVehicleClick}
      >
        Add your first vehicle
      </Button>
    </div>
  );
}
