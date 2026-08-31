export type FuelOcrProvider = 'openai' | 'anthropic'

export interface FuelOcrInput {
  imageBase64: string
  mediaType?: string
}

export interface FuelEntry {
  fuel_type: string
  volume_liters: number
  price_per_liter: number
  total_amount: number
  tank_number?: number | null
}

export interface FuelOcrData {
  receipt_type?: 'fuel_receipt' | 'dashboard_photo' | 'combined'
  station_name?: string
  date?: string
  time?: string
  fuel_entries?: FuelEntry[]
  combined_totals?: {
    total_volume_liters: number
    total_amount: number
    blended_price_per_liter: number
  }
  total_volume?: number
  total_amount?: number
  odometer_reading?: number | null
  confidence?: number
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])

export const FUEL_OCR_PROMPT = `Analyze this fuel receipt, service receipt, invoice, or dashboard photo for a Unimog vehicle. Extract data and respond only with valid JSON:

{
  "receipt_type": "fuel_receipt" | "dashboard_photo" | "combined",
  "station_name": "vendor or station name",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "fuel_entries": [{
    "fuel_type": "Diesel",
    "volume_liters": 85.5,
    "price_per_liter": 1.45,
    "total_amount": 123.98,
    "tank_number": null
  }],
  "combined_totals": {
    "total_volume_liters": 85.5,
    "total_amount": 123.98,
    "blended_price_per_liter": 1.45
  },
  "total_volume": 85.5,
  "total_amount": 123.98,
  "odometer_reading": null,
  "confidence": 90
}

Rules:
1. For dual-tank Unimogs, keep individual fuel entries and calculate combined totals.
2. Use liters for volume. Convert gallons to liters when needed.
3. Use the receipt currency amounts exactly; do not convert currency.
4. Extract odometer readings from dashboard photos when visible.
5. Set confidence from 0 to 100 based on image clarity and field completeness.`

export function normalizeMediaType(mediaType?: string): string {
  switch (mediaType) {
    case 'image/png':
    case 'image/webp':
    case 'image/gif':
    case 'image/jpeg':
      return mediaType
    case 'image/jpg':
      return 'image/jpeg'
    default:
      return 'image/jpeg'
  }
}

export function validateFuelOcrInput(input: FuelOcrInput): void {
  if (typeof input.imageBase64 !== 'string' || input.imageBase64.length === 0) {
    throw new Error('imageBase64 required')
  }

  if (input.mediaType && !SUPPORTED_IMAGE_TYPES.has(input.mediaType)) {
    throw new Error(`Unsupported image type: ${input.mediaType}`)
  }

  const paddingBytes = input.imageBase64.endsWith('==') ? 2 : input.imageBase64.endsWith('=') ? 1 : 0
  const decodedBytes = Math.floor(input.imageBase64.length * 3 / 4) - paddingBytes
  if (decodedBytes > MAX_IMAGE_BYTES) {
    throw new Error('Image exceeds 10MB limit')
  }
}

export function parseFuelOcrJson(content: string): FuelOcrData {
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('OCR provider did not return JSON')
  }

  const parsed = JSON.parse(jsonMatch[0]) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('OCR provider returned invalid JSON')
  }
  return normalizeFuelData(parsed as FuelOcrData)
}

export function normalizeFuelData(data: FuelOcrData): FuelOcrData {
  const fuelEntries = Array.isArray(data.fuel_entries)
    ? data.fuel_entries
      .filter((entry): entry is FuelEntry => Boolean(entry) && typeof entry === 'object')
      .map((entry) => ({
        ...entry,
        fuel_type: typeof entry.fuel_type === 'string' ? entry.fuel_type : 'Unknown',
        volume_liters: safeNumber(entry.volume_liters),
        price_per_liter: safeNumber(entry.price_per_liter),
        total_amount: safeNumber(entry.total_amount)
      }))
    : []
  const entryVolume = fuelEntries.reduce((sum, entry) => sum + safeNumber(entry.volume_liters), 0)
  const entryTotal = fuelEntries.reduce((sum, entry) => sum + safeNumber(entry.total_amount), 0)
  const totalVolume = safeNumber(data.combined_totals?.total_volume_liters) || safeNumber(data.total_volume) || entryVolume
  const totalAmount = safeNumber(data.combined_totals?.total_amount) || safeNumber(data.total_amount) || entryTotal
  const blendedPrice = totalVolume > 0 ? roundCurrency(totalAmount / totalVolume) : 0

  return {
    ...data,
    fuel_entries: fuelEntries,
    combined_totals: {
      total_volume_liters: roundMeasurement(totalVolume),
      total_amount: roundCurrency(totalAmount),
      blended_price_per_liter: safeNumber(data.combined_totals?.blended_price_per_liter) || blendedPrice
    },
    total_volume: roundMeasurement(totalVolume),
    total_amount: roundCurrency(totalAmount),
    confidence: clampConfidence(data.confidence)
  }
}

export function buildOpenAIRequest(input: FuelOcrInput) {
  const mediaType = normalizeMediaType(input.mediaType)
  return {
    model: 'gpt-4o',
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [{
      role: 'user',
      content: [{ type: 'text', text: FUEL_OCR_PROMPT }, {
        type: 'image_url',
        image_url: { url: `data:${mediaType};base64,${input.imageBase64}` }
      }]
    }]
  }
}

export function buildAnthropicRequest(input: FuelOcrInput) {
  return {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: [{
        type: 'image',
        source: { type: 'base64', media_type: normalizeMediaType(input.mediaType), data: input.imageBase64 }
      }, { type: 'text', text: FUEL_OCR_PROMPT }]
    }]
  }
}

function safeNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

function roundMeasurement(value: number): number {
  return Math.round(value * 1000) / 1000
}

function clampConfidence(value: unknown): number {
  const confidence = safeNumber(value)
  return Math.max(0, Math.min(100, confidence || 50))
}
