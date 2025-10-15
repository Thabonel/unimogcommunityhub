-- Update Sam Keck Fabrication to Overland Mogs with full product catalog
UPDATE vendors
SET
  slug = 'overland-mogs',
  business_name = 'Overland Mogs',
  tagline = 'Premium Unimog parts and accessories supplier',
  description = 'Overland Mogs is Australia''s trusted supplier of premium parts and accessories for Mercedes Unimog vehicles. Specializing in expedition-grade equipment, custom fabrication, and hard-to-find Unimog parts, they serve the overlanding and off-road community with quality products and expert knowledge. From recovery gear to custom modifications, Overland Mogs has everything you need to build and maintain your adventure-ready Unimog.',
  website_url = 'https://www.overlandmogs.com.au',
  specialties = ARRAY['Unimog Parts', 'Recovery Gear', 'Custom Fabrication', 'Expedition Accessories', 'Off-road Equipment'],
  products = '[
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
  portfolio_images = '[
    "https://placehold.co/800x600/2d5016/ffffff?text=Workshop+1",
    "https://placehold.co/800x600/2d5016/ffffff?text=Workshop+2",
    "https://placehold.co/800x600/2d5016/ffffff?text=Custom+Fabrication",
    "https://placehold.co/800x600/2d5016/ffffff?text=Installed+Products",
    "https://placehold.co/800x600/2d5016/ffffff?text=Unimog+Parts",
    "https://placehold.co/800x600/2d5016/ffffff?text=Quality+Guarantee"
  ]'::jsonb
WHERE slug = 'sam-keck-fabrication';

-- Update Byond RV with website and hero image
UPDATE vendors
SET
  website_url = 'https://beyondrv.com.au',
  hero_image_url = 'https://beyondrv.com.au/wp-content/uploads/2024/01/Beyond-RV-Unimog-Camper-Side-View.jpg'
WHERE slug = 'byond-rv';
