import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useVehicleMaintenance } from '@/hooks/vehicle-maintenance';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Vehicle } from '@/hooks/vehicle-maintenance';

interface AddVehicleFormProps {
  onSuccess?: () => void;
}

interface VehicleFormValues {
  name: string;
  model: string;
  year: string;
  vin?: string;
  license_plate?: string;
  current_odometer: number;
  odometer_unit: "km" | "mi";
}

export default function AddVehicleForm({ onSuccess }: AddVehicleFormProps) {
  const { user } = useAuth();
  const { addVehicle } = useVehicleMaintenance(user?.id);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Name</FormLabel>
              <FormControl>
                <Input placeholder="My Unimog" {...field} />
              </FormControl>
              <FormDescription>
                A name to identify your vehicle
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="U1700L" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="1988" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Vehicle ID Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="license_plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="License Plate" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="current_odometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Odometer</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="odometer_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="km">Kilometers</SelectItem>
                    <SelectItem value="mi">Miles</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Vehicle
          </Button>
        </div>
      </form>
    </Form>
  );
}
