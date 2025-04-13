
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, XCircle, UserCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PendingManual } from "@/types/manuals";

interface PendingManualsListProps {
  pendingManuals: PendingManual[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function PendingManualsList({ 
  pendingManuals, 
  onApprove, 
  onReject 
}: PendingManualsListProps) {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setIsProcessing(id);
    // Simulate API call
    setTimeout(() => {
      onApprove(id);
      toast({
        title: "Manual approved",
        description: "The manual is now visible to all users",
      });
      setIsProcessing(null);
    }, 800);
  };

  const handleReject = (id: string) => {
    setIsProcessing(id);
    // Simulate API call
    setTimeout(() => {
      onReject(id);
      toast({
        title: "Manual rejected",
        description: "The manual has been rejected",
      });
      setIsProcessing(null);
    }, 800);
  };

  if (pendingManuals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No pending manuals to review
      </div>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'Unknown date';
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return 'Unknown size';
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {pendingManuals.map((manual) => (
        <Card key={manual.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1">{manual.title}</CardTitle>
                <CardDescription className="mt-1">{formatFileSize(manual.size)}</CardDescription>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Pending Review
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">{manual.description}</p>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <UserCircle size={14} />
              <span>Submitted by {manual.submitter_name || manual.submittedBy || 'Anonymous'} on {formatDate(manual.created_at || manual.submittedAt)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleReject(manual.id)}
              disabled={isProcessing !== null}
              className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <XCircle size={16} />
              Reject
            </Button>
            <Button 
              onClick={() => handleApprove(manual.id)}
              disabled={isProcessing !== null}
              className="gap-1"
            >
              <CheckCircle size={16} />
              Approve
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
