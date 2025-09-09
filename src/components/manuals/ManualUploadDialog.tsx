import { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { 
  manualApprovalService,
  PendingManualUpload 
} from '@/services/manuals/manualApprovalService';
import { extractModelCodes } from '@/utils/documentChunking';

interface ManualUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (upload: PendingManualUpload) => void;
}

const MANUAL_CATEGORIES = [
  { value: 'operator', label: 'Operator Manual' },
  { value: 'service', label: 'Service Manual' },
  { value: 'parts', label: 'Parts Catalog' },
  { value: 'workshop', label: 'Workshop Manual' },
  { value: 'technical', label: 'Technical Specifications' },
  { value: 'maintenance', label: 'Maintenance Guide' },
  { value: 'electrical', label: 'Electrical Systems' },
  { value: 'hydraulic', label: 'Hydraulic Systems' },
  { value: 'engine', label: 'Engine Manual' },
  { value: 'transmission', label: 'Transmission' },
  { value: 'drivetrain', label: 'Drivetrain/Axles' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
  { value: 'general', label: 'General Documentation' },
];

export function ManualUploadDialog({
  open,
  onOpenChange,
  onUploadComplete
}: ManualUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [modelCodes, setModelCodes] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFileSelect(droppedFile);
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please upload a PDF file',
        variant: 'destructive'
      });
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (selectedFile.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'File size must be under 50MB. Please compress your PDF or split into smaller files.',
        variant: 'destructive'
      });
      return;
    }
    
    setFile(selectedFile);
    
    // Auto-fill title from filename
    const autoTitle = selectedFile.name
      .replace(/\.pdf$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    if (!title) {
      setTitle(autoTitle);
    }
    
    // Try to extract model codes from filename
    const extractedCodes = extractModelCodes(selectedFile.name);
    if (extractedCodes.length > 0) {
      setModelCodes(extractedCodes);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a PDF file to upload',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const increment = Math.random() * 15 + 5; // 5-20% increments
          const next = Math.min(prev + increment, 90);
          return next;
        });
      }, 200);

      const pendingUpload = await manualApprovalService.submitManualForApproval({
        file,
        title: title || file.name.replace(/\.pdf$/i, ''),
        description,
        category,
        model_codes: modelCodes.length > 0 ? modelCodes : undefined,
        year_range: yearRange || undefined,
      });

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      toast({
        title: 'Manual submitted for approval',
        description: 'Your manual has been uploaded and is pending admin approval.',
      });

      onUploadComplete?.(pendingUpload);
      onOpenChange(false);
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('general');
      setModelCodes([]);
      setYearRange('');
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Remove old processing status references

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Technical Manual</DialogTitle>
          <DialogDescription>
            Upload a PDF manual for admin approval. Once approved, it will be processed and 
            made searchable by Barry AI for all users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
              ${file ? 'bg-green-50 border-green-300' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            
            {file ? (
              <div className="space-y-2">
                <FileCheck className="w-12 h-12 mx-auto text-green-600" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">
                  Drop PDF file here or click to browse
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Maximum file size: 50MB
                </p>
              </>
            )}
          </div>

          {/* Manual Details */}
          {file && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Manual Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., U1700L Service Manual"
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the manual contents..."
                  rows={3}
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MANUAL_CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Model Codes (Auto-detected)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {modelCodes.length > 0 ? (
                    modelCodes.map(code => (
                      <Badge key={code} variant="secondary">
                        {code}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No model codes detected
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="yearRange">Year Range (Optional)</Label>
                <Input
                  id="yearRange"
                  value={yearRange}
                  onChange={(e) => setYearRange(e.target.value)}
                  placeholder="e.g., 1985-1993"
                  disabled={uploading}
                />
              </div>
            </div>
          )}

          {/* Upload Status */}
          {uploading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Uploading manual for admin approval...
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{Math.round(uploadProgress)}%</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                  <Progress value={uploadProgress} className="w-full h-2" />
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit for Approval
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}