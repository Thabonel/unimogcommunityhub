/**
 * Affiliate Product Detection Service
 * Detects opportunities to recommend affiliate products based on user queries
 */

export interface ProductOpportunity {
  category: string;
  keywords: string[];
  intent: 'replace' | 'install' | 'purchase' | 'research';
}

export function detectProductOpportunity(query: string): ProductOpportunity | null {
  const text = query.toLowerCase();

  // Recovery gear opportunities
  if (/(?:winch|recovery|stuck|pull|tow|strap|rope|shackle|snatch)/i.test(text)) {
    return {
      category: 'recovery_gear',
      keywords: ['winch', 'recovery gear', 'tow strap', 'shackle', 'snatch block'],
      intent: 'purchase'
    };
  }

  // Tools and maintenance opportunities
  if (/(?:tool|wrench|socket|repair|maintenance|fix|replace|install)/i.test(text)) {
    return {
      category: 'tools_maintenance',
      keywords: ['socket set', 'torque wrench', 'diagnostic tool', 'multimeter'],
      intent: 'replace'
    };
  }

  // Parts and upgrades
  if (/(?:filter|oil|brake|clutch|bearing|seal|gasket|parts?)/i.test(text)) {
    return {
      category: 'parts_upgrades',
      keywords: ['oil filter', 'air filter', 'brake pads', 'hydraulic fluid'],
      intent: 'replace'
    };
  }

  // Camping and expedition gear
  if (/(?:camp|expedition|sleep|tent|cook|fridge|water|solar)/i.test(text)) {
    return {
      category: 'camping_expedition',
      keywords: ['portable fridge', 'solar panel', 'water tank', 'camping gear'],
      intent: 'purchase'
    };
  }

  // Electronics and navigation
  if (/(?:gps|radio|antenna|battery|charger|inverter|electric)/i.test(text)) {
    return {
      category: 'electronics',
      keywords: ['GPS navigator', 'two-way radio', 'power inverter', 'battery charger'],
      intent: 'purchase'
    };
  }

  // Books and manuals (beyond what's already in Barry)
  if (/(?:book|guide|manual|learn|how.*to|reference)/i.test(text)) {
    return {
      category: 'books_manuals',
      keywords: ['Unimog manual', 'off-road guide', 'expedition handbook'],
      intent: 'research'
    };
  }

  // Outdoor gear
  if (/(?:jacket|boot|glove|helmet|safety|protection|clothing)/i.test(text)) {
    return {
      category: 'outdoor_gear',
      keywords: ['work boots', 'safety jacket', 'mechanic gloves', 'helmet'],
      intent: 'purchase'
    };
  }

  return null;
}

export function generateAffiliateContext(products: any[], opportunity: ProductOpportunity): string {
  if (!products.length) return '';

  const contextLines = [
    `\n=== RECOMMENDED PRODUCTS (${opportunity.category.toUpperCase()}) ===`,
    `Based on your ${opportunity.intent} query, here are some relevant products:\n`
  ];

  products.slice(0, 3).forEach((product, index) => {
    contextLines.push(
      `${index + 1}. ${product.title}`,
      `   Price: ${product.currency || 'USD'} ${product.price || 'Price varies'}`,
      `   ${product.short_description || product.description || ''}`,
      `   Link: ${product.affiliate_url}`,
      ''
    );
  });

  contextLines.push(
    '=== INTEGRATION INSTRUCTIONS ===',
    'When mentioning these products in your response:',
    '1. Only recommend if genuinely relevant to the query',
    '2. Mention specific benefits for Unimog use',
    '3. Include price and purchasing information naturally',
    '4. Use affiliate links provided above',
    '5. Be helpful, not pushy - focus on solving their problem first',
    ''
  );

  return contextLines.join('\n');
}

export function detectPurchaseIntent(query: string): boolean {
  const purchaseKeywords = [
    'buy', 'purchase', 'need', 'looking for', 'recommend', 'best',
    'where to get', 'shop', 'store', 'price', 'cost', 'budget',
    'cheap', 'expensive', 'quality', 'brand', 'review'
  ];

  return purchaseKeywords.some(keyword =>
    query.toLowerCase().includes(keyword)
  );
}