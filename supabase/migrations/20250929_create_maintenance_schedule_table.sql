CREATE TABLE IF NOT EXISTS maintenance_schedule (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    maintenance_type TEXT NOT NULL,
    description TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    due_odometer INTEGER,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'overdue', 'completed', 'cancelled')),
    estimated_cost NUMERIC(10,2),
    estimated_duration_hours INTEGER,
    location TEXT,
    service_provider TEXT,
    reminder_sent_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_schedule_vehicle_id ON maintenance_schedule(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedule_date ON maintenance_schedule(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_schedule_status ON maintenance_schedule(status);

ALTER TABLE maintenance_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their vehicle maintenance schedules" ON maintenance_schedule
    FOR SELECT USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their vehicle maintenance schedules" ON maintenance_schedule
    FOR INSERT WITH CHECK (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their vehicle maintenance schedules" ON maintenance_schedule
    FOR UPDATE USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their vehicle maintenance schedules" ON maintenance_schedule
    FOR DELETE USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );