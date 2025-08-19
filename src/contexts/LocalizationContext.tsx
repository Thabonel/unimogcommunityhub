import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LocalizationContextType {
  language: string;
  country: string;
  setLanguage: (lang: string) => void;
  setCountry: (country: string) => void;
  supportedLanguages: string[];
  supportedCountries: string[];
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<string>('en');
  const [country, setCountryState] = useState<string>('US');

  const supportedLanguages = ['en', 'de', 'es', 'tr'];
  const supportedCountries = ['US', 'DE', 'ES', 'TR', 'GB', 'AU', 'CA'];

  useEffect(() => {
    // Load saved preferences
    const savedLanguage = localStorage.getItem('preferred_language');
    const savedCountry = localStorage.getItem('preferred_country');
    
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
    
    if (savedCountry && supportedCountries.includes(savedCountry)) {
      setCountryState(savedCountry);
    }
  }, [i18n]);

  const setLanguage = (lang: string) => {
    if (supportedLanguages.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('preferred_language', lang);
      i18n.changeLanguage(lang);
    }
  };

  const setCountry = (newCountry: string) => {
    if (supportedCountries.includes(newCountry)) {
      setCountryState(newCountry);
      localStorage.setItem('preferred_country', newCountry);
    }
  };

  const value = {
    language,
    country,
    setLanguage,
    setCountry,
    supportedLanguages,
    supportedCountries,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};