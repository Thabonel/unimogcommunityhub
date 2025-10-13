import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { SettingsSection } from './SettingsSection'
import { BookOpen } from 'lucide-react'
import { CanonicalService } from '@/services/core/CanonicalService'
import { CanonicalSearchService, CanonicalSearchType } from '@/services/core/CanonicalSearchService'

export function AnswerEngineSettingsSection() {
  const [loading, setLoading] = useState(true)
  const [enabled, setEnabled] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [logs, setLogs] = useState<Array<{ created_at: string; endpoint: string; entity_type: string | null; identifier: string | null; status_code: number | null; success: boolean; query: string | null }>>([])
  const [logsLoading, setLogsLoading] = useState(true)

  // Tester state
  const [testType, setTestType] = useState<'model' | 'procedure' | 'part'>('model')
  const [testIdentifier, setTestIdentifier] = useState('U1700L')
  const [testResult, setTestResult] = useState<string>('')
  const [testing, setTesting] = useState(false)

  const [searchType, setSearchType] = useState<CanonicalSearchType>('model')
  const [searchQuery, setSearchQuery] = useState('U1700L')
  const [searchModelCode, setSearchModelCode] = useState('')
  const [searchResult, setSearchResult] = useState<string>('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    let cancel = false
    ;(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'enable_structured_data')
        .maybeSingle<{ value: { enabled?: boolean } }>()
      if (!cancel) {
        setEnabled(data?.value?.enabled ?? true)
        setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [])

  const loadLogs = async () => {
    setLogsLoading(true)
    try {
      const { data } = await supabase
        .from('canonical_access_logs')
        .select('created_at, endpoint, entity_type, identifier, status_code, success, query')
        .order('created_at', { ascending: false })
        .limit(5)
      setLogs(data || [])
    } finally {
      setLogsLoading(false)
    }
  }

  useEffect(() => { loadLogs() }, [])

  const onSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ key: 'enable_structured_data', value: { enabled } }, { onConflict: 'key' })
      if (error) throw error
      setSaved(true)
    } catch (e: any) {
      setError(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SettingsSection
      title="Answer Engine & Structured Data"
      description="Control whether canonical JSON‑LD is exposed for models, procedures, and parts."
      icon={BookOpen}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="enable-structured-data"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            disabled={loading || saving}
          />
          <label htmlFor="enable-structured-data" className="text-sm font-medium">
            Enable canonical JSON‑LD endpoints and page embeds
          </label>
        </div>
        <div className="text-xs text-gray-500">
          When enabled, answer engines can fetch canonical, citation‑friendly data via the /canonical API,
          and key pages embed non‑visual JSON‑LD for extraction.
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onSave}
            disabled={saving || loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-xs text-green-600">Saved</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
      </div>

      <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Recent Canonical Requests</div>
            <button onClick={loadLogs} className="text-xs text-blue-600 hover:underline" disabled={logsLoading}>Refresh</button>
          </div>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Endpoint</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Identifier/Query</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {logsLoading ? (
                  <tr><td className="p-2 text-gray-500" colSpan={5}>Loading…</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td className="p-2 text-gray-500" colSpan={5}>No recent requests</td></tr>
                ) : (
                  logs.map((l, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{new Date(l.created_at).toLocaleString()}</td>
                      <td className="p-2">{l.endpoint}</td>
                      <td className="p-2">{l.entity_type || '-'}</td>
                      <td className="p-2">{l.identifier || l.query || '-'}</td>
                      <td className="p-2">{l.success ? (l.status_code ?? 200) : (l.status_code ?? 500)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tester Panel */}
      <div className="mt-8 space-y-4">
        <div className="text-sm font-medium">Tester (Admin Only)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Canonical Fetch */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Fetch Canonical JSON‑LD</div>
            <div className="flex items-center gap-2">
              <select className="h-9 border rounded px-2" value={testType} onChange={(e) => {
                const t = e.target.value as 'model' | 'procedure' | 'part'
                setTestType(t)
                setTestIdentifier(t === 'model' ? 'U1700L' : t === 'procedure' ? '25.20.02' : 'A1234567890')
              }}>
                <option value="model">model</option>
                <option value="procedure">procedure</option>
                <option value="part">part</option>
              </select>
              <input
                className="flex-1 h-9 border rounded px-2"
                placeholder={testType === 'model' ? 'model slug (e.g., U1700L)' : testType === 'procedure' ? 'procedure code (e.g., 25.20.02)' : 'part number (MPN)'}
                value={testIdentifier}
                onChange={(e) => setTestIdentifier(e.target.value)}
              />
              <button
                className="h-9 px-3 rounded bg-blue-600 text-white disabled:opacity-50"
                disabled={testing || !testIdentifier}
                onClick={async () => {
                  setTesting(true)
                  setTestResult('')
                  try {
                    let data: any
                    if (testType === 'model') data = await CanonicalService.fetchEntity({ type: 'model', slug: testIdentifier })
                    else if (testType === 'procedure') data = await CanonicalService.fetchEntity({ type: 'procedure', code: testIdentifier })
                    else data = await CanonicalService.fetchEntity({ type: 'part', slug: testIdentifier })
                    setTestResult(JSON.stringify(data, null, 2))
                  } catch (e: any) {
                    setTestResult(`Error: ${e?.message || String(e)}`)
                  } finally {
                    setTesting(false)
                    loadLogs()
                  }
                }}
              >
                {testing ? 'Fetching…' : 'Fetch'}
              </button>
            </div>
            <textarea className="w-full h-48 border rounded p-2 font-mono text-xs" readOnly value={testResult} placeholder="Canonical JSON‑LD will appear here" />
          </div>

          {/* Canonical Search */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Search Canonical</div>
            <div className="flex items-center gap-2">
              <select className="h-9 border rounded px-2" value={searchType} onChange={(e) => setSearchType(e.target.value as CanonicalSearchType)}>
                <option value="model">model</option>
                <option value="procedure">procedure</option>
                <option value="part">part</option>
              </select>
              <input
                className="flex-1 h-9 border rounded px-2"
                placeholder="search query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <input
                className="h-9 border rounded px-2 w-40"
                placeholder="model_code (optional)"
                value={searchModelCode}
                onChange={(e) => setSearchModelCode(e.target.value)}
              />
              <button
                className="h-9 px-3 rounded bg-blue-600 text-white disabled:opacity-50"
                disabled={searching || !searchQuery}
                onClick={async () => {
                  setSearching(true)
                  setSearchResult('')
                  try {
                    const items = await CanonicalSearchService.search(searchQuery, searchType, 10, { modelCode: searchModelCode || undefined })
                    setSearchResult(JSON.stringify(items, null, 2))
                  } catch (e: any) {
                    setSearchResult(`Error: ${e?.message || String(e)}`)
                  } finally {
                    setSearching(false)
                    loadLogs()
                  }
                }}
              >
                {searching ? 'Searching…' : 'Search'}
              </button>
            </div>
            <textarea className="w-full h-48 border rounded p-2 font-mono text-xs" readOnly value={searchResult} placeholder="Search results will appear here" />
          </div>
        </div>
      </div>
    </SettingsSection>
  )
}
