#!/usr/bin/env node
/**
 * Fix U1700L Data - Merge U435 data into U1700L
 *
 * U1700L is based on TYP 435 chassis (Australian military variant)
 * This script moves all U435 systems/components/procedures to U1700L
 *
 * Usage: node scripts/fix-u1700l-data.js [--dry-run]
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const DRY_RUN = process.argv.includes('--dry-run');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log('');
  console.log('='.repeat(60));
  console.log('  Fix U1700L Data - Merge TYP 435 Data');
  console.log('='.repeat(60));
  console.log('');

  if (DRY_RUN) {
    console.log('  MODE: DRY RUN (no changes will be made)');
    console.log('');
  }

  // 1. Find U1700L and U435 models
  const { data: models } = await supabase
    .from('wis_models')
    .select('*')
    .in('model_code', ['U1700L', 'U435']);

  const u1700l = models?.find(m => m.model_code === 'U1700L');
  const u435 = models?.find(m => m.model_code === 'U435');

  console.log('Current state:');
  console.log(`  U1700L: ${u1700l ? u1700l.id : 'NOT FOUND'}`);
  console.log(`  U435:   ${u435 ? u435.id : 'NOT FOUND'}`);
  console.log('');

  if (!u1700l) {
    console.error('U1700L model not found!');
    process.exit(1);
  }

  // 2. Get all systems from U435 (and related models)
  const modelsToMerge = ['U435', 'U1000', 'Unimog'];
  const { data: sourceSystems } = await supabase
    .from('wis_systems')
    .select(`
      *,
      wis_models!inner(model_code)
    `)
    .in('wis_models.model_code', modelsToMerge);

  console.log(`Found ${sourceSystems?.length || 0} systems from ${modelsToMerge.join(', ')}`);

  // 3. Get existing U1700L systems
  const { data: existingSystems } = await supabase
    .from('wis_systems')
    .select('system_code')
    .eq('model_id', u1700l.id);

  const existingCodes = new Set(existingSystems?.map(s => s.system_code) || []);
  console.log(`U1700L already has ${existingCodes.size} systems`);
  console.log('');

  let systemsCreated = 0;
  let componentsCreated = 0;
  let proceduresMoved = 0;

  // 4. Copy/move systems to U1700L
  for (const sourceSystem of sourceSystems || []) {
    // Skip if U1700L already has this system
    if (existingSystems && existingSystems.find(s => s.system_code === sourceSystem.system_code)) {
      // System exists, we need to merge components
      const { data: u1700lSystem } = await supabase
        .from('wis_systems')
        .select('id')
        .eq('model_id', u1700l.id)
        .eq('system_code', sourceSystem.system_code)
        .single();

      if (u1700lSystem) {
        await mergeComponents(sourceSystem.id, u1700lSystem.id);
      }
      continue;
    }

    console.log(`Creating system: ${sourceSystem.system_code} - ${sourceSystem.system_name}`);

    if (!DRY_RUN) {
      const { data: newSystem, error } = await supabase
        .from('wis_systems')
        .insert({
          model_id: u1700l.id,
          system_code: sourceSystem.system_code,
          system_name: sourceSystem.system_name,
          description: sourceSystem.description,
          sort_order: sourceSystem.sort_order
        })
        .select('id')
        .single();

      if (error) {
        console.error(`  Error: ${error.message}`);
        continue;
      }

      systemsCreated++;

      // Copy components
      const { data: components } = await supabase
        .from('wis_components')
        .select('*')
        .eq('system_id', sourceSystem.id);

      for (const comp of components || []) {
        const { data: newComp, error: compError } = await supabase
          .from('wis_components')
          .insert({
            system_id: newSystem.id,
            component_code: comp.component_code,
            component_name: comp.component_name,
            sort_order: comp.sort_order
          })
          .select('id')
          .single();

        if (compError) {
          console.error(`    Component error: ${compError.message}`);
          continue;
        }

        componentsCreated++;

        // Copy procedures
        const { data: procs } = await supabase
          .from('wis_procedures')
          .select('*')
          .eq('component_id', comp.id);

        for (const proc of procs || []) {
          const { data: newProc, error: procError } = await supabase
            .from('wis_procedures')
            .insert({
              component_id: newComp.id,
              procedure_code: proc.procedure_code + '-U1700L',
              title: proc.title,
              description: proc.description,
              estimated_time_hours: proc.estimated_time_hours,
              difficulty_level: proc.difficulty_level,
              labor_category: proc.labor_category,
              safety_warnings: proc.safety_warnings,
              version: proc.version,
              status: proc.status
            })
            .select('id')
            .single();

          if (procError) {
            console.error(`      Procedure error: ${procError.message}`);
            continue;
          }

          proceduresMoved++;

          // Copy steps
          const { data: steps } = await supabase
            .from('wis_procedure_steps')
            .select('*')
            .eq('procedure_id', proc.id);

          if (steps?.length) {
            const stepsData = steps.map(s => ({
              procedure_id: newProc.id,
              step_number: s.step_number,
              instruction: s.instruction,
              torque_specs: s.torque_specs,
              safety_warnings: s.safety_warnings
            }));

            await supabase
              .from('wis_procedure_steps')
              .insert(stepsData);
          }
        }
      }
    } else {
      systemsCreated++;
    }
  }

  async function mergeComponents(sourceSystemId, targetSystemId) {
    const { data: sourceComps } = await supabase
      .from('wis_components')
      .select('*')
      .eq('system_id', sourceSystemId);

    const { data: targetComps } = await supabase
      .from('wis_components')
      .select('component_code')
      .eq('system_id', targetSystemId);

    const targetCodes = new Set(targetComps?.map(c => c.component_code) || []);

    for (const comp of sourceComps || []) {
      if (targetCodes.has(comp.component_code)) continue;

      if (!DRY_RUN) {
        const { data: newComp } = await supabase
          .from('wis_components')
          .insert({
            system_id: targetSystemId,
            component_code: comp.component_code,
            component_name: comp.component_name,
            sort_order: comp.sort_order
          })
          .select('id')
          .single();

        if (newComp) {
          componentsCreated++;

          // Copy procedures
          const { data: procs } = await supabase
            .from('wis_procedures')
            .select('*')
            .eq('component_id', comp.id);

          for (const proc of procs || []) {
            const { data: newProc } = await supabase
              .from('wis_procedures')
              .insert({
                component_id: newComp.id,
                procedure_code: proc.procedure_code + '-U1700L',
                title: proc.title,
                description: proc.description,
                estimated_time_hours: proc.estimated_time_hours,
                difficulty_level: proc.difficulty_level,
                labor_category: proc.labor_category,
                safety_warnings: proc.safety_warnings,
                version: proc.version,
                status: proc.status
              })
              .select('id')
              .single();

            if (newProc) {
              proceduresMoved++;

              const { data: steps } = await supabase
                .from('wis_procedure_steps')
                .select('*')
                .eq('procedure_id', proc.id);

              if (steps?.length) {
                await supabase.from('wis_procedure_steps').insert(
                  steps.map(s => ({
                    procedure_id: newProc.id,
                    step_number: s.step_number,
                    instruction: s.instruction,
                    torque_specs: s.torque_specs,
                    safety_warnings: s.safety_warnings
                  }))
                );
              }
            }
          }
        }
      } else {
        componentsCreated++;
      }
    }
  }

  // 5. Update U1700L model description
  if (!DRY_RUN) {
    await supabase
      .from('wis_models')
      .update({
        description: 'Unimog U1700L - Australian Military variant based on TYP 435 chassis. Includes service procedures from U435, U1000, and general Unimog documentation.',
        model_name: 'Unimog U1700L'
      })
      .eq('id', u1700l.id);
  }

  // Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('  Summary');
  console.log('='.repeat(60));
  console.log(`  Systems created:    ${systemsCreated}`);
  console.log(`  Components created: ${componentsCreated}`);
  console.log(`  Procedures moved:   ${proceduresMoved}`);
  console.log('');

  if (DRY_RUN) {
    console.log('  This was a DRY RUN. Run without --dry-run to apply changes.');
  } else {
    console.log('  U1700L now has access to all TYP 435 data!');
  }
  console.log('');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
