import React, { useCallback, useState } from 'react';
import {
  Upload,
  Camera,
  File,
  Image,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CameraCapture } from './CameraCapture';

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface ReceiptUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  uploadProgress?: UploadProgress[];
  disabled?: boolean;
  maxFiles?: number;
}

export const ReceiptUploadZone: React.FC<ReceiptUploadZoneProps> = ({
  files,
  onFilesChange,
  uploadProgress = [],
  disabled = false,
  maxFiles = 10,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
    }
  }, [disabled]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (disabled) return;

      const newFiles = Array.from(e.dataTransfer.files);
      const totalFiles = files.length + newFiles.length;

      if (totalFiles > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      onFilesChange([...files, ...newFiles]);
    },
    [files, onFilesChange, disabled, maxFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFiles = Array.from(e.target.files || []);
      const totalFiles = files.length + newFiles.length;

      if (totalFiles > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      onFilesChange([...files, ...newFiles]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [files, onFilesChange, maxFiles]
  );

  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleCameraCapture = (file: File) => {
    const totalFiles = files.length + 1;

    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    onFilesChange([...files, file]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 bg-muted/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="p-6 text-center space-y-4">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />

          <div className="space-y-1">
            <p className="font-medium">Drag and drop your invoices here</p>
            <p className="text-sm text-muted-foreground">
              or use the buttons below
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || files.length >= maxFiles}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCameraOpen(true)}
              disabled={disabled || files.length >= maxFiles}
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            {files.length} of {maxFiles} files selected
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        disabled={disabled}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx"
      />

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Files</p>
          <div className="space-y-2">
            {files.map((file, index) => {
              const progress = uploadProgress.find(
                (p) => p.fileName === file.name
              );

              return (
                <Card key={`${file.name}-${index}`} className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {getFileIcon(file.name)}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>

                        {progress && (
                          <div className="mt-2 space-y-1">
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${progress.progress}%` }}
                              />
                            </div>
                            {progress.status === 'error' && (
                              <p className="text-xs text-destructive flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {progress.error || 'Upload failed'}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {progress ? (
                        <>
                          {progress.status === 'uploading' && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          )}
                          {progress.status === 'success' && (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          )}
                          {progress.status === 'error' && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </>
                      ) : (
                        <Badge variant="outline">Ready</Badge>
                      )}

                      {!progress || progress.status !== 'uploading' ? (
                        <button
                          onClick={() => handleRemoveFile(index)}
                          disabled={disabled}
                          className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
                          aria-label="Remove file"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <CameraCapture
        isOpen={cameraOpen}
        onCapture={handleCameraCapture}
        onClose={() => setCameraOpen(false)}
      />
    </div>
  );
};
