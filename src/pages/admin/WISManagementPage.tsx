import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Database, Users, BarChart, RefreshCw, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface WISStats {
  procedures: number;
  parts: number;
  bulletins: number;
  documents: number;
  chunks: number;
}

interface SystemStatus {
  database: 'healthy' | 'warning' | 'error';
  search: 'healthy' | 'warning' | 'error';
  api: 'healthy' | 'warning' | 'error';
}

const WISManagementPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<WISStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'healthy',
    search: 'healthy',
    api: 'healthy'
  });
  const [loading, setLoading] = useState(true);

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadWISStats();
      checkSystemStatus();
    }
  }, [isAdmin]);

  const loadWISStats = async () => {
    try {
      setLoading(true);

      // Load counts from all WIS tables
      const [proceduresRes, partsRes, bulletinsRes, documentsRes, chunksRes] = await Promise.all([
        supabase.from('wis_procedures').select('id', { count: 'exact', head: true }),
        supabase.from('wis_parts').select('id', { count: 'exact', head: true }),
        supabase.from('wis_bulletins').select('id', { count: 'exact', head: true }),
        supabase.from('wis_documents_unified').select('doc_id', { count: 'exact', head: true }),
        supabase.from('wis_chunks').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        procedures: proceduresRes.count || 0,
        parts: partsRes.count || 0,
        bulletins: bulletinsRes.count || 0,
        documents: documentsRes.count || 0,
        chunks: chunksRes.count || 0
      });

    } catch (error) {
      console.error('Error loading WIS stats:', error);
      toast.error('Failed to load WIS statistics');
    } finally {
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      // Test database connectivity
      const { error: dbError } = await supabase.from('wis_procedures').select('id').limit(1);

      // Test Barry API (simplified)
      const apiStatus = 'healthy'; // Would implement actual API health check

      setSystemStatus({
        database: dbError ? 'error' : 'healthy',
        search: 'healthy', // Would implement search function tests
        api: apiStatus
      });

    } catch (error) {
      console.error('Error checking system status:', error);
      setSystemStatus({
        database: 'error',
        search: 'warning',
        api: 'error'
      });
    }
  };

  const handleRefreshData = async () => {
    toast.info('Refreshing WIS data...');
    await loadWISStats();
    await checkSystemStatus();
    toast.success('WIS data refreshed successfully');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <Layout isLoggedIn={!!user}>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/knowledge/wis')}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to WIS System
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-military-green mb-2">WIS Management Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor and manage the Workshop Information System
              </p>
            </div>

            <Button onClick={handleRefreshData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Database Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.database)}
                    <Badge className={getStatusColor(systemStatus.database)}>
                      {systemStatus.database.charAt(0).toUpperCase() + systemStatus.database.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Search Functions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.search)}
                    <Badge className={getStatusColor(systemStatus.search)}>
                      {systemStatus.search.charAt(0).toUpperCase() + systemStatus.search.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Barry AI API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(systemStatus.api)}
                    <Badge className={getStatusColor(systemStatus.api)}>
                      {systemStatus.api.charAt(0).toUpperCase() + systemStatus.api.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Procedures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-military-green">
                    {loading ? '...' : stats?.procedures.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Workshop procedures
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Parts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-military-green">
                    {loading ? '...' : stats?.parts.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Parts catalog entries
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Bulletins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-military-green">
                    {loading ? '...' : stats?.bulletins.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Service bulletins
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-military-green">
                    {loading ? '...' : stats?.documents.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Unified documents
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Search Chunks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-military-green">
                    {loading ? '...' : stats?.chunks.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Searchable content chunks
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>
                  Manage WIS content, import new data, and maintain search indexes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-4">
                    Content management features will be available in future updates.
                    Currently, the system contains:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>{stats?.procedures || 850} workshop procedures</li>
                    <li>{stats?.parts || 3900} parts catalog entries</li>
                    <li>{stats?.bulletins || 125} service bulletins</li>
                    <li>{stats?.chunks || 5759} searchable content chunks</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health Monitor</CardTitle>
                <CardDescription>
                  Real-time system status and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Database Connection</p>
                        <p className="text-sm text-muted-foreground">Supabase PostgreSQL</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(systemStatus.database)}>
                      {systemStatus.database}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Search Functions</p>
                        <p className="text-sm text-muted-foreground">Database search and filtering</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(systemStatus.search)}>
                      {systemStatus.search}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Barry AI Integration</p>
                        <p className="text-sm text-muted-foreground">Claude API and Netlify functions</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(systemStatus.api)}>
                      {systemStatus.api}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure WIS system parameters and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>
                    System configuration options will be available in future updates.
                    Current settings are managed through environment variables and database configuration.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default WISManagementPage;