
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Eye, Trash2 } from "lucide-react";
import { StorageManual } from "@/types/manuals";

interface ManualCardProps {
  manual: StorageManual;
  onView: (fileName: string) => void;
  onDownload: (fileName: string, title: string) => void;
  onDelete?: (manual: StorageManual) => void;
  isAdmin?: boolean;
}

export function ManualCard({ manual, onView, onDownload, onDelete, isAdmin = false }: ManualCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="line-clamp-2">{manual.metadata?.title || manual.name}</CardTitle>
        <CardDescription>{manual.metadata?.description || 'Unimog Manual'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div>
            <p className="text-muted-foreground">Pages</p>
            <p className="font-medium">{manual.metadata?.pages || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Size</p>
            <p className="font-medium">{formatFileSize(manual.size)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium">{new Date(manual.updated_at || manual.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button 
            className="flex-1 gap-2"
            variant="outline"
            onClick={() => onView(manual.name)}
          >
            <Eye size={16} />
            View
          </Button>
          <Button 
            className="flex-1 gap-2"
            onClick={() => onDownload(manual.name, manual.metadata?.title || manual.name)}
          >
            <Download size={16} />
            Download
          </Button>
          {isAdmin && onDelete && (
            <Button
              variant="outline"
              className="flex-none text-destructive hover:text-destructive hover:bg-destructive/10" 
              onClick={() => onDelete(manual)}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
