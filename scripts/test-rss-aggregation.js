#!/usr/bin/env node

/**
 * Test RSS Aggregation System
 * Run this after creating the database tables to test the RSS feed aggregation
 */

const SUPABASE_URL = 'https://ydevatqwkoccxhtejdor.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8';

async function testRSSAggregation() {
  console.log('🔄 Testing RSS Aggregation System');
  console.log('===================================\n');

  try {
    // 1. Check if tables exist
    console.log('1️⃣ Checking if RSS tables exist...');
    const tablesResponse = await fetch(`${SUPABASE_URL}/rest/v1/rss_feeds?select=id&limit=1`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    if (!tablesResponse.ok) {
      console.error('❌ RSS tables not found. Please run the migration first.');
      console.log('\nTo create tables:');
      console.log('1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/sql/new');
      console.log('2. Run the migration from: supabase/migrations/20250124_create_rss_aggregation_tables.sql');
      console.log('3. Then run the feeds setup from: scripts/setup-rss-feeds.sql');
      return;
    }

    console.log('✅ RSS tables exist\n');

    // 2. Check for RSS feeds
    console.log('2️⃣ Checking configured RSS feeds...');
    const feedsResponse = await fetch(`${SUPABASE_URL}/rest/v1/rss_feeds?select=*`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    const feeds = await feedsResponse.json();
    console.log(`Found ${feeds.length} RSS feeds configured`);
    
    if (feeds.length > 0) {
      console.log('\nActive feeds:');
      feeds.filter(f => f.is_active).forEach(feed => {
        console.log(`  - ${feed.name} (${feed.category})`);
      });
    }

    // 3. Trigger the Edge Function
    console.log('\n3️⃣ Triggering RSS aggregation Edge Function...');
    const edgeFunctionResponse = await fetch(`${SUPABASE_URL}/functions/v1/fetch-rss-feeds`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!edgeFunctionResponse.ok) {
      const error = await edgeFunctionResponse.text();
      console.error('❌ Edge Function error:', error);
      console.log('\nNote: Edge Functions need to be deployed to Supabase.');
      console.log('Deploy with: npx supabase functions deploy fetch-rss-feeds');
      return;
    }

    const result = await edgeFunctionResponse.json();
    console.log('✅ RSS aggregation completed');
    console.log('\nResults:');
    console.log(`  - Total feeds processed: ${result.summary?.total || 0}`);
    console.log(`  - Successful: ${result.summary?.successful || 0}`);
    console.log(`  - Failed: ${result.summary?.failed || 0}`);

    if (result.results) {
      console.log('\nFeed details:');
      result.results.forEach(r => {
        if (r.status === 'success') {
          console.log(`  ✅ ${r.feed}: ${r.newItems} new items`);
        } else {
          console.log(`  ❌ ${r.feed}: ${r.error}`);
        }
      });
    }

    // 4. Check aggregated content
    console.log('\n4️⃣ Checking aggregated content...');
    const contentResponse = await fetch(`${SUPABASE_URL}/rest/v1/aggregated_content?select=id,title,category,difficulty_level&limit=10`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });

    const content = await contentResponse.json();
    console.log(`\nTotal aggregated content items: ${content.length}`);
    
    if (content.length > 0) {
      console.log('\nSample content:');
      content.slice(0, 5).forEach(item => {
        console.log(`  - ${item.title.substring(0, 60)}...`);
        if (item.difficulty_level) {
          console.log(`    Difficulty: ${item.difficulty_level}`);
        }
      });
    }

    console.log('\n✅ RSS Aggregation system is working!');
    console.log('\nNext steps:');
    console.log('1. Schedule the Edge Function to run periodically (e.g., every hour)');
    console.log('2. Add more RSS feeds relevant to Unimog and off-road trails');
    console.log('3. Build UI components to display aggregated content');

  } catch (error) {
    console.error('❌ Error testing RSS aggregation:', error);
  }
}

// Run the test
testRSSAggregation();