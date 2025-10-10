# Translation System - How It Works

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Dependencies](#dependencies)
- [File Structure](#file-structure)
- [Configuration Explained](#configuration-explained)
- [Initialization Flow](#initialization-flow)
- [Using Translations in Components](#using-translations-in-components)
- [User Preference System](#user-preference-system)
- [Build Process Integration](#build-process-integration)
- [Adding New Languages](#adding-new-languages)
- [Adding New Translation Keys](#adding-new-translation-keys)
- [Common Pitfalls & Solutions](#common-pitfalls--solutions)
- [Debugging Guide](#debugging-guide)
- [The October 2025 Incident](#the-october-2025-incident)

---

## Overview

The Unimog Community Hub uses **i18next** for internationalization (i18n), enabling the platform to support multiple languages and country-specific configurations.

### Current Support

**Languages:**
- English (en) - Default
- German (de)
- Turkish (tr)
- Spanish (es)

**Countries:**
- Australia (AU) - English, Imperial units
- England (GB) - English, Imperial units
- Germany (DE) - German, Metric units
- Turkey (TR) - Turkish, Metric units
- Argentina (AR) - Spanish, Metric units

### Why i18next?

- Industry standard for React applications
- Asynchronous translation loading (better performance)
- Built-in language detection
- Server-side and client-side rendering support
- Rich ecosystem of plugins

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Browser Loads App                  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  main.tsx imports './lib/i18n'                  │
│  ├─ Triggers initializeI18n()                   │
│  └─ Happens BEFORE React renders                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  initializeI18n() async function                │
│  ├─ Fetch user preferences from Supabase        │
│  ├─ Initialize i18next with plugins              │
│  ├─ Load 'common' namespace explicitly          │
│  ├─ Change language to user preference          │
│  └─ Verify resources loaded successfully        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  i18next-http-backend Plugin                    │
│  ├─ Fetches: /locales/en/common.json            │
│  ├─ Parses JSON response                        │
│  └─ Stores in i18n.store.data                   │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│  React Components Render                        │
│  ├─ useTranslation() hook available             │
│  ├─ t('hero.title') → "Your Ultimate..."       │
│  └─ Real-time language switching supported      │
└─────────────────────────────────────────────────┘
```

---

## Dependencies

### Core Libraries

```json
{
  "i18next": "^25.0.0",
  "react-i18next": "^14.1.0",
  "i18next-http-backend": "^3.0.2",
  "i18next-browser-languagedetector": "^8.0.4"
}
```

### What Each Does

| Package | Purpose |
|---------|---------|
| `i18next` | Core translation engine, manages resources and language switching |
| `react-i18next` | React bindings for i18next, provides `useTranslation()` hook |
| `i18next-http-backend` | Loads translation files from `/locales/` via HTTP requests |
| `i18next-browser-languagedetector` | Auto-detects user language from browser settings |

---

## File Structure

```
public/
├── locales/
│   ├── en/
│   │   ├── common.json         # Homepage, shared UI strings
│   │   └── dashboard.json      # Dashboard-specific strings
│   ├── de/
│   │   ├── common.json
│   │   └── dashboard.json
│   ├── tr/
│   │   ├── common.json
│   │   └── dashboard.json
│   └── es/
│       ├── common.json
│       └── dashboard.json
│
src/
└── lib/
    └── i18n.ts                 # i18next configuration & initialization
```

### Translation File Structure

Example: `/public/locales/en/common.json`

```json
{
  "hero": {
    "title": "Your Ultimate Unimog Community Hub",
    "subtitle": "Connect with Unimog enthusiasts worldwide...",
    "cta_trial": "Start Free Trial",
    "cta_join": "Join the Community"
  },
  "features": {
    "section_title": "Everything You Need for Your Unimog Journey",
    "section_subtitle": "From technical support to adventure planning...",
    "marketplace": {
      "title": "Marketplace",
      "description": "Buy and sell Unimog parts..."
    }
  },
  "pricing": {
    "section_title": "Simple, Transparent Pricing",
    "monthly": {
      "title": "Monthly",
      "period": "/month",
      "cta": "Start Monthly"
    }
  }
}
```

**Key Structure Principles:**
- Nested objects for logical grouping
- Descriptive keys (not `btn1`, `text2`)
- Consistent naming: `section_title`, `section_subtitle`
- Interpolation support: `{{ variable }}`

---

## Configuration Explained

### File: `src/lib/i18n.ts`

```typescript
await i18n
  .use(Backend)                    // Load translations from /locales/
  .use(LanguageDetector)           // Auto-detect user language
  .use(initReactI18next)           // React bindings
  .init({
    fallbackLng: 'en',             // Use English if requested language fails
    defaultNS: 'common',           // Load common.json by default
    debug: import.meta.env.DEV,    // Enable debug logs in development

    interpolation: {
      escapeValue: false,          // React already escapes XSS
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',  // URL pattern
    },

    detection: {
      order: ['localStorage', 'navigator'],      // Check localStorage first
      caches: ['localStorage'],                  // Cache preference
    },

    react: {
      useSuspense: false,          // Don't suspend rendering during load
    },
  });
```

### Critical Configuration Options

#### `fallbackLng: 'en'`
**What it does**: If user's language (e.g., French) isn't supported, use English.
**Why critical**: Prevents showing translation keys if language missing.

#### `defaultNS: 'common'`
**What it does**: Tells i18next to load `common.json` by default.
**Why critical**: Without this, i18next looks for `translation.json` (doesn't exist).
**October 2025 Incident**: Missing this caused "Translation resources failed to load" error.

#### `debug: import.meta.env.DEV`
**What it does**: Logs translation loading, missing keys, language changes.
**Why critical**: Essential for debugging translation issues.
**Common mistake**: Using `process.env.NODE_ENV` (doesn't work in Vite).

#### `backend.loadPath`
**What it does**: Template for translation file URLs.
- `{{lng}}` = language code (en, de, tr, es)
- `{{ns}}` = namespace (common, dashboard)
- Result: `/locales/en/common.json`

**Why critical**: If path is wrong, no translations load.

#### INVALID OPTIONS ⚠️

These options **do NOT exist** in i18next-http-backend v3.0.2:

```typescript
backend: {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  requestOptions: {           // ❌ NOT VALID - causes silent failure
    cache: 'no-store'
  }
}
```

**Result of using invalid options**: Backend plugin fails silently, no translations load, components show translation keys instead of text.

---

## Initialization Flow

### Step-by-Step Execution

#### 1. App Loads (`main.tsx`)

```typescript
import './lib/i18n'  // ← Triggers initialization IMMEDIATELY
```

This runs **before** React renders anything.

#### 2. `initializeI18n()` Function Executes

```typescript
const initializeI18n = async () => {
  // STEP 1: Get user preferences from database
  const userPrefs = await getUserPreferences();

  // STEP 2: Determine default country and language
  let defaultCountry = 'GB';      // England
  let defaultLanguage = 'en';      // English

  if (userPrefs?.country && SUPPORTED_COUNTRIES[userPrefs.country]) {
    defaultCountry = userPrefs.country;
    defaultLanguage = userPrefs.language ||
                      SUPPORTED_COUNTRIES[userPrefs.country].defaultLanguage;
  }

  // STEP 3: Initialize i18next
  await i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({...});

  // STEP 4: Set country in localStorage
  localStorage.setItem('userCountry', defaultCountry);

  // STEP 5: Explicitly load 'common' namespace
  await i18n.loadNamespaces('common');

  // STEP 6: Change language (triggers resource loading)
  await i18n.changeLanguage(defaultLanguage);

  // STEP 7: Verify resources loaded
  const resources = i18n.store.data;
  if (!resources.en || !resources.en.common) {
    throw new Error('Translation initialization failed');
  }

  return i18n;
};
```

#### 3. Backend Plugin Loads Translations

When `i18n.loadNamespaces('common')` runs:

```
Browser → HTTP GET /locales/en/common.json
Server → Returns JSON with 200 OK
Backend → Parses JSON
Backend → Stores in i18n.store.data.en.common
```

#### 4. React Components Can Use Translations

After initialization completes, any component can:

```typescript
const { t } = useTranslation();
const title = t('hero.title');  // "Your Ultimate Unimog Community Hub"
```

---

## Using Translations in Components

### Basic Usage

```typescript
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('hero.cta_trial')}</button>
    </section>
  );
};
```

### With Interpolation

Translation file:
```json
{
  "pricing": {
    "prices_shown": "Prices shown in {{currency}} for {{country}}"
  }
}
```

Component:
```typescript
const { t } = useTranslation();

<p>{t('pricing.prices_shown', { currency: 'USD', country: 'USA' })}</p>
// Result: "Prices shown in USD for USA"
```

### Using Different Namespaces

```typescript
// Load dashboard namespace
const { t } = useTranslation('dashboard');

<h1>{t('welcome')}</h1>  // Loads from dashboard.json
```

### Multiple Namespaces

```typescript
const { t } = useTranslation(['common', 'dashboard']);

<h1>{t('common:hero.title')}</h1>
<p>{t('dashboard:stats.users')}</p>
```

### Dynamic Keys

```typescript
const features = ['marketplace', 'knowledge_base', 'trip_planner'];

{features.map(feature => (
  <div key={feature}>
    <h3>{t(`features.${feature}.title`)}</h3>
    <p>{t(`features.${feature}.description`)}</p>
  </div>
))}
```

---

## User Preference System

### Database Storage

User preferences stored in `profiles` table:

```sql
SELECT country, language FROM profiles WHERE id = 'user-uuid';
```

### How Preferences Are Applied

1. **On first visit**: Browser language detected → Stored in localStorage
2. **On return visit**: localStorage checked first → Falls back to database
3. **User changes preference**: Updated in localStorage + database

### Changing Language Programmatically

```typescript
import { changeLanguage } from '@/lib/i18n';

// User selects German from dropdown
await changeLanguage('de');

// This:
// 1. Loads /locales/de/common.json
// 2. Updates i18n instance
// 3. Saves to database (if user logged in)
// 4. Re-renders all components automatically
```

### Changing Country Programmatically

```typescript
import { changeCountry } from '@/lib/i18n';

// User selects Australia
await changeCountry('AU');

// This:
// 1. Sets localStorage 'userCountry' = 'AU'
// 2. Updates database profiles.country
// 3. Changes default language to 'en' (AU default)
// 4. Updates date/time/unit formats
```

---

## Build Process Integration

### Vite Configuration

`vite.config.ts`:

```typescript
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  publicDir: 'public',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/locales',  // Source directory
          dest: ''                 // Copy to dist/locales/
        }
      ]
    })
  ]
});
```

**What happens during build:**

1. Vite copies `public/locales/` → `dist/locales/`
2. All JSON files included in production build
3. Netlify serves from `dist/`
4. Browser fetches `/locales/en/common.json` → Served from `dist/locales/en/common.json`

### Netlify Build Verification

`netlify.toml`:

```bash
command = "npm run build && \
  if [ -d dist/locales/en ]; then
    echo 'Locales found' && ls -la dist/locales/en/;
  else
    echo 'ERROR: Translation files missing!';
    exit 1;
  fi"
```

**Build fails if** `dist/locales/en/` doesn't exist after build.

### JSON Headers

`netlify.toml`:

```toml
[[headers]]
  for = "/locales/**/*.json"
  [headers.values]
    Content-Type = "application/json; charset=utf-8"
    Cache-Control = "public, max-age=3600"
    Access-Control-Allow-Origin = "*"
```

**Why important:**
- Correct MIME type prevents browser parsing errors
- Cache-Control improves performance (1 hour cache)
- CORS allows loading from different domains (if needed)

---

## Adding New Languages

### Step 1: Add to Configuration

`src/lib/i18n.ts`:

```typescript
export const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇬🇧' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  es: { name: 'Español', flag: '🇦🇷' },
  fr: { name: 'Français', flag: '🇫🇷' }  // ← NEW
};
```

### Step 2: Create Translation Files

```bash
mkdir -p public/locales/fr
cp public/locales/en/common.json public/locales/fr/common.json
cp public/locales/en/dashboard.json public/locales/fr/dashboard.json
```

### Step 3: Translate All Strings

`public/locales/fr/common.json`:

```json
{
  "hero": {
    "title": "Votre hub communautaire Unimog ultime",
    "subtitle": "Connectez-vous avec des passionnés d'Unimog du monde entier...",
    "cta_trial": "Commencer l'essai gratuit",
    "cta_join": "Rejoindre la communauté"
  }
}
```

### Step 4: Test the Language

Add `?lng=fr` to URL:
```
https://yourdomain.com/?lng=fr
```

Or programmatically:
```typescript
await changeLanguage('fr');
```

### Step 5: Add Country Support (Optional)

If adding a French-speaking country:

```typescript
export const SUPPORTED_COUNTRIES = {
  // ... existing countries
  FR: {
    name: 'France',
    defaultLanguage: 'fr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    measurementSystem: 'metric',
    flag: '🇫🇷'
  }
};
```

---

## Adding New Translation Keys

### Step 1: Add to All Language Files

**English** (`public/locales/en/common.json`):
```json
{
  "marketplace": {
    "title": "Marketplace",
    "new_listing": "Create New Listing",
    "filters": {
      "price": "Price Range",
      "location": "Location",
      "condition": "Condition"
    }
  }
}
```

**German** (`public/locales/de/common.json`):
```json
{
  "marketplace": {
    "title": "Marktplatz",
    "new_listing": "Neue Anzeige erstellen",
    "filters": {
      "price": "Preisspanne",
      "location": "Standort",
      "condition": "Zustand"
    }
  }
}
```

Repeat for `tr/`, `es/` directories.

### Step 2: Use in Component

```typescript
const { t } = useTranslation();

<h1>{t('marketplace.title')}</h1>
<button>{t('marketplace.new_listing')}</button>

<select>
  <option>{t('marketplace.filters.price')}</option>
  <option>{t('marketplace.filters.location')}</option>
  <option>{t('marketplace.filters.condition')}</option>
</select>
```

### Best Practices

✅ **DO:**
- Use descriptive keys: `marketplace.filters.price`
- Group related strings: `{ "auth": { "sign_in": ..., "sign_up": ... } }`
- Keep keys lowercase with underscores: `new_listing`
- Add to ALL language files (even if translation is placeholder)

❌ **DON'T:**
- Use generic keys: `btn1`, `text2`, `label`
- Mix naming conventions: `signIn` vs `sign_up`
- Leave keys untranslated in non-English files (use English as placeholder)
- Hardcode strings in components

---

## Common Pitfalls & Solutions

### Problem 1: Showing Translation Keys Instead of Text

**Symptom:**
```
Homepage displays: "hero.title" instead of "Your Ultimate Unimog Community Hub"
```

**Possible Causes:**

#### Cause A: Missing `defaultNS`
```typescript
// WRONG - looks for translation.json
i18n.init({
  fallbackLng: 'en',
  // missing: defaultNS: 'common'
});

// CORRECT
i18n.init({
  fallbackLng: 'en',
  defaultNS: 'common',  // ← Matches common.json filename
});
```

#### Cause B: Resources Not Loaded
```typescript
// Missing explicit namespace loading
await i18n.init({...});

// FIX: Force namespace load
await i18n.loadNamespaces('common');
await i18n.changeLanguage('en');
```

#### Cause C: Invalid Backend Config
```typescript
// WRONG - requestOptions doesn't exist
backend: {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
  requestOptions: { cache: 'no-store' }  // ❌ Invalid
}

// CORRECT
backend: {
  loadPath: '/locales/{{lng}}/{{ns}}.json'
  // No requestOptions
}
```

### Problem 2: Wrong Environment Variable in Vite

**Symptom:**
```
debug: process.env.NODE_ENV === 'development'  // Always undefined
```

**Solution:**
```typescript
// WRONG - Vite doesn't support process.env.NODE_ENV
debug: process.env.NODE_ENV === 'development'

// CORRECT - Use Vite's import.meta.env
debug: import.meta.env.DEV
```

### Problem 3: Translation Files Not Found (404)

**Symptom:**
```
Browser console: GET /locales/en/common.json 404 Not Found
```

**Possible Causes:**

#### Cause A: Files Not Copied to dist/
Check `vite.config.ts`:
```typescript
viteStaticCopy({
  targets: [
    {
      src: 'public/locales',  // Must exist
      dest: ''                 // Copies to dist/locales
    }
  ]
})
```

Verify after build:
```bash
ls dist/locales/en/
# Should show: common.json dashboard.json
```

#### Cause B: Wrong loadPath
```typescript
// WRONG - missing leading slash
backend: {
  loadPath: 'locales/{{lng}}/{{ns}}.json'
}

// CORRECT - must start with /
backend: {
  loadPath: '/locales/{{lng}}/{{ns}}.json'
}
```

### Problem 4: Translations Not Updating After Change

**Symptom:**
Changed translation in `common.json` but component still shows old text.

**Solution:**
```bash
# 1. Clear browser cache
# 2. Hard reload (Cmd+Shift+R or Ctrl+Shift+R)
# 3. Check Cache-Control headers in netlify.toml
# 4. Check localStorage for cached language
localStorage.removeItem('i18nextLng');
```

### Problem 5: React Component Not Re-rendering on Language Change

**Symptom:**
Called `changeLanguage('de')` but component still shows English.

**Cause:**
Not using `useTranslation()` hook correctly.

**Wrong:**
```typescript
import i18n from '@/lib/i18n';

const Component = () => {
  const title = i18n.t('hero.title');  // ❌ Won't update
  return <h1>{title}</h1>;
};
```

**Correct:**
```typescript
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();  // ✅ Re-renders on language change
  return <h1>{t('hero.title')}</h1>;
};
```

---

## Debugging Guide

### Step 1: Check Network Tab

1. Open DevTools → Network tab
2. Filter by "common.json"
3. Refresh page
4. Look for: `GET /locales/en/common.json`

**Expected:**
- Status: 200 OK
- Type: application/json
- Response: Valid JSON with translations

**If 404:**
- Files not copied to dist/ during build
- Check vite.config.ts static copy plugin

**If 200 but wrong content:**
- Cached old version
- Hard reload or clear cache

### Step 2: Check i18next Debug Logs

Enable debug mode:
```typescript
i18n.init({
  debug: true,  // Always true for debugging
  ...
});
```

**Look for logs:**
```
i18next::translator: missingKey en common hero.title
i18next::backendConnector: loaded namespace common for language en
```

**If you see "missingKey":**
- Key doesn't exist in translation file
- Typo in key name
- Wrong namespace

### Step 3: Check i18n Store

Open browser console:
```javascript
// Check loaded resources
console.log(window.i18n.store.data);
// Should show: { en: { common: {...}, dashboard: {...} } }

