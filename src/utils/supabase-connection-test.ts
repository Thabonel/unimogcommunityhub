import { supabase } from '@/lib/supabase-client';

export interface ConnectionTestResult {
  test: string;
  success: boolean;
  message: string;
  details?: any;
}

export const testSupabaseConnection = async (): Promise<ConnectionTestResult[]> => {
  const results: ConnectionTestResult[] = [];

  // Test 1: Basic connection and profiles table
  try {
    console.log('🔍 Testing profiles table access...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      results.push({
        test: 'Profiles Table Access',
        success: false,
        message: error.message,
        details: { code: error.code, hint: error.hint }
      });
    } else {
      results.push({
        test: 'Profiles Table Access',
        success: true,
        message: 'Successfully accessed profiles table',
        details: { count: data }
      });
    }
  } catch (error: any) {
    results.push({
      test: 'Profiles Table Access',
      success: false,
      message: `Connection error: ${error.message}`
    });
  }

  // Test 2: Auth session check
  try {
    console.log('🔍 Testing auth session...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      results.push({
        test: 'Auth Session',
        success: false,
        message: authError.message
      });
    } else {
      results.push({
        test: 'Auth Session',
        success: true,
        message: authData.session ? 'Active session found' : 'No active session (normal)',
        details: { hasSession: !!authData.session }
      });
    }
  } catch (error: any) {
    results.push({
      test: 'Auth Session',
      success: false,
      message: `Auth error: ${error.message}`
    });
  }

  // Test 3: Storage buckets access
  try {
    console.log('🔍 Testing storage access...');
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) {
      results.push({
        test: 'Storage Access',
        success: false,
        message: storageError.message
      });
    } else {
      results.push({
        test: 'Storage Access',
        success: true,
        message: `Found ${buckets?.length || 0} storage buckets`,
        details: { buckets: buckets?.map(b => b.name) || [] }
      });
    }
  } catch (error: any) {
    results.push({
      test: 'Storage Access',
      success: false,
      message: `Storage error: ${error.message}`
    });
  }

  // Test 4: Check user_roles table
  try {
    console.log('🔍 Testing user_roles table access...');
    const { data, error } = await supabase
      .from('user_roles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      results.push({
        test: 'User Roles Table',
        success: false,
        message: error.message,
        details: { code: error.code, hint: error.hint }
      });
    } else {
      results.push({
        test: 'User Roles Table',
        success: true,
        message: 'Successfully accessed user_roles table',
        details: { count: data }
      });
    }
  } catch (error: any) {
    results.push({
      test: 'User Roles Table',
      success: false,
      message: `Connection error: ${error.message}`
    });
  }

  // Test 5: Check available public schema tables
  try {
    console.log('🔍 Testing schema information access...');
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      results.push({
        test: 'Schema Information',
        success: false,
        message: error.message
      });
    } else {
      results.push({
        test: 'Schema Information',
        success: true,
        message: `Found ${data?.length || 0} tables in public schema`,
        details: { tables: data?.map(t => t.table_name) || [] }
      });
    }
  } catch (error: any) {
    results.push({
      test: 'Schema Information',
      success: false,
      message: `Schema query error: ${error.message}`
    });
  }

  return results;
};

export const runSupabaseConnectionTest = async (): Promise<void> => {
  console.log('🚀 Starting Supabase Connection Test...\n');
  
  const results = await testSupabaseConnection();
  
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${icon} ${result.test}`);
    console.log(`   ${result.message}`);
    
    if (result.details) {
      console.log(`   Details:`, result.details);
    }
    console.log('');
  });

  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`📊 Test Summary: ${successCount}/${totalCount} tests passed`);
  
  if (successCount === totalCount) {
    console.log('🎉 All Supabase connection tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the details above.');
  }
};