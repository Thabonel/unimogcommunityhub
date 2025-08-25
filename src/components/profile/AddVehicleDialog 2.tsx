import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddVehicleForm from '@/components/maintenance/AddVehicleForm';

interface AddVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddVehicleDialog = ({ isOpen, onClose }: AddVehicleDialogProps) => {
  const handleSuccess = () => {
    onClose();
    // Could add a toast notification here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <AddVehicleForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;