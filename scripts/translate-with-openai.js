/**
 * Hybrid AI Translation Script - Build-Time Component
 *
 * Uses OpenAI GPT-4o (same API key as Barry AI) to pre-translate the entire site.
 * This handles 98% of translations at build time for instant user experience.
 *
 * Usage:
 *   node scripts/translate-with-openai.js
 *
 * What it does:
 *   1. Reads public/locales/en/common.json (English source of truth)
 *   2. Translates to German, Turkish, Argentine Spanish using OpenAI
 *   3. Preserves existing manual corrections (only fills missing keys)
 *   4. Saves to public/locales/{de,tr,es}/common.json
 *   5. Logs progress and statistics
 *
 * Cost: ~$0.03 per run (covered by existing OpenAI subscription)
 * Time: ~5 minutes for 200 strings
 */

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Configure OpenAI (using same key as Barry AI)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Target languages from SUPPORTED_LANGUAGES in i18n.ts
const TARGET_LANGUAGES = {
  de: 'German',
  tr: 'Turkish',
  es: 'Argentine Spanish'
};

// Unimog-specific translation context
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
- "Trip planner" → German: "Routenplaner", Turkish: "Gezi planlayıcı", Spanish: "Planificador de viajes"

STYLE GUIDELINES:
- Tone: Professional, friendly, welcoming
- Audience: Unimog owners, mechanics, off-road enthusiasts
- Keep "Community" in English when part of brand name
- Preserve placeholder variables like {{name}}, {count}, etc.

EXAMPLES:
- "Start Free Trial" → German: "Kostenlose Testversion starten"
- "Marketplace" → German: "Marktplatz", Turkish: "Pazar Yeri", Spanish: "Mercado"
- "Connect with Barry" → German: "Mit Barry verbinden", Turkish: "Barry ile bağlan", Spanish: "Conectar con Barry"
`;

// Statistics tracking
let stats = {
  total: 0,
  translated: 0,
  skipped: 0,
  errors: 0
};

/**
 * Translate a single string using OpenAI GPT-4o
 */
async function translateString(text, targetLanguage, contextKey = '') {
  try {
    const prompt = `Translate this website text to ${targetLanguage}.

Context: This is "${contextKey}" on the Unimog Community Hub.

${TRANSLATION_CONTEXT}

English text:
"${text}"

IMPORTANT: Return ONLY the translated text. No quotes, no explanations, no extra formatting.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, // Lower temperature for consistent translations
      max_tokens: 200
    });

    const translated = response.choices[0].message.content.trim();

    // Remove quotes if OpenAI added them
    const cleaned = translated.replace(/^["'](.*)["']$/, '$1');

    stats.translated++;
    return cleaned;

  } catch (error) {
    console.error(`❌ Translation error for "${text}":`, error.message);
    stats.errors++;
    return text; // Fallback to original text
  }
}

/**
 * Recursively translate nested JSON object
 */
async function translateObject(obj, targetLanguage, parentKey = '') {
  const translated = {};

  for (const [key, value] of Object.entries(obj)) {
    const contextKey = parentKey ? `${parentKey}.${key}` : key;
    stats.total++;

    if (typeof value === 'string') {
      console.log(`  [${stats.translated + 1}/${stats.total}] Translating ${contextKey}...`);
      translated[key] = await translateString(value, targetLanguage, contextKey);

      // Rate limiting (OpenAI allows 3 requests/second on standard tier)
      // Wait 350ms between requests to stay under limit
      await new Promise(resolve => setTimeout(resolve, 350));

    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLanguage, contextKey);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}

/**
 * Deep merge two objects, preferring existing values
 */
function deepMerge(existing, newData) {
  const output = { ...existing };

  for (const key in newData) {
    if (newData[key] instanceof Object && key in existing && existing[key] instanceof Object) {
      // Recursively merge nested objects
      output[key] = deepMerge(existing[key], newData[key]);
    } else if (!(key in existing)) {
      // Only add if key doesn't exist (preserves manual corrections)
      output[key] = newData[key];
    } else {
      // Key exists - keep existing value (manual corrections preserved)
      stats.skipped++;
    }
  }

  return output;
}

/**
 * Translate English source to target language
 */
async function translateLanguage(sourceData, langCode, langName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Translating to ${langName} (${langCode})`);
  console.log('='.repeat(60));

  const targetPath = path.join(__dirname, '../public/locales', langCode, 'common.json');

  // Reset stats for this language
  stats = { total: 0, translated: 0, skipped: 0, errors: 0 };

  // Load existing translations (preserve manual corrections)
  let existingTranslations = {};
  if (fs.existsSync(targetPath)) {
    existingTranslations = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    console.log(`📂 Found existing translations: ${targetPath}`);
  } else {
    console.log(`📝 Creating new translation file: ${targetPath}`);
  }

  // Translate all keys from English source
  const translated = await translateObject(sourceData, langName);

  // Merge: Prefer existing translations over new ones
  const finalTranslations = deepMerge(existingTranslations, translated);

  // Save to file with pretty formatting
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(targetPath, JSON.stringify(finalTranslations, null, 2), 'utf-8');

  console.log(`\n📊 Statistics for ${langName}:`);
  console.log(`   Total keys: ${stats.total}`);
  console.log(`   Translated: ${stats.translated}`);
  console.log(`   Preserved: ${stats.skipped}`);
  console.log(`   Errors: ${stats.errors}`);
  console.log(`\n✅ Saved to ${targetPath}`);
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🌐 Hybrid AI Translation System - Build-Time Component\n');
  console.log('Using OpenAI GPT-4o (same API as Barry AI)\n');

  try {
    // Verify OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY environment variable not set');
      console.error('\nOptions:');
      console.error('1. Add to .env file: OPENAI_API_KEY=<OPENAI_API_KEY>
      console.error('2. Run with: OPENAI_API_KEY=<OPENAI_API_KEY> node scripts/translate-with-openai.js');
      console.error('\nNote: This is the same API key used for Barry AI');
      process.exit(1);
    }

    // Read English source file
    const sourcePath = path.join(__dirname, '../public/locales/en/common.json');
    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Source file not found: ${sourcePath}`);
      console.error('\nExpected structure:');
      console.error('  public/locales/en/common.json (English source)');
      process.exit(1);
    }

    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
    const topLevelKeys = Object.keys(sourceData).length;

    console.log(`📖 Read English source: ${sourcePath}`);
    console.log(`   Top-level keys: ${topLevelKeys}`);
    console.log(`   Languages: ${Object.keys(TARGET_LANGUAGES).join(', ')}\n`);

    // Translate to each target language
    for (const [langCode, langName] of Object.entries(TARGET_LANGUAGES)) {
      await translateLanguage(sourceData, langCode, langName);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All translations complete!');
    console.log('='.repeat(60));
    console.log('\n📋 Next steps:');
    console.log('1. Review translations in public/locales/{de,tr,es}/common.json');
    console.log('2. Test locally: npm run build && npm run preview');
    console.log('3. Deploy to staging: git push staging main:main');
    console.log('4. Verify on staging site (check language selector)');
    console.log('5. If good, deploy to production (ask user first!)');
    console.log('\n💡 Tip: Re-run this script after updating English source\n');

  } catch (error) {
    console.error('\n❌ Translation script error:', error);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { translateString, translateObject, deepMerge };
