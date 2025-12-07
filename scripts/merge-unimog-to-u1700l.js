#!/usr/bin/env node
/**
 * Merge procedures from general Unimog model into U1700L
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function mergeFromUnimog() {
  console.log('Merging procedures from general Unimog into U1700L...');
  console.log('');

  // Get model IDs
  const { data: models } = await supabase
    .from('wis_models')
    .select('id, model_code')
    .in('model_code', ['U1700L', 'Unimog']);

  const u1700l = models.find(m => m.model_code === 'U1700L');
  const unimog = models.find(m => m.model_code === 'Unimog');

  if (!u1700l || !unimog) {
    console.error('Models not found');
    process.exit(1);
  }

  // Get U1700L systems
  const { data: u1700lSystems } = await supabase
    .from('wis_systems')
    .select('id, system_code')
    .eq('model_id', u1700l.id);

  // Get Unimog systems
  const { data: unimogSystems } = await supabase
    .from('wis_systems')
    .select('id, system_code')
    .eq('model_id', unimog.id);

  let proceduresCopied = 0;
  let stepsCopied = 0;

  // For each U1700L system, find matching Unimog system and copy procedures
  for (const u1700lSys of u1700lSystems) {
    const unimogSys = unimogSystems.find(s => s.system_code === u1700lSys.system_code);
    if (!unimogSys) continue;

    // Get U1700L components
    const { data: u1700lComps } = await supabase
      .from('wis_components')
      .select('id, component_code')
      .eq('system_id', u1700lSys.id);

    // Get Unimog components
    const { data: unimogComps } = await supabase
      .from('wis_components')
      .select('id, component_code')
      .eq('system_id', unimogSys.id);

    for (const u1700lComp of u1700lComps || []) {
      const unimogComp = unimogComps?.find(c => c.component_code === u1700lComp.component_code);
      if (!unimogComp) continue;

      // Get existing U1700L procedure codes
      const { data: existingProcs } = await supabase
        .from('wis_procedures')
        .select('procedure_code')
        .eq('component_id', u1700lComp.id);

      const existingCodes = new Set(existingProcs?.map(p => p.procedure_code) || []);

      // Get Unimog procedures
      const { data: unimogProcs } = await supabase
        .from('wis_procedures')
        .select('*')
        .eq('component_id', unimogComp.id);

      for (const proc of unimogProcs || []) {
        const newCode = proc.procedure_code + '-U1700L';
        if (existingCodes.has(newCode)) continue;

        const { data: newProc, error } = await supabase
          .from('wis_procedures')
          .insert({
            component_id: u1700lComp.id,
            procedure_code: newCode,
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

        if (error) {
          console.log(`  Error copying ${proc.procedure_code}: ${error.message}`);
          continue;
        }

        if (newProc) {
          proceduresCopied++;
          console.log(`  Copied: ${proc.procedure_code} -> ${newCode}`);

          // Copy steps
          const { data: steps } = await supabase
            .from('wis_procedure_steps')
            .select('*')
            .eq('procedure_id', proc.id);

          if (steps?.length) {
            const { error: stepError } = await supabase.from('wis_procedure_steps').insert(
              steps.map(s => ({
                procedure_id: newProc.id,
                step_number: s.step_number,
                instruction: s.instruction,
                torque_specs: s.torque_specs,
                safety_warnings: s.safety_warnings
              }))
            );

            if (!stepError) {
              stepsCopied += steps.length;
            }
          }
        }
      }
    }
  }

  console.log('');
  console.log('='.repeat(40));
  console.log(`Procedures copied: ${proceduresCopied}`);
  console.log(`Steps copied: ${stepsCopied}`);
  console.log('');
}

mergeFromUnimog().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
