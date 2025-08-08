
import React from 'react';

interface PdfViewerHeaderProps {
  documentTitle: string;
}

export function PdfViewerHeader({ documentTitle }: PdfViewerHeaderProps) {
  if (!documentTitle) return null;
  
  return (
    <div className="border-b p-3 flex items-center">
      <h2 id="pdf-viewer-title" className="text-lg font-medium truncate flex-1">
        {documentTitle}
      </h2>
    </div>
  );
}
