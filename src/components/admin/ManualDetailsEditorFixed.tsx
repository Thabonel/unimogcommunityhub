import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Save, X, FileText, Calendar, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';

interface ManualMetadata {
  id: string;
  filename: string;
  original_filename: string;
  title: string;
  description: string;
  category: string;
  model_codes: string;
  year_range: string;
  file_size: number;
  page_count: number;
  chunk_count: number;
  processing_status: string;
  created_at: string;
  updated_at: string;
}

interface EditingManual {
  id: string;
  title: string;
  description: string;
  category: string;
  model_codes: string;
  year_range: string;
}

export function ManualDetailsEditorFixed() {
  const [manuals, setManuals] = useState<ManualMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingManual, setEditingManual] = useState<EditingManual | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchManuals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('manuals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setManuals(data || []);
    } catch (error) {
      console.error('Error fetching manuals:', error);
      toast({
        title: "Error",
        description: "Failed to load manual metadata",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuals();
  }, []);

  const startEditing = (manual: ManualMetadata) => {
    setEditingManual({
      id: manual.id,
      title: manual.title,
      description: manual.description || '',
      category: manual.category || '',
      model_codes: manual.model_codes || '',
      year_range: manual.year_range || ''
    });
  };

  const cancelEditing = () => {
    setEditingManual(null);
  };

  const saveManual = async () => {
    if (!editingManual) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('manuals')
        .update({
          title: editingManual.title,
          description: editingManual.description,
          category: editingManual.category,
          model_codes: editingManual.model_codes,
          year_range: editingManual.year_range,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingManual.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Manual metadata updated successfully"
      });

      setEditingManual(null);
      fetchManuals(); // Refresh the list
    } catch (error) {
      console.error('Error saving manual:', error);
      toast({
        title: "Error",
        description: "Failed to update manual metadata",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredManuals = manuals.filter(manual =>
    manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manual.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Manual Metadata Editor
          </CardTitle>
          <CardDescription>
            Edit manual titles, descriptions, categories, and model codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <Label htmlFor="search">Search Manuals</Label>
            <Input
              id="search"
              placeholder="Search by title or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Manual List */}
          {loading ? (
            <div className="text-center py-8">Loading manuals...</div>
          ) : filteredManuals.length === 0 ? (
            <div className="text-center py-8">
              {manuals.length === 0 ? 'No manuals found' : 'No matching manuals'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Models</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredManuals.map((manual) => (
                    <TableRow key={manual.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{manual.title}</div>
                          <div className="text-sm text-gray-500">{manual.filename}</div>
                        </div>
                      </TableCell>
                      <TableCell>{manual.category || 'Not set'}</TableCell>
                      <TableCell>{manual.model_codes || 'Not set'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          manual.processing_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {manual.processing_status}
                        </span>
                      </TableCell>
                      <TableCell>{formatFileSize(manual.file_size)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(manual)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingManual && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Manual Metadata</CardTitle>
            <CardDescription>
              Update the information for this manual
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingManual.title}
                onChange={(e) => setEditingManual(prev => prev ? { ...prev, title: e.target.value } : null)}
                placeholder="Manual title..."
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editingManual.description}
                onChange={(e) => setEditingManual(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Brief description of the manual contents..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editingManual.category}
                onValueChange={(value) => setEditingManual(prev => prev ? { ...prev, category: value } : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Workshop Manual">Workshop Manual</SelectItem>
                  <SelectItem value="Service Manual">Service Manual</SelectItem>
                  <SelectItem value="Operator Manual">Operator Manual</SelectItem>
                  <SelectItem value="Parts Manual">Parts Manual</SelectItem>
                  <SelectItem value="Technical Bulletin">Technical Bulletin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-models">Model Codes</Label>
              <Input
                id="edit-models"
                value={editingManual.model_codes}
                onChange={(e) => setEditingManual(prev => prev ? { ...prev, model_codes: e.target.value } : null)}
                placeholder='{"U1700L", "U435", "435.0"}'
              />
            </div>

            <div>
              <Label htmlFor="edit-years">Year Range</Label>
              <Input
                id="edit-years"
                value={editingManual.year_range}
                onChange={(e) => setEditingManual(prev => prev ? { ...prev, year_range: e.target.value } : null)}
                placeholder="e.g., 1970-1989"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={saveManual} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={cancelEditing} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ManualDetailsEditorFixed;