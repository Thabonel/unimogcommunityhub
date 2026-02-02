import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { SettingsSection } from './SettingsSection';
import { Slider } from '@/components/ui/slider';
import { Bot, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface OpenClawConfig {
  openclaw_percentage: number;
  enable_fallback: boolean;
  track_metrics: boolean;
}

interface MetricsSummary {
  total_requests: number;
  openclaw_requests: number;
  legacy_requests: number;
  fallback_count: number;
  avg_openclaw_time_ms: number | null;
  avg_legacy_time_ms: number | null;
}

export function OpenClawSettingsSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<OpenClawConfig>({
    openclaw_percentage: 0,
    enable_fallback: true,
    track_metrics: true
  });
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  // Load current config
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('barry_openclaw_config')
        .select('config_key, config_value');

      if (error) throw error;

      const newConfig: OpenClawConfig = {
        openclaw_percentage: 0,
        enable_fallback: true,
        track_metrics: true
      };

      data?.forEach((row: { config_key: string; config_value: any }) => {
        if (row.config_key === 'openclaw_percentage') {
          newConfig.openclaw_percentage = typeof row.config_value === 'number'
            ? row.config_value
            : parseInt(String(row.config_value)) || 0;
        } else if (row.config_key === 'enable_fallback') {
          newConfig.enable_fallback = row.config_value === true || row.config_value === 'true';
        } else if (row.config_key === 'track_metrics') {
          newConfig.track_metrics = row.config_value === true || row.config_value === 'true';
        }
      });

      setConfig(newConfig);
    } catch (e: any) {
      setError(e?.message || 'Failed to load config');
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    setMetricsLoading(true);
    try {
      const { data, error } = await supabase
        .from('barry_ab_metrics')
        .select('used_openclaw, fallback_used, execution_time_ms')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      const summary: MetricsSummary = {
        total_requests: data?.length || 0,
        openclaw_requests: data?.filter((r: any) => r.used_openclaw).length || 0,
        legacy_requests: data?.filter((r: any) => !r.used_openclaw).length || 0,
        fallback_count: data?.filter((r: any) => r.fallback_used).length || 0,
        avg_openclaw_time_ms: null,
        avg_legacy_time_ms: null
      };

      const openclawTimes = data?.filter((r: any) => r.used_openclaw && r.execution_time_ms).map((r: any) => r.execution_time_ms) || [];
      const legacyTimes = data?.filter((r: any) => !r.used_openclaw && r.execution_time_ms).map((r: any) => r.execution_time_ms) || [];

      if (openclawTimes.length > 0) {
        summary.avg_openclaw_time_ms = Math.round(openclawTimes.reduce((a: number, b: number) => a + b, 0) / openclawTimes.length);
      }
      if (legacyTimes.length > 0) {
        summary.avg_legacy_time_ms = Math.round(legacyTimes.reduce((a: number, b: number) => a + b, 0) / legacyTimes.length);
      }

      setMetrics(summary);
    } catch (e) {
      console.error('Failed to load metrics:', e);
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const saveConfig = async (key: string, value: any) => {
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const { error } = await supabase
        .from('barry_openclaw_config')
        .update({ config_value: value })
        .eq('config_key', key);

      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePercentageChange = (value: number[]) => {
    const newValue = value[0];
    setConfig(prev => ({ ...prev, openclaw_percentage: newValue }));
  };

  const handlePercentageCommit = (value: number[]) => {
    saveConfig('openclaw_percentage', value[0]);
  };

  const getPercentageColor = (pct: number) => {
    if (pct === 0) return 'text-gray-500';
    if (pct < 25) return 'text-yellow-600';
    if (pct < 75) return 'text-blue-600';
    return 'text-green-600';
  };

  const getPercentageLabel = (pct: number) => {
    if (pct === 0) return 'Disabled (Legacy Only)';
    if (pct < 25) return 'Testing';
    if (pct < 50) return 'Gradual Rollout';
    if (pct < 100) return 'Majority OpenClaw';
    return 'Full OpenClaw';
  };

  return (
    <SettingsSection
      title="Barry AI Engine (OpenClaw)"
      description="Control the rollout of the new skill-based Barry AI architecture."
      icon={Bot}
    >
      <div className="space-y-6">
        {/* Main Percentage Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">OpenClaw Traffic Percentage</label>
            <span className={`text-2xl font-bold ${getPercentageColor(config.openclaw_percentage)}`}>
              {config.openclaw_percentage}%
            </span>
          </div>

          <Slider
            value={[config.openclaw_percentage]}
            onValueChange={handlePercentageChange}
            onValueCommit={handlePercentageCommit}
            max={100}
            step={5}
            disabled={loading || saving}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>0% (Legacy)</span>
            <span>50%</span>
            <span>100% (OpenClaw)</span>
          </div>

          <div className={`text-sm ${getPercentageColor(config.openclaw_percentage)}`}>
            {getPercentageLabel(config.openclaw_percentage)}
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex gap-2 flex-wrap">
          {[0, 10, 25, 50, 100].map(pct => (
            <button
              key={pct}
              onClick={() => {
                setConfig(prev => ({ ...prev, openclaw_percentage: pct }));
                saveConfig('openclaw_percentage', pct);
              }}
              disabled={loading || saving}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                config.openclaw_percentage === pct
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background hover:bg-muted border-input'
              }`}
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enable-fallback"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={config.enable_fallback}
              onChange={(e) => {
                const newValue = e.target.checked;
                setConfig(prev => ({ ...prev, enable_fallback: newValue }));
                saveConfig('enable_fallback', newValue);
              }}
              disabled={loading || saving}
            />
            <label htmlFor="enable-fallback" className="text-sm">
              Enable fallback to legacy if OpenClaw fails
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="track-metrics"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={config.track_metrics}
              onChange={(e) => {
                const newValue = e.target.checked;
                setConfig(prev => ({ ...prev, track_metrics: newValue }));
                saveConfig('track_metrics', newValue);
              }}
              disabled={loading || saving}
            />
            <label htmlFor="track-metrics" className="text-sm">
              Track A/B comparison metrics
            </label>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-sm">
          {saving && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-gray-500">Saving...</span>
            </>
          )}
          {saved && (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Saved</span>
            </>
          )}
          {error && (
            <>
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-600">{error}</span>
            </>
          )}
        </div>

        {/* Metrics Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Last 24 Hours</span>
            <button
              onClick={loadMetrics}
              disabled={metricsLoading}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${metricsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {metrics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-2xl font-bold">{metrics.total_requests}</div>
                <div className="text-xs text-gray-500">Total Requests</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">{metrics.openclaw_requests}</div>
                <div className="text-xs text-gray-500">OpenClaw</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-2xl font-bold text-gray-600">{metrics.legacy_requests}</div>
                <div className="text-xs text-gray-500">Legacy</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">{metrics.fallback_count}</div>
                <div className="text-xs text-gray-500">Fallbacks</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              {metricsLoading ? 'Loading metrics...' : 'No metrics available'}
            </div>
          )}

          {metrics && (metrics.avg_openclaw_time_ms || metrics.avg_legacy_time_ms) && (
            <div className="mt-3 text-xs text-gray-500">
              Avg response time:
              {metrics.avg_openclaw_time_ms && (
                <span className="ml-2">OpenClaw: <strong>{metrics.avg_openclaw_time_ms}ms</strong></span>
              )}
              {metrics.avg_legacy_time_ms && (
                <span className="ml-2">Legacy: <strong>{metrics.avg_legacy_time_ms}ms</strong></span>
              )}
            </div>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}
