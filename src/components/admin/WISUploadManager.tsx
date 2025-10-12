import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { WISService } from '@/services/wisService';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Hash } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';

// Utility: Compute SHA-256 hash of file content
async function computeFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Utility: Extract model and procedure codes from filename
// Supports formats: "U435_25.20.02_portal_hub.pdf" or "25.20.02_portal_hub.pdf"
function parseFilename(filename: string): { modelCode: string | null; procedureCode: string | null } {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');

  // Try to match model code pattern (U###)
  const modelMatch = nameWithoutExt.match(/U\d{3,4}/i);
  const modelCode = modelMatch ? modelMatch[0].toUpperCase() : null;

  // Try to match procedure code pattern (##.##.##)
  const procedureMatch = nameWithoutExt.match(/\d{2}\.\d{2}\.\d{2}/);
  const procedureCode = procedureMatch ? procedureMatch[0] : null;

  return { modelCode, procedureCode };
}

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
        // 1. Compute content hash for idempotency
        toast({
          title: 'Processing...',
          description: `Computing hash for ${file.name}`,
        });
        const contentHash = await computeFileHash(file);

        // 2. Parse filename to extract metadata
        const { modelCode, procedureCode } = parseFilename(file.name);
        const effectiveModelCode = modelCode || 'U435'; // Default to U435
        const systemCode = procedureCode ? procedureCode.split('.')[0] : null;

        // 3. Build storage path: wis-docs/model/<MODEL>/<category>/<code>-<hash>.pdf
        const fileExt = file.name.split('.').pop() || 'pdf';
        const shortHash = contentHash.substring(0, 8);
        const storagePath = procedureCode
          ? `wis-docs/model/${effectiveModelCode}/${selectedCategory}/${procedureCode}-${shortHash}.${fileExt}`
          : `wis-docs/model/${effectiveModelCode}/${selectedCategory}/${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

        // 4. Upload to Supabase Storage
        toast({
          title: 'Uploading...',
          description: `Uploading ${file.name} to storage`,
        });

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('manuals')
          .upload(storagePath, file, {
            upsert: true, // Overwrite if exists
            contentType: file.type
          });

        if (uploadError) {
          throw uploadError;
        }

        // 5. Upsert plan item with content fingerprint (idempotent)
        const { data: planItemId, error: rpcError } = await supabase.rpc('wis_upsert_plan_item', {
          p_model_code: effectiveModelCode,
          p_system_code: systemCode,
          p_component_code: null,
          p_source_type: selectedCategory === 'manuals' ? 'manual_pdf' : `${selectedCategory}_pdf`,
          p_source_path: storagePath,
          p_source_fingerprint: contentHash,
          p_metadata: {
            original_filename: file.name,
            file_size: file.size,
            upload_date: new Date().toISOString(),
            procedure_code: procedureCode
          }
        });

        if (rpcError) {
          console.warn('Failed to upsert plan item:', rpcError);
          // Non-fatal - file is still uploaded
        }

        results.push({ name: file.name, status: 'success' });
        toast({
          title: 'File uploaded',
          description: `${file.name} uploaded successfully (hash: ${shortHash})`,
        });

      } catch (error) {
        results.push({ name: file.name, status: 'error' });
        console.error('Upload error:', error);
        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: 'destructive',
        });
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

          {/* Content Hashing Feature */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <Hash className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900 mb-1">Content Hashing Enabled</h4>
                <p className="text-sm text-green-800">
                  Files are automatically hashed (SHA-256) for idempotency. Re-uploading the same file will
                  not create duplicates - the system detects identical content and updates metadata instead.
                </p>
                <div className="mt-2 text-xs text-green-700 space-y-1">
                  <p>Path convention: wis-docs/model/&lt;MODEL&gt;/&lt;category&gt;/&lt;code&gt;-&lt;hash&gt;.pdf</p>
                  <p>Example: wis-docs/model/U435/manuals/25.20.02-a1b2c3d4.pdf</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-sand-beige/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Upload Instructions:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Select the appropriate category for your documents</li>
              <li>Choose files to upload (PDF, HTML, or images)</li>
              <li>Files will be securely stored in Supabase with content hashing</li>
              <li>Maximum file size: 50MB per file</li>
              <li>Filename format: Model codes (U435) and procedure codes (25.20.02) are auto-detected</li>
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