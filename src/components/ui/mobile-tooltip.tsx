import React from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useMobile } from '@/hooks/use-mobile';

interface MobileTooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function MobileTooltip({ children, content, side = 'left' }: MobileTooltipProps) {
  const { isMobile } = useMobile();

  if (isMobile) {
    return React.cloneElement(children, {
      'aria-label': typeof content === 'string' ? content : undefined,
    });
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}
