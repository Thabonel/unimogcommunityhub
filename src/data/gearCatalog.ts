/**
 * Curated Gear Catalog - Single source of truth for recommended gear.
 *
 * All primary links use Amazon Australia search URLs with the AU Associates tag.
 * No prices, no stock, no availability claims. Search-based URLs resist link rot.
 */

export const AMAZON_AU_TAG = 'wheelsandwins-22';

function amazonAuSearch(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://www.amazon.com.au/s?k=${encoded}&tag=${AMAZON_AU_TAG}`;
}

function googleSearch(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export interface GearItem {
  id: string;
  category: string;
  title: string;
  why: string;
  amazonAuSearchUrl: string;
  localSearchUrl?: string;
  /** Override for non-Amazon items (e.g. direct supplier links) */
  primaryCtaLabel?: string;
  primaryUrl?: string;
}

export const GEAR_CATEGORIES = [
  'Levelling & Stabilisation',
  'Water & Plumbing',
  'Cleaning & Protection',
  'Tools & Maintenance',
  'Toilet & Sanitation',
  'Camping & RV Accessories',
] as const;

export const gearCatalog: GearItem[] = [
  // -- Levelling & Stabilisation --
  {
    id: 'carmtek-level-ramps',
    category: 'Levelling & Stabilisation',
    title: 'RV Levelling Ramps',
    why: 'Lightweight, interlocking ramps that make levelling on uneven ground quick and easy.',
    amazonAuSearchUrl: amazonAuSearch('RV levelling ramps interlocking'),
    localSearchUrl: googleSearch('RV levelling ramps interlocking'),
  },
  {
    id: 'x-chocks',
    category: 'Levelling & Stabilisation',
    title: 'X-Chock Wheel Stabilisers',
    why: 'Eliminates rocking by wedging between dual tyres. Essential for stability when parked.',
    amazonAuSearchUrl: amazonAuSearch('X-Chock wheel stabilizer RV'),
    localSearchUrl: googleSearch('X-Chock wheel stabilizer RV'),
  },
  {
    id: 'maxxhaul-wheel-chocks',
    category: 'Levelling & Stabilisation',
    title: 'Rubber Wheel Chocks',
    why: 'Heavy-duty rubber chocks prevent rolling on inclines. A safety basic for any heavy vehicle.',
    amazonAuSearchUrl: amazonAuSearch('heavy duty rubber wheel chocks'),
    localSearchUrl: googleSearch('heavy duty rubber wheel chocks'),
  },
  {
    id: 'rv-snappads',
    category: 'Levelling & Stabilisation',
    title: 'RV Jack Pads (Snap Pads)',
    why: 'Permanently attach to levelling jacks to protect surfaces and speed up setup.',
    amazonAuSearchUrl: amazonAuSearch('RV snap pads levelling jack'),
    primaryCtaLabel: 'Visit supplier',
    primaryUrl: 'https://rvsnappad.com/discount/RVTT10',
    localSearchUrl: googleSearch('RV snap pads levelling jack pads'),
  },

  // -- Water & Plumbing --
  {
    id: 'evoflex-water-hose',
    category: 'Water & Plumbing',
    title: 'Drinking-Water-Safe RV Hose',
    why: 'Flexible, kink-resistant hose rated for potable water. No plastic taste.',
    amazonAuSearchUrl: amazonAuSearch('RV drinking water hose food safe'),
    localSearchUrl: googleSearch('RV drinking water hose food safe'),
  },
  {
    id: 'water-pressure-regulator',
    category: 'Water & Plumbing',
    title: 'Water Pressure Regulator',
    why: 'Protects your plumbing from high-pressure campground hookups. Cheap insurance.',
    amazonAuSearchUrl: amazonAuSearch('RV water pressure regulator adjustable'),
    localSearchUrl: googleSearch('RV water pressure regulator adjustable'),
  },
  {
    id: 'camco-water-filter',
    category: 'Water & Plumbing',
    title: 'Inline Water Filter',
    why: 'Filters sediment and improves taste when filling from unfamiliar sources.',
    amazonAuSearchUrl: amazonAuSearch('RV inline water filter camping'),
    localSearchUrl: googleSearch('RV inline water filter camping'),
  },
  {
    id: 'low-point-drain-valve',
    category: 'Water & Plumbing',
    title: 'Low-Point Drain Valve (Stainless)',
    why: 'Stainless steel replacement for plastic drain valves. Reliable winterisation and water system maintenance.',
    amazonAuSearchUrl: amazonAuSearch('RV low point drain valve stainless steel'),
    localSearchUrl: googleSearch('RV low point drain valve stainless steel'),
  },
  {
    id: 'winterizing-blow-out-plug',
    category: 'Water & Plumbing',
    title: 'Winterising Blow-Out Plug',
    why: 'Connects to an air compressor to clear water lines before cold storage. Prevents freeze damage.',
    amazonAuSearchUrl: amazonAuSearch('RV winterizing blow out plug water'),
    localSearchUrl: googleSearch('RV winterizing blow out plug water'),
  },

  // -- Cleaning & Protection --
  {
    id: '303-protectant',
    category: 'Cleaning & Protection',
    title: 'UV Protectant Spray (303-type)',
    why: 'Protects rubber seals, vinyl, and plastics from UV degradation. Extends the life of exterior surfaces.',
    amazonAuSearchUrl: amazonAuSearch('303 automotive UV protectant spray'),
    localSearchUrl: googleSearch('303 automotive UV protectant spray'),
  },
  {
    id: '303-protectant-bulk',
    category: 'Cleaning & Protection',
    title: 'UV Protectant (Bulk / Refill)',
    why: 'Same UV protection in a larger format. Better value for regular application across the whole vehicle.',
    amazonAuSearchUrl: amazonAuSearch('303 protectant gallon bulk refill'),
    localSearchUrl: googleSearch('303 protectant gallon bulk refill'),
  },
  {
    id: 'frost-king-coil-cleaner',
    category: 'Cleaning & Protection',
    title: 'Foaming Coil Cleaner',
    why: 'Cleans air-conditioner coils and improves cooling efficiency. Spray on, rinse off.',
    amazonAuSearchUrl: amazonAuSearch('foaming coil cleaner air conditioner'),
    localSearchUrl: googleSearch('foaming coil cleaner air conditioner'),
  },
  {
    id: 'boeshield-t9',
    category: 'Cleaning & Protection',
    title: 'Corrosion Inhibitor & Lubricant (T9-type)',
    why: 'Displaces moisture and leaves a protective film on metal surfaces. Great for locks, hinges, and exposed hardware.',
    amazonAuSearchUrl: amazonAuSearch('Boeshield T9 corrosion inhibitor lubricant'),
    localSearchUrl: googleSearch('Boeshield T9 corrosion inhibitor lubricant'),
  },
  {
    id: 'crc-electronics-cleaner',
    category: 'Cleaning & Protection',
    title: 'Electronics Contact Cleaner',
    why: 'Cleans electrical connections and switches without residue. Fixes intermittent faults fast.',
    amazonAuSearchUrl: amazonAuSearch('CRC electronics contact cleaner spray'),
    localSearchUrl: googleSearch('CRC electronics contact cleaner spray'),
  },

  // -- Tools & Maintenance --
  {
    id: 'klein-11-in-1',
    category: 'Tools & Maintenance',
    title: 'Multi-Bit Screwdriver (11-in-1)',
    why: 'One tool, eleven bits. Covers Phillips, flat, square, and Torx. Lives in the door pocket.',
    amazonAuSearchUrl: amazonAuSearch('Klein Tools 11 in 1 screwdriver multi bit'),
    localSearchUrl: googleSearch('Klein Tools 11 in 1 screwdriver multi bit'),
  },
  {
    id: 'dimmer-switch-parts',
    category: 'Tools & Maintenance',
    title: 'RV Dimmer Switch Replacement Parts',
    why: 'Common failure point in older RVs. Keep a spare to avoid a dark evening.',
    amazonAuSearchUrl: amazonAuSearch('RV 12V dimmer switch replacement'),
    localSearchUrl: googleSearch('RV 12V dimmer switch replacement'),
  },

  // -- Toilet & Sanitation --
  {
    id: 'thetford-seal-conditioner',
    category: 'Toilet & Sanitation',
    title: 'Toilet Seal Conditioner',
    why: 'Keeps the toilet blade seal supple and leak-free. Prevents the most common RV toilet issue.',
    amazonAuSearchUrl: amazonAuSearch('Thetford toilet seal conditioner lubricant'),
    localSearchUrl: googleSearch('Thetford toilet seal conditioner lubricant'),
  },
  {
    id: 'liquified-toilet-treatment',
    category: 'Toilet & Sanitation',
    title: 'Liquid Waste Tank Treatment',
    why: 'Breaks down waste and controls odour in the black tank. Use after every dump.',
    amazonAuSearchUrl: amazonAuSearch('RV liquid toilet waste tank treatment'),
    localSearchUrl: googleSearch('RV liquid toilet waste tank treatment'),
  },

  // -- Camping & RV Accessories --
  {
    id: 'command-broom-holder',
    category: 'Camping & RV Accessories',
    title: 'Adhesive Broom / Mop Holder',
    why: 'Stick-on wall holder that keeps brooms, mops, and rods secure while driving. No drilling.',
    amazonAuSearchUrl: amazonAuSearch('Command broom gripper holder adhesive'),
    localSearchUrl: googleSearch('Command broom gripper holder adhesive'),
  },
  {
    id: 'rv-screen-door-handle',
    category: 'Camping & RV Accessories',
    title: 'RV Screen Door Handle',
    why: 'Replacement handle that fits most RV screen doors. Sturdier than the factory original.',
    amazonAuSearchUrl: amazonAuSearch('RV screen door handle replacement'),
    localSearchUrl: googleSearch('RV screen door handle replacement'),
  },
  {
    id: 'paper-towel-holder',
    category: 'Camping & RV Accessories',
    title: 'Countertop Paper Towel Holder',
    why: 'Weighted base keeps it upright on the move. One-handed tear-off.',
    amazonAuSearchUrl: amazonAuSearch('weighted paper towel holder countertop'),
    localSearchUrl: googleSearch('weighted paper towel holder countertop'),
  },
];
