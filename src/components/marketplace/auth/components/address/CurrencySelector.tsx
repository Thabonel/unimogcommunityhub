
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { currencyOptions } from '../address/constants';

interface CurrencySelectorProps {
  currency: string;
  onChange: (currency: string) => void;
}

export const CurrencySelector = ({ currency, onChange }: CurrencySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="currency">Preferred Currency</Label>
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
