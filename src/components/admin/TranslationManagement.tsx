import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, Edit, Trash2, Languages } from 'lucide-react';

interface Translation {
  id: string;
  translation_key: string;
  language_code: string;
  english_source: string;
  translated_text: string;
  translation_service: string;
  translation_context: string | null;
  is_verified: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

interface TranslationStats {
  total: number;
  verified: number;
  unverified: number;
  byLanguage: Record<string, number>;
  byService: Record<string, number>;
}

const LANGUAGE_NAMES: Record<string, string> = {
  de: 'German',
  tr: 'Turkish',
  es: 'Spanish'
};

export default function TranslationManagement() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadTranslations();
    loadStats();
  }, []);

  const loadTranslations = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('translation_cache')
        .select('*')
        .order('created_at', { ascending: false });

      if (filterLanguage !== 'all') {
        query = query.eq('language_code', filterLanguage);
      }

      if (filterVerified !== 'all') {
        query = query.eq('is_verified', filterVerified === 'verified');
      }

      const { data, error } = await query;

      if (error) throw error;

      setTranslations(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('translation_cache')
        .select('language_code, is_verified, translation_service');

      if (error) throw error;

      const stats: TranslationStats = {
        total: data.length,
        verified: data.filter(t => t.is_verified).length,
        unverified: data.filter(t => !t.is_verified).length,
        byLanguage: {},
        byService: {}
      };

      data.forEach(t => {
        stats.byLanguage[t.language_code] = (stats.byLanguage[t.language_code] || 0) + 1;
        stats.byService[t.translation_service] = (stats.byService[t.translation_service] || 0) + 1;
      });

      setStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleVerify = async (translation: Translation) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('translation_cache')
        .update({
          is_verified: true,
          verified_by: user.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', translation.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Translation verified'
      });

      loadTranslations();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (translation: Translation) => {
    setSelectedTranslation(translation);
    setEditedText(translation.translated_text);
    setCorrectionReason('');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedTranslation) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in',
          variant: 'destructive'
        });
        return;
      }

      const { error: updateError } = await supabase
        .from('translation_cache')
        .update({
          translated_text: editedText,
          is_verified: true,
          verified_by: user.id,
          verified_at: new Date().toISOString()
        })
        .eq('id', selectedTranslation.id);

      if (updateError) throw updateError;

      const { error: correctionError } = await supabase
        .from('translation_corrections')
        .insert({
          translation_cache_id: selectedTranslation.id,
          original_translation: selectedTranslation.translated_text,
          corrected_translation: editedText,
          correction_reason: correctionReason,
          corrected_by: user.id
        });

      if (correctionError) throw correctionError;

      toast({
        title: 'Success',
        description: 'Translation corrected and verified'
      });

      setEditDialogOpen(false);
      loadTranslations();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (translation: Translation) => {
    if (!confirm('Are you sure you want to delete this translation? Users will see English until it\'s re-translated.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('translation_cache')
        .delete()
        .eq('id', translation.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Translation deleted'
      });

      loadTranslations();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleVerifyAll = async () => {
    if (!confirm('Are you sure you want to verify all unverified translations?')) {
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('translation_cache')
        .update({
          is_verified: true,
          verified_by: user.id,
          verified_at: new Date().toISOString()
        })
        .eq('is_verified', false);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'All translations verified'
      });

      loadTranslations();
      loadStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Translation Management
          </CardTitle>
          <CardDescription>
            Review and manage AI-generated translations from the hybrid translation system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Translations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Verified</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Unverified</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.unverified}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {Object.entries(stats.byLanguage).map(([lang, count]) => (
                      <div key={lang}>
                        {LANGUAGE_NAMES[lang]}: {count}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex gap-4 mb-4">
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Languages</option>
              <option value="de">German</option>
              <option value="tr">Turkish</option>
              <option value="es">Spanish</option>
            </select>

            <select
              value={filterVerified}
              onChange={(e) => setFilterVerified(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>

            <Button onClick={loadTranslations}>Refresh</Button>

            {stats && stats.unverified > 0 && (
              <Button onClick={handleVerifyAll} variant="outline">
                Verify All ({stats.unverified})
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">Loading translations...</div>
          ) : translations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No translations found. They will appear here when users visit the site in non-English languages.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>English Source</TableHead>
                    <TableHead>Translation</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {translations.map((translation) => (
                    <TableRow key={translation.id}>
                      <TableCell className="font-mono text-xs max-w-[150px] truncate">
                        {translation.translation_key}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {LANGUAGE_NAMES[translation.language_code]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {translation.english_source}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {translation.translated_text}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{translation.usage_count}</Badge>
                      </TableCell>
                      <TableCell>
                        {translation.is_verified ? (
                          <Badge className="bg-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-orange-600 text-orange-600">
                            <XCircle className="w-3 h-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!translation.is_verified && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleVerify(translation)}
                              title="Verify translation"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(translation)}
                            title="Edit translation"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(translation)}
                            title="Delete translation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Translation</DialogTitle>
            <DialogDescription>
              Correct the AI-generated translation. Your correction will be logged and the translation will be marked as verified.
            </DialogDescription>
          </DialogHeader>

          {selectedTranslation && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Translation Key</label>
                <div className="font-mono text-xs bg-gray-100 p-2 rounded">
                  {selectedTranslation.translation_key}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Language</label>
                <div className="text-sm">
                  {LANGUAGE_NAMES[selectedTranslation.language_code]}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">English Source</label>
                <div className="text-sm bg-gray-50 p-2 rounded border">
                  {selectedTranslation.english_source}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">AI Translation</label>
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={3}
                  className="font-medium"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Correction Reason (optional)</label>
                <Input
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g., Better terminology, Fixed grammar, More natural phrasing"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save & Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
