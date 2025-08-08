
import { Globe, HelpCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { countryOptions } from '../address/constants';

interface CountrySelectorProps {
  country: string;
  onChange: (country: string) => void;
}

export const CountrySelector = ({ country, onChange }: CountrySelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor="country" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Country
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Your country selection will automatically suggest an appropriate currency</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
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
