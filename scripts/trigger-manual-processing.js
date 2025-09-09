// Simple script to trigger manual processing
// This uses the existing manualProcessingService

import { manualProcessingService } from '../src/services/manuals/manualProcessingService.js';

async function processExistingManuals() {
  console.log('🔍 Checking for existing manuals to process...');
  
  // This will use the existing uploaded files and process them
  const sampleManuals = [
    'UHB-Unimog-Cargo.pdf',
    // Add other manual filenames here if you know them
  ];

  for (const filename of sampleManuals) {
    try {
      console.log(`📖 Processing: ${filename}`);
      
      const result = await manualProcessingService.processExistingManual(
        filename,
        (status) => {
          console.log(`   ${status.message} (${status.progress}%)`);
        }
      );
      
      console.log(`✅ Success: ${result.chunkCount} chunks from ${result.pageCount} pages`);
      
    } catch (error) {
      console.log(`❌ Error processing ${filename}:`, error.message);
    }
  }
}

processExistingManuals();