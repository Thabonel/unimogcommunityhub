
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase-client';

interface AutoTranslateResult {
  translatedText: string;
  isLoading: boolean;
  error: Error | null;
}

// Simple in-memory cache for translations
const translationCache = new Map<string, string>();

async function translateWithEdgeFunction(text: string, targetLang: string): Promise<string> {
  const cacheKey = `${targetLang}:${text}`;

  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    // Call the ai-router edge function with a translation prompt
    const { data, error } = await supabase.functions.invoke('ai-router', {
      body: {
        mode: 'generate',
        input: `Translate the following German text to English. Only output the translation, no explanations or quotes:\n\n${text}`,
        constraints: {
          preferSpeed: true,
          targetLatencyMs: 2000
        }
      }
    });

    if (error) {
      console.error('Translation edge function error:', error);
      return text;
    }

    const translatedText = data?.output?.text?.trim() || text;

    // Cache the result
    translationCache.set(cacheKey, translatedText);

    return translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export function useAutoTranslate(text: string, skip: boolean = false): AutoTranslateResult {
  const [translatedText, setTranslatedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (skip || !text) {
      setTranslatedText(text);
      return;
    }

    // If user language is German, no translation needed
    if (i18n.language === 'de') {
      setTranslatedText(text);
      return;
    }

    // Check cache synchronously first
    const cacheKey = `${i18n.language}:${text}`;
    if (translationCache.has(cacheKey)) {
      setTranslatedText(translationCache.get(cacheKey)!);
      return;
    }

    async function doTranslate() {
      try {
        setIsLoading(true);
        const result = await translateWithEdgeFunction(text, i18n.language);
        setTranslatedText(result);
        setError(null);
      } catch (err) {
        console.error('Translation error:', err);
        setError(err instanceof Error ? err : new Error('Unknown translation error'));
        setTranslatedText(text);
      } finally {
        setIsLoading(false);
      }
    }

    doTranslate();
  }, [text, i18n.language, skip]);

  return { translatedText, isLoading, error };
}

// Batch translation for multiple texts (more efficient)
export async function translateBatch(texts: string[], targetLang: string = 'en'): Promise<string[]> {
  if (targetLang === 'de' || texts.length === 0) {
    return texts;
  }

  // Check which texts need translation
  const results: string[] = new Array(texts.length);
  const textsToTranslate: { index: number; text: string }[] = [];

  texts.forEach((text, index) => {
    const cacheKey = `${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) {
      results[index] = translationCache.get(cacheKey)!;
    } else if (text && text.trim()) {
      textsToTranslate.push({ index, text });
    } else {
      results[index] = text;
    }
  });

  if (textsToTranslate.length === 0) {
    return results;
  }

  try {
    // Combine texts for batch translation with numbered format
    const combinedText = textsToTranslate
      .map((item, i) => `[${i + 1}] ${item.text}`)
      .join('\n\n');

    // Call the ai-router edge function
    const { data, error } = await supabase.functions.invoke('ai-router', {
      body: {
        mode: 'generate',
        input: `Translate the following German texts to English. Keep the numbered format [1], [2], etc. Only output the translations, no explanations:\n\n${combinedText}`,
        constraints: {
          preferSpeed: true,
          targetLatencyMs: 5000
        }
      }
    });

    if (error) {
      console.error('Batch translation error:', error);
      // Fill in original texts for failed translations
      textsToTranslate.forEach((item) => {
        results[item.index] = item.text;
      });
      return results;
    }

    const translatedCombined = data?.output?.text?.trim() || '';

    // Parse the numbered responses
    const translatedParts = translatedCombined.split(/\[\d+\]\s*/).filter(Boolean);

    textsToTranslate.forEach((item, i) => {
      const translated = translatedParts[i]?.trim() || item.text;
      results[item.index] = translated;
      translationCache.set(`${targetLang}:${item.text}`, translated);
    });

    // Fill any gaps with original text
    texts.forEach((text, index) => {
      if (results[index] === undefined) {
        results[index] = text;
      }
    });

    return results;
  } catch (error) {
    console.error('Batch translation error:', error);
    // Return original texts on error
    return texts;
  }
}

// Clear translation cache
export function clearTranslationCache(): void {
  translationCache.clear();
}
