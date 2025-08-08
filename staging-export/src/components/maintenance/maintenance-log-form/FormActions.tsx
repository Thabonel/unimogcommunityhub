
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

export function FormActions({ isSubmitting, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Save className="mr-2 h-4 w-4" />
        Save Log
      </Button>
    </div>
  );
}
