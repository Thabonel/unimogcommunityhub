import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, PlayCircle, AlertCircle } from 'lucide-react';
import { ManualProcessingService } from '@/services/manualProcessingService';
import { toast } from '@/hooks/use-toast';

export function RealManualProcessor() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const startProcessing = async () => {
    setProcessing(true);
    setError('');
    setResults([]);

    try {
      // Use the original service to get unprocessed manuals
      const service = ManualProcessingService.getInstance();
      const unprocessedManuals = await service.getUnprocessedManuals();

      if (unprocessedManuals.length === 0) {
        setError('No manuals need processing');
        return;
      }

      toast({
        title: 'Processing started',
        description: `Found ${unprocessedManuals.length} manuals to process`,
      });

      const processResults = [];
      const totalManuals = Math.min(unprocessedManuals.length, 10); // Process max 10 at a time

      for (let i = 0; i < totalManuals; i++) {
        const manual = unprocessedManuals[i];
        setCurrentFile(manual.name);
        setProgress(((i + 1) / totalManuals) * 100);

        try {
          // Use the original service to process each manual
          const result = await service.processManual(manual.name);

          processResults.push({
            filename: manual.name,
            success: result.success,
            pages: result.pages,
            chunks: result.chunks,
            error: result.error
          });

          setResults(prev => [...prev, {
            filename: manual.name,
            success: result.success,
            pages: result.pages,
            chunks: result.chunks,
            error: result.error
          }]);

          if (result.success) {
            toast({
              title: `✅ Processed ${manual.name}`,
              description: `${result.chunks} chunks from ${result.pages} pages`,
            });
          } else {
            toast({
              title: `❌ Failed: ${manual.name}`,
              description: result.error,
              variant: 'destructive'
            });
          }

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          processResults.push({
            filename: manual.name,
            success: false,
            error: errorMessage
          });

          setResults(prev => [...prev, {
            filename: manual.name,
            success: false,
            error: errorMessage
          }]);

          toast({
            title: `❌ Failed: ${manual.name}`,
            description: errorMessage,
            variant: 'destructive'
          });
        }

        // Small delay between files to avoid overwhelming the system
        if (i < totalManuals - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      const successCount = processResults.filter(r => r.success).length;
      const failCount = processResults.filter(r => !r.success).length;

      setError(`Completed: ${successCount} successful, ${failCount} failed`);

      toast({
        title: 'Processing complete',
        description: `${successCount} processed successfully, ${failCount} failed`,
        variant: failCount > 0 ? 'destructive' : 'default'
      });

    } catch (error) {
      console.error('Processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      setError(errorMessage);

      toast({
        title: 'Processing failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
      setCurrentFile('');
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real Manual Text Extraction</CardTitle>
        <CardDescription>
          Extract actual text content from PDF manuals to replace placeholder chunks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={startProcessing}
          disabled={processing}
          className="w-full"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Real Text Extraction
            </>
          )}
        </Button>

        {processing && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Processing: {currentFile}
            </div>
            <Progress value={progress} />
          </div>
        )}

        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Results:</h4>
            {results.map((result, idx) => (
              <div key={idx} className="text-sm">
                {result.success ? '✅' : '❌'} {result.filename}
                {result.success && (
                  <span className="text-gray-500 ml-2">
                    {result.pages} pages → {result.chunks} chunks
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}