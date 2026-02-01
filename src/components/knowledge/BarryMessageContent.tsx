/**
 * Barry Message Content Renderer
 * Handles rendering of Barry's responses with proper table formatting
 */

import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { formatTablesAsHtml, hasTableContent } from '@/utils/tableFormatter';
import { cn } from '@/lib/utils';

interface BarryMessageContentProps {
  content: string;
  className?: string;
}

const ALLOWED_TAGS = ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span', 'p'];
const ALLOWED_ATTR = ['class'];

export function BarryMessageContent({ content, className }: BarryMessageContentProps) {
  const { formattedHtml, hasFormatting } = useMemo(() => {
    if (!hasTableContent(content)) {
      return { formattedHtml: null, hasFormatting: false };
    }

    const { html, hasTables } = formatTablesAsHtml(content);

    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      KEEP_CONTENT: true
    });

    return { formattedHtml: sanitized, hasFormatting: hasTables };
  }, [content]);

  if (!hasFormatting || !formattedHtml) {
    return (
      <div className={cn("whitespace-pre-wrap break-words text-sm leading-relaxed", className)}>
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn("text-sm leading-relaxed barry-formatted-content", className)}
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
}
