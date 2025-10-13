export type CanonicalSearchType = 'model' | 'procedure' | 'part'

export interface CanonicalSearchItem {
  type: CanonicalSearchType
  id: string
  name: string
  slug?: string
  code?: string
  canonical_id: string
}

export class CanonicalSearchService {
  static async search(q: string, type: CanonicalSearchType, limit = 10, opts?: { modelCode?: string }): Promise<CanonicalSearchItem[]> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
    if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL not set')
    const url = new URL(`${supabaseUrl}/functions/v1/canonical-search`)
    url.searchParams.set('q', q)
    url.searchParams.set('type', type)
    url.searchParams.set('limit', String(limit))
    if (opts?.modelCode) url.searchParams.set('model_code', opts.modelCode)
    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`Canonical search failed: ${res.status}`)
    const data = await res.json()
    return data?.items || []
  }
}
