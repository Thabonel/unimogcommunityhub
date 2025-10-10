
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/lib/i18n';

interface LanguageSelectorProps {
  onSelect?: (languageCode: string) => void;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LanguageSelector({
  onSelect,
  showLabel = false,
  className = '',
  variant = 'outline',
  size = 'default',
}: LanguageSelectorProps) {
  const { i18n, ready } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Ensure the current language is updated if it changes elsewhere
  useEffect(() => {
    if (i18n.language && i18n.language !== currentLanguage) {
      setCurrentLanguage(i18n.language);
    }
  }, [i18n.language, currentLanguage]);

  // Don't render until i18n is ready
  if (!ready) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <span className="text-lg">🇬🇧</span>
      </Button>
    );
  }

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      if (onSelect) {
        onSelect(languageCode);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Safety check: ensure we have a valid current language
  const safeCurrentLanguage = SUPPORTED_LANGUAGES?.[currentLanguage] ? currentLanguage : 'en';
  const languageEntries = SUPPORTED_LANGUAGES ? Object.entries(SUPPORTED_LANGUAGES) : [];

  // Additional safety check
  if (!SUPPORTED_LANGUAGES || languageEntries.length === 0) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <span className="text-lg">🇬🇧</span>
      </Button>
    );
  }

  return (
    <Select value={safeCurrentLanguage} onValueChange={handleLanguageSelect}>
      <SelectTrigger
        className={`w-auto border-0 ${showLabel ? 'min-w-[140px]' : 'w-[60px]'} ${className}`}
        aria-label="Select language"
      >
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {SUPPORTED_LANGUAGES[safeCurrentLanguage]?.flag || '🇬🇧'}
            </span>
            {showLabel && (
              <span className="hidden sm:inline-block">
                {SUPPORTED_LANGUAGES[safeCurrentLanguage]?.name || 'English'}
              </span>
            )}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languageEntries.map(([code, language]) => (
          <SelectItem key={code} value={code}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{language?.flag || '🏳️'}</span>
              <span>{language?.name || code}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
