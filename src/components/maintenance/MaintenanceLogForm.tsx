import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVehicleMaintenance, MaintenanceLog, MaintenanceType } from '@/hooks/vehicle-maintenance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, X } from 'lucide-react';

interface MaintenanceLogFormProps {
  vehicleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface LogFormValues {
  maintenance_type: MaintenanceType;
  date: string;
  odometer: number;
  cost: number;
  currency: string;
  notes?: string;
  completed_by?: string;
  location?: string;
}

export default function MaintenanceLogForm({ vehicleId, onSuccess, onCancel }: MaintenanceLogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addMaintenanceLog } = useVehicleMaintenance();
  
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Add Maintenance Log</CardTitle>
        {onCancel && (
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="maintenance_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="oil_change">Oil Change</SelectItem>
                      <SelectItem value="tire_rotation">Tire Rotation</SelectItem>
                      <SelectItem value="brake_service">Brake Service</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="modification">Modification</SelectItem>
                      <SelectItem value="fluid_change">Fluid Change</SelectItem>
                      <SelectItem value="filter_replacement">Filter Replacement</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="odometer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Odometer reading" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Cost of service" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="completed_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completed By</FormLabel>
                  <FormControl>
                    <Input placeholder="Technician/Service provider" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Service location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
