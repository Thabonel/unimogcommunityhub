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

  it('strips bare category-and-bbox fragments without tags', () => {
    const raw = 'header [105, 26\n.13 Assembly of main transmission\ntext [480, 64, 191, 136] Fit bearing cover';
    const result = removeDetMarkers(raw);
    expect(result).toContain('Assembly of main transmission');
    expect(result).toContain('Fit bearing cover');
    expect(result).not.toMatch(/header \[|text \[/);
  });

  it('drops non-text region markers', () => {
    const raw = '<|det|>header [97, 64, 191, 136][Non-Text]<|/det|>\n<|det|>text [1, 2, 3, 4]<|/det|>Real content';
    expect(removeDetMarkers(raw)).toBe('Real content');
  });

  it('drops standalone non-text markers on their own line', () => {
    const raw = 'header [97, 64, 191, 136]<|/det|>[Non-Text]\n<|det|>text [1, 2, 3, 4]<|/det|>Mercedes-Benz';
    expect(removeDetMarkers(raw)).toBe('Mercedes-Benz');
  });

  it('returns empty text for image-only output', () => {
    expect(removeDetMarkers('<|det|>image [1, 2, 3, 4]<|/det|>')).toBe('');
  });

  it('trims degenerate empty table-row padding', () => {
    const padded = '<table><tr><td>Ratio</td><td>19.33 : 1</td></tr>'
      + '<tr><td></td><td></td></tr>'.repeat(200)
      + '</table>';
    const result = removeDetMarkers(padded);
    expect(result).toContain('19.33 : 1');
    expect(result.length).toBeLessThan(400);
  });

  it('preserves table markup', () => {
    const raw = '<|det|>table [178, 520, 685, 934]<|/det|><table><tr><td>14</td><td>Sealing ring</td></tr></table>';
    expect(removeDetMarkers(raw)).toBe('<table><tr><td>14</td><td>Sealing ring</td></tr></table>');
  });
});
