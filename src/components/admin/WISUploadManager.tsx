import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WISService } from '@/services/wisService';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const WISUploadManager = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('manuals');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string; status: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const results = [];

    for (const file of Array.from(files)) {
      try {
        const result = await WISService.uploadManual(file, selectedCategory as any);
        
        if (result.success) {
          results.push({ name: file.name, status: 'success' });
          toast({
            title: 'File uploaded',
            description: `${file.name} uploaded successfully`,
          });
        } else {
          results.push({ name: file.name, status: 'error' });
          toast({
            title: 'Upload failed',
            description: `Failed to upload ${file.name}`,
            variant: 'destructive',
          });
        }
      } catch (error) {
        results.push({ name: file.name, status: 'error' });
        console.error('Upload error:', error);
      }
    }

    setUploadedFiles(results);
    setUploading(false);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSampleDataUpload = async () => {
    setUploading(true);
    
    // List of sample files from external drive
    const sampleFiles = [
      { path: '/Volumes/UnimogManuals/wis-samples/manuals/unimog_400_oil_change.html', category: 'manuals' },
      { path: '/Volumes/UnimogManuals/wis-samples/parts/unimog_portal_axle_parts.json', category: 'parts' },
      { path: '/Volumes/UnimogManuals/wis-samples/bulletins/tsb_2020_001_portal_axle.html', category: 'bulletins' }
    ];

    for (const file of sampleFiles) {
      const result = await WISService.uploadSampleFile(file.path, file.category);
      
      if (result.success) {
        toast({
          title: 'Sample ready',
          description: result.message,
        });
      }
    }

    toast({
      title: 'Sample data prepared',
      description: 'Sample WIS data is ready for testing. Please manually upload the files from /Volumes/UnimogManuals/wis-samples/',
      duration: 10000,
    });

    setUploading(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>WIS Manual Upload Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Document Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manuals">Service Manuals</SelectItem>
                <SelectItem value="parts">Parts Catalogs</SelectItem>
                <SelectItem value="bulletins">Technical Bulletins</SelectItem>
                <SelectItem value="wiring">Wiring Diagrams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>Upload Files</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.html,.json,.jpg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-military-green hover:bg-military-green/90"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span className="ml-2">Select Files</span>
              </Button>
            </div>
          </div>

          {/* Sample Data Upload */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Quick Start with Sample Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload the sample WIS files from your external drive to test the system
            </p>
            <Button 
              onClick={handleSampleDataUpload}
              disabled={uploading}
              variant="outline"
              className="w-full"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Prepare Sample Data Upload
            </Button>
          </div>

          {/* Upload Status */}
          {uploadedFiles.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Upload Results</h3>
              <div className="space-y-1">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {file.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className={file.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-sand-beige/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Upload Instructions:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Select the appropriate category for your documents</li>
              <li>Choose files to upload (PDF, HTML, or images)</li>
              <li>Files will be securely stored in Supabase</li>
              <li>Maximum file size: 50MB per file</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* External Drive Status */}
      <Card>
        <CardHeader>
          <CardTitle>External Drive Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p className="font-medium">Sample files location:</p>
            <code className="block bg-gray-100 p-2 rounded">/Volumes/UnimogManuals/wis-samples/</code>
            <div className="space-y-1 mt-3">
              <p>✅ unimog_400_oil_change.html</p>
              <p>✅ unimog_portal_axle_parts.json</p>
              <p>✅ tsb_2020_001_portal_axle.html</p>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              These files are safe samples that won't crash your system
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WISUploadManager;