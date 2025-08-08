
/**
 * Utility functions for currency-related operations
 */

// Mapping of country codes to their default currencies
export const countryToCurrency: Record<string, string> = {
  'AU': 'AUD', // Australia
  'US': 'USD', // United States
  'CA': 'CAD', // Canada
  'GB': 'GBP', // United Kingdom
  'DE': 'EUR', // Germany
  'FR': 'EUR', // France
  'NZ': 'NZD', // New Zealand
  'JP': 'JPY', // Japan
  'IN': 'INR', // India
  'BR': 'BRL', // Brazil
  'ZA': 'ZAR', // South Africa
  // Add more mappings as needed
};

// Common currency symbols for display purposes
export const currencySymbols: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'AUD': 'A$',
  'CAD': 'C$',
  'NZD': 'NZ$',
  'INR': '₹',
  'BRL': 'R$',
  'ZAR': 'R',
};

/**
 * Get the default currency for a country based on its ISO code
 * @param countryCode ISO country code (e.g., 'US', 'AU')
 * @returns The ISO 4217 currency code, defaults to 'USD' if not found
 */
export function getCurrencyFromCountry(countryCode: string): string {
  if (!countryCode) return 'USD';
  return countryToCurrency[countryCode.toUpperCase()] || 'USD';
}

/**
 * Get the currency symbol for a currency code
 * @param currencyCode ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @returns The currency symbol, defaults to '$' if not found
 */
export function getCurrencySymbol(currencyCode: string): string {
  if (!currencyCode) return '$';
  return currencySymbols[currencyCode] || '$';
}

/**
 * Format an amount based on currency
 * @param amount The monetary amount
 * @param currencyCode ISO 4217 currency code
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const symbol = getCurrencySymbol(currencyCode);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'symbol',
  }).format(amount);
}
