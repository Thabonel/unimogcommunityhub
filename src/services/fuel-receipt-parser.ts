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

/**
 * Service for parsing Claude Vision OCR results and converting to fuel log data
 */
export class FuelReceiptParser {
  /**
   * Parse Claude Vision OCR result into structured fuel receipt data
   */
  static parseClaudeVisionResult(
    extractedData: ExtractedData,
    metadata: Record<string, any>
  ): FuelReceiptData {
    const fuelData = metadata.fuel_data;

    if (!fuelData) {
      throw new Error('No fuel data found in Claude Vision metadata');
    }

    // Parse dual tank entries
    const dualTankEntries: DualTankEntry[] = (fuelData.fuel_entries || []).map((entry: any) => ({
      fuelType: entry.fuel_type || 'Unknown',
      volumeLiters: parseFloat(entry.volume_liters) || 0,
      pricePerLiter: parseFloat(entry.price_per_liter) || 0,
      totalAmount: parseFloat(entry.total_amount) || 0,
      tankNumber: entry.tank_number || null
    }));

    // Combine tank data if not already provided
    const combinedTotals: CombinedTotals = fuelData.combined_totals ? {
      totalVolume: parseFloat(fuelData.combined_totals.total_volume_liters) || 0,
      totalAmount: parseFloat(fuelData.combined_totals.total_amount) || 0,
      blendedPrice: parseFloat(fuelData.combined_totals.blended_price_per_liter) || 0
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
    lines.push('Auto-processed by Claude Vision OCR');

    return lines.join('\n');
  }

  /**
   * Determine if manual review is required based on confidence and data quality
   */
  static shouldRequireReview(fuelData: any): boolean {
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
    const calculatedVolume = entries.reduce((sum: number, entry: any) =>
      sum + (parseFloat(entry.volume_liters) || 0), 0);
    const calculatedAmount = entries.reduce((sum: number, entry: any) =>
      sum + (parseFloat(entry.total_amount) || 0), 0);

    const declaredVolume = parseFloat(fuelData.combined_totals.total_volume_liters) || 0;
    const declaredAmount = parseFloat(fuelData.combined_totals.total_amount) || 0;

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
      const price = parseFloat(entry.price_per_liter) || 0;
      const volume = parseFloat(entry.volume_liters) || 0;
      const amount = parseFloat(entry.total_amount) || 0;

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
  static validateFuelReceiptData(data: any): boolean {
    if (!data || typeof data !== 'object') return false;

    if (!data.fuel_entries || !Array.isArray(data.fuel_entries)) return false;

    if (data.fuel_entries.length === 0) return false;

    // Validate each entry has required fields
    for (const entry of data.fuel_entries) {
      if (!entry.volume_liters || !entry.price_per_liter || !entry.total_amount) {
        return false;
      }
    }

    return true;
  }

  /**
   * Calculate expected total from individual entries (for validation)
   */
  static calculateExpectedTotals(entries: any[]): CombinedTotals {
    const totalVolume = entries.reduce((sum, entry) =>
      sum + (parseFloat(entry.volume_liters) || 0), 0);
    const totalAmount = entries.reduce((sum, entry) =>
      sum + (parseFloat(entry.total_amount) || 0), 0);

    return {
      totalVolume: Math.round(totalVolume * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      blendedPrice: totalVolume > 0 ? Math.round((totalAmount / totalVolume) * 1000) / 1000 : 0
    };
  }
}

// Export types for external use
export type { ExtractedData, FuelLogFormValues };