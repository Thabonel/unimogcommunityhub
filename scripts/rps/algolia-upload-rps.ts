/**
 * Upload RPS Catalog chunks to Algolia
 *
 * Simple script to index all RPS pages for fast, accurate search.
 * No embeddings, no vectors, just proper document search.
 */

import { createClient } from '@supabase/supabase-js';
import { algoliasearch } from 'algoliasearch';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ALGOLIA_APP_ID = 'FQ6PXP6GXO';
const ALGOLIA_WRITE_KEY = process.env.ALGOLIA_WRITE_KEY; // Use Write API Key, not Search key

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

if (!ALGOLIA_WRITE_KEY) {
  console.error('Missing ALGOLIA_WRITE_KEY environment variable');
  console.error('Set it with: export ALGOLIA_WRITE_KEY="your_write_api_key"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_WRITE_KEY);
const index = algolia.initIndex('rps_catalog');

interface RPSChunk {
  id: string;
  page_number: number;
  section_title: string;
  content: string;
  rps_group_code: string | null;
  rps_group_name: string | null;
  visual_content_type: string | null;
  extraction_method: string | null;
  metadata: any;
}

async function fetchRPSChunks(): Promise<RPSChunk[]> {
  console.log('Fetching RPS chunks from Supabase...');

  const { data, error } = await supabase
    .from('manual_chunks')
    .select('id, page_number, section_title, content, rps_group_code, rps_group_name, visual_content_type, extraction_method, metadata')
    .eq('manual_title', 'RPS Catalog')
    .order('page_number');

  if (error) {
    throw new Error(`Failed to fetch chunks: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No RPS chunks found in database');
  }

  console.log(`✓ Fetched ${data.length} chunks`);
  return data as RPSChunk[];
}

function prepareAlgoliaRecords(chunks: RPSChunk[]) {
  return chunks.map(chunk => ({
    objectID: chunk.id,
    page_number: chunk.page_number,
    section_title: chunk.section_title || '',
    content: chunk.content || '',
    rps_group_code: chunk.rps_group_code || '',
    rps_group_name: chunk.rps_group_name || '',
    visual_content_type: chunk.visual_content_type || 'text',
    extraction_method: chunk.extraction_method || 'unknown',
    page_type: chunk.metadata?.page_type || 'unknown',
    // Searchable text: combine everything meaningful
    _searchable: [
      chunk.rps_group_code,
      chunk.rps_group_name,
      chunk.section_title,
      chunk.content
    ].filter(Boolean).join(' ')
  }));
}

async function uploadToAlgolia(records: any[], batchSize = 100) {
  console.log(`Uploading ${records.length} records to Algolia...`);

  const batches = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }

  console.log(`Processing ${batches.length} batches of ${batchSize} records each...`);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`  Batch ${i + 1}/${batches.length}: Uploading ${batch.length} records...`);

    try {
      await index.saveObjects(batch);
      console.log(`  ✓ Batch ${i + 1} complete`);
    } catch (error) {
      console.error(`  ✗ Batch ${i + 1} failed:`, error);
      throw error;
    }
  }

  console.log('✓ All batches uploaded successfully');
}

async function configureIndex() {
  console.log('Configuring Algolia index settings...');

  await index.setSettings({
    searchableAttributes: [
      'rps_group_name',      // Highest priority: "FUEL PUMP", "FUEL TANK"
      'rps_group_code',      // Second: "DEA", "DA"
      'section_title',       // Third: Full section title
      'content'              // Last: Page content
    ],
    attributesForFaceting: [
      'rps_group_code',
      'visual_content_type',
      'page_type'
    ],
    customRanking: [
      'desc(page_number)'    // Prefer earlier pages when scores are equal
    ],
    typoTolerance: true,
    minWordSizefor1Typo: 4,
    minWordSizefor2Typos: 8,
    attributesToRetrieve: [
      'objectID',
      'page_number',
      'rps_group_code',
      'rps_group_name',
      'section_title',
      'content',
      'visual_content_type'
    ]
  });

  console.log('✓ Index configured');
}

async function testSearch() {
  console.log('\nTesting search...');
  console.log('='.repeat(70));

  const queries = [
    'fuel pump',
    'fuel tank',
    'crankcase',
    'DEA'
  ];

  for (const query of queries) {
    console.log(`\nQuery: "${query}"`);
    const { hits } = await index.search(query, { hitsPerPage: 3 });

    hits.forEach((hit: any, i: number) => {
      console.log(`  ${i + 1}. Page ${hit.page_number}: ${hit.rps_group_name} (${hit.visual_content_type})`);
    });
  }

  console.log('\n' + '='.repeat(70));
}

async function main() {
  console.log('='.repeat(70));
  console.log('ALGOLIA RPS CATALOG UPLOAD');
  console.log('='.repeat(70));
  console.log('');

  try {
    // Step 1: Fetch chunks from Supabase
    const chunks = await fetchRPSChunks();

    // Step 2: Prepare records for Algolia
    console.log('Preparing records for Algolia...');
    const records = prepareAlgoliaRecords(chunks);
    console.log(`✓ Prepared ${records.length} records`);
    console.log('');

    // Step 3: Configure index settings
    await configureIndex();
    console.log('');

    // Step 4: Upload to Algolia
    await uploadToAlgolia(records);
    console.log('');

    // Step 5: Test search
    await testSearch();

    console.log('');
    console.log('='.repeat(70));
    console.log('✅ UPLOAD COMPLETE');
    console.log('='.repeat(70));
    console.log(`Total records indexed: ${records.length}`);
    console.log(`Index name: rps_catalog`);
    console.log(`App ID: ${ALGOLIA_APP_ID}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Test search at: https://www.algolia.com/apps/FQ6PXP6GXO/explorer');
    console.log('2. Update Barry to use Algolia search');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('='.repeat(70));
    console.error('❌ UPLOAD FAILED');
    console.error('='.repeat(70));
    console.error(error instanceof Error ? error.message : String(error));
    console.error('');
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
