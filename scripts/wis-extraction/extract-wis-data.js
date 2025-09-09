#!/usr/bin/env node

/**
 * Mercedes WIS Database Extraction Tool
 * Extracts data from WIS database and uploads to Supabase
 */

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const config = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  extraction: {
    batchSize: 100,
    outputDir: './wis-extracted-data',
    vdiMountPath: '/Volumes/WIS' // Path where VDI is mounted
  }
};

// Initialize Supabase client with service role key
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Check if WIS VDI is mounted and accessible
 */
async function checkVDIAccess() {
  try {
    console.log('Checking VDI mount status...');
    
    // Check if mount point exists
    const mountPath = config.extraction.vdiMountPath;
    const stats = await fs.stat(mountPath).catch(() => null);
    
    if (!stats) {
      console.log('❌ VDI not mounted at', mountPath);
      console.log('\nTo mount the VDI:');
      console.log('1. Use Parallels Desktop, VMware Fusion, or VirtualBox');
      console.log('2. Mount the MERCEDES.vdi file');
      console.log('3. Ensure it\'s accessible at', mountPath);
      return false;
    }
    
    console.log('✅ VDI mounted and accessible');
    return true;
  } catch (error) {
    console.error('Error checking VDI access:', error);
    return false;
  }
}

/**
 * Parse WIS database files (MDB format)
 */
async function parseWISDatabase() {
  console.log('\n📊 Parsing WIS database files...');
  
  const data = {
    procedures: [],
    parts: [],
    bulletins: [],
    diagrams: [],
    models: []
  };
  
  // Common WIS database locations
  const dbPaths = [
    '/EWA net/database',
    '/Program Files/EWA net/database',
    '/Mercedes/WIS/database'
  ];
  
  for (const dbPath of dbPaths) {
    const fullPath = path.join(config.extraction.vdiMountPath, dbPath);
    
    try {
      const files = await fs.readdir(fullPath).catch(() => []);
      console.log(`Found ${files.length} files in ${dbPath}`);
      
      // Look for MDB files
      const mdbFiles = files.filter(f => f.endsWith('.mdb') || f.endsWith('.accdb'));
      for (const mdbFile of mdbFiles) {
        console.log(`  - Found database: ${mdbFile}`);
        // Note: Actual MDB parsing would require mdb-tools or similar
      }
      
      // Look for ROM files
      const romFiles = files.filter(f => f.startsWith('rfile'));
      for (const romFile of romFiles) {
        console.log(`  - Found ROM file: ${romFile}`);
      }
    } catch (error) {
      // Directory doesn't exist, continue
    }
  }
  
  return data;
}

/**
 * Extract sample data from known WIS structure
 */
async function extractSampleData() {
  console.log('\n📁 Extracting sample data from WIS structure...');
  
  // Sample data structure based on WIS format
  const sampleData = {
    procedures: [
      {
        procedure_code: 'U400-001',
        title: 'Engine Oil Change Procedure',
        model: 'U400',  // Changed from model_name to model
        system: 'Engine',
        subsystem: 'Lubrication',
        content: 'Complete procedure for changing engine oil on Unimog U400...',
        tools_required: ['Oil filter wrench', '17mm socket', 'Oil drain pan'],
        parts_required: ['Engine oil 15W-40', 'Oil filter', 'Drain plug gasket'],
        time_estimate: 45,
        difficulty: 'easy'
      },
      {
        procedure_code: 'U500-002',
        title: 'Portal Axle Service',
        model: 'U500',  // Changed from model_name to model
        system: 'Drivetrain',
        subsystem: 'Portal Axles',
        content: 'Service procedure for portal axles including oil change...',
        tools_required: ['Portal axle oil pump', 'Hex key set', 'Torque wrench'],
        parts_required: ['Portal axle oil', 'Gaskets'],
        time_estimate: 120,
        difficulty: 'medium'
      }
    ],
    parts: [
      {
        part_number: 'A4061800009',
        description: 'Engine Oil Filter',
        category: 'Filters',
        models: ['U300', 'U400', 'U500'],
        specifications: {
          type: 'Spin-on',
          thread: 'M27x2',
          height: '145mm'
        }
      },
      {
        part_number: 'A0004771302',
        description: 'Portal Axle Oil',
        category: 'Fluids',
        models: ['U400', 'U500', 'U4000', 'U5000'],
        specifications: {
          type: 'Hypoid gear oil',
          viscosity: '85W-90',
          volume: '1L'
        }
      }
    ],
    bulletins: [
      {
        bulletin_number: 'TSB-2023-001',
        title: 'Updated Torque Specifications for Portal Axles',
        models_affected: ['U400', 'U500'],
        issue_date: '2023-01-15',
        category: 'Technical Update',
        content: 'New torque specifications for portal axle housing bolts...',
        priority: 'recommended'
      }
    ],
    models: [
      {
        model_code: 'U300',
        model_name: 'U300',
        year_from: 2000,
        year_to: 2013,
        engine_options: { engines: ['OM904LA'] },
        specifications: { type: 'Light duty', gvw: '7500kg' }
      },
      {
        model_code: 'U400',
        model_name: 'U400',
        year_from: 2000,
        year_to: 2013,
        engine_options: { engines: ['OM904LA', 'OM906LA'] },
        specifications: { type: 'Medium duty', gvw: '10000kg' }
      },
      {
        model_code: 'U500',
        model_name: 'U500',
        year_from: 2000,
        year_to: 2013,
        engine_options: { engines: ['OM906LA'] },
        specifications: { type: 'Heavy duty', gvw: '14000kg' }
      }
    ]
  };
  
  return sampleData;
}

