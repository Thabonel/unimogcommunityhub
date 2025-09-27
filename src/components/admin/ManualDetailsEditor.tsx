import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Edit,
  Save,
  X,
  Plus,
  FileText,
  Calendar,
  Tag,
  HardDrive,
  User,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import { ManualProcessingService } from '@/services/manuals/manualProcessingService';

interface ManualMetadata {
  id: string;
  filename: string;
  title: string;
  model_codes: string[] | null;
  year_range: string | null;
  category: string | null;
  page_count: number | null;
  file_size: number | null;
  approval_status: string;
  created_at: string;
  updated_at: string;
}

interface EditingManual extends ManualMetadata {
  newModelCode?: string;
}

const MANUAL_CATEGORIES = [
  'Workshop Manual',
  'Service Manual',
  'Parts Catalog',
  'Operation Manual',
  'Technical Bulletin',
  'Service Information',
  'Repair Instructions',
  'Training Material',
  'Reference Guide',
  'Troubleshooting Guide'
];

const APPROVAL_STATUSES = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rejected', icon: AlertCircle, color: 'bg-red-100 text-red-800' }
];

export function ManualDetailsEditor() {
  const [manuals, setManuals] = useState<ManualMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingManual, setEditingManual] = useState<EditingManual | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cleaning, setCleaning] = useState(false);

  const manualProcessingService = new ManualProcessingService();

  const fetchManuals = async () => {
    try {
      const { data, error } = await supabase
        .from('manual_metadata')
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

  const handleEdit = (manual: ManualMetadata) => {
    setEditingManual({
      ...manual,
      model_codes: manual.model_codes || [],
      newModelCode: ''
    });
  };

  const handleSave = async () => {
    if (!editingManual) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('manual_metadata')
        .update({
          title: editingManual.title,
          model_codes: editingManual.model_codes,
          year_range: editingManual.year_range,
          category: editingManual.category,
          page_count: editingManual.page_count,
          approval_status: editingManual.approval_status,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingManual.id);

      if (error) throw error;

      toast({
        title: "✅ Manual Updated",
        description: `Successfully updated "${editingManual.title}"`,
      });

      // Refresh the list
      fetchManuals();
      setEditingManual(null);
    } catch (error) {
      console.error('Error updating manual:', error);
      toast({
        title: "❌ Update Failed",
        description: "Failed to update manual metadata",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addModelCode = () => {
    if (!editingManual || !editingManual.newModelCode?.trim()) return;

    const currentCodes = editingManual.model_codes || [];
    const newCode = editingManual.newModelCode.trim().toUpperCase();

    if (!currentCodes.includes(newCode)) {
      setEditingManual({
        ...editingManual,
        model_codes: [...currentCodes, newCode],
        newModelCode: ''
      });
    }
  };

  const removeModelCode = (codeToRemove: string) => {
    if (!editingManual) return;

    setEditingManual({
      ...editingManual,
      model_codes: (editingManual.model_codes || []).filter(code => code !== codeToRemove)
    });
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const getStatusInfo = (status: string) => {
    return APPROVAL_STATUSES.find(s => s.value === status) || APPROVAL_STATUSES[0];
  };

  const handleCleanupOrphanedRecords = async () => {
    setCleaning(true);
    try {
      const result = await manualProcessingService.cleanupOrphanedRecords();

      if (result.errors.length > 0) {
        console.error('Cleanup errors:', result.errors);
      }

      // Refresh the manual list after cleanup
      await fetchManuals();

      toast({
        title: "Cleanup Complete",
        description: `Removed ${result.cleaned} orphaned records`,
      });
    } catch (error) {
      console.error('Cleanup failed:', error);
      toast({
        title: "Cleanup Failed",
        description: "Failed to clean up orphaned records",
        variant: "destructive"
      });
    } finally {
      setCleaning(false);
    }
  };

  const filteredManuals = manuals.filter(manual =>
    manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manual.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manual.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manual.model_codes?.some(code => code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading manual metadata...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PDF Manual Details Editor
              </CardTitle>
              <CardDescription>
                Edit manual metadata including titles, descriptions, model codes, and categories
              </CardDescription>
            </div>
            <Button
              onClick={handleCleanupOrphanedRecords}
              disabled={cleaning}
              variant="outline"
              size="sm"
            >
              {cleaning ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Cleaning...
                </>
              ) : (
                <>
                  <HardDrive className="h-4 w-4 mr-2" />
                  Clean Up Orphaned Records
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="search">Search Manuals</Label>
            <Input
              id="search"
              placeholder="Search by title, filename, category, or model code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Model Codes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredManuals.map((manual) => {
                  const statusInfo = getStatusInfo(manual.approval_status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow key={manual.id}>
                      <TableCell className="font-medium max-w-[200px]">
                        <div className="truncate" title={manual.title}>
                          {manual.title}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <div className="truncate text-sm text-gray-600" title={manual.filename}>
                          {manual.filename}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {manual.category || 'Uncategorized'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {manual.model_codes?.map(code => (
                            <Badge key={code} variant="secondary" className="text-xs">
                              {code}
                            </Badge>
                          )) || <span className="text-sm text-gray-400">None</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusInfo.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatFileSize(manual.file_size)}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(manual)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Manual Details</DialogTitle>
                              <DialogDescription>
                                Update the metadata for this PDF manual
                              </DialogDescription>
                            </DialogHeader>

                            {editingManual && (
                              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="filename">Filename</Label>
                                    <Input
                                      id="filename"
                                      value={editingManual.filename}
                                      disabled
                                      className="bg-gray-50"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="file_size">File Size</Label>
                                    <Input
                                      id="file_size"
                                      value={formatFileSize(editingManual.file_size)}
                                      disabled
                                      className="bg-gray-50"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="title">Title *</Label>
                                  <Input
                                    id="title"
                                    value={editingManual.title}
                                    onChange={(e) => setEditingManual({
                                      ...editingManual,
                                      title: e.target.value
                                    })}
                                    placeholder="Enter a descriptive title"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                      value={editingManual.category || ''}
                                      onValueChange={(value) => setEditingManual({
                                        ...editingManual,
                                        category: value
                                      })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {MANUAL_CATEGORIES.map(category => (
                                          <SelectItem key={category} value={category}>
                                            {category}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="year_range">Year Range</Label>
                                    <Input
                                      id="year_range"
                                      value={editingManual.year_range || ''}
                                      onChange={(e) => setEditingManual({
                                        ...editingManual,
                                        year_range: e.target.value
                                      })}
                                      placeholder="e.g. 2000-2024"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="page_count">Page Count</Label>
                                  <Input
                                    id="page_count"
                                    type="number"
                                    value={editingManual.page_count || ''}
                                    onChange={(e) => setEditingManual({
                                      ...editingManual,
                                      page_count: e.target.value ? parseInt(e.target.value) : null
                                    })}
                                    placeholder="Number of pages"
                                  />
                                </div>

                                <div>
                                  <Label>Model Codes</Label>
                                  <div className="space-y-2">
                                    <div className="flex gap-2">
                                      <Input
                                        value={editingManual.newModelCode || ''}
                                        onChange={(e) => setEditingManual({
                                          ...editingManual,
                                          newModelCode: e.target.value
                                        })}
                                        placeholder="Add model code (e.g. U1700L)"
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addModelCode();
                                          }
                                        }}
                                      />
                                      <Button type="button" onClick={addModelCode} size="sm">
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {editingManual.model_codes?.map(code => (
                                        <Badge key={code} variant="secondary" className="flex items-center gap-1">
                                          {code}
                                          <X
                                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                                            onClick={() => removeModelCode(code)}
                                          />
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="approval_status">Approval Status</Label>
                                  <Select
                                    value={editingManual.approval_status}
                                    onValueChange={(value) => setEditingManual({
                                      ...editingManual,
                                      approval_status: value
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {APPROVAL_STATUSES.map(status => {
                                        const StatusIcon = status.icon;
                                        return (
                                          <SelectItem key={status.value} value={status.value}>
                                            <div className="flex items-center gap-2">
                                              <StatusIcon className="h-4 w-4" />
                                              {status.label}
                                            </div>
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex justify-end gap-2 pt-4 border-t">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingManual(null)}
                                    disabled={saving}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={handleSave}
                                    disabled={saving || !editingManual.title.trim()}
                                  >
                                    {saving ? (
                                      <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                                        Saving...
                                      </>
                                    ) : (
                                      <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredManuals.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'No manuals match your search criteria' : 'No manuals found'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>Tips:</strong> Use descriptive titles that include the manual type and model.
          Add relevant model codes to improve searchability. Set proper categories to help organize the knowledge base.
        </AlertDescription>
      </Alert>
    </div>
  );
}