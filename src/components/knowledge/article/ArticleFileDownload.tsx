
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ArticleFileDownloadProps {
  originalFileUrl: string | undefined;
  handleFileDownload: () => void;
}

export function ArticleFileDownload({ originalFileUrl, handleFileDownload }: ArticleFileDownloadProps) {
  if (!originalFileUrl) return null;
  
  return (
    <div className="mb-6 flex items-center justify-between p-4 border rounded-md bg-secondary/10">
      <div className="flex items-center">
        <FileText className="mr-3 text-primary" />
        <span>Original document available</span>
      </div>
      <Button onClick={handleFileDownload} variant="outline" size="sm" className="flex items-center gap-1">
        <Download size={16} />
        <span>View Original</span>
      </Button>
    </div>
  );
}
