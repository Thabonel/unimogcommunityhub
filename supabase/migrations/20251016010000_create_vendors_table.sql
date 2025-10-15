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

INSERT INTO vendors (slug, business_name, tagline, description, location, website_url, is_verified, is_featured, display_order, specialties, products, portfolio_images) VALUES
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
    ARRAY['Unimog Parts', 'Recovery Gear', 'Custom Fabrication', 'Expedition Accessories', 'Off-road Equipment'],
    '[
      {
        "name": "24V MIG Welder",
        "price": "850.00",
        "currency": "AUD",
        "description": "Professional 24V MIG welder in protective case. Perfect for on-the-go repairs and fabrication work.",
        "category": "Tools & Equipment",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=24V+MIG+Welder"
      },
      {
        "name": "U1700 Aircon Kit",
        "price": "1650.00",
        "currency": "AUD",
        "description": "Complete air conditioning system kit for U1700 models. Includes all components for professional installation.",
        "category": "Climate Control",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=U1700+Aircon+Kit"
      },
      {
        "name": "Unimog Glovebox Lid Organisers",
        "price": "115.00",
        "currency": "AUD",
        "description": "Custom-fitted glovebox lid organizers. Keep your tools and essentials secure and organized.",
        "category": "Storage Solutions",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=Glovebox+Organisers"
      },
      {
        "name": "Rapid Tyre Inflation Kit",
        "price": "1095.00",
        "currency": "AUD",
        "description": "High-performance tyre inflation system with gauges and fittings. Essential for off-road adventures.",
        "category": "Recovery & Safety",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=Tyre+Inflation+Kit"
      },
      {
        "name": "Cup and UE Speaker Mount",
        "price": "85.00",
        "currency": "AUD",
        "description": "Dual-purpose mount for cup holder and UE speaker. Secure mounting for your cab essentials.",
        "category": "Interior Accessories",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=Speaker+Mount"
      },
      {
        "name": "Unimog Rear Winch Plate",
        "price": "1050.00",
        "currency": "AUD",
        "description": "Heavy-duty rear winch mounting plate. Engineered for maximum strength and reliability.",
        "category": "Winch Systems",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=Rear+Winch+Plate"
      },
      {
        "name": "Unimog Front Winch Plate",
        "price": "1050.00",
        "currency": "AUD",
        "description": "Front winch mounting plate with integrated recovery points. Premium steel construction.",
        "category": "Winch Systems",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=Front+Winch+Plate"
      },
      {
        "name": "Unimog Alternator Conversion Kit",
        "price": "1450.00",
        "currency": "AUD",
        "description": "Complete alternator conversion kit for upgraded electrical system performance.",
        "category": "Electrical Systems",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=Alternator+Kit"
      },
      {
        "name": "Unimog Slide-out Kitchen",
        "price": "4500.00",
        "currency": "AUD",
        "description": "Full slide-out kitchen system with storage and workspace. Perfect for expedition camping.",
        "category": "Expedition Equipment",
        "image": "https://placehold.co/600x400/2d5016/ffffff?text=Slide-out+Kitchen"
      }
    ]'::jsonb,
    '[
      "https://placehold.co/800x600/2d5016/ffffff?text=Workshop+1",
      "https://placehold.co/800x600/2d5016/ffffff?text=Workshop+2",
      "https://placehold.co/800x600/2d5016/ffffff?text=Custom+Fabrication",
      "https://placehold.co/800x600/2d5016/ffffff?text=Installed+Products",
      "https://placehold.co/800x600/2d5016/ffffff?text=Unimog+Parts",
      "https://placehold.co/800x600/2d5016/ffffff?text=Quality+Guarantee"
    ]'::jsonb
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
