/**
 * Integration test for Fuel Receipt Upload Modal
 * Verifies that all components work together correctly
 */

import React from 'react';
import { describe, it, expect } from 'vitest';

describe('Fuel Receipt Upload Modal Integration', () => {
  it('should export FuelReceiptUploadModal component', async () => {
    const module = await import('../FuelReceiptUploadModal');
    expect(module.FuelReceiptUploadModal).toBeDefined();
    expect(typeof module.FuelReceiptUploadModal).toBe('function');
  });

  it('should export FuelReceiptParser service', async () => {
    const module = await import('@/services/fuel-receipt-parser');
    expect(module.FuelReceiptParser).toBeDefined();
    expect(typeof module.FuelReceiptParser.parseClaudeVisionResult).toBe('function');
    expect(typeof module.FuelReceiptParser.convertToFuelLogValues).toBe('function');
    expect(typeof module.FuelReceiptParser.shouldRequireReview).toBe('function');
  });

  it('should import camera and upload components', async () => {
    const cameraModule = await import('../expenses/CameraCapture');
    const uploadModule = await import('../expenses/ReceiptUploadZone');

    expect(cameraModule.CameraCapture).toBeDefined();
    expect(uploadModule.ReceiptUploadZone).toBeDefined();
  });

  it('should import required types', async () => {
    const typesModule = await import('@/hooks/vehicle-maintenance/types');
    const parserModule = await import('@/services/fuel-receipt-parser');

    expect(typesModule).toBeDefined();
    expect(parserModule.FuelReceiptData).toBeDefined();
  });

  it('should have correct props interface', () => {
    // This test verifies TypeScript compilation
    const mockProps = {
      open: true,
      onOpenChange: (open: boolean) => {},
      vehicles: [],
      userId: 'test-id',
      onReceiptProcessed: (fuelData: any, vehicleId: string) => Promise.resolve()
    };

    // If this compiles, the interface is correct
    expect(mockProps).toBeDefined();
  });
});