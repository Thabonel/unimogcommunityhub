
import React from 'react';

export function PdfViewerStyles() {
  return (
    <style jsx global>{`
      /* Custom scrollbar styling for PDF viewer */
      .pdf-container::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      
      .pdf-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 5px;
      }
      
      .pdf-container::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 5px;
      }
      
      .pdf-container::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      
      /* For Firefox */
      .pdf-container {
        scrollbar-width: thin;
        scrollbar-color: #888 #f1f1f1;
      }
    `}</style>
  );
}
