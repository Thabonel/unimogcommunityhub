import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STOPWORDS = new Set([
  'a', 'an', 'and', 'the', 'or', 'of', 'to', 'in', 'for', 'with', 'on', 'at',
  'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
  'can', 'could', 'may', 'might', 'must', 'shall', 'it', 'its', 'this',
  'that', 'these', 'those', 'some', 'any', 'all', 'each', 'every', 'no',
  'not', 'also', 'use', 'assy', 'c/w', 'rh', 'lh', 'includes', 'part'
]);

const MIN_KEYWORD_LENGTH = 3;

function parseText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[,()]/g, ' ')
    .split(/\s+/)
    .filter(word =>
      word.length >= MIN_KEYWORD_LENGTH &&
      !STOPWORDS.has(word) &&
      !/^\d+$/.test(word)
    );
}

function extractMultiWordPhrases(text: string): string[] {
  const phrases: string[] = [];
  const normalized = text.toLowerCase().trim();

  const twoWords = normalized.match(/\b(\w+\s+\w+)\b/g);
  if (twoWords) {
    phrases.push(...twoWords.filter(phrase => {
      const words = phrase.split(' ');
      return words.every(w => w.length >= MIN_KEYWORD_LENGTH && !STOPWORDS.has(w));
    }));
  }

  const threeWords = normalized.match(/\b(\w+\s+\w+\s+\w+)\b/g);
  if (threeWords) {
    phrases.push(...threeWords.filter(phrase => {
      const words = phrase.split(' ');
      return words.every(w => w.length >= MIN_KEYWORD_LENGTH && !STOPWORDS.has(w));
    }));
  }

  return phrases;
}

async function extractKeywords() {
  console.log('Starting keyword extraction...\n');

  const allKeywords = new Set<string>();

  console.log('1. Extracting from u435_manual_index terms...');
  const { data: terms, error: termsError } = await supabase
    .from('u435_manual_index')
    .select('term')
    .eq('is_active', true);

  if (termsError) throw termsError;

  terms?.forEach(row => {
    allKeywords.add(row.term.toLowerCase().trim());
    extractMultiWordPhrases(row.term).forEach(p => allKeywords.add(p));
  });
  console.log(`   Found ${terms?.length} terms`);

  console.log('2. Extracting from u435_manual_index aliases...');
  const { data: aliasRows, error: aliasError } = await supabase
    .from('u435_manual_index')
    .select('aliases')
    .eq('is_active', true)
    .not('aliases', 'is', null);

  if (aliasError) throw aliasError;

  let aliasCount = 0;
  aliasRows?.forEach(row => {
    if (Array.isArray(row.aliases)) {
      row.aliases.forEach((alias: string) => {
        allKeywords.add(alias.toLowerCase().trim());
        extractMultiWordPhrases(alias).forEach(p => allKeywords.add(p));
        aliasCount++;
      });
    }
  });
  console.log(`   Found ${aliasCount} aliases`);

  console.log('3. Parsing RPS group names...');
  const { data: groups, error: groupsError } = await supabase
    .from('rps_groups')
    .select('group_name')
    .not('group_name', 'is', null)
    .neq('group_name', '');

  if (groupsError) throw groupsError;

  groups?.forEach(row => {
    parseText(row.group_name).forEach(word => allKeywords.add(word));
    extractMultiWordPhrases(row.group_name).forEach(p => allKeywords.add(p));
  });
  console.log(`   Parsed ${groups?.length} group names`);

  console.log('4. Parsing RPS parts descriptions...');
  const { data: parts, error: partsError } = await supabase
    .from('rps_parts')
    .select('description')
    .not('description', 'is', null);

  if (partsError) throw partsError;

  const uniqueDescriptions = new Set<string>();
  parts?.forEach(row => uniqueDescriptions.add(row.description));

  uniqueDescriptions.forEach(desc => {
    parseText(desc).forEach(word => allKeywords.add(word));
    extractMultiWordPhrases(desc).forEach(p => allKeywords.add(p));
  });
  console.log(`   Parsed ${uniqueDescriptions.size} unique descriptions`);

  const sortedKeywords = Array.from(allKeywords).sort();

  console.log(`\nTotal unique keywords: ${sortedKeywords.length}`);
  console.log('\nSample keywords:');
  sortedKeywords.slice(0, 20).forEach(k => console.log(`  - ${k}`));
  console.log('  ...');

  return {
    keywords: sortedKeywords,
    metadata: {
      extracted_at: new Date().toISOString(),
      total_count: sortedKeywords.length,
      sources: {
        u435_terms: terms?.length || 0,
        u435_aliases: aliasCount,
        rps_groups: groups?.length || 0,
        rps_parts: uniqueDescriptions.size
      }
    }
  };
}

async function main() {
  try {
    const result = await extractKeywords();

    const fs = await import('fs');
    const path = await import('path');

    const outputPath = path.join(
      process.cwd(),
      'supabase',
      'functions',
      'chat-with-barry-agentic',
      'routing-keywords.json'
    );

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`\nKeywords saved to: ${outputPath}`);

    console.log('\nKeyword extraction complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
