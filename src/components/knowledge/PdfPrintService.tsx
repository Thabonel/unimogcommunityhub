
import { toast } from '@/hooks/use-toast';

export interface PrintPageInfo {
  pageNum: number;
  dataUrl: string | null;
}

export async function preparePdfForPrinting(
  pdfDoc: any, 
  printRange: { from: number; to: number }
): Promise<PrintPageInfo[]> {
  const imagePromises = [];
      
  // Only process the pages in the specified range
  for (let i = printRange.from; i <= printRange.to; i++) {
    imagePromises.push((async () => {
      try {
        // Get the page
        const page = await pdfDoc.getPage(i);
        
        // Higher scale for better print quality
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Create a canvas for this page
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const context = canvas.getContext('2d');
        if (!context) return { pageNum: i, dataUrl: null };
        
        // Render the PDF page to the canvas
        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
        
        return { pageNum: i, dataUrl: canvas.toDataURL('image/jpeg', 0.8) };
      } catch (error) {
        console.error(`Error rendering page ${i}:`, error);
        return { pageNum: i, dataUrl: null };
      }
    })());
  }
  
  // Wait for all pages to be processed
  return Promise.all(imagePromises);
}

export function printPdfPages(pageImages: PrintPageInfo[]): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Create an invisible iframe to handle the printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        reject(new Error('Could not access iframe document'));
        return;
      }
      
      // Write basic HTML structure
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print PDF</title>
            <style>
              body { margin: 0; padding: 0; }
              .page { page-break-after: always; margin-bottom: 10mm; }
              img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
            </style>
          </head>
          <body id="print-container"></body>
        </html>
      `);
      
      const printContainer = iframeDoc.getElementById('print-container');
      if (!printContainer) {
        reject(new Error('Print container not found'));
        return;
      }
      
      // Add each image to the container with page breaks
      pageImages.forEach(page => {
        if (!page || !page.dataUrl) return;
        
        const div = iframeDoc.createElement('div');
        div.className = 'page';
        
        const img = iframeDoc.createElement('img');
        img.src = page.dataUrl;
        img.alt = `Page ${page.pageNum}`;
        
        div.appendChild(img);
        printContainer.appendChild(div);
      });
      
      // Finish writing the document
      iframeDoc.close();
      
      // Wait for images to load
      iframe.onload = () => {
        setTimeout(() => {
          // Trigger print
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          
          // Clean up iframe after printing
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
              resolve();
            }
          }, 5000);
        }, 500);
      };
    } catch (error) {
      console.error('Error in printPdfPages:', error);
      toast({
        title: 'Print failed',
        description: 'Failed to prepare document for printing',
        variant: 'destructive'
      });
      reject(error);
    }
  });
}
