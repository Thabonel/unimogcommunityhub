import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { SettingsSection } from './SettingsSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Play, Pause, Trash2, RefreshCw, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ScrapeSource {
  id: string;
  url: string;
  domain: string;
  name: string;
  type: 'trip' | 'guide';
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'failed' | 'pending_approval';
  confidence_score: number;
  discovered_by: 'admin' | 'barry';
  last_scraped_at: string | null;
  next_scrape_at: string;
  failure_count: number;
  created_at: string;
}

interface DiscoverySuggestion {
  id: string;
  url: string;
  domain: string;
  suggested_type: 'trip' | 'guide';
  confidence_score: number;
  reasoning: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Stats {
  total_sources: number;
  active_sources: number;
  failed_sources: number;
  total_content: number;
  trips_count: number;
  guides_count: number;
}

export function ScrapingSettingsSection() {
  const [sources, setSources] = useState<ScrapeSource[]>([]);
  const [suggestions, setSuggestions] = useState<DiscoverySuggestion[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingSource, setAddingSource] = useState(false);
  const [newSource, setNewSource] = useState({ url: '', name: '', type: 'trip' as const, frequency: 'weekly' as const });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sourcesRes, suggestionsRes, contentRes] = await Promise.all([
        supabase.from('scrape_sources').select('*').order('created_at', { ascending: false }),
        supabase.from('discovery_suggestions').select('*').eq('status', 'pending').order('confidence_score', { ascending: false }),
        supabase.from('scraped_content').select('content_type'),
      ]);

      if (sourcesRes.data) setSources(sourcesRes.data);
      if (suggestionsRes.data) setSuggestions(suggestionsRes.data);

