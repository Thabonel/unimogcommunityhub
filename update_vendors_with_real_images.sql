-- Update Sam Keck Fabrication to Overland Mogs with REAL uploaded product photos
UPDATE vendors
SET
  slug = 'overland-mogs',
  business_name = 'Overland Mogs',
  tagline = 'Premium Unimog parts and accessories supplier',
  description = 'Overland Mogs is Australia''s trusted supplier of premium parts and accessories for Mercedes Unimog vehicles. Specializing in expedition-grade equipment, custom fabrication, and hard-to-find Unimog parts, they serve the overlanding and off-road community with quality products and expert knowledge. From recovery gear to custom modifications, Overland Mogs has everything you need to build and maintain your adventure-ready Unimog.',
  website_url = 'https://www.overlandmogs.com.au',
  email = 'info@overlandmogs.com.au',
  location = 'Australia',
  specialties = ARRAY['Unimog Parts', 'Recovery Gear', 'Custom Fabrication', 'Expedition Accessories', 'Off-road Equipment'],
  products = '[
    {
      "name": "24V MIG Welder",
      "price": "850.00",
      "currency": "AUD",
      "description": "Professional 24V MIG welder in protective case. Perfect for on-the-go repairs and fabrication work.",
      "category": "Tools & Equipment",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/welder.avif"
    },
    {
      "name": "U1700 Aircon Kit",
      "price": "1650.00",
      "currency": "AUD",
      "description": "Complete air conditioning system kit for U1700 models. Includes all components for professional installation.",
      "category": "Climate Control",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/aircon.avif"
    },
    {
      "name": "Unimog Glovebox Lid Organisers",
      "price": "115.00",
      "currency": "AUD",
      "description": "Custom-fitted glovebox lid organizers. Keep your tools and essentials secure and organized.",
      "category": "Storage Solutions",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/glovebox.avif"
    },
    {
      "name": "Rapid Tyre Inflation Kit",
      "price": "1095.00",
      "currency": "AUD",
      "description": "High-performance tyre inflation system with gauges and fittings. Essential for off-road adventures.",
      "category": "Recovery & Safety",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/tyre%20inflater.avif"
    },
    {
      "name": "Cup and UE Speaker Mount",
      "price": "85.00",
      "currency": "AUD",
      "description": "Dual-purpose mount for cup holder and UE speaker. Secure mounting for your cab essentials.",
      "category": "Interior Accessories",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/cup%20holder.avif"
    },
    {
      "name": "Unimog Rear Winch Plate",
      "price": "1050.00",
      "currency": "AUD",
      "description": "Heavy-duty rear winch mounting plate. Engineered for maximum strength and reliability.",
      "category": "Winch Systems",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/rear%20winch%20plate.avif"
    },
    {
      "name": "Unimog Front Winch Plate",
      "price": "1050.00",
      "currency": "AUD",
      "description": "Front winch mounting plate with integrated recovery points. Premium steel construction.",
      "category": "Winch Systems",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/front%20winch%20plate.avif"
    },
    {
      "name": "Unimog Alternator Conversion Kit",
      "price": "1450.00",
      "currency": "AUD",
      "description": "Complete alternator conversion kit for upgraded electrical system performance.",
      "category": "Electrical Systems",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/alternator%20kit.avif"
    },
    {
      "name": "Unimog Slide-out Kitchen",
      "price": "4500.00",
      "currency": "AUD",
      "description": "Full slide-out kitchen system with storage and workspace. Perfect for expedition camping.",
      "category": "Expedition Equipment",
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/kitchen.avif"
    }
  ]'::jsonb,
  portfolio_images = '[
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/welder.avif",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/aircon.avif",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/front%20winch%20plate.avif",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/rear%20winch%20plate.avif",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/kitchen.avif",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/alternator%20kit.avif"
  ]'::jsonb
WHERE slug = 'sam-keck-fabrication';

-- Update Byond RV with complete information, specs, and uploaded images
UPDATE vendors
SET
  website_url = 'https://beyondrv.com.au',
  email = 'info@beyondrv.com.au',
  phone = '0430 863 819',
  location = 'Australia',
  logo_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/beyondlogo-1024x1024.jpg',
  hero_image_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/Unimog%20Side%20on%20Camper.png',
  description = 'Byond RV manufactures industry-leading slide-on campers specifically designed for Unimog platforms. Our innovative 15ft truck camper combines premium materials, custom layouts, and proven reliability in extreme conditions worldwide. Featuring full composite construction with no wood or plywood, 3000w inverter system, TRUMA diesel heating, and luxury amenities including a 32" smart TV and reverse cycle air conditioning. With 5 years manufacturer warranty and Australian gas certification, our campers are built for serious expedition travel.',
  products = '[
    {
      "name": "15ft Unimog Truck Camper",
      "price": "Contact for Quote",
      "currency": "AUD",
      "description": "Premium slide-on camper with full composite construction, 200Ah lithium battery, solar panels, reverse cycle air con, and luxury amenities. Size: 5550 x 2050 x 2750mm. ATM: 2420kg.",
      "category": "Expedition Campers",
      "specs": {
        "dimensions": "5550 x 2050 x 2750mm",
        "atm": "2420kg",
        "gtm": "2260kg",
        "tare": "2000kg",
        "ball_weight": "160kg",
        "water_capacity": "100L fresh + 45L grey",
        "power": "3000w inverter, 200Ah lithium, 340w solar",
        "warranty": "5 years manufacturer warranty"
      },
      "features": [
        "Full composite construction - no wood or plywood",
        "TRUMA diesel air/water heater",
        "3000w inverter with 200Ah lithium battery",
        "340w solar panels with MPPT regulator",
        "TRUMA Aventa reverse cycle air conditioner",
        "175L twin-door fridge/freezer",
        "32 inch wall mounted smart TV",
        "Rear raised queen sized bed with innerspring mattress",
        "Cafe style lounge with quality upholstery",
        "Combined shower/toilet with stainless steel tray",
        "Dupont Corian stone benchtop",
        "Fiamma awning",
        "Double glazed windows",
        "Australian gas certification",
        "Happijac electric legs with remote"
      ],
      "image": "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/Unimog%20Side%20on%20Camper.png"
    }
  ]'::jsonb,
  portfolio_images = '[
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/20240306_175246-768x1365.jpg",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/20240306_175258-768x1365.jpg",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/20240306_175303-768x1365.jpg",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/20240306_175312-768x1365.jpg",
    "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/20240306_175319-768x1365.jpg"
  ]'::jsonb
WHERE slug = 'byond-rv';
