
import { useState, useEffect } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { supabase } from '@/lib/supabase';

interface TranslationResult {
  translatedText: string;
  isLoading: boolean;
  error: string | null;
}

export const useAutoTranslate = (originalText: string, skipTranslation: boolean = false): TranslationResult => {
  const [translatedText, setTranslatedText] = useState<string>(originalText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLocalization();

  useEffect(() => {
    // Reset when original text changes
    setTranslatedText(originalText);
    setError(null);

    // Skip if no text, translation is disabled, or source is already in target language
    if (!originalText || skipTranslation || originalText.trim() === '') {
      return;
    }

    const translateText = async () => {
      setIsLoading(true);
      try {
        // Simple local cache for translation results
        const cacheKey = `translate_${language}_${encodeURIComponent(originalText).slice(0, 50)}`;
        const cachedTranslation = localStorage.getItem(cacheKey);
        
        if (cachedTranslation) {
          setTranslatedText(cachedTranslation);
          setIsLoading(false);
          return;
        }

        // Call Supabase Edge Function for translation
        const { data, error: apiError } = await supabase.functions.invoke('translate', {
          body: {
            text: originalText,
            targetLanguage: language,
          },
        });

        if (apiError) {
          throw new Error(apiError.message);
        }

        if (data?.translatedText) {
          setTranslatedText(data.translatedText);
          // Cache the result
          localStorage.setItem(cacheKey, data.translatedText);
        }
      } catch (err) {
        console.error('Translation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to translate text');
        // Fallback to original text on error
        setTranslatedText(originalText);
      } finally {
        setIsLoading(false);
      }
    };

    // Only translate if the language is different from English (our default source)
    if (language !== 'en') {
      translateText();
    }
  }, [originalText, language, skipTranslation]);

  return { translatedText, isLoading, error };
};
