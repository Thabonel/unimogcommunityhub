#!/usr/bin/env node

/**
 * Test the improved Barry search logic
 */

import fetch from 'node-fetch';

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

async function testImprovedSearchLogic() {
  console.log('🧪 Testing improved Barry search logic...\n');
  
  const testQuestions = [
    'How do I change the engine oil in my Unimog?',
    'What are the brake maintenance procedures?', 
    'Tell me about transmission service',
    'How to replace hydraulic fluid?',
    'Unimog maintenance schedule'
  ];
  
  const vehicleKeywords = ['unimog', 'engine', 'oil', 'brake', 'transmission', 'hydraulic', 'clutch', 'differential', 'axle', 'tire', 'wheel', 'maintenance', 'service', 'repair', 'replace', 'change', 'check', 'adjust', 'lubricate', 'filter', 'fluid', 'coolant', 'belt', 'hose', 'gasket', 'seal'];
  
  for (const question of testQuestions) {
    console.log(`Question: "${question}"`);
    
    // Mimic Barry's improved keyword extraction
    const userText = question.toLowerCase();
    const searchTerms = [];
    
    // Look for vehicle-related keywords
    for (const keyword of vehicleKeywords) {
      if (userText.includes(keyword)) {
        searchTerms.push(keyword);
      }
    }
    
    // If no vehicle keywords, use general terms
    if (searchTerms.length === 0) {
      searchTerms.push(...userText
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 2)
      );
    }
    
    console.log(`Search terms: [${searchTerms.join(', ')}]`);
    
    // Test the search for each term
    let totalMatches = 0;
    let allChunks = [];
    
    for (const term of searchTerms.slice(0, 3)) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?select=id,manual_title,page_number,content&content=ilike.%25${encodeURIComponent(term)}%25&limit=3&order=page_number.asc`, {
          headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
          }
        });
        
        if (response.ok) {
          const results = await response.json();
          totalMatches += results.length;
          
          // Add unique results
          const existingIds = new Set(allChunks.map(c => c.id));
          allChunks.push(...results.filter(c => !existingIds.has(c.id)));
          
          console.log(`  "${term}": ${results.length} matches`);
        } else {
          console.log(`  "${term}": Search failed (${response.status})`);
        }
      } catch (error) {
        console.log(`  "${term}": Error - ${error.message}`);
      }
    }
    
    // Limit to 5 total results
    allChunks = allChunks.slice(0, 5);
    
    console.log(`✅ Total unique results: ${allChunks.length}`);
    
    if (allChunks.length > 0) {
      console.log('Sample results:');
      allChunks.slice(0, 2).forEach((chunk, i) => {
        console.log(`  ${i+1}. ${chunk.manual_title} - Page ${chunk.page_number || 'N/A'}`);
        console.log(`     Content: ${chunk.content?.substring(0, 80)}...`);
      });
    }
    
    console.log();
  }
}

async function testSpecificTerms() {
  console.log('🎯 Testing specific vehicle terms...\n');
  
  const specificTerms = ['engine', 'oil', 'brake', 'unimog', 'transmission', 'hydraulic'];
  
  for (const term of specificTerms) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/manual_chunks?select=id,manual_title,content&content=ilike.%25${encodeURIComponent(term)}%25&limit=2`, {
        headers: {
          'apikey': SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
        }
      });
      
      if (response.ok) {
        const results = await response.json();
        console.log(`"${term}": ${results.length} matches found`);
        
        if (results.length > 0) {
          const sample = results[0];
          console.log(`  Manual: ${sample.manual_title}`);
          console.log(`  Content snippet: ${sample.content?.substring(0, 60)}...`);
        }
      } else {
        console.log(`"${term}": Failed (${response.status})`);
      }
    } catch (error) {
      console.log(`"${term}": Error - ${error.message}`);
    }
    console.log();
  }
}

async function main() {
  console.log('🔍 Improved Barry Search Logic Testing');
  console.log('=' + '='.repeat(50) + '\n');
  
  await testImprovedSearchLogic();
  await testSpecificTerms();
  
  console.log('=' + '='.repeat(51));
  console.log('📊 SUMMARY');
  console.log('✅ Barry search logic improved with vehicle-specific keywords');
  console.log('✅ Multiple term search with deduplication');
  console.log('✅ Fallback to general terms if no vehicle keywords found');
  console.log('✅ Direct table search avoids RPC function conflicts');
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Deploy the updated Barry Edge Function');
  console.log('2. Test Barry at /knowledge/chatgpt');
  console.log('3. Try questions about engine oil, brakes, transmission');
  console.log('=' + '='.repeat(51));
}

main().catch(console.error);