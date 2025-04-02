
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMaintenanceLogs } from '@/hooks/vehicle-maintenance';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ServiceDetails } from './maintenance-log-form/ServiceDetails';
import { CostInformation } from './maintenance-log-form/CostInformation';
import { AdditionalDetails } from './maintenance-log-form/AdditionalDetails';
import { FormActions } from './maintenance-log-form/FormActions';
import { MaintenanceLogFormHeader } from './maintenance-log-form/MaintenanceLogFormHeader';
import { LogFormValues, MaintenanceLogFormProps } from './maintenance-log-form/types';

export default function MaintenanceLogForm({ vehicleId, onSuccess, onCancel }: MaintenanceLogFormProps) {
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
      // Error handling is done in the useVehicleMaintenance hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <MaintenanceLogFormHeader onCancel={onCancel} />
      <CardContent>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ServiceDetails />
              <CostInformation />
              <AdditionalDetails />
              <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
            </form>
          </Form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
