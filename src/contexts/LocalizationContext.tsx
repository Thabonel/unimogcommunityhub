
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_COUNTRIES, getCurrentCountry, changeCountry, changeLanguage, SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LocalizationContextType {
  country: string;
  language: string;
  setCountry: (countryCode: string) => Promise<void>;
  setLanguage: (languageCode: string) => Promise<void>;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  measurementSystem: 'metric' | 'imperial';
  formatDate: (date: Date | string | number) => string;
  formatTime: (date: Date | string | number) => string;
  formatMeasurement: (value: number, unit: 'distance' | 'weight' | 'volume') => string;
  showCountrySelector: boolean;
  setShowCountrySelector: (show: boolean) => void;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  
  const [country, setCountryState] = useState(getCurrentCountry());
  const [language, setLanguageState] = useState(i18n.language || 'en');
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  
  // Format settings
  const dateFormat = SUPPORTED_COUNTRIES[country]?.dateFormat || 'DD/MM/YYYY';
  const timeFormat = SUPPORTED_COUNTRIES[country]?.timeFormat || '12h';
  const measurementSystem = SUPPORTED_COUNTRIES[country]?.measurementSystem || 'metric';
  
  // Load user preferences from Supabase when authenticated
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('country, language')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user preferences:', error);
          return;
        }
        
        if (data) {
          // Check if country is valid, otherwise set default
          if (data.country && SUPPORTED_COUNTRIES[data.country]) {
            setCountryState(data.country);
          } else {
            // If no country is set, prompt the user to select one
            setShowCountrySelector(true);
          }
          
          // Set language if available
          if (data.language) {
            await i18n.changeLanguage(data.language);
            setLanguageState(data.language);
          }
        } else {
          // New user without preferences, show country selector
          setShowCountrySelector(true);
        }
      } catch (error) {
        console.error('Error in fetchUserPreferences:', error);
      }
    };
    
    fetchUserPreferences();
  }, [user?.id, i18n]);
  
  // Update language when country changes (if no explicit language preference)
  useEffect(() => {
    const updateLanguageForCountry = async () => {
      const countryData = SUPPORTED_COUNTRIES[country];
      if (countryData && !localStorage.getItem('i18nextLng')) {
        try {
          await i18n.changeLanguage(countryData.defaultLanguage);
          setLanguageState(countryData.defaultLanguage);
        } catch (error) {
          console.error('Error changing language:', error);
        }
      }
    };
    
    updateLanguageForCountry();
  }, [country, i18n]);
  
  // Update state when i18n language changes
  useEffect(() => {
    if (i18n.language && i18n.language !== language) {
      setLanguageState(i18n.language);
    }
  }, [i18n.language, language]);
  
  // Format utility functions
  const formatDate = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    if (dateFormat === 'DD/MM/YYYY') {
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    } else {
      // DD.MM.YYYY
      return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
    }
  };
  
  const formatTime = (date: Date | string | number): string => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Time';
    
    if (timeFormat === '12h') {
      let hours = d.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      return `${hours}:${d.getMinutes().toString().padStart(2, '0')} ${ampm}`;
    } else {
      // 24h
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
  };
  
  const formatMeasurement = (value: number, unit: 'distance' | 'weight' | 'volume'): string => {
    if (measurementSystem === 'imperial') {
      switch (unit) {
        case 'distance':
          return `${(value * 0.62137).toFixed(1)} ${t('units.miles')}`;
        case 'weight':
          return `${(value * 2.20462).toFixed(1)} ${t('units.lbs')}`;
        case 'volume':
          return `${(value * 0.26417).toFixed(1)} ${t('units.gallons')}`;
      }
    } else {
      // metric
      switch (unit) {
        case 'distance':
          return `${value.toFixed(1)} ${t('units.km')}`;
        case 'weight':
          return `${value.toFixed(1)} ${t('units.kg')}`;
        case 'volume':
          return `${value.toFixed(1)} ${t('units.liters')}`;
      }
    }
  };
  
  // Wrapper functions for changing country and language
  const setCountry = async (countryCode: string) => {
    if (countryCode === country) return;
    
    try {
      await changeCountry(countryCode);
      setCountryState(countryCode);
      
      toast({
        title: t('profile.country'),
        description: `${t('profile.country')}: ${SUPPORTED_COUNTRIES[countryCode]?.name}`,
      });
    } catch (error) {
      console.error('Error setting country:', error);
      toast({
        title: "Error",
        description: "Failed to update country preference",
        variant: "destructive"
      });
    }
  };
  
  const setLanguage = async (languageCode: string) => {
    if (languageCode === language) return;
    
    try {
      await changeLanguage(languageCode);
      setLanguageState(languageCode);
      
      toast({
        title: t('profile.language'),
        description: `${t('profile.language')}: ${SUPPORTED_LANGUAGES[languageCode]?.name}`,
      });
    } catch (error) {
      console.error('Error setting language:', error);
      toast({
        title: "Error",
        description: "Failed to update language preference",
        variant: "destructive"
      });
    }
  };
  
  const value = {
    country,
    language,
    setCountry,
    setLanguage,
    dateFormat,
    timeFormat,
    measurementSystem,
    formatDate,
    formatTime,
    formatMeasurement,
    showCountrySelector,
    setShowCountrySelector
  };
  
  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
