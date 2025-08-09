#!/usr/bin/env node

/**
 * Database Tables and RLS Policy Test Script
 * Tests access to all database tables and identifies RLS issues
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log('🗄️  Database Tables & RLS Policy Test');
console.log('====================================\n');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Core tables that the app depends on
const CORE_TABLES = [
  'profiles',
  'posts',
  'articles', 
  'comments',
  'user_preferences',
  'vehicle_maintenance_logs',
  'fuel_logs',
  'subscriptions',
  'feedback',
  'messages'
];

// Additional tables that might exist
const ADDITIONAL_TABLES = [
  'wis_servers',
  'wis_content',
  'wis_sessions',
  'tracks',
  'track_comments',
  'groups',
  'group_members',
  'notifications',
  'audit_logs'
];

async function testTableAccess(tableName, isCore = false) {
  console.log(`🔍 Testing: ${tableName}`);
  console.log(''.padEnd(30, '-'));
  
  const results = {
    exists: false,
    readable: false,
    writable: false,
    errors: []
  };
  
  try {
    // Test 1: Check if table exists and is readable
    console.log('1. Testing read access...');
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`   ❌ Read failed: ${error.message}`);
      results.errors.push({ operation: 'read', error: error.message, code: error.code });
      
      // Analyze error type
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('   💡 Table does not exist in database');
      } else if (error.message.includes('policy') || error.code === 'PGRST116') {
        console.log('   💡 RLS policy blocking anonymous read access');
        results.exists = true; // Table exists but access is blocked
      } else if (error.message.includes('permission denied')) {
        console.log('   💡 Permission denied - check database permissions');
        results.exists = true;
      } else {
        console.log('   💡 Unknown error - may be configuration issue');
      }
    } else {
      console.log(`   ✅ Read successful: ${count || 0} rows`);
      results.exists = true;
      results.readable = true;
    }
    
    // Test 2: Test write access (only if table exists and is readable, or if we suspect it exists)
    if (results.readable || results.exists) {
      console.log('2. Testing write access...');
      
      // Create a minimal test record based on table name
      let testData = {};
      
      switch (tableName) {
        case 'profiles':
          testData = { 
            id: '00000000-0000-0000-0000-000000000000', // UUID that won't conflict
            username: `test-user-${Date.now()}` 
          };
          break;
        case 'posts':
          testData = { 
            title: `Test Post ${Date.now()}`,
            content: 'Test content',
            author_id: '00000000-0000-0000-0000-000000000000'
          };
          break;
        case 'articles':
          testData = { 
            title: `Test Article ${Date.now()}`,
            content: 'Test content',
            author_id: '00000000-0000-0000-0000-000000000000'
          };
          break;
        case 'comments':
          testData = { 
            content: 'Test comment',
            author_id: '00000000-0000-0000-0000-000000000000'
          };
          break;
        default:
          testData = { test_field: `test_value_${Date.now()}` };
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from(tableName)
        .insert([testData])
        .select();
      
      if (insertError) {
        console.log(`   ❌ Write failed: ${insertError.message}`);
        results.errors.push({ operation: 'write', error: insertError.message, code: insertError.code });
        
        if (insertError.message.includes('policy')) {
          console.log('   💡 RLS policy blocking anonymous write access');
        } else if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
          console.log('   💡 Table structure different than expected');
        } else if (insertError.message.includes('violates')) {
          console.log('   💡 Constraint violation (normal for test data)');
        }
      } else {
        console.log('   ✅ Write successful');
        results.writable = true;
        
        // Clean up test data if possible
        if (insertData && insertData.length > 0 && insertData[0].id) {
          try {
            await supabase.from(tableName).delete().eq('id', insertData[0].id);
            console.log('   🧹 Test data cleaned up');
          } catch (cleanupError) {
            console.log('   ⚠️  Could not clean up test data');
          }
        }
      }
    } else {
      console.log('2. Skipping write test (table not accessible)');
    }
    
    // Test 3: Check table schema if accessible
    if (results.readable) {
      console.log('3. Checking table schema...');
      try {
        const { data: schemaData } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);
        
        console.log('   ✅ Schema accessible');
      } catch (schemaError) {
        console.log(`   ⚠️  Could not access schema: ${schemaError.message}`);
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Unexpected error: ${error.message}`);
    results.errors.push({ operation: 'general', error: error.message });
  }
  
  // Summary for this table
  const status = results.readable ? '✅ ACCESSIBLE' : 
                 results.exists ? '⚠️  EXISTS BUT BLOCKED' : 
                 '❌ NOT ACCESSIBLE';
  
  console.log(`   Status: ${status}`);
  
  if (isCore && !results.readable) {
    console.log('   🚨 CRITICAL: This is a core table required for app functionality!');
  }
  
  console.log('');
  return results;
}

async function analyzeRLSPolicies() {
  console.log('🔐 RLS Policy Analysis');
  console.log('----------------------');
  
  // Common RLS policy checks
  const rlsChecks = [
    {
      description: 'Anonymous read access to public content',
      test: async () => {
        const publicTables = ['profiles', 'posts', 'articles'];
        const results = [];
        
        for (const table of publicTables) {
          try {
            const { data, error } = await supabase
              .from(table)
              .select('*')
              .limit(1);
            
            results.push({
              table,
              accessible: !error,
              error: error?.message
            });
          } catch (err) {
            results.push({
              table,
              accessible: false,
              error: err.message
            });
          }
        }
        
        return results;
      }
    }
  ];
  
  for (const check of rlsChecks) {
    console.log(`\nTesting: ${check.description}`);
    try {
      const results = await check.test();
      results.forEach(result => {
        if (result.accessible) {
          console.log(`  ✅ ${result.table}: accessible`);
        } else {
          console.log(`  ❌ ${result.table}: ${result.error}`);
        }
      });
    } catch (error) {
      console.log(`  ❌ Test failed: ${error.message}`);
    }
  }
}

async function suggestRLSFixes(tableResults) {
  console.log('\n🛠️  RLS Policy Recommendations');
  console.log('------------------------------');
  
  const blockedTables = Object.entries(tableResults).filter(([, result]) => 
    result.exists && !result.readable
  );
  
  if (blockedTables.length === 0) {
    console.log('✅ No RLS policy issues detected');
    return;
  }
  
  console.log('The following tables exist but are blocked by RLS policies:\n');
  
  blockedTables.forEach(([tableName, result]) => {
    console.log(`📋 ${tableName}:`);
    
    // Suggest common fixes based on table type
    if (['profiles', 'posts', 'articles'].includes(tableName)) {
      console.log('   Suggested policy for public read access:');
      console.log(`   CREATE POLICY "Allow anonymous read" ON ${tableName}`);
      console.log('   FOR SELECT USING (true);');
    } else if (['comments', 'feedback'].includes(tableName)) {
      console.log('   Suggested policy for public read access:');
      console.log(`   CREATE POLICY "Allow anonymous read" ON ${tableName}`);
      console.log('   FOR SELECT USING (true);');
      console.log('   ');
      console.log('   For authenticated user operations:');
      console.log(`   CREATE POLICY "Allow authenticated users" ON ${tableName}`);
      console.log('   FOR ALL USING (auth.uid() IS NOT NULL);');
    } else if (['user_preferences', 'subscriptions'].includes(tableName)) {
      console.log('   Suggested policy for user-specific access:');
      console.log(`   CREATE POLICY "Users can manage own data" ON ${tableName}`);
      console.log('   FOR ALL USING (auth.uid() = user_id);');
    } else {
      console.log('   General suggested policy:');
      console.log(`   CREATE POLICY "Allow authenticated access" ON ${tableName}`);
      console.log('   FOR ALL USING (auth.uid() IS NOT NULL);');
    }
    
    console.log('');
  });
  
  console.log('💡 To apply these policies:');
  console.log('1. Go to Supabase Dashboard > Authentication > Policies');
  console.log('2. Select the table and create the suggested policies');
  console.log('3. Or run the SQL commands in the SQL Editor');
}

async function runDatabaseTests() {
  console.log('Starting comprehensive database tests...\n');
  
  const allTables = [...CORE_TABLES, ...ADDITIONAL_TABLES];
  const results = {};
  
  // Test core tables first
  console.log('🎯 Testing Core Application Tables');
  console.log('=================================');
  for (const table of CORE_TABLES) {
    results[table] = await testTableAccess(table, true);
  }
  
  // Test additional tables
  console.log('\n🔍 Testing Additional Tables');
  console.log('============================');
  for (const table of ADDITIONAL_TABLES) {
    results[table] = await testTableAccess(table, false);
  }
  
  // Analyze RLS policies
  await analyzeRLSPolicies();
  
  // Provide RLS fix suggestions
  await suggestRLSFixes(results);
  
  // Generate summary report
  console.log('\n📊 Database Test Summary');
  console.log('========================');
  
  const accessible = Object.entries(results).filter(([, r]) => r.readable).length;
  const blocked = Object.entries(results).filter(([, r]) => r.exists && !r.readable).length;
  const missing = Object.entries(results).filter(([, r]) => !r.exists).length;
  const coreIssues = CORE_TABLES.filter(table => !results[table]?.readable).length;
  
  console.log(`✅ Accessible tables: ${accessible}`);
  console.log(`⚠️  Blocked tables: ${blocked}`);
  console.log(`❌ Missing tables: ${missing}`);
  console.log(`🚨 Core table issues: ${coreIssues}`);
  
  if (coreIssues > 0) {
    console.log('\n🚨 CRITICAL ISSUES FOUND:');
    console.log('Core application tables are not accessible!');
    console.log('This explains why the website cannot save data.');
    console.log('Please fix the RLS policies shown above.');
  }
  
  return results;
}

// Run the tests
runDatabaseTests();