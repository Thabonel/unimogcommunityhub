import { useEffect, useRef, useState } from 'react';

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  dir: string;
  fontName: string;
}

interface PdfTextLayerProps {
  pdfDoc: any | null;
  currentPage: number;
  scale: number;
  viewport: any;
}

export function PdfTextLayer({ pdfDoc, currentPage, scale, viewport }: PdfTextLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textItems, setTextItems] = useState<TextItem[]>([]);

  useEffect(() => {
    const extractTextContent = async () => {
      if (!pdfDoc || !viewport) return;

      try {
        console.log('🔤 Extracting text content for page', currentPage);
        const page = await pdfDoc.getPage(currentPage);
        const textContent = await page.getTextContent();

        console.log('📝 Text items found:', textContent.items.length);

        // Filter out empty text items and prepare for rendering
        const validTextItems = textContent.items
          .filter((item: any) => item.str && item.str.trim().length > 0)
          .map((item: any) => ({
            str: item.str,
            transform: item.transform,
            width: item.width,
            height: item.height,
            dir: item.dir || 'ltr',
            fontName: item.fontName || 'sans-serif'
          }));

        setTextItems(validTextItems);
        console.log('✅ Valid text items processed:', validTextItems.length);

        // Log first few items for debugging
        if (validTextItems.length > 0) {
          console.log('📄 Sample text items:', validTextItems.slice(0, 3));
        }
      } catch (error) {
        console.error('❌ Error extracting text content:', error);
        setTextItems([]);
      }
    };

    extractTextContent();
  }, [pdfDoc, currentPage, viewport]);

  if (!viewport || textItems.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: viewport.width,
        height: viewport.height,
        zIndex: 2, // Above canvas but below UI controls
      }}
    >
      {textItems.map((item, index) => {
        // Extract position from transform matrix [a, b, c, d, e, f]
        // e = x position, f = y position
        const x = item.transform[4];
        const y = item.transform[5];

        // Calculate font size from transform matrix
        // The scale is determined by the transform matrix values
        const fontScale = Math.sqrt(item.transform[0] * item.transform[0] + item.transform[1] * item.transform[1]);
        const fontSize = fontScale * scale;

        // Adjust y position for PDF coordinate system (origin at bottom-left)
        const adjustedY = viewport.height - y - fontSize;

        return (
          <span
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: adjustedY,
              fontSize: `${fontSize}px`,
              fontFamily: 'Arial, sans-serif', // Fallback font
              color: 'black',
              whiteSpace: 'nowrap',
              userSelect: 'text',
              pointerEvents: 'auto', // Allow text selection
              // Add slight transparency to see underlying graphics
              opacity: 0.9,
              // Prevent text from being too small to read
              minHeight: '8px',
            }}
          >
            {item.str}
          </span>
        );
      })}
    </div>
  );
}