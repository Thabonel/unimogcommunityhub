#!/usr/bin/env node
/**
 * WIS Import - Transform and Upload Extracted Procedures to Supabase
 *
 * Reads the extracted unimog-procedures.json and imports into:
 * - wis_models
 * - wis_systems
 * - wis_components
 * - wis_procedures
 * - wis_procedure_steps
 *
 * Usage: node scripts/wis-import-extracted.js [--dry-run]
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Dry run mode - can work without Supabase connection
const DRY_RUN = process.argv.includes('--dry-run');

let supabase = null;

if (!DRY_RUN) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    console.error('Set these in .env.local or .env file');
    console.error('');
    console.error('For dry-run mode (no Supabase needed): node scripts/wis-import-extracted.js --dry-run');
    process.exit(1);
  }
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

// Input file path
const INPUT_FILE = '/Volumes/UnimogManuals/wis-extractor/output/unimog-procedures.json';

// System name mappings (matching existing app)
const SYSTEM_NAMES = {
  '00': 'General Information',
  '01': 'Maintenance',
  '03': 'Engine - Mechanical',
  '05': 'Engine - Fuel System',
  '07': 'Engine - Exhaust',
  '09': 'Transmission',
  '13': 'Cooling System',
  '14': 'Suspension',
  '15': 'Steering',
  '18': 'Power Train',
  '20': 'Front Axle',
  '22': 'Wheels & Tires',
  '25': 'Propeller Shaft',
  '26': 'Transfer Case',
  '27': 'Rear Axle',
  '28': 'Differential Lock',
  '29': 'Portal Axle',
  '30': 'Instruments',
  '35': 'Lighting',
  '40': 'Frame/Body',
  '42': 'Doors/Hatches',
  '46': 'Heating/AC',
  '49': 'Hydraulics',
  '54': 'Seats',
  '58': 'Special Tools',
  '60': 'Cab Mounting',
  '62': 'Platform Body',
  '82': 'Power Take-Off (PTO)',
  '83': 'Winch'
};

// Stats
const stats = {
  models: 0,
  systems: 0,
  components: 0,
  procedures: 0,
  steps: 0,
  errors: []
};

// ID cache to track what we've created
const idCache = {
  models: new Map(),
  systems: new Map(),
  components: new Map()
};

async function upsertModel(modelCode, modelName, typCodes = []) {
  const cacheKey = modelCode;
  if (idCache.models.has(cacheKey)) {
    return idCache.models.get(cacheKey);
  }

  const modelData = {
    model_code: modelCode,
    model_name: modelName,
    description: `Unimog ${modelCode} series. TYP codes: ${typCodes.join(', ') || 'N/A'}`,
    year_range: '2000-2018',
    active: true,
    sort_order: stats.models + 1
  };

  if (DRY_RUN) {
    const id = randomUUID();
    console.log(`  [DRY RUN] Would create model: ${modelCode} -> ${modelName}`);
    idCache.models.set(cacheKey, id);
    stats.models++;
    return id;
  }

  try {
    // Try to find existing
    const { data: existing } = await supabase
      .from('wis_models')
      .select('id')
      .eq('model_code', modelCode)
      .single();

    if (existing) {
      idCache.models.set(cacheKey, existing.id);
      return existing.id;
    }

    // Create new
    const { data, error } = await supabase
      .from('wis_models')
      .insert(modelData)
      .select('id')
      .single();

    if (error) throw error;

    idCache.models.set(cacheKey, data.id);
    stats.models++;
    console.log(`  Created model: ${modelCode} -> ${modelName}`);
    return data.id;
  } catch (err) {
    stats.errors.push(`Model ${modelCode}: ${err.message}`);
    console.error(`  Error creating model ${modelCode}:`, err.message);
    return null;
  }
}

async function upsertSystem(modelId, systemCode, systemName) {
  const cacheKey = `${modelId}-${systemCode}`;
  if (idCache.systems.has(cacheKey)) {
    return idCache.systems.get(cacheKey);
  }

  const systemData = {
    model_id: modelId,
    system_code: systemCode,
    system_name: systemName || SYSTEM_NAMES[systemCode] || `System ${systemCode}`,
    description: `${systemName || SYSTEM_NAMES[systemCode] || 'System'} for Unimog`,
    sort_order: parseInt(systemCode, 10) || stats.systems + 1
  };

  if (DRY_RUN) {
    const id = randomUUID();
    console.log(`    [DRY RUN] Would create system: ${systemCode} -> ${systemData.system_name}`);
    idCache.systems.set(cacheKey, id);
    stats.systems++;
    return id;
  }

  try {
    // Try to find existing
    const { data: existing } = await supabase
      .from('wis_systems')
      .select('id')
      .eq('model_id', modelId)
      .eq('system_code', systemCode)
      .single();

    if (existing) {
      idCache.systems.set(cacheKey, existing.id);
      return existing.id;
    }

    // Create new
    const { data, error } = await supabase
      .from('wis_systems')
      .insert(systemData)
      .select('id')
      .single();

    if (error) throw error;

    idCache.systems.set(cacheKey, data.id);
    stats.systems++;
    console.log(`    Created system: ${systemCode} -> ${systemData.system_name}`);
    return data.id;
  } catch (err) {
    stats.errors.push(`System ${systemCode}: ${err.message}`);
    console.error(`    Error creating system ${systemCode}:`, err.message);
    return null;
  }
}

async function upsertComponent(systemId, componentCode, componentName) {
  const cacheKey = `${systemId}-${componentCode}`;
  if (idCache.components.has(cacheKey)) {
    return idCache.components.get(cacheKey);
  }

  const componentData = {
    system_id: systemId,
    component_code: componentCode,
    component_name: componentName || `Component ${componentCode}`,
    sort_order: parseInt(componentCode, 10) || stats.components + 1
  };

  if (DRY_RUN) {
    const id = randomUUID();
    idCache.components.set(cacheKey, id);
    stats.components++;
    return id;
  }

  try {
    // Try to find existing
    const { data: existing } = await supabase
      .from('wis_components')
      .select('id')
      .eq('system_id', systemId)
      .eq('component_code', componentCode)
      .single();

    if (existing) {
      idCache.components.set(cacheKey, existing.id);
      return existing.id;
    }

    // Create new
    const { data, error } = await supabase
      .from('wis_components')
      .insert(componentData)
      .select('id')
      .single();

    if (error) throw error;

    idCache.components.set(cacheKey, data.id);
    stats.components++;
    return data.id;
  } catch (err) {
    stats.errors.push(`Component ${componentCode}: ${err.message}`);
    console.error(`      Error creating component ${componentCode}:`, err.message);
    return null;
  }
}

async function upsertProcedure(componentId, procedure) {
  const procedureData = {
    component_id: componentId,
    procedure_code: procedure.procedure_code,
    title: procedure.title || 'Untitled Procedure',
    description: procedure.title,
    estimated_time_hours: null,
    difficulty_level: 2,
    labor_category: 'maintenance',
    safety_warnings: [],
    version: '1.0',
    status: 'active'
  };

  if (DRY_RUN) {
    console.log(`        [DRY RUN] Would create procedure: ${procedure.procedure_code}`);
    stats.procedures++;
    if (procedure.steps?.length) {
      stats.steps += procedure.steps.length;
    }
    return randomUUID();
  }

  try {
    // Check for existing by procedure_code
    const { data: existing } = await supabase
      .from('wis_procedures')
      .select('id')
      .eq('procedure_code', procedure.procedure_code)
      .single();

    let procedureId;

    if (existing) {
      procedureId = existing.id;
      // Update existing
      await supabase
        .from('wis_procedures')
        .update(procedureData)
        .eq('id', procedureId);
    } else {
      // Create new
      const { data, error } = await supabase
        .from('wis_procedures')
        .insert(procedureData)
        .select('id')
        .single();

      if (error) throw error;
      procedureId = data.id;
      stats.procedures++;
      console.log(`        Created procedure: ${procedure.procedure_code}`);
    }

    // Insert steps
    if (procedure.steps?.length && procedureId) {
      await upsertSteps(procedureId, procedure.steps);
    }

    return procedureId;
  } catch (err) {
    stats.errors.push(`Procedure ${procedure.procedure_code}: ${err.message}`);
    console.error(`        Error creating procedure ${procedure.procedure_code}:`, err.message);
    return null;
  }
}

async function upsertSteps(procedureId, steps) {
  if (DRY_RUN) return;

  try {
    // Delete existing steps first
    await supabase
      .from('wis_procedure_steps')
      .delete()
      .eq('procedure_id', procedureId);

    // Insert new steps
    const stepData = steps.map((step, index) => ({
      procedure_id: procedureId,
      step_number: step.step_number || index + 1,
      instruction: step.instruction || '',
      torque_specs: step.torque_specs || null,
      safety_warnings: []
    }));

    const { error } = await supabase
      .from('wis_procedure_steps')
      .insert(stepData);

    if (error) throw error;
    stats.steps += steps.length;
  } catch (err) {
    stats.errors.push(`Steps for procedure ${procedureId}: ${err.message}`);
  }
}

async function main() {
  console.log('');
  console.log('='.repeat(60));
  console.log('  WIS Import - Extracted Procedures to Supabase');
  console.log('='.repeat(60));
  console.log('');

  if (DRY_RUN) {
    console.log('  MODE: DRY RUN (no changes will be made)');
    console.log('');
  }

  // Check input file
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  console.log(`Reading: ${INPUT_FILE}`);
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

  console.log(`Found ${data.models?.length || 0} models`);
  console.log('');

  // Process each model
  for (const model of data.models || []) {
    console.log(`Processing model: ${model.model_code} (${model.model_name})`);

    const modelId = await upsertModel(
      model.model_code,
      model.model_name,
      model.typ_codes || []
    );

    if (!modelId) continue;

    // Process systems
    for (const system of model.systems || []) {
      const systemId = await upsertSystem(
        modelId,
        system.system_code,
        system.system_name
      );

      if (!systemId) continue;

      // Process components
      for (const component of system.components || []) {
        const componentId = await upsertComponent(
          systemId,
          component.component_code,
          component.component_name
        );

        if (!componentId) continue;

        // Process procedures
        for (const procedure of component.procedures || []) {
          await upsertProcedure(componentId, procedure);
        }
      }
    }
  }

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('  Import Complete');
  console.log('='.repeat(60));
  console.log(`  Models:     ${stats.models}`);
  console.log(`  Systems:    ${stats.systems}`);
  console.log(`  Components: ${stats.components}`);
  console.log(`  Procedures: ${stats.procedures}`);
  console.log(`  Steps:      ${stats.steps}`);

  if (stats.errors.length > 0) {
    console.log('');
    console.log(`  Errors: ${stats.errors.length}`);
    stats.errors.slice(0, 10).forEach(e => console.log(`    - ${e}`));
    if (stats.errors.length > 10) {
      console.log(`    ... and ${stats.errors.length - 10} more`);
    }
  }

  console.log('');

  if (DRY_RUN) {
    console.log('  This was a DRY RUN. Run without --dry-run to apply changes.');
  } else {
    console.log('  Data imported to Supabase successfully!');
  }
  console.log('');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
