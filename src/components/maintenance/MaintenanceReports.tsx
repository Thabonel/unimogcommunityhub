
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addMonths, isSameMonth, parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { CalendarIcon, FileText, DownloadIcon, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MaintenanceLog, useVehicleMaintenance } from '@/hooks/use-vehicle-maintenance';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MaintenanceReportsProps {
  vehicleId: string;
}

type ReportType = 'cost' | 'frequency' | 'maintenance_history';
type ReportPeriod = '3m' | '6m' | '1y' | 'all';

export default function MaintenanceReports({ vehicleId }: MaintenanceReportsProps) {
  const { getMaintenanceLogs } = useVehicleMaintenance();
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState<ReportType>('cost');
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('6m');
  const [startDate, setStartDate] = useState<Date | undefined>(subMonths(new Date(), 6));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        const data = await getMaintenanceLogs(vehicleId);
        setLogs(data);
      } catch (error) {
        console.error('Error loading maintenance logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [vehicleId, getMaintenanceLogs]);

  useEffect(() => {
    // Set date range based on selected period
    if (reportPeriod === '3m') {
      setStartDate(subMonths(new Date(), 3));
      setEndDate(new Date());
    } else if (reportPeriod === '6m') {
      setStartDate(subMonths(new Date(), 6));
      setEndDate(new Date());
    } else if (reportPeriod === '1y') {
      setStartDate(subMonths(new Date(), 12));
      setEndDate(new Date());
    } else if (reportPeriod === 'all') {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  }, [reportPeriod]);

  // Filter logs based on date range
  const filteredLogs = logs.filter(log => {
    const logDate = parseISO(log.date);
    if (!startDate && !endDate) return true;
    if (startDate && !endDate) return logDate >= startDate;
    if (!startDate && endDate) return logDate <= endDate;
    return logDate >= startDate! && logDate <= endDate!;
  });

  // Process data for cost report
  const costData = (() => {
    // Group by month
    const monthlyData: Record<string, number> = {};
    
    filteredLogs.forEach(log => {
      if (log.cost !== undefined && log.cost !== null) {
        const month = format(new Date(log.date), 'MMM yyyy');
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += log.cost;
      }
    });
    
    // Convert to array for chart
    return Object.entries(monthlyData)
      .map(([month, cost]) => ({ month, cost }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  })();

  // Process data for frequency report
  const frequencyData = (() => {
    // Group by maintenance type
    const typeData: Record<string, number> = {};
    
    filteredLogs.forEach(log => {
      const type = log.maintenance_type;
      if (!typeData[type]) {
        typeData[type] = 0;
      }
      typeData[type] += 1;
    });
    
    // Convert to array for chart
    return Object.entries(typeData)
      .map(([type, count]) => ({ 
        type: type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1), 
        count 
      }))
      .sort((a, b) => b.count - a.count);
  })();

  // Generate CSV for download
  const generateCSV = () => {
    // Headers
    const headers = [
      'Date',
      'Type',
      'Odometer',
      'Cost',
      'Currency',
      'Location',
      'Completed By',
      'Notes'
    ].join(',');
    
    // Rows
    const rows = filteredLogs.map(log => {
      // Format each field and handle commas in text fields
      const formattedDate = format(new Date(log.date), 'yyyy-MM-dd');
      const formattedType = log.maintenance_type.replace('_', ' ');
      const formattedCost = log.cost?.toString() || '';
      const formattedNotes = log.notes ? `"${log.notes.replace(/"/g, '""')}"` : '';
      const formattedLocation = log.location ? `"${log.location.replace(/"/g, '""')}"` : '';
      const formattedCompletedBy = log.completed_by ? `"${log.completed_by.replace(/"/g, '""')}"` : '';
      
      return [
        formattedDate,
        formattedType,
        log.odometer,
        formattedCost,
        log.currency,
        formattedLocation,
        formattedCompletedBy,
        formattedNotes
      ].join(',');
    });
    
    // Combine headers and rows
    return [headers, ...rows].join('\n');
  };

  const handleDownloadReport = () => {
    // Generate CSV
    const csv = generateCSV();
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Generate filename with current date
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const filename = `maintenance_report_${dateStr}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Reports</CardTitle>
          <CardDescription>
            Generate reports and visualize your vehicle's maintenance data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Report Type</label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cost">Cost Analysis</SelectItem>
                  <SelectItem value="frequency">Maintenance Frequency</SelectItem>
                  <SelectItem value="maintenance_history">Maintenance History</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Time Period</label>
              <Select 
                value={reportPeriod} 
                onValueChange={(value) => setReportPeriod(value as ReportPeriod)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="flex gap-2" 
              onClick={handleDownloadReport}
              disabled={isLoading || filteredLogs.length === 0}
            >
              <DownloadIcon className="h-4 w-4" />
              Download CSV
            </Button>
          </div>

          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="h-80 flex flex-col items-center justify-center gap-2">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No maintenance data available for the selected period</p>
            </div>
          ) : (
            <div>
              {reportType === 'cost' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Maintenance Cost Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                          <Legend />
                          <Bar dataKey="cost" name="Cost" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    
                    <div className="mt-4 text-center">
                      <p className="font-medium">
                        Total Cost: ${filteredLogs
                          .reduce((sum, log) => sum + (log.cost || 0), 0)
                          .toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {reportType === 'frequency' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Maintenance Type Frequency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={frequencyData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="type" type="category" width={120} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" name="Number of Services" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}

              {reportType === 'maintenance_history' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Maintenance History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative pl-6 mt-6">
                      {filteredLogs
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((log, index) => (
                          <div key={log.id} className="mb-8 relative">
                            {/* Timeline dot and line */}
                            <div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full bg-primary"></div>
                            {index !== filteredLogs.length - 1 && (
                              <div className="absolute -left-5 mt-3 top-0 bottom-0 w-[1px] bg-muted-foreground/30 h-full"></div>
                            )}
                            
                            {/* Content */}
                            <div className="bg-card rounded-lg border p-4">
                              <div className="flex flex-wrap justify-between gap-2 mb-2">
                                <h4 className="font-semibold">{log.maintenance_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h4>
                                <div className="text-sm text-muted-foreground">{format(new Date(log.date), 'MMM d, yyyy')}</div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                <div className="text-sm">
                                  <span className="font-medium">Odometer:</span> {log.odometer}
                                </div>
                                {log.cost !== undefined && log.cost !== null && (
                                  <div className="text-sm">
                                    <span className="font-medium">Cost:</span> {log.currency} {log.cost.toFixed(2)}
                                  </div>
                                )}
                              </div>
                              
                              {(log.completed_by || log.location) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 text-xs text-muted-foreground">
                                  {log.completed_by && (
                                    <div>Completed by: {log.completed_by}</div>
                                  )}
                                  {log.location && (
                                    <div>Location: {log.location}</div>
                                  )}
                                </div>
                              )}
                              
                              {log.notes && (
                                <div className="text-sm mt-2">
                                  <p className="text-muted-foreground">{log.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
