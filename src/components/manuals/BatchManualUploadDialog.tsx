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
  FileCheck,
  FolderTree,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  manualApprovalService,
  PendingManualUpload
} from '@/services/manuals/manualApprovalService';
import { extractModelCodes } from '@/utils/documentChunking';

interface BatchManualUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete?: (uploads: PendingManualUpload[]) => void;
}

interface FileWithMetadata {
  file: File;
  title: string;
  sectionNumber: number;
  subsectionTitle: string;
  modelCodes: string[];
}

const MANUAL_CATEGORIES = [
  { value: 'maintenance', label: 'Maintenance Guide' },
  { value: 'service', label: 'Service Manual' },
  { value: 'operator', label: 'Operator Manual' },
  { value: 'parts', label: 'Parts Catalog' },
  { value: 'workshop', label: 'Workshop Manual' },
  { value: 'technical', label: 'Technical Specifications' },
];

export function BatchManualUploadDialog({
  open,
  onOpenChange,
  onUploadComplete
}: BatchManualUploadDialogProps) {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [parentTitle, setParentTitle] = useState('');
  const [category, setCategory] = useState('maintenance');
  const [yearRange, setYearRange] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadResults, setUploadResults] = useState<{file: string, success: boolean, error?: string}[]>([]);

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

    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length === 0) {
      toast({
        title: 'No PDF files found',
        description: 'Please upload PDF files only',
        variant: 'destructive'
      });
      return;
    }

    handleMultipleFileSelect(pdfFiles);
  }, []);

  const parseUnimogFileName = (filename: string): { sectionNumber: number; subsectionTitle: string; title: string } => {
    // Handle Unimog 435 file naming patterns
    // Examples: "00 - General.pdf", "25 - Clutch.pdf", "42 - Brakes - Hydraulic + Mechanical.pdf"

    const baseName = filename.replace(/\.pdf$/i, '');

    // Extract section number and title
    const match = baseName.match(/^(\d+)\s*-\s*(.+)$/);
    if (match) {
      const sectionNumber = parseInt(match[1], 10);
      const subsectionTitle = match[2].trim();
      const title = `Unimog 435 - ${String(sectionNumber).padStart(2, '0')} ${subsectionTitle}`;

      return { sectionNumber, subsectionTitle, title };
    }

    // Fallback for non-standard naming
    return {
      sectionNumber: 0,
      subsectionTitle: baseName,
      title: `Unimog 435 - ${baseName}`
    };
  };

  const handleMultipleFileSelect = (selectedFiles: File[]) => {
    const validFiles: FileWithMetadata[] = [];
    let totalSize = 0;

    for (const file of selectedFiles) {
      // Check file size (50MB limit per file)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: `${file.name} is over 50MB. Please compress or split large files.`,
          variant: 'destructive'
        });
        continue;
      }

      totalSize += file.size;

      const { sectionNumber, subsectionTitle, title } = parseUnimogFileName(file.name);
      const modelCodes = extractModelCodes(file.name);

      validFiles.push({
        file,
        title,
        sectionNumber,
        subsectionTitle,
        modelCodes
      });
    }

    // Check total batch size (500MB limit)
    const maxBatchSize = 500 * 1024 * 1024;
    if (totalSize > maxBatchSize) {
      toast({
        title: 'Batch too large',
        description: `Total size is ${(totalSize / 1024 / 1024).toFixed(2)}MB. Maximum batch size is 500MB.`,
        variant: 'destructive'
      });
      return;
    }

    // Sort by section number for proper ordering
    validFiles.sort((a, b) => a.sectionNumber - b.sectionNumber);

    setFiles(validFiles);

    // Auto-detect parent title if not set
    if (!parentTitle && validFiles.length > 0) {
      setParentTitle('Unimog 435 Maintenance Manual');
    }

    toast({
      title: 'Files loaded',
      description: `${validFiles.length} PDF files ready for batch upload (${(totalSize / 1024 / 1024).toFixed(2)}MB total)`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      handleMultipleFileSelect(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchUpload = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select PDF files to upload',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setCurrentFile(0);
    setUploadResults([]);

    const results: {file: string, success: boolean, error?: string}[] = [];
    const uploads: PendingManualUpload[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        setCurrentFile(i + 1);
        setUploadProgress(((i + 1) / files.length) * 100);

        try {
          const pendingUpload = await manualApprovalService.submitManualForApproval({
            file: fileData.file,
            title: fileData.title,
            description: `Part of ${parentTitle} - Section ${fileData.sectionNumber}: ${fileData.subsectionTitle}`,
            category,
            model_codes: fileData.modelCodes.length > 0 ? fileData.modelCodes : ['435'],
            year_range: yearRange || undefined
          });

          uploads.push(pendingUpload);
          results.push({ file: fileData.title, success: true });

          // Small delay to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
          console.error(`Upload error for ${fileData.title}:`, error);
          results.push({
            file: fileData.title,
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
          });
        }
      }

      setUploadResults(results);

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      toast({
        title: 'Batch upload complete',
        description: `${successCount} files uploaded successfully${failCount > 0 ? `, ${failCount} failed` : ''}`,
        variant: failCount > 0 ? 'destructive' : 'default'
      });

      if (uploads.length > 0) {
        onUploadComplete?.(uploads);
      }

      if (successCount === files.length) {
        onOpenChange(false);
        // Reset form
        setFiles([]);
        setParentTitle('');
        setCategory('maintenance');
        setYearRange('');
      }

    } catch (error) {
      console.error('Batch upload error:', error);
      toast({
        title: 'Batch upload failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setCurrentFile(0);
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Batch Upload Manual Sections
          </DialogTitle>
          <DialogDescription>
            Upload multiple related PDF sections that will be organized under a parent manual.
            Perfect for sectioned maintenance manuals like the Unimog 435 series.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              transition-colors duration-200
              ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
              ${files.length > 0 ? 'bg-green-50 border-green-300' : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('batch-file-upload')?.click()}
          >
            <input
              id="batch-file-upload"
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />

            {files.length > 0 ? (
              <div className="space-y-2">
                <FileCheck className="w-12 h-12 mx-auto text-green-600" />
                <p className="font-medium">{files.length} files selected</p>
                <p className="text-sm text-gray-500">
                  Total size: {(totalSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">
                  Drop multiple PDF files here or click to browse
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Maximum: 50MB per file, 500MB total batch
                </p>
              </>
            )}
          </div>

          {/* Parent Manual Details */}
          {files.length > 0 && (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium">Parent Manual Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentTitle">Parent Manual Title</Label>
                  <Input
                    id="parentTitle"
                    value={parentTitle}
                    onChange={(e) => setParentTitle(e.target.value)}
                    placeholder="e.g., Unimog 435 Maintenance Manual"
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

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Files to Upload ({files.length})</h3>
              <div className="max-h-48 overflow-y-auto border rounded-lg">
                {files.map((fileData, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{fileData.title}</div>
                      <div className="text-xs text-gray-500">
                        {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                        {fileData.modelCodes.length > 0 && (
                          <span className="ml-2">
                            Models: {fileData.modelCodes.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Uploading files for approval... ({currentFile}/{files.length})
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

          {/* Upload Results */}
          {uploadResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Upload Results</h3>
              <div className="space-y-1">
                {uploadResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={result.success ? 'text-green-700' : 'text-red-700'}>
                      {result.file}
                    </span>
                    {result.error && (
                      <span className="text-red-600 text-xs">- {result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
            onClick={handleBatchUpload}
            disabled={files.length === 0 || uploading || !parentTitle}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading {currentFile}/{files.length}...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {files.length} Files
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}