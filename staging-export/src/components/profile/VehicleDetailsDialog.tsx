
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

interface VehicleDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    unimogModel: string;
  };
  vehicleData: {
    model: string;
    year: string;
    engine: string;
    power: string;
    transmission: string;
    weight: string;
    modifications: string[];
    maintenanceHistory: {
      date: string;
      service: string;
    }[];
  };
}

const VehicleDetailsDialog = ({ isOpen, onOpenChange, userData, vehicleData }: VehicleDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Unimog {userData.unimogModel} Details</span>
            <DialogClose className="h-4 w-4 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogTitle>
          <DialogDescription>
            Technical specifications and maintenance history
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Model</h4>
              <p>{vehicleData.model}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Year</h4>
              <p>{vehicleData.year}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Engine</h4>
              <p>{vehicleData.engine}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Power Output</h4>
              <p>{vehicleData.power}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Transmission</h4>
              <p>{vehicleData.transmission}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Weight</h4>
              <p>{vehicleData.weight}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Modifications</h4>
            <ul className="list-disc pl-5 space-y-1">
              {vehicleData.modifications.map((mod, index) => (
                <li key={index} className="text-sm">{mod}</li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium">Recent Maintenance</h4>
            <div className="space-y-2">
              {vehicleData.maintenanceHistory.map((item, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-2">
                  <span>{item.service}</span>
                  <span className="text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Link to="/unimog-u1700l">
            <Button>View Complete Details</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
