import { RegisteredTool, ToolResult, ToolExecutionContext } from './types.ts';

// Simple in-memory cache to avoid duplicate API calls within a request cycle
const weatherCache = new Map<string, { data: unknown; at: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function cacheKey(lat: number, lon: number): string {
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

function getWmoDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] ?? 'Unknown';
}

async function execute(
  input: Record<string, unknown>,
  _ctx: ToolExecutionContext,
): Promise<ToolResult> {
  const t0 = Date.now();

  const lat = input.latitude != null ? Number(input.latitude) : _ctx.userLocation?.latitude;
  const lon = input.longitude != null ? Number(input.longitude) : _ctx.userLocation?.longitude;
  const days = Math.min(Number(input.forecast_days ?? 3), 7);

  if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) {
    return {
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'latitude and longitude are required (or user location must be available)',
        retriable: false,
      },
      metadata: { latency_ms: 0, source: 'open-meteo', timestamp: new Date().toISOString() },
    };
  }

  const key = cacheKey(lat, lon);
  const cached = weatherCache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return {
      ok: true,
      data: cached.data,
      metadata: { latency_ms: Date.now() - t0, source: 'open-meteo (cached)', timestamp: new Date().toISOString() },
    };
  }

  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat.toString());
    url.searchParams.set('longitude', lon.toString());
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,precipitation');
    url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max');
    url.searchParams.set('forecast_days', days.toString());
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('wind_speed_unit', 'kmh');

    const resp = await fetch(url.toString(), { signal: AbortSignal.timeout(4000) });
    if (!resp.ok) throw new Error(`Open-Meteo HTTP ${resp.status}`);
    const raw = await resp.json() as Record<string, unknown>;

    const current = raw.current as Record<string, unknown>;
    const daily = raw.daily as Record<string, unknown[]>;
    const ts = new Date().toISOString();

    const forecast = (daily.time as string[]).map((date, i) => ({
      date,
      condition: getWmoDescription((daily.weather_code as number[])[i]),
      max_temp_c: (daily.temperature_2m_max as number[])[i],
      min_temp_c: (daily.temperature_2m_min as number[])[i],
      precipitation_mm: (daily.precipitation_sum as number[])[i],
      max_wind_kmh: (daily.wind_speed_10m_max as number[])[i],
    }));

    const data = {
      location: { latitude: lat, longitude: lon },
      current: {
        condition: getWmoDescription(Number(current.weather_code)),
        temperature_c: current.temperature_2m,
        humidity_pct: current.relative_humidity_2m,
        wind_kmh: current.wind_speed_10m,
        precipitation_mm: current.precipitation,
      },
      forecast,
      source: 'Open-Meteo',
      as_of: ts,
      instructions: `Include "(Source: Open-Meteo, ${ts})" when presenting this weather data.`,
    };

    weatherCache.set(key, { data, at: Date.now() });

    return {
      ok: true,
      data,
      metadata: { latency_ms: Date.now() - t0, source: 'open-meteo', timestamp: ts },
    };
  } catch (err) {
    // Try returning cached data even if stale on upstream failure
    if (cached) {
      return {
        ok: true,
        data: { ...(cached.data as Record<string, unknown>), stale: true },
        metadata: { latency_ms: Date.now() - t0, source: 'open-meteo (stale cache)', timestamp: new Date().toISOString() },
      };
    }
    return {
      ok: false,
      error: { code: 'UPSTREAM_ERROR', message: String(err), retriable: true },
      metadata: { latency_ms: Date.now() - t0, source: 'open-meteo', timestamp: new Date().toISOString() },
    };
  }
}

export const getWeatherTool: RegisteredTool = {
  definition: {
    name: 'get_weather',
    description:
      "Get current weather and up to 7-day forecast for any location. Use when the user asks about weather, road conditions, or trip planning that depends on weather. Location coordinates are auto-filled from user's device if available.",
    input_schema: {
      type: 'object',
      properties: {
        latitude: { type: 'number', description: 'Latitude (decimal degrees). Omit to use user location.' },
        longitude: { type: 'number', description: 'Longitude (decimal degrees). Omit to use user location.' },
        forecast_days: { type: 'number', description: 'Days of forecast to return (1-7, default 3)' },
      },
      required: [],
    },
  },
  config: { timeout_ms: 4000, retries: 1, fallback: 'cached' },
  phase: 2,
  execute,
};
