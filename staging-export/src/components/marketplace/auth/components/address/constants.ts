
export const countryOptions = [
  { code: 'AU', name: 'Australia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
].sort((a, b) => a.name.localeCompare(b.name));

export const currencyOptions = [
  { code: 'AUD', name: 'Australian Dollar (AUD)' },
  { code: 'BRL', name: 'Brazilian Real (BRL)' },
  { code: 'CAD', name: 'Canadian Dollar (CAD)' },
  { code: 'EUR', name: 'Euro (EUR)' },
  { code: 'GBP', name: 'British Pound (GBP)' },
  { code: 'INR', name: 'Indian Rupee (INR)' },
  { code: 'JPY', name: 'Japanese Yen (JPY)' },
  { code: 'NZD', name: 'New Zealand Dollar (NZD)' },
  { code: 'ZAR', name: 'South African Rand (ZAR)' },
  { code: 'USD', name: 'US Dollar (USD)' },
].sort((a, b) => a.name.localeCompare(b.name));
