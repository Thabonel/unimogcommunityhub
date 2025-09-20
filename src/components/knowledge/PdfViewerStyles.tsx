
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

      /* PDF.js Text Layer Styles */
      .textLayer {
        position: absolute;
        text-align: initial;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        opacity: 1;
        line-height: 1;
        -webkit-text-size-adjust: none;
        -moz-text-size-adjust: none;
        text-size-adjust: none;
        forced-color-adjust: none;
        transform-origin: 0 0;
        z-index: 2;
      }

      .textLayer :is(span, br) {
        color: transparent;
        position: absolute;
        white-space: pre;
        cursor: text;
        transform-origin: 0% 0%;
        user-select: text;
        pointer-events: auto;
      }

      .textLayer > div {
        color: transparent;
        position: absolute;
        white-space: pre;
        cursor: text;
        transform-origin: 0% 0%;
        user-select: text;
        pointer-events: auto;
      }

      .textLayer span.markedContent {
        top: 0;
        height: 0;
      }

      .textLayer .highlight {
        margin: -1px;
        padding: 1px;
        background-color: rgba(180, 0, 170, 1);
        border-radius: 4px;
      }

      .textLayer .highlight.appended {
        position: initial;
      }

      .textLayer .highlight.begin {
        border-radius: 4px 0 0 4px;
      }

      .textLayer .highlight.end {
        border-radius: 0 4px 4px 0;
      }

      .textLayer .highlight.middle {
        border-radius: 0;
      }

      .textLayer .highlight.selected {
        background-color: rgba(0, 100, 0, 1);
      }

      /* Ensure proper scaling with CSS custom properties */
      .textLayer {
        --scale-factor: 1;
        transform: scale(var(--scale-factor));
      }
    `
      }}
    />
  );
}
