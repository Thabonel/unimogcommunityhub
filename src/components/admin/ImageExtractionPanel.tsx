import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase-client';
import { ImageExtractionService } from '@/services/manuals/imageExtractionService';
import {
  Image as ImageIcon,
  Play,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Database,
  FileImage,
  Zap
} from 'lucide-react';

interface ExtractionResult {
  success: boolean;
  manualName: string;
  totalImages: number;
  errors?: string[];
}

export function ImageExtractionPanel() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResults, setExtractionResults] = useState<ExtractionResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentManual, setCurrentManual] = useState<string>('');

  const imageService = ImageExtractionService.getInstance();

  const availableManuals = [
    { name: 'U1700L-U435-Workshop-Manual-Volume-1.pdf', title: '🚜 Unimog U1700L/U435 Workshop Manual Vol.1', pages: 200, manualId: 'U435-WM1' },
    { name: 'unimog-435-test-manual.pdf', title: 'Test: Unimog 435 Manual', pages: 3, manualId: 'test-017' },
    { name: 'Unimog-435-Maintenance-Manual.pdf', title: 'Unimog 435 - Maintenance Manual', pages: 132, manualId: '017' },
    { name: 'Unimog-Engine-OM352-Workshop-Manual.pdf', title: 'Unimog Engine OM352 - Workshop Manual', pages: 137, manualId: '020' },
    { name: 'Unimog-Electrical-Systems-Technical-Reference.pdf', title: 'Unimog Electrical Systems - Technical Reference', pages: 148, manualId: '026' },
    { name: 'Unimog-U-300-Operating-Manual.pdf', title: 'Unimog U 300 - Operating Manual', pages: 146, manualId: '001' },
    { name: 'Unimog-Parts-Catalog-U-400-Series.pdf', title: 'Unimog Parts Catalog - U 400 Series', pages: 162, manualId: '031' }
  ];

  const extractImagesFromManual = async (manualName: string) => {
    try {
      setIsExtracting(true);
      setCurrentManual(manualName);
      setProgress(0);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      // Call the image extraction service
      const result = await imageService.extractImagesFromManual(manualName);

      clearInterval(progressInterval);
      setProgress(100);

      setExtractionResults(prev => [...prev, result]);

      setTimeout(() => {
        setIsExtracting(false);
        setCurrentManual('');
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error extracting images:', error);
      setExtractionResults(prev => [...prev, {
        success: false,
        manualName,
        totalImages: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }]);
      setIsExtracting(false);
      setCurrentManual('');
      setProgress(0);
    }
  };

  const extractImagesViaEdgeFunction = async (manualName: string) => {
    try {
      setIsExtracting(true);
      setCurrentManual(manualName);
      setProgress(20);

      // Call the Edge Function for server-side processing
      const { data, error } = await supabase.functions.invoke('extract-manual-images', {
        body: { manualName }
      });

      setProgress(80);

      if (error) {
        throw new Error(error.message);
      }

      setProgress(100);

      setExtractionResults(prev => [...prev, {
        success: data.success,
        manualName: data.manualName,
        totalImages: data.totalImages,
        errors: data.errors
      }]);

      setTimeout(() => {
        setIsExtracting(false);
        setCurrentManual('');
        setProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error with Edge Function:', error);
      setExtractionResults(prev => [...prev, {
        success: false,
        manualName,
        totalImages: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }]);
      setIsExtracting(false);
      setCurrentManual('');
      setProgress(0);
    }
  };

  const clearResults = () => {
    setExtractionResults([]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Manual Image Extraction
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Extract images, diagrams, and schematics from PDF manuals for Barry AI visual assistance.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Available Manuals */}
          <div className="grid gap-3">
            <h3 className="font-semibold text-sm">Available Manuals</h3>
            {availableManuals.map((manual) => (
              <div
                key={manual.name}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileImage className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">{manual.title}</p>
                    <p className="text-xs text-muted-foreground">
                      ID: {manual.manualId} • {manual.pages} pages • {manual.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => extractImagesFromManual(manual.name)}
                    disabled={isExtracting}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Client Extract
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => extractImagesViaEdgeFunction(manual.name)}
                    disabled={isExtracting}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Server Extract
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Extraction Progress */}
          {isExtracting && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>Extracting images from {currentManual}...</p>
                  <Progress value={progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    {progress < 30 && "Downloading and analyzing PDF..."}
                    {progress >= 30 && progress < 60 && "Processing pages and detecting images..."}
                    {progress >= 60 && progress < 90 && "Extracting and uploading images..."}
                    {progress >= 90 && "Finalizing and saving metadata..."}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Extraction Results */}
          {extractionResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Extraction Results</h3>
                <Button size="sm" variant="outline" onClick={clearResults}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>

              {extractionResults.map((result, index) => (
                <Alert
                  key={index}
                  className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}
                >
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{result.manualName}</span>
                        <Badge variant={result.success ? 'default' : 'destructive'}>
                          {result.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>

                      {result.success ? (
                        <p className="text-sm">
                          Successfully extracted <strong>{result.totalImages} images</strong> and saved to database.
                        </p>
                      ) : (
                        <div className="text-sm space-y-1">
                          <p>Extraction failed:</p>
                          {result.errors?.map((error, idx) => (
                            <p key={idx} className="text-red-600 ml-2">• {error}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Setup Status */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">🚧 Setup Required:</p>
                <ol className="text-sm space-y-1 ml-2">
                  <li>1. Run the SQL setup script: <code>setup-manual-storage.sql</code></li>
                  <li>2. Create a test PDF using: <code>create-test-pdf.html</code></li>
                  <li>3. Upload the test PDF to the 'manuals' bucket in Supabase</li>
                  <li>4. Use the extraction buttons below to process the PDF</li>
                  <li>5. Check the 'manual_images' table for extracted images</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          {/* Usage Instructions */}
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">How it works:</p>
                <ul className="text-sm space-y-1 ml-2">
                  <li>• <strong>Client Extract:</strong> Process PDF in browser (good for testing)</li>
                  <li>• <strong>Server Extract:</strong> Process via Edge Function (recommended for production)</li>
                  <li>• Images are stored in the 'manual-images' bucket</li>
                  <li>• Metadata is saved to 'manual_images' table</li>
                  <li>• Barry AI will automatically reference relevant images in responses</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

export default ImageExtractionPanel;