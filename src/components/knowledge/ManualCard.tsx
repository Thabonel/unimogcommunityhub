
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { StorageManual } from "@/types/manuals";
import { useTranslation } from 'react-i18next';

interface ManualCardProps {
  manual: StorageManual;
  onView: (fileName: string) => void;
  onDelete?: (manual: StorageManual) => void;
  isAdmin?: boolean;
}

export function ManualCard({ manual, onView, onDelete, isAdmin = false }: ManualCardProps) {
  const { t } = useTranslation('knowledge');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    if (!bytes || isNaN(bytes)) return t('manuals.unknown');
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
      <CardHeader className="pb-2 p-3">
        <CardTitle className="text-xs font-medium leading-tight line-clamp-2 min-h-[2rem]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-3 pt-0">
        <div className="grid grid-cols-2 gap-1 text-xs mb-2">
          <div>
            <p className="text-muted-foreground text-xs">{t('manuals.pages')}</p>
            <p className="font-medium text-xs">{manual.metadata?.pages || t('manuals.unknown')}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{t('manuals.size')}</p>
            <p className="font-medium text-xs">{formatFileSize(fileSize)}</p>
          </div>
        </div>
        <div className="flex gap-1 mt-auto">
          <Button
            size="sm"
            className="flex-1 text-xs h-7"
            onClick={() => onView(manual.name)}
          >
            <Eye size={12} className="mr-1" />
            {t('manuals.view_pdf')}
          </Button>
          {isAdmin && onDelete && (
            <Button
              size="sm"
              variant="outline"
              className="flex-none text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
              onClick={() => onDelete(manual)}
            >
              <Trash2 size={12} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
