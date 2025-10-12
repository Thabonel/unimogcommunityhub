#!/usr/bin/env tsx
/**
 * WIS Schema Audit Script
 *
 * Queries Supabase to detect presence of WIS tables, views, and functions.
 * Read-only - makes no changes to the database.
 *
 * Usage: npx tsx scripts/wis-schema-audit.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface SchemaItem {
  name: string;
  type: 'table' | 'view' | 'function';
  description: string;
}

const EXPECTED_ITEMS: SchemaItem[] = [
  // Core WIS tables (should already exist)
  { name: 'wis_models', type: 'table', description: 'Vehicle models' },
  { name: 'wis_systems', type: 'table', description: 'System categories' },
  { name: 'wis_components', type: 'table', description: 'Component groups' },
  { name: 'wis_procedures', type: 'table', description: 'Workshop procedures' },
  { name: 'wis_procedure_steps', type: 'table', description: 'Procedure steps' },
  { name: 'wis_parts', type: 'table', description: 'Parts catalog' },
  { name: 'wis_procedure_parts', type: 'table', description: 'Procedure-parts relationship' },
  { name: 'wis_tools', type: 'table', description: 'Tools catalog' },
  { name: 'wis_procedure_tools', type: 'table', description: 'Procedure-tools relationship' },
  { name: 'wis_service_bulletins', type: 'table', description: 'Service bulletins (original)' },
  { name: 'wis_bulletin_procedures', type: 'table', description: 'Bulletin-procedures relationship' },

  // Compatibility views (to be created)
  { name: 'wis_bulletins', type: 'view', description: 'Compatibility view for wis_service_bulletins' },
  { name: 'wis_documents_unified', type: 'view', description: 'Unified view of procedures and bulletins' },

  // Plan/Ops tables (to be created)
  { name: 'wis_plan_items', type: 'table', description: 'ETL plan items' },
  { name: 'wis_plan_releases', type: 'table', description: 'Plan release snapshots' },
  { name: 'wis_ingest_jobs', type: 'table', description: 'ETL job tracking' },
  { name: 'wis_ingest_errors', type: 'table', description: 'ETL error log' },
  { name: 'wis_etl_logs', type: 'table', description: 'ETL execution logs' },
  { name: 'wis_schema_versions', type: 'table', description: 'Schema version tracking' },

  // Chunks table for AI
  { name: 'wis_chunks', type: 'table', description: 'AI-searchable content chunks' },

  // View for active jobs
  { name: 'v_wis_active_jobs', type: 'view', description: 'Active ETL jobs view' }
];

async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .limit(0);

    return !error;
  } catch {
    return false;
  }
}

async function checkViewExists(viewName: string): Promise<boolean> {
  try {
    // Try to select from the view
    const { error } = await supabase
      .from(viewName)
      .select('*')
      .limit(0);

    return !error;
  } catch {
    return false;
  }
}

async function auditSchema() {
  console.log('🔍 WIS Schema Audit');
  console.log('='.repeat(60));
  console.log('');

  const results: { item: SchemaItem; status: 'present' | 'missing' }[] = [];

  for (const item of EXPECTED_ITEMS) {
    process.stdout.write(`Checking ${item.type}: ${item.name}...`);

    let exists = false;
    if (item.type === 'table' || item.type === 'view') {
      exists = item.type === 'table'
        ? await checkTableExists(item.name)
        : await checkViewExists(item.name);
    }

    const status = exists ? 'present' : 'missing';
    results.push({ item, status });

    const icon = exists ? '✅' : '❌';
    console.log(` ${icon} ${status}`);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('📊 Audit Summary');
  console.log('='.repeat(60));

  const present = results.filter(r => r.status === 'present').length;
  const missing = results.filter(r => r.status === 'missing').length;

  console.log(`Total items checked: ${results.length}`);
  console.log(`Present: ${present}`);
  console.log(`Missing: ${missing}`);
  console.log('');

  if (missing > 0) {
    console.log('📋 Missing Items:');
    results
      .filter(r => r.status === 'missing')
      .forEach(r => {
        console.log(`  - ${r.item.name} (${r.item.type}): ${r.item.description}`);
      });
    console.log('');
  }

  console.log('✅ Audit complete');
  return missing === 0 ? 0 : 1;
}

auditSchema()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('❌ Audit failed:', error);
    process.exit(1);
  });
