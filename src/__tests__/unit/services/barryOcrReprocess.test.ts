import { describe, expect, it } from 'vitest';
import { removeDetMarkers } from '../../../../scripts/barry-ocr/reprocess-manual';

describe('removeDetMarkers', () => {
  it('strips layout markers and groups block lines', () => {
    const raw = [
      '<|det|>header [84, 20, 500, 40]<|/det|>Technical data',
      '<|det|>text [1, 2, 3, 4]<|/det|>Steering box',
      'Ratio in steering box 19.33 : 1',
      '<|det|>image [1, 2, 3, 4]<|/det|>',
    ].join('\n');
    const result = removeDetMarkers(raw);
    expect(result).toBe('Technical data\n\nSteering box\nRatio in steering box 19.33 : 1');
    expect(result).not.toContain('<|');
  });

  it('tolerates a leading closing tag emitted by the model', () => {
    const raw = '<|/det|>header [84, 20, 500, 40]<|/det|>01.8 Removal and Installation of Engine';
    const result = removeDetMarkers(raw);
    expect(result).toBe('01.8 Removal and Installation of Engine');
    expect(result).not.toContain('<|');
  });

  it('removes stray tags from otherwise clean lines', () => {
    const raw = '<|/det|>\nChecking tightness of universal joint';
    expect(removeDetMarkers(raw)).toBe('Checking tightness of universal joint');
  });

  it('returns empty text for image-only output', () => {
    expect(removeDetMarkers('<|det|>image [1, 2, 3, 4]<|/det|>')).toBe('');
  });
});
