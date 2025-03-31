
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { currencyOptions } from '../address/constants';

interface CurrencySelectorProps {
  currency: string;
  onChange: (currency: string) => void;
}

export const CurrencySelector = ({ currency, onChange }: CurrencySelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor="currency">Preferred Currency</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">This currency will be used for all transactions across the marketplace</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select value={currency} onValueChange={onChange}>
        <SelectTrigger id="currency">
          <SelectValue placeholder="Select your currency" />
        </SelectTrigger>
        <SelectContent>
          {currencyOptions.map((currencyOption) => (
            <SelectItem key={currencyOption.code} value={currencyOption.code}>
              {currencyOption.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
