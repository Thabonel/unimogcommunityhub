// WIS Database Diagnostics
import { supabase } from '@/lib/supabase-client';

export async function checkWISDatabase(): Promise<{
  tables: { name: string; exists: boolean }[];
  rpcs: { name: string; exists: boolean }[];
  buckets: { name: string; exists: boolean }[];
  error?: string;
}> {
  const requiredTables = ['wis_parts', 'wis_procedures', 'wis_bulletins', 'wis_documents_unified', 'wis_chunks'];
  const requiredRPCs = ['wis_search', 'wis_media_url'];
  const requiredBuckets = ['wis-photos', 'wis-diagrams', 'wis-schematics', 'wis-tables', 'wis-charts'];
  
  const result = {
    tables: [] as { name: string; exists: boolean }[],
    rpcs: [] as { name: string; exists: boolean }[],
    buckets: [] as { name: string; exists: boolean }[],
  };

  try {
    // Check tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      throw new Error(`Tables check failed: ${tablesError.message}`);
    }

    const existingTables = tables?.map(t => t.table_name) || [];
    result.tables = requiredTables.map(name => ({
      name,
      exists: existingTables.includes(name)
    }));

    // Check storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.warn('Buckets check failed:', bucketsError.message);
    }

    const existingBuckets = buckets?.map(b => b.name) || [];
    result.buckets = requiredBuckets.map(name => ({
      name,
      exists: existingBuckets.includes(name)
    }));

    // For RPCs, we'll try to call them and see if they exist
    for (const rpcName of requiredRPCs) {
      try {
        // Try to call with minimal params to test existence
        await supabase.rpc(rpcName, {});
        result.rpcs.push({ name: rpcName, exists: true });
      } catch (error: any) {
        // If it's a parameter error, the function exists
        const exists = error.message && !error.message.includes('function does not exist');
        result.rpcs.push({ name: rpcName, exists });
      }
    }

  } catch (error: any) {
    result.error = error.message;
  }

  return result;
}

export async function testWISSearch(): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const { data, error } = await supabase.rpc('wis_search', {
      q: 'test',
      limit_rows: 1
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}