
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Phone } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface AddressFormProps {
  userProfile: UserProfile | null;
  formData: {
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    phoneNumber: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddressForm = ({ 
  userProfile, 
  formData, 
  handleInputChange 
}: AddressFormProps) => {
  return (
    <>
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
      </div>
    </>
  );
};
