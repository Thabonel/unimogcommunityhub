
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GEMINI_CONFIG } from '@/config/env';

interface AutoTranslateResult {
  translatedText: string;
  isLoading: boolean;
  error: Error | null;
}

// Simple in-memory cache for translations
const translationCache = new Map<string, string>();

async function translateWithGemini(text: string, targetLang: string): Promise<string> {
  const cacheKey = `${targetLang}:${text}`;

  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  if (!GEMINI_CONFIG.apiKey) {
    console.warn('Gemini API key not configured, returning original text');
    return text;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate the following German text to ${targetLang === 'en' ? 'English' : targetLang}. Only output the translation, no explanations:\n\n${text}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;

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
        const result = await translateWithGemini(text, i18n.language);
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
  if (!GEMINI_CONFIG.apiKey || targetLang === 'de') {
    return texts;
  }

  // Check which texts need translation
  const results: string[] = [];
  const textsToTranslate: { index: number; text: string }[] = [];

  texts.forEach((text, index) => {
    const cacheKey = `${targetLang}:${text}`;
    if (translationCache.has(cacheKey)) {
      results[index] = translationCache.get(cacheKey)!;
    } else {
      textsToTranslate.push({ index, text });
    }
  });

  if (textsToTranslate.length === 0) {
    return results;
  }

  try {
    // Combine texts for batch translation
    const combinedText = textsToTranslate
      .map((item, i) => `[${i + 1}] ${item.text}`)
      .join('\n\n');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_CONFIG.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Translate the following German texts to English. Keep the numbered format [1], [2], etc. Only output the translations:\n\n${combinedText}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4096,
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedCombined = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    // Parse the numbered responses
    const translatedParts = translatedCombined.split(/\[\d+\]\s*/).filter(Boolean);

    textsToTranslate.forEach((item, i) => {
      const translated = translatedParts[i]?.trim() || item.text;
      results[item.index] = translated;
      translationCache.set(`${targetLang}:${item.text}`, translated);
    });

    // Fill any gaps with original text
    texts.forEach((text, index) => {
      if (!results[index]) {
        results[index] = text;
      }
    });

    return results;
  } catch (error) {
    console.error('Batch translation error:', error);
    return texts;
  }
}

// Clear translation cache
export function clearTranslationCache(): void {
  translationCache.clear();
}
