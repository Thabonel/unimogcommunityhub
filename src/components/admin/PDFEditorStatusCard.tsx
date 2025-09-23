import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAdmin } from '@/contexts/AdminContext';

interface PDFStats {
  total: number;
  needsEditing: number;
  pending: number;
  approved: number;
}

export function PDFEditorStatusCard() {
  const [stats, setStats] = useState<PDFStats>({
    total: 0,
    needsEditing: 0,
    pending: 0,
    approved: 0
  });
  const [loading, setLoading] = useState(true);
  const { setCurrentSection } = useAdmin();

  const fetchPDFStats = async () => {
    try {
      const { data, error } = await supabase
        .from('manual_metadata')
        .select('id, title, category, model_codes, approval_status');

      if (error) throw error;

      const total = data?.length || 0;
      let needsEditing = 0;
      let pending = 0;
      let approved = 0;

      data?.forEach(manual => {
        // Count manuals that need editing (missing key metadata)
        if (!manual.category ||
            !manual.model_codes ||
            manual.model_codes.length === 0 ||
            manual.title.includes('.pdf') ||
            manual.title.toLowerCase() === manual.title) {
          needsEditing++;
        }

        // Count by approval status
        if (manual.approval_status === 'pending') {
          pending++;
        } else if (manual.approval_status === 'approved') {
          approved++;
        }
      });

      setStats({
        total,
        needsEditing,
        pending,
        approved
      });
    } catch (error) {
      console.error('Error fetching PDF stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFStats();
  }, []);

  const handleEditPDFs = () => {
    setCurrentSection('manuals');
    // Scroll to manuals section or trigger navigation
    setTimeout(() => {
      const tabTrigger = document.querySelector('[value="editor"]');
      if (tabTrigger) {
        (tabTrigger as HTMLElement).click();
      }
    }, 100);
  };

  const getStatusColor = (count: number, total: number) => {
    if (count === 0) return 'text-green-600';
    if (count / total > 0.5) return 'text-red-600';
    return 'text-yellow-600';
  };

  const getUrgencyLevel = () => {
    if (stats.needsEditing === 0) return 'success';
    if (stats.needsEditing > stats.total * 0.5) return 'urgent';
    return 'attention';
  };

  const urgencyConfig = {
    success: {
      title: 'PDFs Well Organized',
      description: 'All manuals have proper metadata',
      color: 'border-green-200 bg-green-50',
      badgeColor: 'bg-green-100 text-green-800'
    },
    attention: {
      title: 'PDFs Need Attention',
      description: 'Some manuals need metadata updates',
      color: 'border-yellow-200 bg-yellow-50',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    },
    urgent: {
      title: 'PDFs Need Editing',
      description: 'Many manuals missing important metadata',
      color: 'border-red-200 bg-red-50',
      badgeColor: 'bg-red-100 text-red-800'
    }
  };

  const config = urgencyConfig[getUrgencyLevel()];

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={config.color}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            PDF Metadata Editor
          </div>
          {stats.needsEditing > 0 && (
            <Badge className={config.badgeColor}>
              {stats.needsEditing} need editing
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-sm">
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total PDFs:</span>
              <span className="font-medium">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Need Editing:</span>
              <span className={`font-medium ${getStatusColor(stats.needsEditing, stats.total)}`}>
                {stats.needsEditing}
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-gray-600 text-xs">Approved:</span>
              </div>
              <span className="font-medium text-green-600">{stats.approved}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-600" />
                <span className="text-gray-600 text-xs">Pending:</span>
              </div>
              <span className="font-medium text-yellow-600">{stats.pending}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleEditPDFs}
          className="w-full"
          variant={stats.needsEditing > 0 ? "default" : "outline"}
          size="sm"
        >
          <Edit className="h-4 w-4 mr-2" />
          {stats.needsEditing > 0 ? `Edit ${stats.needsEditing} PDFs` : 'View PDF Details'}
        </Button>

        {stats.needsEditing > 0 && (
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Common issues:</strong></p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>Missing model codes</li>
              <li>Generic titles (filename as title)</li>
              <li>No category assigned</li>
              <li>Lowercase titles</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}