#!/usr/bin/env node

/**
 * WIS Web Interface Data Scraper
 * Extracts data directly from the WIS web interface at http://localhost:9000
 */

const fs = require('fs');
const path = require('path');

// Simple HTTP client
const http = require('http');

const EXPORT_DIR = '/Volumes/UnimogManuals/wis-complete-extraction';

// Create export directories
fs.mkdirSync(path.join(EXPORT_DIR, 'procedures'), { recursive: true });
fs.mkdirSync(path.join(EXPORT_DIR, 'parts'), { recursive: true });
fs.mkdirSync(path.join(EXPORT_DIR, 'bulletins'), { recursive: true });

console.log('🌐 WIS Web Scraper');
console.log('==================');

/**
 * Make HTTP request to WIS
 */
function wisRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 9000,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'text/html,application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.end();
  });
}

/**
 * Extract Unimog data from WIS
 */
async function extractUnimogData() {
  console.log('📋 Searching for Unimog data...');
  
  // Common Unimog model searches
  const models = [
    'U1000', 'U1100', 'U1200', 'U1300', 'U1400', 'U1500', 'U1600', 'U1700',
    'U2000', 'U2100', 'U2150', 'U2400', 'U2450',
    'U3000', 'U4000', 'U5000',
    'U300', 'U400', 'U500',
    '404', '406', '411', '416', '424', '425', '435'
  ];

  const allData = {
    procedures: [],
    parts: [],
    bulletins: []
  };

  for (const model of models) {
    console.log(`  Searching model ${model}...`);
    
    try {
      // Try different search endpoints
      const searchPaths = [
        `/search?q=${model}`,
        `/api/search?model=${model}`,
        `/wis/search?text=${model}`,
        `/data/vehicles/${model}`
      ];

      for (const searchPath of searchPaths) {
        try {
          const response = await wisRequest(searchPath);
          if (response && response.length > 100) {
            console.log(`    ✓ Found data at ${searchPath}`);
            
            // Parse response (adjust based on actual format)
            if (response.includes('procedure')) {
              allData.procedures.push({
                model: model,
                content: response
              });
            }
            if (response.includes('part')) {
              allData.parts.push({
                model: model,
                content: response
              });
            }
          }
        } catch (err) {
          // Continue trying other paths
        }
      }
    } catch (err) {
      console.log(`    ⚠ Error searching ${model}: ${err.message}`);
    }
  }

  // Save extracted data
  console.log('\n💾 Saving extracted data...');
  
  if (allData.procedures.length > 0) {
    fs.writeFileSync(
      path.join(EXPORT_DIR, 'procedures/unimog_procedures.json'),
      JSON.stringify(allData.procedures, null, 2)
    );
    console.log(`  ✓ Saved ${allData.procedures.length} procedures`);
  }

  if (allData.parts.length > 0) {
    fs.writeFileSync(
      path.join(EXPORT_DIR, 'parts/unimog_parts.json'),
      JSON.stringify(allData.parts, null, 2)
    );
    console.log(`  ✓ Saved ${allData.parts.length} parts records`);
  }

  return allData;
}

/**
 * Try to find data export links
 */
async function findExportLinks() {
  console.log('\n🔍 Looking for export functions...');
  
  try {
    const homepage = await wisRequest('/');
    
    // Look for export-related links
    const exportPatterns = [
      /href="([^"]*export[^"]*)"/gi,
      /href="([^"]*download[^"]*)"/gi,
      /href="([^"]*data[^"]*)"/gi,
      /href="([^"]*api[^"]*)"/gi
    ];

    const links = new Set();
    for (const pattern of exportPatterns) {
      const matches = homepage.matchAll(pattern);
      for (const match of matches) {
        links.add(match[1]);
      }
    }

    if (links.size > 0) {
      console.log('  Found potential export links:');
      for (const link of links) {
        console.log(`    - ${link}`);
      }
    }
  } catch (err) {
    console.log('  ⚠ Could not access WIS homepage');
  }
}

/**
 * Main extraction
 */
async function main() {
  // Check if WIS is accessible
  try {
    await wisRequest('/');
    console.log('✅ WIS web interface is accessible\n');
  } catch (err) {
    console.log('❌ Cannot access WIS at http://localhost:9000');
    console.log('   Make sure WIS is running in the VM');
    return;
  }

  // Try different extraction methods
  await findExportLinks();
  await extractUnimogData();

  console.log('\n✅ Web scraping complete!');
  console.log(`📁 Data saved to: ${EXPORT_DIR}`);
}

// Run
main().catch(console.error);