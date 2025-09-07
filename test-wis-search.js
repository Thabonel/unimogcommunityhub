// Quick test script for WIS search functionality
// Run with: node test-wis-search.js

console.log('🔍 Testing WIS Search Functionality');
console.log('===================================');

// Test the search preprocessing logic
function preprocessQuery(query) {
  const synonyms = {
    'radiator': 'cooling system radiator',
    'replace radiator': 'replace cooling system radiator',
    'install radiator': 'replace cooling system radiator',
    'remove radiator': 'replace cooling system radiator',
    'thermostat': 'cooling system thermostat',
    'water pump': 'cooling system water pump',
    'coolant': 'cooling system coolant'
  };

  let processedQuery = query.toLowerCase().trim();
  
  // Apply synonyms
  for (const [term, replacement] of Object.entries(synonyms)) {
    if (processedQuery.includes(term)) {
      processedQuery = processedQuery.replace(new RegExp(term, 'g'), replacement);
    }
  }

  return processedQuery;
}

// Test search term preprocessing
const testQueries = [
  'replace the radiator',
  'radiator service',
  'install radiator',
  'thermostat replacement',
  'water pump service',
  'coolant change'
];

console.log('🔍 Search Term Preprocessing Tests:');
console.log('-----------------------------------');
testQueries.forEach(query => {
  const processed = preprocessQuery(query);
  console.log(`Input: "${query}"`);
  console.log(`Output: "${processed}"`);
  console.log('');
});

// Test ranking algorithm
function rankSearchResults(items, originalQuery) {
  const query = originalQuery.toLowerCase().trim();
  
  return items.map(item => {
    let score = 0;
    const title = item.title.toLowerCase();
    const content = (item.content || '').toLowerCase();
    
    // Exact title match gets highest score
    if (title === query) score += 1000;
    else if (title.includes(query)) score += 500;
    
    // Procedure type boost
    if (item.doc_type === 'procedure') score += 200;
    
    // Action words in query boost repair/replace procedures
    if (query.includes('replace') || query.includes('install') || query.includes('remove')) {
      if (title.includes('replace') || title.includes('install') || title.includes('remove')) {
        score += 300;
      }
      // Penalize service/maintenance for replacement queries
      if (title.includes('service') || title.includes('maintenance') || title.includes('filter')) {
        score -= 100;
      }
    }
    
    // Boost radiator/cooling system matches
    if (query.includes('radiator') && title.includes('radiator')) score += 100;
    if (query.includes('cooling') && title.includes('cooling')) score += 100;
    
    return { ...item, customScore: score };
  })
  .sort((a, b) => b.customScore - a.customScore);
}

// Test sample results
const sampleResults = [
  {
    title: 'Filter Replacement - Radiator Service',
    content: 'Service procedure for radiator filter replacement',
    doc_type: 'procedure'
  },
  {
    title: 'Replace cooling system radiator',
    content: 'Complete procedure for radiator replacement',
    doc_type: 'procedure'
  },
  {
    title: 'Service cooling system coolant',
    content: 'Coolant service and maintenance',
    doc_type: 'procedure'
  }
];

console.log('🏆 Search Result Ranking Test:');
console.log('------------------------------');
const testQuery = 'replace the radiator';
const rankedResults = rankSearchResults(sampleResults, preprocessQuery(testQuery));

console.log(`Query: "${testQuery}"`);
console.log(`Processed: "${preprocessQuery(testQuery)}"`);
console.log('');
console.log('Ranked Results:');
rankedResults.forEach((result, index) => {
  console.log(`${index + 1}. "${result.title}" (Score: ${result.customScore})`);
});

console.log('');
console.log('✅ Expected: "Replace cooling system radiator" should rank highest');
console.log('✅ Expected: "Filter Replacement - Radiator Service" should rank lower');