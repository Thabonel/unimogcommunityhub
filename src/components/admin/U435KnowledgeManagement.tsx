import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  Settings,
  Search,
  Download,
  Edit,
  Plus,
  FileText,
  Database,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';

interface U435ManualPart {
  id: number;
  manual_type: 'workshop' | 'maintenance';
  part_number: number;
  slug: string;
  title: string;
  filename: string;
  storage_bucket: string;
  storage_path: string;
  priority: 'high' | 'standard' | 'critical';
  keywords: string[];
  page_count: number;
  start_page: number;
  end_page: number;
  file_size_mb: number;
  created_at: string;
  updated_at: string;
}

interface U435IndexTerm {
  id: number;
  term: string;
  page_number: number;
  manual_part_id: number;
  manual_title?: string;
  created_at: string;
}

interface BarryAnalytics {
  total_u435_queries: number;
  successful_responses: number;
  fallback_responses: number;
  most_referenced_chapters: Array<{
    title: string;
    filename: string;
    reference_count: number;
  }>;
  recent_queries: Array<{
    query: string;
    response_type: 'knowledge' | 'fallback';
    timestamp: string;
  }>;
}

export function U435KnowledgeManagement() {
  const [manualParts, setManualParts] = useState<U435ManualPart[]>([]);
  const [indexTerms, setIndexTerms] = useState<U435IndexTerm[]>([]);
  const [analytics, setAnalytics] = useState<BarryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'workshop' | 'maintenance'>('all');
  const [editingChapter, setEditingChapter] = useState<U435ManualPart | null>(null);
  const [newTerm, setNewTerm] = useState({ term: '', page_number: '', manual_part_id: '' });

  // Fetch all U435 data
  useEffect(() => {
    fetchU435Data();
  }, []);

  const fetchU435Data = async () => {
    try {
      setLoading(true);

      // Fetch manual parts
      const { data: parts, error: partsError } = await supabase
        .from('u435_manual_parts')
        .select('*')
        .order('manual_type', { ascending: true })
        .order('part_number', { ascending: true });

      if (partsError) throw partsError;

      // Fetch index terms with manual titles
      const { data: terms, error: termsError } = await supabase
        .from('u435_manual_index')
        .select(`
          *,
          u435_manual_parts(title)
        `)
        .order('term', { ascending: true });

      if (termsError) throw termsError;

      // Process terms with manual titles
      const processedTerms = terms?.map(term => ({
        ...term,
        manual_title: term.u435_manual_parts?.title || 'Unknown Manual'
      })) || [];

      setManualParts(parts || []);
      setIndexTerms(processedTerms);

      // Fetch Barry analytics (mock data for now - implement based on actual analytics needs)
      await fetchBarryAnalytics();

    } catch (error) {
      console.error('Error fetching U435 data:', error);
      toast({
        title: 'Error loading data',
        description: 'Could not load U435 knowledge management data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBarryAnalytics = async () => {
    try {
      // This could be implemented with actual analytics queries
      // For now, providing mock structure
      const { data: recentChats } = await supabase
        .from('chat_logs')
        .select('messages, response, knowledge_source, created_at')
        .eq('model', 'gpt-4o-u435-knowledge')
        .order('created_at', { ascending: false })
        .limit(20);

      const mockAnalytics: BarryAnalytics = {
        total_u435_queries: recentChats?.length || 0,
        successful_responses: recentChats?.filter(c => c.knowledge_source === 'u435_manuals').length || 0,
        fallback_responses: recentChats?.filter(c => c.knowledge_source === 'fallback').length || 0,
        most_referenced_chapters: [
          { title: 'Engine Lubrication', filename: 'U435_05_Lubrication.pdf', reference_count: 15 },
          { title: 'Front Wheel Hub Drive', filename: 'U435_19_Wheel_Hub_Front.pdf', reference_count: 12 },
          { title: 'Service Brakes', filename: 'U435_23_Service_Brakes.pdf', reference_count: 8 }
        ],
        recent_queries: recentChats?.slice(0, 10).map(c => ({
          query: c.messages?.[c.messages.length - 1]?.content || 'Unknown query',
          response_type: c.knowledge_source === 'u435_manuals' ? 'knowledge' : 'fallback',
          timestamp: c.created_at
        })) || []
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const updateChapter = async (chapter: U435ManualPart) => {
    try {
      const { error } = await supabase
        .from('u435_manual_parts')
        .update({
          title: chapter.title,
          priority: chapter.priority,
          keywords: chapter.keywords,
          updated_at: new Date().toISOString()
        })
        .eq('id', chapter.id);

      if (error) throw error;

      toast({
        title: 'Chapter updated',
        description: `${chapter.title} has been updated successfully`,
      });

      setEditingChapter(null);
      fetchU435Data();
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update chapter',
        variant: 'destructive',
      });
    }
  };

  const addIndexTerm = async () => {
    try {
      if (!newTerm.term || !newTerm.page_number || !newTerm.manual_part_id) {
        toast({
          title: 'Missing fields',
          description: 'Please fill in all fields for the new index term',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('u435_manual_index')
        .insert({
          term: newTerm.term.toLowerCase(),
          page_number: parseInt(newTerm.page_number),
          manual_part_id: parseInt(newTerm.manual_part_id)
        });

      if (error) throw error;

      toast({
        title: 'Index term added',
        description: `Added "${newTerm.term}" to the search index`,
      });

      setNewTerm({ term: '', page_number: '', manual_part_id: '' });
      fetchU435Data();
    } catch (error) {
      console.error('Error adding index term:', error);
      toast({
        title: 'Add failed',
        description: 'Could not add index term',
        variant: 'destructive',
      });
    }
  };

  const deleteIndexTerm = async (termId: number) => {
    try {
      const { error } = await supabase
        .from('u435_manual_index')
        .delete()
        .eq('id', termId);

      if (error) throw error;

      toast({
        title: 'Index term deleted',
        description: 'Term removed from search index',
      });

      fetchU435Data();
    } catch (error) {
      console.error('Error deleting index term:', error);
      toast({
        title: 'Delete failed',
        description: 'Could not delete index term',
        variant: 'destructive',
      });
    }
  };

  const filteredParts = manualParts.filter(part => {
    const matchesSearch = part.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         part.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || part.manual_type === selectedType;
    return matchesSearch && matchesType;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'standard': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading U435 knowledge management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{manualParts.length}</p>
                <p className="text-sm text-muted-foreground">Total Chapters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{indexTerms.length}</p>
                <p className="text-sm text-muted-foreground">Index Terms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{analytics?.successful_responses || 0}</p>
                <p className="text-sm text-muted-foreground">Knowledge Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{analytics?.fallback_responses || 0}</p>
                <p className="text-sm text-muted-foreground">Fallback Responses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barry Analytics */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle>Barry U435 Assistant Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Most Referenced Chapters</h4>
                <div className="space-y-2">
                  {analytics.most_referenced_chapters.map((chapter, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{chapter.title}</span>
                      <Badge variant="outline">{chapter.reference_count} refs</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Recent Query Types</h4>
                <div className="space-y-2">
                  {analytics.recent_queries.slice(0, 5).map((query, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{query.query}</span>
                      <Badge variant={query.response_type === 'knowledge' ? 'default' : 'secondary'}>
                        {query.response_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapter Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            U435/U1700L Manual Chapters
          </CardTitle>
          <div className="flex gap-4">
            <Input
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredParts.map((chapter) => (
              <div key={chapter.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{chapter.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {chapter.manual_type.toUpperCase()}
                    </Badge>
                    <Badge className={`text-xs text-white ${getPriorityColor(chapter.priority)}`}>
                      {chapter.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingChapter(chapter)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${chapter.storage_bucket}/${chapter.storage_path}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">File:</span> {chapter.filename}
                  </div>
                  <div>
                    <span className="font-medium">Pages:</span> {chapter.start_page && chapter.end_page ?
                      `${chapter.start_page}-${chapter.end_page}` : chapter.page_count || 'Unknown'}
                  </div>
                  <div>
                    <span className="font-medium">Size:</span> {chapter.file_size_mb}MB
                  </div>
                  <div>
                    <span className="font-medium">Part:</span> {chapter.part_number}
                  </div>
                </div>

                {chapter.keywords && chapter.keywords.length > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-muted-foreground">Keywords: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {chapter.keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Index Term Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Search Index Terms
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Term
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Index Term</DialogTitle>
                  <DialogDescription>
                    Add a new searchable term that maps to a specific page in a manual.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search term"
                    value={newTerm.term}
                    onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Page number"
                    value={newTerm.page_number}
                    onChange={(e) => setNewTerm({ ...newTerm, page_number: e.target.value })}
                  />
                  <Select value={newTerm.manual_part_id} onValueChange={(value) => setNewTerm({ ...newTerm, manual_part_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manual chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {manualParts.map((part) => (
                        <SelectItem key={part.id} value={part.id.toString()}>
                          {part.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={addIndexTerm} className="w-full">
                    Add Term
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {indexTerms.map((term) => (
              <div key={term.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">"{term.term}"</span>
                    <p className="text-sm text-muted-foreground">Page {term.page_number}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteIndexTerm(term.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {term.manual_title}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Chapter Dialog */}
      {editingChapter && (
        <Dialog open={!!editingChapter} onOpenChange={() => setEditingChapter(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Chapter: {editingChapter.title}</DialogTitle>
              <DialogDescription>
                Update chapter metadata for Barry's knowledge system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                label="Title"
                value={editingChapter.title}
                onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
              />

              <Select
                value={editingChapter.priority}
                onValueChange={(value: any) => setEditingChapter({ ...editingChapter, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>

              <div>
                <label className="text-sm font-medium">Keywords (comma-separated)</label>
                <Textarea
                  value={editingChapter.keywords.join(', ')}
                  onChange={(e) => setEditingChapter({
                    ...editingChapter,
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
                  })}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingChapter(null)}>
                  Cancel
                </Button>
                <Button onClick={() => updateChapter(editingChapter)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default U435KnowledgeManagement;