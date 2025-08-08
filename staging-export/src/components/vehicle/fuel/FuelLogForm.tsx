
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Fuel } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { FuelType, Vehicle } from '@/hooks/vehicle-maintenance/types';

const fuelTypes: FuelType[] = [
  "diesel", 
  "petrol", 
  "electric", 
  "hybrid",
  "biodiesel",
  "ethanol",
  "lpg",
  "other"
];

const currencies = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "CNY"
];

// Define the shape of our form values
export type FuelLogFormValues = {
  vehicle_id: string;
  odometer: number;
  fill_date: Date;
  fuel_amount: number;
  fuel_price_per_unit: number;
  total_cost: number;
  fuel_type: string;
  fuel_station?: string;
  currency: string;
  notes?: string;
  full_tank: boolean;
};

// Create a Zod schema for validation
const fuelLogSchema = z.object({
  vehicle_id: z.string().uuid(),
  odometer: z.number().positive(),
  fill_date: z.date(),
  fuel_amount: z.number().positive(),
  fuel_price_per_unit: z.number().positive(),
  total_cost: z.number().positive(),
  fuel_type: z.string(),
  fuel_station: z.string().optional(),
  currency: z.string(),
  notes: z.string().optional(),
  full_tank: z.boolean().default(true)
});

interface FuelLogFormProps {
  onSubmit: (data: FuelLogFormValues) => Promise<void>;
  vehicles: Vehicle[];
  initialValues?: Partial<FuelLogFormValues>;
  isUpdate?: boolean;
  onCancel: () => void;
}

const FuelLogForm = ({ onSubmit, vehicles, initialValues, isUpdate = false, onCancel }: FuelLogFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const form = useForm<FuelLogFormValues>({
    resolver: zodResolver(fuelLogSchema),
    defaultValues: {
      vehicle_id: initialValues?.vehicle_id || '',
      odometer: initialValues?.odometer || 0,
      fill_date: initialValues?.fill_date || new Date(),
      fuel_amount: initialValues?.fuel_amount || 0,
      fuel_price_per_unit: initialValues?.fuel_price_per_unit || 0,
      total_cost: initialValues?.total_cost || 0,
      fuel_type: initialValues?.fuel_type || 'diesel',
      fuel_station: initialValues?.fuel_station || '',
      currency: initialValues?.currency || 'USD',
      notes: initialValues?.notes || '',
      full_tank: initialValues?.full_tank !== undefined ? initialValues.full_tank : true
    }
  });

  const watchFuelAmount = form.watch('fuel_amount');
  const watchFuelPrice = form.watch('fuel_price_per_unit');

  const handleCalculateTotal = () => {
    if (watchFuelAmount && watchFuelPrice) {
      setIsCalculating(true);
      setTimeout(() => {
        form.setValue('total_cost', Number((watchFuelAmount * watchFuelPrice).toFixed(2)));
        setIsCalculating(false);
      }, 100);
    }
  };

  const handleFinalSubmit = async (data: FuelLogFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          {isUpdate ? 'Update Fuel Log' : 'Add Fuel Log'}
        </CardTitle>
        <CardDescription>
          Keep track of your fuel consumption and costs
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFinalSubmit)}>
          <CardContent className="space-y-4">
            {/* Vehicle selection */}
            <FormField
              control={form.control}
              name="vehicle_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isUpdate}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.model} {vehicle.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date picker */}
            <FormField
              control={form.control}
              name="fill_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fill Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Odometer reading */}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fuel type selection */}
            <FormField
              control={form.control}
              name="fuel_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuelTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fuel amount */}
            <FormField
              control={form.control}
              name="fuel_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                        handleCalculateTotal();
                      }}
                    />
                  </FormControl>
                  <FormDescription>Liters or Gallons</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price per unit */}
              <FormField
                control={form.control}
                name="fuel_price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Unit</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                          handleCalculateTotal();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency */}
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
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map(currency => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total cost */}
            <FormField
              control={form.control}
              name="total_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cost</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fuel station */}
            <FormField
              control={form.control}
              name="fuel_station"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Station (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full tank checkbox */}
            <FormField
              control={form.control}
              name="full_tank"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Full Tank</FormLabel>
                    <FormDescription>
                      Check if you filled the tank completely
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : isUpdate ? 'Update Log' : 'Add Log'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default FuelLogForm;
