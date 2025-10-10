# AI-Powered Automatic Translation Options

## Overview
This document outlines how to implement automatic translation using your **existing AI services** (OpenAI GPT-4o and Google Gemini) to avoid additional costs.

---

## 🎯 Available AI Services

### 1. OpenAI GPT-4o
- **Status**: Already paying for Barry AI
- **Environment Variable**: `OPENAI_API_KEY` (in Edge Function)
- **Cost**: Already covered by existing subscription
- **Translation Quality**: Excellent (context-aware, nuanced)
- **Speed**: Fast (~2-3 seconds per string)

### 2. Google Gemini Flash 1.5
- **Status**: Already paying for platform services
- **Environment Variable**: `VITE_GEMINI_API_KEY`
- **Cost**: Already covered by existing subscription
- **Translation Quality**: Excellent (multilingual, context-aware)
- **Speed**: Very fast (~1-2 seconds per string)

---

## 🔥 Recommended Solution: Build-Time Translation with OpenAI

**Why Build-Time?**
- ✅ No performance impact on users (translations pre-generated)
- ✅ Better translation quality (batch context provided)
- ✅ Free - uses existing OpenAI API
- ✅ One-time translation (not repeated for every user)
- ✅ Reviewable before deployment (can fix mistakes)

**How It Works:**
1. Run script before deployment
2. Script reads `en/common.json` (source of truth)
3. OpenAI translates to German, Turkish, Spanish, Argentine
4. Generated files saved to `de/common.json`, `tr/common.json`, etc.
5. Netlify deploys with all translations ready

---

## 📋 Implementation Plan

### Option 1: Build-Time Translation Script (RECOMMENDED)

**File**: `scripts/translate-with-openai.js`

```javascript
/**
 * Automatic Translation Script using OpenAI GPT-4o
 *
 * Usage:
 *   node scripts/translate-with-openai.js
 *
 * What it does:
 *   1. Reads public/locales/en/common.json
 *   2. Translates to de, tr, es (configured languages)
 *   3. Saves to public/locales/{lang}/common.json
 *   4. Preserves existing translations (only fills missing)
 */

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Configure OpenAI (using same key as Barry AI)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Target languages (from SUPPORTED_LANGUAGES in i18n.ts)
const TARGET_LANGUAGES = {
  de: 'German',
  tr: 'Turkish',
  es: 'Argentine Spanish'
};

// Context for better translations
const TRANSLATION_CONTEXT = `
You are translating the Unimog Community Hub website.

Key terminology:
- "Unimog" = proper noun, never translate
- "Portal axles" = technical term (German: "Portalachsen", Turkish: "Portal dingiller")
- "Community Hub" = keep "Community" in English, translate "Hub"
- "Marketplace" = where users buy/sell Unimog parts
- "Trip Planner" = GPS route planning tool
- "Barry" = AI mechanic assistant name (never translate)

Tone: Professional, friendly, welcoming to enthusiasts
Audience: Unimog owners, mechanics, off-road adventurers
`;

async function translateString(text, targetLanguage, contextKey = '') {
  try {
    const prompt = `Translate the following English text to ${targetLanguage}.

Context: This is a ${contextKey} on a Unimog community website.

${TRANSLATION_CONTEXT}

English text:
"${text}"

Return ONLY the translated text, no explanations.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // Lower temperature for consistent translations
      max_tokens: 200
    });

    const translated = response.choices[0].message.content.trim();
    // Remove quotes if OpenAI added them
    return translated.replace(/^["'](.*)["']$/, '$1');

  } catch (error) {
    console.error(`Translation error for "${text}":`, error.message);
    return text; // Fallback to original text
  }
}

async function translateObject(obj, targetLanguage, parentKey = '') {
  const translated = {};

  for (const [key, value] of Object.entries(obj)) {
    const contextKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof value === 'string') {
      console.log(`Translating ${contextKey}...`);
      translated[key] = await translateString(value, targetLanguage, contextKey);

      // Rate limiting (OpenAI allows 3 requests/second on free tier)
      await new Promise(resolve => setTimeout(resolve, 350));

    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLanguage, contextKey);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}

