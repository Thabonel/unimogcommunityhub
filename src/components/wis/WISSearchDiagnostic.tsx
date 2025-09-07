import React, { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function WISSearchDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const results: any = {};

    try {
      // Test 1: Check if wis_search function exists
      console.log('Testing wis_search function...');
      try {
        const { data: searchResult, error: searchError } = await supabase.rpc('wis_search', {
          q: 'generator',
          limit_rows: 5
        });
        results.searchFunction = {
          exists: !searchError,
          error: searchError?.message,
          data: searchResult,
          dataCount: searchResult?.length || 0
        };
      } catch (error) {
        results.searchFunction = {
          exists: false,
          error: (error as Error).message
        };
      }

      // Test 2: Check WIS tables directly
      const tables = ['wis_chunks', 'wis_procedures', 'wis_parts', 'wis_bulletins'];
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(5);
          
          results[table] = {
            exists: !error,
            error: error?.message,
            rowCount: data?.length || 0,
            sampleData: data
          };
        } catch (error) {
          results[table] = {
            exists: false,
            error: (error as Error).message
          };
        }
      }

      // Test 3: Try direct text search on each table
      for (const table of tables) {
        try {
          let query = supabase.from(table).select('*').limit(1);
          
          // Add appropriate text search based on table
          if (table === 'wis_procedures') {
            query = query.or('title.ilike.%generator%,content.ilike.%generator%');
          } else if (table === 'wis_parts') {
            query = query.or('part_number.ilike.%generator%,description.ilike.%generator%');
          } else if (table === 'wis_bulletins') {
            query = query.or('title.ilike.%generator%,content.ilike.%generator%');
          } else if (table === 'wis_chunks') {
            query = query.or('title.ilike.%generator%,content.ilike.%generator%');
          }

          const { data, error } = await query;
          
          results[`${table}_search`] = {
            found: data && data.length > 0,
            error: error?.message,
            data: data
          };
        } catch (error) {
          results[`${table}_search`] = {
            found: false,
            error: (error as Error).message
          };
        }
      }

      setDiagnostics(results);
    } catch (error) {
      console.error('Diagnostic error:', error);
      results.generalError = (error as Error).message;
      setDiagnostics(results);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WIS Search Diagnostics</CardTitle>
        <Button onClick={runDiagnostics} disabled={loading}>
          {loading ? 'Running Tests...' : 'Run Diagnostics'}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(diagnostics, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}