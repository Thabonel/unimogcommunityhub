
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AddVehicleForm from '@/components/maintenance/AddVehicleForm';

interface AddVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AddVehicleDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: AddVehicleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <Separator />
        <AddVehicleForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
