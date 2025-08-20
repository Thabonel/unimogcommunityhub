/**
 * Currency Pricing Hook
 * Combines location detection, currency conversion, and pricing display
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUserLocationWithCurrency } from './use-user-location-with-currency';
import { convertMultipleFromAUD } from '@/services/exchangeRateService';
import { formatCurrency } from '@/utils/currencyUtils';

// Base pricing in AUD (your Stripe backend currency)
export const BASE_PRICING_AUD = {
  monthly: 17,
  annual: 170,
  lifetime: 500
} as const;

export interface PricingTier {
  name: string;
  amount: number;
  originalAmount: number; // Always in AUD
  currency: string;
  interval?: string;
  formattedPrice: string;
  isConverted: boolean; // Whether this is a converted price
}

interface UseCurrencyPricingResult {
  pricing: {
    monthly: PricingTier;
    annual: PricingTier;
    lifetime: PricingTier;
  };
  userCurrency: string;
  userCountry: string | undefined;
  isLoading: boolean;
  error: string | null;
  refreshPricing: () => Promise<void>;
  setPricingCurrency: (currency: string) => void;
}

export function useCurrencyPricing(): UseCurrencyPricingResult {
  const { location, isLoading: locationLoading, getLocationWithCurrency } = useUserLocationWithCurrency();
  const [manualCurrency, setManualCurrency] = useState<string | null>(null);
  const [convertedPricing, setConvertedPricing] = useState<{
    monthly: number;
    annual: number;
    lifetime: number;
  } | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine which currency to use
  const activeCurrency = useMemo(() => {
    return manualCurrency || location?.currency || 'USD';
  }, [manualCurrency, location?.currency]);

  // Function to convert all pricing to target currency
  const convertPricing = useCallback(async (targetCurrency: string) => {
    if (targetCurrency === 'AUD') {
      setConvertedPricing({
        monthly: BASE_PRICING_AUD.monthly,
        annual: BASE_PRICING_AUD.annual,
        lifetime: BASE_PRICING_AUD.lifetime
      });
      return;
    }

    try {
      setIsConverting(true);
      setError(null);
      
      console.log(`💱 Converting pricing to ${targetCurrency}...`);
      
      const [monthly, annual, lifetime] = await convertMultipleFromAUD(
        [BASE_PRICING_AUD.monthly, BASE_PRICING_AUD.annual, BASE_PRICING_AUD.lifetime],
        targetCurrency
      );

      setConvertedPricing({
        monthly: Math.ceil(monthly), // Round up to nearest whole number
        annual: Math.ceil(annual),
        lifetime: Math.ceil(lifetime)
      });

      console.log(`✅ Pricing converted to ${targetCurrency}`, {
        monthly: Math.ceil(monthly),
        annual: Math.ceil(annual),
        lifetime: Math.ceil(lifetime)
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert pricing';
      console.error('❌ Error converting pricing:', err);
      setError(errorMessage);
      
      // Fallback to AUD pricing
      setConvertedPricing({
        monthly: BASE_PRICING_AUD.monthly,
        annual: BASE_PRICING_AUD.annual,
        lifetime: BASE_PRICING_AUD.lifetime
      });
    } finally {
      setIsConverting(false);
    }
  }, []);

  // Convert pricing when currency changes
  useEffect(() => {
    convertPricing(activeCurrency);
  }, [activeCurrency, convertPricing]);

  // Generate pricing tiers with formatting
  const pricing = useMemo((): {
    monthly: PricingTier;
    annual: PricingTier;
    lifetime: PricingTier;
  } => {
    const amounts = convertedPricing || {
      monthly: BASE_PRICING_AUD.monthly,
      annual: BASE_PRICING_AUD.annual,
      lifetime: BASE_PRICING_AUD.lifetime
    };

    const isConverted = activeCurrency !== 'AUD';

    return {
      monthly: {
        name: 'Monthly',
        amount: amounts.monthly,
        originalAmount: BASE_PRICING_AUD.monthly,
        currency: activeCurrency,
        interval: 'month',
        formattedPrice: formatCurrency(amounts.monthly, activeCurrency),
        isConverted
      },
      annual: {
        name: 'Annual',
        amount: amounts.annual,
        originalAmount: BASE_PRICING_AUD.annual,
        currency: activeCurrency,
        interval: 'year',
        formattedPrice: formatCurrency(amounts.annual, activeCurrency),
        isConverted
      },
      lifetime: {
        name: 'Lifetime',
        amount: amounts.lifetime,
        originalAmount: BASE_PRICING_AUD.lifetime,
        currency: activeCurrency,
        formattedPrice: formatCurrency(amounts.lifetime, activeCurrency),
        isConverted
      }
    };
  }, [convertedPricing, activeCurrency]);

  // Function to manually refresh pricing (e.g., if rates are stale)
  const refreshPricing = useCallback(async () => {
    console.log('🔄 Refreshing pricing...');
    await convertPricing(activeCurrency);
  }, [activeCurrency, convertPricing]);

  // Function to manually set pricing currency
  const setPricingCurrency = useCallback((currency: string) => {
    console.log(`🔄 Manually setting pricing currency to ${currency}`);
    setManualCurrency(currency);
  }, []);

  return {
    pricing,
    userCurrency: activeCurrency,
    userCountry: location?.country,
    isLoading: (locationLoading && !location) || isConverting, // Only show loading if no location data
    error,
    refreshPricing,
    setPricingCurrency
  };
}

/**
 * Utility hook for getting just the user's detected currency
 */
export function useUserCurrency(): {
  currency: string;
  country: string | undefined;
  isLoading: boolean;
} {
  const { location, isLoading } = useUserLocationWithCurrency();
  
  return {
    currency: location?.currency || 'USD',
    country: location?.country,
    isLoading
  };
}

/**
 * Format a price with currency conversion indicator
 */
export function formatPriceWithIndicator(
  amount: number, 
  currency: string, 
  isConverted: boolean
): string {
  const formatted = formatCurrency(amount, currency);
  return isConverted ? `~${formatted}` : formatted;
}