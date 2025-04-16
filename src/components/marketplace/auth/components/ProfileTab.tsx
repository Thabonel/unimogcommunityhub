
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Switch } from '@/components/ui/switch';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/localization/CountrySelector';
import { LanguageSelector } from '@/components/localization/LanguageSelector';
import { useLocalization } from '@/contexts/LocalizationContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_COUNTRIES, SUPPORTED_LANGUAGES } from '@/lib/i18n';

interface ProfileTabProps {
  user: any;
  emailVerified: boolean;
  fullName: string;
  setFullName: (value: string) => void;
  displayName: string;
  setDisplayName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  isUpdatingProfile: boolean;
  setIsUpdatingProfile: (value: boolean) => void;
  handleProfileUpdate: (e: React.FormEvent) => Promise<void>;
  avatarUrl?: string;
  setAvatarUrl?: (url: string) => void;
  vehiclePhotoUrl?: string;
  setVehiclePhotoUrl?: (url: string) => void;
  useVehiclePhotoAsProfile: boolean;
  setUseVehiclePhotoAsProfile: (value: boolean) => void;
}

export const ProfileTab = ({
  user,
  emailVerified,
  fullName,
  setFullName,
  displayName,
  setDisplayName,
  location,
  setLocation,
  isUpdatingProfile,
  setIsUpdatingProfile,
  handleProfileUpdate,
  avatarUrl,
  setAvatarUrl,
  vehiclePhotoUrl,
  setVehiclePhotoUrl,
  useVehiclePhotoAsProfile,
  setUseVehiclePhotoAsProfile
}: ProfileTabProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { country, language, setCountry, setLanguage } = useLocalization();
  
  // Calculate if the toggle should be disabled
  const isToggleDisabled = !vehiclePhotoUrl || vehiclePhotoUrl.trim() === '';

  // Country and language change handlers
  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="email" 
                value={user?.email || ''} 
                disabled 
                className="flex-1"
              />
              {emailVerified ? (
                <div className="flex items-center text-sm text-green-600 gap-1 whitespace-nowrap">
                  <Check className="h-4 w-4" />
                  {t('Verified')}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate('/marketplace/verify-email')}
                >
                  {t('Verify Email')}
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left column - Profile info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('Full Name')}</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">{t('Display Name')}</Label>
                <Input 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">{t('Location')}</Label>
                <Input 
                  id="location" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Country selector */}
              <div className="space-y-2">
                <Label htmlFor="country">{t('profile.country')}</Label>
                <Select 
                  value={country} 
                  onValueChange={handleCountryChange}
                >
                  <SelectTrigger id="country">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{SUPPORTED_COUNTRIES[country]?.flag}</span>
                        <span>{SUPPORTED_COUNTRIES[country]?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPORTED_COUNTRIES).map(([code, countryData]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{countryData.flag}</span>
                          <span>{countryData.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language selector */}
              <div className="space-y-2">
                <Label htmlFor="language">{t('profile.language')}</Label>
                <Select 
                  value={language} 
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger id="language">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{SUPPORTED_LANGUAGES[language]?.flag}</span>
                        <span>{SUPPORTED_LANGUAGES[language]?.name}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUPPORTED_LANGUAGES).map(([code, langData]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{langData.flag}</span>
                          <span>{langData.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Right column - Photos */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">{t('Profile Photo')}</h3>
                <PhotoUpload
                  initialImageUrl={avatarUrl}
                  onImageUploaded={(url) => setAvatarUrl && setAvatarUrl(url)}
                  type="profile"
                  size="md"
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">{t('Vehicle Photo')}</h3>
                <PhotoUpload
                  initialImageUrl={vehiclePhotoUrl}
                  onImageUploaded={(url) => setVehiclePhotoUrl && setVehiclePhotoUrl(url)}
                  type="vehicle"
                  size="md"
                />
              </div>
              
              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-vehicle-photo"
                    checked={useVehiclePhotoAsProfile}
                    onCheckedChange={setUseVehiclePhotoAsProfile}
                    disabled={isToggleDisabled}
                  />
                  <Label 
                    htmlFor="use-vehicle-photo"
                    className={isToggleDisabled ? "text-muted-foreground" : ""}
                  >
                    {t('Use vehicle photo as profile picture')}
                  </Label>
                </div>
                {isToggleDisabled && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('Upload a vehicle photo first to enable this option')}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isUpdatingProfile}
            className="mt-4"
          >
            {isUpdatingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Saving...')}
              </>
            ) : t('save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
