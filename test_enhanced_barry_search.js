#!/usr/bin/env node

/**
 * Test script for Enhanced Barry PDF Processing
 * Tests the new search_enhanced_manual_chunks function and visual content detection
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testEnhancedSearch() {
  console.log('🔍 Testing Enhanced PDF Processing and Search...\n');
  
  // Test queries with different types of content
  const testQueries = [
    { query: 'oil change procedure', expectedType: 'procedure' },
    { query: 'engine specifications torque', expectedType: 'specification' },
    { query: 'warning brake system', expectedType: 'warning' },
    { query: 'hydraulic system diagram', expectedTypes: ['diagram_caption', 'text'] },
    { query: 'unimog maintenance schedule', expectedTypes: ['procedure', 'specification', 'text'] }
  ];

  for (const test of testQueries) {
    console.log(`\n📋 Testing query: "${test.query}"`);
    console.log('─'.repeat(50));
    
    try {
      // Test the enhanced search function
      const { data: results, error } = await supabase
        .rpc('search_enhanced_manual_chunks', {
          search_query: test.query,
          content_type_filter: null,
          min_quality: 0.5,
          limit_results: 5
        });

      if (error) {
        console.error('❌ Search error:', error);
        continue;
      }

      if (!results || results.length === 0) {
        console.log('⚠️  No results found');
        continue;
      }

      console.log(`✅ Found ${results.length} results:`);
      
      results.forEach((result, idx) => {
        console.log(`\n  [${idx + 1}] ${result.manual_title} - Page ${result.page_number}`);
        console.log(`      📊 Content Type: ${result.content_type || 'text'}`);
        console.log(`      🎯 Relevance: ${(result.relevance_score || 0).toFixed(3)}`);
        console.log(`      ⭐ Quality: ${((result.extraction_quality || 0.8) * 100).toFixed(0)}%`);
        
        if (result.procedure_complexity && result.procedure_complexity > 1.0) {
          console.log(`      🔧 Complexity: ${result.procedure_complexity}/5`);
        }
        
        if (result.has_visual_elements) {
          console.log(`      📷 Visual Content: ${result.visual_content_type || 'general'}`);
        }
        
        if (result.section_title) {
          console.log(`      📝 Section: ${result.section_title}`);
        }
        
        // Show content preview
        const preview = result.content.substring(0, 150) + (result.content.length > 150 ? '...' : '');
        console.log(`      💬 Preview: ${preview.replace(/\n/g, ' ')}`);
      });

      // Check if we got expected content types
      const foundTypes = results.map(r => r.content_type || 'text');
      const expectedTypes = Array.isArray(test.expectedType) ? test.expectedType : [test.expectedType];
      
      if (test.expectedType) {
        const hasExpectedType = expectedTypes.some(type => foundTypes.includes(type));
        if (hasExpectedType) {
          console.log(`\n  ✅ Found expected content type(s): ${expectedTypes.join(' or ')}`);
        } else {
          console.log(`\n  ⚠️  Expected content type(s) "${expectedTypes.join(' or ')}" not found. Got: ${foundTypes.join(', ')}`);
        }
      }

    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
  }
}

async function testDatabaseStats() {
  console.log('\n\n📊 Enhanced PDF Processing Statistics');
  console.log('═'.repeat(50));
  
  try {
    const { data: stats, error } = await supabase
      .from('manual_chunks')
      .select('content_type, has_visual_elements, extraction_quality, procedure_complexity')
      .not('content_type', 'is', null);

    if (error) {
      console.error('❌ Stats query error:', error);
      return;
    }

    if (!stats || stats.length === 0) {
      console.log('⚠️  No enhanced processing data found');
      return;
    }

    // Calculate statistics
    const totalChunks = stats.length;
    const contentTypes = {};
    let visualChunks = 0;
    let totalQuality = 0;
    let totalComplexity = 0;
    let complexityCount = 0;

    stats.forEach(chunk => {
      // Count content types
      const type = chunk.content_type || 'text';
      contentTypes[type] = (contentTypes[type] || 0) + 1;
      
      // Count visual elements
      if (chunk.has_visual_elements) visualChunks++;
      
      // Sum quality scores
      if (chunk.extraction_quality) totalQuality += chunk.extraction_quality;
      
      // Sum complexity scores
      if (chunk.procedure_complexity && chunk.procedure_complexity > 1.0) {
        totalComplexity += chunk.procedure_complexity;
        complexityCount++;
      }
    });

    console.log(`📋 Total processed chunks: ${totalChunks}`);
    console.log(`👁️  Chunks with visual elements: ${visualChunks} (${(visualChunks/totalChunks*100).toFixed(1)}%)`);
    console.log(`⭐ Average extraction quality: ${(totalQuality/totalChunks*100).toFixed(1)}%`);
    
    if (complexityCount > 0) {
      console.log(`🔧 Average procedure complexity: ${(totalComplexity/complexityCount).toFixed(1)}/5`);
    }

    console.log('\n📈 Content Type Distribution:');
    Object.entries(contentTypes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        const percentage = (count/totalChunks*100).toFixed(1);
        console.log(`  ${type.padEnd(15)} : ${count.toString().padStart(3)} (${percentage}%)`);
      });

  } catch (error) {
    console.error('❌ Stats test failed:', error.message);
  }
}

async function runTests() {
  console.log('🤖 Barry Enhanced PDF Processing Test Suite');
  console.log('═'.repeat(60));
  
  await testEnhancedSearch();
  await testDatabaseStats();
  
  console.log('\n\n🎉 Test suite completed!');
  console.log('\nNext steps:');
  console.log('1. Deploy the enhanced Edge Functions to Supabase');
  console.log('2. Test with a real manual upload');
  console.log('3. Chat with Barry to see enhanced responses');
}

// Run the tests
runTests().catch(console.error);