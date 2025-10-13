export type CanonicalEntityType = 'model' | 'procedure' | 'part'

export class CanonicalService {
  static async fetchEntity(params: { type: CanonicalEntityType; slug?: string; id?: string; code?: string }) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
    if (!supabaseUrl) throw new Error('VITE_SUPABASE_URL not set')
    const url = new URL(`${supabaseUrl}/functions/v1/canonical`)
    url.searchParams.set('type', params.type)
    if (params.slug) url.searchParams.set('slug', params.slug)
    if (params.id) url.searchParams.set('id', params.id)
    if (params.code) url.searchParams.set('code', params.code)
    const res = await fetch(url.toString(), { headers: { Accept: 'application/ld+json' } })
    if (!res.ok) throw new Error(`Canonical fetch failed: ${res.status}`)
    return res.json()
  }
}

