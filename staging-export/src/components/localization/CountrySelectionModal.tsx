
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SUPPORTED_COUNTRIES } from '@/lib/i18n';
import { useLocalization } from '@/contexts/LocalizationContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface CountrySelectionModalProps {
  onClose?: () => void;
}

export function CountrySelectionModal({ onClose }: CountrySelectionModalProps) {
  const { t } = useTranslation();
  const { country, setCountry, showCountrySelector, setShowCountrySelector } = useLocalization();
  const [selectedCountry, setSelectedCountry] = useState(country);

  const handleSave = async () => {
    await setCountry(selectedCountry);
    setShowCountrySelector(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={showCountrySelector} onOpenChange={setShowCountrySelector}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('country_selection')}</DialogTitle>
          <DialogDescription>
            Select your country to customize your experience.
            This will help us provide localized content and services.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={selectedCountry}
            onValueChange={setSelectedCountry}
            className="space-y-3"
          >
            {Object.entries(SUPPORTED_COUNTRIES).map(([code, countryData]) => (
              <div key={code} className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value={code} id={`country-${code}`} />
                <Label htmlFor={`country-${code}`} className="flex items-center gap-2 cursor-pointer flex-1">
                  <span className="text-xl mr-2">{countryData.flag}</span>
                  <span className="font-medium">{countryData.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
