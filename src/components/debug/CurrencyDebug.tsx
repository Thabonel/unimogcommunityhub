/**
 * Currency Debug Component
 * Shows current currency detection state for debugging
 * Remove this component after fixing currency issues
 */

import { useCurrencyPricing } from '@/hooks/use-currency-pricing';
import { useUserLocationWithCurrency } from '@/hooks/use-user-location-with-currency';

export function CurrencyDebug() {
  const { pricing, userCurrency, userCountry, isLoading } = useCurrencyPricing();
  const { location } = useUserLocationWithCurrency();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold text-yellow-400 mb-2">🐛 Currency Debug</h4>
      
      <div className="space-y-1">
        <div><strong>Loading:</strong> {isLoading ? 'YES' : 'NO'}</div>
        <div><strong>Detected Country:</strong> {userCountry || 'None'}</div>
        <div><strong>Detected Currency:</strong> {userCurrency}</div>
        <div><strong>Browser Locale:</strong> {navigator.language}</div>
        
        {location && (
          <>
            <div><strong>Coordinates:</strong> {location.latitude?.toFixed(2)}, {location.longitude?.toFixed(2)}</div>
            <div><strong>Country Code:</strong> {location.countryCode}</div>
            <div><strong>City:</strong> {location.city || 'Unknown'}</div>
          </>
        )}
        
        <hr className="border-gray-600 my-2" />
        
        <div><strong>Monthly:</strong> {pricing.monthly.formattedPrice}</div>
        <div><strong>Annual:</strong> {pricing.annual.formattedPrice}</div>
        <div><strong>Lifetime:</strong> {pricing.lifetime.formattedPrice}</div>
        
        <div><strong>Is Converted:</strong> {pricing.monthly.isConverted ? 'YES' : 'NO'}</div>
        <div><strong>Original AUD:</strong> A${pricing.monthly.originalAmount}</div>
      </div>
      
      <div className="mt-2 space-x-2">
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="bg-red-600 px-2 py-1 rounded text-xs"
        >
          Clear Cache & Reload
        </button>
        
        <button 
          onClick={() => {
            // Clear just the currency cache to force re-detection
            localStorage.removeItem('lastKnownLocationWithCurrency');
            localStorage.removeItem('exchange_rates');
            localStorage.removeItem('geo_location_data');
            window.location.reload();
          }}
          className="bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Reset Currency
        </button>
      </div>
    </div>
  );
}