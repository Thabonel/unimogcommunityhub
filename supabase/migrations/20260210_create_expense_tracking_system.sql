BEGIN;

CREATE TABLE expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  color_code TEXT,
  expense_type TEXT NOT NULL CHECK (expense_type IN ('maintenance', 'fuel', 'modification', 'insurance', 'registration', 'repair', 'parts', 'service', 'other')),
  is_system_defined BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  expense_date DATE NOT NULL,
  entry_date TIMESTAMPTZ DEFAULT NOW(),
  description TEXT NOT NULL,
  notes TEXT,
  vendor_name TEXT,
  vendor_location TEXT,
  invoice_number TEXT,
  odometer_reading INTEGER,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT CHECK (recurrence_pattern IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually', NULL)),
  recurrence_end_date DATE,
  parent_recurring_id UUID REFERENCES expenses(id) ON DELETE SET NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approval_date TIMESTAMPTZ,
  approval_notes TEXT,
  is_tax_deductible BOOLEAN DEFAULT true,
  tax_category TEXT CHECK (tax_category IN ('maintenance', 'fuel', 'modifications', 'insurance', 'depreciation', 'registration', 'parts', 'labor', 'other', NULL)),
  vat_amount NUMERIC(12, 2),
  vat_percentage NUMERIC(5, 2),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE expense_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image', 'document', 'spreadsheet', 'other')),
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_bucket TEXT NOT NULL DEFAULT 'expense-receipts',
  storage_url TEXT,
  is_primary BOOLEAN DEFAULT false,
  ocr_status TEXT DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed', 'skipped')),
  ocr_text TEXT,
  ocr_confidence NUMERIC(5, 2) CHECK (ocr_confidence >= 0 AND ocr_confidence <= 100),
  ocr_processed_at TIMESTAMPTZ,
  extracted_data JSONB DEFAULT '{}'::JSONB,
  document_type TEXT CHECK (document_type IN ('invoice', 'receipt', 'bill', 'quote', 'proof', 'warranty', 'other', NULL)),
  extraction_details JSONB DEFAULT '{}'::JSONB,
  page_count INTEGER,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE expense_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL UNIQUE REFERENCES expenses(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_date TIMESTAMPTZ DEFAULT NOW(),
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approval_deadline TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  request_reason TEXT,
  request_notes TEXT,
  approval_notes TEXT,
  rejected_reason TEXT,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expense_ocr_extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attachment_id UUID NOT NULL REFERENCES expense_attachments(id) ON DELETE CASCADE,
  extraction_type TEXT NOT NULL CHECK (extraction_type IN ('amount', 'date', 'vendor', 'items', 'vat', 'total', 'invoice_number', 'other')),
  extracted_value TEXT NOT NULL,
  confidence_score NUMERIC(5, 2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  field_location JSONB,
  is_manual_override BOOLEAN DEFAULT false,
  manual_value TEXT,
  manual_verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  manual_verified_at TIMESTAMPTZ,
  matched_to_field TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recurring_expense_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_recurring_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  instance_date DATE NOT NULL,
  instance_expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'created', 'skipped', 'cancelled')),
  auto_created BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE expense_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tag_name)
);

CREATE TABLE expense_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL,
  summary_type TEXT NOT NULL CHECK (summary_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  total_expenses NUMERIC(14, 2) DEFAULT 0,
  total_amount NUMERIC(14, 2) DEFAULT 0,
  total_vat NUMERIC(14, 2) DEFAULT 0,
  category_breakdown JSONB DEFAULT '{}'::JSONB,
  record_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id, summary_date, summary_type)
);

CREATE INDEX idx_expenses_user_vehicle ON expenses(user_id, vehicle_id);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_status ON expenses(approval_status);
CREATE INDEX idx_expenses_recurring ON expenses(is_recurring, parent_recurring_id);
CREATE INDEX idx_expenses_created_at ON expenses(created_at DESC);

CREATE INDEX idx_attachments_expense ON expense_attachments(expense_id);
CREATE INDEX idx_attachments_ocr_status ON expense_attachments(ocr_status);
CREATE INDEX idx_attachments_created ON expense_attachments(created_at DESC);

