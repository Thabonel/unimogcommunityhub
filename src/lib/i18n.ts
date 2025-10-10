import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/lib/supabase-client';

// Define supported languages
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' }, 
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  es: { name: 'Español', flag: '🇦🇷' }
};

// Define supported countries with their languages and formats
export const SUPPORTED_COUNTRIES = {
  AU: { 
    name: 'Australia',
    defaultLanguage: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    measurementSystem: 'imperial',
    flag: '🇦🇺'
  },
  GB: { 
    name: 'England',
    defaultLanguage: 'en',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    measurementSystem: 'imperial',
    flag: '🇬🇧'
  },
  DE: { 
    name: 'Germany',
    defaultLanguage: 'de',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    flag: '🇩🇪'
  },
  TR: { 
    name: 'Türkiye',
    defaultLanguage: 'tr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    flag: '🇹🇷'
  },
  AR: { 
    name: 'Argentina',
    defaultLanguage: 'es',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    flag: '🇦🇷'
  }
};

const getUserPreferences = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('country, language')
      .eq('id', user.id)
      .single();
    
    if (error || !data) return null;
    
    return {
      country: data.country,
      language: data.language
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return null;
  }
};

const initializeI18n = async () => {
  // Try to get user preferences from Supabase
  const userPrefs = await getUserPreferences();
  
  // Set default country and language based on user preferences or browser
  let defaultCountry = 'GB'; // Default to England
  let defaultLanguage = 'en'; // Default to English
  
  if (userPrefs?.country && SUPPORTED_COUNTRIES[userPrefs.country]) {
    defaultCountry = userPrefs.country;
    defaultLanguage = userPrefs.language || SUPPORTED_COUNTRIES[userPrefs.country].defaultLanguage;
  }
  
  await i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      defaultNS: 'common',
      debug: import.meta.env.DEV,

      interpolation: {
        escapeValue: false, // React already escapes values
      },

      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },

      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },

      react: {
        useSuspense: false,
      },
    });

  // Set initial country and language
  localStorage.setItem('userCountry', defaultCountry);
  await i18n.changeLanguage(defaultLanguage);

  // Verify translation resources loaded successfully after changeLanguage completes
  const resources = i18n.store.data;
  if (!resources.en || !resources.en.common) {
    console.error('CRITICAL: Translation resources failed to load');
    console.error('Available resources:', Object.keys(resources));
    console.error('Expected path:', '/locales/en/common.json');
    console.error('Check that translation files exist in dist/locales/en/');
    throw new Error('Translation initialization failed: English resources not loaded');
  }

  return i18n;
};

const i18nPromise = initializeI18n();

// Store the resolved i18n instance
let i18nInstance: typeof i18n | null = null;
i18nPromise.then(instance => {
  i18nInstance = instance;
});

// Function to get the current country code
export const getCurrentCountry = (): string => {
  return localStorage.getItem('userCountry') || 'GB';
};

// Function to change country
export const changeCountry = async (countryCode: string): Promise<void> => {
  if (!SUPPORTED_COUNTRIES[countryCode]) {
    throw new Error(`Country ${countryCode} is not supported`);
  }

  localStorage.setItem('userCountry', countryCode);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ country: countryCode })
        .eq('id', user.id);
    }
  } catch (error) {
    console.error('Error updating user country:', error);
  }
};

// Function to change language
export const changeLanguage = async (languageCode: string): Promise<void> => {
  console.log('🌐 changeLanguage called with:', languageCode);

  if (!SUPPORTED_LANGUAGES[languageCode]) {
    throw new Error(`Language ${languageCode} is not supported`);
  }

  // Get the i18n instance (wait if not ready)
  const instance = i18nInstance || await i18nPromise;

  console.log('🔄 Calling i18n.changeLanguage with:', languageCode);
  await instance.changeLanguage(languageCode);
  console.log('✅ i18n language changed to:', instance.language);

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ language: languageCode })
        .eq('id', user.id);
      console.log('💾 User language preference saved to database');
    }
  } catch (error) {
    console.error('Error updating user language:', error);
  }
};

// Export initialized i18n instance
export default i18nPromise;
