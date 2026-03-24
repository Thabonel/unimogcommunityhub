import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ClaudeVisionOCR,
  GoogleVisionOCR
} from '../../../../supabase/functions/_shared/ocr-providers';

// Mock environment variables for integration tests
const mockEnv = {
  ANTHROPIC_API_KEY: 'test-anthropic-key',
  GOOGLE_VISION_API_KEY: 'test-google-key',
  UNSTRUCTURED_API_KEY: 'test-unstructured-key'
};

// Mock fetch for API calls
global.fetch = vi.fn();
const mockFetch = global.fetch as any;

describe('OCR Providers Integration Tests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Real-world fuel receipt scenarios', () => {
    describe('Single Tank Diesel Receipt', () => {
      it('should handle standard single tank diesel fill-up', async () => {
        const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
        const testBlob = new Blob(['mock receipt image'], { type: 'image/jpeg' });

        // Mock successful Claude response for single tank
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            content: [{
              text: JSON.stringify({
                receipt_type: 'fuel_receipt',
                station_name: 'Shell Canada',
                date: '2024-03-25',
                time: '14:30',
                fuel_entries: [
                  {
                    fuel_type: 'Diesel',
                    volume_liters: 85.2,
                    price_per_liter: 1.789,
                    total_amount: 152.42,
                    tank_number: null
                  }
                ],
                combined_totals: {
                  total_volume_liters: 85.2,
                  total_amount: 152.42,
                  blended_price_per_liter: 1.789
                },
                odometer_reading: null,
                confidence: 92
              })
            }]
          })
        });

        const result = await ocr.processDocument(testBlob);
        const invoice = ocr.parseFuelReceipt(result);

        expect(result.confidence).toBe(92);
        expect(result.metadata?.fuel_data.station_name).toBe('Shell Canada');
        expect(invoice.vendorName).toBe('Shell Canada');
        expect(invoice.totalAmount).toBe(152.42);
        expect(invoice.lineItems).toHaveLength(1);
        expect(invoice.lineItems![0].quantity).toBe(85.2);
        expect(invoice.lineItems![0].unitPrice).toBe(1.789);
      });
    });

    describe('Dual Tank Unimog Receipt', () => {
      it('should handle dual tank fill-up with different diesel types', async () => {
        const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
        const testBlob = new Blob(['mock dual tank receipt'], { type: 'image/jpeg' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            content: [{
              text: JSON.stringify({
                receipt_type: 'fuel_receipt',
                station_name: 'Petro-Canada',
                date: '2024-03-25',
                time: '16:45',
                fuel_entries: [
                  {
                    fuel_type: 'Premium Diesel',
                    volume_liters: 48.5,
                    price_per_liter: 1.899,
                    total_amount: 92.12,
                    tank_number: 1
                  },
                  {
                    fuel_type: 'Regular Diesel',
                    volume_liters: 51.8,
                    price_per_liter: 1.799,
                    total_amount: 93.19,
                    tank_number: 2
                  }
                ],
                combined_totals: {
                  total_volume_liters: 100.3,
                  total_amount: 185.31,
                  blended_price_per_liter: 1.847
                },
                odometer_reading: 125680,
                confidence: 89
              })
            }]
          })
        });

        const result = await ocr.processDocument(testBlob);
        const invoice = ocr.parseFuelReceipt(result);

        expect(result.confidence).toBe(89);
        expect(result.blocks).toHaveLength(4); // 2 entries + totals + odometer

        expect(invoice.lineItems).toHaveLength(2);
        expect(invoice.lineItems![0].description).toBe('Premium Diesel - Tank 1');
        expect(invoice.lineItems![1].description).toBe('Regular Diesel - Tank 2');
        expect(invoice.totalAmount).toBe(185.31);

        // Check odometer block exists
        const odometerBlock = result.blocks?.find(block => block.text.includes('Odometer'));
        expect(odometerBlock).toBeDefined();
        expect(odometerBlock?.text).toBe('Odometer: 125680 km');
      });
    });

    describe('Dashboard Photo with Odometer', () => {
      it('should extract odometer reading from dashboard photo', async () => {
        const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
        const testBlob = new Blob(['mock dashboard image'], { type: 'image/jpeg' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            content: [{
              text: JSON.stringify({
                receipt_type: 'dashboard_photo',
                station_name: null,
                date: '2024-03-25',
                fuel_entries: [],
                combined_totals: {
                  total_volume_liters: 0,
                  total_amount: 0,
                  blended_price_per_liter: 0
                },
                odometer_reading: 127450,
                confidence: 78
              })
            }]
          })
        });

        const result = await ocr.processDocument(testBlob);

        expect(result.confidence).toBe(78);
        expect(result.metadata?.fuel_data.odometer_reading).toBe(127450);

        const odometerBlock = result.blocks?.find(block => block.text.includes('Odometer'));
        expect(odometerBlock).toBeDefined();
        expect(odometerBlock?.type).toBe('number');
      });
    });

    describe('Combined Receipt and Dashboard', () => {
      it('should handle receipt with visible dashboard showing odometer', async () => {
        const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
        const testBlob = new Blob(['mock combined image'], { type: 'image/jpeg' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            content: [{
              text: JSON.stringify({
                receipt_type: 'combined',
                station_name: 'Esso',
                date: '2024-03-25',
                time: '10:15',
                fuel_entries: [
                  {
                    fuel_type: 'Diesel',
                    volume_liters: 75.0,
                    price_per_liter: 1.829,
                    total_amount: 137.18,
                    tank_number: null
                  }
                ],
                combined_totals: {
                  total_volume_liters: 75.0,
                  total_amount: 137.18,
                  blended_price_per_liter: 1.829
                },
                odometer_reading: 98765,
                confidence: 85
              })
            }]
          })
        });

        const result = await ocr.processDocument(testBlob);
        const invoice = ocr.parseFuelReceipt(result);

        expect(result.confidence).toBe(85);
        expect(result.metadata?.fuel_data.receipt_type).toBe('combined');
        expect(result.metadata?.fuel_data.odometer_reading).toBe(98765);
        expect(invoice.totalAmount).toBe(137.18);
        expect(result.blocks).toHaveLength(3); // Entry + totals + odometer
      });
    });
  });

  describe('Error scenarios and edge cases', () => {
    it('should handle poor quality image with low confidence', async () => {
      const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
      const testBlob = new Blob(['blurry receipt image'], { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            text: JSON.stringify({
              receipt_type: 'fuel_receipt',
              station_name: 'Unknown Station',
              date: null,
              fuel_entries: [
                {
                  fuel_type: 'Diesel',
                  volume_liters: 0, // Could not read volume
                  price_per_liter: 1.8, // Approximate
                  total_amount: 145.0, // Only clear value
                  tank_number: null
                }
              ],
              combined_totals: {
                total_volume_liters: 0,
                total_amount: 145.0,
                blended_price_per_liter: 0
              },
              odometer_reading: null,
              confidence: 35 // Low confidence
            })
          }]
        })
      });

      const result = await ocr.processDocument(testBlob);

      expect(result.confidence).toBe(35);
      expect(result.metadata?.fuel_data.station_name).toBe('Unknown Station');
      expect(result.metadata?.fuel_data.fuel_entries[0].volume_liters).toBe(0);
      expect(result.metadata?.fuel_data.confidence).toBe(35);
    });

    it('should handle completely unreadable receipt', async () => {
      const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
      const testBlob = new Blob(['unreadable image'], { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            text: 'I cannot make out any clear text from this image. The receipt appears to be too blurry or damaged to extract reliable fuel data.'
          }]
        })
      });

      const result = await ocr.processDocument(testBlob);

      expect(result.confidence).toBe(70); // Fallback confidence
      expect(result.metadata?.parse_error).toBeTruthy();
      expect(result.blocks).toEqual([]);
    });

    it('should handle network timeout gracefully', async () => {
      const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
      const testBlob = new Blob(['test image'], { type: 'image/jpeg' });

      mockFetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(ocr.processDocument(testBlob)).rejects.toThrow('Request timeout');
    });

    it('should handle API rate limiting', async () => {
      const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
      const testBlob = new Blob(['test image'], { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      });

      await expect(ocr.processDocument(testBlob)).rejects.toThrow('Claude Vision API error: 429');
    });
  });

  describe('Cross-provider comparison', () => {
    it('should demonstrate different providers handling same receipt', async () => {
      const testBlob = new Blob(['test receipt'], { type: 'image/jpeg' });

      // Claude Vision OCR
      const claudeOcr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            text: JSON.stringify({
              receipt_type: 'fuel_receipt',
              station_name: 'Shell',
              fuel_entries: [{
                fuel_type: 'Diesel',
                volume_liters: 80.0,
                price_per_liter: 1.8,
                total_amount: 144.0
              }],
              combined_totals: { total_volume_liters: 80.0, total_amount: 144.0 },
              confidence: 90
            })
          }]
        })
      });

      // Google Vision OCR
      const googleOcr = new GoogleVisionOCR(mockEnv.GOOGLE_VISION_API_KEY);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          responses: [{
            fullTextAnnotation: {
              text: 'Shell\nDiesel 80.0L @ $1.80/L\nTotal: $144.00',
              pages: [{
                confidence: 0.88,
                blocks: []
              }]
            }
          }]
        })
      });

      const claudeResult = await claudeOcr.processDocument(testBlob);
      const googleResult = await googleOcr.processDocument(testBlob);

      expect(claudeResult.metadata?.provider).toBe('claude_vision');
      expect(googleResult.metadata?.provider).toBe('google_vision');
      expect(claudeResult.confidence).toBe(90);
      expect(googleResult.confidence).toBe(88);
    });
  });

  describe('Currency detection integration', () => {
    it('should detect different currencies from receipt content', async () => {
      const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);

      // Test EUR receipt
      const eurBlob = new Blob(['EUR receipt'], { type: 'image/jpeg' });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            text: JSON.stringify({
              station_name: 'Shell Deutschland',
              fuel_entries: [{
                fuel_type: 'Diesel',
                volume_liters: 60.0,
                price_per_liter: '1.65€',
                total_amount: '99.00€'
              }],
              combined_totals: { total_amount: '99.00€' }
            })
          }]
        })
      });

      const result = await ocr.processDocument(eurBlob);
      const invoice = ocr.parseFuelReceipt(result);

      expect(invoice.currency).toBe('EUR');

      // Test USD receipt
      vi.resetAllMocks();
      const usdBlob = new Blob(['USD receipt'], { type: 'image/jpeg' });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            text: JSON.stringify({
              station_name: 'Shell USA',
              fuel_entries: [{
                fuel_type: 'Diesel',
                volume_liters: 60.0,
                price_per_liter: '$1.95 USD',
                total_amount: '$117.00'
              }],
              combined_totals: { total_amount: '$117.00' }
            })
          }]
        })
      });

      const usdResult = await ocr.processDocument(usdBlob);
      const usdInvoice = ocr.parseFuelReceipt(usdResult);

      expect(usdInvoice.currency).toBe('USD');
    });

    it('should fallback to CAD for unknown currency', async () => {
      const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
      const testBlob = new Blob(['unknown currency'], { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            text: JSON.stringify({
              station_name: 'Generic Station',
              fuel_entries: [{
                fuel_type: 'Diesel',
                volume_liters: 50.0,
                total_amount: 90.0
              }],
              combined_totals: { total_amount: 90.0 }
            })
          }]
        })
      });

      const result = await ocr.processDocument(testBlob);
      const invoice = ocr.parseFuelReceipt(result);

      expect(invoice.currency).toBe('CAD'); // Fallback
    });
  });

  describe('Performance and stress testing', () => {
    it('should handle multiple rapid OCR requests', async () => {
      const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);
      const testBlobs = Array(5).fill(null).map((_, i) =>
        new Blob([`test image ${i}`], { type: 'image/jpeg' })
      );

      // Mock successful responses for all requests
      testBlobs.forEach((_, i) => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            content: [{
              text: JSON.stringify({
                station_name: `Station ${i}`,
                fuel_entries: [{
                  fuel_type: 'Diesel',
                  volume_liters: 50.0 + i,
                  total_amount: 90.0 + i
                }],
                combined_totals: { total_amount: 90.0 + i },
                confidence: 85
              })
            }]
          })
        });
      });

      const start = performance.now();
      const results = await Promise.all(
        testBlobs.map(blob => ocr.processDocument(blob))
      );
      const end = performance.now();

      expect(results).toHaveLength(5);
      results.forEach((result, i) => {
        expect(result.confidence).toBe(85);
        expect(result.metadata?.fuel_data.station_name).toBe(`Station ${i}`);
      });

      // Should handle multiple requests reasonably quickly
      expect(end - start).toBeLessThan(1000); // Less than 1 second for mocked responses
    });

    it('should handle large image files', async () => {
      const ocr = new ClaudeVisionOCR(mockEnv.ANTHROPIC_API_KEY);

      // Create a larger blob (simulating high-res image)
      const largeImageData = 'x'.repeat(1024 * 1024); // 1MB of data
      const largeBlob = new Blob([largeImageData], { type: 'image/jpeg' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            text: JSON.stringify({
              station_name: 'Shell',
              fuel_entries: [{
                fuel_type: 'Diesel',
                volume_liters: 80.0,
                total_amount: 144.0
              }],
              combined_totals: { total_amount: 144.0 },
              confidence: 88
            })
          }]
        })
      });

      const result = await ocr.processDocument(largeBlob);

      expect(result.confidence).toBe(88);
      expect(result.metadata?.fuel_data.station_name).toBe('Shell');
    });
  });
});