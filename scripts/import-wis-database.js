#!/usr/bin/env node

/**
 * WIS Database Import Script
 * Imports complete Mercedes WIS data for Unimog U435 to Supabase
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service role key for admin operations

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   VITE_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('   SUPABASE_SERVICE_KEY:', !!SUPABASE_SERVICE_KEY);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Data file paths
const DATA_DIR = '/Volumes/UnimogManuals/U435-COMPLETE-EXTRACT';
const FILES = {
  procedures: path.join(DATA_DIR, 'u435_procedures.json'),
  parts: path.join(DATA_DIR, 'u435_parts.json'),
  bulletins: path.join(DATA_DIR, 'u435_bulletins.json')
};

/**
 * Helper function to create searchable keywords from object
 */
function createSearchKeywords(obj) {
  const keywords = [];
  
  if (obj.title) keywords.push(obj.title);
  if (obj.category) keywords.push(obj.category);
  if (obj.subcategory) keywords.push(obj.subcategory);
  if (obj.part_name) keywords.push(obj.part_name);
  if (obj.part_number) keywords.push(obj.part_number);
  if (obj.procedure_code) keywords.push(obj.procedure_code);
  if (obj.bulletin_number) keywords.push(obj.bulletin_number);
  
  // Add specific searchable terms
  if (obj.tools_required) keywords.push(...obj.tools_required);
  if (obj.materials_required) keywords.push(...obj.materials_required);
  
  return keywords.join(' ').toLowerCase();
}

/**
 * Import Unimog U435 model definition
 */
