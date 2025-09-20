
import React from 'react';

export function PdfViewerStyles() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
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

      /* PDF.js text layer styling */
      .textLayer {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        opacity: 1.0;
        line-height: 1.0;
        pointer-events: none;
      }

      .textLayer > span {
        color: rgba(0, 0, 0, 0.8) !important;
        position: absolute;
        white-space: pre;
        cursor: text;
        transform-origin: 0% 0%;
        pointer-events: none;
        user-select: text;
      }

      .textLayer .highlight {
        margin: -1px;
        padding: 1px;
        background-color: rgba(180, 0, 170, 0.2);
        border-radius: 4px;
      }

      .textLayer .highlight.begin {
        border-radius: 4px 0px 0px 4px;
      }

      .textLayer .highlight.end {
        border-radius: 0px 4px 4px 0px;
      }

      .textLayer .highlight.middle {
        border-radius: 0px;
      }

      .textLayer .highlight.selected {
        background-color: rgba(0, 100, 0, 0.2);
      }

      /* Selection styling */
      .textLayer ::selection {
        background: rgba(0, 0, 255, 0.3);
      }

      .textLayer ::-moz-selection {
        background: rgba(0, 0, 255, 0.3);
      }
    `
      }}
    />
  );
}
