
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getCurrencyFromCountry } from '@/utils/currencyUtils';

const countryOptions = [
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
  // Add more countries as needed
].sort((a, b) => a.name.localeCompare(b.name));

const currencyOptions = [
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
  // Add more currencies as needed
].sort((a, b) => a.name.localeCompare(b.name));

interface AddressTabProps {
  userProfile: any;
}

export const AddressTab = ({ userProfile }: AddressTabProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [streetAddress, setStreetAddress] = useState(userProfile?.street_address || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [state, setState] = useState(userProfile?.state || '');
  const [postalCode, setPostalCode] = useState(userProfile?.postal_code || '');
  const [country, setCountry] = useState(userProfile?.country || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone_number || '');
  const [currency, setCurrency] = useState(userProfile?.currency || 'USD');

  const handleCountryChange = (countryCode: string) => {
    setCountry(countryCode);
    
    // Auto-suggest currency based on selected country
    const suggestedCurrency = getCurrencyFromCountry(countryCode);
    setCurrency(suggestedCurrency);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          street_address: streetAddress,
          city,
          state,
          postal_code: postalCode,
          country,
          phone_number: phoneNumber,
          currency
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      toast({
        title: "Address updated",
        description: "Your address and currency preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update address information",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address & Currency</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input
              id="streetAddress"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Enter your street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Enter your state or province"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal/ZIP Code</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Enter your postal code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={handleCountryChange}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Preferred Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
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
          </div>

          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Address"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