// Check current language
console.log(window.i18n.language);
// Should show: "en"

// Test translation manually
console.log(window.i18n.t('hero.title'));
// Should show: "Your Ultimate Unimog Community Hub"
```

**If store.data is empty:**
- Resources not loaded
- Check initializeI18n() completed successfully

### Step 4: Check localStorage

```javascript
// Check cached language
console.log(localStorage.getItem('i18nextLng'));
// Should show: "en"

// Clear cache
localStorage.removeItem('i18nextLng');
location.reload();
```

### Step 5: Use React DevTools

1. Install React DevTools browser extension
2. Find component using translations
3. Inspect props/hooks
4. Look for `useTranslation()` return value:

```javascript
{
  t: ƒ t(),
  i18n: {...},
  ready: true,  // ← Should be true
  language: "en"
}
```

**If ready: false:**
- i18n still initializing
- Check for initialization errors in console

---

## The October 2025 Incident

On October 10, 2025, both production and staging sites showed translation keys (e.g., `hero.title`) instead of actual English text on the homepage.

### Root Cause

**Three-part failure:**

1. **Invalid `requestOptions` config** - Added to `backend` config in commit 91f9809e9
   ```typescript
   backend: {
     requestOptions: { cache: 'no-store' }  // ❌ NOT VALID
   }
   ```

2. **Missing `defaultNS`** - i18next looking for `translation.json` instead of `common.json`

3. **Missing explicit namespace loading** - Backend not fetching files automatically

### How It Was Fixed

**Commit 1:** Reverted hardcoded emergency fix
**Commit 2:** Added `defaultNS: 'common'`
**Commit 3:** Added `await i18n.loadNamespaces('common')`

### Prevention Measures Now in Place

1. ✅ Resource verification throws error if English resources fail to load
2. ✅ Better error logging with i18n state debugging
3. ✅ Comprehensive incident documentation
4. ✅ This how-it-works guide
5. ✅ Always verify i18next-http-backend options against official docs

**Full incident report:** [TRANSLATION_SYSTEM_INCIDENT_OCT_2025.md](./TRANSLATION_SYSTEM_INCIDENT_OCT_2025.md)

---

## Reference Links

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [i18next-http-backend Documentation](https://github.com/i18next/i18next-http-backend)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Last Updated:** October 10, 2025
**Maintainer:** Claude Code
**Version:** 1.0
