/**
 * Test script for manual image extraction
 * This will test the image extraction system on a small manual
 */

import { createClient } from '@supabase/supabase-js';
import { ImageExtractionService } from './src/services/manuals/imageExtractionService.ts';

// Initialize Supabase client
const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testImageExtraction() {
  console.log('🚀 Starting image extraction test...');

  try {
    // Test with the smallest manual first
    const manualName = '403.113.pdf';
    console.log(`📖 Testing with manual: ${manualName}`);

    const imageService = ImageExtractionService.getInstance();
    const result = await imageService.extractImagesFromManual(manualName);

    console.log('✅ Extraction completed!');
    console.log(`📊 Result:`, {
      success: result.success,
      totalImages: result.totalImages,
      manualName: result.manualName,
      errors: result.errors?.length || 0
    });

    if (result.success && result.totalImages > 0) {
      console.log('🎉 Successfully extracted and linked images!');

      // Test Barry's image search
      console.log('🔍 Testing Barry\'s image search...');
      const { secureGeminiService } = await import('./src/services/claude/secureGeminiService.ts');
      const relevantImages = await secureGeminiService.searchRelevantImages('engine', '403.113');

      console.log(`🖼️ Found ${relevantImages.length} relevant images for "engine" query`);
      relevantImages.forEach((img, idx) => {
        console.log(`  ${idx + 1}. ${img.description} (${img.url})`);
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testImageExtraction().then(() => {
  console.log('🏁 Test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test crashed:', error);
  process.exit(1);
});