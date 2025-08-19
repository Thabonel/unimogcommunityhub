
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrencyFromCountry } from '@/utils/currencyUtils';

export const useAddressForm = (userProfile: UserProfile | null) => {
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

  return {
    formData,
    isUpdating,
    handleInputChange,
    handleCountryChange,
    handleCurrencyChange,
    handleSubmit
  };
};
