import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ManualProcessingTrigger } from '@/components/admin/ManualProcessingTrigger';
import { ProcessedManualsTable } from '@/components/manuals/ProcessedManualsTable';
import { PendingManualsTable } from '@/components/admin/PendingManualsTable';
import { ManualUploadDialog } from '@/components/manuals/ManualUploadDialog';
import { Button } from '@/components/ui/button';
import { Upload, Settings, FileText, Database, Clock, CheckCircle } from 'lucide-react';
import { ProcessedManual } from '@/services/manuals/manualProcessingService';

export function ManualProcessingPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedManual, setSelectedManual] = useState<ProcessedManual | null>(null);

  const handleUploadComplete = (upload: any) => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Manual uploaded for approval:', upload);
  };

  const handleManualSelect = (manual: ProcessedManual) => {
    setSelectedManual(manual);
    console.log('Manual selected:', manual);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manual Processing Administration</h1>
          <p className="text-gray-600 mt-2">
            Manage PDF manuals for Barry AI's knowledge base
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Manual
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Approval
          </TabsTrigger>
          <TabsTrigger value="processed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Processed Manuals
          </TabsTrigger>
          <TabsTrigger value="trigger" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Process Existing
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Manual Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Pending Manual Approvals</h2>
              <Button
                variant="outline"
                onClick={() => setRefreshTrigger(prev => prev + 1)}
              >
                Refresh
              </Button>
            </div>
            <PendingManualsTable refreshTrigger={refreshTrigger} />
          </div>
        </TabsContent>

        <TabsContent value="processed">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Processed Manuals</h2>
              <Button
                variant="outline"
                onClick={() => setRefreshTrigger(prev => prev + 1)}
              >
                Refresh
              </Button>
            </div>
            <ProcessedManualsTable 
              refreshTrigger={refreshTrigger}
              onManualSelect={handleManualSelect}
            />
          </div>
        </TabsContent>

        <TabsContent value="trigger">
          <ManualProcessingTrigger />
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-4">
            {selectedManual ? (
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">{selectedManual.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Basic Information</h3>
                    <div className="space-y-1 text-sm">
                      <div><strong>Filename:</strong> {selectedManual.filename}</div>
                      <div><strong>Category:</strong> {selectedManual.category}</div>
                      <div><strong>Pages:</strong> {selectedManual.pageCount}</div>
                      <div><strong>Chunks:</strong> {selectedManual.chunkCount}</div>
                      <div><strong>File Size:</strong> {(selectedManual.fileSize / 1024 / 1024).toFixed(2)} MB</div>
                      {selectedManual.yearRange && (
                        <div><strong>Year Range:</strong> {selectedManual.yearRange}</div>
                      )}
                      <div><strong>Processed:</strong> {new Date(selectedManual.processedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Model Codes</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedManual.modelCodes.length > 0 ? (
                        selectedManual.modelCodes.map(code => (
                          <span key={code} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {code}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No model codes detected</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a manual from the "Processed Manuals" tab to view details</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ManualUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}