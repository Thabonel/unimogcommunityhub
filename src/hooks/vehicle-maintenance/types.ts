
import { supabase } from "@/integrations/supabase/client";

export type MaintenanceType = 
  | "oil_change" 
  | "tire_rotation" 
  | "brake_service"
  | "inspection" 
  | "repair" 
  | "modification"
  | "fluid_change"
  | "filter_replacement"
  | "other";

export interface Vehicle {
  id: string;
  user_id: string;
  name: string;
  model: string;
  year: string;
  vin?: string;
  license_plate?: string;
  current_odometer: number;
  odometer_unit: "km" | "mi";
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
}

export interface MaintenanceLog {
  id: string;
  vehicle_id: string;
  maintenance_type: MaintenanceType;
  date: string;
  odometer: number;
  cost?: number;
  currency: string;
  notes?: string;
  completed_by?: string;
  location?: string;
  parts_replaced?: string[];
  created_at: string;
  updated_at: string;
}

export interface MaintenanceAlert {
  id: string;
  vehicle_id: string;
  maintenance_type: MaintenanceType;
  due_date?: string;
  due_odometer?: number;
  is_overdue: boolean;
  description: string;
}

export interface MaintenanceNotificationSettings {
  id: string;
  vehicle_id: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  notification_frequency: 'daily' | 'weekly' | 'monthly';
  phone_number?: string;
}
