# Hybrid AI Translation System - Implementation Guide

## Overview

The Hybrid AI Translation System combines **build-time translation** (for 98% of the site) with **runtime translation fallback** (for dynamic/missing content) using your existing OpenAI GPT-4o API.

**Cost**: ~$0.03 per build-time translation run + ~$0.01 per runtime translation (cached after first use)

**Result**: Entire site translated to German, Turkish, and Argentine Spanish with automatic fallback for new content.

---

## Components

### 1. Build-Time Translation Script
📄 `scripts/translate-with-openai.js`

Pre-translates the entire site before deployment.

**What it does:**
- Reads `public/locales/en/common.json` (English source)
- Translates to German, Turkish, Spanish using OpenAI GPT-4o
- Preserves existing manual corrections
- Saves to `public/locales/{de,tr,es}/common.json`

**Usage:**
```bash
# Install OpenAI SDK (one-time)
npm install --save-dev openai

# Set API key (same key used for Barry AI)
export OPENAI_API_KEY=your_openai_key

# Run translation
node scripts/translate-with-openai.js

# Output:
# ✅ Translating to German (de)...
# ✅ Translating to Turkish (tr)...
# ✅ Translating to Argentine Spanish (es)...
# ✅ All translations complete!
```

### 2. Database Migration
📄 `supabase/migrations/20251011_create_translation_cache.sql`

Creates tables for runtime translation cache.

**Tables created:**
- `translation_cache` - Stores runtime AI translations
- `translation_corrections` - Audit log of admin corrections

**Auto-applied on deployment**

### 3. Runtime Translation Edge Function
📄 `supabase/functions/translate-text/index.ts`

Handles on-the-fly translation for missing keys.

**Flow:**
1. User visits site in German → i18next detects missing key
2. Frontend calls Edge Function
3. Check `translation_cache` table
4. If cached → return instantly (<100ms)
5. If not cached → translate with OpenAI GPT-4o (~2-3 seconds)
6. Save to cache for future users
7. Return translated text

**Deployed to Supabase automatically**

### 4. Modified i18n Configuration
📄 `src/lib/i18n.ts`

Added `saveMissing` support for runtime translation.

**New features:**
- `translateMissing()` function - calls Edge Function
- `missingKeyHandler` - detects missing keys
- Automatic resource injection after translation

### 5. Admin Translation Management
📄 `src/components/admin/TranslationManagement.tsx`

Admin panel for reviewing AI translations.

**Features:**
- View all cached translations
- Filter by language and verification status
- Verify correct translations
- Edit and correct AI translations
- Delete incorrect translations
- Bulk verify all translations

**Access:** Admin Dashboard → Translations tab

---

## Deployment Workflow

### Step 1: Install Dependencies

```bash
# Install OpenAI SDK for build-time script
npm install --save-dev openai
```

### Step 2: Run Build-Time Translation

```bash
# Set OpenAI API key
export OPENAI_API_KEY=your_openai_key

# Translate entire site
node scripts/translate-with-openai.js

# Review generated files
cat public/locales/de/common.json
cat public/locales/tr/common.json
cat public/locales/es/common.json
```

**Expected output:**
```
🌐 Hybrid AI Translation System - Build-Time Component

Using OpenAI GPT-4o (same API as Barry AI)

📖 Read English source: public/locales/en/common.json
   Top-level keys: 15
   Languages: de, tr, es

============================================================
Translating to German (de)
============================================================
  [1/200] Translating hero.title...
  [2/200] Translating hero.subtitle...
  ...
  [200/200] Translating footer.copyright...

📊 Statistics for German:
   Total keys: 200
   Translated: 150
   Preserved: 50 (existing manual corrections)
   Errors: 0

✅ Saved to public/locales/de/common.json

[Repeats for Turkish and Spanish]

✅ All translations complete!
```

### Step 3: Test Locally

```bash
# Build the site
npm run build

# Preview locally
npm run preview

# Open browser to http://localhost:4173
# Change language to German/Turkish/Spanish
# Verify translations appear correctly
```

### Step 4: Commit and Deploy to Staging

