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
  CheckCircle, 
  XCircle, 
  Download, 
  Eye,
  Calendar,
  FileText,
  User,
  Loader2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { 
  manualApprovalService,
  PendingManualUpload 
} from '@/services/manuals/manualApprovalService';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PendingManualsTableProps {
  refreshTrigger?: number;
}

export function PendingManualsTable({ refreshTrigger }: PendingManualsTableProps) {
  const [pendingUploads, setPendingUploads] = useState<PendingManualUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string>('');
  const [rejectTarget, setRejectTarget] = useState<PendingManualUpload | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadPendingUploads = async () => {
    setLoading(true);
    try {
      const uploads = await manualApprovalService.getPendingUploads();
      setPendingUploads(uploads);
    } catch (error) {
      console.error('Error loading pending uploads:', error);
      toast({
        title: 'Error loading pending uploads',
        description: 'Could not fetch pending manual uploads',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUploads();
  }, [refreshTrigger]);

  const handleApprove = async (upload: PendingManualUpload) => {
    setProcessingId(upload.id);
    try {
      const success = await manualApprovalService.approveManual(upload.id);
      if (success) {
        // Remove from pending list
        setPendingUploads(uploads => uploads.filter(u => u.id !== upload.id));
        toast({
          title: 'Manual approved',
          description: `"${upload.title}" has been approved and is being processed.`,
        });
      }
    } catch (error) {
      console.error('Approval error:', error);
    } finally {
      setProcessingId('');
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;

    setProcessingId(rejectTarget.id);
    try {
      const success = await manualApprovalService.rejectManual(
        rejectTarget.id, 
        rejectionReason.trim() || undefined
      );
      if (success) {
        // Remove from pending list
        setPendingUploads(uploads => uploads.filter(u => u.id !== rejectTarget.id));
        toast({
          title: 'Manual rejected',
          description: `"${rejectTarget.title}" has been rejected.`,
        });
      }
    } catch (error) {
      console.error('Rejection error:', error);
    } finally {
      setProcessingId('');
      setRejectTarget(null);
      setRejectionReason('');
    }
  };

  const handleDownload = async (upload: PendingManualUpload) => {
    await manualApprovalService.downloadPendingManual(upload.filename);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

  const pendingUploadsOnly = pendingUploads.filter(upload => upload.approval_status === 'pending');

  if (pendingUploadsOnly.length === 0) {
    return (
      <div className="text-center p-8">
        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
        <p className="text-gray-600">No pending manual approvals</p>
        <p className="text-sm text-gray-400 mt-2">
          All uploaded manuals have been reviewed
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableCaption>
          {pendingUploadsOnly.length} manual{pendingUploadsOnly.length !== 1 ? 's' : ''} pending approval
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Manual Details</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Uploader</TableHead>
            <TableHead>Models</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingUploadsOnly.map((upload) => (
            <TableRow key={upload.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{upload.title}</span>
                  </div>
                  {upload.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {upload.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-400">
                    {upload.original_filename}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={getCategoryColor(upload.category)}
                >
                  {upload.category}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {upload.uploader_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {upload.uploader_email}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                {upload.model_codes && upload.model_codes.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {upload.model_codes.slice(0, 2).map(code => (
                      <Badge key={code} variant="outline" className="text-xs">
                        {code}
                      </Badge>
                    ))}
                    {upload.model_codes.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{upload.model_codes.length - 2}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </TableCell>

              <TableCell>
                {formatFileSize(upload.file_size)}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(upload.created_at), 'MMM d, yyyy')}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(upload)}
                    title="Download and Review PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleApprove(upload)}
                    disabled={processingId === upload.id}
                    title="Approve and Process"
                    className="text-green-600 hover:text-green-700"
                  >
                    {processingId === upload.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setRejectTarget(upload)}
                    disabled={processingId === upload.id}
                    title="Reject Manual"
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Rejection Dialog */}
      <AlertDialog open={!!rejectTarget} onOpenChange={() => setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Manual</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject "{rejectTarget?.title}"? 
              This will permanently remove the upload and notify the user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain why this manual was rejected..."
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingId === rejectTarget?.id}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={processingId === rejectTarget?.id}
              className="bg-red-600 hover:bg-red-700"
            >
              {processingId === rejectTarget?.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Manual'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}