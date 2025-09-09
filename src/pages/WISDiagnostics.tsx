import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, Database, Settings, HardDrive } from 'lucide-react';
import { checkWISDatabase, testWISSearch } from '@/utils/wis-diagnostics';

export default function WISDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [searchTest, setSearchTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const [dbCheck, searchCheck] = await Promise.all([
        checkWISDatabase(),
        testWISSearch()
      ]);
      
      setDiagnostics(dbCheck);
      setSearchTest(searchCheck);
    } catch (error) {
      console.error('Diagnostics failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusBadge = ({ exists }: { exists: boolean }) => (
    <Badge className={exists ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
      {exists ? (
        <>
          <CheckCircle className="w-3 h-3 mr-1" />
          EXISTS
        </>
      ) : (
        <>
          <AlertCircle className="w-3 h-3 mr-1" />
          MISSING
        </>
      )}
    </Badge>
  );

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Running WIS Database Diagnostics...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WIS Database Diagnostics</h1>
          <p className="text-gray-600">
            This page checks if the Workshop Information System database infrastructure is properly set up.
          </p>
          <Button 
            onClick={runDiagnostics} 
            className="mt-4"
            disabled={loading}
          >
            <Settings className="w-4 h-4 mr-2" />
            Re-run Diagnostics
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Database Tables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Tables
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnostics?.tables ? (
                <div className="space-y-3">
                  {diagnostics.tables.map((table: any) => (
                    <div key={table.name} className="flex justify-between items-center">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {table.name}
                      </code>
                      <StatusBadge exists={table.exists} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No table information available</p>
              )}
            </CardContent>
          </Card>

          {/* RPC Functions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                RPC Functions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnostics?.rpcs ? (
                <div className="space-y-3">
                  {diagnostics.rpcs.map((rpc: any) => (
                    <div key={rpc.name} className="flex justify-between items-center">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {rpc.name}()
                      </code>
                      <StatusBadge exists={rpc.exists} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No RPC information available</p>
              )}
            </CardContent>
          </Card>

          {/* Storage Buckets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Storage Buckets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {diagnostics?.buckets ? (
                <div className="space-y-3">
                  {diagnostics.buckets.map((bucket: any) => (
                    <div key={bucket.name} className="flex justify-between items-center">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {bucket.name}
                      </code>
                      <StatusBadge exists={bucket.exists} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No bucket information available</p>
              )}
            </CardContent>
          </Card>

          {/* Search Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Search Function Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchTest ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">wis_search() call</span>
                    <StatusBadge exists={searchTest.success} />
                  </div>
                  {searchTest.error && (
                    <div className="bg-red-50 p-3 rounded-md">
                      <p className="text-sm text-red-800 font-medium mb-1">Error:</p>
                      <code className="text-xs text-red-700">{searchTest.error}</code>
                    </div>
                  )}
                  {searchTest.data && (
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-green-800 font-medium mb-1">Response:</p>
                      <code className="text-xs text-green-700">
                        {JSON.stringify(searchTest.data, null, 2)}
                      </code>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No search test results</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Overall Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Overall Status</CardTitle>
          </CardHeader>
          <CardContent>
            {diagnostics ? (
              <div className="space-y-2">
                {diagnostics.error ? (
                  <div className="bg-red-50 p-4 rounded-md">
                    <p className="text-red-800 font-medium">Diagnostics Error:</p>
                    <p className="text-red-700 text-sm mt-1">{diagnostics.error}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Tables: {diagnostics.tables?.filter((t: any) => t.exists).length || 0} of {diagnostics.tables?.length || 0} exist
                    </p>
                    <p className="text-sm text-gray-600">
                      RPCs: {diagnostics.rpcs?.filter((r: any) => r.exists).length || 0} of {diagnostics.rpcs?.length || 0} exist
                    </p>
                    <p className="text-sm text-gray-600">
                      Buckets: {diagnostics.buckets?.filter((b: any) => b.exists).length || 0} of {diagnostics.buckets?.length || 0} exist
                    </p>
                    
                    {(!diagnostics.tables?.every((t: any) => t.exists) || 
                      !diagnostics.rpcs?.every((r: any) => r.exists)) && (
                      <div className="mt-4 bg-yellow-50 p-4 rounded-md">
                        <p className="text-yellow-800 font-medium">
                          ⚠️ WIS Database Infrastructure Missing
                        </p>
                        <p className="text-yellow-700 text-sm mt-1">
                          The Workshop Information System requires database tables, RPC functions, and storage buckets to be created in Supabase before it can function.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Run diagnostics to see status</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}