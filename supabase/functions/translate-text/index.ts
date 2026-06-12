// Hybrid AI Translation System - Runtime Translation Edge Function
// Version: 1.0
// Created: 2025-10-11
//
// This Edge Function handles runtime translation fallback when a key is missing
// from pre-generated translation files.
//
// Flow:
// 1. i18next detects missing translation key
// 2. Frontend calls this Edge Function
// 3. Check translation_cache for existing translation
// 4. If cached → return immediately (fast!)
// 5. If not cached → translate with OpenAI GPT-4o
// 6. Save to cache for future users
// 7. Return translated text
//
// Cost: ~$0.01 per translation (first time only, then cached)
// Speed: ~2-3 seconds first time, <100ms from cache

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = <OPENAI_API_KEY>
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Language code to full name mapping
const LANGUAGE_MAP: Record<string, string> = {
  'de': 'German',
  'tr': 'Turkish',
  'es': 'Argentine Spanish'
};

// Unimog-specific translation context (same as build-time script)
const TRANSLATION_CONTEXT = `
You are translating the Unimog Community Hub website - a platform for Unimog enthusiasts.

CRITICAL TERMINOLOGY (NEVER TRANSLATE THESE):
- "Unimog" - proper noun, brand name
- "Barry" - AI mechanic assistant name
- "WIS-EPC" - Mercedes technical system acronym

TECHNICAL TERMS (translate accurately):
- "Portal axles" → German: "Portalachsen", Turkish: "Portal dingiller", Spanish: "Ejes de portal"
- "Differential lock" → German: "Differenzialsperre", Turkish: "Diferansiyel kilidi", Spanish: "Bloqueo de diferencial"
- "PTO" (Power Take-Off) → German: "Zapfwelle", Turkish: "Güç çıkışı", Spanish: "Toma de fuerza"

STYLE GUIDELINES:
- Tone: Professional, friendly, welcoming
- Audience: Unimog owners, mechanics, off-road enthusiasts
- Keep "Community" in English when part of brand name
- Preserve placeholder variables like {{name}}, {count}, etc.
`;

/**
 * Check translation cache for existing translation
 */
async function checkCache(
  supabase: any,
  translationKey: string,
  languageCode: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('translation_cache')
      .select('translated_text')
      .eq('translation_key', translationKey)
      .eq('language_code', languageCode)
      .single();

    if (error || !data) {
      return null;
    }

    console.log(`✅ Cache hit for ${translationKey} (${languageCode})`);

    // Increment usage count
    await supabase
      .from('translation_cache')
      .update({ usage_count: data.usage_count + 1, last_used_at: new Date().toISOString() })
      .eq('translation_key', translationKey)
      .eq('language_code', languageCode);

    return data.translated_text;

  } catch (error) {
    console.error('Cache check error:', error);
    return null;
  }
}

/**
 * Translate text using OpenAI GPT-4o
 */
async function translateWithOpenAI(
  text: string,
  targetLanguage: string,
  contextKey: string
): Promise<string> {
  try {
    const languageName = LANGUAGE_MAP[targetLanguage] || targetLanguage;

    const prompt = `Translate this website text to ${languageName}.

Context: This is "${contextKey}" on the Unimog Community Hub.

${TRANSLATION_CONTEXT}

English text:
"${text}"

IMPORTANT: Return ONLY the translated text. No quotes, no explanations, no extra formatting.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3, // Lower temperature for consistent translations
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.choices[0].message.content.trim();

    // Remove quotes if OpenAI added them
    return translated.replace(/^["'](.*)["']$/, '$1');

  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

/**
 * Save translation to cache
 */
async function saveToCache(
  supabase: any,
  translationKey: string,
  languageCode: string,
  englishSource: string,
  translatedText: string,
  context: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('translation_cache')
      .insert({
        translation_key: translationKey,
        language_code: languageCode,
        english_source: englishSource,
        translated_text: translatedText,
        translation_service: 'openai-gpt4o',
        translation_context: context,
        usage_count: 1
      });

    if (error) {
      console.error('Cache save error:', error);
      // Don't throw - translation still succeeded
    } else {
      console.log(`💾 Cached translation for ${translationKey} (${languageCode})`);
    }

  } catch (error) {
    console.error('Cache save error:', error);
    // Don't throw - translation still succeeded
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify OpenAI API key
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({
        error: 'OpenAI API key not configured',
        fallback: true
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get request body
    const { translation_key, text, target_language, context } = await req.json();

    if (!text || !target_language) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: text, target_language',
        fallback: true
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Validate language code
    if (!LANGUAGE_MAP[target_language]) {
      return new Response(JSON.stringify({
        error: `Unsupported language: ${target_language}`,
        supported_languages: Object.keys(LANGUAGE_MAP),
        fallback: true
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client (admin for cache access)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Step 1: Check cache
    const cached = await checkCache(supabase, translation_key, target_language);
    if (cached) {
      return new Response(JSON.stringify({
        translated_text: cached,
        cached: true,
        language: target_language
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`🔄 Cache miss for ${translation_key} (${target_language}) - translating...`);

    // Step 2: Translate with OpenAI
    const translated = await translateWithOpenAI(
      text,
      target_language,
      context || translation_key
    );

    // Step 3: Save to cache
    await saveToCache(
      supabase,
      translation_key,
      target_language,
      text,
      translated,
      context || translation_key
    );

    // Step 4: Return translation
    return new Response(JSON.stringify({
      translated_text: translated,
      cached: false,
      language: target_language,
      translation_service: 'openai-gpt4o'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Edge function error:', error);

    // Return fallback response (use original English text)
    return new Response(JSON.stringify({
      error: error.message || 'Translation failed',
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
