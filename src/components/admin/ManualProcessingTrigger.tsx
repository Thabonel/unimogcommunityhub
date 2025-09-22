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
  Info,
  Play,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { ManualProcessingService } from '@/services/manualProcessingService';

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
  processing_completed_at: string | null;
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
  const [processingFiles, setProcessingFiles] = useState<Set<string>>(new Set());

  // New state for auto-hide functionality
  const [completedFiles, setCompletedFiles] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState(false);

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

      // Get processed files from manual_metadata table
      const { data: processed, error: processedError } = await supabase
        .from('manual_metadata')
        .select('*');

      if (processedError) {
        console.warn('Could not fetch processed files:', processedError);
        setProcessedFiles([]);
      } else {
        // Convert manual_metadata format to expected format
        const processedManuals = (processed || []).map(manual => ({
          filename: manual.filename,
          title: manual.title,
          processing_completed_at: manual.processed_at,
          page_count: manual.page_count || 0,
          model_codes: manual.model_codes || [],
          category: manual.category || 'unknown'
        }));
        setProcessedFiles(processedManuals);
      }

      toast({
        title: 'Files loaded',
        description: `Found ${pdfFiles.length} PDF files in storage, ${processedManuals.length} already processed`,
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
      // Filter out already processed files and completed files (prevent duplicates)
      const processedFilenames = new Set(
        processedFiles
          .filter(f => f.processing_completed_at)
          .map(f => f.filename)
      );

      const unprocessedFiles = storageFiles.filter(
        file => !processedFilenames.has(file.name) && !completedFiles.has(file.name)
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
          // Use the client-side processing service
          const processingService = ManualProcessingService.getInstance();
          const result = await processingService.processManual(file.name);
          
          if (result.success) {
            processingResults.push({
              filename: file.name,
              success: true,
              result: {
                chunks: result.chunks,
                pages: result.pages
              }
            });

            toast({
              title: `Processed ${file.name}`,
              description: `${result.chunks} chunks from ${result.pages} pages`,
            });
          } else {
            throw new Error(result.error || 'Processing failed');
          }

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

  const processSingleFile = async (filename: string) => {
    // Check if file is already completed (prevent duplicates)
    if (completedFiles.has(filename)) {
      toast({
        title: 'File already processed',
        description: `${filename} was already processed in this session`,
        variant: 'destructive'
      });
      return;
    }

    // Check if file is currently being processed
    if (processingFiles.has(filename)) {
      toast({
        title: 'File already processing',
        description: `${filename} is currently being processed`,
        variant: 'destructive'
      });
      return;
    }

    // Add file to processing set
    setProcessingFiles(prev => new Set(prev.add(filename)));

    try {
      toast({
        title: 'Processing started',
        description: `Processing ${filename}`,
      });

      const processingService = ManualProcessingService.getInstance();
      const result = await processingService.processManual(filename);

      if (result.success) {
        // Add to completed files set (auto-hide from main list)
        setCompletedFiles(prev => new Set(prev).add(filename));

        // Add to results
        setResults(prev => [
          ...prev.filter(r => r.filename !== filename),
          {
            filename,
            success: true,
            result: {
              chunks: result.chunks,
              pages: result.pages
            }
          }
        ]);

        toast({
          title: `✅ Processed ${filename}`,
          description: `${result.chunks} chunks from ${result.pages} pages (auto-hidden from list)`,
        });

        // Refresh the processed files list
        await loadFiles();
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (error) {
      console.error(`Error processing ${filename}:`, error);

      // Add error to results
      setResults(prev => [
        ...prev.filter(r => r.filename !== filename),
        {
          filename,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      ]);

      toast({
        title: `Failed to process ${filename}`,
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      // Remove file from processing set
      setProcessingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(filename);
        return newSet;
      });
    }
  };

  const processedFilenames = new Set(
    processedFiles.filter(f => f.processing_completed_at).map(f => f.filename)
  );
  
  // Filter out completed files from the main list (auto-hide functionality)
  const unprocessedFiles = storageFiles.filter(
    file => !processedFilenames.has(file.name) && !completedFiles.has(file.name)
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

            {/* Show/Hide Completed Files Toggle */}
            {completedFiles.size > 0 && (
              <Button
                onClick={() => setShowCompleted(!showCompleted)}
                variant="outline"
                size="sm"
              >
                {showCompleted ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide Completed
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Show Completed ({completedFiles.size})
                  </>
                )}
              </Button>
            )}
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
                    <div className="flex items-center gap-2">
                      <span className="flex-1">{file.name}</span>
                      <Badge variant="secondary">
                        {formatFileSize(file.metadata?.size)}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => processSingleFile(file.name)}
                      disabled={processingFiles.has(file.name) || processing}
                    >
                      {processingFiles.has(file.name) ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Process
                        </>
                      )}
                    </Button>
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

          {/* Completed Files (when toggle is enabled) */}
          {showCompleted && completedFiles.size > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✅ Completed Files (Auto-Hidden):</h4>
              <div className="space-y-1">
                {Array.from(completedFiles).map(filename => {
                  const result = results.find(r => r.filename === filename && r.success);
                  return (
                    <div key={filename} className="flex items-center justify-between text-sm border border-green-200 rounded p-2 bg-green-50">
                      <span className="text-green-800">{filename}</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {result?.result && (
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            {result.result.chunks} chunks from {result.result.pages} pages
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
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