async function translateLanguage(sourceData, langCode, langName) {
  console.log(`\n=== Translating to ${langName} (${langCode}) ===\n`);

  const targetPath = path.join(__dirname, '../public/locales', langCode, 'common.json');

  // Load existing translations (don't overwrite manually corrected ones)
  let existingTranslations = {};
  if (fs.existsSync(targetPath)) {
    existingTranslations = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
  }

  // Merge: Keep existing, translate missing
  const mergedData = { ...sourceData };
  const translated = await translateObject(mergedData, langName);

  // Deep merge with existing (prefer existing over new translations)
  const finalTranslations = deepMerge(existingTranslations, translated);

  // Save to file
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(targetPath, JSON.stringify(finalTranslations, null, 2), 'utf-8');
  console.log(`✅ Saved to ${targetPath}`);
}

function deepMerge(target, source) {
  const output = { ...target };

  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (!(key in target)) {
      // Only add if not already translated
      output[key] = source[key];
    }
  }

  return output;
}

async function main() {
  try {
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY environment variable not set');
      console.error('Set it in your .env file or run: export OPENAI_API_KEY=your_key');
      process.exit(1);
    }

    // Read English source file
    const sourcePath = path.join(__dirname, '../public/locales/en/common.json');
    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Source file not found: ${sourcePath}`);
      process.exit(1);
    }

    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
    console.log(`📖 Read ${Object.keys(sourceData).length} top-level keys from English source`);

    // Translate to each target language
    for (const [langCode, langName] of Object.entries(TARGET_LANGUAGES)) {
      await translateLanguage(sourceData, langCode, langName);
    }

    console.log('\n✅ All translations complete!');
    console.log('\nNext steps:');
    console.log('1. Review translations in public/locales/{de,tr,es}/common.json');
    console.log('2. Test on staging: npm run build && git push staging main:main');
    console.log('3. If good, deploy to production');

  } catch (error) {
    console.error('❌ Translation script error:', error);
    process.exit(1);
  }
}

main();
```

**Install Dependencies:**
```bash
npm install --save-dev openai
```

**Usage:**
```bash
# Set OpenAI API key (same one used for Barry)
export OPENAI_API_KEY=your_openai_key

# Run translation
node scripts/translate-with-openai.js

# Review generated files
ls -la public/locales/de/
ls -la public/locales/tr/
ls -la public/locales/es/

# Test build
npm run build

# Deploy to staging
git add public/locales/
git commit -m "feat: Add AI-generated translations for DE, TR, ES"
git push staging main:main
```

**Cost Estimate:**
- ~200 strings to translate
- 3 languages × 200 strings = 600 API calls
- Cost: ~$0.03 per translation run
- **Essentially free** (covered by existing subscription)

---

## 📋 Option 2: Runtime Translation with saveMissing (WordPress-Style)

**How It Works:**
1. User visits site in German
2. i18next looks for `de/common.json` → finds missing keys
3. Sends English text to OpenAI Edge Function
4. OpenAI translates on-the-fly
5. Returns translated text + saves to database
6. Next user gets cached translation

**File**: `src/lib/i18n.ts` (Modified)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/lib/supabase-client';

// NEW: Translation cache table
// CREATE TABLE translation_cache (
//   key text PRIMARY KEY,
//   language text NOT NULL,
//   value text NOT NULL,
//   created_at timestamptz DEFAULT now()
// );

// NEW: Runtime translation function
async function translateMissing(key: string, defaultValue: string, language: string): Promise<string> {
  try {
    // Check cache first
    const { data: cached } = await supabase
      .from('translation_cache')
      .select('value')
      .eq('key', key)
      .eq('language', language)
      .single();

    if (cached) {
      return cached.value;
    }

    // Translate using OpenAI Edge Function
    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: {
        text: defaultValue,
        target_language: language,
        context: key
      }
    });

    if (error) {
      console.error('Translation error:', error);
      return defaultValue;
    }

    const translated = data.translated_text;

    // Save to cache
    await supabase.from('translation_cache').insert({
      key,
      language,
      value: translated
    });

    return translated;

  } catch (error) {
    console.error('Runtime translation error:', error);
    return defaultValue;
  }
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
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // NEW: Save missing translations to database
    saveMissing: true,
    missingKeyHandler: async (lngs, ns, key, fallbackValue) => {
      if (lngs[0] === 'en') return; // Don't translate English

      const translated = await translateMissing(key, fallbackValue, lngs[0]);

      // Update i18next store
      i18n.addResource(lngs[0], ns, key, translated);
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },

    react: {
      useSuspense: false,
    },
  });
```

**Edge Function**: `/supabase/functions/translate-text/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.20.1';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const LANGUAGE_MAP = {
  'de': 'German',
  'tr': 'Turkish',
  'es': 'Argentine Spanish'
};

