import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-client';
import { Loader2, Play, CheckCircle2, AlertCircle, FileText, Zap } from 'lucide-react';

interface OCRProgress {
  currentPage: number;
  totalPages: number;
  status: string;
  completedPages: number;
  failedPages: number;
}

type OCRProvider = 'unstructured' | 'marker';

export function RPSOCRProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OCRProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState<{ unprocessed: number; total: number } | null>(null);
  const [provider, setProvider] = useState<OCRProvider>('marker');

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('manual_chunks')
        .select('id, ocr_processed', { count: 'exact' })
        .eq('manual_title', 'RPS Catalog')
        .filter('metadata->>is_parts_list', 'eq', 'true');

      if (error) throw error;

      const total = data?.length || 0;
      const unprocessed = data?.filter(p => !p.ocr_processed).length || 0;

      setStats({ unprocessed, total });
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const startOCRProcessing = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setProgress({
      currentPage: 0,
      totalPages: stats?.unprocessed || 0,
      status: 'Starting OCR processing...',
      completedPages: 0,
      failedPages: 0
    });

    try {
      const functionName = provider === 'marker' ? 'process-marker-ocr' : 'process-rps-ocr';
      console.log(`Invoking ${functionName} Edge Function...`);

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { action: 'start' }
      });

      console.log('Edge Function response:', { data, error });

      if (error) {
        console.error('Edge Function error details:', error);
        throw error;
      }

      if (data.success) {
        setSuccess(true);
        setProgress({
          currentPage: data.processed,
          totalPages: data.total,
          status: 'Complete!',
          completedPages: data.processed,
          failedPages: data.failed || 0
        });
        await fetchStats();
      } else {
        throw new Error(data.error || 'OCR processing failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process RPS parts lists');
      console.error('OCR processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch stats on component mount
  useState(() => {
    fetchStats();
  });

  const progressPercent = progress
    ? (progress.completedPages / progress.totalPages) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          RPS Parts Lists OCR Processing
        </CardTitle>
        <CardDescription>
          Extract part numbers, NIIN, NSN from RPS catalog PNG images using AI-powered OCR
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OCR Provider Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">OCR Provider</label>
          <Select value={provider} onValueChange={(value) => setProvider(value as OCRProvider)} disabled={isProcessing}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marker">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Marker (Replicate)</span>
                  <Badge variant="secondary" className="ml-2">Recommended</Badge>
                </div>
              </SelectItem>
              <SelectItem value="unstructured">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Unstructured.io</span>
                  <Badge variant="outline" className="ml-2">Legacy</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {provider === 'marker' && 'Marker: Fast document-to-markdown conversion (~$0.092 per page)'}
            {provider === 'unstructured' && 'Unstructured.io: General OCR service'}
          </p>
        </div>

        {stats && (
          <Alert>
            <AlertDescription>
              <div className="flex justify-between">
                <span>Total RPS parts list pages: {stats.total}</span>
                <span className="font-semibold">
                  Unprocessed: {stats.unprocessed}
                </span>
              </div>
              {stats.unprocessed > 0 && provider === 'marker' && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Estimated cost: ${(stats.unprocessed * 0.092).toFixed(2)} for {stats.unprocessed} pages
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              OCR processing completed successfully!
              {progress && (
                <div className="mt-2 text-sm">
                  <div>Processed: {progress.completedPages} pages</div>
                  {progress.failedPages > 0 && (
                    <div>Failed: {progress.failedPages} pages</div>
                  )}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{progress.status}</span>
              <span>
                {progress.currentPage} / {progress.totalPages}
              </span>
            </div>
            <Progress value={progressPercent} />
          </div>
        )}

        <Button
          onClick={startOCRProcessing}
          disabled={isProcessing || stats?.unprocessed === 0}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing... ({progress?.currentPage} / {progress?.totalPages})
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run OCR Processing
              {stats?.unprocessed === 0 && ' (All pages processed)'}
            </>
          )}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1">
          <p>This process will:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Extract parts tables from {stats?.unprocessed || 0} PNG images</li>
            <li>Use Unstructured.io OCR for accurate table extraction</li>
            <li>Store extracted text in database for Barry to search</li>
            <li>Take approximately {Math.ceil((stats?.unprocessed || 0) / 6)} minutes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
