import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2 } from 'lucide-react';

interface UnimogOwnerBadgeProps {
  model?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const UnimogOwnerBadge = ({
  model,
  size = 'sm',
  className = ''
}: UnimogOwnerBadgeProps) => {
  if (!model) return null;

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1'
  };

  const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="secondary"
          className={`${sizeClasses[size]} bg-military-green/10 text-military-green border-military-green/20 hover:bg-military-green/20 font-medium ${className}`}
        >
          <CheckCircle2 className={`${iconSize} mr-0.5`} />
          {model}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>Verified {model} Owner</p>
      </TooltipContent>
    </Tooltip>
  );
};
