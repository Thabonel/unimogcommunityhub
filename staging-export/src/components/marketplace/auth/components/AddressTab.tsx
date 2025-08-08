
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UserProfile } from '@/types/user';
import { AddressForm } from './address/AddressForm';
import { CountrySelector } from './address/CountrySelector';
import { CurrencySelector } from './address/CurrencySelector';
import { useAddressForm } from './address/useAddressForm';

interface AddressTabProps {
  userProfile: UserProfile | null;
}

export const AddressTab = ({ userProfile }: AddressTabProps) => {
  const { 
    formData, 
    isUpdating, 
    handleInputChange, 
    handleCountryChange, 
    handleCurrencyChange, 
    handleSubmit 
  } = useAddressForm(userProfile);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address & Currency</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AddressForm 
            userProfile={userProfile}
            formData={formData}
            handleInputChange={handleInputChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CountrySelector 
              country={formData.country}
              onChange={handleCountryChange}
            />
            <CurrencySelector 
              currency={formData.currency}
              onChange={handleCurrencyChange}
            />
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