```bash
# Stage all changes
git add -A

# Commit
git commit -m "feat: Add hybrid AI translation system with OpenAI GPT-4o

- Build-time translation script for German, Turkish, Spanish
- Runtime translation fallback Edge Function
- Database cache for translated content
- Admin panel for translation review
- Modified i18n.ts for saveMissing support

Cost: ~$0.03 per build + $0.01 per runtime translation (cached)
Uses existing OpenAI API key (same as Barry AI)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to staging
git push staging main:main
```

### Step 5: Verify on Staging

1. **Check Netlify build logs:**
   - Migration should auto-apply
   - Edge Function should deploy
   - Translation files should be included in build

2. **Test staging site:**
   - Navigate to staging URL
   - Change language to German
   - Verify homepage is translated
   - Check navbar, features, pricing sections

3. **Test runtime translation:**
   - Add a new English string without translation
   - Switch to German
   - Should translate automatically (2-3 second delay first time)
   - Check admin dashboard → Translations tab
   - Verify translation appears in cache

### Step 6: Review Translations (Admin Panel)

1. **Navigate to Admin Dashboard:**
   - Log in as admin
   - Go to Admin → Translations tab

2. **Review statistics:**
   - Total translations
   - Verified vs unverified
   - Translations by language

3. **Review quality:**
   - Check unverified translations
   - Verify correct ones (click checkmark)
   - Edit incorrect ones (click edit icon)
   - Add correction reason

4. **Bulk verify:**
   - If all look good, click "Verify All"

### Step 7: Deploy to Production

```bash
# ONLY after user approval!
git push origin main
```

---

## Usage Examples

### Example 1: Homepage Hero Section

**English source (`en/common.json`):**
```json
{
  "hero": {
    "title": "Your Ultimate Unimog Community Hub",
    "subtitle": "Connect with Unimog enthusiasts worldwide",
    "cta_trial": "Start Free Trial"
  }
}
```

**After build-time translation (`de/common.json`):**
```json
{
  "hero": {
    "title": "Ihr ultimativer Unimog Community Hub",
    "subtitle": "Verbinden Sie sich mit Unimog-Enthusiasten weltweit",
    "cta_trial": "Kostenlose Testversion starten"
  }
}
```

**Component usage:**
```typescript
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('hero.cta_trial')}</button>
    </div>
  );
};
```

### Example 2: Runtime Translation Fallback

**Scenario:** Admin adds new feature with English text, forgets to translate

**English source:**
```json
{
  "new_feature": {
    "title": "Trip Collaboration"
  }
}
```

**German file missing this key.**

**What happens:**
1. German user visits page → sees "Trip Collaboration" (fallback to English)
2. i18next detects missing key for `de`
3. Calls `translateMissing()` function
4. Edge Function called: `translate-text`
5. OpenAI translates: "Trip Collaboration" → "Reisezusammenarbeit"
6. Saved to `translation_cache` table
7. Returned to user (~2-3 seconds)
8. Next German user sees translation instantly (from cache)
9. Admin reviews in Translations tab, verifies or corrects

---

## Admin Panel Guide

### Translations Tab

**Location:** Admin Dashboard → Translations

**Statistics Cards:**
- **Total Translations** - All cached runtime translations
- **Verified** - Admin-approved translations (green)
- **Unverified** - Awaiting admin review (orange)
- **Languages** - Breakdown by German, Turkish, Spanish

**Filters:**
- **Language:** All / German / Turkish / Spanish
- **Status:** All / Verified Only / Unverified Only

**Actions:**
- **Verify (✓)** - Mark translation as correct
- **Edit (✏️)** - Correct translation, add reason
- **Delete (🗑️)** - Remove translation (users see English until re-translated)
- **Verify All** - Bulk approve all unverified translations

**Table Columns:**
- **Key** - i18next path (e.g., `hero.title`)
- **Language** - Target language badge
- **English Source** - Original English text
- **Translation** - AI-generated translation
- **Usage** - How many times served to users
- **Status** - Verified (green) or Unverified (orange)
- **Actions** - Verify, Edit, Delete buttons

