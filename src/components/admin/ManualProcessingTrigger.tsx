import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PlayCircle, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  FileText,
  Hash,
  Info
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';

interface StorageFile {
  name: string;
  metadata?: {
    size?: number;
    [key: string]: any;
  };
}

interface ProcessedFile {
  filename: string;
  title: string;
  processed_at: string | null;
  page_count: number;
  model_codes: string[];
  category: string;
}

interface ProcessingResult {
  filename: string;
  success: boolean;
  result?: {
    manual_id: string;
    title: string;
    pages: number;
    chunks: number;
    model_codes: string[];
    category: string;
  };
  error?: string;
}

export function ManualProcessingTrigger() {
  const [storageFiles, setStorageFiles] = useState<StorageFile[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessingResult[]>([]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      // Get files from storage
      const { data: files, error: storageError } = await supabase.storage
        .from('manuals')
        .list();

      if (storageError) {
        throw new Error(`Storage error: ${storageError.message}`);
      }

      const pdfFiles = (files || []).filter(file => 
        file.name.toLowerCase().endsWith('.pdf') && !file.name.startsWith('.')
      );
      
      setStorageFiles(pdfFiles);

      // Get already processed files
      const { data: processed, error: dbError } = await supabase
        .from('manual_metadata')
        .select('filename, title, processed_at, page_count, model_codes, category')
        .order('created_at', { ascending: false });

      if (dbError) {
        console.warn('Could not fetch processed files:', dbError);
        setProcessedFiles([]);
      } else {
        setProcessedFiles(processed || []);
      }

      toast({
        title: 'Files loaded',
        description: `Found ${pdfFiles.length} PDF files, ${(processed || []).length} already processed`,
      });

    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: 'Error loading files',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerProcessing = async () => {
    if (storageFiles.length === 0) {
      await loadFiles();
      return;
    }

    setProcessing(true);
    setResults([]);
    setProgress(0);

    try {
      // Filter out already processed files
      const processedFilenames = new Set(
        processedFiles
          .filter(f => f.processed_at)
          .map(f => f.filename)
      );

      const unprocessedFiles = storageFiles.filter(
        file => !processedFilenames.has(file.name)
      );

      if (unprocessedFiles.length === 0) {
        toast({
          title: 'All files processed',
          description: 'All PDF files have already been processed',
        });
        return;
      }

      toast({
        title: 'Processing started',
        description: `Processing ${unprocessedFiles.length} unprocessed files`,
      });

      const processingResults: ProcessingResult[] = [];

      // Process each file
      for (let i = 0; i < unprocessedFiles.length; i++) {
        const file = unprocessedFiles[i];
        setCurrentFile(file.name);
        setProgress((i / unprocessedFiles.length) * 100);

        try {
          // Get user session for authentication
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.access_token) {
            throw new Error('Authentication required');
          }

          // Call the process-manual edge function
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-manual`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                filename: file.name,
                bucket: 'manuals'
              })
            }
          );

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorData}`);
          }

          const result = await response.json();
          processingResults.push({
            filename: file.name,
            success: true,
            result
          });

          toast({
            title: `Processed ${file.name}`,
            description: `${result.chunks} chunks from ${result.pages} pages`,
          });

        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          processingResults.push({
            filename: file.name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });

          toast({
            title: `Failed to process ${file.name}`,
            description: error instanceof Error ? error.message : 'Unknown error',
            variant: 'destructive'
          });
        }

        // Small delay between files
        if (i < unprocessedFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      setResults(processingResults);
      setProgress(100);
      setCurrentFile('');

      const successful = processingResults.filter(r => r.success).length;
      const failed = processingResults.filter(r => !r.success).length;

      toast({
        title: 'Processing complete',
        description: `Successfully processed ${successful} files, ${failed} failed`,
        variant: failed > 0 ? 'destructive' : 'default'
      });

      // Refresh the processed files list
      await loadFiles();

    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
      setCurrentFile('');
      setProgress(0);
    }
  };

  const processedFilenames = new Set(
    processedFiles.filter(f => f.processed_at).map(f => f.filename)
  );
  
  const unprocessedFiles = storageFiles.filter(
    file => !processedFilenames.has(file.name)
  );

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Manual Processing Trigger
          </CardTitle>
          <CardDescription>
            Process existing PDF manuals in storage to make them searchable by Barry AI.
            This will create chunks and embeddings for semantic search.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={loadFiles}
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Info className="mr-2 h-4 w-4" />
                  Check Files
                </>
              )}
            </Button>

            <Button
              onClick={triggerProcessing}
              disabled={processing || storageFiles.length === 0}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Process Manuals
                </>
              )}
            </Button>
          </div>

          {/* File Status */}
          {storageFiles.length > 0 && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div>Found {storageFiles.length} PDF files in storage</div>
                  <div>✅ {processedFiles.length} already processed</div>
                  <div>⏳ {unprocessedFiles.length} need processing</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Processing Progress */}
          {processing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing: {currentFile}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Unprocessed Files */}
          {unprocessedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Files to Process:</h4>
              <div className="space-y-1">
                {unprocessedFiles.map(file => (
                  <div key={file.name} className="flex items-center justify-between text-sm border rounded p-2">
                    <span>{file.name}</span>
                    <Badge variant="secondary">
                      {formatFileSize(file.metadata?.size)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processed Files */}
          {processedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Already Processed:</h4>
              <div className="space-y-1">
                {processedFiles.slice(0, 5).map(file => (
                  <div key={file.filename} className="flex items-center justify-between text-sm border rounded p-2">
                    <span>{file.title}</span>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        <Hash className="h-3 w-3 mr-1" />
                        {file.page_count} pages
                      </Badge>
                      <Badge variant="secondary">
                        {file.category}
                      </Badge>
                    </div>
                  </div>
                ))}
                {processedFiles.length > 5 && (
                  <div className="text-center text-sm text-gray-500">
                    ... and {processedFiles.length - 5} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Processing Results:</h4>
              <div className="space-y-1">
                {results.map(result => (
                  <div key={result.filename} className="flex items-center justify-between text-sm border rounded p-2">
                    <span>{result.filename}</span>
                    {result.success ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <Badge variant="outline">
                          {result.result?.chunks} chunks
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-red-600 text-xs">{result.error}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}