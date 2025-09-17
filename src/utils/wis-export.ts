// src/utils/wis-export.ts
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { BarryWISResponse } from '@/config/mcp-config';

export interface ExportOptions {
  title?: string;
  vehicleModel?: string;
  includeImages?: boolean;
  includeTimestamp?: boolean;
  format?: 'A4' | 'Letter';
}

export interface WISExportData {
  query: string;
  results: any[];
  response?: string;
  vehicleModel?: string;
  timestamp: Date;
}

/**
 * Export WIS procedures to PDF
 */
export class WISExporter {

  /**
   * Generate PDF from WIS search results
   */
  static async exportToPDF(data: WISExportData, options: ExportOptions = {}): Promise<void> {
    const {
      title = 'WIS Search Results',
      vehicleModel = '',
      includeTimestamp = true,
      format = 'A4'
    } = options;

    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: format.toLowerCase()
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      // Header
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin, yPosition);
      yPosition += 10;

      // Subtitle with vehicle model and timestamp
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');

      if (vehicleModel) {
        doc.text(`Vehicle Model: ${vehicleModel}`, margin, yPosition);
        yPosition += 7;
      }

      if (includeTimestamp) {
        doc.text(`Generated: ${data.timestamp.toLocaleString()}`, margin, yPosition);
        yPosition += 7;
      }

      doc.text(`Search Query: "${data.query}"`, margin, yPosition);
      yPosition += 10;