---

## Cost Breakdown

### Build-Time Translation
- **Frequency:** Once per English source update (~weekly)
- **Strings:** ~200 strings
- **Languages:** 3 (German, Turkish, Spanish)
- **Total API calls:** 600 (200 × 3)
- **Model:** GPT-4o
- **Cost per call:** ~$0.00005
- **Total cost:** ~$0.03 per run

### Runtime Translation
- **Frequency:** Per missing key, per language
- **Strings:** ~10 new strings per week (estimated)
- **Languages:** 3
- **Total API calls:** 30 per week
- **Model:** GPT-4o
- **Cost per call:** ~$0.0003
- **Total cost:** ~$0.01 per week
- **Cache:** After first translation, all future requests are free (database cache)

### Total Monthly Cost
- Build-time: 4 runs × $0.03 = **$0.12/month**
- Runtime: 4 weeks × $0.01 = **$0.04/month**
- **Grand total: ~$0.16/month**

**Essentially free** - covered by existing OpenAI subscription for Barry AI.

---

## Troubleshooting

### Issue: Translations not appearing

**Symptoms:** Language selector shows German, but text is still English

**Solutions:**
1. Check browser console for errors
2. Verify translation files exist:
   ```bash
   ls -la public/locales/de/
   ls -la public/locales/tr/
   ls -la public/locales/es/
   ```
3. Check Netlify build logs for copy errors
4. Verify `vite.config.ts` has `viteStaticCopy` plugin configured
5. Clear browser cache and reload

### Issue: Runtime translation not working

**Symptoms:** Missing keys show English, no translation happens

**Solutions:**
1. Check browser console for Edge Function errors
2. Verify Edge Function deployed:
   - Supabase Dashboard → Edge Functions
   - Should see `translate-text` function
3. Check `OPENAI_API_KEY` set in Supabase Edge Function secrets
4. Test Edge Function directly:
   ```javascript
   const { data, error } = await supabase.functions.invoke('translate-text', {
     body: {
       translation_key: 'test.key',
       text: 'Hello World',
       target_language: 'de',
       context: 'test'
     }
   });
   console.log(data, error);
   ```
5. Check `translation_cache` table exists:
   ```sql
   SELECT * FROM translation_cache LIMIT 5;
   ```

### Issue: Build-time script fails

**Symptoms:** `node scripts/translate-with-openai.js` errors

**Solutions:**
1. Verify OpenAI API key set:
   ```bash
   echo $OPENAI_API_KEY
   ```
2. Install OpenAI SDK:
   ```bash
   npm install --save-dev openai
   ```
3. Check source file exists:
   ```bash
   cat public/locales/en/common.json
   ```
4. Check OpenAI API rate limits (3 requests/second on free tier)
5. Re-run with increased delay:
   ```javascript
   // In script, change:
   await new Promise(resolve => setTimeout(resolve, 350)); // to 500ms
   ```

### Issue: Admin panel not loading

**Symptoms:** Translations tab shows loading spinner forever

**Solutions:**
1. Check browser console for lazy load errors
2. Verify component export:
   ```typescript
   // src/components/admin/TranslationManagement.tsx
   export default function TranslationManagement() { ... }
   ```
3. Clear build cache:
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```
4. Check database RLS policies:
   ```sql
   SELECT * FROM translation_cache LIMIT 1;
   ```

---

## Maintenance

### Updating English Source

When you add new English strings:

```bash
# 1. Edit English source
nano public/locales/en/common.json

# 2. Run translation script
export OPENAI_API_KEY=your_key
node scripts/translate-with-openai.js

# 3. Commit and deploy
git add public/locales/
git commit -m "feat: Add new translations for [feature]"
git push staging main:main
```

**Script will:**
- Translate ONLY new/missing keys
- Preserve existing translations
- Skip manually corrected translations

### Re-translating Everything

If you want to regenerate all translations:

```bash
# 1. Delete existing translation files
rm public/locales/de/common.json
rm public/locales/tr/common.json
rm public/locales/es/common.json

