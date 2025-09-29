CREATE TABLE IF NOT EXISTS vehicle_data_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    entry_type TEXT NOT NULL CHECK (entry_type IN ('odometer_update', 'performance', 'condition', 'modification')),
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL DEFAULT 'km',
    description TEXT NOT NULL,
    location TEXT,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vehicle_data_entries_vehicle_id ON vehicle_data_entries(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_data_entries_entry_date ON vehicle_data_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_data_entries_entry_type ON vehicle_data_entries(entry_type);

ALTER TABLE vehicle_data_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their vehicle data entries" ON vehicle_data_entries
    FOR SELECT USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their vehicle data entries" ON vehicle_data_entries
    FOR INSERT WITH CHECK (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their vehicle data entries" ON vehicle_data_entries
    FOR UPDATE USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their vehicle data entries" ON vehicle_data_entries
    FOR DELETE USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE user_id = auth.uid()
        )
    );