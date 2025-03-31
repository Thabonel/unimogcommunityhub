
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Wrench, Filter, Search, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { useVehicleMaintenance, MaintenanceLog, MaintenanceType } from '@/hooks/use-vehicle-maintenance';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import MaintenanceLogForm from './MaintenanceLogForm';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface MaintenanceLogListProps {
  vehicleId: string;
}

type SortField = 'date' | 'maintenance_type' | 'cost' | 'odometer';
type SortDirection = 'asc' | 'desc';

export default function MaintenanceLogList({ vehicleId }: MaintenanceLogListProps) {
  const { getMaintenanceLogs, deleteMaintenanceLog } = useVehicleMaintenance();
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingLog, setEditingLog] = useState<MaintenanceLog | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      setIsLoading(true);
      try {
        const logs = await getMaintenanceLogs(vehicleId);
        setLogs(logs);
      } catch (error) {
        console.error('Error loading maintenance logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, [vehicleId, getMaintenanceLogs]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEditClick = (log: MaintenanceLog) => {
    setEditingLog(log);
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (confirmDeleteId) {
      try {
        await deleteMaintenanceLog(confirmDeleteId);
        setLogs(logs.filter(log => log.id !== confirmDeleteId));
        setConfirmDeleteId(null);
      } catch (error) {
        console.error('Error deleting log:', error);
      }
    }
  };

  const handleLogUpdated = (updatedLog: MaintenanceLog) => {
    setLogs(logs.map(log => log.id === updatedLog.id ? updatedLog : log));
    setEditingLog(null);
  };

  const filteredLogs = logs
    .filter(log => 
      (filterType === 'all' || log.maintenance_type === filterType) &&
      (searchTerm === '' || 
        log.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.maintenance_type.includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'maintenance_type':
          comparison = a.maintenance_type.localeCompare(b.maintenance_type);
          break;
        case 'cost':
          comparison = (a.cost || 0) - (b.cost || 0);
          break;
        case 'odometer':
          comparison = a.odometer - b.odometer;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const formatMaintenanceType = (type: MaintenanceType) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('date')} className="cursor-pointer w-[150px]">
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('maintenance_type')} className="cursor-pointer">
                  <div className="flex items-center">
                    Type
                    {sortField === 'maintenance_type' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('odometer')} className="cursor-pointer">
                  <div className="flex items-center">
                    Odometer
                    {sortField === 'odometer' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort('cost')} className="cursor-pointer">
                  <div className="flex items-center">
                    Cost
                    {sortField === 'cost' && (
                      sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center">
                      <Wrench className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No maintenance logs found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatMaintenanceType(log.maintenance_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.odometer}</TableCell>
                    <TableCell>
                      {log.cost ? `$${log.cost.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {log.notes || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditClick(log)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(log.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Log Dialog */}
      <Dialog 
        open={editingLog !== null} 
        onOpenChange={(open) => !open && setEditingLog(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Maintenance Log</DialogTitle>
          </DialogHeader>
          <Separator className="my-2" />
          {editingLog && (
            <MaintenanceLogForm 
              vehicleId={vehicleId}
              existingLog={editingLog}
              onSuccess={handleLogUpdated}
              onCancel={() => setEditingLog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={confirmDeleteId !== null} 
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete this maintenance log? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
