/**
 * Pricing Configuration
 * Base prices in AUD (Australian Dollars) - matches Stripe backend
 */

// Base pricing in AUD - this matches your Stripe configuration
export const BASE_PRICING = {
  currency: 'AUD',
  tiers: {
    monthly: {
      amount: 17,
      interval: 'month',
      description: 'Flexible monthly access to Unimog Community Hub',
      stripeProductId: 'prod_S5chYh9laoFWir', // Your existing Stripe product
    },
    annual: {
      amount: 170,
      interval: 'year', 
      description: 'Save over two months with annual billing',
      stripeProductId: 'prod_S5chYh9laoFWir', // Same product, different price
      savings: {
        amount: 34, // A$17 × 12 = A$204, but annual is A$170
        percentage: 17 // Roughly 17% savings
      }
    },
    lifetime: {
      amount: 500,
      interval: 'one-time',
      description: 'Permanent access to all features',
      stripeProductId: 'TBD', // To be created
    }
  }
} as const;

// Feature lists for each tier
export const TIER_FEATURES = {
  common: [
    'Full community access',
    'Complete knowledge base',
    'Advanced trip planning tools',
    'Barry, AI Mechanic Assistant',
    'GPX track upload and analysis',
    'Offline maps and navigation',
    'Marketplace access',
    'Vehicle management tools'
  ],
  annual: [
    ...['Full community access', 'Complete knowledge base', 'Advanced trip planning tools', 'Barry, AI Mechanic Assistant'],
    'Save over two months free!'
  ],
  lifetime: [
    ...['Full community access', 'Complete knowledge base', 'Advanced trip planning tools', 'Barry, AI Mechanic Assistant'],
    'Lifetime site access',
    'All future features included',
    'Priority support'
  ]
} as const;

// Free trial configuration
export const TRIAL_CONFIG = {
  duration: 45, // days
  description: '45-day free trial with full access',
  features: TIER_FEATURES.common
} as const;

// Currency display preferences
export const CURRENCY_DISPLAY = {
  // Show approximate symbol for converted currencies
  approximateSymbol: '~',
  
  // Rounding rules for different currencies
  roundingRules: {
    'JPY': 0, // No decimals for Yen
    'KRW': 0, // No decimals for Won
    default: 0 // Round to whole numbers for pricing
  },
  
  // Major currencies we want to support prominently
  majorCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD'],
  
  // Whether to show original AUD price as reference
  showOriginalPrice: false
} as const;

/**
 * Get the appropriate rounding for a currency
 */
export function getCurrencyRounding(currency: string): number {
  return CURRENCY_DISPLAY.roundingRules[currency as keyof typeof CURRENCY_DISPLAY.roundingRules] 
    ?? CURRENCY_DISPLAY.roundingRules.default;
}

/**
 * Check if a currency is considered "major" for display purposes
 */
export function isMajorCurrency(currency: string): boolean {
  return CURRENCY_DISPLAY.majorCurrencies.includes(currency);
}

/**
 * Get formatted savings text for annual plan
 */
export function getAnnualSavingsText(currency: string, monthlyAmount: number, annualAmount: number): string {
  const totalMonthly = monthlyAmount * 12;
  const savings = totalMonthly - annualAmount;
  const months = Math.floor(savings / monthlyAmount);
  
  if (months >= 2) {
    return `Save over ${months} months free!`;
  } else {
    return `Save ${Math.round((savings / totalMonthly) * 100)}%!`;
  }
}