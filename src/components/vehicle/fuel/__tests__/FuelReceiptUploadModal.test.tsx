/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FuelReceiptUploadModal } from '../FuelReceiptUploadModal';
import { Vehicle } from '@/hooks/vehicle-maintenance/types';
import { FuelReceiptData } from '@/services/fuel-receipt-parser';

// Mock hooks and services
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' }
  })
}));

vi.mock('@/lib/supabase-client', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({
          data: { path: 'test-path/receipt.jpg' },
          error: null
        }),
        getPublicUrl: vi.fn(() => ({
          data: { publicUrl: 'https://example.com/receipt.jpg' }
        }))
      }))
    },
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: {
          invoiceData: {
            vendor: { value: 'Shell Station', confidence: 0.95 },
            date: { value: '2026-03-25', confidence: 0.90 },
            total: { value: 65.50, confidence: 0.85 }
          },
          metadata: {
            fuel_data: {
              station_name: 'Shell Station',
              date: '2026-03-25',
              confidence: 95,
              fuel_entries: [{
                fuel_type: 'diesel',
                volume_liters: 45.5,
                price_per_liter: 1.44,
                total_amount: 65.52
              }],
              combined_totals: {
                total_volume_liters: 45.5,
                total_amount: 65.52,
                blended_price_per_liter: 1.44
              }
            }
          }
        },
        error: null
      })
    }
  }
}));

// Mock file reader
Object.defineProperty(global, 'FileReader', {
  writable: true,
  value: class {
    readAsDataURL = vi.fn();
    result = 'data:image/jpeg;base64,test-image-data';
    onload = null;

    constructor() {
      // Simulate immediate load
      setTimeout(() => {
        if (this.onload) this.onload();
      }, 0);
    }
  }
});

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:test-url');