/**
 * Upload data to Supabase Workshop Database
 */
async function uploadToSupabase(data) {
  console.log('\n⬆️  Uploading to Supabase Workshop Database...');
  
  const results = {
    procedures: { success: 0, failed: 0 },
    parts: { success: 0, failed: 0 },
    bulletins: { success: 0, failed: 0 },
    models: { success: 0, failed: 0 }
  };
  
  // Upload procedures
  if (data.procedures && data.procedures.length > 0) {
    console.log(`\nUploading ${data.procedures.length} procedures...`);
    
    for (let i = 0; i < data.procedures.length; i += config.extraction.batchSize) {
      const batch = data.procedures.slice(i, i + config.extraction.batchSize);
      
      const { error } = await supabase
        .from('wis_procedures')
        .upsert(batch, { onConflict: 'procedure_code' });
      
      if (error) {
        console.error('Error uploading procedures batch:', error);
        results.procedures.failed += batch.length;
      } else {
        results.procedures.success += batch.length;
        console.log(`  ✅ Uploaded ${i + batch.length}/${data.procedures.length} procedures`);
      }
    }
  }
  
  // Upload parts
  if (data.parts && data.parts.length > 0) {
    console.log(`\nUploading ${data.parts.length} parts...`);
    
    for (let i = 0; i < data.parts.length; i += config.extraction.batchSize) {
      const batch = data.parts.slice(i, i + config.extraction.batchSize);
      
      const { error } = await supabase
        .from('wis_parts')
        .upsert(batch, { onConflict: 'part_number' });
      
      if (error) {
        console.error('Error uploading parts batch:', error);
        results.parts.failed += batch.length;
      } else {
        results.parts.success += batch.length;
        console.log(`  ✅ Uploaded ${i + batch.length}/${data.parts.length} parts`);
      }
    }
  }
  
  // Upload bulletins
  if (data.bulletins && data.bulletins.length > 0) {
    console.log(`\nUploading ${data.bulletins.length} bulletins...`);
    
    for (const bulletin of data.bulletins) {
      const { error } = await supabase
        .from('wis_bulletins')
        .upsert(bulletin, { onConflict: 'bulletin_number' });
      
      if (error) {
        console.error('Error uploading bulletin:', error);
        results.bulletins.failed++;
      } else {
        results.bulletins.success++;
      }
    }
    console.log(`  ✅ Uploaded ${results.bulletins.success} bulletins`);
  }
  
  // Upload models
  if (data.models && data.models.length > 0) {
    console.log(`\nUploading ${data.models.length} models...`);
    
    for (const model of data.models) {
      const { error } = await supabase
        .from('wis_models')
        .upsert(model, { onConflict: 'model_code' });
      
      if (error) {
        console.error('Error uploading model:', error);
        results.models.failed++;
      } else {
        results.models.success++;
      }
    }
    console.log(`  ✅ Uploaded ${results.models.success} models`);
  }
  
  return results;
}

/**
 * Save extracted data locally for backup
 */
async function saveExtractedData(data) {
  const outputDir = config.extraction.outputDir;
  await fs.mkdir(outputDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  for (const [key, value] of Object.entries(data)) {
    if (value && value.length > 0) {
      const filename = `${key}-${timestamp}.json`;
      const filepath = path.join(outputDir, filename);
      
      await fs.writeFile(filepath, JSON.stringify(value, null, 2));
      console.log(`  💾 Saved ${key} to ${filename}`);
    }
  }
}

/**
 * Main extraction process
 */
async function main() {
  console.log('====================================');
  console.log('Mercedes WIS Database Extraction');
  console.log('====================================\n');
  
  // Check environment
  if (!config.supabase.url || !config.supabase.serviceKey) {
    console.error('❌ Missing Supabase configuration!');
    console.log('Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    process.exit(1);
  }
  
  // Check VDI access
  const vdiAccessible = await checkVDIAccess();
  
  let extractedData;
  
  if (vdiAccessible) {
    // Try to parse actual WIS database
    extractedData = await parseWISDatabase();
  }
  
  // If no data extracted, use sample data
  if (!extractedData || Object.values(extractedData).every(arr => arr.length === 0)) {
    console.log('\n⚠️  No data extracted from VDI. Using sample data for testing...');
    extractedData = await extractSampleData();
  }
  
  // Save extracted data locally
  console.log('\n💾 Saving extracted data...');
  await saveExtractedData(extractedData);
  
  // Upload to Supabase
  const uploadResults = await uploadToSupabase(extractedData);
  
  // Summary
  console.log('\n====================================');
  console.log('Extraction Summary');
  console.log('====================================');
  console.log('Procedures:', uploadResults.procedures);
  console.log('Parts:', uploadResults.parts);
  console.log('Bulletins:', uploadResults.bulletins);
  console.log('Models:', uploadResults.models);
  console.log('\n✅ Extraction complete!');
  
  // Next steps
  console.log('\n📋 Next Steps:');
  console.log('1. Install DbVisualizer for full database export');
  console.log('2. Mount the WIS VDI file using VM software');
  console.log('3. Connect to Transbase database (localhost:2054)');
  console.log('4. Export complete database tables');
  console.log('5. Run this script again with full data');
}

// Run the extraction
main().catch(console.error);