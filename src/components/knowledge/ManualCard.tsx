
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { StorageManual } from "@/types/manuals";

interface ManualCardProps {
  manual: StorageManual;
  onView: (fileName: string) => void;
  onDelete?: (manual: StorageManual) => void;
  isAdmin?: boolean;
}

export function ManualCard({ manual, onView, onDelete, isAdmin = false }: ManualCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (!bytes || isNaN(bytes)) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };
  
  // Handle potentially missing properties safely
  const title = manual.metadata?.title || manual.name || "Untitled Manual";
  const fileSize = manual.size || 0;
  const lastUpdated = manual.updated_at || manual.created_at || new Date().toISOString();
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium leading-tight line-clamp-3 min-h-[3rem]">{title}</CardTitle>
        <CardDescription className="text-xs mt-1">{manual.metadata?.description || 'Unimog Technical Manual'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <p className="text-muted-foreground">Pages</p>
            <p className="font-medium text-sm">{manual.metadata?.pages || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Size</p>
            <p className="font-medium text-sm">{formatFileSize(fileSize)}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Last Updated</p>
            <p className="font-medium text-sm">{new Date(lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-auto">
          <Button 
            className="flex-1 gap-2"
            onClick={() => onView(manual.name)}
          >
            <Eye size={16} />
            View PDF
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
