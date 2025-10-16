CREATE TABLE IF NOT EXISTS rps_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  niin VARCHAR(12) UNIQUE NOT NULL,
  nsn VARCHAR(16),
  group_code VARCHAR(3) NOT NULL,
  item_number VARCHAR(3) NOT NULL,
  description TEXT NOT NULL,
  rps_number VARCHAR(5) NOT NULL,
  quantity INT,
  repair_grade CHAR(1) CHECK (repair_grade IN ('L', 'M', 'H')),
  page_number INT,
  chunk_file VARCHAR(100),
  vehicle_model VARCHAR(100),
  figure_reference VARCHAR(10),
  callout VARCHAR(10),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rps_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rps_number VARCHAR(5) NOT NULL,
  group_code VARCHAR(3) NOT NULL,
  group_name TEXT NOT NULL,
  total_parts INT DEFAULT 0,
  page_start INT,
  page_end INT,
  chunk_file VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rps_number, group_code)
);

CREATE TABLE IF NOT EXISTS rps_illustrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rps_number VARCHAR(5) NOT NULL,
  group_code VARCHAR(3) NOT NULL,
  figure_number VARCHAR(10) NOT NULL,
  description TEXT,
  page_number INT,
  callouts JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(rps_number, group_code, figure_number)
);

CREATE INDEX IF NOT EXISTS idx_rps_parts_niin ON rps_parts(niin);
CREATE INDEX IF NOT EXISTS idx_rps_parts_group ON rps_parts(group_code);
CREATE INDEX IF NOT EXISTS idx_rps_parts_rps_number ON rps_parts(rps_number);
CREATE INDEX IF NOT EXISTS idx_rps_parts_description ON rps_parts USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_rps_groups_code ON rps_groups(group_code);
CREATE INDEX IF NOT EXISTS idx_rps_groups_rps_number ON rps_groups(rps_number);
CREATE INDEX IF NOT EXISTS idx_rps_illustrations_group ON rps_illustrations(group_code);
CREATE INDEX IF NOT EXISTS idx_rps_illustrations_figure ON rps_illustrations(figure_number);

COMMENT ON TABLE rps_parts IS 'RPS parts catalog with NIIN, descriptions, and cross-references';
COMMENT ON TABLE rps_groups IS 'RPS group metadata (AA, AB, AC, etc.) with page ranges';
COMMENT ON TABLE rps_illustrations IS 'RPS figure illustrations with callout mappings';
COMMENT ON COLUMN rps_parts.niin IS 'National Item Identification Number (format: XX-XXX-XXXX)';
COMMENT ON COLUMN rps_parts.nsn IS 'National Stock Number (format: XXXX-XX-XXX-XXXX)';
COMMENT ON COLUMN rps_parts.repair_grade IS 'Repair complexity: L (Light), M (Medium), H (Heavy)';