async function importModel() {
  console.log('📋 Importing Unimog U435 model...');
  
  const modelData = {
    model_code: 'U435',
    model_name: 'Unimog U435',
    series: 'U400 Series', 
    year_from: 1974,
    year_to: 1991,
    description: 'Mercedes-Benz Unimog U435 (1974-1991) - Heavy-duty utility vehicle with portal axles and versatile implement mounting',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Insert or get existing model
  const { data: existingModel } = await supabase
    .from('wis_models')
    .select('id')
    .eq('model_code', 'U435')
    .single();
  
  if (existingModel) {
    console.log('✅ Model U435 already exists with ID:', existingModel.id);
    return existingModel.id;
  }
  
  const { data, error } = await supabase
    .from('wis_models')
    .insert(modelData)
    .select('id')
    .single();
  
  if (error) {
    console.error('❌ Error importing model:', error);
    throw error;
  }
  
  console.log('✅ Model imported with ID:', data.id);
  return data.id;
}

/**
 * Import procedures data
 */
async function importProcedures(modelId) {
  console.log('🔧 Importing procedures...');
  
  if (!fs.existsSync(FILES.procedures)) {
    console.error('❌ Procedures file not found:', FILES.procedures);
    return;
  }
  
  const rawData = fs.readFileSync(FILES.procedures, 'utf8');
  const procedures = JSON.parse(rawData);
  
  console.log(`📊 Processing ${procedures.length} procedures...`);
  
  const batchSize = 100;
  let imported = 0;
  
  for (let i = 0; i < procedures.length; i += batchSize) {
    const batch = procedures.slice(i, i + batchSize);
    const transformedBatch = batch.map(proc => ({
      vehicle_id: modelId, // Map to correct field name
      procedure_code: proc.procedure_code,
      title: proc.title,
      category: proc.category,
      subcategory: proc.subcategory,
      description: proc.description,
      content: proc.content,
      difficulty_level: proc.difficulty || 1,
      estimated_time_minutes: proc.time_hours ? Math.round(proc.time_hours * 60) : null,
      tools_required: proc.tools_required || [],
      materials_required: proc.materials_required || [],
      safety_warnings: proc.safety_warnings || [],
      steps: proc.steps || [],
      media: proc.media || [],
      keywords: createSearchKeywords(proc),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    const { data, error } = await supabase
      .from('wis_procedures')
      .insert(transformedBatch)
      .select('id');
    
    if (error) {
      console.error('❌ Error importing procedures batch:', error);
      console.error('First item in failed batch:', transformedBatch[0]);
      throw error;
    }
    
    imported += data.length;
    console.log(`✅ Imported ${imported}/${procedures.length} procedures`);
  }
  
  console.log(`🎉 Successfully imported ${imported} procedures`);
}

/**
 * Import parts data
 */
async function importParts(modelId) {
  console.log('🔩 Importing parts...');
  
  if (!fs.existsSync(FILES.parts)) {
    console.error('❌ Parts file not found:', FILES.parts);
    return;
  }
  
  const rawData = fs.readFileSync(FILES.parts, 'utf8');
  const parts = JSON.parse(rawData);
  
  console.log(`📊 Processing ${parts.length} parts...`);
  
  const batchSize = 100;
  let imported = 0;
  
  for (let i = 0; i < parts.length; i += batchSize) {
    const batch = parts.slice(i, i + batchSize);
    const transformedBatch = batch.map(part => ({
      vehicle_id: modelId, // Map to correct field name
      part_number: part.part_number,
      part_name: part.part_name,
      category: part.category,
      subcategory: part.subcategory,
      description: part.description,
      price_estimate: part.price_estimate,
      availability_status: part.availability_status || 'unknown',
      superseded_by: part.superseded_by,
      notes: part.notes,
      media: part.media || [],
      keywords: createSearchKeywords(part),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    const { data, error } = await supabase
      .from('wis_parts')
      .insert(transformedBatch)
      .select('id');
    
    if (error) {
      console.error('❌ Error importing parts batch:', error);
      console.error('First item in failed batch:', transformedBatch[0]);
      throw error;
    }
    
    imported += data.length;
    console.log(`✅ Imported ${imported}/${parts.length} parts`);
  }
  
  console.log(`🎉 Successfully imported ${imported} parts`);
}

/**
 * Import service bulletins data
 */
async function importBulletins(modelId) {
  console.log('📢 Importing service bulletins...');
  
  if (!fs.existsSync(FILES.bulletins)) {
    console.error('❌ Bulletins file not found:', FILES.bulletins);
    return;
  }
  
  const rawData = fs.readFileSync(FILES.bulletins, 'utf8');
  const bulletins = JSON.parse(rawData);
  
  console.log(`📊 Processing ${bulletins.length} bulletins...`);
  
  const batchSize = 50;
  let imported = 0;
  
  for (let i = 0; i < bulletins.length; i += batchSize) {
    const batch = bulletins.slice(i, i + batchSize);
    const transformedBatch = batch.map(bulletin => ({
      vehicle_id: modelId, // Map to correct field name
      bulletin_number: bulletin.bulletin_number,
      title: bulletin.title,
      category: bulletin.category,
      severity: bulletin.severity,
      description: bulletin.description,
      content: bulletin.content,
      issue_date: bulletin.issue_date,
      date_updated: bulletin.date_updated,
      status: bulletin.status || 'active',
      media: bulletin.media || [],
      keywords: createSearchKeywords(bulletin),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    const { data, error } = await supabase
      .from('wis_bulletins')
      .insert(transformedBatch)
      .select('id');
    
    if (error) {
      console.error('❌ Error importing bulletins batch:', error);
      console.error('First item in failed batch:', transformedBatch[0]);
      throw error;
    }
    
    imported += data.length;
    console.log(`✅ Imported ${imported}/${bulletins.length} bulletins`);
  }
  
  console.log(`🎉 Successfully imported ${imported} bulletins`);
}

/**
 * Main import function
 */
async function main() {
  console.log('🚀 Starting WIS Database Import...');
  console.log('📂 Data source:', DATA_DIR);
  
  try {
    // Check if data files exist
    for (const [type, file] of Object.entries(FILES)) {
      if (!fs.existsSync(file)) {
        console.error(`❌ Missing ${type} file:`, file);
        process.exit(1);
      }
      console.log(`✅ Found ${type} file:`, path.basename(file));
    }
    
    // Import model first
    const modelId = await importModel();
    
    // Import all data types
    await importProcedures(modelId);
    await importParts(modelId);
    await importBulletins(modelId);
    
    console.log('🎉 WIS Database import completed successfully!');
    console.log('📊 Summary:');
    
    // Get final counts
    const { data: procedureCount } = await supabase
      .from('wis_procedures')
      .select('id', { count: 'exact' })
      .eq('vehicle_id', modelId);
    
    const { data: partsCount } = await supabase
      .from('wis_parts')
      .select('id', { count: 'exact' })
      .eq('vehicle_id', modelId);
    
    const { data: bulletinCount } = await supabase
      .from('wis_bulletins')
      .select('id', { count: 'exact' })
      .eq('vehicle_id', modelId);
    
    console.log(`   📋 Procedures: ${procedureCount?.length || 0}`);
    console.log(`   🔩 Parts: ${partsCount?.length || 0}`);
    console.log(`   📢 Bulletins: ${bulletinCount?.length || 0}`);
    console.log('🏁 Ready for predictive search implementation!');
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  }
}

// Run the import
main();