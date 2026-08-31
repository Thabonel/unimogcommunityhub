import { describe, expect, it } from 'vitest';
import {
  buildOpenAIRequest,
  normalizeFuelData,
  normalizeMediaType,
  parseFuelOcrJson,
  validateFuelOcrInput
} from '../../../../supabase/functions/_shared/fuel-ocr';

describe('fuel OCR shared helpers', () => {
  it('normalizes unsupported media types to jpeg', () => {
    expect(normalizeMediaType('image/jpg')).toBe('image/jpeg');
    expect(normalizeMediaType('application/pdf')).toBe('image/jpeg');
    expect(normalizeMediaType('image/png')).toBe('image/png');
  });

  it('fills combined totals from fuel entries', () => {
    const result = normalizeFuelData({
      fuel_entries: [
        { fuel_type: 'Diesel', volume_liters: 40, price_per_liter: 1.5, total_amount: 60 },
        { fuel_type: 'Diesel', volume_liters: 20, price_per_liter: 1.6, total_amount: 32 }
      ],
      confidence: 120
    });

    expect(result.total_volume).toBe(60);
    expect(result.total_amount).toBe(92);
    expect(result.combined_totals?.blended_price_per_liter).toBe(1.53);
    expect(result.confidence).toBe(100);
  });

  it('parses JSON returned with surrounding prose', () => {
    const result = parseFuelOcrJson('Here is the data {"station_name":"Shell","total_amount":42,"confidence":88} done');

    expect(result.station_name).toBe('Shell');
    expect(result.total_amount).toBe(42);
    expect(result.confidence).toBe(88);
  });

  it('normalizes numeric strings from provider output', () => {
    const result = parseFuelOcrJson('{"fuel_entries":[{"fuel_type":"Diesel","volume_liters":"40","price_per_liter":"1.5","total_amount":"60"}],"confidence":"90"}');

    expect(result.fuel_entries?.[0]).toMatchObject({ volume_liters: 40, price_per_liter: 1.5, total_amount: 60 });
    expect(result.total_volume).toBe(40);
    expect(result.total_amount).toBe(60);
    expect(result.confidence).toBe(90);
  });

  it('rejects unsupported or oversized image input', () => {
    expect(() => validateFuelOcrInput({ imageBase64: 'abc', mediaType: 'application/pdf' })).toThrow('Unsupported image type');
    expect(() => validateFuelOcrInput({ imageBase64: 'a'.repeat(14_000_004), mediaType: 'image/jpeg' })).toThrow('Image exceeds 10MB limit');
  });

  it('builds an OpenAI vision request with JSON response mode', () => {
    const request = buildOpenAIRequest({ imageBase64: 'abc123', mediaType: 'image/png' });

    expect(request.model).toBe('gpt-4o');
    expect(request.response_format).toEqual({ type: 'json_object' });
    expect(request.messages[0].content[1].image_url.url).toBe('data:image/png;base64,abc123');
  });
});