# 2. Run script
node scripts/translate-with-openai.js

# 3. Review and deploy
git add public/locales/
git commit -m "refactor: Regenerate all translations"
git push staging main:main
```

### Clearing Runtime Cache

If runtime translations have errors:

**Option 1: Delete specific translation**
- Admin Dashboard → Translations
- Find incorrect translation
- Click delete icon
- Next user will trigger re-translation

**Option 2: Delete all unverified**
```sql
DELETE FROM translation_cache WHERE is_verified = false;
```

**Option 3: Delete all for specific language**
```sql
DELETE FROM translation_cache WHERE language_code = 'de';
```

---

## Future Enhancements

### Switch to Google Gemini

If you prefer Gemini over OpenAI:

**Build-time script:**
```javascript
// Replace OpenAI import
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function translateString(text, targetLanguage, contextKey = '') {
  const prompt = `Translate to ${targetLanguage}: "${text}"`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
```

**Edge Function:**
```typescript
// Similar changes in translate-text/index.ts
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
```

**Benefits:**
- Faster (1-2 seconds vs 2-3 seconds)
- Same cost (already paying)
- Excellent multilingual support

**Drawbacks:**
- Slightly less context-aware than GPT-4o
- May need more prompt engineering

### Add More Languages

**1. Update i18n.ts:**
```typescript
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  es: { name: 'Español', flag: '🇦🇷' },
  fr: { name: 'Français', flag: '🇫🇷' },  // NEW
  it: { name: 'Italiano', flag: '🇮🇹' }   // NEW
};
```

**2. Update translation script:**
```javascript
const TARGET_LANGUAGES = {
  de: 'German',
  tr: 'Turkish',
  es: 'Argentine Spanish',
  fr: 'French',  // NEW
  it: 'Italian'  // NEW
};
```

**3. Run script:**
```bash
node scripts/translate-with-openai.js
# Will auto-translate to new languages
```

### Automatic Translation on Commit

Add pre-commit hook:

```bash
# .git/hooks/pre-commit

#!/bin/bash

# Check if English source changed
if git diff --cached --name-only | grep -q "public/locales/en/common.json"; then
  echo "🌐 English source changed - running translation..."

  node scripts/translate-with-openai.js

  git add public/locales/de/common.json
  git add public/locales/tr/common.json
  git add public/locales/es/common.json

  echo "✅ Translations updated automatically"
fi
```

---

## Summary

**What you have now:**

✅ **Build-time translation** - 98% of site pre-translated (instant for users)
✅ **Runtime fallback** - Missing keys auto-translate on-the-fly
✅ **Admin review panel** - Review and correct AI translations
✅ **Database caching** - Runtime translations cached for future users
✅ **Cost-effective** - ~$0.16/month (covered by existing OpenAI subscription)
✅ **Three languages** - German, Turkish, Argentine Spanish
✅ **Quality control** - Admin can verify, edit, or delete translations
✅ **Audit trail** - All corrections logged in `translation_corrections`
✅ **Preservation** - Manual corrections never overwritten
✅ **Extensible** - Easy to add more languages or switch to Gemini

**Next steps:**

1. Install OpenAI SDK: `npm install --save-dev openai`
2. Run translation script: `node scripts/translate-with-openai.js`
3. Test locally: `npm run build && npm run preview`
4. Deploy to staging: `git push staging main:main`
5. Review in admin panel: Admin → Translations
6. Deploy to production (with user approval): `git push origin main`

---

## Support

**Questions?** Check:
- `/docs/AI_TRANSLATION_OPTIONS.md` - Original research and options comparison
- `/docs/TRANSLATION_SYSTEM_HOW_IT_WORKS.md` - Deep dive into i18next architecture
- `/docs/TRANSLATION_SYSTEM_INCIDENT_OCT_2025.md` - Lessons learned from production incident

**Issues?** See Troubleshooting section above.

**Want to contribute?** Improve translation quality by reviewing in Admin → Translations tab!

---

**Last Updated:** October 11, 2025
**Author:** Claude Code
**Version:** 1.0 - Hybrid AI Translation System
