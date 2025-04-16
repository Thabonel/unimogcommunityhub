
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SUPPORTED_COUNTRIES, getCurrentCountry, changeCountry } from '@/lib/i18n';

interface CountrySelectorProps {
  onSelect?: (countryCode: string) => void;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function CountrySelector({
  onSelect,
  showLabel = false,
  className = '',
  variant = 'outline',
  size = 'default',
}: CountrySelectorProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentCountry, setCurrentCountry] = useState(getCurrentCountry());

  // Ensure the current country is updated if it changes elsewhere
  useEffect(() => {
    const storedCountry = getCurrentCountry();
    if (storedCountry !== currentCountry) {
      setCurrentCountry(storedCountry);
    }
  }, [currentCountry]);

  const handleCountrySelect = async (countryCode: string) => {
    try {
      await changeCountry(countryCode);
      setCurrentCountry(countryCode);
      setOpen(false);
      if (onSelect) {
        onSelect(countryCode);
      }
    } catch (error) {
      console.error('Error changing country:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center gap-2 ${className}`}
        >
          <span className="text-lg">
            {SUPPORTED_COUNTRIES[currentCountry]?.flag}
          </span>
          {showLabel && (
            <span className="hidden sm:inline-block">
              {SUPPORTED_COUNTRIES[currentCountry]?.name}
            </span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t('country_selection')} />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {Object.entries(SUPPORTED_COUNTRIES).map(([code, country]) => (
              <CommandItem
                key={code}
                value={country.name}
                onSelect={() => handleCountrySelect(code)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                </div>
                {currentCountry === code && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
