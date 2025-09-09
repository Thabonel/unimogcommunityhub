/**
 * Currency Selector Component
 * Allows users to manually override their detected currency
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Globe, ChevronDown } from 'lucide-react';
import { currencySymbols } from '@/utils/currencyUtils';

interface CurrencySelectorProps {
  currentCurrency: string;
  onCurrencyChange: (currency: string) => void;
  userCountry?: string;
  isConverted: boolean;
}

// Major currencies we want to support
const SUPPORTED_CURRENCIES = [
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
] as const;

export function CurrencySelector({ 
  currentCurrency, 
  onCurrencyChange, 
  userCountry,
  isConverted 
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentCurrencyInfo = SUPPORTED_CURRENCIES.find(c => c.code === currentCurrency);
  const symbol = currentCurrencyInfo?.symbol || currencySymbols[currentCurrency] || currentCurrency;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 text-sm"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="font-medium">{symbol}</span>
          {isConverted && <span className="ml-1 text-muted-foreground">~</span>}
          <ChevronDown className="h-3 w-3 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-medium text-sm mb-1">Currency Display</h4>
          <p className="text-xs text-muted-foreground">
            {userCountry && (
              <>Auto-detected: {userCountry}<br /></>
            )}
            Choose your preferred currency for pricing display
          </p>
        </div>
        <div className="p-2">
          <Select value={currentCurrency} onValueChange={(value) => {
            onCurrencyChange(value);
            setIsOpen(false);
          }}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  <div className="flex items-center justify-between w-full">
                    <span>{currency.symbol} {currency.code}</span>
                    <span className="text-muted-foreground text-xs ml-2">
                      {currency.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isConverted && (
          <div className="p-3 bg-muted/50 border-t">
            <p className="text-xs text-muted-foreground">
              💡 Prices are converted from AUD using current exchange rates. 
              Final payment will be processed in AUD.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}