-- Fix Overland Mogs with hero image and real product photos
UPDATE vendors
SET
  hero_image_url = 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/vendors/Overland%20Mogs%20Hero.avif',
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
WHERE slug = 'overland-mogs';
