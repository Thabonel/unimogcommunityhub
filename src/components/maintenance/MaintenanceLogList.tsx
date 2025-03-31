
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose
} from '@/components/ui/dialog';
import { 
  Pencil, 
  Trash2, 
  Search, 
  PlusCircle, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { MaintenanceLog } from '@/hooks/use-vehicle-maintenance';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';

interface MaintenanceLogListProps {
  vehicleId: string;
}

export default function MaintenanceLogList({ vehicleId }: MaintenanceLogListProps) {
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<MaintenanceLog | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('maintenance_logs')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .order('date', { ascending: false });

        if (error) throw error;
        setLogs(data as MaintenanceLog[]);
      } catch (error) {
        console.error('Error fetching maintenance logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load maintenance logs',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (vehicleId) {
      fetchLogs();
    }
  }, [vehicleId, toast]);

  const handleDeleteLog = async () => {
    if (!selectedLog) return;
    
    try {
      const { error } = await supabase
        .from('maintenance_logs')
        .delete()
        .eq('id', selectedLog.id);
        
      if (error) throw error;
      
      setLogs(logs.filter(log => log.id !== selectedLog.id));
      setIsConfirmDialogOpen(false);
      
      toast({
        title: 'Success',
        description: 'Maintenance log deleted',
      });
    } catch (error) {
      console.error('Error deleting log:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete maintenance log',
        variant: 'destructive',
      });
    }
  };

  const filteredLogs = logs.filter(log => {
    // Filter by maintenance type
    if (filterType !== 'all' && log.maintenance_type !== filterType) {
      return false;
    }
    
    // Search query in multiple fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const maintenanceTypeMatch = log.maintenance_type.toLowerCase().includes(query);
      const notesMatch = log.notes?.toLowerCase().includes(query) || false;
      const locationMatch = log.location?.toLowerCase().includes(query) || false;
      
      return maintenanceTypeMatch || notesMatch || locationMatch;
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Maintenance History</CardTitle>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search maintenance logs..." 
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="oil_change">Oil Change</SelectItem>
                <SelectItem value="tire_rotation">Tire Rotation</SelectItem>
                <SelectItem value="brake_service">Brake Service</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="modification">Modification</SelectItem>
                <SelectItem value="fluid_change">Fluid Change</SelectItem>
                <SelectItem value="filter_replacement">Filter Replacement</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border rounded-md border-dashed">
              <AlertCircle className="h-10 w-10 text-muted-foreground/60 mb-3" />
              <h3 className="text-lg font-medium mb-1">No maintenance logs found</h3>
              <p className="text-muted-foreground mb-4">
                {logs.length === 0 
                  ? "Add your first maintenance log to start tracking your vehicle's history."
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
              {logs.length === 0 && (
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Maintenance Log
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Odometer</TableHead>
                    <TableHead className="hidden sm:table-cell">Cost</TableHead>
                    <TableHead className="hidden lg:table-cell">Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {log.maintenance_type.replace('_', ' ')}
                      </TableCell>
                      <TableCell>{format(new Date(log.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{log.odometer.toLocaleString()}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {log.cost ? `${log.currency} ${log.cost.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {log.location || '-'}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button size="icon" variant="ghost">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsConfirmDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this maintenance log? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteLog}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
