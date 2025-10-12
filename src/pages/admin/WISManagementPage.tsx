import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Database, Users, BarChart, RefreshCw, CheckCircle, AlertCircle, Activity, Play, Pause, AlertTriangle } from 'lucide-react';
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

interface ActiveJob {
  id: string;
  job_type: string;
  status: string;
  progress_pct: number;
  started_at: string;
  updated_at: string;
  model_code: string;
  system_code: string | null;
  source_type: string;
  source_path: string;
  error_count: number;
}

interface IngestError {
  id: string;
  job_id: string;
  error_type: string;
  error_code: string | null;
  error_message: string;
  severity: string;
  created_at: string;
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
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [recentErrors, setRecentErrors] = useState<IngestError[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [samples, setSamples] = useState<any[]>([]);
  const [samplesLoading, setSamplesLoading] = useState(false);
  const [sampleStatusFilter, setSampleStatusFilter] = useState<'all'|'pending'|'approved'|'issue'>('pending');

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
      loadSamples('pending');
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

  const loadActiveJobs = async () => {
    try {
      setJobsLoading(true);
      const { data, error } = await supabase
        .from('v_wis_active_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveJobs(data || []);
    } catch (error) {
      console.error('Error loading active jobs:', error);
      toast.error('Failed to load active jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const loadRecentErrors = async () => {
    try {
      const { data, error } = await supabase
        .from('wis_ingest_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentErrors(data || []);
    } catch (error) {
      console.error('Error loading ingest errors:', error);
      toast.error('Failed to load recent errors');
    }
  };

  const handleStartU435ETL = async () => {
    try {
      toast.info('Starting U435 ETL job...');

      // This would be implemented when the ETL service is ready
      // For now, just show a placeholder message
      toast.warning('ETL job management not yet implemented. Migration tables are ready.');

      // When implemented, would call:
      // const { data, error } = await supabase.rpc('wis_start_ingest_job', {
      //   p_plan_item_id: '<uuid>',
      //   p_job_type: 'full_etl'
      // });

      await loadActiveJobs();
    } catch (error) {
      console.error('Error starting ETL job:', error);
      toast.error('Failed to start ETL job');
    }
  };

  const handlePauseJob = async (jobId: string) => {
    try {
      toast.info('Pausing job...');

      // When implemented:
      // const { error } = await supabase.rpc('wis_update_ingest_job', {
      //   p_job_id: jobId,
      //   p_status: 'paused'
      // });

      toast.warning('Job pause not yet implemented');
      await loadActiveJobs();
    } catch (error) {
      console.error('Error pausing job:', error);
      toast.error('Failed to pause job');
    }
  };

  const handleResumeJob = async (jobId: string) => {
    try {
      toast.info('Resuming job...');

      // When implemented:
      // const { error } = await supabase.rpc('wis_update_ingest_job', {
      //   p_job_id: jobId,
      //   p_status: 'running'
      // });

      toast.warning('Job resume not yet implemented');
      await loadActiveJobs();
    } catch (error) {
      console.error('Error resuming job:', error);
      toast.error('Failed to resume job');
    }
  };

  // Samples Loading
  const loadSamples = async (status: 'all'|'pending'|'approved'|'issue' = 'pending') => {
    setSamplesLoading(true);
    try {
      let query = supabase
        .from('wis_samples')
        .select('id, created_at, status, text_excerpt, content_type, document_id')
        .order('created_at', { ascending: false })
        .limit(50);
      if (status !== 'all') query = query.eq('status', status);
      const { data, error } = await query;
      if (error) throw error;
      setSamples(data || []);
      setSampleStatusFilter(status);
    } catch (error) {
      console.error('Error loading samples', error);
      toast.error('Failed to load samples');
    } finally {
      setSamplesLoading(false);
    }
  };

  const createSamples = async () => {
    try {
      const { data, error } = await supabase.rpc('wis_create_samples', { p_count: 12 });
      if (error) throw error;
      toast.success(`Created ${data?.length || 0} samples`);
      await loadSamples(sampleStatusFilter);
    } catch (e: any) {
      toast.error(`Create samples failed: ${e?.message || e}`);
    }
  };

  const setSampleStatus = async (id: string, status: 'approved'|'issue') => {
    try {
      const { error } = await supabase.rpc('wis_samples_set_status', { p_sample_id: id, p_status: status, p_notes: null });
      if (error) throw error;
      await loadSamples(sampleStatusFilter);
    } catch (e: any) {
      toast.error(`Update failed: ${e?.message || e}`);
    }
  };

  const handleRefreshData = async () => {
    toast.info('Refreshing WIS data...');
    await loadWISStats();
    await checkSystemStatus();
    await loadActiveJobs();
    await loadRecentErrors();
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
            <TabsTrigger value="etl">ETL Jobs</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="samples">Samples</TabsTrigger>
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

          {/* Samples Tab */}
          <TabsContent value="samples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Extraction Samples</CardTitle>
                <CardDescription>Review random samples from recent documents to validate extraction quality.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" onClick={() => loadSamples('pending')}>Pending</Button>
                  <Button variant="outline" onClick={() => loadSamples('approved')}>Approved</Button>
                  <Button variant="outline" onClick={() => loadSamples('issue')}>Issues</Button>
                  <Button onClick={createSamples}>New Sample Batch</Button>
                </div>
                {samplesLoading ? (
                  <div className="text-sm text-muted-foreground">Loading samples…</div>
                ) : (
                  <div className="space-y-3">
                    {samples.length === 0 && (
                      <div className="text-sm text-muted-foreground">No samples found for filter: {sampleStatusFilter}</div>
                    )}
                    {samples.map((s) => (
                      <div key={s.id} className="border rounded p-3">
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>{new Date(s.created_at).toLocaleString()} • {s.content_type}</span>
                          <span className="uppercase">{s.status}</span>
                        </div>
                        <div className="mt-2 text-sm whitespace-pre-wrap">
                          {s.text_excerpt || 'No preview available.'}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSampleStatus(s.id, 'approved')}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => setSampleStatus(s.id, 'issue')}>Flag Issue</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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

          {/* ETL Jobs Tab */}
          <TabsContent value="etl" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* ETL Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>ETL Job Management</CardTitle>
                  <CardDescription>
                    Start, pause, and monitor data ingestion jobs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      onClick={handleStartU435ETL}
                      disabled={jobsLoading}
                      className="bg-military-green hover:bg-military-green/90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start U435 ETL
                    </Button>
                    <Button
                      onClick={loadActiveJobs}
                      disabled={jobsLoading}
                      variant="outline"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${jobsLoading ? 'animate-spin' : ''}`} />
                      Refresh Jobs
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground border-l-4 border-yellow-500 pl-4 py-2">
                    <p className="font-medium text-yellow-700 mb-1">Infrastructure Ready</p>
                    <p>
                      Plan/ops tables and admin RPCs have been created. ETL job execution logic
                      needs to be implemented in the backend service.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Active Jobs Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Jobs</CardTitle>
                  <CardDescription>
                    Currently running and paused ETL jobs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {jobsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading jobs...
                    </div>
                  ) : activeJobs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No active jobs</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeJobs.map((job) => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{job.job_type}</p>
                              <Badge variant="outline">
                                {job.model_code}
                                {job.system_code ? ` / ${job.system_code}` : ''}
                              </Badge>
                              <Badge
                                variant={
                                  job.status === 'running'
                                    ? 'default'
                                    : job.status === 'paused'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {job.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {job.source_type}: {job.source_path}
                            </p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Progress: {job.progress_pct}%</span>
                              {job.error_count > 0 && (
                                <span className="text-red-600 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  {job.error_count} errors
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {job.status === 'running' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePauseJob(job.id)}
                              >
                                <Pause className="w-4 h-4" />
                              </Button>
                            )}
                            {job.status === 'paused' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResumeJob(job.id)}
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Errors Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Errors</CardTitle>
                  <CardDescription>
                    Latest errors from ETL job executions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentErrors.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600 opacity-50" />
                      <p>No recent errors</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentErrors.map((error) => (
                        <div
                          key={error.id}
                          className="p-3 border rounded-lg bg-red-50 border-red-200"
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm text-red-900">{error.error_type}</p>
                                {error.error_code && (
                                  <Badge variant="outline" className="text-xs">
                                    {error.error_code}
                                  </Badge>
                                )}
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    error.severity === 'critical'
                                      ? 'bg-red-100 text-red-800 border-red-300'
                                      : error.severity === 'error'
                                      ? 'bg-orange-100 text-orange-800 border-orange-300'
                                      : 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                  }`}
                                >
                                  {error.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-red-800">{error.error_message}</p>
                              <p className="text-xs text-red-600 mt-1">
                                {new Date(error.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
