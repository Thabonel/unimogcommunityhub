import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, PlayCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export function RealManualProcessor() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const processManualWithRealText = async (filename: string) => {
    try {
      console.log(`Starting real processing for ${filename}`);

      // Download the PDF
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('manuals')
        .download(filename);

      if (downloadError || !fileData) {
        throw new Error(`Download failed: ${downloadError?.message}`);
      }

      // Convert to array buffer
      const arrayBuffer = await fileData.arrayBuffer();

      // Load PDF
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      // Extract text from all pages
      const chunks: any[] = [];
      let totalText = '';

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (pageText.length > 0) {
          totalText += pageText + ' ';

          // Create chunks from page text
          const maxChunkSize = 1500;
          const words = pageText.split(' ');
          let currentChunk = '';

          for (const word of words) {
            if ((currentChunk + ' ' + word).length > maxChunkSize) {
              if (currentChunk) {
                chunks.push({
                  manual_filename: filename,
                  chunk_index: chunks.length,
                  page_number: pageNum,
                  section_title: `Page ${pageNum} - Part ${chunks.length + 1}`,
                  content: currentChunk.trim(),
                  created_at: new Date().toISOString()
                });
              }
              currentChunk = word;
            } else {
              currentChunk += (currentChunk ? ' ' : '') + word;
            }
          }

          if (currentChunk) {
            chunks.push({
              manual_filename: filename,
              chunk_index: chunks.length,
              page_number: pageNum,
              section_title: `Page ${pageNum} - Part ${chunks.length + 1}`,
              content: currentChunk.trim(),
              created_at: new Date().toISOString()
            });
          }
        }
      }

      console.log(`Extracted ${chunks.length} chunks from ${numPages} pages`);

      // Delete old placeholder chunks
      await supabase
        .from('manual_chunks')
        .delete()
        .eq('manual_filename', filename);

      // Insert new chunks with real content
      for (let i = 0; i < chunks.length; i += 50) {
        const batch = chunks.slice(i, i + 50);
        const { error: insertError } = await supabase
          .from('manual_chunks')
          .insert(batch);

        if (insertError) {
          console.error('Chunk insert error:', insertError);
        }
      }

      // Update metadata
      await supabase
        .from('manual_metadata')
        .update({
          pages: numPages,
          chunk_count: chunks.length,
          status: 'completed',
          processing_completed_at: new Date().toISOString()
        })
        .eq('filename', filename);

      return {
        filename,
        success: true,
        pages: numPages,
        chunks: chunks.length,
        textExtracted: totalText.length
      };

    } catch (error) {
      console.error(`Error processing ${filename}:`, error);
      return {
        filename,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const startProcessing = async () => {
    setProcessing(true);
    setError('');
    setResults([]);

    try {
      // Get manuals that need real processing
      const { data: manuals } = await supabase
        .from('manual_metadata')
        .select('filename, chunk_count')
        .or('chunk_count.lte.5,chunk_count.eq.50')
        .limit(10); // Process 10 at a time

      if (!manuals || manuals.length === 0) {
        setError('No manuals need processing');
        return;
      }

      const totalManuals = manuals.length;
      const processResults = [];

      for (let i = 0; i < manuals.length; i++) {
        const manual = manuals[i];
        setCurrentFile(manual.filename);
        setProgress(((i + 1) / totalManuals) * 100);

        const result = await processManualWithRealText(manual.filename);
        processResults.push(result);
        setResults(prev => [...prev, result]);

        // Small delay between files
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const successCount = processResults.filter(r => r.success).length;
      setError(`Processed ${successCount}/${totalManuals} manuals successfully`);

    } catch (error) {
      console.error('Processing error:', error);
      setError(error instanceof Error ? error.message : 'Processing failed');
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