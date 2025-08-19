
import { FormProvider } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { ServiceDetails } from './maintenance-log-form/ServiceDetails';
import { CostInformation } from './maintenance-log-form/CostInformation';
import { AdditionalDetails } from './maintenance-log-form/AdditionalDetails';
import { FormActions } from './maintenance-log-form/FormActions';
import { MaintenanceLogFormHeader } from './maintenance-log-form/MaintenanceLogFormHeader';
import { MaintenanceLogFormProps } from './maintenance-log-form/types';
import { useMaintenanceLogForm } from '@/hooks/vehicle-maintenance/use-maintenance-log-form';

export default function MaintenanceLogForm({ vehicleId, onSuccess, onCancel }: MaintenanceLogFormProps) {
  const { form, isSubmitting, onSubmit } = useMaintenanceLogForm({
    vehicleId,
    onSuccess
  });

  return (
    <Card>
      <MaintenanceLogFormHeader onCancel={onCancel} />
      <CardContent>
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
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
