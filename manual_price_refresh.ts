// Manual Price Refresh Script
// Run this to immediately update prices for critical products

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ydevatqwkoccxhtejdor.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function triggerPriceScraping() {
  try {
    // Call the edge function directly
    const response = await fetch('https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/scrape-amazon-prices', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const result = await response.json();
    console.log('Price scraping result:', result);

    if (result.status === 'success') {
      console.log(`✅ Success: Updated ${result.updated} products, ${result.failed} failed`);
    } else {
      console.error('❌ Scraping failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error calling scraping function:', error);
  }
}

// Run multiple times to process more products (8 products per call)
async function refreshAllPrices() {
  console.log('🚀 Starting manual price refresh...');

  // Run 15 times to cover all 119 products (15 * 8 = 120)
  for (let i = 1; i <= 15; i++) {
    console.log(`\n📦 Batch ${i}/15`);
    await triggerPriceScraping();

    // Wait 10 seconds between batches to avoid rate limiting
    if (i < 15) {
      console.log('⏳ Waiting 10 seconds...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  console.log('\n🎉 Manual price refresh complete!');
}

refreshAllPrices();