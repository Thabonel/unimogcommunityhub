import React from 'react';
import { ManualReference } from './ManualCitation';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ManualContentProps {
  reference: ManualReference;
  className?: string;
}

export function ManualContent({ reference, className }: ManualContentProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="border-b pb-3">
        <div className="flex items-start gap-2">
          <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight">
              {reference.title}
            </h3>
            {reference.section_title && (
              <p className="text-sm text-muted-foreground mt-1">
                {reference.section_title}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Page {reference.page_number}
              {reference.manual_type && ` • ${reference.manual_type}`}
            </p>
          </div>
        </div>
      </div>

      {/* Page Image (if available) */}
      {reference.page_image_url && (
        <div className="rounded-md overflow-hidden border bg-muted/30">
          <img
            src={reference.page_image_url}
            alt={`Page ${reference.page_number} from ${reference.title}`}
            className="w-full h-auto"
            loading="lazy"
          />
        </div>
      )}

      {/* Text Content */}
      {reference.content && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {reference.content}
          </div>
        </div>
      )}

      {/* No Content Fallback */}
      {!reference.content && !reference.page_image_url && (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">Content not available for this section</p>
        </div>
      )}
    </div>
  );
}
