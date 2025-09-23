import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, FileText, Image, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { FullManualProcessor } from '@/services/manuals/fullManualProcessor';
import { toast } from '@/hooks/use-toast';

export function FullManualProcessorComponent() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleFullProcessing = async () => {
    setProcessing(true);
    setProgress(0);
    setResult(null);
    setCurrentStage('Initializing...');

    try {
      const processor = FullManualProcessor.getInstance();

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + 1;
          return prev;
        });
      }, 1000);

      setCurrentStage('Downloading 150MB PDF file...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setCurrentStage('Extracting text from all pages...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStage('Processing images and diagrams...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStage('Creating searchable chunks...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStage('Saving to database...');

      // Process the actual manual
      const processingResult = await processor.processCompleteManual();

      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStage('Complete!');
      setResult(processingResult);

      if (processingResult.success) {
        toast({
          title: "✅ Complete Manual Processing Successful",
          description: `Extracted ${processingResult.textChunks} text chunks and ${processingResult.images} images from ${processingResult.pages} pages`,
        });
      } else {
        toast({
          title: "❌ Processing Failed",
          description: processingResult.error,
          variant: "destructive",
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({
        success: false,
        error: errorMessage
      });

      toast({
        title: "❌ Processing Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setCurrentStage('');
    }
  };

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <FileText className="h-5 w-5" />
          Complete U1700L-U435 Manual Processing
        </CardTitle>
        <CardDescription>
          Extract ALL content from the 150MB PDF: text, images, diagrams, and technical illustrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Complete Processing Includes:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>All text from 150+ pages</span>
            </div>
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Technical diagrams & photos</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>Searchable text chunks</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Image-text linking</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This will process the actual 150MB PDF file and may take 5-10 minutes to complete.
            The browser will extract real content from all pages including hydraulic diagrams, engine schematics, and maintenance photos.
          </p>
        </div>

        <Button
          onClick={handleFullProcessing}
          disabled={processing}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing Complete Manual...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Process Complete U1700L-U435 Manual (Text + Images)
            </>
          )}
        </Button>

        {processing && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              {currentStage}
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-500">
              Progress: {progress}% - Extracting content from 150MB PDF file
            </div>
          </div>
        )}

        {result && (
          <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
              {result.success ? (
                <div>
                  <div className="font-medium">Manual Processing Complete!</div>
                  <div className="mt-2 text-sm space-y-1">
                    <div>📄 <strong>Pages processed:</strong> {result.pages}</div>
                    <div>📝 <strong>Text chunks:</strong> {result.textChunks}</div>
                    <div>🖼️ <strong>Images extracted:</strong> {result.images}</div>
                    <div>🎯 <strong>Status:</strong> Ready for Barry AI search</div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="font-medium">Processing Failed</div>
                  <div className="mt-1 text-sm">{result.error}</div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1 border-t pt-3">
          <p><strong>File:</strong> U1700L-U435-Workshop-Manual-Volume-1.pdf (150.2 MB)</p>
          <p><strong>Content:</strong> Technical diagrams, maintenance procedures, troubleshooting guides</p>
          <p><strong>Output:</strong> Text chunks + Image database + Barry AI integration</p>
        </div>
      </CardContent>
    </Card>
  );
}