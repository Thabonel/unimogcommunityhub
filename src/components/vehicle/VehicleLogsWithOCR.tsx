/**
 * Enhanced Vehicle Logs Component with OCR Integration
 * Displays fuel/service logs with OCR status, filtering, and bulk actions
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreHorizontal,
  Fuel,
  Wrench,
  Receipt,
  Calendar,
  DollarSign,
  Building,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Zap
} from 'lucide-react';
import { vehicleOcrService, OcrStatus, ProcessedReceipt } from '@/services/vehicle-ocr-service';
import { OCRStatusIndicator, OCRStatusIcon } from './OCRStatusIndicator';
import { ReceiptReviewModal } from './ReceiptReviewModal';
import { format, parseISO } from 'date-fns';

interface VehicleLogsWithOCRProps {
  vehicleId: string;
  className?: string;
  onReceiptReview?: (receiptId: string) => void;
  onExportData?: (logs: VehicleLogEntry[]) => void;
}

interface VehicleLogEntry {
  id: string;
  type: 'fuel' | 'service' | 'expense';
  date: string;
  vendor: string;
  amount: number;
  description?: string;
  odometer?: number;
  // OCR-related fields
  ocrStatus: OcrStatus;
  ocrConfidence?: number;
  needsReview: boolean;
  receiptId?: string;
  receiptUrl?: string;
  extractedData?: any;
  processingErrors?: string[];
}

interface FilterOptions {
  search: string;
  type: 'all' | 'fuel' | 'service' | 'expense';
  ocrStatus: 'all' | OcrStatus;
  needsReview: 'all' | 'yes' | 'no';
  dateFrom?: string;
  dateTo?: string;
}

const mockVehicleLogs: VehicleLogEntry[] = [
  {
    id: '1',
    type: 'fuel',
    date: '2024-02-10',
    vendor: 'Shell Station',
    amount: 65.50,
    description: 'Regular unleaded - 45.5L',
    odometer: 125000,
    ocrStatus: 'completed',
    ocrConfidence: 0.95,
    needsReview: false,
    receiptId: 'rec1'
  },
  {
    id: '2',
    type: 'service',
    date: '2024-02-08',
    vendor: 'AutoService Pro',
    amount: 250.00,
    description: 'Oil change, air filter replacement',
    ocrStatus: 'needs_review',
    ocrConfidence: 0.72,
    needsReview: true,
    receiptId: 'rec2'
  },
  {
    id: '3',
    type: 'fuel',
    date: '2024-02-05',
    vendor: 'BP Station',
    amount: 58.75,
    description: 'Diesel - 42.1L',
    odometer: 124850,
    ocrStatus: 'processing',
    needsReview: false,
    receiptId: 'rec3'
  },
  {
    id: '4',
    type: 'expense',
    date: '2024-02-01',
    vendor: 'Insurance Co',
    amount: 150.00,
    description: 'Monthly premium',
    ocrStatus: 'failed',
    needsReview: true,
    receiptId: 'rec4',
    processingErrors: ['Low image quality', 'Text not readable']
  }
];

export const VehicleLogsWithOCR: React.FC<VehicleLogsWithOCRProps> = ({
  vehicleId,
  className,
  onReceiptReview,
  onExportData
}) => {
  const [logs, setLogs] = useState<VehicleLogEntry[]>(mockVehicleLogs);
  const [selectedLogs, setSelectedLogs] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    type: 'all',
    ocrStatus: 'all',
    needsReview: 'all'
  });
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReceiptForReview, setSelectedReceiptForReview] = useState<VehicleLogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load vehicle logs on mount
  useEffect(() => {
    loadVehicleLogs();
  }, [vehicleId]);

  const loadVehicleLogs = async () => {
    setIsLoading(true);
    try {
      // In real implementation, load from API/database
      // const receipts = await vehicleOcrService.getVehicleReceipts(vehicleId);
      // setLogs(transformReceiptsToLogs(receipts));

      // For now, use mock data
      setLogs(mockVehicleLogs);
    } catch (error) {
      console.error('Failed to load vehicle logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered and sorted logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          log.vendor.toLowerCase().includes(searchTerm) ||
          (log.description && log.description.toLowerCase().includes(searchTerm));
        if (!matchesSearch) return false;
      }

      if (filters.type !== 'all' && log.type !== filters.type) return false;
      if (filters.ocrStatus !== 'all' && log.ocrStatus !== filters.ocrStatus) return false;

      if (filters.needsReview !== 'all') {
        const needsReview = filters.needsReview === 'yes';
        if (log.needsReview !== needsReview) return false;
      }

      // Date filtering would go here

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [logs, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const completed = logs.filter(l => l.ocrStatus === 'completed').length;
    const needsReview = logs.filter(l => l.needsReview).length;
    const processing = logs.filter(l => l.ocrStatus === 'processing').length;
    const failed = logs.filter(l => l.ocrStatus === 'failed').length;

    const totalAmount = logs.reduce((sum, log) => sum + log.amount, 0);
    const fuelCount = logs.filter(l => l.type === 'fuel').length;
    const serviceCount = logs.filter(l => l.type === 'service').length;

    return {
      total,
      completed,
      needsReview,
      processing,
      failed,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalAmount,
      fuelCount,
      serviceCount
    };
  }, [logs]);

  const handleLogSelection = (logId: string, selected: boolean) => {
    const newSelection = new Set(selectedLogs);
    if (selected) {
      newSelection.add(logId);
    } else {
      newSelection.delete(logId);
    }
    setSelectedLogs(newSelection);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedLogs(new Set(filteredLogs.map(log => log.id)));
    } else {
      setSelectedLogs(new Set());
    }
  };

  const handleBulkReview = () => {
    const logsNeedingReview = filteredLogs.filter(
      log => selectedLogs.has(log.id) && log.needsReview
    );

    if (logsNeedingReview.length > 0) {
      setSelectedReceiptForReview(logsNeedingReview[0]);
      setReviewModalOpen(true);
    }
  };

  const handleExport = () => {
    const selectedData = filteredLogs.filter(log => selectedLogs.has(log.id));
    onExportData?.(selectedData.length > 0 ? selectedData : filteredLogs);
  };

  const openReviewModal = (log: VehicleLogEntry) => {
    setSelectedReceiptForReview(log);
    setReviewModalOpen(true);
    onReceiptReview?.(log.receiptId!);
  };

  const handleReviewSave = async (data: any) => {
    if (!selectedReceiptForReview) return;

    try {
      // Update the log with reviewed data
      setLogs(prev => prev.map(log =>
        log.id === selectedReceiptForReview.id
          ? {
              ...log,
              vendor: data.vendor,
              amount: data.total,
              description: data.notes || log.description,
              odometer: data.odometer || log.odometer,
              ocrStatus: 'completed' as OcrStatus,
              needsReview: false
            }
          : log
      ));

      // In real implementation, save to API
      // await vehicleOcrService.updateExtractedData(receiptId, extractedData);

      setReviewModalOpen(false);
      setSelectedReceiptForReview(null);
    } catch (error) {
      console.error('Failed to save review:', error);
    }
  };

  const renderStatsCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Logs</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-bold text-military-green">{stats.successRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-military-green" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Needs Review</p>
              <p className="text-2xl font-bold text-amber-600">{stats.needsReview}</p>
            </div>
            <Eye className="h-8 w-8 text-amber-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">${stats.totalAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFilters = () => (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search vendor, description..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full"
              startIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <Select
            value={filters.type}
            onValueChange={(value) => setFilters(prev => ({ ...prev, type: value as any }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="fuel">Fuel</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.ocrStatus}
            onValueChange={(value) => setFilters(prev => ({ ...prev, ocrStatus: value as any }))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="needs_review">Needs Review</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.needsReview}
            onValueChange={(value) => setFilters(prev => ({ ...prev, needsReview: value as any }))}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="yes">Needs Review</SelectItem>
              <SelectItem value="no">Reviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const renderActionBar = () => {
    const hasSelection = selectedLogs.size > 0;
    const selectedNeedReview = filteredLogs.some(
      log => selectedLogs.has(log.id) && log.needsReview
    );

    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedLogs.size === filteredLogs.length && filteredLogs.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">
                {hasSelection
                  ? `${selectedLogs.size} selected`
                  : `${filteredLogs.length} logs`
                }
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasSelection && (
                <>
                  {selectedNeedReview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkReview}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Selected
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadVehicleLogs()}
                disabled={isLoading}
              >
                <Zap className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLogEntry = (log: VehicleLogEntry) => {
    const typeConfig = {
      fuel: { icon: Fuel, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      service: { icon: Wrench, color: 'text-orange-600', bgColor: 'bg-orange-50' },
      expense: { icon: Receipt, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    };

    const config = typeConfig[log.type];
    const IconComponent = config.icon;

    return (
      <Card key={log.id} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={selectedLogs.has(log.id)}
              onCheckedChange={(checked) => handleLogSelection(log.id, !!checked)}
            />

            <div className={cn('p-3 rounded-lg', config.bgColor)}>
              <IconComponent className={cn('h-6 w-6', config.color)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{log.vendor}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(log.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <OCRStatusIcon
                    status={log.ocrStatus}
                    confidence={log.ocrConfidence}
                  />
                  <span className="text-lg font-bold">${log.amount.toFixed(2)}</span>
                </div>
              </div>

              {log.description && (
                <p className="text-sm text-muted-foreground mb-2">{log.description}</p>
              )}

              {log.odometer && (
                <p className="text-xs text-muted-foreground">
                  Odometer: {log.odometer.toLocaleString()} km
                </p>
              )}

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {log.type}
                  </Badge>
                  <OCRStatusIndicator
                    status={log.ocrStatus}
                    confidence={log.ocrConfidence}
                    size="sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {log.needsReview && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openReviewModal(log)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => openReviewModal(log)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {log.receiptUrl && (
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Receipt
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {log.processingErrors && log.processingErrors.length > 0 && (
                <Alert variant="destructive" className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Processing errors:</p>
                      <ul className="text-xs space-y-1">
                        {log.processingErrors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {renderStatsCards()}
      {renderFilters()}
      {renderActionBar()}

      <div className="space-y-4">
        {filteredLogs.length > 0 ? (
          filteredLogs.map(renderLogEntry)
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No logs found</h3>
              <p className="text-muted-foreground">
                {filters.search || filters.type !== 'all' || filters.ocrStatus !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Start by uploading some receipts to track your vehicle expenses.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Review Modal */}
      {selectedReceiptForReview && (
        <ReceiptReviewModal
          open={reviewModalOpen}
          onOpenChange={setReviewModalOpen}
          receiptId={selectedReceiptForReview.receiptId!}
          extractedData={selectedReceiptForReview.extractedData || {}}
          confidence={selectedReceiptForReview.ocrConfidence || 0}
          receiptType={selectedReceiptForReview.type}
          onSave={handleReviewSave}
          onCancel={() => {
            setReviewModalOpen(false);
            setSelectedReceiptForReview(null);
          }}
        />
      )}
    </div>
  );
};