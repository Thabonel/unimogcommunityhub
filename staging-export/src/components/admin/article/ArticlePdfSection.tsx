
import { FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { FileUploadComponent } from "../FileUploadComponent";

interface ArticlePdfSectionProps {
  originalFileUrl: string | null;
  isSubmitting: boolean;
  onFileUploaded: (url: string, fileName: string) => void;
  onDownload: () => void;
}

export function ArticlePdfSection({ 
  originalFileUrl, 
  isSubmitting, 
  onFileUploaded, 
  onDownload 
}: ArticlePdfSectionProps) {
  return (
    <FormItem>
      <FormLabel>PDF Document</FormLabel>
      {originalFileUrl ? (
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center">
            <FileText className="mr-2 text-blue-500" />
            <span className="text-sm">Attached PDF</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No PDF attached</p>
      )}
      <FileUploadComponent 
        onFileUploaded={onFileUploaded} 
        disabled={isSubmitting} 
      />
    </FormItem>
  );
}
