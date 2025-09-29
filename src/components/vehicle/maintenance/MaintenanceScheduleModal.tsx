import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';

interface MaintenanceScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  prefilledType?: string;
  prefilledDescription?: string;
  onScheduled?: () => void;
}

interface ScheduleFormData {
  maintenance_type: string;
  description: string;
  scheduled_date: string;
  due_odometer: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimated_cost: string;
  estimated_duration_hours: string;
  location: string;
  service_provider: string;
  notes: string;
}

const MAINTENANCE_TYPES = [
  'Oil Change',
  'Filter Replacement',
  'Brake Service',
  'Transmission Service',
  'Hydraulic Service',
  'Tire Rotation/Replacement',
  'Engine Service',
  'Coolant Service',
  'Electrical Check',
  'Annual Inspection',
  'Portal Hub Service',
  'Differential Service',
  'PTO Service',
  'Other'
];

export const MaintenanceScheduleModal: React.FC<MaintenanceScheduleModalProps> = ({
  isOpen,
  onClose,
  vehicleId,
  prefilledType = '',
  prefilledDescription = '',
  onScheduled
}) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    maintenance_type: prefilledType,
    description: prefilledDescription,
    scheduled_date: '',
    due_odometer: '',
    priority: 'medium',
    estimated_cost: '',
    estimated_duration_hours: '',
    location: '',
    service_provider: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ScheduleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.maintenance_type || !formData.description || !formData.scheduled_date) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in the maintenance type, description, and scheduled date.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const scheduleData = {
        vehicle_id: vehicleId,
        maintenance_type: formData.maintenance_type,
        description: formData.description,
        scheduled_date: formData.scheduled_date,
        due_odometer: formData.due_odometer ? parseInt(formData.due_odometer) : null,
        priority: formData.priority,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
        estimated_duration_hours: formData.estimated_duration_hours ? parseInt(formData.estimated_duration_hours) : null,
        location: formData.location || null,
        service_provider: formData.service_provider || null,
        notes: formData.notes || null,
        status: 'scheduled'
      };

      const { data, error } = await supabase
        .from('maintenance_schedule')
        .insert([scheduleData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Maintenance Scheduled',
        description: `${formData.maintenance_type} has been scheduled for ${new Date(formData.scheduled_date).toLocaleDateString()}.`,
      });

      // Reset form
      setFormData({
        maintenance_type: '',
        description: '',
        scheduled_date: '',
        due_odometer: '',
        priority: 'medium',
        estimated_cost: '',
        estimated_duration_hours: '',
        location: '',
        service_provider: '',
        notes: ''
      });

      onScheduled?.();
      onClose();
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      toast({
        title: 'Error',
        description: 'Failed to schedule maintenance. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Calculate suggested date based on maintenance type
  const getSuggestedDate = (type: string) => {
    const today = new Date();
    const suggestedDays = {
      'Oil Change': 14,
      'Filter Replacement': 7,
      'Brake Service': 21,
      'Annual Inspection': 365,
      'Tire Rotation/Replacement': 30
    };

    const days = suggestedDays[type as keyof typeof suggestedDays] || 14;
    const suggestedDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    return suggestedDate.toISOString().split('T')[0];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Maintenance
          </DialogTitle>
          <DialogDescription>
            Schedule maintenance for your vehicle. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maintenance_type">Maintenance Type *</Label>
              <Select
                value={formData.maintenance_type}
                onValueChange={(value) => {
                  handleInputChange('maintenance_type', value);
                  // Auto-suggest date when type is selected
                  if (!formData.scheduled_date) {
                    handleInputChange('scheduled_date', getSuggestedDate(value));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance type" />
                </SelectTrigger>
                <SelectContent>
                  {MAINTENANCE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="high">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      High
                    </span>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      Urgent
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the maintenance work to be performed..."
              rows={3}
            />
          </div>

          {/* Scheduling Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled_date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Scheduled Date *
              </Label>
              <Input
                id="scheduled_date"
                type="date"
                value={formData.scheduled_date}
                onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_odometer">Due at Odometer (km)</Label>
              <Input
                id="due_odometer"
                type="number"
                value={formData.due_odometer}
                onChange={(e) => handleInputChange('due_odometer', e.target.value)}
                placeholder="e.g., 46000"
              />
            </div>
          </div>

          {/* Cost and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_cost" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Estimated Cost ($)
              </Label>
              <Input
                id="estimated_cost"
                type="number"
                step="0.01"
                value={formData.estimated_cost}
                onChange={(e) => handleInputChange('estimated_cost', e.target.value)}
                placeholder="e.g., 150.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_duration_hours" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Estimated Duration (hours)
              </Label>
              <Input
                id="estimated_duration_hours"
                type="number"
                value={formData.estimated_duration_hours}
                onChange={(e) => handleInputChange('estimated_duration_hours', e.target.value)}
                placeholder="e.g., 2"
              />
            </div>
          </div>

          {/* Location and Service Provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Where will the work be done?"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_provider">Service Provider</Label>
              <Input
                id="service_provider"
                value={formData.service_provider}
                onChange={(e) => handleInputChange('service_provider', e.target.value)}
                placeholder="Mechanic or workshop name"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information, special requirements, or reminders..."
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Maintenance'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};