import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Trash2, 
  Download, 
  Eye,
  Calendar,
  Hash,
  FileCheck,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { 
  manualProcessingService,
  ProcessedManual 
} from '@/services/manuals/manualProcessingService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/lib/supabase-client';

interface ProcessedManualsTableProps {
  refreshTrigger?: number;
  onManualSelect?: (manual: ProcessedManual) => void;
}

export function ProcessedManualsTable({ 
  refreshTrigger, 
  onManualSelect 
}: ProcessedManualsTableProps) {
  const [manuals, setManuals] = useState<ProcessedManual[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ProcessedManual | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadManuals = async () => {
    setLoading(true);
    try {
      const processedManuals = await manualProcessingService.getProcessedManuals();
      setManuals(processedManuals);
    } catch (error) {
      console.error('Error loading manuals:', error);
      toast({
        title: 'Error loading manuals',
        description: 'Could not fetch processed manuals',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManuals();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    setDeleting(true);
    try {
      const success = await manualProcessingService.deleteProcessedManual(deleteTarget.id);
      if (success) {
        setManuals(manuals.filter(m => m.id !== deleteTarget.id));
        toast({
          title: 'Manual deleted',
          description: 'The manual and its chunks have been removed',
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: 'Could not delete the manual',
        variant: 'destructive'
      });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleDownload = async (manual: ProcessedManual) => {
    try {
      const { data, error } = await supabase.storage
        .from('manuals')
        .download(manual.filename);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = manual.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'Could not download the manual',
        variant: 'destructive'
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      operator: 'bg-blue-100 text-blue-800',
      service: 'bg-green-100 text-green-800',
      parts: 'bg-purple-100 text-purple-800',
      workshop: 'bg-orange-100 text-orange-800',
      technical: 'bg-cyan-100 text-cyan-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      electrical: 'bg-red-100 text-red-800',
      hydraulic: 'bg-indigo-100 text-indigo-800',
      engine: 'bg-pink-100 text-pink-800',
      transmission: 'bg-teal-100 text-teal-800',
      drivetrain: 'bg-lime-100 text-lime-800',
      troubleshooting: 'bg-amber-100 text-amber-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (manuals.length === 0) {
    return (
      <div className="text-center p-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No processed manuals found</p>
        <p className="text-sm text-gray-400 mt-2">
          Upload a PDF manual to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>
          {manuals.length} processed manual{manuals.length !== 1 ? 's' : ''} available for Barry AI
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Models</TableHead>
            <TableHead className="text-center">Pages</TableHead>
            <TableHead className="text-center">Chunks</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Processed</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manuals.map((manual) => (
            <TableRow 
              key={manual.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onManualSelect?.(manual)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-green-600" />
                  <span>{manual.title}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={getCategoryColor(manual.category)}
                >
                  {manual.category}
                </Badge>
              </TableCell>
              <TableCell>
                {manual.modelCodes.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {manual.modelCodes.slice(0, 3).map(code => (
                      <Badge key={code} variant="outline" className="text-xs">
                        {code}
                      </Badge>
                    ))}
                    {manual.modelCodes.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{manual.modelCodes.length - 3}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <FileText className="h-3 w-3" />
                  {manual.pageCount}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Hash className="h-3 w-3" />
                  {manual.chunkCount}
                </div>
              </TableCell>
              <TableCell>
                {formatFileSize(manual.fileSize)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  {manual.processedAt ? 
                    format(new Date(manual.processedAt), 'MMM d, yyyy') : 
                    'Not processed'
                  }
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(manual)}
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onManualSelect?.(manual)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleteTarget(manual)}
                    title="Delete Manual"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Manual</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.title}"? 
              This will permanently remove the manual and all {deleteTarget?.chunkCount} indexed chunks.
              Barry AI will no longer be able to reference this manual.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Manual'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}