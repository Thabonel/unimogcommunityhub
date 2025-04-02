
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicles } from '@/hooks/vehicle-maintenance';
import { Form } from '@/components/ui/form';
import { VehicleFormValues } from './vehicle-form/types';
import { VehicleBasicInfo } from './vehicle-form/VehicleBasicInfo';
import { VehicleIdentification } from './vehicle-form/VehicleIdentification';
import { VehicleOdometer } from './vehicle-form/VehicleOdometer';
import { FormActions } from './vehicle-form/FormActions';
import { Car } from 'lucide-react';

interface AddVehicleFormProps {
  onSuccess?: () => void;
}

export default function AddVehicleForm({ onSuccess }: AddVehicleFormProps) {
  const { user } = useAuth();
  const { addVehicle } = useVehicles(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<VehicleFormValues>({
    defaultValues: {
      name: '',
      model: 'U1700L',
      year: '1988',
      vin: '',
      license_plate: '',
      current_odometer: 0,
      odometer_unit: 'km'
    }
  });

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      setIsSubmitting(true);
      await addVehicle({
        ...data,
        current_odometer: Number(data.current_odometer)
      });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling is done in the useVehicleMaintenance hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Car size={20} />
        <h2 className="text-lg font-medium">Add New Vehicle</h2>
      </div>
      
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <VehicleBasicInfo />
            <VehicleIdentification />
            <VehicleOdometer />
            <FormActions isSubmitting={isSubmitting} onCancel={onSuccess} />
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
