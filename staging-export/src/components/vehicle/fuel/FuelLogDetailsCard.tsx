
import { useState } from 'react';
import { format } from 'date-fns';
import { Fuel, Edit, Trash2, ChevronLeft, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FuelLog } from '@/hooks/vehicle-maintenance/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface FuelLogDetailsCardProps {
  fuelLog?: FuelLog;
  vehicleName?: string;
  isLoading: boolean;
  error: Error | null;
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onBack: () => void;
}

const FuelLogDetailsCard = ({
  fuelLog,
  vehicleName,
  isLoading,
  error,
  onEdit,
  onDelete,
  onBack,
}: FuelLogDetailsCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
          <CardDescription>Retrieving fuel log details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="p-0 mb-2">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>Error</CardTitle>
          <CardDescription>Could not load fuel log details</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || 'Failed to load fuel log details'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!fuelLog) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" onClick={onBack} className="p-0 mb-2">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>Not Found</CardTitle>
          <CardDescription>Fuel log not found</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Found</AlertTitle>
            <AlertDescription>
              The requested fuel log could not be found.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button variant="ghost" onClick={onBack} className="p-0 mr-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Fuel Log Details
              </CardTitle>
              <CardDescription>
                {format(new Date(fuelLog.fill_date), 'MMMM d, yyyy')}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Basic info */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-md mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="col-span-2 font-medium">{vehicleName}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Date</span>
                    <span className="col-span-2 font-medium">
                      {format(new Date(fuelLog.fill_date), 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Odometer</span>
                    <span className="col-span-2 font-medium">{fuelLog.odometer}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Fuel Type</span>
                    <span className="col-span-2 font-medium capitalize">
                      {fuelLog.fuel_type}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Fuel Station</span>
                    <span className="col-span-2 font-medium">
                      {fuelLog.fuel_station || 'Not specified'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Full Tank</span>
                    <span className="col-span-2 font-medium">
                      {fuelLog.full_tank ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {fuelLog.notes && (
                <div>
                  <h3 className="font-medium text-md mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">{fuelLog.notes}</p>
                </div>
              )}
            </div>

            {/* Right column - Financial and calculation info */}
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-md mb-2">Cost Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Fuel Amount</span>
                    <span className="col-span-2 font-medium">
                      {fuelLog.fuel_amount.toFixed(2)} units
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Price Per Unit</span>
                    <span className="col-span-2 font-medium">
                      {formatCurrency(fuelLog.fuel_price_per_unit, fuelLog.currency)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="col-span-2 font-medium text-lg">
                      {formatCurrency(fuelLog.total_cost, fuelLog.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-md mb-2">Record Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Created</span>
                    <span className="col-span-2 font-medium">
                      {format(new Date(fuelLog.created_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="col-span-2 font-medium">
                      {format(new Date(fuelLog.updated_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Fuel Log ID: {fuelLog.id}
          </p>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this fuel log. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FuelLogDetailsCard;
