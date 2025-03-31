
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2, X } from 'lucide-react';
import { MaintenanceType } from '@/hooks/use-vehicle-maintenance';

interface MaintenanceLogFormProps {
  vehicleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const today = new Date().toISOString().split('T')[0];

const maintenanceTypes: {
  value: MaintenanceType;
  label: string;
}[] = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'tire_rotation', label: 'Tire Rotation' },
  { value: 'brake_service', label: 'Brake Service' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'repair', label: 'Repair' },
  { value: 'modification', label: 'Modification' },
  { value: 'fluid_change', label: 'Fluid Change' },
  { value: 'filter_replacement', label: 'Filter Replacement' },
  { value: 'other', label: 'Other' }
];

const currencies = [
  { value: 'USD', label: 'USD - $' },
  { value: 'EUR', label: 'EUR - €' },
  { value: 'GBP', label: 'GBP - £' },
  { value: 'CAD', label: 'CAD - $' },
  { value: 'AUD', label: 'AUD - $' },
];

const formSchema = z.object({
  maintenance_type: z.enum([
    'oil_change', 'tire_rotation', 'brake_service', 'inspection',
    'repair', 'modification', 'fluid_change', 'filter_replacement', 'other'
  ] as const),
  date: z.string().nonempty('Date is required'),
  odometer: z.number().int().positive('Odometer must be a positive number'),
  cost: z.number().nonnegative('Cost must be zero or positive').optional(),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
  completed_by: z.string().optional(),
  location: z.string().optional(),
  parts: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MaintenanceLogForm({ 
  vehicleId, 
  onSuccess, 
  onCancel 
}: MaintenanceLogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maintenance_type: 'oil_change',
      date: today,
      odometer: 0,
      currency: 'USD',
      notes: '',
      completed_by: '',
      location: '',
      parts: '',
    }
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Process parts text into an array
      const parts_replaced = values.parts 
        ? values.parts.split(',').map(part => part.trim()).filter(Boolean)
        : undefined;
        
      const { error } = await supabase
        .from('maintenance_logs')
        .insert({
          vehicle_id: vehicleId,
          maintenance_type: values.maintenance_type,
          date: values.date,
          odometer: values.odometer,
          cost: values.cost,
          currency: values.currency,
          notes: values.notes || null,
          completed_by: values.completed_by || null,
          location: values.location || null,
          parts_replaced,
        });

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Maintenance log added successfully',
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding maintenance log:', error);
      toast({
        title: 'Error',
        description: 'Failed to add maintenance log',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Add Maintenance Log</CardTitle>
        {onCancel && (
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
            <span className="sr-only">Cancel</span>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maintenance_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maintenance Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {maintenanceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
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
                      <Input type="date" {...field} max={today} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="odometer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Odometer Reading</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(
                              e.target.value ? parseFloat(e.target.value) : undefined
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-1">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="$" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="completed_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Completed By (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Mechanic or self" {...field} />
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
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Workshop or location name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="parts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parts Replaced (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Comma-separated list of parts" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about the maintenance"
                      className="min-h-[100px]" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Maintenance Log
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
