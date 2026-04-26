import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { SettingsSection } from './SettingsSection';
import { Activity, RefreshCw } from 'lucide-react';

interface ToolStat {
  tool_name: string;
  total_calls: number;
  avg_latency_ms: number | null;
  success_rate: number | null;
  citation_rate: number | null;
  last_seen: string | null;
}

function pct(rate: number | null): string {
  if (rate == null) return '—';
  return `${Math.round(rate * 100)}%`;
}

export function BarryToolsMonitorSection() {
  const [stats, setStats] = useState<ToolStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('barry_tool_stats')
        .select('tool_name,total_calls,avg_latency_ms,success_rate,citation_rate,last_seen');
      if (err) throw err;
      setStats(data ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load tool stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <SettingsSection
      title="Barry Tools — Execution Monitor"
      description="Per-tool call counts, latency, and success rates from barry_tool_executions."
      icon={Activity}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={load}
            disabled={loading}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
            {error}
          </div>
        )}

        {!loading && !error && stats.length === 0 && (
          <div className="text-sm text-gray-500 py-4 text-center">
            No tool executions recorded yet.
          </div>
        )}

        {stats.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-2 pr-4 font-medium">Tool</th>
                  <th className="pb-2 pr-4 font-medium text-right">Calls</th>
                  <th className="pb-2 pr-4 font-medium text-right">Avg Latency</th>
                  <th className="pb-2 pr-4 font-medium text-right">Success</th>
                  <th className="pb-2 pr-4 font-medium text-right">Cited</th>
                  <th className="pb-2 font-medium text-right">Last Used</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {stats.map((s) => (
                  <tr key={s.tool_name} className="hover:bg-muted/40">
                    <td className="py-2 pr-4 font-mono text-xs">{s.tool_name}</td>
                    <td className="py-2 pr-4 text-right font-medium">{s.total_calls}</td>
                    <td className="py-2 pr-4 text-right text-gray-600">
                      {s.avg_latency_ms != null ? `${s.avg_latency_ms}ms` : '—'}
                    </td>
                    <td className={`py-2 pr-4 text-right font-medium ${
                      s.success_rate == null ? 'text-gray-400'
                      : s.success_rate >= 0.95 ? 'text-green-600'
                      : s.success_rate >= 0.8 ? 'text-yellow-600'
                      : 'text-red-600'
                    }`}>
                      {pct(s.success_rate)}
                    </td>
                    <td className="py-2 pr-4 text-right text-gray-600">{pct(s.citation_rate)}</td>
                    <td className="py-2 text-right text-gray-400 text-xs">
                      {s.last_seen ? new Date(s.last_seen).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </SettingsSection>
  );
}
