
import { supabase } from '@/lib/supabase-client';

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

export type FuelType = 
  | "diesel" 
  | "petrol" 
  | "electric" 
  | "hybrid"
  | "biodiesel"
  | "ethanol"
  | "lpg"
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
  // New showcase fields
  description?: string;
  modifications?: string;
  specs?: Record<string, any>;
  photos?: string[];
  is_showcase?: boolean;
  country?: string;
  country_code?: string;
  region?: string;
  city?: string;
  showcase_order?: number;
  views_count?: number;
  likes_count?: number;
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

export interface FuelLog {
  id: string;
  vehicle_id: string;
  user_id: string;
  odometer: number;
  fill_date: string;
  fuel_amount: number;
  fuel_price_per_unit: number;
  total_cost: number;
  fuel_type: string;
  fuel_station?: string;
  currency: string;
  notes?: string;
  full_tank: boolean;
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

export interface VehicleLike {
  id: string;
  vehicle_id: string;
  user_id: string;
  created_at: string;
}

export interface VehicleComment {
  id: string;
  vehicle_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleView {
  id: string;
  vehicle_id: string;
  user_id?: string;
  ip_address?: string;
  created_at: string;
}

export interface VehicleShowcaseInfo extends Vehicle {
  owner_name?: string;
  owner_avatar?: string;
  total_likes: number;
  total_views: number;
  total_comments: number;
  user_has_liked: boolean;
  trending_score: number;
}
