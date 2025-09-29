import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { format } from 'date-fns';

const maintenanceRecordSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  maintenance_type: z.string().min(1, 'Maintenance type is required'),
  odometer: z.number().min(0, 'Odometer reading must be positive'),
  cost: z.number().min(0, 'Cost must be positive'),
  notes: z.string().optional(),
  location: z.string().optional(),
  completed_by: z.string().optional(),
  currency: z.string().default('USD')
});

type MaintenanceRecordForm = z.infer<typeof maintenanceRecordSchema>;

interface MaintenanceRecordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  onRecordAdded?: () => void;
}

const maintenanceTypes = [
  'Oil Change',
  'Filter Replacement',
  'Brake Service',
  'Tire Service',
  'Transmission Service',
  'Coolant Service',
  'Annual Inspection',
  'Battery Service',
  'Belt Replacement',
  'Spark Plug Replacement',
  'Differential Service',
  'Portal Axle Service',
  'Hydraulic Service',
  'PTO Service',
  'Engine Tune-up',
  'Other'
];

export function MaintenanceRecordModal({
  isOpen,
  onOpenChange,
  vehicleId,
  onRecordAdded
}: MaintenanceRecordModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<MaintenanceRecordForm>({
    resolver: zodResolver(maintenanceRecordSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      odometer: 0,
      cost: 0,
      currency: 'USD'
    }
  });

  const selectedType = watch('maintenance_type');

  const onSubmit = async (data: MaintenanceRecordForm) => {
    if (!user) {
      toast.error('You must be logged in to add maintenance records');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('maintenance_logs')
        .insert([
          {
            vehicle_id: vehicleId,
            date: data.date,
            maintenance_type: data.maintenance_type,
            odometer: data.odometer,
            cost: data.cost,
            currency: data.currency,
            notes: data.notes || null,
            location: data.location || null,
            completed_by: data.completed_by || null
          }
        ]);

      if (error) {
        console.error('Error adding maintenance record:', error);
        toast.error('Failed to add maintenance record');
        return;
      }

      toast.success('Maintenance record added successfully');
      reset();
      onOpenChange(false);
      onRecordAdded?.();
    } catch (error) {
      console.error('Error adding maintenance record:', error);
      toast.error('Failed to add maintenance record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaintenanceTypeChange = (value: string) => {
    setValue('maintenance_type', value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Add Maintenance Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="odometer">Odometer (km)</Label>
              <Input
                id="odometer"
                type="number"
                {...register('odometer', { valueAsNumber: true })}
                className={errors.odometer ? 'border-red-500' : ''}
              />
              {errors.odometer && (
                <p className="text-sm text-red-500 mt-1">{errors.odometer.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="maintenance_type">Maintenance Type</Label>
            <Select onValueChange={handleMaintenanceTypeChange} value={selectedType}>
              <SelectTrigger className={errors.maintenance_type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select maintenance type" />
              </SelectTrigger>
              <SelectContent>
                {maintenanceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.maintenance_type && (
              <p className="text-sm text-red-500 mt-1">{errors.maintenance_type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost">Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                {...register('cost', { valueAsNumber: true })}
                className={errors.cost ? 'border-red-500' : ''}
              />
              {errors.cost && (
                <p className="text-sm text-red-500 mt-1">{errors.cost.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="completed_by">Completed By (Optional)</Label>
              <Input
                id="completed_by"
                {...register('completed_by')}
                placeholder="Mechanic or service center"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Service location"
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select onValueChange={(value) => setValue('currency', value)} defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                  <SelectItem value="AUD">AUD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about the maintenance"
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Adding...' : 'Add Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}