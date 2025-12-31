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
  // RPS-specific fields
  cdn_url?: string;
  rps_illustration_url?: string;
  is_rps_exploded_view?: boolean;
  rps_number?: string;
  rps_figure_number?: string;
  rps_group_code?: string;
  group_code?: string;
  group_name?: string;
}

interface ManualCitationProps {
  reference: ManualReference;
  onClick: () => void;
  className?: string;
}

export function ManualCitation({ reference, onClick, className }: ManualCitationProps) {
  // Check if this is an RPS illustration
  const isRpsIllustration = reference.is_rps_exploded_view || reference.manual_type === 'RPS';
  const illustrationUrl = reference.rps_illustration_url || reference.cdn_url || reference.storage_url;

  // Create short preview from content (first 150 chars)
  const preview = reference.content
    ? reference.content.substring(0, 150) + (reference.content.length > 150 ? '...' : '')
    : 'Click to view full manual section';

  // If it's an RPS illustration with a URL, show the image inline
  if (isRpsIllustration && illustrationUrl) {
    return (
      <div className={cn("flex flex-col gap-2 p-2 border border-primary/30 rounded-md bg-card", className)}>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary/30 text-primary">
            <BookOpen className="h-3 w-3 mr-1" />
            <span className="text-xs">
              RPS Page {reference.page_number}
              {reference.rps_number && ` - ${reference.rps_number}`}
            </span>
          </Badge>
          {reference.group_name && (
            <span className="text-xs text-muted-foreground">{reference.group_name}</span>
          )}
        </div>
        <img
          src={illustrationUrl}
          alt={`RPS Exploded View - Page ${reference.page_number}`}
          className="w-full max-w-md rounded cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onClick}
          loading="lazy"
        />
      </div>
    );
  }

  // Regular manual citation (non-RPS or no illustration)
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
