export interface Database {
  public: {
    Tables: {
      vehicles: {
        Row: {
          id: string;
          user_id: string;
          model: string;
          year: number;
          vin?: string;
          nickname?: string;
          color?: string;
          mileage?: number;
          fuel_type?: string;
          transmission?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          model: string;
          year: number;
          vin?: string;
          nickname?: string;
          color?: string;
          mileage?: number;
          fuel_type?: string;
          transmission?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          model?: string;
          year?: number;
          vin?: string;
          nickname?: string;
          color?: string;
          mileage?: number;
          fuel_type?: string;
          transmission?: string;
          updated_at?: string;
        };
      };
      vehicle_maintenance_schedules: {
        Row: {
          id: string;
          vehicle_id: string;
          maintenance_type: string;
          description?: string;
          interval_miles?: number;
          interval_months?: number;
          last_service_date?: string;
          last_service_mileage?: number;
          next_due_date?: string;
          next_due_mileage?: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          maintenance_type: string;
          description?: string;
          interval_miles?: number;
          interval_months?: number;
          last_service_date?: string;
          last_service_mileage?: number;
          next_due_date?: string;
          next_due_mileage?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          maintenance_type?: string;
          description?: string;
          interval_miles?: number;
          interval_months?: number;
          last_service_date?: string;
          last_service_mileage?: number;
          next_due_date?: string;
          next_due_mileage?: number;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      vehicle_service_logs: {
        Row: {
          id: string;
          vehicle_id: string;
          service_date: string;
          service_type: string;
          description?: string;
          mileage_at_service?: number;
          cost?: number;
          service_provider?: string;
          receipt_url?: string;
          parts_replaced?: string[];
          next_service_due?: string;
          next_service_mileage?: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          service_date: string;
          service_type: string;
          description?: string;
          mileage_at_service?: number;
          cost?: number;
          service_provider?: string;
          receipt_url?: string;
          parts_replaced?: string[];
          next_service_due?: string;
          next_service_mileage?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          service_date?: string;
          service_type?: string;
          description?: string;
          mileage_at_service?: number;
          cost?: number;
          service_provider?: string;
          receipt_url?: string;
          parts_replaced?: string[];
          next_service_due?: string;
          next_service_mileage?: number;
          notes?: string;
          updated_at?: string;
        };
      };
      vehicle_fuel_logs: {
        Row: {
          id: string;
          vehicle_id: string;
          fill_date: string;
          mileage: number;
          fuel_amount: number;
          fuel_cost: number;
          fuel_price_per_unit: number;
          station_name?: string;
          location_lat?: number;
          location_lng?: number;
          is_full_tank: boolean;
          trip_id?: string;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          fill_date: string;
          mileage: number;
          fuel_amount: number;
          fuel_cost: number;
          fuel_price_per_unit: number;
          station_name?: string;
          location_lat?: number;
          location_lng?: number;
          is_full_tank?: boolean;
          trip_id?: string;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          fill_date?: string;
          mileage?: number;
          fuel_amount?: number;
          fuel_cost?: number;
          fuel_price_per_unit?: number;
          station_name?: string;
          location_lat?: number;
          location_lng?: number;
          is_full_tank?: boolean;
          trip_id?: string;
          notes?: string;
        };
      };
      vehicle_fuel_stats: {
        Row: {
          id: string;
          vehicle_id: string;
          period_start: string;
          period_end: string;
          total_fuel_cost?: number;
          total_fuel_amount?: number;
          total_distance?: number;
          avg_fuel_economy?: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          period_start: string;
          period_end: string;
          total_fuel_cost?: number;
          total_fuel_amount?: number;
          total_distance?: number;
          avg_fuel_economy?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          period_start?: string;
          period_end?: string;
          total_fuel_cost?: number;
          total_fuel_amount?: number;
          total_distance?: number;
          avg_fuel_economy?: number;
          updated_at?: string;
        };
      };
      vehicle_location_logs: {
        Row: {
          id: string;
          vehicle_id: string;
          timestamp: string;
          latitude: number;
          longitude: number;
          address?: string;
          location_type?: string;
          mileage?: number;
          notes?: string;
          trip_id?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          timestamp?: string;
          latitude: number;
          longitude: number;
          address?: string;
          location_type?: string;
          mileage?: number;
          notes?: string;
          trip_id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          timestamp?: string;
          latitude?: number;
          longitude?: number;
          address?: string;
          location_type?: string;
          mileage?: number;
          notes?: string;
          trip_id?: string;
        };
      };
      vehicle_usage_stats: {
        Row: {
          id: string;
          vehicle_id: string;
          period_start: string;
          period_end: string;
          total_miles?: number;
          total_trips?: number;
          avg_trip_distance?: number;
          most_visited_locations?: string[];
          updated_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          period_start: string;
          period_end: string;
          total_miles?: number;
          total_trips?: number;
          avg_trip_distance?: number;
          most_visited_locations?: string[];
          updated_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          period_start?: string;
          period_end?: string;
          total_miles?: number;
          total_trips?: number;
          avg_trip_distance?: number;
          most_visited_locations?: string[];
          updated_at?: string;
        };
      };
      vehicle_photos: {
        Row: {
          id: string;
          vehicle_id: string;
          file_path: string;
          file_name: string;
          file_size?: number;
          mime_type?: string;
          photo_type?: string;
          caption?: string;
          is_primary: boolean;
          taken_at?: string;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          vehicle_id: string;
          file_path: string;
          file_name: string;
          file_size?: number;
          mime_type?: string;
          photo_type?: string;
          caption?: string;
          is_primary?: boolean;
          taken_at?: string;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          vehicle_id?: string;
          file_path?: string;
          file_name?: string;
          file_size?: number;
          mime_type?: string;
          photo_type?: string;
          caption?: string;
          is_primary?: boolean;
          taken_at?: string;
        };
      };
      // Existing tables (add as needed)
      trips: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}