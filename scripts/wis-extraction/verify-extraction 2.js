#!/usr/bin/env node

/**
 * Verify WIS extraction completeness
 * Checks database content and file uploads
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Verification results
const results = {
  timestamp: new Date().toISOString(),
  status: 'unknown',
  database: {},
  storage: {},
  searchTest: {},
  issues: [],
  recommendations: []
};

/**
 * Main verification function
 */
async function verifyExtraction() {
  console.log('🔍 Verifying WIS Extraction...\n');
  
  try {
    // Check database content
    await verifyDatabase();
    
    // Check storage content
    await verifyStorage();
    
    // Test search functionality
    await testSearch();
    
    // Analyze results
    analyzeResults();
    
    // Print report
    printReport();
    
  } catch (error) {
    console.error('❌ Verification error:', error);
    results.status = 'error';
    results.issues.push(`Verification failed: ${error.message}`);
  }
  
  return results;
}

/**
 * Verify database content
 */
async function verifyDatabase() {
  console.log('📊 Checking database content...');
  
  // Check procedures
  const { count: procCount, error: procError } = await supabase
    .from('wis_procedures')
    .select('*', { count: 'exact', head: true });
  
  results.database.procedures = procCount || 0;
  if (procError) results.issues.push(`Procedures table error: ${procError.message}`);
  
  // Check parts
  const { count: partsCount, error: partsError } = await supabase
    .from('wis_parts')
    .select('*', { count: 'exact', head: true });
  
  results.database.parts = partsCount || 0;
  if (partsError) results.issues.push(`Parts table error: ${partsError.message}`);
  
  // Check bulletins
  const { count: bulletinsCount, error: bulletinsError } = await supabase
    .from('wis_bulletins')
    .select('*', { count: 'exact', head: true });
  
  results.database.bulletins = bulletinsCount || 0;
  if (bulletinsError) results.issues.push(`Bulletins table error: ${bulletinsError.message}`);
  
  // Check models
  const { count: modelsCount, error: modelsError } = await supabase
    .from('wis_models')
    .select('*', { count: 'exact', head: true });
  
  results.database.models = modelsCount || 0;
  if (modelsError) results.issues.push(`Models table error: ${modelsError.message}`);
  
  // Check files table
  const { count: filesCount, error: filesError } = await supabase
    .from('wis_files')
    .select('*', { count: 'exact', head: true });
  
  results.database.files = filesCount || 0;
  if (filesError && !filesError.message.includes('does not exist')) {
    results.issues.push(`Files table error: ${filesError.message}`);
  }
  
  console.log(`   Procedures: ${results.database.procedures}`);
  console.log(`   Parts: ${results.database.parts}`);
  console.log(`   Bulletins: ${results.database.bulletins}`);
  console.log(`   Models: ${results.database.models}`);
  console.log(`   Files: ${results.database.files}`);
}

/**
 * Verify storage content
 */
async function verifyStorage() {
  console.log('\n📁 Checking storage content...');
  
  try {
    // List files in bucket
    const { data: files, error } = await supabase.storage
      .from('wis-files')
      .list('', {
        limit: 1000,
        offset: 0
      });
    
    if (error) {
      results.issues.push(`Storage error: ${error.message}`);
      results.storage.accessible = false;
      return;
    }
    
    results.storage.accessible = true;
    results.storage.fileCount = files ? files.length : 0;
    
    // Count by category
    const categories = {};
    if (files) {
      for (const file of files) {
        const category = file.name.split('/')[0] || 'root';
        categories[category] = (categories[category] || 0) + 1;
      }
    }
    results.storage.categories = categories;
    
    console.log(`   Total files: ${results.storage.fileCount}`);
    console.log(`   Categories:`, categories);
    
  } catch (error) {
    results.issues.push(`Storage check failed: ${error.message}`);
    results.storage.accessible = false;
  }
}

/**
 * Test search functionality
 */
