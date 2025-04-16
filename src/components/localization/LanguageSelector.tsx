
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/lib/i18n';

interface LanguageSelectorProps {
  onSelect?: (languageCode: string) => void;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function LanguageSelector({
  onSelect,
  showLabel = false,
  className = '',
  variant = 'outline',
  size = 'default',
}: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Ensure the current language is updated if it changes elsewhere
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      setCurrentLanguage(i18n.language);
    }
  }, [i18n.language, currentLanguage]);

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode);
      setCurrentLanguage(languageCode);
      setOpen(false);
      if (onSelect) {
        onSelect(languageCode);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center gap-2 ${className}`}
        >
          <span className="text-lg">
            {SUPPORTED_LANGUAGES[currentLanguage]?.flag}
          </span>
          {showLabel && (
            <span className="hidden sm:inline-block">
              {SUPPORTED_LANGUAGES[currentLanguage]?.name}
            </span>
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t('language_selection')} />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, language]) => (
              <CommandItem
                key={code}
                value={language.name}
                onSelect={() => handleLanguageSelect(code)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </div>
                {currentLanguage === code && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
