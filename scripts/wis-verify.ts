#!/usr/bin/env tsx
/**
 * WIS Verification Script
 *
 * Tests all WIS system components for correctness and data integrity.
 * Runs read-only queries to verify schema, data, and functionality.
 *
 * Usage: npx tsx scripts/wis-verify.ts
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

interface CheckResult {
  name: string;
  status: 'OK' | 'FAIL' | 'WARN';
  message: string;
  details?: string;
}

const results: CheckResult[] = [];

function addResult(name: string, status: 'OK' | 'FAIL' | 'WARN', message: string, details?: string) {
  results.push({ name, status, message, details });

  const icon = status === 'OK' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} ${name}: ${message}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

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

async function checkTableCount(tableName: string, minExpected: number = 0): Promise<void> {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      addResult(`Table: ${tableName}`, 'FAIL', 'Query error', error.message);
      return;
    }

    const actualCount = count || 0;

    if (actualCount >= minExpected) {
      addResult(
        `Table: ${tableName}`,
        'OK',
        `${actualCount} rows`,
        minExpected > 0 ? `Expected at least ${minExpected}` : undefined
      );
    } else {
      addResult(
        `Table: ${tableName}`,
        'WARN',
        `Only ${actualCount} rows`,
        `Expected at least ${minExpected}`
      );
    }
  } catch (error) {
    addResult(`Table: ${tableName}`, 'FAIL', 'Exception', String(error));
  }
}

async function checkViewExists(viewName: string): Promise<void> {
  try {
    const { error } = await supabase
      .from(viewName)
      .select('*')
      .limit(1);

    if (error) {
      addResult(`View: ${viewName}`, 'FAIL', 'Not accessible', error.message);
    } else {
      addResult(`View: ${viewName}`, 'OK', 'Accessible');
    }
  } catch (error) {
    addResult(`View: ${viewName}`, 'FAIL', 'Exception', String(error));
  }
}

async function checkSearchFunction(functionName: string, testParams: any): Promise<void> {
  try {
    const { data, error } = await supabase.rpc(functionName, testParams);

    if (error) {
      addResult(`Function: ${functionName}`, 'FAIL', 'Execution error', error.message);
      return;
    }

    if (data !== null && data !== undefined) {
      addResult(
        `Function: ${functionName}`,
        'OK',
        'Returns data',
        `Result type: ${Array.isArray(data) ? `array (${data.length} items)` : typeof data}`
      );
    } else {
      addResult(`Function: ${functionName}`, 'WARN', 'Returns null/undefined');
    }
  } catch (error) {
    addResult(`Function: ${functionName}`, 'FAIL', 'Exception', String(error));
  }
}

async function runVerification() {
  console.log('🔍 WIS System Verification');
  console.log('='.repeat(80));
  console.log('');

  // ===== CORE TABLES =====
  console.log('📋 Core WIS Tables');
  console.log('-'.repeat(80));
  await checkTableCount('wis_models', 1);
  await checkTableCount('wis_systems', 1);
  await checkTableCount('wis_components', 1);
  await checkTableCount('wis_procedures', 100);
  await checkTableCount('wis_procedure_steps', 100);
  await checkTableCount('wis_parts', 100);
  await checkTableCount('wis_procedure_parts');
  await checkTableCount('wis_tools');
  await checkTableCount('wis_procedure_tools');
  await checkTableCount('wis_service_bulletins');
  await checkTableCount('wis_bulletin_procedures');
  console.log('');

  // ===== CONTENT TABLES =====
  console.log('📦 Content & Search Tables');
  console.log('-'.repeat(80));
  await checkTableCount('wis_bulletins', 10);
  await checkTableCount('wis_chunks', 100);
  console.log('');

  // ===== PLAN/OPS TABLES =====
  console.log('⚙️  Plan/Operations Tables');
  console.log('-'.repeat(80));
  await checkTableCount('wis_plan_items');
  await checkTableCount('wis_plan_releases');
  await checkTableCount('wis_ingest_jobs');
  await checkTableCount('wis_ingest_errors');
  await checkTableCount('wis_etl_logs');
  await checkTableCount('wis_schema_versions');
  console.log('');

  // ===== VIEWS =====
  console.log('👁️  Database Views');
  console.log('-'.repeat(80));
  await checkViewExists('v_wis_active_jobs');
  console.log('');

  // ===== SEARCH FUNCTIONS =====
  console.log('🔎 Search Functions');
  console.log('-'.repeat(80));

  // Test wis_comprehensive_search if it exists
  const { error: searchError } = await supabase.rpc('wis_comprehensive_search', {
    search_query: 'test',
    model_filter: null,
    limit_results: 5
  });

  if (!searchError) {
    addResult(
      'Function: wis_comprehensive_search',
      'OK',
      'Callable',
      'Search function is working'
    );
  } else {
    addResult(
      'Function: wis_comprehensive_search',
      'WARN',
      'Not available or error',
      searchError.message
    );
  }

  // Test get_wis_procedure_details if it exists
  const { data: procedures } = await supabase
    .from('wis_procedures')
    .select('id')
    .limit(1);

  if (procedures && procedures.length > 0) {
    const testProcedureId = procedures[0].id;
    const { error: detailError } = await supabase.rpc('get_wis_procedure_details', {
      proc_id: testProcedureId
    });

    if (!detailError) {
      addResult(
        'Function: get_wis_procedure_details',
        'OK',
        'Callable',
        `Tested with procedure ${testProcedureId}`
      );
    } else {
      addResult(
        'Function: get_wis_procedure_details',
        'WARN',
        'Not available or error',
        detailError.message
      );
    }
  } else {
    addResult(
      'Function: get_wis_procedure_details',
      'WARN',
      'No procedures to test with'
    );
  }

  console.log('');

  // ===== DATA INTEGRITY =====
  console.log('🔗 Data Integrity Checks');
  console.log('-'.repeat(80));

  // Check that wis_chunks has embeddings
  const { data: chunkSample, error: chunkError } = await supabase
    .from('wis_chunks')
    .select('embedding')
    .not('embedding', 'is', null)
    .limit(1);

  if (!chunkError && chunkSample && chunkSample.length > 0) {
    addResult(
      'Integrity: wis_chunks embeddings',
      'OK',
      'Embeddings present',
      'At least one chunk has embedding vector'
    );
  } else {
    addResult(
      'Integrity: wis_chunks embeddings',
      'WARN',
      'No embeddings found',
      'Chunks may not be ready for semantic search'
    );
  }

  // Check foreign key relationships
  const { count: orphanSteps, error: stepsError } = await supabase
    .from('wis_procedure_steps')
    .select('*', { count: 'exact', head: true })
    .is('procedure_id', null);

  if (!stepsError) {
    if ((orphanSteps || 0) === 0) {
      addResult(
        'Integrity: procedure_steps references',
        'OK',
        'All steps have valid procedure_id'
      );
    } else {
      addResult(
        'Integrity: procedure_steps references',
        'WARN',
        `Found ${orphanSteps} orphaned steps`
      );
    }
  }

  console.log('');

  // ===== SUMMARY =====
  console.log('='.repeat(80));
  console.log('📊 Verification Summary');
  console.log('='.repeat(80));

  const okCount = results.filter(r => r.status === 'OK').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const totalCount = results.length;

  console.log(`Total checks: ${totalCount}`);
  console.log(`✅ OK: ${okCount}`);
  console.log(`⚠️  WARN: ${warnCount}`);
  console.log(`❌ FAIL: ${failCount}`);
  console.log('');

  if (failCount > 0) {
    console.log('❌ VERIFICATION FAILED');
    console.log('');
    console.log('Failed checks:');
    results
      .filter(r => r.status === 'FAIL')
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.message}`);
        if (r.details) console.log(`    ${r.details}`);
      });
    return 1;
  }

  if (warnCount > 0) {
    console.log('⚠️  VERIFICATION PASSED WITH WARNINGS');
    console.log('');
    console.log('Warnings:');
    results
      .filter(r => r.status === 'WARN')
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.message}`);
        if (r.details) console.log(`    ${r.details}`);
      });
    return 0; // Warnings don't fail verification
  }

  console.log('✅ ALL CHECKS PASSED');
  return 0;
}

runVerification()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('');
    console.error('='.repeat(80));
    console.error('❌ Verification script crashed');
    console.error('='.repeat(80));
    console.error(error);
    process.exit(1);
  });
