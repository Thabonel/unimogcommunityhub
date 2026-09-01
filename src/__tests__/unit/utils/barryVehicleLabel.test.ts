import { describe, expect, it } from 'vitest';
import { formatBarryVehicleLabel } from '@/utils/barryVehicleLabel';

describe('formatBarryVehicleLabel', () => {
  it('formats the structured vehicle context used by Barry Tools', () => {
    expect(formatBarryVehicleLabel({
      model: 'U1700L',
      year: 1987,
      name: "Thabo's Mog",
    })).toBe('U1700L (1987) - "Thabo\'s Mog"');
  });

  it('falls back to the profile model when no vehicle is loaded', () => {
    expect(formatBarryVehicleLabel(undefined, 'U1300L')).toBe('U1300L');
  });

  it('uses a neutral label when no vehicle details are available', () => {
    expect(formatBarryVehicleLabel(undefined)).toBe('Your Unimog');
  });
});
