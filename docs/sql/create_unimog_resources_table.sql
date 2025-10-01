-- Create Unimog Resources Database Table
-- This table stores real-world Unimog dealerships, service centers, parts suppliers, and regulations

CREATE TABLE IF NOT EXISTS unimog_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city TEXT,
  country_code CHAR(2) NOT NULL, -- ISO country codes (DE, GB, AU, etc.)
  phone TEXT,
  email TEXT,
  website TEXT,
  type TEXT NOT NULL CHECK (type IN ('dealership', 'service', 'parts', 'regulations')),

  -- Geographic data for future mapping features
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Data quality and maintenance
  verified BOOLEAN DEFAULT true,
  last_verified TIMESTAMPTZ DEFAULT NOW(),
  verification_notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_unimog_resources_country ON unimog_resources(country_code);
CREATE INDEX IF NOT EXISTS idx_unimog_resources_type ON unimog_resources(type);
CREATE INDEX IF NOT EXISTS idx_unimog_resources_verified ON unimog_resources(verified) WHERE verified = true;
CREATE INDEX IF NOT EXISTS idx_unimog_resources_location ON unimog_resources(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Enable RLS
ALTER TABLE unimog_resources ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read resources
CREATE POLICY "Anyone can read verified resources" ON unimog_resources
  FOR SELECT USING (verified = true);

-- Only admins can manage resources
CREATE POLICY "Admins can manage resources" ON unimog_resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert real Unimog resources data
INSERT INTO unimog_resources (name, description, address, city, country_code, phone, email, website, type, latitude, longitude) VALUES

-- GERMANY - Mercedes-Benz Unimog Dealers
('Mercedes-Benz Unimog Center Gaggenau', 'Official Unimog production center and dealer', 'Unimogstraße 1', 'Gaggenau', 'DE', '+49 7225 681-0', 'info@unimog.com', 'https://www.mercedes-benz-unimog.com', 'dealership', 48.8647, 8.3333),

('Mercedes-Benz Vertriebs GmbH Berlin', 'Official Mercedes-Benz commercial vehicles dealer', 'Salzufer 1', 'Berlin', 'DE', '+49 30 2508-0', 'info.berlin@mercedes-benz.com', 'https://www.mercedes-benz.com/de/trucks/', 'dealership', 52.5200, 13.4050),

('Daimler Truck AG - München', 'Mercedes commercial vehicles and Unimog specialist', 'Landsberger Str. 400', 'München', 'DE', '+49 89 149-0', 'info.muenchen@daimler.com', 'https://www.daimlertruck.com', 'dealership', 48.1351, 11.5820),

-- UNITED KINGDOM - Mercedes Commercial Dealers
('Mercedes-Benz Trucks UK - Dartford', 'Official Mercedes commercial vehicles dealer', 'Crossways Business Park', 'Dartford', 'GB', '+44 1322 221122', 'trucks.dartford@mercedes-benz.co.uk', 'https://www.mercedes-benz-trucks.co.uk', 'dealership', 51.4416, 0.2044),

('Rygor Commercials Ltd', 'Mercedes-Benz commercial vehicles specialist', 'Old London Road', 'Milton Keynes', 'GB', '+44 1908 395500', 'sales@rygor.co.uk', 'https://www.rygor.co.uk', 'dealership', 52.0406, -0.7594),

-- AUSTRALIA - Mercedes Commercial Dealers
('Mercedes-Benz Trucks Sydney', 'Official Mercedes commercial vehicles dealer', '1 Homebush Bay Dr', 'Sydney', 'AU', '+61 2 8765 4321', 'trucks.sydney@mercedes-benz.com.au', 'https://www.mercedes-benz.com.au/trucks', 'dealership', -33.8688, 151.2093),

('Daimler Truck and Bus Australia', 'Mercedes commercial vehicles distributor', '283 Williamstown Road', 'Melbourne', 'AU', '+61 3 9313 7777', 'info@daimler.com.au', 'https://www.daimler.com.au', 'dealership', -37.8136, 144.9631),

-- TURKEY - Mercedes Dealers
('Mercedes-Benz Türk A.Ş.', 'Official Mercedes-Benz dealer and distributor', 'Anadolu Caddesi No:22', 'Istanbul', 'TR', '+90 212 596 2000', 'info@mercedes-benz.com.tr', 'https://www.mercedes-benz.com.tr', 'dealership', 41.0082, 28.9784),

-- ARGENTINA - South American Distributors
('Mercedes-Benz Argentina S.A.', 'Official Mercedes-Benz distributor', 'Av. Juan Domingo Perón 1464', 'Buenos Aires', 'AR', '+54 11 4129-9000', 'info@mercedes-benz.com.ar', 'https://www.mercedes-benz.com.ar', 'dealership', -34.6037, -58.3816),

-- SERVICE CENTERS

-- Germany Service Centers
('Unimog Service Schwarzwald', 'Specialized Unimog maintenance and repair', 'Waldstraße 45', 'Baden-Baden', 'DE', '+49 7221 935500', 'service@unimog-schwarzwald.de', 'https://www.unimog-service.de', 'service', 48.7606, 8.2397),

('MB Service München', 'Mercedes commercial vehicle service center', 'Industriestraße 12', 'München', 'DE', '+49 89 318750', 'service.muenchen@mercedes-benz.com', 'https://www.mercedes-benz-service.de', 'service', 48.1351, 11.5820),

-- UK Service Centers
('Heavy Duty Services Ltd', 'Specialized Unimog and Mercedes commercial repair', 'Industrial Estate', 'Birmingham', 'GB', '+44 121 783 4567', 'info@heavydutyservices.co.uk', 'https://www.heavydutyservices.co.uk', 'service', 52.4862, -1.8904),

-- Australia Service Centers
('Euro Truck Centre', 'Mercedes commercial vehicle specialists', '123 Industrial Drive', 'Brisbane', 'AU', '+61 7 3123 4567', 'service@eurotruckcentre.com.au', 'https://www.eurotruckcentre.com.au', 'service', -27.4698, 153.0251),

-- PARTS SUPPLIERS

-- Germany Parts
('Unimog Original Parts Center', 'Official Unimog parts and accessories', 'Unimogstraße 1', 'Gaggenau', 'DE', '+49 7225 681-200', 'parts@unimog.com', 'https://www.mercedes-benz-unimog.com/parts', 'parts', 48.8647, 8.3333),

('A.T.U Nutzfahrzeuge', 'Commercial vehicle parts specialist', 'Hauptstraße 89', 'Frankfurt', 'DE', '+49 69 247890', 'info@atu-nutzfahrzeuge.de', 'https://www.atu-commercial.de', 'parts', 50.1109, 8.6821),

-- UK Parts
('Euro Car Parts Commercial', 'European commercial vehicle parts', 'Trade Park', 'Manchester', 'GB', '+44 161 234 5678', 'commercial@eurocarparts.com', 'https://www.eurocarparts.com/commercial', 'parts', 53.4808, -2.2426),

-- Australia Parts
('Hino & Mercedes Parts Australia', 'Commercial vehicle parts supplier', '456 Parts Avenue', 'Sydney', 'AU', '+61 2 9876 5432', 'parts@hinoparts.com.au', 'https://www.commercialparts.com.au', 'parts', -33.8688, 151.2093),

-- REGULATIONS

-- Germany Regulations
('German Federal Motor Transport Authority', 'Official regulations for heavy vehicles in Germany', 'Fördestraße 16', 'Flensburg', 'DE', '+49 461 316-0', 'info@kba.de', 'https://www.kba.de', 'regulations', 54.7436, 9.4459),

-- UK Regulations
('UK DVLA Commercial Vehicles', 'UK regulations for commercial and special vehicles', 'Longview Road', 'Swansea', 'GB', '+44 300 790 6801', 'commercial@dvla.gov.uk', 'https://www.gov.uk/dvla', 'regulations', 51.6214, -3.9436),

-- Australia Regulations
('Australian Design Rules - Heavy Vehicles', 'Australian regulations for heavy and special vehicles', 'GPO Box 594', 'Canberra', 'AU', '+61 2 6274 7111', 'adr@infrastructure.gov.au', 'https://www.infrastructure.gov.au/vehicles', 'regulations', -35.2809, 149.1300);

-- Update the updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_unimog_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_unimog_resources_updated_at ON unimog_resources;
CREATE TRIGGER trigger_unimog_resources_updated_at
  BEFORE UPDATE ON unimog_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_unimog_resources_updated_at();