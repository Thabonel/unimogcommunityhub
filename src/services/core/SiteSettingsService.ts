import { supabase } from '@/lib/supabase-client'

type AppSetting = { key: string; value: any; updated_at?: string }

class SiteSettingsServiceImpl {
  private cache: Map<string, { value: any; ts: number }> = new Map()
  private ttlMs = 60_000 // 1 minute

  private async fetchRaw(key: string): Promise<any | null> {
    const { data } = await supabase
      .from('app_settings')
      .select('key, value, updated_at')
      .eq('key', key)
      .maybeSingle<AppSetting>()
    return data?.value ?? null
  }

  async get(key: string, fallback: any = null): Promise<any> {
    const now = Date.now()
    const hit = this.cache.get(key)
    if (hit && now - hit.ts < this.ttlMs) return hit.value
    try {
      const v = await this.fetchRaw(key)
      const value = v ?? fallback
      this.cache.set(key, { value, ts: now })
      return value
    } catch {
      return fallback
    }
  }

  async getStructuredDataEnabled(defaultEnabled = true): Promise<boolean> {
    const v = await this.get('enable_structured_data', { enabled: defaultEnabled })
    if (v && typeof v.enabled === 'boolean') return v.enabled
    return defaultEnabled
  }
}

export const SiteSettingsService = new SiteSettingsServiceImpl()

