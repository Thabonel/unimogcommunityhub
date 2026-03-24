import { FuelReceiptParser, FuelReceiptData, DualTankEntry } from '../fuel-receipt-parser';
import { ExtractedData } from '../vehicle-ocr-service';
import { FuelLogFormValues } from '@/components/vehicle/fuel/FuelLogForm';

describe('FuelReceiptParser', () => {
  // Mock Claude Vision OCR result with dual tank data
  const mockClaudeVisionResult: ExtractedData = {
    vendor: { value: 'Shell Station', confidence: 0.95 },
    date: { value: '2024-03-25', confidence: 0.90 },
    total: { value: 643.20, confidence: 0.85 },
    // This would come from Claude Vision metadata
  };

  // Mock Claude Vision metadata with fuel data
  const mockFuelMetadata = {
    provider: 'claude_vision',
    fuel_data: {
      receipt_type: 'fuel_receipt',
      station_name: 'Shell Station',
      date: '2024-03-25',
      time: '14:30',
      fuel_entries: [
        {
          fuel_type: 'Premium Diesel',
          volume_liters: 170.19,
          price_per_liter: 2.979,
          total_amount: 507.00,
          tank_number: 1
        },
        {
          fuel_type: 'Diesel',
          volume_liters: 46.03,
          price_per_liter: 2.959,
          total_amount: 136.20,
          tank_number: 2
        }
      ],
      combined_totals: {
        total_volume_liters: 216.22,
        total_amount: 643.20,
        blended_price_per_liter: 2.975
      },
      odometer_reading: 125000,
      confidence: 90
    }
  };

  describe('parseClaudeVisionResult', () => {
    it('should parse dual tank fuel data correctly', () => {
      const result = FuelReceiptParser.parseClaudeVisionResult(mockClaudeVisionResult, mockFuelMetadata);

      expect(result).toEqual({
        receiptType: 'fuel_receipt',
        stationName: 'Shell Station',
        date: '2024-03-25',
        time: '14:30',
        odometerReading: 125000,
        dualTankEntries: [
          {
            fuelType: 'Premium Diesel',
            volumeLiters: 170.19,
            pricePerLiter: 2.979,
            totalAmount: 507.00,
            tankNumber: 1
          },
          {
            fuelType: 'Diesel',
            volumeLiters: 46.03,
            pricePerLiter: 2.959,
            totalAmount: 136.20,
            tankNumber: 2
          }
        ],
        combinedTotals: {
          totalVolume: 216.22,
          totalAmount: 643.20,
          blendedPrice: 2.975
        },
        confidence: 90,
        currency: 'AUD' // Default fallback
      });
    });

    it('should handle single tank data', () => {
      const singleTankMetadata = {
        provider: 'claude_vision',
        fuel_data: {
          receipt_type: 'fuel_receipt',
          station_name: 'BP Station',
          date: '2024-03-25',
          fuel_entries: [
            {
              fuel_type: 'Diesel',
              volume_liters: 80.5,
              price_per_liter: 1.45,
              total_amount: 116.73,
              tank_number: null
            }
          ],
          combined_totals: {
            total_volume_liters: 80.5,
            total_amount: 116.73,
            blended_price_per_liter: 1.45
          },
          confidence: 85
        }
      };

      const result = FuelReceiptParser.parseClaudeVisionResult(mockClaudeVisionResult, singleTankMetadata);

      expect(result.dualTankEntries).toHaveLength(1);
      expect(result.combinedTotals.totalVolume).toBe(80.5);
      expect(result.combinedTotals.blendedPrice).toBe(1.45);
    });

    it('should throw error for missing fuel data', () => {
      const invalidMetadata = { provider: 'claude_vision' };

      expect(() =>
        FuelReceiptParser.parseClaudeVisionResult(mockClaudeVisionResult, invalidMetadata)
      ).toThrow('No fuel data found in Claude Vision metadata');
    });
  });

  describe('combineTankData', () => {
    const dualTankEntries: DualTankEntry[] = [
      {
        fuelType: 'Premium Diesel',
        volumeLiters: 170.19,
        pricePerLiter: 2.979,
        totalAmount: 507.00,
        tankNumber: 1
      },
      {
        fuelType: 'Diesel',
        volumeLiters: 46.03,
        pricePerLiter: 2.959,
        totalAmount: 136.20,
        tankNumber: 2
      }
    ];

    it('should combine dual tank data correctly', () => {
      const result = FuelReceiptParser.combineTankData(dualTankEntries);

      expect(result).toEqual({
        totalVolume: 216.22,
        totalAmount: 643.20,
        blendedPrice: 2.975
      });
    });

    it('should handle single tank correctly', () => {
      const singleTank = dualTankEntries.slice(0, 1);
      const result = FuelReceiptParser.combineTankData(singleTank);

      expect(result).toEqual({
        totalVolume: 170.19,
        totalAmount: 507.00,
        blendedPrice: 2.979
      });
    });

    it('should throw error for empty array', () => {
      expect(() => FuelReceiptParser.combineTankData([])).toThrow('No fuel entries to combine');
    });
  });

  describe('convertToFuelLogValues', () => {
    const fuelReceiptData: FuelReceiptData = {
      receiptType: 'fuel_receipt',
      stationName: 'Shell Station',
      date: '2024-03-25',
      time: '14:30',
      odometerReading: 125000,
      dualTankEntries: [
        {
          fuelType: 'Premium Diesel',
          volumeLiters: 170.19,
          pricePerLiter: 2.979,
          totalAmount: 507.00,
          tankNumber: 1
        },
        {
          fuelType: 'Diesel',
          volumeLiters: 46.03,
          pricePerLiter: 2.959,
          totalAmount: 136.20,
          tankNumber: 2
        }
      ],
      combinedTotals: {
        totalVolume: 216.22,
        totalAmount: 643.20,
        blendedPrice: 2.975
      },
      confidence: 90,
      currency: 'AUD'
    };

    it('should convert to fuel log form values correctly', () => {
      const vehicleId = 'test-vehicle-123';
      const result = FuelReceiptParser.convertToFuelLogValues(fuelReceiptData, vehicleId);

      expect(result).toEqual({
        vehicle_id: 'test-vehicle-123',
        odometer: 125000,
        fill_date: new Date('2024-03-25'),
        fuel_amount: 216.22,
        fuel_price_per_unit: 2.975,
        total_cost: 643.20,
        fuel_type: 'diesel',
        fuel_station: 'Shell Station',
        currency: 'AUD',
        notes: expect.stringContaining('Tank 1: Premium Diesel'),
        full_tank: true
      });
    });

    it('should generate detailed notes with tank breakdown', () => {
      const vehicleId = 'test-vehicle-123';
      const result = FuelReceiptParser.convertToFuelLogValues(fuelReceiptData, vehicleId);

      expect(result.notes).toContain('Receipt processed from Shell Station');
      expect(result.notes).toContain('Tank 1: Premium Diesel - 170.19L @ $2.979/L = $507');
      expect(result.notes).toContain('Tank 2: Diesel - 46.03L @ $2.959/L = $136.2');
      expect(result.notes).toContain('Combined: 216.22L @ $2.975/L = $643.2');
      expect(result.notes).toContain('Confidence: 90%');
    });

    it('should handle single tank entries', () => {
      const singleTankData: FuelReceiptData = {
        ...fuelReceiptData,
        dualTankEntries: [fuelReceiptData.dualTankEntries[0]],
        combinedTotals: {
          totalVolume: 170.19,
          totalAmount: 507.00,
          blendedPrice: 2.979
        }
      };

      const result = FuelReceiptParser.convertToFuelLogValues(singleTankData, 'test-vehicle');

      expect(result.fuel_amount).toBe(170.19);
      expect(result.total_cost).toBe(507.00);
      expect(result.notes).toContain('Tank 1: Premium Diesel');
      expect(result.notes).not.toContain('Tank 2');
    });
  });

  describe('shouldRequireReview', () => {
    it('should require review for low confidence', () => {
      const lowConfidenceData = { ...mockFuelMetadata.fuel_data, confidence: 65 };
      expect(FuelReceiptParser.shouldRequireReview(lowConfidenceData)).toBe(true);
    });

    it('should require review for missing critical data', () => {
      const missingTotalData = {
        ...mockFuelMetadata.fuel_data,
        combined_totals: undefined
      };
      expect(FuelReceiptParser.shouldRequireReview(missingTotalData)).toBe(true);
    });

    it('should not require review for good data', () => {
      expect(FuelReceiptParser.shouldRequireReview(mockFuelMetadata.fuel_data)).toBe(false);
    });

    it('should require review for calculation mismatch', () => {
      const mismatchData = {
        ...mockFuelMetadata.fuel_data,
        fuel_entries: [
          {
            fuel_type: 'Diesel',
            volume_liters: 100,
            price_per_liter: 2.00,
            total_amount: 300, // Should be 200
            tank_number: 1
          }
        ],
        combined_totals: {
          total_volume_liters: 100,
          total_amount: 300,
          blended_price_per_liter: 3.00
        }
      };

      expect(FuelReceiptParser.shouldRequireReview(mismatchData)).toBe(true);
    });
  });

  describe('normalizeFuelType', () => {
    it('should normalize fuel types to standard values', () => {
      expect(FuelReceiptParser.normalizeFuelType('Premium Diesel')).toBe('diesel');
      expect(FuelReceiptParser.normalizeFuelType('Regular Diesel')).toBe('diesel');
      expect(FuelReceiptParser.normalizeFuelType('DIESEL')).toBe('diesel');
      expect(FuelReceiptParser.normalizeFuelType('Gasoline')).toBe('petrol');
      expect(FuelReceiptParser.normalizeFuelType('Unknown Fuel')).toBe('other');
    });
  });

  describe('detectCurrency', () => {
    it('should detect currency from text', () => {
      expect(FuelReceiptParser.detectCurrency('Shell AUD $2.50')).toBe('AUD');
      expect(FuelReceiptParser.detectCurrency('Shell USD $2.50')).toBe('USD');
      expect(FuelReceiptParser.detectCurrency('BP €1.45 EUR')).toBe('EUR');
      expect(FuelReceiptParser.detectCurrency('Default text')).toBe('AUD'); // Default
    });
  });
});