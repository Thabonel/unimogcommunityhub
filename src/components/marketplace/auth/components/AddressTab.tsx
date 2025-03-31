
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Phone, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { getCurrencyFromCountry } from '@/utils/currencyUtils';
import { UserProfile } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

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
  userProfile: UserProfile | null;
}

export const AddressTab = ({ userProfile }: AddressTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    streetAddress: userProfile?.street_address || '',
    city: userProfile?.city || '',
    state: userProfile?.state || '',
    postalCode: userProfile?.postal_code || '',
    country: userProfile?.country || '',
    phoneNumber: userProfile?.phone_number || '',
    currency: userProfile?.currency || 'USD'
  });

  // Update form when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        streetAddress: userProfile.street_address || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        postalCode: userProfile.postal_code || '',
        country: userProfile.country || '',
        phoneNumber: userProfile.phone_number || '',
        currency: userProfile.currency || 'USD'
      });
    }
  }, [userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCountryChange = (countryCode: string) => {
    setFormData(prev => ({ ...prev, country: countryCode }));
    
    // Auto-suggest currency based on selected country
    const suggestedCurrency = getCurrencyFromCountry(countryCode);
    setFormData(prev => ({ ...prev, currency: suggestedCurrency }));
  };

  const handleCurrencyChange = (currency: string) => {
    setFormData(prev => ({ ...prev, currency }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          street_address: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
          phone_number: formData.phoneNumber,
          currency: formData.currency
        })
        .eq('id', user.id);

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
            <Label htmlFor="streetAddress" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Street Address
            </Label>
            <Input
              id="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="Enter your street address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter your city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your state or province"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal/ZIP Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter your postal code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Country
              </Label>
              <Select value={formData.country} onValueChange={handleCountryChange}>
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
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Preferred Currency</Label>
              <Select value={formData.currency} onValueChange={handleCurrencyChange}>
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

          <Button 
            type="submit" 
            disabled={isUpdating} 
            className="w-full sm:w-auto"
          >
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