      if (sourcesRes.data && contentRes.data) {
        setStats({
          total_sources: sourcesRes.data.length,
          active_sources: sourcesRes.data.filter(s => s.status === 'active').length,
          failed_sources: sourcesRes.data.filter(s => s.status === 'failed').length,
          total_content: contentRes.data.length,
          trips_count: contentRes.data.filter(c => c.content_type === 'trip').length,
          guides_count: contentRes.data.filter(c => c.content_type === 'guide').length,
        });
      }
    } catch (error) {
      console.error('Failed to load scraping data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSource = async () => {
    if (!newSource.url || !newSource.name) {
      toast({ title: 'Error', description: 'URL and name are required', variant: 'destructive' });
      return;
    }

    try {
      const domain = new URL(newSource.url).hostname.replace('www.', '');
      const { error } = await supabase.from('scrape_sources').insert({
        url: newSource.url,
        domain,
        name: newSource.name,
        type: newSource.type,
        frequency: newSource.frequency,
        status: 'active',
        discovered_by: 'admin',
        confidence_score: 1.0,
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Source added successfully' });
      setNewSource({ url: '', name: '', type: 'trip', frequency: 'weekly' });
      setAddingSource(false);
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add source', variant: 'destructive' });
    }
  };

  const toggleSourceStatus = async (source: ScrapeSource) => {
    const newStatus = source.status === 'active' ? 'paused' : 'active';
    const { error } = await supabase.from('scrape_sources').update({ status: newStatus }).eq('id', source.id);
    if (!error) loadData();
  };

  const deleteSource = async (id: string) => {
    if (!confirm('Delete this source?')) return;
    const { error } = await supabase.from('scrape_sources').delete().eq('id', id);
    if (!error) loadData();
  };

  const scrapeNow = async (source: ScrapeSource) => {
    toast({ title: 'Scraping', description: `Scraping ${source.name}...` });
    const { error } = await supabase.functions.invoke(source.type === 'trip' ? 'scrape-trips' : 'scrape-guides', {
      body: { source_id: source.id, url: source.url },
    });
    if (error) {
      toast({ title: 'Error', description: 'Scrape failed', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Scrape completed' });
      loadData();
    }
  };

  const approveSuggestion = async (suggestion: DiscoverySuggestion) => {
    const domain = new URL(suggestion.url).hostname.replace('www.', '');
    const { error: sourceError } = await supabase.from('scrape_sources').insert({
      url: suggestion.url,
      domain,
      name: domain,
      type: suggestion.suggested_type,
      frequency: 'weekly',
      status: 'active',
      discovered_by: 'barry',
      confidence_score: suggestion.confidence_score,
    });

    if (!sourceError) {
      await supabase.from('discovery_suggestions').update({ status: 'approved' }).eq('id', suggestion.id);
      toast({ title: 'Approved', description: 'Source added from Barry suggestion' });
      loadData();
    }
  };

  const rejectSuggestion = async (id: string) => {
    await supabase.from('discovery_suggestions').update({ status: 'rejected' }).eq('id', id);
    loadData();
  };

  const triggerDiscovery = async () => {
    toast({ title: 'Discovery', description: 'Asking Barry to find new sources...' });
    const { error } = await supabase.functions.invoke('barry-discover-sources', { body: { type: 'both' } });
    if (error) {
      toast({ title: 'Error', description: 'Discovery failed', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Discovery complete' });
      loadData();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500">Active</Badge>;
      case 'paused': return <Badge variant="secondary">Paused</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      case 'pending_approval': return <Badge className="bg-yellow-500">Pending</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <SettingsSection title="Content Scraping" description="Manage web scraping sources for trips and repair guides" icon={Globe}>
      <div className="space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.total_sources}</div>
              <div className="text-xs text-muted-foreground">Sources</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active_sources}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed_sources}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.total_content}</div>
              <div className="text-xs text-muted-foreground">Content</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.trips_count}</div>
              <div className="text-xs text-muted-foreground">Trips</div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.guides_count}</div>
              <div className="text-xs text-muted-foreground">Guides</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setAddingSource(true)} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Source</Button>
          <Button onClick={triggerDiscovery} variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-1" /> Ask Barry to Find More</Button>
        </div>

        {/* Add Source Form */}
        {addingSource && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="URL" value={newSource.url} onChange={e => setNewSource({ ...newSource, url: e.target.value })} />
              <Input placeholder="Name" value={newSource.name} onChange={e => setNewSource({ ...newSource, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select value={newSource.type} onValueChange={v => setNewSource({ ...newSource, type: v as 'trip' | 'guide' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="trip">Trip</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newSource.frequency} onValueChange={v => setNewSource({ ...newSource, frequency: v as 'daily' | 'weekly' | 'monthly' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={addSource} size="sm">Add</Button>
              <Button onClick={() => setAddingSource(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        )}

        {/* Discovery Suggestions */}
        {suggestions.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-3">Barry's Suggestions ({suggestions.length})</h3>
            <div className="space-y-2">
              {suggestions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div>
                    <div className="font-medium">{s.domain}</div>
                    <div className="text-sm text-muted-foreground">{s.reasoning?.slice(0, 100)}</div>
                    <div className="text-xs">Confidence: {(s.confidence_score * 100).toFixed(0)}% | Type: {s.suggested_type}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => approveSuggestion(s)}><CheckCircle className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => rejectSuggestion(s.id)}><XCircle className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Scraped</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map(source => (
              <TableRow key={source.id}>
                <TableCell>
                  <div className="font-medium">{source.name}</div>
                  <div className="text-xs text-muted-foreground">{source.domain}</div>
                </TableCell>
                <TableCell><Badge variant="outline">{source.type}</Badge></TableCell>
                <TableCell>{source.frequency}</TableCell>
                <TableCell>{getStatusBadge(source.status)}</TableCell>
                <TableCell>
                  {source.last_scraped_at ? new Date(source.last_scraped_at).toLocaleDateString() : 'Never'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => scrapeNow(source)} title="Scrape now">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleSourceStatus(source)} title={source.status === 'active' ? 'Pause' : 'Resume'}>
                      {source.status === 'active' ? <Pause className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteSource(source.id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {sources.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No sources configured</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </SettingsSection>
  );
}
