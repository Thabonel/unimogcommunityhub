import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessedManualsTable } from '@/components/manuals/ProcessedManualsTable';
import { ManualUploadDialog } from '@/components/manuals/ManualUploadDialog';
import { ManualDetailsEditorFixed } from '@/components/admin/ManualDetailsEditorFixed';
import { Button } from '@/components/ui/button';
import { Upload, FileText, CheckCircle, Edit } from 'lucide-react';
import { ProcessedManual } from '@/services/manuals/manualProcessingService';

export function ManualProcessingPageClean() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedManual, setSelectedManual] = useState<ProcessedManual | null>(null);

  const handleUploadComplete = (upload: any) => {
    setRefreshTrigger(prev => prev + 1);
    console.log('Manual uploaded:', upload);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manual Management</h1>
          <p className="text-gray-600 mt-2">
            Upload and manage vehicle manuals for the community and Barry AI
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Manual
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manuals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manuals" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Vehicle Manuals
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Manual Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manuals">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Vehicle Manuals</h2>
                <p className="text-gray-600 mt-1">
                  Browse and download technical manuals. All manuals are fully processed and searchable through Barry AI.
                </p>
              </div>
            </div>
            <ProcessedManualsTable refreshTrigger={refreshTrigger} />
          </div>
        </TabsContent>

        <TabsContent value="editor">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Edit Manual Details</h2>
                <p className="text-gray-600 mt-1">
                  Edit manual metadata including titles, descriptions, model codes, and categories
                </p>
              </div>
            </div>
            <ManualDetailsEditorFixed />
          </div>
        </TabsContent>
      </Tabs>

      <ManualUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}

export default ManualProcessingPageClean;