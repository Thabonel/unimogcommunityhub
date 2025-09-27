import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Brain, Plus, Search, Edit, Trash2, TestTube, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeEntry {
  id: string;
  question_keywords: string[];
  manual_references: any;
  barry_response_template: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

export function BarryKnowledgeManagement() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    keywords: '',
    manualReferences: '',
    responseTemplate: '',
    priority: 1
  });

  useEffect(() => {
    loadKnowledgeEntries();
  }, []);

  const loadKnowledgeEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('barry_knowledge_base')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error loading knowledge entries:', error);
      toast({
        title: "Error",
        description: "Failed to load Barry's knowledge entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);
      let manualRefs;

      try {
        manualRefs = formData.manualReferences ? JSON.parse(formData.manualReferences) : {};
      } catch {
        toast({
          title: "Invalid JSON",
          description: "Manual references must be valid JSON",
          variant: "destructive"
        });
        return;
      }

      const entryData = {
        question_keywords: keywordsArray,
        manual_references: manualRefs,
        barry_response_template: formData.responseTemplate,
        priority: formData.priority
      };

      let result;
      if (editingEntry) {
        result = await supabase
          .from('barry_knowledge_base')
          .update(entryData)
          .eq('id', editingEntry.id);
      } else {
        result = await supabase
          .from('barry_knowledge_base')
          .insert(entryData);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: `Knowledge entry ${editingEntry ? 'updated' : 'created'} successfully`
      });

      resetForm();
      loadKnowledgeEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error",
        description: "Failed to save knowledge entry",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this knowledge entry?')) return;

    try {
      const { error } = await supabase
        .from('barry_knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Knowledge entry deleted successfully"
      });

      loadKnowledgeEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete knowledge entry",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (entry: KnowledgeEntry) => {
    setEditingEntry(entry);
    setFormData({
      keywords: entry.question_keywords.join(', '),
      manualReferences: JSON.stringify(entry.manual_references, null, 2),
      responseTemplate: entry.barry_response_template || '',
      priority: entry.priority
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      keywords: '',
      manualReferences: '',
      responseTemplate: '',
      priority: 1
    });
    setEditingEntry(null);
    setShowAddForm(false);
  };

  const filteredEntries = entries.filter(entry =>
    entry.question_keywords.some(keyword =>
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    (entry.barry_response_template || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Barry Knowledge Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manually curate Barry's responses to specific questions. This overrides AI semantic search for better control.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingEntry ? 'Edit' : 'Add'} Knowledge Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Question Keywords (comma-separated)</label>
              <Input
                placeholder="brake, hydraulic brake, brake system"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Keywords that trigger this knowledge entry
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Manual References (JSON)</label>
              <Textarea
                placeholder='{"manual": "G604", "pages": [23, 24], "sections": ["Brake System Overview"]}'
                value={formData.manualReferences}
                onChange={(e) => setFormData(prev => ({ ...prev, manualReferences: e.target.value }))}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                JSON object specifying which manuals and pages to display
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Barry Response Template (Optional)</label>
              <Textarea
                placeholder="Based on your U1700L's brake system specifications in Manual G604, page 23..."
                value={formData.responseTemplate}
                onChange={(e) => setFormData(prev => ({ ...prev, responseTemplate: e.target.value }))}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Custom response template for Barry to use
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher priority entries override lower ones (1-10)
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {editingEntry ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Knowledge Entries ({filteredEntries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No knowledge entries found</p>
              <p className="text-sm">Add your first entry to start curating Barry's knowledge</p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <Card key={entry.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Priority {entry.priority}</Badge>
                            <span className="text-xs text-muted-foreground">
                              Created {new Date(entry.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium">Keywords: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {entry.question_keywords.map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {entry.barry_response_template && (
                              <div>
                                <span className="text-sm font-medium">Response Template:</span>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {entry.barry_response_template}
                                </p>
                              </div>
                            )}

                            <div>
                              <span className="text-sm font-medium">Manual References:</span>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                                {JSON.stringify(entry.manual_references, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(entry)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Usage Instructions */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>How it works:</strong> When users ask Barry questions, the system first checks these manually curated entries by matching keywords.
          If a match is found (based on priority), Barry will use your custom response and display the specified manual references.
          Otherwise, it falls back to semantic search.
        </AlertDescription>
      </Alert>
    </div>
  );
}