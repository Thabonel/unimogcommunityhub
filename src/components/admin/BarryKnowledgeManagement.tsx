import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Brain, Plus, Search, Edit, Trash2, TestTube, AlertCircle, CheckCircle, BookOpen, Upload, X, FileText, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useToast } from '@/hooks/use-toast';

interface AttachmentMetadata {
  filename: string;
  storage_path: string;
  public_url: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
}

interface KnowledgeEntry {
  id: string;
  question_keywords: string[];
  manual_references: any;
  barry_response_template: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

function BarryKnowledgeManagement() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEntry, setEditingEntry] = useState<KnowledgeEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    keywords: '',
    sources: '',
    responseTemplate: '',
    priority: 1
  });

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<AttachmentMetadata[]>([]);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);

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

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/dxf', 'application/octet-stream'];
    const validFiles = files.filter(file => {
      const isValid = allowedTypes.includes(file.type) || file.name.endsWith('.dxf');
      if (!isValid) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive"
        });
      }
      return isValid;
    });

    // Validate file sizes (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validSizedFiles = validFiles.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validSizedFiles]);
  };

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Remove existing attachment
  const removeExistingAttachment = async (attachment: AttachmentMetadata) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('manuals')
        .remove([attachment.storage_path]);

      if (storageError) throw storageError;

      setExistingAttachments(prev => prev.filter(a => a.storage_path !== attachment.storage_path));

      toast({
        title: "Success",
        description: "Attachment removed successfully"
      });
    } catch (error) {
      console.error('Error removing attachment:', error);
      toast({
        title: "Error",
        description: "Failed to remove attachment",
        variant: "destructive"
      });
    }
  };

  // Upload files to storage
  const uploadFiles = async (entryId: string): Promise<AttachmentMetadata[]> => {
    const uploadedAttachments: AttachmentMetadata[] = [];

    for (const file of selectedFiles) {
      try {
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const storagePath = `knowledge-attachments/${entryId}/${timestamp}-${file.name}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('manuals')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('manuals')
          .getPublicUrl(storagePath);

        uploadedAttachments.push({
          filename: file.name,
          storage_path: storagePath,
          public_url: publicUrl,
          file_type: fileExt || 'unknown',
          file_size: file.size,
          uploaded_at: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }

    return uploadedAttachments;
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSave = async () => {
    try {
      setUploadProgress(true);
      const keywordsArray = formData.keywords.split(',').map(k => k.trim()).filter(k => k);

      // Create entry first to get ID for file uploads
      let entryId = editingEntry?.id;

      if (!entryId) {
        // Create temporary entry to get ID
        const tempEntry = {
          question_keywords: keywordsArray,
          manual_references: {},
          barry_response_template: formData.responseTemplate || '',
          priority: formData.priority
        };

        const { data: newEntry, error: createError } = await supabase
          .from('barry_knowledge_base')
          .insert(tempEntry)
          .select()
          .single();

        if (createError) throw createError;
        entryId = newEntry.id;
      }

      // Upload new files if any
      let uploadedAttachments: AttachmentMetadata[] = [];
      if (selectedFiles.length > 0) {
        uploadedAttachments = await uploadFiles(entryId);
      }

      // Combine existing and new attachments
      const allAttachments = [...existingAttachments, ...uploadedAttachments];

      // Build manual_references object with attachments
      const sourcesObj: any = {};
      if (formData.sources.trim()) {
        sourcesObj.sources = formData.sources.trim();
      }
      if (allAttachments.length > 0) {
        sourcesObj.attachments = allAttachments;
      }

      const entryData = {
        question_keywords: keywordsArray,
        manual_references: sourcesObj,
        barry_response_template: formData.responseTemplate,
        priority: formData.priority
      };

      // Update entry with final data
      const { error: updateError } = await supabase
        .from('barry_knowledge_base')
        .update(entryData)
        .eq('id', entryId);

      if (updateError) throw updateError;

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
    } finally {
      setUploadProgress(false);
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

    // Extract sources and attachments from JSON
    const refs = entry.manual_references || {};
    const sources = refs.sources || '';
    const attachments = refs.attachments || [];

    setFormData({
      keywords: entry.question_keywords.join(', '),
      sources,
      responseTemplate: entry.barry_response_template || '',
      priority: entry.priority
    });
    setExistingAttachments(attachments);
    setSelectedFiles([]);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      keywords: '',
      sources: '',
      responseTemplate: '',
      priority: 1
    });
    setEditingEntry(null);
    setShowAddForm(false);
    setSelectedFiles([]);
    setExistingAttachments([]);
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
              <label className="text-sm font-medium">Knowledge Sources (Optional)</label>
              <Textarea
                placeholder="Facebook Unimog Owners Group thread, Expedition Portal forum, Workshop Manual U435 pages 526/623"
                value={formData.sources}
                onChange={(e) => setFormData(prev => ({ ...prev, sources: e.target.value }))}
                rows={2}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Where this knowledge came from (forums, Facebook groups, manuals, discussions, etc.)
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Technical Documents (Optional)</label>

              {/* Existing Attachments */}
              {existingAttachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Existing Attachments:</p>
                  {existingAttachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm flex-1">{attachment.filename}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(attachment.file_size)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExistingAttachment(attachment)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Files for Upload */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">Selected Files:</p>
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSelectedFile(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* File Upload Button */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Add Files
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.dxf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload DXF drawings, PDFs, images (max 10MB each). Barry will offer these for download when using this knowledge.
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={uploadProgress}>
                {uploadProgress ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {editingEntry ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={uploadProgress}>
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

                            {entry.manual_references?.sources && (
                              <div>
                                <span className="text-sm font-medium">Sources:</span>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {entry.manual_references.sources}
                                </p>
                              </div>
                            )}

                            {entry.manual_references?.attachments && entry.manual_references.attachments.length > 0 && (
                              <div>
                                <span className="text-sm font-medium">Attachments:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {entry.manual_references.attachments.map((att: AttachmentMetadata, idx: number) => (
                                    <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      {att.filename}
                                      <a
                                        href={att.public_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Download className="h-3 w-3 ml-1" />
                                      </a>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
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

export default BarryKnowledgeManagement;