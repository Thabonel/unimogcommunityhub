#!/usr/bin/env node
/**
 * Cleanup Empty Paths - Remove systems/components with no procedures
 * This prevents users from navigating to empty sections
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DRY_RUN = process.argv.includes('--dry-run');

async function cleanup() {
  console.log('Cleanup Empty Navigation Paths');
  console.log('='.repeat(50));

  if (DRY_RUN) {
    console.log('MODE: DRY RUN');
  }
  console.log('');

  let componentsDeleted = 0;
  let systemsDeleted = 0;
  let modelsDeleted = 0;

  // 1. Find and delete empty components (no procedures)
  console.log('Checking components...');
  const { data: allComponents } = await supabase
    .from('wis_components')
    .select('id, component_code, component_name, system_id');

  for (const comp of allComponents || []) {
    const { count } = await supabase
      .from('wis_procedures')
      .select('*', { count: 'exact', head: true })
      .eq('component_id', comp.id);

    if (count === 0) {
      console.log(`  Empty component: ${comp.component_code} - ${comp.component_name}`);

      if (!DRY_RUN) {
        await supabase.from('wis_components').delete().eq('id', comp.id);
      }
      componentsDeleted++;
    }
  }

  // 2. Find and delete empty systems (no components)
  console.log('');
  console.log('Checking systems...');
  const { data: allSystems } = await supabase
    .from('wis_systems')
    .select('id, system_code, system_name, model_id');

  for (const sys of allSystems || []) {
    const { count } = await supabase
      .from('wis_components')
      .select('*', { count: 'exact', head: true })
      .eq('system_id', sys.id);

    if (count === 0) {
      console.log(`  Empty system: ${sys.system_code} - ${sys.system_name}`);

      if (!DRY_RUN) {
        await supabase.from('wis_systems').delete().eq('id', sys.id);
      }
      systemsDeleted++;
    }
  }

  // 3. Find and delete empty models (no systems)
  console.log('');
  console.log('Checking models...');
  const { data: allModels } = await supabase
    .from('wis_models')
    .select('id, model_code, model_name');

  for (const model of allModels || []) {
    const { count } = await supabase
      .from('wis_systems')
      .select('*', { count: 'exact', head: true })
      .eq('model_id', model.id);

    if (count === 0) {
      console.log(`  Empty model: ${model.model_code} - ${model.model_name}`);

      if (!DRY_RUN) {
        await supabase.from('wis_models').delete().eq('id', model.id);
      }
      modelsDeleted++;
    }
  }

  console.log('');
  console.log('='.repeat(50));
  console.log('Summary');
  console.log('='.repeat(50));
  console.log(`  Components deleted: ${componentsDeleted}`);
  console.log(`  Systems deleted:    ${systemsDeleted}`);
  console.log(`  Models deleted:     ${modelsDeleted}`);
  console.log('');

  if (DRY_RUN) {
    console.log('This was a DRY RUN. Run without --dry-run to apply changes.');
  } else {
    console.log('Empty paths have been removed!');
  }
  console.log('');
}

cleanup().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
