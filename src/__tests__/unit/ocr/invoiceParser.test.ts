import { describe, it, expect } from 'vitest';
import { InvoiceParser, type OCRResult } from '../../../../supabase/functions/_shared/ocr-providers';

describe('InvoiceParser', () => {
  describe('parseInvoiceData', () => {
    it('should parse basic invoice information', () => {
      const ocrResult: OCRResult = {
        text: `INVOICE #INV-2024-001
Shell Canada
Invoice Date: 03/25/2024
Diesel Fuel         80.0L    $1.89    $151.20
Tax (GST)                            $15.12
TOTAL                               $166.32`,
        confidence: 85,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(ocrResult);

      expect(invoice.invoiceNumber).toBe('INV-2024-001');
      expect(invoice.vendorName).toBe('SHELL CANADA');
      expect(invoice.invoiceDate).toBe('2024-03-25');
      expect(invoice.totalAmount).toBe(166.32);
      expect(invoice.taxAmount).toBe(15.12);
      expect(invoice.subtotal).toBe(151.20);
      expect(invoice.currency).toBe('USD'); // Default
      expect(invoice.lineItems).toHaveLength(1);
      expect(invoice.lineItems![0].description).toBe('Diesel Fuel');
      expect(invoice.lineItems![0].quantity).toBe(80.0);
    });

    it('should handle various invoice number formats', () => {
      const testCases = [
        { text: 'INVOICE #123456', expected: '123456' },
        { text: 'Invoice No: ABC-789', expected: 'ABC-789' },
        { text: 'INV 2024-001', expected: '2024-001' },
        { text: 'Bill #B123456', expected: 'B123456' },
        { text: 'Invoice Number: 98765-XYZ', expected: '98765-XYZ' }
      ];

      testCases.forEach(({ text, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text,
          confidence: 80,
          blocks: []
        });
        expect(result.invoiceNumber).toBe(expected);
      });
    });

    it('should parse different date formats correctly', () => {
      const testCases = [
        { text: 'Date: 03/25/2024', expected: '2024-03-25' },
        { text: 'Invoice Date: 25-03-24', expected: '2024-03-25' },
        { text: 'Date: 3.25.2024', expected: '2024-03-25' },
        { text: 'Issued: 12/31/2023', expected: '2023-12-31' },
        { text: '01/15/25', expected: '2025-01-15' } // 2-digit year
      ];

      testCases.forEach(({ text, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text,
          confidence: 80,
          blocks: []
        });
        expect(result.invoiceDate).toBe(expected);
      });
    });

    it('should extract vendor names from invoice header', () => {
      const testCases = [
        {
          lines: ['SHELL CANADA', 'Invoice #123'],
          expected: 'SHELL CANADA'
        },
        {
          lines: ['INVOICE', 'Petro-Canada', '123 Main St'],
          expected: 'PETRO-CANADA'
        },
        {
          lines: ['Receipt', 'Esso', 'Station #456'],
          expected: 'ESSO'
        },
        {
          lines: ['TAX INVOICE', '12345', 'Mobile Gas Station'],
          expected: 'MOBILE GAS STATION'
        }
      ];

      testCases.forEach(({ lines, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text: lines.join('\n'),
          confidence: 80,
          blocks: []
        });
        expect(result.vendorName).toBe(expected);
      });
    });

    it('should extract total amounts with various formats', () => {
      const testCases = [
        { text: 'TOTAL: $123.45', expected: 123.45 },
        { text: 'Amount Due: 987.65', expected: 987.65 },
        { text: 'Balance Due: $1,234.56', expected: 1234.56 },
        { text: 'Grand Total $2,500', expected: 2500 },
        { text: 'TOTAL 56.78', expected: 56.78 }
      ];

      testCases.forEach(({ text, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text,
          confidence: 80,
          blocks: []
        });
        expect(result.totalAmount).toBe(expected);
      });
    });

    it('should extract tax amounts with various labels', () => {
      const testCases = [
        { text: 'Tax: $12.34', expected: 12.34 },
        { text: 'GST: 45.67', expected: 45.67 },
        { text: 'VAT Amount: $98.76', expected: 98.76 },
        { text: 'TAX $5.43', expected: 5.43 }
      ];

      testCases.forEach(({ text, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text,
          confidence: 80,
          blocks: []
        });
        expect(result.taxAmount).toBe(expected);
      });
    });

    it('should detect currency from symbols and codes', () => {
      const testCases = [
        { text: 'Total: $123 USD', expected: 'USD' },
        { text: 'Amount: €456 EUR', expected: 'EUR' },
        { text: 'Total: £789 GBP', expected: 'GBP' },
        { text: 'Amount: ¥1000', expected: 'JPY' },
        { text: 'Total: A$500', expected: 'AUD' },
        { text: 'Amount: ₺300 TRY', expected: 'TRY' }
      ];

      testCases.forEach(({ text, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text,
          confidence: 80,
          blocks: []
        });
        expect(result.currency).toBe(expected);
      });
    });

    it('should parse line items correctly', () => {
      const ocrResult: OCRResult = {
        text: `Invoice #123
Diesel Fuel         80.0    $1.89    $151.20
Premium Diesel      20.5    $1.95    $39.98
Service Fee          1.0    $5.00     $5.00`,
        confidence: 85,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(ocrResult);

      expect(invoice.lineItems).toHaveLength(3);
      expect(invoice.lineItems![0].description).toBe('Diesel Fuel');
      expect(invoice.lineItems![0].quantity).toBe(80.0);
      expect(invoice.lineItems![0].unitPrice).toBe(1.89);
      expect(invoice.lineItems![0].lineTotal).toBe(151.20);

      expect(invoice.lineItems![1].description).toBe('Premium Diesel');
      expect(invoice.lineItems![2].description).toBe('Service Fee');
    });

    it('should calculate confidence boost based on extracted data', () => {
      const completeInvoice: OCRResult = {
        text: `INVOICE #INV-123
Shell Canada
Date: 03/25/2024
Diesel           80.0    $1.89    $151.20
Tax                              $15.12
Total                           $166.32`,
        confidence: 70,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(completeInvoice);

      // Base 70 + 5 (invoice#) + 5 (date) + 5 (vendor) + 10 (total) + 5 (line items) = 100, capped at 95
      expect(invoice.confidence).toBe(95);
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalInvoice: OCRResult = {
        text: 'Some receipt text with no clear structure',
        confidence: 60,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(minimalInvoice);

      expect(invoice.confidence).toBe(60); // No boosts
      expect(invoice.invoiceNumber).toBeUndefined();
      expect(invoice.invoiceDate).toBeUndefined();
      expect(invoice.totalAmount).toBeUndefined();
      expect(invoice.taxAmount).toBeUndefined();
      expect(invoice.lineItems).toEqual([]);
      expect(invoice.currency).toBe('USD'); // Default
    });

    it('should handle edge cases in date parsing', () => {
      const testCases = [
        {
          input: '99/99/2024', // Invalid date
          expected: '99/99/2024' // Should return as-is if invalid
        },
        {
          input: '12-31-50', // Ambiguous year (should become 1950)
          expected: '1950-12-31'
        },
        {
          input: '01-01-25', // Recent year (should become 2025)
          expected: '2025-01-01'
        }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text: `Date: ${input}`,
          confidence: 80,
          blocks: []
        });
        expect(result.invoiceDate).toBe(expected);
      });
    });

    it('should handle DD-MM-YYYY vs MM-DD-YYYY date formats', () => {
      const testCases = [
        {
          input: '31-12-2024', // Must be DD-MM-YYYY (31st day)
          expected: '2024-12-31'
        },
        {
          input: '12-25-2024', // Could be either, but assume MM-DD-YYYY for this case
          expected: '2024-12-25'
        },
        {
          input: '05-10-2024', // Ambiguous, assume MM-DD-YYYY (US format)
          expected: '2024-05-10'
        }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text: `Date: ${input}`,
          confidence: 80,
          blocks: []
        });
        expect(result.invoiceDate).toBe(expected);
      });
    });

    it('should calculate subtotal when total and tax are available', () => {
      const ocrResult: OCRResult = {
        text: `Invoice #123
Tax: $15.00
Total: $115.00`,
        confidence: 80,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(ocrResult);

      expect(invoice.totalAmount).toBe(115.00);
      expect(invoice.taxAmount).toBe(15.00);
      expect(invoice.subtotal).toBe(100.00); // 115 - 15
    });

    it('should handle amounts with commas correctly', () => {
      const ocrResult: OCRResult = {
        text: `Invoice #123
Line Item    100.0    $12.50    $1,250.00
Tax                            $125.00
Total                        $1,375.00`,
        confidence: 85,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(ocrResult);

      expect(invoice.totalAmount).toBe(1375.00);
      expect(invoice.taxAmount).toBe(125.00);
      expect(invoice.subtotal).toBe(1250.00);
      expect(invoice.lineItems![0].unitPrice).toBe(12.50);
      expect(invoice.lineItems![0].lineTotal).toBe(1250.00);
    });

    it('should skip invoice headers when extracting vendor name', () => {
      const testCases = [
        {
          lines: ['INVOICE', 'BILL', 'Shell Canada', 'Address'],
          expected: 'SHELL CANADA'
        },
        {
          lines: ['TAX INVOICE', 'RECEIPT', '12345', 'Real Vendor Name'],
          expected: 'REAL VENDOR NAME'
        }
      ];

      testCases.forEach(({ lines, expected }) => {
        const result = InvoiceParser.parseInvoiceData({
          text: lines.join('\n'),
          confidence: 80,
          blocks: []
        });
        expect(result.vendorName).toBe(expected);
      });
    });
  });

  describe('Private method behavior (via public interface)', () => {
    it('should normalize dates consistently', () => {
      const variations = [
        'Date: 03/25/2024',
        'Date: 03-25-2024',
        'Date: 03.25.2024'
      ];

      variations.forEach(dateText => {
        const result = InvoiceParser.parseInvoiceData({
          text: dateText,
          confidence: 80,
          blocks: []
        });
        expect(result.invoiceDate).toBe('2024-03-25');
      });
    });

    it('should extract same total amount regardless of spacing', () => {
      const variations = [
        'TOTAL: $123.45',
        'TOTAL:$123.45',
        'TOTAL $123.45',
        'TOTAL   :   $123.45'
      ];

      variations.forEach(totalText => {
        const result = InvoiceParser.parseInvoiceData({
          text: totalText,
          confidence: 80,
          blocks: []
        });
        expect(result.totalAmount).toBe(123.45);
      });
    });
  });

  describe('Real-world invoice scenarios', () => {
    it('should handle Canadian fuel receipt format', () => {
      const canadianReceipt: OCRResult = {
        text: `PETRO-CANADA
TAX INVOICE
Invoice #: PC-2024-789
Date: 25/03/2024

Diesel Fuel - Premium    95.5L    $1.89/L    $180.50
GST (5%)                                      $9.02
Total CAD                                   $189.52`,
        confidence: 90,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(canadianReceipt);

      expect(invoice.vendorName).toBe('PETRO-CANADA');
      expect(invoice.invoiceNumber).toBe('PC-2024-789');
      expect(invoice.invoiceDate).toBe('2024-03-25');
      expect(invoice.totalAmount).toBe(189.52);
      expect(invoice.taxAmount).toBe(9.02);
      expect(invoice.lineItems).toHaveLength(1);
    });

    it('should handle European fuel receipt format', () => {
      const europeanReceipt: OCRResult = {
        text: `Shell Deutschland GmbH
Rechnung Nr: DE-2024-456
Datum: 25.03.2024

Diesel                   60.0L    €1.65/L    €99.00
MwSt. (19%)                                  €18.81
Gesamt EUR                                  €117.81`,
        confidence: 88,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(europeanReceipt);

      expect(invoice.vendorName).toBe('SHELL DEUTSCHLAND GMBH');
      expect(invoice.invoiceNumber).toBe('DE-2024-456');
      expect(invoice.totalAmount).toBe(117.81);
      expect(invoice.currency).toBe('EUR');
    });

    it('should handle US fuel receipt format', () => {
      const usReceipt: OCRResult = {
        text: `Exxon Mobil
Invoice Number: EX123456789
Date: 03/25/2024

Regular Diesel    50.0 gal    $3.89/gal    $194.50
Tax                                         $15.56
Amount Due USD                             $210.06`,
        confidence: 92,
        blocks: []
      };

      const invoice = InvoiceParser.parseInvoiceData(usReceipt);

      expect(invoice.vendorName).toBe('EXXON MOBIL');
      expect(invoice.invoiceNumber).toBe('EX123456789');
      expect(invoice.currency).toBe('USD');
      expect(invoice.totalAmount).toBe(210.06);
    });
  });
});