describe('FuelReceiptUploadModal', () => {
  const mockVehicles: Vehicle[] = [
    {
      id: '1',
      user_id: 'test-user-id',
      name: 'Unimog U1700',
      model: 'U1700L',
      year: '2010',
      vin: 'TEST123456',
      license_plate: 'UNI-001',
      color: 'Military Green',
      created_at: '2026-01-01',
      updated_at: '2026-01-01'
    },
    {
      id: '2',
      user_id: 'test-user-id',
      name: 'Unimog U435',
      model: 'U435',
      year: '1995',
      vin: 'TEST654321',
      license_plate: 'UNI-002',
      color: 'Sand Beige',
      created_at: '2026-01-01',
      updated_at: '2026-01-01'
    }
  ];

  const mockProps = {
    open: true,
    onOpenChange: vi.fn(),
    vehicles: mockVehicles,
    userId: 'test-user-id',
    onReceiptProcessed: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders modal when open is true', () => {
    render(<FuelReceiptUploadModal {...mockProps} />);

    expect(screen.getByText('Upload Fuel Receipt')).toBeInTheDocument();
    expect(screen.getByText('Process your fuel receipt automatically with OCR technology')).toBeInTheDocument();
    expect(screen.getByText('Select Vehicle')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    render(<FuelReceiptUploadModal {...mockProps} open={false} />);

    expect(screen.queryByText('Upload Fuel Receipt')).not.toBeInTheDocument();
  });

  it('shows vehicle selection dropdown', () => {
    render(<FuelReceiptUploadModal {...mockProps} />);

    expect(screen.getByText('Choose a vehicle for this fuel receipt')).toBeInTheDocument();

    // Open the select
    fireEvent.click(screen.getByText('Choose a vehicle for this fuel receipt'));

    // Check that vehicles appear in dropdown
    expect(screen.getByText('Unimog U1700 (U1700L 2010)')).toBeInTheDocument();
    expect(screen.getByText('Unimog U435 (U435 1995)')).toBeInTheDocument();
  });

  it('shows upload zone with proper options', () => {
    render(<FuelReceiptUploadModal {...mockProps} />);

    expect(screen.getByText('Drag and drop your invoices here')).toBeInTheDocument();
    expect(screen.getByText('Choose Files')).toBeInTheDocument();
    expect(screen.getByText('Take Photo')).toBeInTheDocument();
  });

  it('disables process button when no vehicle selected', () => {
    render(<FuelReceiptUploadModal {...mockProps} />);

    const processButton = screen.getByText('Process Receipt');
    expect(processButton).toBeDisabled();
  });

  it('disables process button when no file uploaded', () => {
    render(<FuelReceiptUploadModal {...mockProps} />);

    // Select a vehicle
    fireEvent.click(screen.getByText('Choose a vehicle for this fuel receipt'));
    fireEvent.click(screen.getByText('Unimog U1700 (U1700L 2010)'));

    const processButton = screen.getByText('Process Receipt');
    expect(processButton).toBeDisabled();
  });

  it('enables process button when vehicle selected and file uploaded', async () => {
    render(<FuelReceiptUploadModal {...mockProps} />);

    // Select a vehicle
    fireEvent.click(screen.getByText('Choose a vehicle for this fuel receipt'));
    fireEvent.click(screen.getByText('Unimog U1700 (U1700L 2010)'));

    // Mock file upload
    const file = new File(['test'], 'receipt.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/choose files/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      const processButton = screen.getByText('Process Receipt');
      expect(processButton).not.toBeDisabled();
    });
  });

  it('shows processing step when receipt is being processed', async () => {
    const { rerender } = render(<FuelReceiptUploadModal {...mockProps} />);

    // Select vehicle and upload file
    fireEvent.click(screen.getByText('Choose a vehicle for this fuel receipt'));
    fireEvent.click(screen.getByText('Unimog U1700 (U1700L 2010)'));

    const file = new File(['test'], 'receipt.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/choose files/i);
    fireEvent.change(input, { target: { files: [file] } });

    // Click process button
    const processButton = await screen.findByText('Process Receipt');
    fireEvent.click(processButton);

    await waitFor(() => {
      expect(screen.getByText('Processing Receipt')).toBeInTheDocument();
      expect(screen.getByText('Uploading receipt image...')).toBeInTheDocument();
    });
  });

  it('calls onReceiptProcessed when processing completes successfully', async () => {
    const mockOnReceiptProcessed = vi.fn().mockResolvedValue(undefined);

    render(<FuelReceiptUploadModal {...mockProps} onReceiptProcessed={mockOnReceiptProcessed} />);

    // Select vehicle and upload file
    fireEvent.click(screen.getByText('Choose a vehicle for this fuel receipt'));
    fireEvent.click(screen.getByText('Unimog U1700 (U1700L 2010)'));

    const file = new File(['test'], 'receipt.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/choose files/i);
    fireEvent.change(input, { target: { files: [file] } });

    // Click process button
    const processButton = await screen.findByText('Process Receipt');
    fireEvent.click(processButton);

    await waitFor(() => {
      expect(mockOnReceiptProcessed).toHaveBeenCalled();
    }, { timeout: 5000 });

    const call = mockOnReceiptProcessed.mock.calls[0];
    expect(call[0]).toHaveProperty('stationName', 'Shell Station');
    expect(call[1]).toBe('1'); // vehicle ID
  });

  it('shows error when processing fails', async () => {
    // Mock failed upload
    vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Upload failed'));

    render(<FuelReceiptUploadModal {...mockProps} />);

    // Select vehicle and upload file
    fireEvent.click(screen.getByText('Choose a vehicle for this fuel receipt'));
    fireEvent.click(screen.getByText('Unimog U1700 (U1700L 2010)'));

    const file = new File(['test'], 'receipt.jpg', { type: 'image/jpeg' });
    const input = screen.getByLabelText(/choose files/i);
    fireEvent.change(input, { target: { files: [file] } });

    // Click process button
    const processButton = await screen.findByText('Process Receipt');
    fireEvent.click(processButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to process receipt/i)).toBeInTheDocument();
    });
  });

  it('closes modal when cancel button is clicked', () => {
    const mockOnOpenChange = vi.fn();

    render(<FuelReceiptUploadModal {...mockProps} onOpenChange={mockOnOpenChange} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('resets state when modal is opened/closed', () => {
    const { rerender } = render(<FuelReceiptUploadModal {...mockProps} open={false} />);

    // Open modal
    rerender(<FuelReceiptUploadModal {...mockProps} open={true} />);
    expect(screen.getByText('Upload Fuel Receipt')).toBeInTheDocument();

    // Close modal
    rerender(<FuelReceiptUploadModal {...mockProps} open={false} />);

    // Reopen modal
    rerender(<FuelReceiptUploadModal {...mockProps} open={true} />);

    // Should be back to initial state
    expect(screen.getByText('Choose a vehicle for this fuel receipt')).toBeInTheDocument();
    expect(screen.getByText('Process Receipt')).toBeDisabled();
  });
});