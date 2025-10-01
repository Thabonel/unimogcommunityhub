-- Missing Vehicle Management Tables
-- Execute this in Supabase SQL Editor

-- 1. Vehicle Maintenance Schedules
CREATE TABLE IF NOT EXISTS vehicle_maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT,
    interval_miles INTEGER,
    interval_months INTEGER,
    last_service_date DATE,
    last_service_mileage INTEGER,
    next_due_date DATE,
    next_due_mileage INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Vehicle Service History/Logs
CREATE TABLE IF NOT EXISTS vehicle_service_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    service_date DATE NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    mileage_at_service INTEGER,
    cost DECIMAL(10,2),
    service_provider VARCHAR(255),
    receipt_url TEXT,
    parts_replaced TEXT[],
    next_service_due DATE,
    next_service_mileage INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vehicle Fuel Consumption Logs
CREATE TABLE IF NOT EXISTS vehicle_fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    fill_date DATE NOT NULL,
    mileage INTEGER NOT NULL,
    fuel_amount DECIMAL(8,3) NOT NULL,
    fuel_cost DECIMAL(10,2) NOT NULL,
    fuel_price_per_unit DECIMAL(6,3) NOT NULL,
    station_name VARCHAR(255),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    is_full_tank BOOLEAN DEFAULT true,
    trip_id UUID REFERENCES trips(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Vehicle Fuel Statistics (Computed/Cached)
CREATE TABLE IF NOT EXISTS vehicle_fuel_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_fuel_cost DECIMAL(10,2),
    total_fuel_amount DECIMAL(8,3),
    total_distance INTEGER,
    avg_fuel_economy DECIMAL(6,2),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Vehicle Location Check-ins
CREATE TABLE IF NOT EXISTS vehicle_location_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    address TEXT,
    location_type VARCHAR(50),
    mileage INTEGER,
    notes TEXT,
    trip_id UUID REFERENCES trips(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Vehicle Usage Statistics
CREATE TABLE IF NOT EXISTS vehicle_usage_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_miles INTEGER,
    total_trips INTEGER,
    avg_trip_distance DECIMAL(6,2),
    most_visited_locations TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Vehicle Photos Metadata
CREATE TABLE IF NOT EXISTS vehicle_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    photo_type VARCHAR(50),
    caption TEXT,
    is_primary BOOLEAN DEFAULT false,
    taken_at TIMESTAMPTZ,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Storage Bucket for Vehicle Photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'vehicles',
    'vehicles',
    true,
    52428800,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_vehicle_maintenance_schedules_vehicle_id ON vehicle_maintenance_schedules(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_service_logs_vehicle_id ON vehicle_service_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_fuel_logs_vehicle_id ON vehicle_fuel_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_location_logs_vehicle_id ON vehicle_location_logs(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_vehicle_id ON vehicle_photos(vehicle_id);

-- RLS Policies
ALTER TABLE vehicle_maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_service_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_fuel_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_location_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;

-- Maintenance Schedules Policies
CREATE POLICY "Users can manage own vehicle maintenance schedules" ON vehicle_maintenance_schedules
    FOR ALL USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

-- Service Logs Policies
CREATE POLICY "Users can manage own vehicle service logs" ON vehicle_service_logs
    FOR ALL USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

-- Fuel Logs Policies
CREATE POLICY "Users can manage own vehicle fuel logs" ON vehicle_fuel_logs
    FOR ALL USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

-- Fuel Stats Policies
CREATE POLICY "Users can view own vehicle fuel stats" ON vehicle_fuel_stats
    FOR ALL USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

-- Location Logs Policies
CREATE POLICY "Users can manage own vehicle location logs" ON vehicle_location_logs
    FOR ALL USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

-- Usage Stats Policies
CREATE POLICY "Users can view own vehicle usage stats" ON vehicle_usage_stats
    FOR ALL USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

-- Photos Policies
CREATE POLICY "Users can manage own vehicle photos" ON vehicle_photos
    FOR ALL USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

-- Storage Policies for vehicle photos
CREATE POLICY "Users can upload vehicle photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'vehicles' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view vehicle photos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'vehicles' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own vehicle photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'vehicles' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own vehicle photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'vehicles' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );