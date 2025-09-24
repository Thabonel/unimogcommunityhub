// Test script to check if renamed files are accessible via Supabase storage API
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFileAccess() {
  console.log('🔍 Testing storage access for renamed files...\n');

  const testFiles = [
    '01 - Engine Housing.pdf',
    '31 - Frame.pdf',
    '29 - Pedal Linkage.pdf',
    'G600-Data-Summary.pdf' // Working file for comparison
  ];

  for (const fileName of testFiles) {
    console.log(`📄 Testing: ${fileName}`);

    try {
      // Test 1: Check if file exists via storage API
      const { data: listData, error: listError } = await supabase
        .storage
        .from('manuals')
        .list('', { search: fileName });

      if (listError) {
        console.log(`❌ List error: ${listError.message}`);
        continue;
      }

      const fileExists = listData.some(file => file.name === fileName);
      console.log(`📋 File found in list: ${fileExists ? '✅' : '❌'}`);

      if (!fileExists) {
        // Try to find files with similar names
        console.log('🔍 Looking for similar files...');
        const similarFiles = listData.filter(file =>
          file.name.toLowerCase().includes(fileName.toLowerCase().split(' - ')[1]?.split('.')[0] || fileName.toLowerCase().substring(0, 10))
        );
        if (similarFiles.length > 0) {
          console.log('🎯 Found similar files:', similarFiles.map(f => f.name));
        }
        continue;
      }

      // Test 2: Try to create signed URL
      const { data: urlData, error: urlError } = await supabase
        .storage
        .from('manuals')
        .createSignedUrl(fileName, 60);

      if (urlError) {
        console.log(`❌ Signed URL error: ${urlError.message}`);
        continue;
      }

      console.log(`🔗 Signed URL created: ✅`);

      // Test 3: Try to download first few bytes
      const { data: downloadData, error: downloadError } = await supabase
        .storage
        .from('manuals')
        .download(fileName, {
          headers: { Range: 'bytes=0-1023' } // First 1KB only
        });

      if (downloadError) {
        console.log(`❌ Download error: ${downloadError.message}`);
        continue;
      }

      console.log(`📥 Download test: ✅ (${downloadData.size} bytes)`);
      console.log(`🎉 File "${fileName}" is fully accessible!\n`);

    } catch (error) {
      console.log(`💥 Unexpected error: ${error.message}\n`);
    }
  }
}

testFileAccess().catch(console.error);