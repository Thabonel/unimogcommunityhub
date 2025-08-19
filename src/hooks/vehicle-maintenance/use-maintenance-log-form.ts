
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMaintenanceLogs } from './use-maintenance-logs';
import { LogFormValues } from '@/components/maintenance/maintenance-log-form/types';

export interface UseMaintenanceLogFormProps {
  vehicleId: string;
  onSuccess?: () => void;
}

export const useMaintenanceLogForm = ({ vehicleId, onSuccess }: UseMaintenanceLogFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addMaintenanceLog } = useMaintenanceLogs();
  
  const form = useForm<LogFormValues>({
    defaultValues: {
      maintenance_type: 'oil_change',
      date: new Date().toISOString().split('T')[0],
      odometer: 0,
      cost: 0,
      currency: 'USD',
      notes: '',
      completed_by: '',
      location: ''
    }
  });

  const onSubmit = async (data: LogFormValues) => {
    setIsSubmitting(true);
    try {
      await addMaintenanceLog({
        ...data,
        vehicle_id: vehicleId,
        odometer: Number(data.odometer),
        cost: Number(data.cost)
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Error handling is done in the useMaintenanceLogs hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit)
  };
};
