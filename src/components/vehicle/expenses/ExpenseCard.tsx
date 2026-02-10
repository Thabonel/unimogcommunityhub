import React from 'react';
import {
  Fuel,
  Wrench,
  Zap,
  FileText,
  Package,
  AlertTriangle,
  Home,
  Tent,
  Banknote,
  MapPin,
  Trash2,
  Edit2,
  Download,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ExpenseRecord, ExpenseCategory } from './types';

const categoryIcons: Record<ExpenseCategory, React.ReactNode> = {
  fuel: <Fuel className="h-4 w-4" />,
  maintenance: <Wrench className="h-4 w-4" />,
  repair: <AlertTriangle className="h-4 w-4" />,
  parts: <Package className="h-4 w-4" />,
  tires: <Zap className="h-4 w-4" />,
  insurance: <FileText className="h-4 w-4" />,
  registration: <FileText className="h-4 w-4" />,
  toll: <MapPin className="h-4 w-4" />,
  parking: <MapPin className="h-4 w-4" />,
  accommodation: <Home className="h-4 w-4" />,
  camping: <Tent className="h-4 w-4" />,
  equipment: <Package className="h-4 w-4" />,
  other: <Banknote className="h-4 w-4" />,
};

const categoryColors: Record<ExpenseCategory, string> = {
  fuel: 'bg-orange-100 text-orange-800',
  maintenance: 'bg-blue-100 text-blue-800',
  repair: 'bg-red-100 text-red-800',
  parts: 'bg-purple-100 text-purple-800',
  tires: 'bg-yellow-100 text-yellow-800',
  insurance: 'bg-green-100 text-green-800',
  registration: 'bg-cyan-100 text-cyan-800',
  toll: 'bg-pink-100 text-pink-800',
  parking: 'bg-pink-100 text-pink-800',
  accommodation: 'bg-indigo-100 text-indigo-800',
  camping: 'bg-emerald-100 text-emerald-800',
  equipment: 'bg-violet-100 text-violet-800',
  other: 'bg-gray-100 text-gray-800',
};

interface ExpenseCardProps {
  expense: ExpenseRecord;
  receiptCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewReceipts?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  receiptCount = 0,
  onEdit,
  onDelete,
  onViewReceipts,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const categoryLabel = expense.category
    .charAt(0)
    .toUpperCase() + expense.category.slice(1).replace(/_/g, ' ');

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={`p-2 rounded-lg ${categoryColors[expense.category]}`}
              >
                {categoryIcons[expense.category]}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">
                  {expense.description}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(expense.expense_date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-lg">
                {expense.currency} {expense.amount.toFixed(2)}
              </p>
              <Badge variant="outline" className={categoryColors[expense.category]}>
                {categoryLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {expense.notes && (
            <p className="text-sm text-muted-foreground italic">
              {expense.notes}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {receiptCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={onViewReceipts}
                className="flex-1 sm:flex-none"
              >
                <Eye className="h-3 w-3 mr-1" />
                {receiptCount} Receipt{receiptCount !== 1 ? 's' : ''}
              </Button>
            )}

            {onEdit && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="flex-1 sm:flex-none"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Edit
              </Button>
            )}

            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="text-destructive hover:text-destructive flex-1 sm:flex-none"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{expense.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">
                  {expense.currency} {expense.amount.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{categoryLabel}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {format(new Date(expense.expense_date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>

            {expense.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="text-sm">{expense.notes}</p>
              </div>
            )}

            {receiptCount > 0 && (
              <Button
                onClick={onViewReceipts}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                View Receipts
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
