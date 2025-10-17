import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ManualReference {
  title: string;
  page_number: number;
  pdf_page?: number;
  original_page?: number;
  storage_url?: string;
  section_title?: string;
  content?: string;
  page_image_url?: string;
  filename?: string;
  manual_type?: string;
}

interface ManualCitationProps {
  reference: ManualReference;
  onClick: () => void;
  className?: string;
}

export function ManualCitation({ reference, onClick, className }: ManualCitationProps) {
  // Create short preview from content (first 150 chars)
  const preview = reference.content
    ? reference.content.substring(0, 150) + (reference.content.length > 150 ? '...' : '')
    : 'Click to view full manual section';

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "inline-flex items-center gap-1 cursor-pointer hover:bg-primary/10 transition-colors",
              "border-primary/30 text-primary",
              className
            )}
            onClick={onClick}
          >
            <BookOpen className="h-3 w-3" />
            <span className="text-xs">
              {reference.title} p.{reference.page_number}
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs p-3"
          sideOffset={5}
        >
          <div className="space-y-1">
            <p className="font-medium text-sm">{reference.title}</p>
            {reference.section_title && (
              <p className="text-xs text-muted-foreground">{reference.section_title}</p>
            )}
            <p className="text-xs mt-2 text-muted-foreground italic">
              {preview}
            </p>
            <p className="text-xs mt-2 text-primary">Click to view full section</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
