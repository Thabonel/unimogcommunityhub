import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';
import { getCountryFlag, getCountryName } from '@/utils/countryUtils';

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  vehicleCount: number;
}

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  showAll?: boolean;
  placeholder?: string;
  countryCounts?: Record<string, number>;
  className?: string;
}

const CountrySelector = ({ 
  value, 
  onChange, 
  showAll = true, 
  placeholder = "Select Country",
  countryCounts = {},
  className = ""
}: CountrySelectorProps) => {
  const [countries, setCountries] = useState<CountryOption[]>([]);

  // Common countries where Unimogs are popular
  const popularCountries = [
    'US', 'DE', 'AU', 'GB', 'CA', 'ZA', 'AT', 'CH', 'NL', 'FR',
    'BR', 'AR', 'NZ', 'SE', 'NO', 'DK', 'ES', 'IT', 'BE', 'FI',
    'IS', 'IE', 'LU', 'PT', 'CZ', 'SK', 'PL', 'HU', 'HR', 'SI'
  ];

  useEffect(() => {
    const countryOptions: CountryOption[] = popularCountries.map(code => ({
      code,
      name: getCountryName(code),
      flag: getCountryFlag(code),
      vehicleCount: countryCounts[code] || 0
    })).sort((a, b) => {
      // Sort by vehicle count descending, then by name
      if (b.vehicleCount !== a.vehicleCount) {
        return b.vehicleCount - a.vehicleCount;
      }
      return a.name.localeCompare(b.name);
    });

    setCountries(countryOptions);
  }, [countryCounts]);

  const renderCountryOption = (country: CountryOption) => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="text-lg">{country.flag}</span>
        <span className="font-medium">{country.name}</span>
      </div>
      {country.vehicleCount > 0 && (
        <Badge variant="secondary" className="ml-2">
          {country.vehicleCount}
        </Badge>
      )}
    </div>
  );

  const getDisplayValue = () => {
    if (value === 'all') return placeholder;
    const country = countries.find(c => c.code === value);
    if (!country) return placeholder;
    
    return (
      <div className="flex items-center gap-2">
        <span>{country.flag}</span>
        <span>{country.name}</span>
        {country.vehicleCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {country.vehicleCount}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue>
          {getDisplayValue()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {showAll && (
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="font-medium">All Countries</span>
              {Object.values(countryCounts).reduce((a, b) => a + b, 0) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(countryCounts).reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </div>
          </SelectItem>
        )}
        
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {renderCountryOption(country)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;