      // Add line separator
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Barry's response if available
      if (data.response) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Barry\'s Analysis:', margin, yPosition);
        yPosition += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Split long text into lines
        const responseLines = doc.splitTextToSize(data.response, pageWidth - 2 * margin);
        doc.text(responseLines, margin, yPosition);
        yPosition += responseLines.length * 5 + 10;
      }

      // Results section
      if (data.results && data.results.length > 0) {
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.getHeight() - 50) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Detailed Results:', margin, yPosition);
        yPosition += 10;

        // Create table data
        const tableData = data.results.map((result, index) => {
          const row = [
            (index + 1).toString(),
            result.title || 'No Title',
            result.content_type || result.source || 'Unknown',
            result.category || 'General',
            (result.description || result.content || '').substring(0, 100) + '...'
          ];
          return row;
        });

        // Add table using autoTable plugin
        (doc as any).autoTable({
          head: [['#', 'Title', 'Type', 'Category', 'Description']],
          body: tableData,
          startY: yPosition,
          margin: { left: margin, right: margin },
          styles: {
            fontSize: 9,
            cellPadding: 3,
          },
          headStyles: {
            fillColor: [76, 124, 60], // Military green
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 242, 232] // Sand beige
          },
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 45 },
            2: { cellWidth: 25 },
            3: { cellWidth: 30 },
            4: { cellWidth: 55 }
          }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;

        // Add detailed procedure information
        data.results.forEach((result, index) => {
          // Check if we need a new page
          if (yPosition > doc.internal.pageSize.getHeight() - 40) {
            doc.addPage();
            yPosition = margin;
          }

          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${result.title || 'Untitled Procedure'}`, margin, yPosition);
          yPosition += 7;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');

          // Add metadata
          const metadata = [];
          if (result.content_type) metadata.push(`Type: ${result.content_type}`);
          if (result.category) metadata.push(`Category: ${result.category}`);
          if (result.difficulty_level) metadata.push(`Difficulty: ${result.difficulty_level}/5`);
          if (result.estimated_time_minutes) metadata.push(`Est. Time: ${result.estimated_time_minutes} min`);
          if (result.part_number) metadata.push(`Part #: ${result.part_number}`);

          if (metadata.length > 0) {
            doc.text(metadata.join(' • '), margin, yPosition);
            yPosition += 5;
          }

          // Add description/content
          if (result.description || result.content) {
            const content = result.description || result.content;
            const contentLines = doc.splitTextToSize(content, pageWidth - 2 * margin);
            doc.text(contentLines, margin, yPosition);
            yPosition += contentLines.length * 4 + 8;
          }

          // Add separator line
          if (index < data.results.length - 1) {
            doc.setLineWidth(0.2);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 5;
          }
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Unimog Community Hub - WIS Export - Page ${i} of ${pageCount}`,
          margin,
          doc.internal.pageSize.getHeight() - 10
        );
      }

      // Generate filename
      const timestamp = data.timestamp.toISOString().split('T')[0];
      const querySlug = data.query.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
      const filename = `wis-${querySlug}-${timestamp}.pdf`;

      // Save the PDF
      doc.save(filename);

      console.log(`PDF exported successfully: ${filename}`);

    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error(`PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export WIS parts to CSV
   */
  static async exportToCSV(data: WISExportData, options: ExportOptions = {}): Promise<void> {
    const { includeTimestamp = true } = options;

    try {
      // Filter for parts data
      const partsResults = data.results.filter(r =>
        r.content_type === 'parts' ||
        r.source === 'parts' ||
        r.part_number
      );

      if (partsResults.length === 0) {
        throw new Error('No parts data found in results to export');
      }

      // Create CSV headers
      const headers = [
        'Part Number',
        'Part Name',
        'Description',
        'Category',
        'Availability',
        'Vehicle Model',
        'Source'
      ];

      if (includeTimestamp) {
        headers.push('Export Date');
      }

      // Create CSV rows
      const rows = partsResults.map(part => {
        const row = [
          part.part_number || '',
          part.part_name || part.title || '',
          (part.description || part.content || '').replace(/[",\n\r]/g, ' '), // Clean description
          part.category || '',
          part.availability_status || part.availability || '',
          part.vehicle_model || data.vehicleModel || '',
          part.source || 'WIS'
        ];

        if (includeTimestamp) {
          row.push(data.timestamp.toLocaleDateString());
        }

        return row;
      });

      // Combine headers and rows
      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      // Add BOM for proper Excel encoding
      const csvWithBOM = '\uFEFF' + csvContent;

      // Create blob and download
      const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');

      if (link.download !== undefined) {
        const timestamp = data.timestamp.toISOString().split('T')[0];
        const querySlug = data.query.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
        const filename = `wis-parts-${querySlug}-${timestamp}.csv`;

        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
        console.log(`CSV exported successfully: ${filename}`);
      } else {
        throw new Error('CSV download not supported in this browser');
      }

    } catch (error) {
      console.error('CSV export failed:', error);
      throw new Error(`CSV export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Print current WIS results with optimized layout
   */
  static printResults(data: WISExportData, options: ExportOptions = {}): void {
    const { vehicleModel = '', includeTimestamp = true } = options;

    try {
      // Create print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Pop-up blocked. Please allow pop-ups for this site.');
      }

      // Generate print HTML
      const printHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>WIS Search Results - ${data.query}</title>
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.4;
              color: #333;
            }
            .header {
              border-bottom: 2px solid #4a7c3c;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .header h1 {
              color: #4a7c3c;
              font-size: 18pt;
              margin-bottom: 5px;
            }
            .header .meta {
              color: #666;
              font-size: 10pt;
            }
            .response {
              background: #f5f2e8;
              padding: 15px;
              border-left: 4px solid #4a7c3c;
              margin-bottom: 20px;
            }
            .response h2 {
              color: #4a7c3c;
              font-size: 14pt;
              margin-bottom: 10px;
            }
            .results {
              margin-top: 20px;
            }
            .results h2 {
              color: #4a7c3c;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 15px;
            }
            .result-item {
              margin-bottom: 20px;
              padding: 15px;
              border: 1px solid #e8e5d9;
              break-inside: avoid;
            }
            .result-item h3 {
              color: #4a7c3c;
              margin-bottom: 8px;
            }
            .result-meta {
              color: #666;
              font-size: 10pt;
              margin-bottom: 8px;
            }
            .result-content {
              text-align: justify;
            }
            .footer {
              position: fixed;
              bottom: 10mm;
              left: 20mm;
              right: 20mm;
              text-align: center;
              font-size: 9pt;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 5px;
            }
            @media print {
              .no-print { display: none !important; }
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>WIS Search Results</h1>
            <div class="meta">
              <strong>Search Query:</strong> "${data.query}"<br>
              ${vehicleModel ? `<strong>Vehicle Model:</strong> ${vehicleModel}<br>` : ''}
              ${includeTimestamp ? `<strong>Generated:</strong> ${data.timestamp.toLocaleString()}<br>` : ''}
              <strong>Results Found:</strong> ${data.results.length}
            </div>
          </div>

          ${data.response ? `
            <div class="response">
              <h2>Barry's Analysis</h2>
              <p>${data.response.replace(/\n/g, '<br>')}</p>
            </div>
          ` : ''}

          ${data.results.length > 0 ? `
            <div class="results">
              <h2>Detailed Results</h2>
              ${data.results.map((result, index) => `
                <div class="result-item">
                  <h3>${index + 1}. ${result.title || 'Untitled'}</h3>
                  <div class="result-meta">
                    ${result.content_type ? `Type: ${result.content_type} • ` : ''}
                    ${result.category ? `Category: ${result.category} • ` : ''}
                    ${result.difficulty_level ? `Difficulty: ${result.difficulty_level}/5 • ` : ''}
                    ${result.estimated_time_minutes ? `Time: ${result.estimated_time_minutes} min • ` : ''}
                    ${result.part_number ? `Part #: ${result.part_number}` : ''}
                  </div>
                  <div class="result-content">
                    ${(result.description || result.content || 'No description available').replace(/\n/g, '<br>')}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="footer">
            Unimog Community Hub - WIS Export - Generated ${data.timestamp.toLocaleDateString()}
          </div>
        </body>
        </html>
      `;

      // Write content and trigger print
      printWindow.document.write(printHTML);
      printWindow.document.close();

      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };

      console.log('Print dialog opened successfully');

    } catch (error) {
      console.error('Print failed:', error);
      throw new Error(`Print failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create export data from WIS response
   */
  static createExportData(
    query: string,
    response: BarryWISResponse,
    vehicleModel?: string
  ): WISExportData {
    return {
      query,
      results: response.context?.results || [],
      response: response.response,
      vehicleModel,
      timestamp: new Date()
    };
  }
}