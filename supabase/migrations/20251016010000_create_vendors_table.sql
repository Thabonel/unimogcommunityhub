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

INSERT INTO vendors (slug, business_name, tagline, description, location, is_verified, is_featured, display_order, specialties) VALUES
  (
    'sam-keck-fabrication',
    'Sam Keck Fabrication',
    'Custom fabrication specialists for Unimog expedition builds',
    'Sam Keck Fabrication specializes in custom-built roof racks, bull bars, and roll cages designed specifically for Mercedes Unimog vehicles. With over 15 years of experience in expedition vehicle fabrication, Sam and his team create premium quality products that combine functionality with durability. Every piece is hand-crafted in Australia and built to withstand the harshest off-road conditions.',
    'Australia',
    true,
    true,
    1,
    ARRAY['Roof Racks', 'Bull Bars', 'Roll Cages', 'Custom Fabrication', 'Expedition Equipment']
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