serve(async (req) => {
  try {
    const { text, target_language, context } = await req.json();

    if (!text || !target_language) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: `Translate this Unimog Community Hub website text to ${LANGUAGE_MAP[target_language]}:

Context: ${context}

English: "${text}"

Return ONLY the translation, no explanations.`
      }],
      temperature: 0.3,
      max_tokens: 200
    });

    const translated = response.choices[0].message.content.trim();

    return new Response(JSON.stringify({
      translated_text: translated.replace(/^["'](.*)["']$/, '$1')
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
```

**Pros:**
- ✅ True "on-the-fly" translation (like WordPress plugins)
- ✅ Auto-translates missing keys
- ✅ Cached for future users

**Cons:**
- ❌ First user sees delay (2-3 seconds for translation)
- ❌ Costs add up with many users
- ❌ Requires database table for cache
- ❌ Translation quality may vary (no review before deploy)

---

## 📋 Option 3: Hybrid Approach (Best of Both Worlds)

**Strategy:**
1. Use **build-time script** to pre-translate 98% of site
2. Use **runtime translation** as fallback for dynamic content
3. Admin can manually correct AI translations via admin panel

**Benefits:**
- ✅ Fast for users (pre-translated)
- ✅ Flexible for new content (runtime fallback)
- ✅ Human-reviewed quality
- ✅ Cost-effective

---

## 🎯 Which Option Should You Choose?

| Factor | Build-Time | Runtime | Hybrid |
|--------|-----------|---------|--------|
| **Cost** | ~$0.03 per run | ~$0.05 per user | ~$0.10 total |
| **Speed** | Instant | 2-3s first load | Instant + fallback |
| **Quality** | Reviewable | Variable | Reviewable + auto |
| **Complexity** | Simple | Medium | Complex |
| **WordPress-like** | ❌ | ✅ | ✅ |
| **Recommended** | ✅ | ⚠️ | 🏆 |

**My Recommendation: Start with Build-Time (Option 1)**

Why?
1. Your site is **98% hardcoded English** - one script translates everything
2. **Free** with existing OpenAI subscription
3. **No performance impact** on users
4. You can **review translations** before deploying
5. Easy to re-run when you update English text

**Later, add runtime translation** if you need dynamic content or user-generated content translated.

---

## 🚀 Next Steps (If You Want Build-Time Translation)

1. **Copy script** from Option 1 to `scripts/translate-with-openai.js`
2. **Install OpenAI SDK**: `npm install --save-dev openai`
3. **Set API key**: Add `OPENAI_API_KEY=your_key` to your local `.env` file
4. **Run translation**: `node scripts/translate-with-openai.js`
5. **Review output**: Check `public/locales/de/common.json` for quality
6. **Test locally**: `npm run build && npm run preview`
7. **Deploy to staging**: `git push staging main:main`
8. **Verify on staging**: Check homepage in German, Turkish, Spanish
9. **Deploy to production**: `git push origin main` (with permission)

---

## 💡 Google Gemini Alternative

If you prefer Gemini over OpenAI, replace the OpenAI code with:

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function translateString(text, targetLanguage, contextKey = '') {
  const prompt = `Translate to ${targetLanguage}: "${text}"`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
```

**Gemini Benefits:**
- Faster (1-2s vs 2-3s for OpenAI)
- Same cost (already paying)
- Excellent multilingual support

**Gemini Drawbacks:**
- Slightly less context-aware than GPT-4o
- May need more prompt engineering

---

## 📊 Comparison: OpenAI vs Gemini for Translation

| Feature | OpenAI GPT-4o | Google Gemini Flash 1.5 |
|---------|---------------|-------------------------|
| **Quality** | Excellent | Excellent |
| **Speed** | 2-3 seconds | 1-2 seconds |
| **Context Awareness** | Best-in-class | Very good |
| **Cost** | Already paying | Already paying |
| **API Simplicity** | Very simple | Simple |
| **Recommended For** | Nuanced translations | Fast bulk translations |

---

## 🎉 Summary

**You have 3 options:**

1. **Build-Time Translation** (Recommended) - Pre-translate everything, review, deploy
2. **Runtime Translation** (WordPress-style) - Translate on-the-fly when keys missing
3. **Hybrid** (Best Quality) - Pre-translate + runtime fallback

**All options use your existing AI services at no additional cost.**

Let me know which approach you prefer, and I'll help you implement it!
