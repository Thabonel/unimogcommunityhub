import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface VerificationBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'none';
  approvedAt?: string;
  rejectionReason?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VerificationBadge({
  status,
  approvedAt,
  rejectionReason,
  showText = true,
  size = 'md',
}: VerificationBadgeProps) {
  if (status === 'none') return null;

  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5';
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  if (status === 'approved') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="default" className="bg-green-600 hover:bg-green-700 gap-1">
              <CheckCircle className={iconSize} />
              {showText && <span className={textSize}>Verified Owner</span>}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verified Unimog owner</p>
            {approvedAt && (
              <p className="text-xs text-muted-foreground">
                Approved {format(new Date(approvedAt), 'MMM d, yyyy')}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (status === 'pending') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="gap-1 text-amber-700 bg-amber-50">
              <Clock className={iconSize} />
              {showText && <span className={textSize}>Verification Pending</span>}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verification under review</p>
            <p className="text-xs text-muted-foreground">Usually completed within 48 hours</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (status === 'rejected') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive" className="gap-1">
              <XCircle className={iconSize} />
              {showText && <span className={textSize}>Verification Failed</span>}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Verification rejected</p>
            {rejectionReason && (
              <p className="text-xs text-muted-foreground mt-1">Reason: {rejectionReason}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">You can resubmit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
}
