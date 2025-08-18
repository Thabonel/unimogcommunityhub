-- Vehicle Reports Table for content moderation
CREATE TABLE IF NOT EXISTS vehicle_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('inappropriate', 'spam', 'offensive', 'fake', 'stolen', 'other')),
    details TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vehicle_reports_vehicle_id ON vehicle_reports(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_reports_reporter_id ON vehicle_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_reports_status ON vehicle_reports(status);
CREATE INDEX IF NOT EXISTS idx_vehicle_reports_created_at ON vehicle_reports(created_at DESC);

-- Enable RLS
ALTER TABLE vehicle_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can insert their own reports
CREATE POLICY "Users can create reports" ON vehicle_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own reports
CREATE POLICY "Users can view own reports" ON vehicle_reports
    FOR SELECT USING (auth.uid() = reporter_id);

-- Admins can view all reports
CREATE POLICY "Admins can view all reports" ON vehicle_reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Admins can update reports
CREATE POLICY "Admins can update reports" ON vehicle_reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_vehicle_reports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER trigger_update_vehicle_reports_updated_at
    BEFORE UPDATE ON vehicle_reports
    FOR EACH ROW EXECUTE FUNCTION update_vehicle_reports_updated_at();

-- Function to prevent duplicate reports from same user
CREATE OR REPLACE FUNCTION check_duplicate_vehicle_report()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM vehicle_reports
        WHERE vehicle_id = NEW.vehicle_id
        AND reporter_id = NEW.reporter_id
        AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'You have already reported this vehicle';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent duplicate reports
CREATE TRIGGER trigger_check_duplicate_vehicle_report
    BEFORE INSERT ON vehicle_reports
    FOR EACH ROW EXECUTE FUNCTION check_duplicate_vehicle_report();