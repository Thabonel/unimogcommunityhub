#!/usr/bin/env node

/**
 * Test script for PDF to image conversion
 */

const { createClient } = require('@supabase/supabase-js');
const pdf2pic = require('pdf2pic');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function testPdfToImage() {
  console.log('🧪 Testing PDF to image conversion...');
  
  // Download a small manual for testing
  console.log('📥 Downloading test manual...');
  const { data, error } = await supabase.storage
    .from('manuals')
    .download('G600-Data-Summary.pdf');
    
  if (error) {
    console.error('❌ Download error:', error);
    return;
  }
  
  // Create temp directory
  const tempDir = path.join(__dirname, 'temp-test');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Save PDF to temp file
  const buffer = Buffer.from(await data.arrayBuffer());
  const tempPdfPath = path.join(tempDir, 'test.pdf');
  fs.writeFileSync(tempPdfPath, buffer);
  
  console.log(`📄 Saved PDF to ${tempPdfPath} (${buffer.length} bytes)`);
  
  try {
    // Test different pdf2pic configurations
    console.log('🔄 Testing pdf2pic conversion...');
    
    const convert = pdf2pic.fromPath(tempPdfPath, {
      density: 100,
      saveFilename: 'page',
      savePath: tempDir,
      format: 'png',
      width: 600
    });
    
    // Convert first page
    console.log('Converting page 1...');
    const result = await convert(1);
    
    console.log('Result:', result);
    
    if (result && result.path) {
      const imagePath = result.path;
      console.log(`✅ Image saved to: ${imagePath}`);
      
      // Check file size
      const stats = fs.statSync(imagePath);
      console.log(`📊 Image size: ${stats.size} bytes`);
      
      // Test upload to Supabase
      const imageBuffer = fs.readFileSync(imagePath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('manual-images')
        .upload('test/page-001.png', imageBuffer, {
          contentType: 'image/png',
          upsert: true
        });
        
      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
      } else {
        console.log('✅ Upload successful:', uploadData);
        
        const imageUrl = `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/manual-images/test/page-001.png`;
        console.log(`🔗 Image URL: ${imageUrl}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Conversion error:', error);
  } finally {
    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

testPdfToImage();