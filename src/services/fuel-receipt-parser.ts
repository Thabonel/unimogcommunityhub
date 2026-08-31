/**
 * Fuel Receipt Parser Service
 * Handles Claude Vision OCR results and converts them to fuel log data with dual tank support
 */

import { ExtractedData } from './vehicle-ocr-service';
import { FuelLogFormValues } from '@/components/vehicle/fuel/FuelLogForm';

// Types for structured fuel receipt data
export interface DualTankEntry {
  fuelType: string;
  volumeLiters: number;
  pricePerLiter: number;
  totalAmount: number;
  tankNumber: number | null;
}

export interface CombinedTotals {
  totalVolume: number;
  totalAmount: number;
  blendedPrice: number;
}

export interface FuelReceiptData {
  receiptType: 'fuel_receipt' | 'dashboard_photo' | 'combined';
  stationName: string;
  date: string;
  time?: string;
  odometerReading?: number;
  dualTankEntries: DualTankEntry[];
  combinedTotals: CombinedTotals;
  confidence: number;
  currency: string;
}

interface ProviderFuelEntry {
  fuel_type?: string;
  volume_liters?: number | string;
  price_per_liter?: number | string;
  total_amount?: number | string;
  tank_number?: number | null;
}

interface ProviderFuelData {
  receipt_type?: FuelReceiptData['receiptType'];
  station_name?: string;
  date?: string;
  time?: string;
  fuel_entries?: ProviderFuelEntry[];
  combined_totals?: {
    total_volume_liters?: number | string;
    total_amount?: number | string;
    blended_price_per_liter?: number | string;
  };
  odometer_reading?: number;
  confidence?: number;
}