async function testSearch() {
  console.log('\n🔍 Testing search functionality...');
  
  const testQueries = [
    'oil change',
    'brake',
    'U400',
    'transmission'
  ];
  
  results.searchTest.queries = {};
  
  for (const query of testQueries) {
    try {
      const { data, error } = await supabase
        .from('wis_procedures')
        .select('*')
        .textSearch('title', query)
        .limit(5);
      
      if (error) {
        results.searchTest.queries[query] = { error: error.message };
      } else {
        results.searchTest.queries[query] = {
          found: data ? data.length : 0,
          success: true
        };
      }
      
      console.log(`   "${query}": ${data ? data.length : 0} results`);
      
    } catch (error) {
      results.searchTest.queries[query] = { error: error.message };
      console.log(`   "${query}": Error - ${error.message}`);
    }
  }
  
  // Check if search is working
  const successfulSearches = Object.values(results.searchTest.queries)
    .filter(q => q.success).length;
  
  results.searchTest.working = successfulSearches > 0;
}

/**
 * Analyze results and determine status
 */
function analyzeResults() {
  // Determine overall status
  const hasData = results.database.procedures > 0 || results.database.parts > 0;
  const hasStorage = results.storage.accessible && results.storage.fileCount > 0;
  const hasSearch = results.searchTest.working;
  
  if (hasData && hasStorage && hasSearch) {
    results.status = 'complete';
  } else if (hasData || hasStorage) {
    results.status = 'partial';
  } else {
    results.status = 'empty';
  }
  
  // Add recommendations
  if (results.database.procedures < 100) {
    results.recommendations.push('Extract more procedures - found less than 100');
  }
  
  if (results.database.parts < 500) {
    results.recommendations.push('Extract more parts - found less than 500');
  }
  
  if (!results.storage.accessible) {
    results.recommendations.push('Fix storage bucket access');
  }
  
  if (!results.searchTest.working) {
    results.recommendations.push('Set up full-text search indexes');
  }
  
  if (results.database.models < 10) {
    results.recommendations.push('Import vehicle models data');
  }
}

/**
 * Print verification report
 */
function printReport() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 VERIFICATION REPORT');
  console.log('='.repeat(60));
  
  // Status
  const statusEmoji = {
    complete: '✅',
    partial: '⚠️',
    empty: '❌',
    error: '❌'
  };
  
  console.log(`\nStatus: ${statusEmoji[results.status]} ${results.status.toUpperCase()}`);
  
  // Database Summary
  console.log('\n📊 Database Content:');
  console.log(`   Procedures: ${results.database.procedures}`);
  console.log(`   Parts: ${results.database.parts}`);
  console.log(`   Bulletins: ${results.database.bulletins}`);
  console.log(`   Models: ${results.database.models}`);
  console.log(`   File Records: ${results.database.files}`);
  
  // Storage Summary
  console.log('\n📁 Storage Content:');
  if (results.storage.accessible) {
    console.log(`   Files Uploaded: ${results.storage.fileCount}`);
    if (results.storage.categories) {
      console.log('   By Category:');
      for (const [cat, count] of Object.entries(results.storage.categories)) {
        console.log(`     - ${cat}: ${count}`);
      }
    }
  } else {
    console.log('   ❌ Storage not accessible');
  }
  
  // Search Test
  console.log('\n🔍 Search Functionality:');
  console.log(`   Status: ${results.searchTest.working ? '✅ Working' : '❌ Not Working'}`);
  
  // Issues
  if (results.issues.length > 0) {
    console.log('\n⚠️  Issues Found:');
    results.issues.forEach(issue => {
      console.log(`   - ${issue}`);
    });
  }
  
  // Recommendations
  if (results.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    results.recommendations.forEach(rec => {
      console.log(`   - ${rec}`);
    });
  }
  
  // Success criteria
  console.log('\n✅ Success Criteria:');
  const criteria = [
    { name: 'Has Procedures', met: results.database.procedures > 0 },
    { name: 'Has Parts', met: results.database.parts > 0 },
    { name: 'Has Storage', met: results.storage.accessible },
    { name: 'Search Works', met: results.searchTest.working },
    { name: 'Has Models', met: results.database.models > 0 }
  ];
  
  criteria.forEach(c => {
    console.log(`   ${c.met ? '✓' : '✗'} ${c.name}`);
  });
  
  const metCriteria = criteria.filter(c => c.met).length;
  console.log(`\n📊 Score: ${metCriteria}/${criteria.length} criteria met`);
  
  console.log('\n' + '='.repeat(60));
  
  // Save to file
  const fs = require('fs');
  const reportPath = path.join(__dirname, '../../verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);
}

// Run verification
verifyExtraction().catch(console.error);