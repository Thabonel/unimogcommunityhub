
import { useLocalization } from '@/contexts/LocalizationContext';
import { ReactNode } from 'react';

interface CountrySpecificContentProps {
  countryCode: string | string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function CountrySpecificContent({
  countryCode,
  fallback = null,
  children,
}: CountrySpecificContentProps) {
  const { country } = useLocalization();
  
  // Allow single countryCode or array of countryCodes
  const countries = Array.isArray(countryCode) ? countryCode : [countryCode];
  
  if (countries.includes(country)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
