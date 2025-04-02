
import { MaintenanceType } from '@/hooks/vehicle-maintenance/types';

export interface LogFormValues {
  maintenance_type: MaintenanceType;
  date: string;
  odometer: number;
  cost: number;
  currency: string;
  notes?: string;
  completed_by?: string;
  location?: string;
}

export interface MaintenanceLogFormProps {
  vehicleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}
