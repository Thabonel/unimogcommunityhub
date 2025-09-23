import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { DirectChunkService } from '@/services/manuals/directChunkService';
import { toast } from '@/hooks/use-toast';

export function DirectChunkInserter() {
  const [inserting, setInserting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; chunksInserted: number } | null>(null);

  const handleInsertChunks = async () => {
    setInserting(true);
    setResult(null);

    try {
      // Check if chunks already exist
      const existingCount = await DirectChunkService.checkExistingChunks();

      if (existingCount > 0) {
        toast({
          title: "Chunks Already Exist",
          description: `Found ${existingCount} existing chunks for U1700L-U435 manual`,
          variant: "default",
        });
        setResult({
          success: true,
          message: `U1700L-U435 manual already processed with ${existingCount} chunks`,
          chunksInserted: existingCount
        });
        setInserting(false);
        return;
      }

      // Insert chunks
      const insertResult = await DirectChunkService.insertU1700LChunks();
      setResult(insertResult);

      if (insertResult.success) {
        toast({
          title: "✅ Manual Chunks Inserted",
          description: `Successfully added ${insertResult.chunksInserted} chunks for Barry AI`,
        });
      } else {
        toast({
          title: "❌ Insertion Failed",
          description: insertResult.message,
          variant: "destructive",
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResult({
        success: false,
        message: errorMessage,
        chunksInserted: 0
      });

      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setInserting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          U1700L-U435 Manual Direct Chunking
        </CardTitle>
        <CardDescription>
          Insert comprehensive manual chunks directly into the database for Barry AI to search
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">What this does:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Creates 15+ comprehensive manual chunks covering all major systems</li>
            <li>• Includes engine specs, hydraulic procedures, troubleshooting guides</li>
            <li>• Makes content searchable by Barry AI for technical assistance</li>
            <li>• Covers U1700L chassis and U435 implement carrier</li>
          </ul>
        </div>

        <Button
          onClick={handleInsertChunks}
          disabled={inserting}
          className="w-full"
          size="lg"
        >
          {inserting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inserting Manual Chunks...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Insert U1700L-U435 Manual Chunks
            </>
          )}
        </Button>

        {result && (
          <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
              {result.message}
              {result.success && result.chunksInserted > 0 && (
                <div className="mt-2 text-sm">
                  <strong>Chunks inserted:</strong> {result.chunksInserted}
                  <br />
                  <strong>Status:</strong> Ready for Barry AI search
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Manual:</strong> U1700L-U435-Workshop-Manual-Volume-1.pdf</p>
          <p><strong>Content:</strong> Engine (OM906LA), Transmission, Portal Axles, Hydraulics, Troubleshooting</p>
          <p><strong>File Size:</strong> 150MB+ comprehensive workshop manual</p>
        </div>
      </CardContent>
    </Card>
  );
}