function numericValue(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Service for parsing Claude Vision OCR results and converting to fuel log data
 */
export class FuelReceiptParser {
  /**
   * Parse Claude Vision OCR result into structured fuel receipt data
   */
  static parseClaudeVisionResult(
    extractedData: ExtractedData,
    metadata: Record<string, unknown>
  ): FuelReceiptData {
    const fuelData = metadata.fuel_data as ProviderFuelData | undefined;

    if (!fuelData || typeof fuelData !== 'object') {
      throw new Error('No fuel data found in Claude Vision metadata');
    }

    // Parse dual tank entries
    const dualTankEntries: DualTankEntry[] = (fuelData.fuel_entries || []).map((entry) => ({
      fuelType: entry.fuel_type || 'Unknown',
      volumeLiters: numericValue(entry.volume_liters),
      pricePerLiter: numericValue(entry.price_per_liter),
      totalAmount: numericValue(entry.total_amount),
      tankNumber: entry.tank_number || null
    }));

    // Combine tank data if not already provided
    const combinedTotals: CombinedTotals = fuelData.combined_totals ? {
      totalVolume: numericValue(fuelData.combined_totals.total_volume_liters),
      totalAmount: numericValue(fuelData.combined_totals.total_amount),
      blendedPrice: numericValue(fuelData.combined_totals.blended_price_per_liter)
    } : this.combineTankData(dualTankEntries);

    // Detect currency from various sources
    const currency = this.detectCurrency(
      fuelData.station_name + ' ' + JSON.stringify(fuelData.fuel_entries)
    );

    return {
      receiptType: fuelData.receipt_type || 'fuel_receipt',
      stationName: fuelData.station_name || extractedData.vendor?.value || 'Unknown Station',
      date: fuelData.date || extractedData.date?.value || new Date().toISOString().split('T')[0],
      time: fuelData.time,
      odometerReading: fuelData.odometer_reading || extractedData.odometer?.value,
      dualTankEntries,
      combinedTotals,
      confidence: fuelData.confidence || extractedData.vendor?.confidence * 100 || 85,
      currency
    };
  }

  /**
   * Combine multiple tank entries into totals with blended pricing
   */
  static combineTankData(entries: DualTankEntry[]): CombinedTotals {
    if (entries.length === 0) {
      throw new Error('No fuel entries to combine');
    }

    const totalVolume = entries.reduce((sum, entry) => sum + entry.volumeLiters, 0);
    const totalAmount = entries.reduce((sum, entry) => sum + entry.totalAmount, 0);
    const blendedPrice = totalVolume > 0 ? totalAmount / totalVolume : 0;

    return {
      totalVolume: Math.round(totalVolume * 100) / 100, // Round to 2 decimals
      totalAmount: Math.round(totalAmount * 100) / 100,
      blendedPrice: Math.round(blendedPrice * 1000) / 1000 // Round to 3 decimals for fuel prices
    };
  }

  /**
   * Convert fuel receipt data to fuel log form values
   */
  static convertToFuelLogValues(
    fuelReceiptData: FuelReceiptData,
    vehicleId: string
  ): FuelLogFormValues {
    const notes = this.generateDetailedNotes(fuelReceiptData);

    return {
      vehicle_id: vehicleId,
      odometer: fuelReceiptData.odometerReading || 0,
      fill_date: new Date(fuelReceiptData.date),
      fuel_amount: fuelReceiptData.combinedTotals.totalVolume,
      fuel_price_per_unit: fuelReceiptData.combinedTotals.blendedPrice,
      total_cost: fuelReceiptData.combinedTotals.totalAmount,
      fuel_type: this.normalizeFuelType(fuelReceiptData.dualTankEntries[0]?.fuelType || 'diesel'),
      fuel_station: fuelReceiptData.stationName,
      currency: fuelReceiptData.currency,
      notes,
      full_tank: true // Assume full tank for receipt entries
    };
  }

  /**
   * Generate detailed notes with tank breakdown
   */
  static generateDetailedNotes(fuelReceiptData: FuelReceiptData): string {
    const lines: string[] = [];

    lines.push(`Receipt processed from ${fuelReceiptData.stationName}`);

    if (fuelReceiptData.time) {
      lines.push(`Date/Time: ${fuelReceiptData.date} at ${fuelReceiptData.time}`);
    } else {
      lines.push(`Date: ${fuelReceiptData.date}`);
    }

    lines.push(''); // Blank line

    // Tank breakdown
    if (fuelReceiptData.dualTankEntries.length > 1) {
      lines.push('Dual Tank Fill:');
      fuelReceiptData.dualTankEntries.forEach(entry => {
        const tankLabel = entry.tankNumber ? `Tank ${entry.tankNumber}` : 'Tank';
        lines.push(
          `${tankLabel}: ${entry.fuelType} - ${entry.volumeLiters}L @ $${entry.pricePerLiter}/L = $${entry.totalAmount}`
        );
      });
      lines.push('');
      lines.push(
        `Combined: ${fuelReceiptData.combinedTotals.totalVolume}L @ $${fuelReceiptData.combinedTotals.blendedPrice}/L = $${fuelReceiptData.combinedTotals.totalAmount}`
      );
    } else if (fuelReceiptData.dualTankEntries.length === 1) {
      const entry = fuelReceiptData.dualTankEntries[0];
      const tankLabel = entry.tankNumber ? `Tank ${entry.tankNumber}` : 'Single Tank';
      lines.push(
        `${tankLabel}: ${entry.fuelType} - ${entry.volumeLiters}L @ $${entry.pricePerLiter}/L = $${entry.totalAmount}`
      );
    }

    if (fuelReceiptData.odometerReading) {
      lines.push('');
      lines.push(`Odometer: ${fuelReceiptData.odometerReading} km`);
    }

    lines.push('');
    lines.push(`Confidence: ${fuelReceiptData.confidence}%`);
    lines.push('Auto-processed by AI vision OCR');

    return lines.join('\n');
  }

  /**
   * Determine if manual review is required based on confidence and data quality
   */
  static shouldRequireReview(fuelData: ProviderFuelData): boolean {
    // Low confidence threshold
    if ((fuelData.confidence || 0) < 70) {
      return true;
    }

    // Missing critical data
    if (!fuelData.combined_totals || !fuelData.fuel_entries?.length) {
      return true;
    }

    // Validation: Check if individual entries sum to combined totals
    const entries = fuelData.fuel_entries || [];
    const calculatedVolume = entries.reduce((sum, entry) =>
      sum + numericValue(entry.volume_liters), 0);
    const calculatedAmount = entries.reduce((sum, entry) =>
      sum + numericValue(entry.total_amount), 0);

    const declaredVolume = numericValue(fuelData.combined_totals.total_volume_liters);
    const declaredAmount = numericValue(fuelData.combined_totals.total_amount);

    // Allow 1% tolerance for rounding, but avoid division by zero
    if (declaredVolume > 0) {
      const volumeTolerance = Math.abs(calculatedVolume - declaredVolume) / declaredVolume;
      if (volumeTolerance > 0.01) {
        return true; // Volume calculation mismatch
      }
    }

    if (declaredAmount > 0) {
      const amountTolerance = Math.abs(calculatedAmount - declaredAmount) / declaredAmount;
      if (amountTolerance > 0.01) {
        return true; // Amount calculation mismatch
      }
    }

    // Check for suspicious prices (too high or too low) and internal consistency
    for (const entry of entries) {
      const price = numericValue(entry.price_per_liter);
      const volume = numericValue(entry.volume_liters);
      const amount = numericValue(entry.total_amount);

      if (price < 0.5 || price > 10.0) {
        return true; // Suspicious fuel price
      }

      // Check internal consistency: volume × price should equal amount
      if (volume > 0 && price > 0 && amount > 0) {
        const expectedAmount = volume * price;
        const amountTolerance = Math.abs(expectedAmount - amount) / amount;
        if (amountTolerance > 0.01) {
          return true; // Internal calculation mismatch
        }
      }
    }

    return false;
  }

  /**
   * Normalize fuel type to standard values used in the system
   */
  static normalizeFuelType(fuelType: string): string {
    const normalized = fuelType.toLowerCase().trim();

    if (normalized.includes('diesel') || normalized.includes('gasoil')) {
      return 'diesel';
    }

    if (normalized.includes('gasoline') || normalized.includes('petrol') || normalized.includes('gas')) {
      return 'petrol';
    }

    if (normalized.includes('electric') || normalized.includes('ev')) {
      return 'electric';
    }

    if (normalized.includes('hybrid')) {
      return 'hybrid';
    }

    if (normalized.includes('biodiesel') || normalized.includes('bio')) {
      return 'biodiesel';
    }

    if (normalized.includes('ethanol') || normalized.includes('e85')) {
      return 'ethanol';
    }

    if (normalized.includes('lpg') || normalized.includes('propane')) {
      return 'lpg';
    }

    return 'other';
  }

  /**
   * Detect currency from text content
   */
  static detectCurrency(textContent: string): string {
    const text = textContent.toLowerCase();

    if (text.includes('€') || text.includes('eur')) return 'EUR';
    if (text.includes('£') || text.includes('gbp')) return 'GBP';
    if (text.includes('¥') || text.includes('jpy')) return 'JPY';
    if (text.includes('₺') || text.includes('try') || text.includes('turkish')) return 'TRY';

    // Check for specific USD indicators first
    if (text.includes('$') && (text.includes('usd') || text.includes('us'))) return 'USD';
    if (text.includes('$') && (text.includes('cad') || text.includes('canada'))) return 'CAD';

    // Check for AUD indicators - Australia specific context
    if (text.includes('$') && (text.includes('aud') || text.includes('australia') || text.includes('au'))) return 'AUD';

    // Default to AUD for Australian context (Unimog Community Hub is Australia-focused)
    return 'AUD';
  }

  /**
   * Validate fuel receipt data structure
   */
  static validateFuelReceiptData(data: unknown): boolean {
    if (!data || typeof data !== 'object') return false;

    const fuelData = data as ProviderFuelData;

    if (!fuelData.fuel_entries || !Array.isArray(fuelData.fuel_entries)) return false;

    if (fuelData.fuel_entries.length === 0) return false;

    // Validate each entry has required fields
    for (const entry of fuelData.fuel_entries) {
      if (!entry.volume_liters || !entry.price_per_liter || !entry.total_amount) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate expected total from individual entries (for validation)
   */
  static calculateExpectedTotals(entries: ProviderFuelEntry[]): CombinedTotals {
    const totalVolume = entries.reduce((sum, entry) =>
      sum + numericValue(entry.volume_liters), 0);
    const totalAmount = entries.reduce((sum, entry) =>
      sum + numericValue(entry.total_amount), 0);

    return {
      totalVolume: Math.round(totalVolume * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      blendedPrice: totalVolume > 0 ? Math.round((totalAmount / totalVolume) * 1000) / 1000 : 0
    };
  }
}

// Export types for external use
export type { ExtractedData, FuelLogFormValues };
