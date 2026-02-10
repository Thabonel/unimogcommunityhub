import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Vehicle } from '@/hooks/vehicle-maintenance/types';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseFormValues } from './types';

interface ExpenseUploadModalProps {
  isOpen: boolean;
  vehicles: Vehicle[];
  isLoading?: boolean;
  isUpdate?: boolean;
  initialValues?: Partial<ExpenseFormValues>;
  onSubmit: (data: ExpenseFormValues, files: File[]) => Promise<void>;
  onClose: () => void;
}

export const ExpenseUploadModal: React.FC<ExpenseUploadModalProps> = ({
  isOpen,
  vehicles,
  isLoading = false,
  isUpdate = false,
  initialValues,
  onSubmit,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? 'Update Expense' : 'Record New Expense'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-auto max-h-[calc(90vh-120px)]">
          <div className="pr-4">
            <ExpenseForm
              vehicles={vehicles}
              onSubmit={onSubmit}
              onCancel={onClose}
              isUpdate={isUpdate}
              initialValues={initialValues}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
