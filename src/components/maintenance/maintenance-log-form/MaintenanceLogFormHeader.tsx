
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';

interface MaintenanceLogFormHeaderProps {
  onCancel?: () => void;
}

export function MaintenanceLogFormHeader({ onCancel }: MaintenanceLogFormHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Add Maintenance Log</CardTitle>
      {onCancel && (
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </CardHeader>
  );
}
