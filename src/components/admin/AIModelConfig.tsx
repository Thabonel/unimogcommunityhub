import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Settings, Save, RotateCcw, AlertTriangle } from 'lucide-react';

interface ModelConfig {
  id: string;
  service_name: string;
  provider: string;
  model_name: string;
  api_key_env_var: string;
  temperature: number;
  max_tokens: number;
  is_active: boolean;
  fallback_provider?: string;
  fallback_model?: string;
  updated_at: string;
}

const PROVIDERS = [
  { value: 'openai', label: 'OpenAI', models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'] },
  { value: 'anthropic', label: 'Anthropic', models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'] },
  { value: 'google', label: 'Google', models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'] },
];

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'barry_query_expansion': 'Extracts search terms from user questions (fast, cheap)',
  'barry_reranking': 'Scores search results for relevance (fast, cheap)',
  'barry_verification': 'Verifies page relevance before citing (fast, cheap)',
  'barry_main_response': 'Generates main response to users (quality matters)',
};

export function AIModelConfig() {
  const [configs, setConfigs] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<ModelConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_model_config')
        .select('*')
        .order('service_name');

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error loading configs:', error);
      toast.error('Failed to load model configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: ModelConfig) => {
    setEditingConfig({ ...config });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingConfig) return;

    try {
      const { error } = await supabase
        .from('ai_model_config')
        .update({
          provider: editingConfig.provider,
          model_name: editingConfig.model_name,
          temperature: editingConfig.temperature,
          max_tokens: editingConfig.max_tokens,
          fallback_provider: editingConfig.fallback_provider || null,
          fallback_model: editingConfig.fallback_model || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingConfig.id);

      if (error) throw error;

      toast.success('Model configuration updated successfully', {
        description: 'Changes take effect immediately on next request',
      });

      setIsDialogOpen(false);
      loadConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    }
  };

  const toggleActive = async (config: ModelConfig) => {
    try {
      const { error } = await supabase
        .from('ai_model_config')
        .update({ is_active: !config.is_active })
        .eq('id', config.id);

      if (error) throw error;

      toast.success(config.is_active ? 'Model disabled' : 'Model enabled');
      loadConfigs();
    } catch (error) {
      console.error('Error toggling config:', error);
      toast.error('Failed to update status');
    }
  };

  const getProviderModels = (provider: string) => {
    return PROVIDERS.find(p => p.value === provider)?.models || [];
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Model Configuration
          </CardTitle>
          <CardDescription>
            Switch AI models instantly without redeployment. Changes take effect on the next request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Settings</TableHead>
                  <TableHead>Fallback</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{config.service_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {SERVICE_DESCRIPTIONS[config.service_name]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{config.provider}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{config.model_name}</TableCell>
                    <TableCell className="text-xs">
                      Temp: {config.temperature}<br />
                      Max: {config.max_tokens}
                    </TableCell>
                    <TableCell className="text-xs">
                      {config.fallback_provider ? (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {config.fallback_provider}/{config.fallback_model}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.is_active ? 'default' : 'secondary'}>
                        {config.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(config)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(config)}
                        >
                          {config.is_active ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Model Configuration</DialogTitle>
            <DialogDescription>
              Changes take effect immediately. No redeployment needed.
            </DialogDescription>
          </DialogHeader>

          {editingConfig && (
            <div className="space-y-4">
              <div>
                <Label>Service Name</Label>
                <Input value={editingConfig.service_name} disabled />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Provider</Label>
                  <Select
                    value={editingConfig.provider}
                    onValueChange={(value) =>
                      setEditingConfig({ ...editingConfig, provider: value, model_name: '' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Model</Label>
                  <Select
                    value={editingConfig.model_name}
                    onValueChange={(value) =>
                      setEditingConfig({ ...editingConfig, model_name: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getProviderModels(editingConfig.provider).map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Temperature (0-2)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={editingConfig.temperature}
                    onChange={(e) =>
                      setEditingConfig({
                        ...editingConfig,
                        temperature: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Max Tokens</Label>
                  <Input
                    type="number"
                    value={editingConfig.max_tokens}
                    onChange={(e) =>
                      setEditingConfig({
                        ...editingConfig,
                        max_tokens: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Fallback Configuration (Optional)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Fallback Provider</Label>
                    <Select
                      value={editingConfig.fallback_provider || 'none'}
                      onValueChange={(value) =>
                        setEditingConfig({
                          ...editingConfig,
                          fallback_provider: value === 'none' ? undefined : value,
                          fallback_model: value === 'none' ? undefined : editingConfig.fallback_model,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Fallback</SelectItem>
                        {PROVIDERS.map((provider) => (
                          <SelectItem key={provider.value} value={provider.value}>
                            {provider.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {editingConfig.fallback_provider && (
                    <div>
                      <Label>Fallback Model</Label>
                      <Select
                        value={editingConfig.fallback_model || ''}
                        onValueChange={(value) =>
                          setEditingConfig({ ...editingConfig, fallback_model: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getProviderModels(editingConfig.fallback_provider).map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