CREATE INDEX idx_approval_expense ON expense_approval_requests(expense_id);
CREATE INDEX idx_approval_approver ON expense_approval_requests(approver_id);
CREATE INDEX idx_approval_status ON expense_approval_requests(status);

CREATE INDEX idx_ocr_extraction_attachment ON expense_ocr_extractions(attachment_id);
CREATE INDEX idx_ocr_extraction_type ON expense_ocr_extractions(extraction_type);

CREATE INDEX idx_recurring_instances_parent ON recurring_expense_instances(parent_recurring_id);
CREATE INDEX idx_recurring_instances_date ON recurring_expense_instances(instance_date);

CREATE INDEX idx_expense_tags_user ON expense_tags(user_id);

CREATE INDEX idx_summaries_user_vehicle ON expense_summaries(user_id, vehicle_id);
CREATE INDEX idx_summaries_date ON expense_summaries(summary_date DESC);

ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_ocr_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expense_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON expense_categories FOR SELECT
  USING (true);

CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() = created_by);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own expense attachments"
  ON expense_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = expense_attachments.expense_id
      AND expenses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload to own expenses"
  ON expense_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = expense_attachments.expense_id
      AND expenses.user_id = auth.uid()
    )
    AND auth.uid() = uploaded_by
  );

CREATE POLICY "Users can delete own expense attachments"
  ON expense_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = expense_attachments.expense_id
      AND expenses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own approval requests"
  ON expense_approval_requests FOR SELECT
  USING (
    auth.uid() = requester_id
    OR auth.uid() = approver_id
  );

CREATE POLICY "Users can create approval requests"
  ON expense_approval_requests FOR INSERT
  WITH CHECK (
    auth.uid() = requester_id
    AND EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = expense_id
      AND expenses.user_id = auth.uid()
    )
  );

CREATE POLICY "Approvers can update requests"
  ON expense_approval_requests FOR UPDATE
  USING (auth.uid() = approver_id)
  WITH CHECK (auth.uid() = approver_id);

CREATE POLICY "Users can view own extractions"
  ON expense_ocr_extractions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM expense_attachments
      WHERE expense_attachments.id = expense_ocr_extractions.attachment_id
      AND EXISTS (
        SELECT 1 FROM expenses
        WHERE expenses.id = expense_attachments.expense_id
        AND expenses.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view own recurring instances"
  ON recurring_expense_instances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM expenses
      WHERE expenses.id = recurring_expense_instances.parent_recurring_id
      AND expenses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own tags"
  ON expense_tags FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own summaries"
  ON expense_summaries FOR SELECT
  USING (auth.uid() = user_id);

INSERT INTO expense_categories (category_name, expense_type, description, icon_name, color_code, is_system_defined) VALUES
('Regular Maintenance', 'maintenance', 'Oil changes, filter replacements, fluid top-ups', 'wrench', '#FF9800', true),
('Engine Repair', 'repair', 'Engine overhaul, component replacement', 'cog', '#FF5722', true),
('Portal Axle Service', 'maintenance', 'Portal axle maintenance and repairs', 'wheel', '#03A9F4', true),
('Transmission Work', 'maintenance', 'Transmission servicing and repairs', 'settings', '#2196F3', true),
('Fuel', 'fuel', 'Fuel purchases', 'gas', '#4CAF50', true),
('Insurance', 'insurance', 'Vehicle insurance premiums', 'shield', '#9C27B0', true),
('Registration', 'registration', 'Vehicle registration and licensing', 'id', '#673AB7', true),
('Modifications', 'modification', 'Performance upgrades and customizations', 'build', '#FFC107', true),
('Parts Replacement', 'parts', 'Replacement parts and components', 'package', '#00BCD4', true),
('Professional Service', 'service', 'Third-party professional services', 'briefcase', '#607D8B', true),
('Storage', 'other', 'Vehicle storage fees', 'storage', '#795548', true),
('Transport', 'other', 'Vehicle transport and towing', 'local-shipping', '#E91E63', true);

COMMIT;
