CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  business_name text NOT NULL,
  tagline text,
  description text,
  logo_url text,
  hero_image_url text,
  website_url text,
  email text,
  phone text,
  location text,
  is_verified boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  products jsonb DEFAULT '[]'::jsonb,
  portfolio_images jsonb DEFAULT '[]'::jsonb,
  social_links jsonb DEFAULT '{}'::jsonb,
  specialties text[],
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_vendors_slug ON vendors(slug);
CREATE INDEX idx_vendors_featured ON vendors(is_featured);
CREATE INDEX idx_vendors_verified ON vendors(is_verified);

INSERT INTO vendors (slug, business_name, tagline, description, location, website_url, is_verified, is_featured, display_order, specialties) VALUES
  (
    'overland-mogs',
    'Overland Mogs',
    'Premium Unimog parts and accessories supplier',
    'Overland Mogs is Australia''s trusted supplier of premium parts and accessories for Mercedes Unimog vehicles. Specializing in expedition-grade equipment, custom fabrication, and hard-to-find Unimog parts, they serve the overlanding and off-road community with quality products and expert knowledge. From recovery gear to custom modifications, Overland Mogs has everything you need to build and maintain your adventure-ready Unimog.',
    'Australia',
    'https://www.overlandmogs.com.au',
    true,
    true,
    1,
    ARRAY['Unimog Parts', 'Recovery Gear', 'Custom Fabrication', 'Expedition Accessories', 'Off-road Equipment']
  ),
  (
    'byond-rv',
    'Byond RV',
    'Premium slide-on campers built for adventure',
    'Byond RV manufactures industry-leading slide-on campers specifically designed for Unimog platforms. Their innovative designs maximize living space while maintaining the agility and off-road capability that Unimog owners demand. Each camper features premium materials, custom layouts, and proven reliability in extreme conditions worldwide.',
    'Australia',
    true,
    true,
    2,
    ARRAY['Slide-on Campers', 'Expedition Campers', 'Custom Interiors', 'Off-road Living']
  )
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors are viewable by everyone"
  ON vendors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage vendors"
  ON vendors
  FOR ALL
  USING (check_admin_access());
