import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';

type ConversionFn = (v: number) => number;

// From → to → function
const CONVERSIONS: Record<string, Record<string, ConversionFn>> = {
  nm: { 'ft-lb': v => v * 0.737562, 'ft_lb': v => v * 0.737562 },
  'ft-lb': { nm: v => v * 1.35582, 'ft_lb': v => v },
  'ft_lb': { nm: v => v * 1.35582, 'ft-lb': v => v },
  bar: { psi: v => v * 14.5038, kpa: v => v * 100 },
  psi: { bar: v => v * 0.0689476, kpa: v => v * 6.89476 },
  kpa: { bar: v => v / 100, psi: v => v / 6.89476 },
  liter: { litre: v => v, gallon: v => v * 0.264172, quart: v => v * 1.05669, 'us_gal': v => v * 0.264172 },
  litre: { liter: v => v, gallon: v => v * 0.264172, quart: v => v * 1.05669 },
  gallon: { liter: v => v * 3.78541, litre: v => v * 3.78541, quart: v => v * 4 },
  quart: { liter: v => v * 0.946353, litre: v => v * 0.946353, gallon: v => v * 0.25 },
  km: { mile: v => v * 0.621371, miles: v => v * 0.621371 },
  mile: { km: v => v * 1.60934, miles: v => v },
  miles: { km: v => v * 1.60934, mile: v => v },
  kmh: { mph: v => v * 0.621371 },
  mph: { kmh: v => v * 1.60934 },
  kg: { lb: v => v * 2.20462, lbs: v => v * 2.20462, pound: v => v * 2.20462 },
  lb: { kg: v => v * 0.453592, lbs: v => v },
  lbs: { kg: v => v * 0.453592, lb: v => v },
  celsius: { fahrenheit: v => v * 9 / 5 + 32, kelvin: v => v + 273.15 },
  fahrenheit: { celsius: v => (v - 32) * 5 / 9, kelvin: v => (v - 32) * 5 / 9 + 273.15 },
  kelvin: { celsius: v => v - 273.15, fahrenheit: v => (v - 273.15) * 9 / 5 + 32 },
  mm: { inch: v => v * 0.0393701, inches: v => v * 0.0393701 },
  inch: { mm: v => v * 25.4, inches: v => v },
  inches: { mm: v => v * 25.4, inch: v => v },
  cm: { inch: v => v * 0.393701, inches: v => v * 0.393701 },
  m: { ft: v => v * 3.28084, feet: v => v * 3.28084 },
  ft: { m: v => v * 0.3048, feet: v => v },
  feet: { m: v => v * 0.3048, ft: v => v },
};

function normalizeUnit(u: string): string {
  return u.toLowerCase().replace(/\s/g, '').replace(/s$/, '');
}

async function execute(
  input: Record<string, unknown>,
  _ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();
  const value = Number(input.value);
  const fromRaw = String(input.from_unit ?? '');
  const toRaw = String(input.to_unit ?? '');

  if (isNaN(value)) {
    return {
      ok: false,
      error: { code: 'INVALID_INPUT', message: 'value must be a number', retriable: false },
      metadata: { latency_ms: 0, source: 'convert-units', timestamp: new Date().toISOString() },
    };
  }

  const from = normalizeUnit(fromRaw);
  const to = normalizeUnit(toRaw);

  if (from === to) {
    return {
      ok: true,
      data: { input: value, from_unit: fromRaw, to_unit: toRaw, result: value, formula: 'same unit' },
      metadata: { latency_ms: Date.now() - t0, source: 'convert-units', timestamp: new Date().toISOString() },
    };
  }

  const fromTable = CONVERSIONS[from] ?? CONVERSIONS[fromRaw.toLowerCase()];
  const fn = fromTable?.[to] ?? fromTable?.[toRaw.toLowerCase()];

  if (!fn) {
    return {
      ok: false,
      error: {
        code: 'NOT_FOUND',
        message: `Cannot convert ${fromRaw} to ${toRaw}. Supported: nm/ft-lb, bar/psi/kpa, liter/gallon/quart, km/mile, kg/lb, celsius/fahrenheit, mm/inch, m/ft`,
        retriable: false,
      },
      metadata: { latency_ms: Date.now() - t0, source: 'convert-units', timestamp: new Date().toISOString() },
    };
  }

  const result = Math.round(fn(value) * 10000) / 10000;

  return {
    ok: true,
    data: { input: value, from_unit: fromRaw, to_unit: toRaw, result },
    metadata: { latency_ms: Date.now() - t0, source: 'convert-units', timestamp: new Date().toISOString() },
  };
}

export const convertUnitsTool: RegisteredTool = {
  definition: {
    name: 'convert_units',
    description:
      'Convert between units of measurement. Supports torque (Nm↔ft-lb), pressure (bar↔psi↔kPa), volume (liter↔gallon↔quart), distance (km↔miles), mass (kg↔lb), temperature (C↔F), and length (mm↔inch, m↔ft). No API call required.',
    input_schema: {
      type: 'object',
      properties: {
        value: { type: 'number', description: 'The numeric value to convert' },
        from_unit: { type: 'string', description: 'Source unit (e.g. "Nm", "bar", "liter", "km", "kg", "celsius")' },
        to_unit: { type: 'string', description: 'Target unit (e.g. "ft-lb", "psi", "gallon", "miles", "lb", "fahrenheit")' },
      },
      required: ['value', 'from_unit', 'to_unit'],
    },
  },
  config: { timeout_ms: 1000, retries: 0, fallback: 'none' },
  phase: 3,
  execute,
};
