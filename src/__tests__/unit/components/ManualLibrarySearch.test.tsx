import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ManualLibrarySearch } from '@/components/knowledge/ManualLibrarySearch';
import type { StorageManual } from '@/types/manuals';

const { mockUseManualSearch } = vi.hoisted(() => ({
  mockUseManualSearch: vi.fn(),
}));

vi.mock('@/hooks/manuals', () => ({
  useManualSearch: mockUseManualSearch,
}));

const manuals: StorageManual[] = [{
  name: 'U435_Workshop_Manual.pdf',
  size: 1024,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  metadata: { title: 'U435 Workshop Manual', description: 'Workshop manual' },
}];

describe('ManualLibrarySearch', () => {
  beforeEach(() => {
    mockUseManualSearch.mockReturnValue({ results: [], isSearching: false, error: null });
  });

  it('renders an OCR search field when manuals are accessible', () => {
    render(<ManualLibrarySearch manuals={manuals} onOpenResult={vi.fn()} />);

    expect(screen.getByRole('searchbox', { name: 'Search inside all vehicle manuals' })).toBeInTheDocument();
    expect(screen.getByText(/including scanned photocopies/i)).toBeInTheDocument();
  });

  it('opens the selected PDF result at its indexed page', () => {
    const onOpenResult = vi.fn();
    const result = {
      id: 'chunk-1',
      chunkId: 'chunk-1',
      fileName: 'U435_Workshop_Manual.pdf',
      manualTitle: 'U435 Workshop Manual',
      sectionTitle: 'Steering box',
      pageNumber: 946,
      snippet: 'Tighten the clamping bolt to 64 Nm.',
      source: 'ocr' as const,
      relevance: 10,
    };
    mockUseManualSearch.mockReturnValue({ results: [result], isSearching: false, error: null });

    render(<ManualLibrarySearch manuals={manuals} onOpenResult={onOpenResult} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'steering' } });
    fireEvent.click(screen.getByRole('button', { name: /U435 Workshop Manual/i }));

    expect(onOpenResult).toHaveBeenCalledWith(result);
    expect(screen.getByText('Page 946')).toBeInTheDocument();
  });
});
