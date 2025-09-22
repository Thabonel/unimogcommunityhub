#!/usr/bin/env node

// Simple script to process manuals using the existing service
const { ManualProcessingService } = require('../src/services/manualProcessingService');

async function processBatch() {
  console.log('🚀 Starting batch manual processing...\n');

  const service = ManualProcessingService.getInstance();

  try {
    // Get unprocessed manuals
    const unprocessed = await service.getUnprocessedManuals();
    console.log(`Found ${unprocessed.length} unprocessed manuals\n`);

    if (unprocessed.length === 0) {
      console.log('✅ All manuals already processed!');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // Process each manual
    for (let i = 0; i < unprocessed.length; i++) {
      const file = unprocessed[i];
      console.log(`[${i + 1}/${unprocessed.length}] Processing: ${file.name}`);

      try {
        const result = await service.processManual(file.name);

        if (result.success) {
          console.log(`  ✅ Success: ${result.chunks} chunks from ${result.pages} pages`);
          successCount++;
        } else {
          console.log(`  ❌ Failed: ${result.error}`);
          failCount++;
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        failCount++;
      }

      // Small delay between files
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Batch Processing Complete!');
    console.log(`✅ Success: ${successCount} files`);
    console.log(`❌ Failed: ${failCount} files`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

processBatch();