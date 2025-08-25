/**
 * Exchange Rate Service
 * Handles currency conversion with caching and fallbacks
 */

interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
  date: string;
}

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
  base: string;
}

const CACHE_KEY = 'exchange_rates';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const BASE_CURRENCY = 'AUD'; // Our Stripe backend currency

// Fallback rates (approximate) in case API fails
const FALLBACK_RATES: Record<string, number> = {
  'USD': 0.65,  // 1 AUD = ~0.65 USD
  'EUR': 0.60,  // 1 AUD = ~0.60 EUR
  'GBP': 0.52,  // 1 AUD = ~0.52 GBP
  'CAD': 0.90,  // 1 AUD = ~0.90 CAD
  'NZD': 1.08,  // 1 AUD = ~1.08 NZD
  'JPY': 97,    // 1 AUD = ~97 JPY
  'AUD': 1.00,  // Base currency
};

/**
 * Get cached exchange rates if they're still valid
 */
function getCachedRates(): CachedRates | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedRates = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - data.timestamp < CACHE_DURATION) {
      console.log('📊 Using cached exchange rates', { 
        age: Math.round((now - data.timestamp) / (1000 * 60 * 60)) + 'h',
        base: data.base
      });
      return data;
    } else {
      console.log('🕐 Exchange rate cache expired, will fetch new rates');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  } catch (error) {
    console.error('Error reading cached exchange rates:', error);
    return null;
  }
}

/**
 * Cache exchange rates for future use
 */
function cacheRates(rates: Record<string, number>, base: string): void {
  try {
    const cacheData: CachedRates = {
      rates,
      timestamp: Date.now(),
      base
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('💾 Cached exchange rates for 24h', { base, currencies: Object.keys(rates).length });
  } catch (error) {
    console.error('Error caching exchange rates:', error);
  }
}

/**
 * Fetch exchange rates from API
 */
async function fetchExchangeRates(): Promise<Record<string, number> | null> {
  try {
    console.log('🌐 Fetching current exchange rates...');
    
    // Using exchangerate-api.com (free tier: 1,500 requests/month)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: ExchangeRateResponse = await response.json();
    
    console.log('✅ Exchange rates fetched successfully', { 
      base: data.base, 
      date: data.date,
      currencies: Object.keys(data.rates).length 
    });
    
    // Cache the rates
    cacheRates(data.rates, data.base);
    
    return data.rates;
  } catch (error) {
    console.error('❌ Failed to fetch exchange rates:', error);
    return null;
  }
}

/**
 * Get exchange rates with caching and fallbacks
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  // Try cached rates first
  const cached = getCachedRates();
  if (cached) {
    return cached.rates;
  }

  // Try to fetch fresh rates
  const freshRates = await fetchExchangeRates();
  if (freshRates) {
    return freshRates;
  }

  // Fall back to hardcoded rates
  console.warn('⚠️ Using fallback exchange rates - API unavailable');
  return FALLBACK_RATES;
}

/**
 * Convert an amount from AUD to target currency
 */
export async function convertFromAUD(
  audAmount: number, 
  targetCurrency: string
): Promise<number> {
  if (targetCurrency === 'AUD') {
    return audAmount;
  }

  const rates = await getExchangeRates();
  const rate = rates[targetCurrency];
  
  if (!rate) {
    console.warn(`⚠️ No exchange rate found for ${targetCurrency}, using AUD`);
    return audAmount;
  }

  const converted = audAmount * rate;
  console.log(`💱 Converted A$${audAmount} → ${targetCurrency} ${converted.toFixed(2)}`);
  
  return converted;
}

/**
 * Convert an amount between any two currencies
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rates = await getExchangeRates();
  
  // Convert to AUD first (our base currency), then to target
  let audAmount = amount;
  if (fromCurrency !== 'AUD') {
    const fromRate = rates[fromCurrency];
    if (!fromRate) {
      console.warn(`⚠️ No exchange rate found for ${fromCurrency}`);
      return amount;
    }
    audAmount = amount / fromRate;
  }
  
  // Now convert from AUD to target currency
  if (toCurrency === 'AUD') {
    return audAmount;
  }
  
  const toRate = rates[toCurrency];
  if (!toRate) {
    console.warn(`⚠️ No exchange rate found for ${toCurrency}`);
    return amount;
  }
  
  const converted = audAmount * toRate;
  console.log(`💱 Converted ${amount} ${fromCurrency} → ${converted.toFixed(2)} ${toCurrency}`);
  
  return converted;
}

/**
 * Convert multiple AUD amounts to target currency
 */
export async function convertMultipleFromAUD(
  audAmounts: number[],
  targetCurrency: string
): Promise<number[]> {
  if (targetCurrency === 'AUD') {
    return audAmounts;
  }

  const rates = await getExchangeRates();
  const rate = rates[targetCurrency];
  
  if (!rate) {
    console.warn(`⚠️ No exchange rate found for ${targetCurrency}, using AUD`);
    return audAmounts;
  }

  return audAmounts.map(amount => amount * rate);
}

/**
 * Get a formatted display string showing approximate conversion
 */
export function getConversionIndicator(fromCurrency: string, toCurrency: string): string {
  if (fromCurrency === toCurrency) {
    return '';
  }
  return ' (~)'; // Indicates approximate conversion
}

/**
 * Clear the exchange rate cache (useful for testing)
 */
export function clearExchangeRateCache(): void {
  localStorage.removeItem(CACHE_KEY);
  console.log('🗑️ Exchange rate cache cleared');
}