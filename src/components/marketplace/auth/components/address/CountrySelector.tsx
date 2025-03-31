
import { Globe } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countryOptions } from '../address/constants';

interface CountrySelectorProps {
  country: string;
  onChange: (country: string) => void;
}

export const CountrySelector = ({ country, onChange }: CountrySelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="country" className="flex items-center gap-2">
        <Globe className="h-4 w-4" />
        Country
      </Label>
      <Select value={country} onValueChange={onChange}>
        <SelectTrigger id="country">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          {countryOptions.map((countryOption) => (
            <SelectItem key={countryOption.code} value={countryOption.code}>
              {countryOption.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
