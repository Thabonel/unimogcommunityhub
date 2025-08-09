#!/usr/bin/env node

/**
 * Comprehensive Supabase Connection Test Script
 * Tests all aspects of Supabase connectivity including auth, database, and storage
 * Specifically designed to diagnose the reported issues with table access and storage
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';

console.log('🚀 Starting Comprehensive Supabase Tests');
console.log('========================================\n');

// Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjAxNjEsImV4cCI6MjA1ODc5NjE2MX0.kbjmP9__CU21gJfZwyKbw0GVfjX_PL7jmVTZsY-W8uY';

console.log('🔧 Configuration:');
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseAnonKey?.substring(0, 50)}...`);
console.log(`Key Length: ${supabaseAnonKey?.length || 0}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials!');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Test results tracker
const results = {
  connection: { passed: false, error: null },
  auth: { passed: false, error: null },
  database: { passed: false, error: null, details: [] },
  storage: { passed: false, error: null, details: [] },
  cors: { passed: false, error: null },
  rls: { passed: false, error: null, details: [] }
};

async function testBasicConnection() {
  console.log('🔍 Test 1: Basic Connection');
  console.log('---------------------------');
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error && !error.message.includes('No session found')) {
      throw error;
    }
    
    console.log('✅ Supabase client initialized successfully');
    console.log('✅ Auth endpoint accessible');
    results.connection.passed = true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    results.connection.error = error.message;
  }
  console.log('');
}

async function testAuthentication() {
  console.log('🔍 Test 2: Authentication');
  console.log('-------------------------');
  
  try {
    // Test getting current user (should be null for anon)
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error && !error.message.includes('Invalid JWT') && !error.message.includes('JWT expired')) {
      throw error;
    }
    
    console.log('✅ Auth endpoint responding');
    console.log(`Current user: ${user ? user.email || user.id : 'Anonymous (expected)'}`);
    results.auth.passed = true;
    
  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
    results.auth.error = error.message;
  }
  console.log('');
}

async function testDatabaseOperations() {
  console.log('🔍 Test 3: Database Operations');
  console.log('------------------------------');
  
  // List of tables to test
  const tablesToTest = [
    'profiles',
    'posts', 
    'articles',
    'wis_servers',
    'user_preferences',
    'vehicle_maintenance_logs'
  ];
  
  for (const table of tablesToTest) {
    try {
      console.log(`Testing table: ${table}`);
      
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`  ❌ ${table}: ${error.message}`);
        results.database.details.push({
          table,
          error: error.message,
          code: error.code
        });
        
        // Check for specific error types
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`    💡 Table "${table}" doesn't exist in database`);
        }
        if (error.message.includes('policy') || error.code === 'PGRST116') {
          console.log(`    💡 RLS policy blocking access to "${table}"`);
        }
        if (error.message.includes('permission denied')) {
          console.log(`    💡 Permission denied for "${table}" - check RLS policies`);
        }
        
      } else {
        console.log(`  ✅ ${table}: accessible (${count || 0} rows)`);
        results.database.passed = true;
      }
      
    } catch (error) {
      console.log(`  ❌ ${table}: ${error.message}`);
      results.database.details.push({
        table,
        error: error.message
      });
    }
  }
  
  console.log('');
}

async function testStorageOperations() {
  console.log('🔍 Test 4: Storage Operations');
  console.log('-----------------------------');
  
  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Cannot list buckets:', bucketsError.message);
      results.storage.error = bucketsError.message;
      return;
    }
    
    console.log('✅ Storage service accessible');
    console.log(`Available buckets: ${buckets?.length || 0}`);
    
    if (buckets && buckets.length > 0) {
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
      });
    }
    
    // Test specific buckets that should exist
    const expectedBuckets = [
      'avatars',
      'Profile Photos',
      'vehicle_photos', 
      'site_assets',
      'manuals',
      'article_files'
    ];
    
    console.log('\nTesting expected buckets:');
    for (const bucketName of expectedBuckets) {
      const bucket = buckets?.find(b => b.name === bucketName);
      if (bucket) {
        console.log(`  ✅ ${bucketName}: exists`);
        
        // Test bucket access
        try {
          const { data: files, error: listError } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 1 });
          
          if (listError) {
            console.log(`    ⚠️  Cannot list files: ${listError.message}`);
            results.storage.details.push({
              bucket: bucketName,
              operation: 'list',
              error: listError.message
            });
          } else {
            console.log(`    ✅ Can list files (${files?.length || 0} found)`);
            results.storage.passed = true;
          }
          
        } catch (error) {
          console.log(`    ❌ List error: ${error.message}`);
          results.storage.details.push({
            bucket: bucketName,
            operation: 'list',
            error: error.message
          });
        }
        
      } else {
        console.log(`  ❌ ${bucketName}: missing`);
        results.storage.details.push({
          bucket: bucketName,
          operation: 'exists',
          error: 'Bucket does not exist'
        });
      }
    }
    
    // Test upload capability (create small test file)
    if (buckets?.some(b => b.name === 'site_assets')) {
      console.log('\nTesting upload capability:');
      try {
        const testContent = 'test-file-content-' + Date.now();
        const testFileName = `test-${Date.now()}.txt`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('site_assets')
          .upload(testFileName, new Blob([testContent], { type: 'text/plain' }), {
            upsert: true
          });
        
        if (uploadError) {
          console.log(`  ❌ Upload test failed: ${uploadError.message}`);
          results.storage.details.push({
            bucket: 'site_assets',
            operation: 'upload',
            error: uploadError.message
          });
        } else {
          console.log(`  ✅ Upload test successful: ${uploadData.path}`);
          
          // Clean up test file
          try {
            await supabase.storage.from('site_assets').remove([testFileName]);
            console.log(`  🧹 Test file cleaned up`);
          } catch (cleanupError) {
            console.log(`  ⚠️  Could not clean up test file: ${cleanupError.message}`);
          }
        }
        
      } catch (error) {
        console.log(`  ❌ Upload test error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Storage test failed:', error.message);
    results.storage.error = error.message;
  }
  
  console.log('');
}

async function testNetworkAndCors() {
  console.log('🔍 Test 5: Network & CORS');
  console.log('-------------------------');
  
  try {
    // Test direct REST API call
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      console.log('✅ Direct REST API accessible');
      console.log(`  Status: ${response.status} ${response.statusText}`);
      results.cors.passed = true;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Test auth endpoint
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      }
    });
    
    console.log(`✅ Auth API accessible (${authResponse.status})`);
    
  } catch (error) {
    console.error('❌ Network/CORS test failed:', error.message);
    results.cors.error = error.message;
    
    if (error.message.includes('CORS')) {
      console.log('  💡 CORS configuration issue detected');
    }
    if (error.message.includes('Failed to fetch')) {
      console.log('  💡 Network connectivity or blocked request');
    }
  }
  
  console.log('');
}

async function testRLSPolicies() {
  console.log('🔍 Test 6: Row Level Security (RLS) Policies');
  console.log('--------------------------------------------');
  
  // Test anonymous access patterns that should work
  const rlsTests = [
    {
      table: 'profiles',
      operation: 'select',
      description: 'Public profile read access'
    },
    {
      table: 'posts', 
      operation: 'select',
      description: 'Public posts read access'
    },
    {
      table: 'articles',
      operation: 'select', 
      description: 'Public articles read access'
    }
  ];
  
  for (const test of rlsTests) {
    try {
      const { data, error } = await supabase
        .from(test.table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`  ❌ ${test.table} ${test.operation}: ${error.message}`);
        
        if (error.code === 'PGRST116' || error.message.includes('policy')) {
          console.log(`    💡 RLS policy blocking anonymous access to ${test.table}`);
          results.rls.details.push({
            table: test.table,
            issue: 'RLS policy blocking access',
            suggestion: `Need to create/fix RLS policy for anonymous read access to ${test.table}`
          });
        }
        
      } else {
        console.log(`  ✅ ${test.table} ${test.operation}: accessible`);
        results.rls.passed = true;
      }
      
    } catch (error) {
      console.log(`  ❌ ${test.table}: ${error.message}`);
    }
  }
  
  console.log('');
}

async function generateDiagnosticsReport() {
  console.log('📊 Diagnostics Report');
  console.log('====================');
  
  const tests = [
    { name: 'Connection', result: results.connection },
    { name: 'Authentication', result: results.auth },
    { name: 'Database', result: results.database },
    { name: 'Storage', result: results.storage },
    { name: 'Network/CORS', result: results.cors },
    { name: 'RLS Policies', result: results.rls }
  ];
  
  tests.forEach(test => {
    const status = test.result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.name}`);
    if (test.result.error) {
      console.log(`    Error: ${test.result.error}`);
    }
  });
  
  console.log('');
  
  // Detailed issues
  const hasIssues = tests.some(t => !t.result.passed);
  
  if (hasIssues) {
    console.log('🚨 Issues Found & Solutions');
    console.log('--------------------------');
    
    if (!results.connection.passed) {
      console.log('🔧 Connection Issues:');
      console.log('  - Verify internet connectivity');
      console.log('  - Check Supabase project status (not paused)');
      console.log('  - Verify VITE_SUPABASE_URL is correct');
      console.log('');
    }
    
    if (!results.auth.passed) {
      console.log('🔧 Authentication Issues:');
      console.log('  - Verify VITE_SUPABASE_ANON_KEY is correct and not expired');
      console.log('  - Check API key permissions in Supabase dashboard');
      console.log('');
    }
    
    if (!results.database.passed) {
      console.log('🔧 Database Issues:');
      console.log('  - Check Row Level Security (RLS) policies');
      console.log('  - Verify tables exist and are accessible');
      console.log('  - Enable anonymous access where needed');
      
      if (results.database.details.length > 0) {
        console.log('  Specific table issues:');
        results.database.details.forEach(detail => {
          console.log(`    - ${detail.table}: ${detail.error}`);
        });
      }
      console.log('');
    }
    
    if (!results.storage.passed) {
      console.log('🔧 Storage Issues:');
      console.log('  - Create missing storage buckets');
      console.log('  - Check bucket policies and permissions');
      console.log('  - Verify storage is enabled in Supabase project');
      
      if (results.storage.details.length > 0) {
        console.log('  Specific bucket issues:');
        results.storage.details.forEach(detail => {
          console.log(`    - ${detail.bucket} (${detail.operation}): ${detail.error}`);
        });
      }
      console.log('');
    }
    
    if (!results.cors.passed) {
      console.log('🔧 CORS Issues:');
      console.log('  - Check CORS settings in Supabase dashboard');
      console.log('  - Add your domain to allowed origins');
      console.log('  - Verify API endpoints are accessible');
      console.log('');
    }
    
    if (!results.rls.passed && results.rls.details.length > 0) {
      console.log('🔧 RLS Policy Issues:');
      results.rls.details.forEach(detail => {
        console.log(`  - ${detail.table}: ${detail.issue}`);
        console.log(`    Solution: ${detail.suggestion}`);
      });
      console.log('');
    }
    
  } else {
    console.log('🎉 All tests passed! Supabase is working correctly.');
  }
  
  // Summary
  const passedCount = tests.filter(t => t.result.passed).length;
  console.log(`\n📈 Summary: ${passedCount}/${tests.length} tests passed`);
  
  return results;
}

// Main test runner
async function runAllTests() {
  try {
    await testBasicConnection();
    await testAuthentication();
    await testDatabaseOperations();
    await testStorageOperations();
    await testNetworkAndCors();
    await testRLSPolicies();
    await generateDiagnosticsReport();
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

// Run tests
runAllTests();