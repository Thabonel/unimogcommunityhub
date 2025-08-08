
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, File, Upload, Download, X } from 'lucide-react';

export type ImportStatus = 'idle' | 'processing' | 'success' | 'error';

interface TrackImportStatusProps {
  fileName?: string;
  status: ImportStatus;
  progress?: number;
  error?: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

const TrackImportStatus = ({
  fileName = 'track.gpx',
  status,
  progress = 0,
  error,
  onDismiss,
  onRetry
}: TrackImportStatusProps) => {
  return (
    <Card className="shadow-sm border-2 transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-5">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base flex items-center space-x-2">
            <File className="h-4 w-4 text-blue-500" />
            <span>Track Import</span>
          </CardTitle>
          {onDismiss && (
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription className="text-xs">
          {status === 'idle' && 'Ready to import track file'}
          {status === 'processing' && 'Processing track file...'}
          {status === 'success' && 'Track file imported successfully'}
          {status === 'error' && 'Error importing track file'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="py-3 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {status === 'idle' && <Upload className="h-5 w-5 text-muted-foreground" />}
          {status === 'processing' && <Upload className="h-5 w-5 text-blue-500 animate-pulse" />}
          {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
          
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{fileName}</p>
            
            {status === 'processing' && (
              <div className="mt-2 space-y-1">
                <Progress value={progress} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{progress}% complete</p>
              </div>
            )}
            
            {status === 'error' && error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>
        </div>
        
        {status === 'error' && onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="w-full">
            Retry Import
          </Button>
        )}
        
        {status === 'success' && (
          <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-2 text-xs text-green-700 dark:text-green-300">
            Track successfully imported and added to the map
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackImportStatus;
