import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Download,
  Share2,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Trash2,
  Eye,
  Edit,
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UserDocument {
  id: string;
  title: string;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  content_type: string;
  document_category: string;
  vehicle_model?: string;
  procedure_id?: string;
  metadata: any;
  is_public: boolean;
  download_count: number;
  created_at: string;
  updated_at: string;
}

interface DocumentGenerationRequest {
  title: string;
  data_type: string;
  vehicle_model?: string;
  data?: any;
  include_formulas?: boolean;
  format_style?: string;
}

export const DocumentManager: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateRequest, setGenerateRequest] = useState<DocumentGenerationRequest>({
    title: '',
    data_type: 'parts_catalog',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async () => {
    if (!generateRequest.title.trim()) {
      toast.error('Please enter a document title');
      return;
    }

    setIsGenerating(true);
    try {
      // Call Barry's new document creation capability
      const { data, error } = await supabase.functions.invoke('chat-with-barry-agentic', {
        body: {
          messages: [{
            role: 'user',
            content: `Create an Excel spreadsheet for my ${generateRequest.vehicle_model || 'Unimog'} with the title "${generateRequest.title}". Type: ${generateRequest.data_type}. Include formulas: ${generateRequest.include_formulas}. Style: ${generateRequest.format_style || 'professional'}.`
          }],
          use_tools: true,
          tool_request: {
            name: 'create_excel_spreadsheet',
            parameters: generateRequest
          }
        }
      });

      if (error) throw error;

      toast.success('Document generation initiated! You\'ll receive a notification when it\'s ready.');
      setIsGenerateDialogOpen(false);
      setGenerateRequest({ title: '', data_type: 'parts_catalog' });
      
      // Refresh documents after a short delay
      setTimeout(() => {
        fetchDocuments();
      }, 2000);
    } catch (error) {
      console.error('Error generating document:', error);
      toast.error('Failed to generate document');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDocument = async (document: UserDocument) => {
    try {
      // Increment download count
      await supabase.rpc('increment_document_downloads', { 
        document_uuid: document.id 
      });

      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600); // 1 hour expiry

      if (error) throw error;

      // Download the file
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = document.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update local state
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === document.id 
            ? { ...doc, download_count: doc.download_count + 1 }
            : doc
        )
      );

      toast.success('Document downloaded successfully');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      setDocuments(docs => docs.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'excel':
        return <FileSpreadsheet className="h-8 w-8 text-green-600" />;
      case 'powerpoint':
        return <Presentation className="h-8 w-8 text-orange-600" />;
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / 1048576) + ' MB';
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || doc.file_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading documents...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-military-green">Document Manager</h1>
          <p className="text-sm text-gray-600">Create, manage, and share your WIS documents</p>
        </div>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-military-green hover:bg-military-green/90">
              <Plus className="h-4 w-4 mr-2" />
              Generate Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate New Document</DialogTitle>
              <DialogDescription>
                Create a new Excel spreadsheet, PowerPoint presentation, or PDF using Barry AI
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Document Title
                </label>
                <Input
                  id="title"
                  value={generateRequest.title}
                  onChange={(e) => setGenerateRequest(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., U1300L Parts Catalog"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="data_type" className="text-sm font-medium">
                  Document Type
                </label>
                <Select
                  value={generateRequest.data_type}
                  onValueChange={(value) => setGenerateRequest(prev => ({ ...prev, data_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parts_catalog">Parts Catalog</SelectItem>
                    <SelectItem value="maintenance_schedule">Maintenance Schedule</SelectItem>
                    <SelectItem value="inventory_tracker">Inventory Tracker</SelectItem>
                    <SelectItem value="repair_log">Repair Log</SelectItem>
                    <SelectItem value="custom">Custom Spreadsheet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="vehicle_model" className="text-sm font-medium">
                  Vehicle Model (Optional)
                </label>
                <Input
                  id="vehicle_model"
                  value={generateRequest.vehicle_model || ''}
                  onChange={(e) => setGenerateRequest(prev => ({ ...prev, vehicle_model: e.target.value }))}
                  placeholder="e.g., U1300L, U1700"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsGenerateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={generateDocument}
                disabled={isGenerating}
                className="bg-military-green hover:bg-military-green/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="excel">Excel Files</SelectItem>
            <SelectItem value="powerpoint">PowerPoint</SelectItem>
            <SelectItem value="pdf">PDF Files</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents grid */}
      {filteredDocuments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-500 mb-4">
              {documents.length === 0 
                ? "You haven't created any documents yet. Generate your first document using Barry AI!"
                : "No documents match your current search and filters."
              }
            </p>
            {documents.length === 0 && (
              <Button
                onClick={() => setIsGenerateDialogOpen(true)}
                className="bg-military-green hover:bg-military-green/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Document
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(document.file_type)}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base truncate" title={document.title}>
                        {document.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500 mt-1">
                        {document.filename}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatFileSize(document.file_size)}</span>
                    <span>{new Date(document.created_at).toLocaleDateString()}</span>
                  </div>
                  
                  {document.vehicle_model && (
                    <Badge variant="secondary" className="text-xs">
                      {document.vehicle_model}
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="text-xs">
                    {document.document_category?.replace('_', ' ').toUpperCase()}
                  </Badge>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Download className="h-3 w-3 mr-1" />
                      {document.download_count} downloads
                    </div>
                    {document.is_public && (
                      <Badge variant="secondary" className="text-xs">
                        Public
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => downloadDocument(document)}
                      className="flex-1 bg-military-green hover:bg-military-green/90 text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteDocument(document.id)}
                      className="text-xs"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;